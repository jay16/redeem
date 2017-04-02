fields = <<-EOF
FMEMBER
FMOBILEPHONE
FCARDID
FEMAIL
EOF

words = fields.split(/\n/).map(&:strip)
str = words.map do |word|
  "    #{word.downcase},"
end.join("\n")
puts "var #{str};"
str = words.map do |word|
  "&quot;#{word}&quot;:&quot;' + #{word.downcase} + '&quot;"
end.join(',')
puts %Q(var params = '{#{str}}';)
