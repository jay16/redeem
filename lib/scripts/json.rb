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

def alias_field
  string = <<-EOF
  # field0, card_number, 会员卡号
  # field1, member, 兑换人
  # field2, telphone, 电话
  # field3, amount, 兑换金额
  # field4, redeem_state, 兑换状态
  # field5, gift_name, 礼品名称
  # field6, gift_id, 礼品ID
  # field7, store_id, 门店ID
  # field8, store_name, 门店名称
  # field9, serial_number, 流水号
  EOF

  string.split("\n").map(&:strip).each do |line|
    field, alias_name, explain = line.sub("#", "").split(",").map(&:strip)
    puts "alias_attribute :#{alias_name}, :#{field} # #{explain}"
  end
end


def post_params
  string = <<-EOF
  # field0, questionnaire_code, 问卷单号(单据号)
  # field1, questionnaire_name, 问卷名称
  # field2, subject_index, 题目序号
  # field3, subject_id, 题目ID
  # field4, subject, 题目内容
  # field5, subject_type, 题目类型
  # text1, options, 问题选项
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
