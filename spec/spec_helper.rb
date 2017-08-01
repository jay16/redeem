# encoding: utf-8
ENV['RACK_ENV'] = 'development'
require File.expand_path '../../config/boot.rb', __FILE__
require 'capybara'
require 'capybara/dsl'
require 'capybara/rspec'
require 'capybara/poltergeist'
require 'rack/test'
require 'digest/md5'
require 'factory_girl'
require 'simplecov'

module RSpecMixin
  include Rack::Test::Methods
  include Capybara::DSL

  Capybara.app, = Rack::Builder.parse_file File.join(ENV['APP_ROOT_PATH'], 'config.ru')

  # brew install phantomjs
  Capybara.javascript_driver = :poltergeist
  Capybara.ignore_hidden_elements = false
  Capybara.register_driver :rack_test do |app|
    Capybara::RackTest::Driver.new(app, headers: { 'HTTP_USER_AGENT' => 'Capybara' })
  end

  def app; Capybara.app; end
end

RSpec.configure do |config|
  config.include RSpecMixin
  config.include FactoryGirl::Syntax::Methods
  # config.syntax = :expect

  # Use color in STDOUT
  # config.color_enabled = true
  config.color = true

  # Use color not only in STDOUT but also in pagers and files
  config.tty = true

  # Use the specified formatter
  config.formatter = :documentation # :progress, :html, :textmate

  # config.order = 'random'
end

def json_parse(body)
  JSON.parse(body).deep_symbolize_keys
end

def app_root_join(path)
  File.join(ENV['APP_ROOT_PATH'], path)
end
