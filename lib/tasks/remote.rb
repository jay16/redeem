
#encoding: utf-8
# encoding: utf-8
require "net/ssh"
require "net/scp"
require 'settingslogic'

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
      command = "cd %s && /bin/bash tool.sh deploy:server" % Settings.server.app_root_path
      execute!(ssh, command)
    end
  end
end
