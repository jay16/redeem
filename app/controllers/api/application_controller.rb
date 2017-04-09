# encoding: utf-8
module API
  # api base controller
  class ApplicationController < ::ApplicationController

    get '/' do
      'hey: why are you here?'
    end
  end
end

