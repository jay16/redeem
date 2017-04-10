# encoding: utf-8
class EditController < ApplicationController
  set :views, ENV['VIEW_PATH'] + '/edit'
  set :layout, :'../layouts/layout'

  get '/:model/:id' do
    @record = class_get(params[:model]).find_by(id: params[:id])

    haml :"#{params[:model]}"
  end
end
