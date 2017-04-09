# encoding:utf-8
require File.expand_path '../../../spec_helper.rb', __FILE__

describe API::V1Controller do
  it 'post /api/v1/member' do
    post '/api/v1/member', {
      name: %w(张 王 李 赵).sample + %w(一 二 三 四 五 六).sample,
      telphone: '138' + %w(6 4 3 2 9 5 70).shuffle.join,
      card_number: Time.now.to_i,
      birthday: Time.now.strftime("%y-%m-%d"),
      address: "地址测试",
      sex: %w(男 女).sample,
      married: %w(未婚 已婚),
      id_number: ((0..9).to_a.shuffle * 2).join,
    }

    response_hash = json_parse(last_response.body)
    expect(response_hash[:code]).to eq(201)
  end

  it 'get /api/v1/members' do
    get '/api/v1/members'

    expect(last_response).to be_ok
    response_hash = json_parse(last_response.body)
    expect(response_hash[:code]).to eq(200)
    expect(response_hash[:data]).to be_a(Array)
  end
end
