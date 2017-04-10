# encoding: utf-8
#
def filds_to_json
  string = <<-EOF
FMEMBER
FMOBILEPHONE
FCARDID
FEMAIL
EOF

  words = string.split(/\n/).map(&:strip)
  str = words.map do |word|
    "    #{word.downcase},"
  end.join("\n")
  puts "var #{str};"
  str = words.map do |word|
    "&quot;#{word}&quot;:&quot;' + #{word.downcase} + '&quot;"
  end.join(',')
  puts %Q(var params = '{#{str}}';)
end

def if_hash
  string = <<-EOF
      field0: params[:name],
      field1: params[:telphone],
      field2: params[:card_number],
      field3: params[:birthday],
      field4: params[:address],
      field5: params[:email],
      field6: params[:sex],
      field7: params[:married],
      field8: params[:id_number],
      field9: params[:qq],
      field10: params[:landline]
  EOF

  puts "options = {}"
  string.split(",").map(&:strip).each do |line|
    id, key = line.scan(/field(\d+): params\[:(.*?)\]/).flatten
    puts "options[:field#{id}] = params[:#{key}] if params[:#{key}]"
  end
  puts "options"
end

def alias_field
  string = <<-EOF
  # field0, name, 会员名
  # field1, telphone, 电话
  # field2, card_number, 会员卡号
  # field3, birthday, 出生日期
  # field4, address, 住址
  # field5, email, 邮箱
  # field6, sex, 性别
  # field7, married, 婚姻状态
  # field8, id_number, 身份证号
  # field9, qq, qq 号
  # field10, landline, 座机
  EOF

  string.split("\n").map(&:strip).each do |line|
    field, alias_name, explain = line.sub("#", "").split(",").map(&:strip)
    puts "alias_attribute :#{alias_name}, :#{field} # #{explain}"
  end
end

alias :af :alias_field
alias :ih :if_hash
alias :ftj :filds_to_json

if ARGV.empty?
  puts "please offer method name"
  puts "- as, alias_field"
  puts "- ih, if_hash"
  puts "- ftj, filds_to_json"
else
  send(ARGV[0])
end
