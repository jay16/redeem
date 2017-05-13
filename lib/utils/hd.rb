# encoding: utf-8
require 'oga'
require 'multi_xml'
require 'httparty'

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

        puts xml_body
        puts format("code: %s\nmessage: %s\nbody: \n%s", response.code, response.message, response.body)

        response_return = ''
        response_cookie = ''
        if response.code == 200
          document = ::Oga.parse_xml(response.body)
          document.xpath("Envelope/Body/LogInResponse").each do |res|
            response_return = res.at_xpath('return').text
            response_cookie = res.at_xpath('sClientCookie').text
          end
        end

        [response_return, response_cookie]
      end

      def stores(client_cookie, page_index, options)
        page_size = '100'
        post_command = 'QueryMallGndWeb'
        xml_params =<<-JSON
          {
             &quot;FSTORECODE&quot;:&quot;#{options[:storeCode]}&quot;,
             &quot;FPAGEINDEX&quot;:&quot;#{page_index}&quot;,
             &quot;FPAGESIZE&quot;:&quot;#{page_size}&quot;
          }
        JSON

        #
        #  `<?xml version="1.0" encoding="UTF-8"?>` 添加后会报错 `无效的 xml 声明`
        #
        xml_body =<<-XML
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
        response = ::HTTPClient.post("#{options[:server]}?op=DoClientCommand", body: xml_body, headers: header_options)
        puts format("code: %s\nmessage: %s\nbody: \n%s", response.code, response.message, response.body)


        response_return = '1'
        response_error = ''
        response_params = ''
        response_stores = []
        document = Oga.parse_xml(response.body)
        document.xpath("Envelope/Body/DoClientCommandResponse").each do |res|
          response_return = res.at_xpath('return').text
          response_error = res.at_xpath('sErrMsg').text
          response_params = res.at_xpath('sOutParams').text
        end

        if response_return == '0' && response_error.empty?
          response_hash = JSON.parse(response_params)
          if response_hash['FRESULT'].to_i == 0
            response_stores += response_hash['FDATA']
          else
            response_error = response_hash['FMSG']
          end
        end

        [response_return, response_error, response_stores]
      end
    end
  end
end
