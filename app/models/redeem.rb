# encoding: utf-8
require 'sinatra/activerecord'

# 礼品兑换
class Redeem < ActiveRecord::Base
  self.table_name = 'sys_model_6'

  # 字段，别名，意思
  # field0, card_number, 会员卡号
  # field1, member, 兑换人
  # field2, telphone, 电话
  # field3, amount, 兑换金额
  # field4, redeem_state, 兑换状态
  # field5, gift_name, 礼品名称
  # field6, gift_id, 礼品ID
  # field7, store_id, 门店ID
  # field8, store_name, 门店名称
  # field9, serial_number, 流水号、
  def self.extract_params(params)
    {
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
    }
  end

  def self.new_with_params(params)
    new(extract_params(params))
  end

  def update_with_params(params)
    self.update_columns(Redeem.extract_params(params))
  end

  def to_hash
    {
      id: self.id,
      card_number: self.field0,
      member: self.field1,
      telphone: self.field2,
      amount: self.field3,
      redeem_state: self.field4,
      gift_name: self.field5,
      gift_id: self.field6,
      store_id: self.field7,
      store_name: self.field8,
      serial_number: self.field9,
      created_at: self.created_at.strftime("%y-%m-%m %H:%M:%S")
    }
  end
end
