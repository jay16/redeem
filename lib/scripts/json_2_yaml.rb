# encoding: utf-8
require 'yaml'
require 'json'

json = {
  production_hosts: ['10.254.2.9', '180.169.127.188'],
  development: {
    server: 'http://180.169.127.188:7071/HDCRMWebService.dll/soap/IHDCRMWebService',
    userGid: '1000245',
    userPwd: '05EC54150206B033',
    storeCode: '0210',
    workStation: '172.17.104.164',
    oper: 'HDCRM[0]'
  },
  production: {
    server: 'http://180.169.127.188:7072/HDCRMWebService.dll/soap/IHDCRMWebService',
    userGid: '1000185',
    userPwd: 'B3E6E46E1BC2C968',
    storeCode: '0210',
    workStation: '10.254.2.9',
    oper: 'website'
  }
}

# method 1
puts json.to_yaml.to_s
