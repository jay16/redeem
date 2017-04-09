# encoding: utf-8
require 'sinatra/activerecord'

# 消费记录
class Consume < ActiveRecord::Base
  self.table_name = 'sys_model_2'

  # 字段，别名，意思
  # field0, name, 会员名称
  # field1, card_number, 会员卡号
  # field2, serial_number, 流水号
  # field3, amount, 消费金额
  # field4, store_code, 商铺代号
  # field5, store_name, 商铺名称
  def self.extract_params(params)
    {
      field0: params[:name],
      field1: params[:card_number],
      field2: params[:serial_number],
      field3: params[:amount],
      field4: params[:store_code],
      field5: params[:store_name]
    }
  end

  def self.new_with_params(params)
    new(extract_params(params))
  end

  def update_with_params(params)
    self.update_columns(Consume.extract_params(params))
  end

  def to_hash
    {
      id: self.id,
      name: self.field0,
      card_number: self.field1,
      serial_number: self.field2,
      amount: self.field3,
      store_code: self.field4,
      store_name: self.field5,
      created_at: self.created_at.strftime("%y-%m-%m %H:%M:%S")
    }
  end
end
