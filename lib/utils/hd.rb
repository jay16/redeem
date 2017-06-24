# encoding: utf-8
require 'oga'
require 'json'
require 'multi_xml'
require 'httparty'
require 'active_support'
require 'active_support/core_ext/string'

class XMLParser < ::HTTParty::Parser
  def xml
    begin
      MultiXml.parse(body)
    rescue => e
      puts e.message
    end
  end
end
class HTTPClient
  include HTTParty
  parser XMLParser
end

module HD
  class CRM
    class << self
      def login(options = {})
        # <?xml version="1.0" encoding="UTF-8"?>
        xml_body =<<-XML.strip_heredoc
          <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns3="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <ns2:Body>
              <ns0:LogIn>
                <sOper xsi:type="ns3:string">#{options[:oper]}</sOper>
                <sStoreCode xsi:type="ns3:string">#{options[:storeCode]}</sStoreCode>
                <sWorkStation xsi:type="ns3:string">#{options[:workStation]}</sWorkStation>
                <nUserGid xsi:type="ns3:int">#{options[:userGid]}</nUserGid>
                <sUserPwd xsi:type="ns3:string">#{options[:userPwd]}</sUserPwd>
                <sClientCookie xsi:type="ns3:string"/>
              </ns0:LogIn>
            </ns2:Body>
          </SOAP-ENV:Envelope>
        XML

        header_options = {
          'Accept' => 'text/xml',
          'Accept-Charset' => 'UTF-8',
          'Content-Type' => 'text/xml'
        }
        response = ::HTTPClient.post("#{options[:server]}?op=LogIn", body: xml_body, headers: header_options)

        response_return, response_cookie = '', ''
        if response.code == 200
          document = ::Oga.parse_xml(response.body)
          document.xpath("Envelope/Body/LogInResponse").each do |res|
            response_return = res.at_xpath('return').text
            response_cookie = res.at_xpath('sClientCookie').text
          end
        end

        [response_return, response_cookie]
      end

      def store_list(page_index = 1, options = {})
        page_size = '100'
        post_command = 'QueryMallGndWeb'
        xml_params =<<-JSON
          {
             &quot;FSTORECODE&quot;:&quot;#{options[:storeCode]}&quot;,
             &quot;FPAGEINDEX&quot;:&quot;#{page_index}&quot;,
             &quot;FPAGESIZE&quot;:&quot;#{page_size}&quot;
          }
        JSON

        do_command(post_command, xml_params, options)
      end

      def do_command(post_command, xml_params, options = {}, return_type = 'xml_data')
        client_cookie = HD::CRM.read_client_cookie(options)
        #
        #  `<?xml version="1.0" encoding="UTF-8"?>` 添加后会报错 `无效的 xml 声明`
        #
        xml_body = <<-XML
          <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns3="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <ns2:Body>
              <ns0:DoClientCommand>
                <sClientCookie xsi:type="ns3:string">#{client_cookie}</sClientCookie>
                <sCommand xsi:type="ns3:string">#{post_command}</sCommand>
                <sParams xsi:type="ns3:string">#{xml_params}</sParams>
              </ns0:DoClientCommand>
            </ns2:Body>
          </SOAP-ENV:Envelope>
        XML
        header_options = {
          'Accept' => 'text/xml',
          'Accept-Charset' => 'UTF-8',
          'Content-Type' => 'text/xml'
        }
        callback_url = "#{options[:server]}?op=DoClientCommand"
        response = ::HTTPClient.post(callback_url, body: xml_body, headers: header_options)

        if return_type == 'xml_data'
          parse_callback_response_xml(response.body)
        else
          {
            callback_url: callback_url,
            method: 'post',
            headers: header_options,
            params: xml_body,
            response: {code: response.code, message: response.message, body: response.body.force_encoding("UTF-8")}
          }
        end
      end

      def read_client_cookie(options = {})
        client_cookie = nil
        if File.exist?(client_cookie_path)
          created_at, expired_at, client_cookie = File.read(client_cookie_path).split(',').map(&:strip)
          client_cookie = nil if Time.now.to_i > expired_at.to_i
        end
        client_cookie = HD::CRM.refresh_client_cookie(options) unless client_cookie
        client_cookie
      end

      def report_client_cookie
        client_cookie = nil
        if File.exist?(client_cookie_path)
          created_at, expired_at, client_cookie = File.read(client_cookie_path).split(',').map(&:strip)
          puts format("created_at: %s", Time.at(created_at.to_i))
          puts format("expired_at: %s", Time.at(expired_at.to_i))
        end
        puts (client_cookie ? "client cookie is fresh now" : "should refresh client cookie")
      end

      protected

      def parse_callback_response_xml(xml_body)
        response_return, response_error = '1', ''
        response_params, response_data = '', []
        document = Oga.parse_xml(xml_body)
        document.xpath("Envelope/Body/DoClientCommandResponse").each do |res|
          response_return = res.at_xpath('return').text
          response_error = res.at_xpath('sErrMsg').text
          response_params = res.at_xpath('sOutParams').text
        end

        if response_return == '0' && response_error.empty?
          response_hash = JSON.parse(response_params)
          if response_hash['FRESULT'].to_i == 0
            response_data += response_hash['FDATA']
          else
            response_error = response_hash['FMSG']
          end
        end
        [response_return, response_error, response_data]
      end

      def parse_json(json_string)
        ::JSON.parse(json_string)
      rescue
        json_string
      end

      def client_cookie_path
        File.join(ENV['APP_ROOT_PATH'] || Dir.pwd, "tmp/hd_client_cookie.txt")
      end

      def refresh_client_cookie(options = {})
        response_return, response_cookie = HD::CRM.login(options)
        File.open(client_cookie_path, "w+:utf-8") do |file|
          file.puts("#{Time.now.to_i},#{Time.now.to_i + 1*60*60},#{response_cookie}")
        end
        response_cookie
      end
    end
  end

  module CallbackWorker
    def hd_callback_worker(options = {}, crm_hash = {})
      puts options
      if record = options[:model].constantize.find_by(id: options[:id])
        env_hash = crm_hash.fetch(crm_hash["env"])
        env_hash.deep_symbolize_keys!

        ::Timeout::timeout(10) do
          response_hash = ::HD::CRM.do_command(record.post_command, record.post_params, env_hash, 'hash')
          record.update_with_params({post_response: JSON.dump(response_hash)})
          puts response_hash
        end
      end
    rescue Timeout::Error
      error_message = "#{__FILE__}:#{__LINE__}\noptions: #{options}\nenv: #{crm_hash}\nexceptin: 接口响应超时(10s)"
      record ? record.update_with_params({post_response: error_message}) : (puts error_message)
    rescue => e
      puts e.message
      puts e.backtrace
      error_message = "#{__FILE__}:#{__LINE__}\noptions: #{options}\nenv: #{crm_hash}\nexceptin: #{e.message}"
      record ? record.update_with_params({post_response: error_message}) : (puts error_message)
    end
  end
end

# options = {
#   server: 'http://180.169.127.188:7071/HDCRMWebService.dll/soap/IHDCRMWebService',
#   userGid: '1000245',
#   userPwd: '05EC54150206B033',
#   storeCode: '0210',
#   workStation: '172.17.104.164',
#   oper: 'HDCRM[0]'
# }
# puts HD::CRM.store_list(1, options)
