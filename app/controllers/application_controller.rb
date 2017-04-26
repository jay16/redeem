# encoding: utf-8
require 'digest/md5'
require 'sinatra/decompile'
require 'sinatra/multi_route'
require 'sinatra/url_for'
require 'sinatra/activerecord'
require 'lib/sinatra/markup_plugin'

# controller: root base application
class ApplicationController < Sinatra::Base
  register Sinatra::Reloader unless ENV['RACK_ENV'].eql?('production')
  register Sinatra::MarkupPlugin
  register Sinatra::MultiRoute
  register Sinatra::Decompile
  register Sinatra::Flash

  # helpers
  helpers ApplicationHelper
  helpers Sinatra::UrlForHelper

  use AssetHandler

  set :views, ENV['VIEW_PATH']
  set :layout, :"layouts/layout"
  set :root, ENV['APP_ROOT_PATH']
  set :rack_env, ENV['RACK_ENV']
  set :logger_level, :info
  enable :sessions, :logging, :static, :method_override
  enable :dump_errors, :raise_errors, :show_exceptions unless ENV['RACK_ENV'].eql?('production')

  before do
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET'
    response.headers["P3P"] = "CP='IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT'"

    @params = params.merge(request_params || {})
    @params = @params.merge(ip: request.ip, browser: request.user_agent)
    @params.deep_symbolize_keys!

    print_format_logger
  end

  not_found do
    respond_with_json({ info: 'route not found', method: request.request_method, url: request.url }, 404)
  end

  error do
    haml :'shared/error', views: ENV['VIEW_PATH']
  end

  get '/' do
    haml :"home/index", layout: settings.layout
  end

  get '/view/:model/:action/:id' do
    klass = class_get(params[:model])

    puts params
    puts klass
    puts klass.where(id: params[:id]).to_sql
    unless @record = klass.find_by(id: params[:id])
      @record = klass.new
    end

    haml :"template/#{params[:model]}/#{params[:action]}"
  end

  get '/generate/:part/:page' do
    page_titles = {
      'admin:answer-list' => '回答列表',
      'admin:consume' => '消费管理',
      'admin:exchange' => '兑换信息管理',
      'admin:gift' => '礼品管理',
      'admin:index' => '后台首页',
      'admin:login' => '用户登录',
      'admin:manager' => '超级管理员管理',
      'admin:member' => '会员管理',
      'admin:questionnaire' => '问卷管理',
      'admin:ipad-setting' => 'iPad 设置',
      'admin:store' => '店铺管理',
      'admin:sync-gift' => '同步礼品',
      'admin:sync-questionnaire' => '同步问卷',
      'admin:sync-store' => '同步店铺',
      'admin:user' => '管理员管理',
      'admin:signature' => '签名管理',
      'ipad:complete' => '兑换完成',
      'ipad:entry' => '消费录入',
      'ipad:score-input' => '积分录入',
      'ipad:exchange' => '选择礼物',
      'ipad:questionnaire' => '问卷调查',
      'ipad:search' => '客户信息',
      'ipad:signature' => '签名兑换完成'
    }
    page_name = params[:page].split('.')[0]
    @title = page_titles.fetch("#{params[:part]}:#{page_name}", "unknown")
    erb :"generate/#{params[:part]}/#{params[:page]}", layout: :"generate/#{params[:part]}/layout/layout.html"
  end

  protected

  # global functions list
  def app_root_join(path)
    File.join(settings.root, path)
  end

  def app_tmp_join(path)
    File.join(settings.root, 'tmp', path)
  end

  def md5(something)
    Digest::MD5.hexdigest(something.to_s)
  end

  def current_user
    @current_user ||= User.find_by(user_num: request.cookies['authen'] || '')
  end

  def authenticate!
    return if request.cookies['authen']

    response.set_cookie 'path', value: request.url, path: '/', max_age: '600'
    flash[:danger] = '继续操作前请登录.'
    redirect '/login', 302
  end

  def print_format_logger
    logger.info <<-EOF.strip_heredoc
      #{request.request_method} #{request.path} for #{request.ip} at #{Time.now}
      Parameters:
        #{@params}
    EOF
  end

  def request_params(raw_body = request.body)
    body = case raw_body
    when StringIO
     raw_body.string
    when Tempfile,
     # gem#unicorn
     #     change the strtucture of REQUEST
     (defined?(Unicorn) && Unicorn::TeeInput),
     # gem#passenger is ugly!
     #     change the structure of REQUEST
     #     detail at: https://github.com/phusion/passenger/blob/master/lib/phusion_passenger/utils/tee_input.rb
     (defined?(PhusionPassenger) && PhusionPassenger::Utils::TeeInput),
     (defined?(Rack) && Rack::Lint::InputWrapper)

     raw_body.read # if body.respond_to?(:read)
    else
     raw_body.to_str
    end.to_s.strip

    JSON.parse(body) if !body.empty? && body.start_with?('{') && body.end_with?('}')
  rescue => e
    logger.error %(request_params - #{e.message})
  end

  def respond_with_json(res_hash = {}, code = 200)
    res_hash[:code] ||= code

    logger.info res_hash.to_json
    content_type 'application/json', charset: 'utf-8'
    body res_hash.to_json
    status code
  end

  def halt_with_json(hash = {}, code = 200)
    hash[:code] ||= code
    content_type :json
    halt(code, { 'Content-Type' => 'application/json;charset=utf-8' }, hash.to_json)
  end

  def set_seo_meta(title = '', meta_keywords = '', meta_description = '')
    @page_title       = title
    @meta_keywords    = meta_keywords
    @meta_description = meta_description
  end

  def cache_with_custom_defined(timestamps = [], etag_content = nil)
    return if ENV['RACK_ENV'] == 'development'

    timestamp = timestamps.compact.max
    timestamp ||= (settings.startup_time || Time.now)

    last_modified timestamp
    etag md5(etag_content || timestamp)
  end

  def read_json_guard(json_path, default_return = [])
    return default_return unless File.exist?(json_path)

    json_hash = JSON.parse(IO.read(json_path))
    return default_return unless json_hash.is_a?(Array)
    json_hash
  rescue
    File.delete(json_path) if File.exist?(json_path)
    default_return
  end

  def json_format?(content)
    ::JSON.parse(content)
    true
  rescue
    false
  end

  def class_get(table_name)
    # Object.const_get(table_name.camelize)
    table_name.to_s.camelize.constantize
  rescue
    define_model(table_name)
    class_get(table_name)
  end

  # TODO: 1. use eval, 2. check table_name exist in database
  def define_model(table_name)
    model_content = <<-EOF.strip_heredoc
      # encoding: utf-8
      require 'sinatra/activerecord'

      # model: automatic defined
      class #{table_name.to_s.camelize} < ActiveRecord::Base
          self.table_name = '#{table_name}'
      end
    EOF

    model_path = app_tmp_join(%(rb/#{table_name}.rb))
    File.open(model_path, 'w:utf-8') { |file| file.puts(model_content) }

    require model_path
  end
end
