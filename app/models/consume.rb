# encoding: utf-8
require 'sinatra/activerecord'

# 消费记录
class Consume < ActiveRecord::Base
  self.table_name = 'sys_model_2'

  attr_reader :class_name
  def class_name
    @class_name || self.class.to_s.downcase
  end

  # 字段，别名，意思
  # field0, name, 会员名称
  # field1, card_number, 会员卡号
  # field2, serial_number, 流水号
  # field3, amount, 消费金额
  # field4, store_code, 商铺代号
  # field5, store_name, 商铺名称
  # field12, delete_state, 是否被删除
  alias_attribute :name, :field0 # 会员名称
  alias_attribute :card_number, :field1 # 会员卡号
  alias_attribute :serial_number, :field2 # 流水号
  alias_attribute :amount, :field3 # 消费金额
  alias_attribute :store_code, :field4 # 商铺代号
  alias_attribute :store_name, :field5 # 商铺名称
  alias_attribute :data_source, :field6 # 数据来源：消费积分/礼品兑换

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:name] if params[:name]
    options[:field1] = params[:card_number] if params[:card_number]
    options[:field2] = params[:serial_number] if params[:serial_number]
    options[:field3] = params[:amount] if params[:amount]
    options[:field4] = params[:store_code] if params[:store_code]
    options[:field5] = params[:store_name] if params[:store_name]
    options[:field6] = params[:data_source] if params[:data_source]
    options
  end

  def self.find_or_create_with_params(params)
    # unless record = find_by(serial_number: params[:serial_number])
      record = create(extract_params(params))
    # end
    record
  end

  def update_with_params(params)
    self.update_columns(self.class.extract_params(params))
  end

  def self.data_tables(params)
    conditions = []
    conditions.push("field2 like '%#{params[:serial_number]}%'") if params[:serial_number]
    conditions.push("field4 like '%#{params[:store_code]}%'") if params[:store_code]
    conditions.push("field5 like '%#{params[:store_name]}%'") if params[:store_name]
    conditions.push("1 = 1") if conditions.empty?

    respond_foramt = (params[:format] == 'json' ? :to_hash : :data_table)
    where("(" + conditions.join(" or ") + ") and field12 is null").map(&respond_foramt)
  end

  def data_table
    html_tags = <<-EOF
      <a href="/view/#{self.class_name}/delete/#{self.id}" class="btn btn-danger btn-xs iframe" title="删除">
        <i class="fa fa-trash"></i>
      </a>
    EOF
    [
      self.id,
      self.name,
      self.serial_number,
      self.amount,
      self.store_code,
      self.store_name,
      self.data_source,
      self.created_at.strftime("%y-%m-%d %H:%M:%S")
    ]
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
      data_source: self.field6,
      created_at: self.created_at.strftime("%y-%m-%d %H:%M:%S")
    }
  end
end
