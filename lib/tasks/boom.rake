# encoding: utf-8
namespace :boom do
  def check_setting_has_key?(keystr, delimit = '.')
    parts = keystr.split(delimit)
    instance = ::Setting
    has_key = true
    while has_key & p = parts.shift
      has_key = instance.has_key?(p)
      instance = instance.send(p) if has_key
    end
    has_key
  end

  desc 'check config/setting.yaml necessary keys'
  task setting: :environment do
    {
      '管理员配置' => ['admin_nums'],
      'API 配置' => ['website.api_server'],
      'unicorn 配置' => ['unicorn.timeout', 'unicorn.worker_processes'],
      '邮件服务' => ['email.username', 'email.password'],
      'HDCRM' => ['crm.env', 'crm.development', 'crm.production']
    }.each_pair do |key, array|
      not_exist_keys = array.find_all { |key_string| !check_setting_has_key?(key_string) }
      puts %(【#{key}】缺失:\n#{not_exist_keys.join("\n")}) unless not_exist_keys.empty?
    end
  end
end
