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
  # field3, rn, RN
  # field4, sync_type, 同步类型：手工同步/定时任务
  # field12, delete_state, 是否被删除
  alias_attribute :gid, :field0 # 店铺GID
  alias_attribute :code, :field1 # 店铺CODE
  alias_attribute :name, :field2 # 店铺名称
  alias_attribute :rn, :field3 # RN
  alias_attribute :sync_type, :field4 # RN

  def self.extract_params(params)
    options = {}
    options[:field0] = params[:gid] if params[:gid]
    options[:field1] = params[:code] if params[:code]
    options[:field2] = params[:name] if params[:name]
    options[:field3] = params[:rn] if params[:rn]
    options[:field4] = params[:sync_type] if params[:sync_type]
    options
  end

  def self.find_or_create_with_params(params)
    # unless record = find_by(field0: params[:gid])
      record = create(extract_params(params))
    # end
    record
  end

  def update_with_params(params)
    self.update_columns(self.class.extract_params(params))
  end

  def self.data_tables(params)
    conditions = []
    conditions.push("field0 like '%#{params[:gid]}%'") if params[:gid]
    conditions.push("field1 like '%#{params[:code]}%'") if params[:code]
    conditions.push("field2 like '%#{params[:name]}%'") if params[:name]
    conditions.push("1 = 1") if conditions.empty?

    respond_foramt = (params[:format] == 'json' ? :to_hash : :data_table)
    where("(" + conditions.join(" or ") + ") and field12 is null").map(&respond_foramt)
  end

  def data_table
    html_tags = <<-EOF
      <a href="/view/#{self.class_name}/edit/#{self.id}" class="btn btn-primary btn-xs iframe" title="编辑">
        <i class="fa fa-pencil-square-o"></i>
      </a>
      <a href="/view/#{self.class_name}/delete/#{self.id}" class="btn btn-danger btn-xs iframe" title="删除">
        <i class="fa fa-trash"></i>
      </a>
    EOF

    [
      self.gid,
      self.code,
      self.name,
      self.rn,
      self.sync_type,
      self.created_at.strftime("%y-%m-%d %H:%M:%S")
    ]
  end

  def to_hash
    {
      id: self.id,
      gid: self.gid,
      code: self.code,
      name: self.name,
      rn: self.rn,
      sync_type: self.sync_type,
      created_at: self.created_at.strftime("%y-%m-%d %H:%M:%S")
    }
  end
end
