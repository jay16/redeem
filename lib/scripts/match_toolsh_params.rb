# encoding: utf-8
#
lines = IO.readlines("tool.sh")
lines.each do |line|
  next unless m = line.match(/^\s+(.*?)\)$/)

  result = m[1].to_s
  puts "    ./tool.sh #{result}" if result != '*' && !result.include?(" ")
end
