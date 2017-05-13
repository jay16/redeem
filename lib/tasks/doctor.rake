#encoding: utf-8
namespace :doctor do
  namespace :mysql do
    task state: :environment do
      begin
        ActiveRecord::Base.establish_connection
        version = ActiveRecord::Base.connection.execute("select version();").map(&:inspect).flatten.join
        puts "mysql(#{version}) connect successfully"
      rescue Exception => e
        puts "#{File.basename(__FILE__)}:#{__LINE__} - #{e.message}"
      end
    end

    task enter_command: :environment do
      config_hash = ActiveRecord::Base.connection_config

      puts "mysql -h#{config_hash[:host]} -u#{config_hash[:username]} -p#{config_hash[:password]} #{config_hash[:database]}"
    end

    task sql_mode: :environment do
      puts ActiveRecord::Base.execute("select @@sql_mode").map(&:inspect).flatten.join
    end
  end

  namespace :os do
    task :date do
      current = `date "+%Y-%m-%d %H:%M:%S"`.strip
      time_zone = `date -R`.strip.match(/\+\d{4}/).to_s
      puts "#{time_zone == '+0800' ? '' : 'WARNGIN: '}date #{current} #{time_zone}"
    end
  end
end
