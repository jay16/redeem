# encoding: utf-8
source 'https://rubygems.org'

if defined? Encoding
  Encoding.default_external = Encoding::UTF_8
  Encoding.default_internal = Encoding::UTF_8
end

# ruby '2.3.0'

gem 'sinatra', '~>1.4.7'
gem 'sinatra-contrib', '~>1.4.7'
gem 'sinatra-flash', '~>0.3.0'
gem 'sinatra-logger', '~>0.1.1'
gem 'sinatra-synchrony', '~>0.4.1'
gem 'emk-sinatra-url-for', '~>0.2.1'

# orm
gem 'mysql2', '~>0.4.4'
gem 'sinatra-activerecord', '2.0.10'

# assets
gem 'json', '~>1.8.3'
gem 'haml', '~>4.0.7'
gem 'therubyracer', '~>0.12.2'

# gem 'puma', '~>3.4.0'
gem 'unicorn', '~>5.0.1'
gem 'unicorn-worker-killer', '~>0.4.4'
gem 'unicorn_metrics', '~>0.3.1', github: 'superiorlu/unicorn_metrics'

gem 'rake', '~>11.1.2'
gem 'settingslogic', '~>2.0.9'

gem 'net-ssh', '~>2.7.0'
gem 'net-scp', '~>1.2.1'

gem 'oga', '~>2.10'
gem 'httparty', '~>0.13.7'
gem 'whenever', '~>0.9.7'

gem 'sidekiq', '~>4.0.2'

# return unless `uname -s`.strip.eql?('Darwin')

group :test do
  gem 'rack-test', '~>0.6.3'
  gem 'rspec', '~>3.4.0'
  gem 'rspec-sidekiq', '~>2.2.0'
  gem 'factory_girl', '~>4.5.0'
  gem 'capybara', '~>2.6.2'
  gem 'poltergeist', '~>1.9.0'
  gem 'database_cleaner', '~>1.5.3'
  gem 'simplecov', '~>0.11.2', require: false
end
