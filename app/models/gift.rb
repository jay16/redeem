# encoding: utf-8
require 'sinatra/activerecord'

# 礼品管理
class Gift < ActiveRecord::Base
  self.table_name = 'sys_model_5'

  attr_reader :class_name
  def class_name
    @class_name || self.class.to_s.downcase
  end

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
  alias_attribute :theme_code, :field0 # 主题单号
  alias_attribute :theme_name, :field1 # 主题名称
  alias_attribute :begin_date, :field2 # 开始时间
  alias_attribute :end_date, :field3 # 结束时间
  alias_attribute :address, :field4 # 促销地点
  alias_attribute :gift_code, :field5 # 赠品代码
  alias_attribute :gift_name, :field6 # 赠品名称
  alias_attribute :count, :field7 # 赠品数量
  alias_attribute :min_amount, :field8 # 起始金额
  alias_attribute :price, :field9 # 赠品单价

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:theme_code] if params[:theme_code]
    options[:field1] = params[:theme_name] if params[:theme_name]
    options[:field2] = params[:begin_date] if params[:begin_date]
    options[:field3] = params[:end_date] if params[:end_date]
    options[:field4] = params[:address] if params[:address]
    options[:field5] = params[:gift_code] if params[:gift_code]
    options[:field6] = params[:gift_name] if params[:gift_name]
    options[:field7] = params[:count] if params[:count]
    options[:field8] = params[:min_amount] if params[:min_amount]
    options[:field9] = params[:price] if params[:price]
    options
  end

  def self.find_or_create_with_params(params)
    unless record = find_by(field5: params[:gift_code])
      record = create(extract_params(params))
    end
    record
  end

  def update_with_params(params)
    self.update_columns(self.class.extract_params(params))
  end

  def self.data_tables
    all.map(&:data_table)
  end

  def data_table
    [
      self.id,
      self.theme_code,
      self.theme_name,
      self.begin_date,
      self.end_date,
      self.address,
      self.gift_code,
      self.gift_name,
      self.count,
      self.min_amount,
      self.price,
      self.created_at.strftime("%y-%m-%m %H:%M:%S")
    ]
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
