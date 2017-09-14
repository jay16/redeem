# encoding: utf-8
module API
  # api base controller
  class ApplicationController < ::ApplicationController

    get '/' do
      'hey: why are you here?'
    end

    protected

    def api_authen_params(keys)
      halt_with_json({message: "参数不足：请提供 #{keys.join(' ,')}"}, 401) if keys.any? { |key| !params.has_key?(key) }
    end

    def respond_with_paginate(klass, data_list, params)
      total_count = klass.count

      respond_with_json({
        code: 200,
        message: "获取数据列表成功",
        current_page: params[:page],
        page_size: params[:page_size],
        total_page: (1.0*total_count/params[:page_size]).ceil,
        total_count: total_count,
        data: data_list
      })
    end
  end
end

