# encoding: utf-8
require 'erb'

namespace :redis do
  desc '生成 Redis 配置档 - config/redis.conf'
  task generate_config: :environment do
    config_path = %(#{ENV['APP_ROOT_PATH']}/config/redis.conf)
    template_path = config_path + '.erb'
    File.open(config_path, 'w:utf-8') do |file|
      file.puts ERB.new(File.read(template_path)).result
    end
  end
end
