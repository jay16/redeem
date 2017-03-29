#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

$LOAD_PATH.unshift(File.dirname(__FILE__))


#encoding: utf-8
require "net/ssh"
require "net/scp"
require 'settingslogic'


root_path = File.dirname(File.dirname(__FILE__))
$LOAD_PATH.unshift(root_path)
task default: [:environment]

desc 'set up environment for rake'
task environment: 'Gemfile.lock' do
  ENV['RACK_ENV'] ||= 'production'

  class Settings < Settingslogic
      source "config/setting.yaml"
      namespace  ENV["RACK_ENV"] || 'production'
  end
end

desc "remote deploy application."
namespace :remote do
  def encode(data)
    data.to_s.encode('UTF-8', {:invalid => :replace, :undef => :replace, :replace => '?'})
  end
  def execute!(ssh, command)
    ssh.exec!(command) do  |ch, stream, data|
      puts "%s:\n%s" % [stream, encode(data)]
    end
  end

  desc "scp local config files to remote server."
  task :deploy => :environment do
    Net::SSH.start(Settings.server.host, Settings.server.user, :password => Settings.server.password) do |ssh|
      command = "cd %s && git reset --hard HEAD && git pull" % Settings.server.app_root_path
      execute!(ssh, command)
    end
  end
end
