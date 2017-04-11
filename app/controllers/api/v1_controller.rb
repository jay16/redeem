# encoding: utf-8
module API
  class V1Controller < API::ApplicationController
    set :views, ENV['VIEW_PATH']

    get '/echo' do
      params.to_inspect
    end

    post '/authen' do
      result_hash = User.authen(params)
      puts result_hash
      respond_with_json(result_hash, result_hash[:code])
    end

    #
    # CRUD
    #
    # create
    # post /api/v1/:model
    post '/:model' do
      record = class_get(params[:model]).find_or_create_with_params(params)

      result_hash = {}
      if record.valid?
        result_hash[:message] = "创建成功（#{record.id}）"
        result_hash[:status] = 1
      else
        result_hash[:message] = "创建失败"
        result_hash[:status] = 0
      end

      respond_with_json(result_hash, 201)
    end

    # view
    # get /api/v1/:model/:id
    get '/item/:model/:id' do
      @record = class_get(params[:model]).find_by(id: params[:id])

      haml :"template/#{params[:model]}/view"
    end

    # update
    # post /api/v1/update/:model/:id
    post '/update/:model/:id' do
      if record = class_get(params[:model]).find_by(id: params[:id])
        puts record.inspect
        record.update_with_params(params)
      else
        puts "not find user with id = #{params[:id]}"
      end

      respond_with_json({status: 1, message: "更新成功"}, 200)
    end

    # delete
    # delete /api/v1/delete/:model/:id
    post '/delete/:model/:id' do
      if record = class_get(params[:model]).find_by(id: params[:id])
        record.destroy
      end

      respond_with_json({status: 1, message: "删除成功"}, 200)
    end

    # list
    # get /api/v1/list/:model
    get '/list/:model' do
      records = class_get(params[:model]).all.map(&:data_table)

      respond_with_json({data: records}, 200)
    end
  end
end
