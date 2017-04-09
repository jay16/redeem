# encoding: utf-8
require 'sinatra/activerecord'

# 礼品管理
class Gift < ActiveRecord::Base
  self.table_name = 'sys_model_5'

  # 字段，别名，意思
  # field0, theme_code, 主题单号
  # field1, theme_name, 主题名称
  # field2, begin_date, 开始时间
  # field3, end_date, 结束时间
  # field4, address, 促销地点
  # field5, gift_code, 赠品代码
  # field6, gift_name, 赠品名称
  # field7, count, 赠品数量
  # field8, min_amount, 起始金额
  # field9, price, 赠品单价
  def self.extract_params(params)
    {
      field0: params[:theme_code],
      field1: params[:theme_name],
      field2: params[:begin_date],
      field3: params[:end_date],
      field4: params[:address],
      field5: params[:gift_code],
      field6: params[:gift_name],
      field7: params[:count],
      field8: params[:min_amount],
      field9: params[:price]
    }
  end

  def self.new_with_params(params)
    new(extract_params(params))
  end

  def update_with_params(params)
    self.update_columns(Gift.extract_params(params))
  end

  def to_hash
    {
      id: self.id,
      theme_code: self.field0,
      theme_name: self.field1,
      begin_date: self.field2,
      end_date: self.field3,
      address: self.field4,
      gift_code: self.field5,
      gift_name: self.field6,
      count: self.field7,
      min_amount: self.field8,
      price: self.field9,
      created_at: self.created_at.strftime("%y-%m-%m %H:%M:%S")
    }
  end
end
