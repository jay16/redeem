# encoding: utf-8
require 'sinatra/activerecord'

# 店铺管理
class Store < ActiveRecord::Base
  self.table_name = 'sys_model_3'

  attr_reader :class_name
  def class_name
    @class_name || self.class.to_s.downcase
  end

  # 字段，别名，意思
  # field0, gid, 店铺GID
  # field1, code, 店铺CODE
  # field2, name, 店铺名称
  alias_attribute :gid, :field0 # 店铺GID
  alias_attribute :code, :field1 # 店铺CODE
  alias_attribute :name, :field2 # 店铺名称

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:gid] if params[:gid]
    options[:field1] = params[:code] if params[:code]
    options[:field2] = params[:name] if params[:name]
    options
  end

  def self.find_or_create_with_params(params)
    unless record = find_by(field0: params[:gid])
      record = create(extract_params(params))
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
      self.field1,
      self.field2,
      self.created_at.strftime("%y-%m-%m %H:%M:%S"),
      html_tags
    ]
  end

  def to_hash
    {
      id: self.id,
      gid: self.field0,
      code: self.field1,
      name: self.field2,
      created_at: self.created_at.strftime("%y-%m-%m %H:%M:%S")
    }
  end
end
