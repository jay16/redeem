# encoding: utf-8
require 'securerandom'
require 'sinatra/activerecord'

# 会员管理
class Member < ActiveRecord::Base
  self.table_name = 'sys_model_1'

  attr_reader :class_name
  def class_name
    @class_name || self.class.to_s.downcase
  end

  # 字段，别名，意思
  # field0, name, 会员名
  # field1, telphone, 电话
  # field2, card_number, 会员卡号
  # field3, birthday, 出生日期
  # field4, address, 住址
  # field5, email, 邮箱
  # field6, sex, 性别
  # field7, married, 婚姻状态
  # field8, id_number, 身份证号
  # field9, qq, qq 号
  # field10, landline, 座机
  # field12, delete_state, 是否被删除
  alias_attribute :name, :field0 # 会员名
  alias_attribute :telphone, :field1 # 电话
  alias_attribute :card_number, :field2 # 会员卡号
  alias_attribute :birthday, :field3 # 出生日期
  alias_attribute :address, :field4 # 住址
  alias_attribute :email, :field5 # 邮箱
  alias_attribute :sex, :field6 # 性别
  alias_attribute :married, :field7 # 婚姻状态
  alias_attribute :id_number, :field8 # 身份证号
  alias_attribute :qq, :field9 # qq 号
  alias_attribute :landline, :field10 # 座机

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:name] if params[:name]
    options[:field1] = params[:telphone] if params[:telphone]
    options[:field2] = params[:card_number] if params[:card_number]
    options[:field3] = params[:birthday] if params[:birthday]
    options[:field4] = params[:address] if params[:address]
    options[:field5] = params[:email] if params[:email]
    options[:field6] = params[:sex] if params[:sex]
    options[:field7] = params[:married] if params[:married]
    options[:field8] = params[:id_number] if params[:id_number]
    options[:field9] = params[:qq] if params[:qq]
    options[:field10] = params[:landline] if params[:landline]
    options
  end

  def self.find_or_create_with_params(params)
    card_number = params[:card_number] || SecureRandom.hex(32)
    unless record = find_by(field2: card_number, field12: nil)
      record = create(extract_params(params))
    end
    record
  end

  def update_with_params(params)
    self.update_columns(self.class.extract_params(params))
  end

  def self.data_tables(params)
    respond_foramt = (params[:format] == 'json' ? :to_hash : :data_table)
    where("field12 is null").map(&respond_foramt)
  end

  def data_table
    html_tags = <<-EOF
      <a href="/view/#{self.class_name}/edit/#{self.id}" class="btn btn-primary btn-xs iframe" title="编辑">
        <i class="fa fa-pencil-square-o"></i>
      </a>
      <a style='display:none;' href="/view/#{self.class_name}/delete/#{self.id}" class="btn btn-danger btn-xs iframe" title="删除">
        <i class="fa fa-trash"></i>
      </a>
    EOF

    [
      self.id,
      self.field0,
      self.field1,
      self.field2,
      self.field3,
      self.field4,
      self.created_at.strftime("%y-%m-%d %H:%M:%S"),
      html_tags
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
