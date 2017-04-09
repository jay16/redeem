# encoding: utf-8
module API
  class V1Controller < API::ApplicationController

    get '/echo' do
      params.to_inspect
    end

    #
    # 会员管理
    #
    # create
    # post /api/v1/member
    post '/member' do
      member = Member.find_or_create_with_params(params)

      result_hash = {}
      if member.valid?
        result_hash[:info] = "创建成功"
        result_hash[:id] = member.id
        result_hash[:code] = 201
      else
        result_hash[:info] = "创建失败"
        result_hash[:code] = 200
      end

      respond_with_json(result_hash, result_hash[:code])
    end

    # view
    # get /api/v1/member/:id
    get '/member/:id' do
      member = Member.find_by(id: params[:id])

      respond_with_json({data: member.to_hash}, 200)
    end

    # update
    # post /api/v1/member/:id
    post '/member/:id' do
      member = Member.find_by(id: params[:id])
      member.update_with_params(params)

      respond_with_json({data: member.to_hash}, 200)
    end

    # delete
    # delete /api/v1/member/:id
    delete '/member/:id' do
      if member = Member.find_by(id: params[:id])
        member.destroy
      end

      respond_with_json({}, 200)
    end

    # list
    # get /api/v1/members
    get '/members' do
      members = Member.all.map(&:data_table)

      respond_with_json({data: members}, 200)
    end
  end
end
