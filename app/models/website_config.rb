# encoding: utf-8
require 'sinatra/activerecord'

# 全局配置
class WConfig < ActiveRecord::Base
  self.table_name = 'sys_model_9'

  attr_reader :class_name
  def class_name
    @class_name || self.class.to_s.downcase
  end

  # 字段，别名，意思
  # field0, keyname, 键名
  # field1, description, 描述
  # field12, delete_state, 是否被删除
  # text1, content, 键值
  alias_attribute :keyname, :field0 # 键名
  alias_attribute :description, :field1 # 描述
  alias_attribute :remark, :field2 # 备注
  alias_attribute :content, :text1 # 键值

  class << self  
    def extract_params(params)
      options = {}
      options[:field0] = params[:keyname] if params[:keyname]
      options[:field1] = params[:description] if params[:description]
      options[:field2] = params[:remark] if params[:remark]
      options[:text1] = params[:content] if params[:content]
      options
    end

    def update_or_create_with_params(params)
      expected_params = extract_params(params)

      if record = find_by(field0: params[:keyname])
        record.update_columns(expected_params)
      else
        record = create(expected_params)
      end
      record
    end

    def ipad_selected_questionnaire
      find_by(field0: 'ipad-selected-questionnaire')
    end

    def fetch_api_mapping(host_ip)
      unless record = find_by(keyname: "api-mapping:#{host_ip}")
        record = find_by(keyname: "api-mapping:*")
      end

      return JSON.parse(record.content) if record
    end
  end
end
