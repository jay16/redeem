# encoding: utf-8
require 'lib/utils/sms_sender'
require 'lib/utils/template_engine_checker'
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
      '友盟推送' => ['umeng.ios.app_key', 'umeng.ios.app_master_secret', 'umeng.android.app_key', 'umeng.android.app_master_secret'],
      '极验验证' => ['geetest.captcha_id', 'geetest.private_key'],
      '美联软通' => ['sms.username', 'sms.password', 'sms.apikey'],
      '七牛存储' => ['qiniu.bucket', 'qiniu.access_key', 'qiniu.secret_key', 'qiniu.out_link'],
      '邮件发送' => ['email.username', 'email.password'],
      '异常通知' => ['notify.developer.sms', 'notify.developer.email', 'notify.configer.sms', 'notify.configer.email', 'notify.member.sms', 'notify.member.email'],
      '日志过滤' => ['action_log.white_list', 'action_log.black_list'],
      '进程管理' => ['unicorn.timeout', 'unicorn.worker_processes'],
      '进程约束' => ['thread_limit.barcode', 'thread_limit.report'],
      '系统监控' => ['system_limit.disk', 'system_limit.memory'],
      '蒲公英'   => ['pgyer.api_key', 'pgyer.shortcut']
    }.each_pair do |key, array|
      not_exist_keys = array.find_all { |key_string| !check_setting_has_key?(key_string) }
      puts %(【#{key}】缺失下述字段:\n#{not_exist_keys.join("\n")}) unless not_exist_keys.empty?
    end
  end

  BOOM_CHECK_PID       = 'boom_check'.freeze
  BOOM_CHECK_REDIS_KEY = 'boom/check/task'.freeze
  NOTIFY_DELIVER_PID       = 'notify_deliver'.freeze
  NOTIFY_DELIVER_REDIS_KEY = 'boom/notify/deliver'.freeze

  desc 'run all check process'
  task check: :environment do
    register Sinatra::Redis

    exit_when_redis_not_match(BOOM_CHECK_REDIS_KEY, 'status', 'running')
    update_redis_key_value(BOOM_CHECK_REDIS_KEY, 'status', 'running')
    generate_pid_file(BOOM_CHECK_PID)

    Rake::Task['boom:check_report'].invoke
    Rake::Task['boom:check_kpi'].invoke
    Rake::Task['boom:check_sys_tables'].invoke
    Rake::Task['boom:check_outer_link'].invoke

    delete_pid_file(BOOM_CHECK_PID)
    update_redis_key_value(BOOM_CHECK_REDIS_KEY, 'status', 'done')
  end

  desc 'send email or sms'
  task notify_deliver: :environment do
    register Sinatra::Redis

    exit_when_redis_not_match(NOTIFY_DELIVER_REDIS_KEY, 'status', 'running')
    update_redis_key_value(NOTIFY_DELIVER_REDIS_KEY, 'status', 'running')
    generate_pid_file(NOTIFY_DELIVER_PID)

    ::BangBoom.where(notify_mode: 'sms', send_state: 'wait').each do |record|
      if record.notify_level == 10
        content = %(【#{::Setting.website.title}】#{record.title}，请及时登录后台修正(#{record.id})。)
      else
        content = %(【#{::Setting.website.title}】#{record.description})
      end
      response = SMS.send(record.receivers, content)
      record.update(send_state: 'done', send_result: response)
    end

    delete_pid_file(NOTIFY_DELIVER_PID)
    update_redis_key_value(NOTIFY_DELIVER_REDIS_KEY, 'status', 'done')
  end

  desc 'check_report skip develop report which id start with 99'
  task check_report: :environment do
    checker = Template::Engine::Checker.new
    condition = %(NOT(LEFT(report_id, 2) = 99 AND LENGTH(report_id) > 2))
    booms = Report.where(condition).map do |report|
      error_count, info_list = checker.check_report(report)
      report.set_health_report(error_count, info_list)

      report.update_column(:health_value, error_count) unless report.health_value == error_count
      unless error_count.zero?
        info_text = info_list.map { |info| '- ' + info }.join("\n")
        <<-EOF.strip_heredoc + info_text
          《#{report.title}(#{report.report_id}/#{report.template_id})》
          检测到 #{error_count} 个异常：
        EOF
      end
    end.compact

    unless booms.empty?
      booms.unshift(%(扫描到#{booms.count} 支报表发现异常))
      ::BangBoom.create(
        title: booms.first,
        description: booms.join("\n"),
        notify_mode: 'sms',
        notify_level: 10,
        receivers: ::Setting.notify.configer.sms.uniq.join(',')
      )
    end
  end

  desc 'check kpi id with report'
  task check_kpi: :environment do
    checker = Template::Engine::Checker.new
    condition = %(NOT(LEFT(link, 2) = 99 AND LENGTH(link) > 2))
    booms = KpiBase.all.map do |kpi|
      error_count, info_list = checker.check_kpi(kpi)
      unless error_count.zero?
        info_text = info_list.map { |info| '- ' + info }.join("\n")
        <<-EOF.strip_heredoc + info_text
          《#{kpi.kpi_name}(#{kpi.kpi_id})》
          检测到 #{error_count} 个异常：
        EOF
      end
    end.compact

    unless booms.empty?
      booms.unshift(%(扫描到#{booms.count} 支仪表盘发现异常))
      ::BangBoom.create(
        title: booms.first,
        description: booms.join("\n"),
        notify_mode: 'sms',
        notify_level: 10,
        receivers: ::Setting.notify.configer.sms.uniq.join(',')
      )
    end
  end

  desc 'check system tables exist'
  task check_sys_tables: :environment do
    table_names = Dir.glob(%(#{Dir.pwd}/app/models/*.rb)).map do |filepath|
      content = IO.read(filepath)
      content.scan(/self\.table_name\s+=\s+['"](.*?)['"]/).flatten
    end.flatten.delete_if(&:empty?)

    connection = ActiveRecord::Base.connection
    unexist_tables = table_names - connection.data_sources

    unless unexist_tables.empty?
      text = unexist_tables.map { |t| '- ' + t }.join("\n")
      description = <<-EOF.strip_heredoc + text
        扫描到 #{unexist_tables.count} 支应用数据表不存在，请及时修复：
      EOF
      ::BangBoom.create(
        title: %(应用表被删除),
        description: description,
        notify_mode: 'sms',
        notify_level: 10,
        receivers: (::Setting.notify.developer.sms + ::Setting.notify.configer.sms).uniq.join(',')
      )
    end
  end

  def object_ids_without_role(object_type)
    RoleResource.where(obj_type: object_type).map(&:obj_id).uniq
  end

  def check_out_link_response(object_type, klass_name, type_name)
    bad_messages = []
    klass = klass_name.camelize.constantize
    object_ids_without_role(object_type).each do |id|
      record = klass.find_by(id: id)
      next if record.blank?

      if record.report_id.blank? && record.url_path.blank?
        bad_messages.push(%(#{type_name}(#{record.id}) report_id/url_path 不可同时为空))
      elsif record.url_path.present?
        begin
          params = {
            browser: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15'
          }
          response = HTTParty.get record.url_path, body: params
          response_code = response.code
        rescue => e
          puts record.inspect
          puts e.message
          # fixed: get pdf link response `bad URI(is not URI?)`
          response_code = 200
        ensure
          bad_messages.push(%(#{type_name}(#{record.id}) - #{record.url_path} 响应值: #{response_code})) if response_code != 200
        end
      end
    end
    bad_messages
  end

  desc 'check app/analyse outer link response is 200'
  task check_outer_link: :environment do
    bad_messages = []

    bad_messages << check_out_link_response(OBJ_TYPE_ANALYSE, 'Analyse', '分析')
    bad_messages << check_out_link_response(OBJ_TYPE_APP, 'App', '应用')
    bad_messages.flatten!

    unless bad_messages.empty?
      ::BangBoom.create(
        title: %(分析、应用表存在脏数据),
        description: bad_messages.join("\n"),
        notify_mode: 'sms',
        notify_level: 10,
        receivers: ::Setting.notify.configer.sms.uniq.join(',')
      )
    end
  end

  def query_last_end_time(conn)
    sql_string = 'select max(end_time) as last_end_time from procedurelog where error_msg is not null;'
    result = conn.execute(sql_string)
    result.to_a.flatten.first || Time.now.strftime('%Y-%m-%d %H:%M:%S')
  end

  desc 'mysql state'
  task mysql: :environment do
    conn = ActiveRecord::Base.connection
    booms = []

    sql_string = <<-EOF
      select concat('kill ', id, ',') as command, db, info
        from information_schema.processlist;
    EOF
    titles = %w(command db info)
    booms.push query_sql(conn, sql_string, titles).flatten.map(&:to_s).join("\n")

    `/bin/mkdir -p tmp/booms`
    temp_path = app_tmp_join('booms/procedurelog.end_time')
    last_end_time = File.exist?(temp_path) ? File.read(temp_path).strip : query_last_end_time(conn)

    sql_string = <<-EOF
      select procedure_name, error_msg
        from procedurelog
      where error_msg is not null
        and end_time > '#{last_end_time}';
    EOF

    titles = %w(procedure error)
    booms.push query_sql(conn, sql_string, titles).flatten.map(&:to_s).join("\n")
    File.open(temp_path, 'w:utf-8') { |file| file.puts query_last_end_time(conn) }

    unless booms.empty?
      ::BangBoom.create(
        title: %(分析、应用表存在脏数据),
        description: bad_messages.join("\n"),
        notify_mode: 'sms',
        notify_level: 10,
        receivers: ::Setting.notify.configer.sms.uniq.join(',')
      )
    end
  end
end
