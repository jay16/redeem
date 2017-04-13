# encoding: utf-8
require 'lib/utils/mail_sender'
require 'sinatra/activerecord'

# sys_model_0, User, 用户
# sys_model_1, Member, 会员
# sys_model_2, Consume, 消费记录
# sys_model_3, Store, 门店
# sys_model_4, Questionnaire, 问卷调查
# sys_model_5, Answer, 问卷回答
# sys_model_6, Redeem, 礼品兑换

# 管理员
class User < ActiveRecord::Base
  include ::Mail::Methods
  self.table_name = 'sys_model_0'

  attr_reader :class_name
  def class_name
    @class_name || self.class.to_s.downcase
  end

  # 字段，别名，意思
  # field0, name, 名称
  # field1, password, 密码
  # field2, email, 邮箱
  # field3, telphone, 手机号
  # field4, area, 区域
  alias_attribute :name, :field0 # 名称
  alias_attribute :password, :field1 # 密码
  alias_attribute :email, :field2 # 邮箱
  alias_attribute :telphone, :field3 # 手机号
  alias_attribute :area, :field4 # 区域
  alias_attribute :super_admin, :field5 # 区域

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:name] if params[:name]
    options[:field1] = params[:password] if params[:password]
    options[:field2] = params[:email] if params[:email]
    options[:field3] = params[:telphone] if params[:telphone]
    options[:field4] = params[:area] if params[:area]
    options[:field5] = 'no'
    options
  end

  def self.find_or_create_with_params(params)
    unless record = find_by(field2: params[:email])
      record = create(extract_params(params))
    end
    record
  end

  def update_with_params(params)
    self.update_columns(self.class.extract_params(params))
  end

  def self.data_tables
    where(field5: 'no').map(&:data_table)
  end

  def data_table
    html_tags = <<-EOF
      <a href="#{ENV['API_SERVER']}/view/#{self.class_name}/edit/#{self.id}" class="btn btn-primary btn-xs iframe" title="编辑">
        <i class="fa fa-pencil-square-o"></i>
      </a>
      <a href="#{ENV['API_SERVER']}/view/#{self.class_name}/delete/#{self.id}" class="btn btn-danger btn-xs iframe" title="删除">
        <i class="fa fa-trash"></i>
      </a>
    EOF

    [
      self.id,
      self.field0,
      self.field2,
      self.field4,
      self.created_at.strftime("%y-%m-%m %H:%M:%S"),
      html_tags
    ]
  end

  def to_hash
    {
      id: self.id,
      name: self.field0,
      email: self.field2,
      telphone: self.field3,
      area: self.field4,
      created_at: self.created_at.strftime("%y-%m-%m %H:%M:%S")
    }
  end

  def self.authen(params)
    authen_hash = {}
    if record = find_by(field0: params[:username], field1: params[:password])
      authen_hash[:code] = 200
      authen_hash[:info] = 'succesfully'
    else
      authen_hash[:code] = 401
      authen_hash[:info] = '用户验证失败'
    end

    authen_hash
  end

  # def deliver_reset_password_email(username, email)
  #   # from = %(【太古汇】 <#{::Setting.email.username}>)
  #   # subject = %(【太古汇】登录密码重置)
  #   # mail_body = <<-EOF.strip_mail_heredoc
  #   # EOF
  #   # res = send_email(from, [email], subject, mail_body)
  # end
end

