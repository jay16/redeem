# encoding: utf-8
module API
  class V1Controller < API::ApplicationController
    set :views, ENV['VIEW_PATH']

    before do
      params[:page], params[:page_size] = (params[:page] || 0).to_i, (params[:page_size] || 15).to_i if request.request_method.downcase == 'get'
    end

    get '/echo' do
      params.to_inspect
    end

    get '/api_mapping' do
      api_authen_params([:host_ip])

      config = WebsiteConfig.fetch_api_mapping(params[:host_ip])
      respond_with_json({data: config}, 200)
    end


    # update member
    # post /api/v1/update/member/:telphone
    post '/member/:card_number' do
      options = Member.extract_params({card_number: params[:card_number]})
      puts options
      if record = Member.find_by(options)
        puts record.inspect
        record.update_with_params(params)
      else
        puts "未查询到用户 card_number=#{params[:card_number]}"
      end

      respond_with_json({status: 1, message: "更新成功"}, 200)
    end

    # create consumes at once
    # post /api/v1/consumes
    post '/consumes' do
      records = Consume.create_records(params)

      result_hash = {}
      unless records.empty?
        result_hash[:message] = "创建#{records.size}笔记录成功"
        result_hash[:status] = 1
      else
        result_hash[:message] = "创建失败"
        result_hash[:status] = 0
      end

      respond_with_json(result_hash, 201)
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

    #
    # CRUD
    #
    # create
    # post /api/v1/:model
    post '/:model' do
      record = class_get(params[:model]).find_or_create_with_params(params)

      result_hash = {}
      if record && record.valid?
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
        record.update_attributes(field12: 'delete')
      end

      respond_with_json({status: 1, message: "删除成功"}, 200)
    end

    # list
    # get /api/v1/list/:model
    get '/list/:model' do
      params[:start]  ||= 0
      params[:length] ||= 20
      data_tables = class_get(params[:model]).data_tables(params)

      respond_with_json(data_tables, 200)
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
      if wconfig = WebsiteConfig.ipad_selected_questionnaire
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
        WebsiteConfig.update_or_create_with_params(config_params)
        result_hash = {info: '配置成功', code: 200}
      end

      respond_with_json(result_hash, 200)
    end

    get '/ipad/setting' do
      questionnaires = Questionnaire.select('distinct field0, field1').map { |h| [h.field0, h.field1] }
      selected_questionnaire = WebsiteConfig.ipad_selected_questionnaire
      questionnaire_code = selected_questionnaire && selected_questionnaire.remark ? selected_questionnaire.remark : ''

      result_hash = {
        data: questionnaires,
        selected: questionnaire_code
      }
      respond_with_json(result_hash, 200)
    end

    get '/items/:model' do
      klass = class_get(params[:model])
      items = klass.offset(params[:page]*params[:page_size]).limit(params[:page_size]).order(id: :desc).map(&:to_hash)

      respond_with_paginate(klass, items, params)
    end

    #
    # images
    #
    post '/upload/images' do
      api_authen_params([:module_name])

      images = read_upload_images(params)
      respond_with_json({message: "上传成功", data: images}, 201)
    end

    protected

    def read_upload_images(params)
      image_folder = app_root_join("public/images/#{params[:module_name] || 'tkh'}")
      FileUtils.mkdir_p(image_folder) unless File.exist?(image_folder)
      params.keys.find_all { |k| k.match(/^image/) }.map do |image_key|
        form_data = params[image_key] || {}
        if form_data && (temp_file = form_data[:tempfile]) && (file_name = form_data[:filename])
          image_file_path = File.join(image_folder, "#{SecureRandom.uuid}.png")
          begin
            File.open(image_file_path, "w:utf-8") { |file| file.puts(temp_file.read.force_encoding("UTF-8")) }
          rescue => e
            puts "#{__FILE__}:#{__LINE__} #{e.message}"
          end
          File.basename(image_file_path)
        end
      end.compact
    end
  end
end
