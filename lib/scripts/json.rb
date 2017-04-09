# encoding: utf-8
#
def fields
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

if_hash
