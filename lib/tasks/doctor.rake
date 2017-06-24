#encoding: utf-8
require 'json'
namespace :doctor do
  namespace :data do
    task signature: :environment do
      Signature.where(text1: 'image/jsignature;base30,').each do |record|
        record.update_attributes(text1: 'image/jsignature;base30,gC_3R')
        puts "update Signature##{record.id} text1"
      end
    end

    task callback: :environment do
      Consume.where("text1 is not null and text2 is null").each do |record|
        CallbackWorker.perform_async({model: record.class.to_s, id: record.id}.to_json)
      end
      Redeem.where("text3 is not null and text4 is null").each do |record|
        CallbackWorker.perform_async({model: record.class.to_s, id: record.id}.to_json)
      end
    end
  end

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

    task commands: :environment do
      config_hash = ActiveRecord::Base.connection_config

      puts "enter:\nmysql -h#{config_hash[:host]} -u#{config_hash[:username]} -p#{config_hash[:password]} #{config_hash[:database]}"
      puts "export:\nmysqldump -h#{config_hash[:host]} -u#{config_hash[:username]} -p#{config_hash[:password]} #{config_hash[:database]} > #{config_hash[:database]}-#{Time.now.strftime('%y%m%d%H%M%S')}.sql"
      puts "import:\nmysql -h#{config_hash[:host]} -u#{config_hash[:username]} -p#{config_hash[:password]} #{config_hash[:database]} < your.sql"
      puts "copydb:\nmysqldump -h#{config_hash[:host]} -u#{config_hash[:username]} -p#{config_hash[:password]} --add-drop-table #{config_hash[:database]} | mysql -h#{config_hash[:host]} -u#{config_hash[:username]} -p#{config_hash[:password]} to_database_name"
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
