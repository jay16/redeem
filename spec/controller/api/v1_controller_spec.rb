# encoding:utf-8
require File.expand_path '../../../spec_helper.rb', __FILE__

describe API::V1Controller do
  context "User" do
    it 'post /api/v1/user' do
      happy_number = (0..9).to_a.shuffle
      post '/api/v1/user', {
        name: %w(张 王 李 赵).sample + %w(一 二 三 四 五 六).sample,
        password: Digest::MD5.hexdigest(happy_number.first(6).join),
        telphone: '138' + happy_number.first(8).join,
        email: happy_number.join + '@' + happy_number.sample(3).join + '.com',
        area: %w(东 南 西 北).sample + '区'
      }

      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(201)
    end

    it 'get /api/v1/list/user' do
      get '/api/v1/list/user'

      expect(last_response).to be_ok
      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(200)
    end
  end

  context "Member" do
    it 'post /api/v1/member' do
      happy_number = (0..9).to_a.shuffle
      post '/api/v1/member', {
        name: %w(张 王 李 赵).sample + %w(一 二 三 四 五 六).sample,
        telphone: '138' + happy_number.sample(8).join,
        card_number: Time.now.to_i,
        birthday: Time.now.strftime("%y-%m-%d"),
        address: "地址测试",
        sex: %w(男 女).sample,
        married: %w(未婚 已婚),
        id_number: (happy_number.shuffle + happy_number).join,
      }

      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(201)
    end

    it 'get /api/v1/list/member' do
      get '/api/v1/list/member'

      expect(last_response).to be_ok
      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(200)
    end
  end
end
