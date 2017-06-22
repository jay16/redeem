# encoding: utf-8
require 'json'
require 'timeout'
require 'lib/utils/hd'
require 'active_support'
require 'active_support/core_ext/hash'
require 'active_support/core_ext/string'

class CallbackWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform(options_string)
    options = ::JSON.parse(options_string).deep_symbolize_keys
    if record = options[:model].constantize.find_by(id: options[:id])
      crm_hash = ::JSON.parse(::Setting.crm.to_json)
      env_hash = crm_hash.fetch(crm_hash["env"])
      env_hash.deep_symbolize_keys!

      ::Timeout::timeout(10) do
        response_hash = ::HD::CRM.do_command(record.post_command, record.post_params, env_hash, 'hash')
        record.update_with_params({post_response: JSON.dump(response_hash)})
      end
    end
  rescue Timeout::Error
    error_message = "#{__FILE__}:#{__LINE__}\nparams_string: #{options_string}\nexceptin: 接口响应超时(10s)"
    record ? record.update_with_params({post_response: error_message}) : (puts error_message)
  rescue => e
    puts e.message
    puts e.backtrace
    error_message = "#{__FILE__}:#{__LINE__}\nparams_string: #{options_string}\nexceptin: #{e.message}"
    record ? record.update_with_params({post_response: error_message}) : (puts error_message)
  end
end
