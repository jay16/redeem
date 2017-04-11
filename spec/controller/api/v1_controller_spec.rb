# encoding:utf-8
require File.expand_path '../../../spec_helper.rb', __FILE__

describe API::V1Controller do
  context "User" do
    it 'post /api/v1/user' do
      happy_number = (0..9).to_a.shuffle
      post '/api/v1/user', {
        name: %w(张 王 李 赵).sample + %w(一 二 三 四 五 六).sample,
        password: happy_number.first(6).join, #Digest::MD5.hexdigest(
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

  context "Store" do
    it 'post /api/v1/store' do
      happy_number = (0..9).to_a.shuffle
      post '/api/v1/store', {
        gid: Time.now.to_i.to_s + (0..9).to_a.shuffle.join,
        code: (0..9).to_a.shuffle.join,
        name: SecureRandom.hex(6)
      }

      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(201)
    end

    it 'get /api/v1/list/store' do
      get '/api/v1/list/store'

      expect(last_response).to be_ok
      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(200)
    end
  end

  context "Gift" do
    it 'post /api/v1/gift' do
      happy_number = (0..9).to_a.shuffle

      post '/api/v1/gift', {
        theme_code: Time.now.to_i,
        theme_name: "活动#{Time.now.to_i}",
        begin_date: (Time.now - 10 * 24 * 60 * 60).strftime("%y-%m-%d %H:%M:%S"),
        end_date: (Time.now + 10 * 24 * 60 * 60).strftime("%y-%m-%d %H:%M:%S"),
        address: "shanghai",
        gift_code: Time.now.to_i,
        gift_name: "礼品#{Time.now.to_i}",
        count: rand(100),
        min_amount: rand(500),
        price: rand(1000)
      }

      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(201)
    end

    it 'get /api/v1/list/gift' do
      get '/api/v1/list/gift'

      expect(last_response).to be_ok
      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(200)
    end
  end

  context "Consume" do
    it 'post /api/v1/consume' do
      happy_number = (0..9).to_a.shuffle

      post '/api/v1/consume', {
        name: "会员#{rand(100)}",
        card_number: "card-number-spec",
        serial_number: Time.now.to_i,
        amount: rand(10000),
        store_code: rand(100000000),
        store_name: "门店#{rand(100000)}",
      }

      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(201)
    end

    it 'get /api/v1/list/consume' do
      get '/api/v1/list/consume'

      expect(last_response).to be_ok
      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(200)
    end
  end

  context "Questionnaire" do
    it 'post /api/v1/questionnaire' do
      happy_number = (0..9).to_a.shuffle

      post '/api/v1/questionnaire', {
        questionnaire_code: Time.now.to_i,
        questionnaire_name: "问卷#{rand(1000)}",
        subject_index: "第#{rand(20)}题",
        subject_id: rand(100),
        subject: "问题#{rand(10000)}",
        subject_type: %w(单选题 多选题 填空).sample,
        answer_id: rand(1000),
        answer: "回答...",
        card_number: Time.now.to_i
      }

      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(201)
    end

    it 'get /api/v1/list/questionnaire' do
      get '/api/v1/list/questionnaire'

      expect(last_response).to be_ok
      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(200)
    end
  end

  context "Redeem" do
    it 'post /api/v1/redeem' do
      happy_number = (0..9).to_a.shuffle

      post '/api/v1/redeem', {
        card_number: Time.now.to_i,
        member: "会员#{rand(100)}}",
        telphone: '138' + happy_number.first(8).join,
        amount: rand(1000),
        redeem_state: %w(兑换完成 未兑换).sample,
        gift_name: "礼品#{rand(1000)}",
        gift_id: rand(1000),
        store_id: rand(1000),
        store_name: "门店#{rand(1000)}"
      }

      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(201)
    end

    it 'get /api/v1/list/redeem_state' do
      get '/api/v1/list/redeem'

      expect(last_response).to be_ok
      response_hash = json_parse(last_response.body)
      expect(response_hash[:code]).to eq(200)
    end
  end
end
