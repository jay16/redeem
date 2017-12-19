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

def if_hash_deprecated
  string = <<-EOF
      field0: params[:card_number],
      field1: params[:member],
      field2: params[:telphone],
      field3: params[:amount],
      field4: params[:redeem_state],
      field5: params[:gift_name],
      field6: params[:gift_id],
      field7: params[:store_id],
      field8: params[:store_name],
      field9: params[:serial_number]
  EOF

  puts "options = {}"
  string.split(",").map(&:strip).each do |line|
    id, key = line.scan(/field(\d+): params\[:(.*?)\]/).flatten
    puts "options[:field#{id}] = params[:#{key}] if params[:#{key}]"
  end
  puts "options"
end

def if_hash
  string = <<-EOF
  # field0, name, 会员名称
  # field1, telphone, 会员手机号
  # field2, card_number, 会员卡号
  # field3, questionnaire_code, 问卷编号
  # field4, questionnaire_name, 问卷名称
  # field5, encode_type, 签字加密类型
  # text, signature, 签字
  EOF

  puts "options = {}"
  string.split("\n").map(&:strip).each do |line|
    field, param, other = line.sub("#", "").split(",").map(&:strip)
    puts "options[:#{field}] = params[:#{param}] if params[:#{param}]"
  end
  puts "options"
end

def alias_field
  string = <<-EOF
  # field0, keyname, 键名
  # field1, description, 描述
  # text1, content, 键值
  EOF

  string.split("\n").map(&:strip).each do |line|
    field, alias_name, explain = line.sub("#", "").split(",").map(&:strip)
    puts "alias_attribute :#{alias_name}, :#{field} # #{explain}"
  end
end


def post_params
  string = <<-EOF
  # field0, platform, 前端兑换/后台管理
  # field1, scene, 业务模块/场景
  # field2, operator_type, 用户类型
  # field3, operator_identifer, 用户标识
  # field4, action, 用户行为
  # field5, action_description1, 行为描述1
  # field6, action_description2, 行为描述2
  # field7, action_description3, 行为描述3
  # field8, exception_file_name, 异常时文件名
  # field9, exception_line_number, 异常时行号
  # field10, exception_column_number, 异常时列号
  # text1, exception, 异常内容
  EOF

  string.split("\n").map(&:strip).each do |line|
    field, alias_name, explain = line.sub("#", "").split(",").map(&:strip)
    puts "post_param['#{alias_name}'] = data[i].;"
  end
end

alias :af :alias_field
alias :ih :if_hash
alias :ftj :filds_to_json
alias :p2p :post_params

if ARGV.empty?
  puts "please offer method name"
  puts "- as, alias_field"
  puts "- ih, if_hash"
  puts "- ftj, filds_to_json"
else
  send(ARGV[0])
end
