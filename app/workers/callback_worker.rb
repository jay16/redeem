# encoding: utf-8
require 'json'
require 'timeout'
require 'lib/utils/hd'
require 'active_support'
require 'active_support/core_ext/hash'
require 'active_support/core_ext/string'

class CallbackWorker
  include Sidekiq::Worker
  include HD::CallbackWorker
  sidekiq_options retry: false

  def perform(options_string)
    options = ::JSON.parse(options_string).deep_symbolize_keys
    crm_hash = ::JSON.parse(::Setting.crm.to_json)

    hd_callback_worker(options, crm_hash)
  end
end
