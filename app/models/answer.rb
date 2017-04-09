# encoding: utf-8
require 'sinatra/activerecord'

# 问卷回答
class Answer < ActiveRecord::Base
  self.table_name = 'sys_model_5'

  # 字段，别名，意思
  # field0, questionnaire_code, 问卷单号
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
  def self.extract_params(params)
    {
      field0: params[:questionnaire_code],
      field1: params[:questionnaire_name],
      field2: params[:subject_index],
      field3: params[:subject_id],
      field4: params[:subject],
      field5: params[:subject_type],
      field6: params[:answer_id],
      field7: params[:answer],
      field8: params[:card_number],
      field9: params[:member],
      field10: params[:telphone],
      field11: params[:other_state]
    }
  end

  def self.new_with_params(params)
    new(extract_params(params))
  end

  def update_with_params(params)
    self.update_columns(Answer.extract_params(params))
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
