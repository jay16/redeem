# encoding: utf-8
require 'sinatra/activerecord'

# sys_model_0, User, 用户
# sys_model_1, Member, 会员
# sys_model_2, Consume, 消费记录
# sys_model_3, Store, 门店
# sys_model_4, Questionnaire, 问卷调查
# sys_model_5, Answer, 问卷回答
# sys_model_6, Redeem, 礼品兑换

# 用户
class User < ActiveRecord::Base
  self.table_name = 'sys_model_0'
end

