# encoding: utf-8
require 'json'
require 'sinatra/activerecord'

# 问卷回答
class Questionnaire < ActiveRecord::Base
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
  # field12, delete_state, 是否被删除
  # text1, options, 问题选项
  # text2, questionnaire_content, 整个问卷原内容
  alias_attribute :questionnaire_code, :field0 # 问卷单号(单据号)
  alias_attribute :questionnaire_name, :field1 # 问卷名称
  alias_attribute :subject_index, :field2 # 题目序号
  alias_attribute :subject_id, :field3 # 题目ID
  alias_attribute :subject, :field4 # 题目内容
  alias_attribute :subject_type, :field5 # 题目类型
  alias_attribute :options, :text1 # 问题选项
  alias_attribute :questionnaire_content, :text2 # 整个问卷原内容

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:questionnaire_code] if params[:questionnaire_code]
    options[:field1] = params[:questionnaire_name] if params[:questionnaire_name]
    options[:field2] = params[:subject_index] if params[:subject_index]
    options[:field3] = params[:subject_id] if params[:subject_id]
    options[:field4] = params[:subject] if params[:subject]
    options[:field5] = params[:subject_type] if params[:subject_type]
    options[:text1] = params[:options] if params[:options]
    options[:text2] = params[:questionnaire_content] if params[:questionnaire_content]
    options
  end

  def self.find_or_create_with_params(params)
    # unless record = find_by(serial_number: params[:serial_number])
      params[:options] = params[:options].to_json if params[:options]
      record = create(extract_params(params))
    # end
    record
  end

  def update_with_params(params)
    params[:options] = ::JSON.dump(params[:options]) if params[:options]
    self.update_columns(self.class.extract_params(params))
  end

  def options_array
    ::JSON.parse(self.options)
  rescue => e
    puts e.message
    []
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
    html_tags = <<-EOF
      <a href="/api/v1/item/#{self.class_name}/#{self.id}" class="btn btn-primary btn-xs iframe" title="查看题目信息">
        查看题目信息
      </a>
      <a href="answer-list.html?questionnaire_id=#{self.id}" class="btn btn-primary btn-xs" title="查看回答信息">
        查看回答信息
      </a>
    EOF
    [
      self.id,
      self.questionnaire_code,
      self.questionnaire_name,
      self.subject_index,
      self.subject_id,
      self.subject,
      self.subject_type,
      self.created_at.strftime("%y-%m-%d %H:%M:%S"),
      html_tags
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
      created_at: self.created_at.strftime("%y-%m-%d %H:%M:%S")
    }
  end
end
