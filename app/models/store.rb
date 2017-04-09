# encoding: utf-8
require 'sinatra/activerecord'

# 店铺管理
class Store < ActiveRecord::Base
  self.table_name = 'sys_model_3'

  # 字段，别名，意思
  # field0, gid, 店铺GID
  # field1, code, 店铺CODE
  # field2, name, 店铺名称
  def self.extract_params(params)
    {
      field0: params[:gid],
      field1: params[:code],
      field2: params[:name]
    }
  end

  def self.new_with_params(params)
    new(extract_params(params))
  end

  def update_with_params(params)
    self.update_columns(Store.extract_params(params))
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
