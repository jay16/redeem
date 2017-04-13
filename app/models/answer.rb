# encoding: utf-8
require 'sinatra/activerecord'

# 问卷回答
class Answer < ActiveRecord::Base
  self.table_name = 'sys_model_4'

  attr_reader :class_name
  def class_name
    @class_name || self.class.to_s.downcase
  end

  # 字段，别名，意思
  # field0, questionnaire_code, 问卷单号(单据号)
  # field1, questionnaire_name, 问卷名称
  # field2, subject_index, 题目序号
  # field3, subject_id, 题目ID
  # field4, subject, 题目内容
  # field5, subject_type, 题目类型
  # field6, answer_id, 选项ID
  # field7, answer, 回答内容
  # field8, card_number, 会员卡号
  # field9, member, 会员名称
  # field10, telphone, 电话号码
  # field11, other_state, 是否其他回答
  # text1, answers, 回答列表
  alias_attribute :questionnaire_code, :field0 # 问卷单号(单据号)
  alias_attribute :questionnaire_name, :field1 # 问卷名称
  alias_attribute :subject_index, :field2 # 题目序号
  alias_attribute :subject_id, :field3 # 题目ID
  alias_attribute :subject, :field4 # 题目内容
  alias_attribute :subject_type, :field5 # 题目类型
  alias_attribute :answer_id, :field6 # 选项ID
  alias_attribute :answer, :field7 # 回答内容
  alias_attribute :card_number, :field8 # 会员卡号
  alias_attribute :member, :field9 # 会员名称
  alias_attribute :telphone, :field10 # 电话号码
  alias_attribute :other_state, :field11 # 是否其他回答
  alias_attribute :answers, :text1 # 是否其他回答

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:questionnaire_code] if params[:questionnaire_code]
    options[:field1] = params[:questionnaire_name] if params[:questionnaire_name]
    options[:field2] = params[:subject_index] if params[:subject_index]
    options[:field3] = params[:subject_id] if params[:subject_id]
    options[:field4] = params[:subject] if params[:subject]
    options[:field5] = params[:subject_type] if params[:subject_type]
    options[:field6] = params[:answer_id] if params[:answer_id]
    options[:field7] = params[:answer] if params[:answer]
    options[:field8] = params[:card_number] if params[:card_number]
    options[:field9] = params[:member] if params[:member]
    options[:field10] = params[:telphone] if params[:telphone]
    options[:field11] = params[:other_state] if params[:other_state]
    options[:text1] = params[:answers] if params[:answers]
    options
  end

  def self.find_or_create_with_params(params)
    record = nil
    params.each_pair do |k, v|
      next unless v.is_a?(Hash)
      if v[:questionnaire_code]
        # unless record = find_by(serial_number: params[:serial_number])
        v[:answers] = v[:answers].to_json if v[:answers]
        record = create(extract_params(v))
      end
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
      self.member,
      self.telphone,
      self.questionnaire_code,
      self.questionnaire_name,
      self.subject_id,
      self.subject,
      self.answer,
      self.subject_type,
      self.other_state,
      self.created_at.strftime("%y-%m-%m %H:%M:%S")
    ]
  end

  def to_hash
    {
      id: self.id,
      questionnaire_code: self.field0,
      questionnaire_name: self.field1,
      subject_index: self.field2,
      subject_id: self.field3,
      subject: self.field4,
      subject_type: self.field5,
      answer_id: self.field6,
      answer: self.field7,
      card_number: self.field8,
      member: self.field9,
      telphone: self.field10,
      other_state: self.field11,
      created_at: self.created_at.strftime("%y-%m-%m %H:%M:%S")
    }
  end
end
