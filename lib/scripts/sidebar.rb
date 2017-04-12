# encoding: utf-8
#

content = File.read("admin/manager.html")
puts content
puts content.scan(/MAINSIDEBAR-->\n(.*)</)
