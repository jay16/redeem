# encoding: utf-8
require 'json'
require 'httparty'
require 'lib/utils/hd.rb'
require 'active_support'
require 'active_support/core_ext/hash'

namespace :hd do
  namespace :crm do
    def local_api_server
      unicorn_port = File.read(File.join(ENV['APP_ROOT_PATH'], '.unicorn-port')).strip
      "http://0.0.0.0:#{unicorn_port}"
    end

    def truncate_table_store
      api_path = "#{local_api_server}/api/v1/truncate/store"
      HTTParty.post(api_path)
    end

    def post_create_stores(stores)
      api_path = "#{local_api_server}/api/v1/store"

      stores.each do |store|
        post_params = {
          gid: store['GNDGID'],
          code: store['GNDCODE'],
          name: store['GNDNAME'],
          rn: store['RN'],
          sync_type: '定时任务'
        }
        response = HTTParty.post(api_path, body: post_params.to_json)
        puts "post #{store['GNDNAME']}(#{store['GNDCODE']}) #{response.code}"
      end
    end

    task sync_stores: :environment do
      crm_hash = JSON.parse(Setting.crm.to_json)
      env_hash = crm_hash.fetch(crm_hash["env"])
      env_hash.deep_symbolize_keys!

      response_return, response_cookie = HD::CRM.login(env_hash)
      if response_return == 'true' && response_cookie.length > 0
        stores = []
        page_index = 1
        response_return, response_error, response_stores = HD::CRM.stores(response_cookie, page_index, env_hash)
        stores += response_stores
        page_index += 1
        while response_return == '0' && response_stores.length > 0
          response_return, response_error, response_stores = HD::CRM.stores(response_cookie, page_index, env_hash)
          stores += response_stores
          page_index += 1
        end
        puts stores.length

        truncate_table_store
        post_create_stores(stores)
      end
    end
  end
end
