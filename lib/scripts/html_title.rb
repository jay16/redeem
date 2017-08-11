lines = <<-EOF
admin/answer-list.html:9:<title>礼品管理::管理系统</title>
admin/consumer.html:9:<title>店铺管理::管理系统</title>
admin/exchange.html:9:<title>兑换信息管理::管理系统</title>
admin/gift.html:9:<title>礼品管理::管理系统</title>
admin/index.html:9:<title>后台首页::管理系统</title>
admin/login.html:9:<title>用户登录::系统</title>
admin/manager.html:12:<title>超级管理员管理::管理系统</title>
admin/member.html:9:<title>会员管理::管理系统</title>
admin/questionnaire.html:11:<title>问卷管理::管理系统</title>
admin/store.html:8:<title>店铺管理::管理系统</title>
admin/sync-gift.html:8:<title>店铺管理::管理系统</title>
admin/sync-questionnaire.html:8:<title>店铺管理::管理系统</title>
admin/sync-store.html:8:<title>店铺管理::管理系统</title>
admin/user.html:12:<title>管理员管理::管理系统</title>
EOF

lines.split(/\n/).each do |line|
  page, title = line.scan(/admin\/(.*?)\.html\:\d+\:<title>(.*?)<\/title>/).flatten
  puts "'#{page}' => '#{title.split('::')[0]}',"
end
