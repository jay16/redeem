# encoding: utf-8
require 'sinatra/activerecord'

# 消费记录(积分)，仅在后台管理时过滤积分的消费使用
class ConsumeScore < ActiveRecord::Base
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
  alias_attribute :fbillnum, :field7 # 积分单号
  alias_attribute :fscore, :field8 # 积分分值
  alias_attribute :images, :text1 # 消费清单的图片，多张以逗号分隔

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:name] if params[:name]
    options[:field1] = params[:card_number] if params[:card_number]
    options[:field2] = params[:serial_number] if params[:serial_number]
    options[:field3] = params[:amount] if params[:amount]
    options[:field4] = params[:store_code] if params[:store_code]
    options[:field5] = params[:store_name] if params[:store_name]
    options[:field6] = params[:data_source] if params[:data_source]
    options[:field7] = params[:fbillnum] if params[:fbillnum]
    options[:field8] = params[:fscore] if params[:fscore]
    options[:text1]  = params[:images] if params[:images]
    options
  end

  def self.find_or_create_with_params(params)
    # unless record = find_by(serial_number: params[:serial_number])
      record = create(extract_params(params))
    # end
    record
  end

  def self.create_records(options)
    (options[:data] || []).map do |params|
      if record = create(extract_params(params))
        record
      end
    end.flatten
  end

  def update_with_params(params)
    self.update_columns(self.class.extract_params(params))
  end

  def self.data_tables(params)
    conditions = []
    conditions.push("field7 like '%#{params[:fbillnum]}%'") if params[:fbillnum]
    conditions.push("field0 like '%#{params[:name]}%'") if params[:name]
    conditions.push("1 = 1") if conditions.empty?

    if params[:format] == 'json'
      where("(" + conditions.join(" or ") + ") and field7 is not null and field12 is null")
      .map(&:to_hash)
    else
      puts where("(" + conditions.join(" or ") + ") and field7 is not null and field12 is null").to_sql
      select('distinct field0, field7, field8, text1')
      .where("(" + conditions.join(" or ") + ") and field7 is not null and field12 is null")
      .map(&:data_table)
    end
  end


  def data_table
    html_tags = <<-EOF
      <a href="javascript:void(0);" data-images="#{self.images}" class="btn btn-primary btn-xs iframe" title="查看图片">
        查看图片
      </a>
    EOF
    [
      self.fbillnum,
      self.name,
      self.fscore,
      html_tags
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
      fbillnum: self.field7,
      fscore: self.field8,
      images: self.text1,
      created_at: self.created_at.strftime("%y-%m-%d %H:%M:%S")
    }
  end
end
