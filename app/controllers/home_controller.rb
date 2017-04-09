# encoding: utf-8
# root page
class HomeController < ApplicationController
  set :views, ENV['VIEW_PATH'] + '/home'
  set :layout, :'../layouts/layout'

  get '/' do
    haml :index, layout: settings.layout
  end
end
