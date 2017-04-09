# encoding: utf-8
require 'sinatra/activerecord'

# 问卷调查
class Questionnaire < ActiveRecord::Base
  self.table_name = 'sys_model_4'

  # 字段，别名，意思
  # field0, name, 会员名
  # field1, telphone, 电话
  # field2, case_number, 会员卡号
  # field3, birthday, 出生日期
  # field4, address, 住址
  # field5, email, 邮箱
  # field6, sex, 性别
  # field7, married, 婚姻状态
  # field8, id_number, 身份证号
  # field9, qq, qq 号
  # field10, landline, 座机
  def self.extract_params(params)
    {
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
    }
  end

  def self.new_with_params(params)
    new(extract_params(params))
  end

  def update_with_params(params)
    self.update_columns(Questionnaire.extract_params(params))
  end

  def to_hash
    {
      id: self.id,
      name: self.field0,
      telphone: self.field1,
      card_number: self.field2,
      birthday: self.field3,
      address: self.field4,
      email: self.field5,
      sex: self.field6,
      married: self.field7,
      id_number: self.field8,
      qq: self.field9,
      landline: self.field10,
      created_at: self.created_at.strftime("%y-%m-%m %H:%M:%S")
    }
  end
end
