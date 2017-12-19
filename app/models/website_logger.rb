# encoding: utf-8
require 'sinatra/activerecord'

# 全局日志记录
class WLogger < ActiveRecord::Base
  self.table_name = 'sys_model_10'

  attr_reader :class_name
  def class_name
    @class_name || self.class.to_s.downcase
  end

  # 字段，别名，意思
  # field0, platform, 前端兑换/后台管理
  # field1, scene, 业务模块/场景
  # field2, operator_type, 用户类型
  # field3, operator_identifer, 用户标识
  # field4, action, 用户行为
  # field5, action_description1, 行为描述1
  # field6, action_description2, 行为描述2
  # field7, action_description3, 行为描述3
  # field8, exception_file_name, 异常时文件名
  # field9, exception_line_number, 异常时行号
  # field10, exception_column_number, 异常时列号
  # text1, exception, 异常内容
  alias_attribute :platform, :field0 # 键名
  alias_attribute :keyname, :field1 # 键名
  alias_attribute :keyname, :field0 # 键名
  alias_attribute :keyname, :field0 # 键名
  alias_attribute :keyname, :field0 # 键名
  alias_attribute :keyname, :field0 # 键名
  alias_attribute :keyname, :field0 # 键名
  alias_attribute :keyname, :field0 # 键名

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:platform] if params[:platform]
    options[:field1] = params[:scene] if params[:scene]
    options[:field2] = params[:operator_type] if params[:operator_type]
    options[:field3] = params[:operator_identifer] if params[:operator_identifer]
    options[:field4] = params[:action] if params[:action]
    options[:field5] = params[:action_description1] if params[:action_description1]
    options[:field6] = params[:action_description2] if params[:action_description2]
    options[:field7] = params[:action_description3] if params[:action_description3]
    options[:field8] = params[:exception_file_name] if params[:exception_file_name]
    options[:field9] = params[:exception_line_number] if params[:exception_line_number]
    options[:field10] = params[:exception_column_number] if params[:exception_column_number]
    options[:text1] = params[:exception] if params[:exception]
    options
  end

  def self.find_or_create_with_params(params)
     create(extract_params(params))
  end


  def self.data_tables(params)
    respond_foramt = (params[:format] == 'json' ? :to_hash : :data_table)
    records = where("field12 is null").order(id: :desc)
      
    total_count = records.count
    page_records = records.offset(params[:start]).limit(params[:length])
    
    {
      draw: params[:draw] || 'nil',
      recordsTotal: total_count,
      recordsFiltered: total_count,
      data: page_records.map(&respond_foramt)
    }
  end

  def data_table
    [
      self.field0,
      self.field1,
      self.field2,
      self.field3,
      self.field4,
      self.field8,
      self.field9,
      self.text1,
      self.created_at.strftime("%y-%m-%d %H:%M:%S")
    ]
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
      created_at: self.created_at.strftime("%y-%m-%d %H:%M:%S")
    }
  end
end
