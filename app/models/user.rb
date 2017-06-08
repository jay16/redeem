# encoding: utf-8
require 'json'
require 'lib/utils/mail_sender'
require 'sinatra/activerecord'

# sys_model_0, User, 用户
# sys_model_1, Member, 会员
# sys_model_2, Consume, 消费记录
# sys_model_3, Store, 门店
# sys_model_4, Questionnaire, 问卷调查
# sys_model_5, Answer, 问卷回答
# sys_model_6, Redeem, 礼品兑换
# sys_model_7, Gift, 礼品列表
# sys_model_8, Signautre, 签字
# sys_model_9, WConfig, 全局配置

# 管理员
class User < ActiveRecord::Base
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
  # field12, delete_state, 是否被删除
  # text1, send_email_satus, 忘记密码
  alias_attribute :name, :field0 # 名称
  alias_attribute :password, :field1 # 密码
  alias_attribute :email, :field2 # 邮箱
  alias_attribute :telphone, :field3 # 手机号
  alias_attribute :area, :field4 # 区域
  alias_attribute :super_admin, :field5 # 区域
  alias_attribute :send_email_status, :text1 # 忘记密码

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
    unless record = find_by(field2: params[:email], field12: nil)
      record = create(extract_params(params))
    end
    record
  end

  def update_with_params(params)
    self.update_columns(self.class.extract_params(params))
  end

  def self.data_tables(params)
    respond_foramt = (params[:format] == 'json' ? :to_hash : :data_table)
    where("field5 = 'no' and field12 is null").map(&respond_foramt)
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
      self.field2,
      self.field4,
      self.created_at.strftime("%y-%m-%d %H:%M:%S"),
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
      created_at: self.created_at.strftime("%y-%m-%d %H:%M:%S")
    }
  end

  class << self
    include ::Mail::Methods

    def authen(params)
      authen_hash = {}
      if record = find_by(field0: params[:username], field12: nil)
        puts "#{record.password};#{record.field1},#{params[:password]}"
        if record.password == params[:password]
          authen_hash[:code] = 200
          authen_hash[:info] = 'succesfully'
        else
          authen_hash[:code] = 201
          authen_hash[:info] = '用户密码错误'
        end
      else
        authen_hash[:code] = 201
        authen_hash[:info] = '用户不存在'
      end

      authen_hash
    end

    def reset_password(params)
      result_hash = {}
      if record = find_by(field0: params[:username], field1: params[:password])
        record.update_columns({field1: params[:new_password]})

        result_hash[:code] = 201
        result_hash[:info] = '密码更新成功'
      else
        result_hash[:code] = 200
        result_hash[:info] = '用户名或密码错误'
      end

      result_hash
    end

    def forget_password(params)
      result_hash = {}
      if record = find_by(field2: params[:email])
        new_password = (0..9).to_a.shuffle.sample(6).join
        send_result = self.deliver_reset_password_email(params[:email], record.name, new_password);
        send_result[:executed_at] = Time.now.strftime('%Y-%m-%d %H:%M:%S')
        record.update_columns({field1: new_password, text1: send_result.to_json})

        if send_result[:status] == '250'
          result_hash[:code] = 201
          result_hash[:info] = '请查收邮件接收新登录密码'
        else
          result_hash[:code] = 200
          result_hash[:info] = send_result[:string]
        end
      else
        result_hash[:code] = 200
        result_hash[:info] = "用户验证失败，#{params[:email]} 未注册"
      end

      result_hash
    end

    def deliver_reset_password_email(email, username, new_password)
      from = %(【太古汇】 <#{::Setting.email.username}>)
      subject = %(【太古汇】登录密码重置)
      mail_body = <<-EOF.strip_mail_heredoc
      #{username} 您好，
      重置后的登录密码是：#{new_password}，请登录后在侧边栏设置为自己熟悉的新密码。
      EOF
      res = send_email(from, [email], subject, mail_body)
      {status: res.status, string: res.string}
    rescue => e
      {status: 500, string: e.message}
    end
  end
end

