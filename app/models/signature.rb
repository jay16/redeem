# encoding: utf-8
require 'sinatra/activerecord'

# 签名管理
class Signature < ActiveRecord::Base
  self.table_name = 'sys_model_8'

  attr_reader :class_name
  def class_name
    @class_name || self.class.to_s.downcase
  end

  # 字段，别名，意思
  # field0, member, 会员名称
  # field1, telphone, 会员手机号
  # field2, card_number, 会员卡号
  # field3, questionnaire_code, 问卷编号
  # field4, questionnaire_name, 问卷名称
  # field5, encode_type, 签字加密类型
  # text, signature, 签字
  alias_attribute :member, :field0 # 会员名称
  alias_attribute :telphone, :field1 # 会员手机号
  alias_attribute :card_number, :field2 # 会员卡号
  alias_attribute :questionnaire_code, :field3 # 问卷编号
  alias_attribute :questionnaire_name, :field4 # 问卷名称
  alias_attribute :encoded_type, :field5 # 签字加密类型
  alias_attribute :signature, :text1 # 签字

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:member] if params[:member]
    options[:field1] = params[:telphone] if params[:telphone]
    options[:field2] = params[:card_number] if params[:card_number]
    options[:field3] = params[:questionnaire_code] if params[:questionnaire_code]
    options[:field4] = params[:questionnaire_name] if params[:questionnaire_name]
    options[:field5] = params[:encoded_type] if params[:encoded_type]
    options[:text1]  = params[:signature] if params[:signature]
    options
  end

  def self.find_or_create_with_params(params)
    create(extract_params(params))
  end

  def update_with_params(params)
    self.update_columns(self.class.extract_params(params))
  end

  def self.data_tables(params)
    conditions = []
    conditions.push("field0 like '%#{params[:member]}%'") if params[:member]
    conditions.push("field1 like '%#{params[:telphone]}%'") if params[:telphone]
    conditions.push("field3 like '%#{params[:questionnaire_code]}%'") if params[:questionnaire_code]
    conditions.push("field4 like '%#{params[:questionnaire_name]}%'") if params[:questionnaire_name]
    conditions.push("1 = 1") if conditions.empty?

    respond_foramt = (params[:format] == 'json' ? :to_hash : :data_table)
    where(conditions.join(" or ")).map(&respond_foramt)
  end

  def data_table
    html_tags = <<-EOF
      <a href="javascript:void(0);" data-signature="#{self.signature}" class="btn btn-primary btn-xs iframe" title="查看题目信息">
        查看签名
      </a>
    EOF
    [
      self.id,
      self.member,
      self.telphone,
      self.questionnaire_name,
      self.questionnaire_code,
      self.created_at.strftime("%y-%m-%d %H:%M:%S"),
      html_tags
    ]
  end

  def to_hash
    {
      id: self.id,
      member: self.member,
      telphone: self.telphone,
      questionnaire_name: self.questionnaire_name,
      questionnaire_code: self.questionnaire_code,
      created_at: self.created_at.strftime("%y-%m-%d %H:%M:%S")
    }
  end
end
