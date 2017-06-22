# encoding: utf-8
module API
  class V1Controller < API::ApplicationController
    set :views, ENV['VIEW_PATH']

    get '/echo' do
      params.to_inspect
    end

    #
    # authentication
    #
    post '/authen/login' do
      result_hash = User.authen(params)

      respond_with_json(result_hash, result_hash[:code])
    end

    post '/reset_password' do
      result_hash = User.reset_password(params)

      respond_with_json(result_hash, result_hash[:code])
    end

    post '/forget_password' do
      result_hash = User.forget_password(params)

      respond_with_json(result_hash, result_hash[:code])
    end

    post '/consumes' do
      response_hash = {errors: [], code: 201}
      (params[:data] || {}).each_pair do |k, v|
        begin
          Consume.find_or_create_with_params(v);
        rescue => e
          response_hash[:errors] << e.message
          response_hash[:code] << 500
        end
      end

      response_hash[:message] = response_hash[:errors].empty? ? "创建成功" : response_hash[:errors].uniq.join(",")
      respond_with_json(response_hash, response_hash[:code])
    end

    #
    # CRUD
    #
    # create
    # post /api/v1/:model
    post '/:model' do
      begin
        record = class_get(params[:model]).find_or_create_with_params(params)
        response_hash = {}
      rescue => e
        response_hash[:message] = e.message
      end

      if record && record.valid?
        response_hash[:message] = "创建成功（#{record.id}）"
        response_hash[:code] = 201
      else
        response_hash[:message] ||= "创建失败"
        response_hash[:code] = 500
      end

      respond_with_json(response_hash, response_hash[:code])
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
        record.update_attributes(field12: 'delete')
      end

      respond_with_json({status: 1, message: "删除成功"}, 200)
    end

    # list
    # get /api/v1/list/:model
    get '/list/:model' do
      records = class_get(params[:model]).data_tables(params)

      respond_with_json({data: records}, 200)
    end

    # truncate
    # post /api/v1/truncate/:model
    post '/truncate/:model' do
      begin
        klass = class_get(params[:model])
        ActiveRecord::Base.connection.execute("TRUNCATE #{klass.table_name}")
      rescue => e
        puts params
        puts e.message
      end

      respond_with_json({}, 200)
    end

    #
    # ipad selected questionnaire
    #
    get '/ipad/questionnaire' do
      result_hash = {info: '后台未指定问卷', code: 404}
      if wconfig = WConfig.ipad_selected_questionnaire
        result_hash = {data: wconfig.content, code: 200}
      end

      respond_with_json(result_hash, 200)
    end

    post '/ipad/setting' do
      result_hash = {info: '配置失败，未找到指定的问卷', code: 404}
      if questionnaire = Questionnaire.find_by(field0: params[:questionnaire_code])
        config_params = {
          keyname: 'ipad-selected-questionnaire',
          content: questionnaire.questionnaire_content,
          remark: params[:questionnaire_code]
        }
        WConfig.update_or_create_with_params(config_params)
        result_hash = {info: '配置成功', code: 200}
      end

      respond_with_json(result_hash, 200)
    end

    get '/ipad/setting' do
      questionnaires = Questionnaire.select('distinct field0, field1').map { |h| [h.field0, h.field1] }
      selected_questionnaire = WConfig.ipad_selected_questionnaire
      questionnaire_code = selected_questionnaire && selected_questionnaire.remark ? selected_questionnaire.remark : ''

      result_hash = {
        data: questionnaires,
        selected: questionnaire_code
      }
      respond_with_json(result_hash, 200)
    end

    post '/ipad/setting' do
    end
  end
end
