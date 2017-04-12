Date.prototype.format = function(format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

window.TKH = {
  version: '0.0.1',
  server: 'http://180.169.127.188:7071/HDCRMWebService.dll/soap/IHDCRMWebService',
  login: function() {
    var username = $('#yhm').val(),
      password = $('#pwd').val(),
      area_id = $('input[name="area_id"]:checked').val();
    if (!username) {
      layer.tips('请输入用户名', '#yhm', {
        tips: [2, '#faab20']
      });
      return false;
    } else if (!password) {
      layer.tips('请输入密码', '#pwd', {
        tips: [2, '#faab20']
      });
      return false;
    } else {
      var loading = layer.msg('登录中...', {
        icon: 16,
        shade: 0.01
      });
      var clientCookie,
        userGid = username,
        userPwd = password,
        workStation = '172.17.104.164',
        storeCode = '0210',
        Oper = 'HDCRM[0]';

      // 3.1.1 登录
    var a = '<?xml version="1.0" encoding="utf-8"?>\
      <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
      xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
      xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
      xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
      SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
        <ns2:Body>\
          <ns0:LogIn>\
            <sOper xsi:type="ns3:string">HDCRM[0]</sOper>\
            <sStoreCode xsi:type="ns3:string">' + storeCode + '</sStoreCode>\
            <sWorkStation xsi:type="ns3:string">' + workStation + '</sWorkStation>\
            <nUserGid xsi:type="ns3:int">' + userGid + '</nUserGid>\
            <sUserPwd xsi:type="ns3:string">' + userPwd + '</sUserPwd>\
            <sClientCookie xsi:type="ns3:string"/>\
          </ns0:LogIn>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>';
      $.ajax({
        url: window.TKH.server + "?op=LogIn",
        type: 'POST',
        async: false,
        dataType: 'xml',
        data: a,
        timeout: 10000,
        contentType: "text/xml; charset=UTF-8",
        success: function(xmlHttpRequest) {
          console.log(xmlHttpRequest);
          console.log(xmlHttpRequest.responseText);
          clientCookie = $(xmlHttpRequest).find('sClientCookie').text();
          console.log(clientCookie);
          if(clientCookie !== null && clientCookie.length > 0) {
            window.localStorage.setItem('sClientCookie', clientCookie);
            window.localStorage.setItem('userGid', userGid);
            location.href = 'search.html';
          } else {
            layer.msg("用户验证失败", { time: 3000 });
          }
        },
        complete: function(xmlHttpRequest, status) {
          console.log(status);
          console.log(xmlHttpRequest);
        },
        error: function(xmlHttpRequest) {
          layer.msg("登录失败", { time: 2000 });
        }
      });
    }
  },
  loginBackground: function() {
    var clientCookie,
      userGid = "1000080",
      userPwd = "A1E9840D1C9C2097",
      workStation = '172.17.104.164',
      storeCode = '0210',
      Oper = 'HDCRM[0]';

    window.localStorage.removeItem('sClientCookie');
    window.localStorage.removeItem('userGid');
    var xmlString = '<?xml version="1.0" encoding="utf-8"?>\
      <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
      xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
      xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
      xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
      SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
        <ns2:Body>\
          <ns0:LogIn>\
            <sOper xsi:type="ns3:string">HDCRM[0]</sOper>\
            <sStoreCode xsi:type="ns3:string">' + storeCode + '</sStoreCode>\
            <sWorkStation xsi:type="ns3:string">' + workStation + '</sWorkStation>\
            <nUserGid xsi:type="ns3:int">' + userGid + '</nUserGid>\
            <sUserPwd xsi:type="ns3:string">' + userPwd + '</sUserPwd>\
            <sClientCookie xsi:type="ns3:string"/>\
          </ns0:LogIn>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>';
    $.ajax({
      url: window.TKH.server + "?op=LogIn",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: xmlString,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log(xmlHttpRequest);
        console.log(xmlHttpRequest.responseText);
        clientCookie = $(xmlHttpRequest).find('sClientCookie').text();
        console.log(clientCookie);
        if(clientCookie !== null && clientCookie.length > 0) {
          window.localStorage.setItem('sClientCookie', clientCookie);
          window.localStorage.setItem('userGid', userGid);
        } else {
          alert("用户验证失败");
        }
      },
      complete: function(xmlHttpRequest, status) {
        console.log(status);
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        alert("登录失败");
      }
    });
  },
  // 3.1.2 退出
  logout: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie');
    var b = '<SOAP-ENV:Envelope \
      xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
      xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
      xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
      xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
      SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
      <SOAP-ENV:Header/>\
        <ns2:Body>\
          <ns0:LogOut>\
          <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
          </ns0:LogOut>\
        </ns2:Body>4\
    </SOAP-ENV:Envelope>'

    $.ajax({
      url: window.TKH.server + "?op=LogOut",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: b,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        layer.closeAll();
        window.localStorage.clear();
        layer.msg("退出成功", { time: 3000 });
        location.href = 'login.html';
      },
      complete: function(xmlHttpRequest, status) {},
      error: function(xmlHttpRequest) {
        layer.msg("退出失败", { time: 2000 });
      }
    });
  },
  // 3.2.17 查询HDMall交易卡流水（查询用户信息，消费记录）（通过测试）
  queryMallTranhst: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie'),
      sFCardNum = window.localStorage.getItem('sFCARDNUM'),
      today = new Date();

    today.setDate(today.getDate() + 1);
    endDateStr = today.format('yyyy.MM.dd');

    today.setDate(today.getDate() - 365);
    beginDateStr = today.format('yyyy.MM.dd');
    var params = "[\\]\nFCardNum=" + sFCardNum + "\nFBeginDate=" + beginDateStr + "\nFEndDate=" + endDateStr + "\nFPageIndex=1\nFPageSize=10\n";

    console.log(params);
    var xmlstring = '<SOAP-ENV:Envelope \
    xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
    xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
    xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
    xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
    xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
    SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
    <SOAP-ENV:Header/>\
      <ns2:Body>\
        <ns0:DoClientCommand>\
          <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
          <sCommand xsi:type="ns3:string">QUERYMALLTRANSHSTJSON</sCommand>\
          <sParams xsi:type="ns3:string">' + params + '</sParams>\
        </ns0:DoClientCommand>\
      </ns2:Body>\
    </SOAP-ENV:Envelope>'

    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: xmlstring,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log(xmlHttpRequest);
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring);
        var items = resultstring.split('FDATA='),
        jsonString = $.trim(items[1]);
        console.log(jsonString);
        var outparams = JSON.parse(jsonString);
        window.TKH._doConsumerInfo(outparams['Data'], false);
      },
      complete: function(xmlHttpRequest, status) {
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        console.log(xmlHttpRequest);
        layer.msg("ERROR - QUERYMALLTRANSHSTJSON", { time: 3000 });
      }
    });
  },
  // 3.2.37 查询会员兑奖单信息（通过测试）
  queryScorePrizeBillJson: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie'),
      fcardnum = window.localStorage.getItem('sFCARDNUM'),
      fpageindex = 0,
      fpagesize = 0;
    var params = '{&quot;FCARDNUM&quot;:&quot;' + fcardnum + '&quot;,&quot;FPAGEINDEX&quot;:&quot;' + fpageindex + '&quot;,&quot;FPAGESIZE&quot;:&quot;' + fpagesize + '&quot;}';
    var xmlstring = '<SOAP-ENV:Envelope \
      xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
      xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
      xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
      xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
      SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
      <SOAP-ENV:Header/>\
        <ns2:Body>\
          <ns0:DoClientCommand>\
            <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
            <sCommand xsi:type="ns3:string">CRMQueryScorePrizeBillJson</sCommand>\
            <sParams xsi:type="ns3:string">' + params + '</sParams>\
          </ns0:DoClientCommand>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>'

    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: xmlstring,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring);
        if (errMsg.length > 0) {
          layer.msg(errMsg, { time: 3000 });
        }
        console.log(resultstring);
        var outparams = JSON.parse(resultstring);
        if (outparams["FRESULT"] === 0) {
          console.log(outparams['FDATA']);
          var array = (typeof(outparams['FDATA']) === 'string' ? [] : outparams['FDATA']);
          console.log(array);
          window.TKH._doExchangeInfo(array, false);

        } else {
          if (outparams['FMSG'].length > 0) {
            layer.closeAll();
            layer.msg(outparams['FMSG'], {
              shade: 0.01,
              time: 2000
            });
          }
        }
      },
      complete: function(xmlHttpRequest, status) {
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        console.log(xmlHttpRequest);
        layer.msg("ERROR - CRMQueryScorePrizeBillJson", { time: 3000 });
      }
    });
  },
  // 查询会员信息
  queryMemberInfoJSON: function() {
    var phone = $('#search').val();
    if (!phone) {
      layer.tips('请输入手机号码', '#search', {
        tips: [3, '#faab20']
      });
      return false;
    } else {
      var $phe = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
      if (!($phe.test(phone))) {
        layer.msg('请输入正确的手机号码', {
          time: 2000
        });
        return false;
      }
      var loading = layer.msg('操作中...', { icon: 16, shade: 0.01 });

      var clientCookie = window.localStorage.getItem('sClientCookie');
      var xmlstring = '<SOAP-ENV:Envelope \
        xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
        xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
        xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
        xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
        xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
        SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
        <SOAP-ENV:Header/>\
          <ns2:Body>\
            <ns0:DoClientCommand>\
              <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
              <sCommand xsi:type="ns3:string">QUERYMEMBERINFOJSON</sCommand>\
              <sParams xsi:type="ns3:string">{&quot;FCARDNUM&quot;:&quot;&quot;,&quot;FMOBILEPHONE&quot;:&quot;' + phone + '&quot;, &quot;FQUERYTYPE&quot;:&quot;1&quot;,&quot;FCARNUM&quot;:&quot;&quot;}</sParams>\
            </ns0:DoClientCommand>\
          </ns2:Body>\
        </SOAP-ENV:Envelope>';

      $.ajax({
        url: window.TKH.server + "?op=DoClientCommand",
        type: 'POST',
        async: false,
        dataType: 'xml',
        data: xmlstring,
        timeout: 10000,
        contentType: "text/xml; charset=UTF-8",
        success: function(xmlHttpRequest) {
          console.log(xmlHttpRequest);
          var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
          var resultstring = $(xmlHttpRequest).find('sOutParams').text();

          window.localStorage.setItem('sOutParams', resultstring);
          var outparams = JSON.parse(resultstring);
          var result = outparams["FRESULT"];

          var ret = {};
          ret.status = outparams["FRESULT"];
          ret.data = outparams;
          ret.ConsumerInfo = [];
          ret.ExchangeInfo = [];
          if (ret.status === 0 || ret.status === "0") {
            window.localStorage.setItem('sFCARDNUM', outparams["FCARDNUM"]);
            window.TKH._do(ret.data);
            window.TKH._doConsumerInfo(ret.ConsumerInfo, false);
            window.TKH._doExchangeInfo(ret.ExchangeInfo, false);
            $('#wx').parent().css('display', 'block');
            $('#live_dz').parent().css('display', 'block');
            $('.bc, .legal-provision-dz').css('display', 'none');
            $('.xy').css('display', 'block');

            for(var key in outparams) {
              console.log(key + ": " + outparams[key]);
            }

            // # field7, married, 婚姻状态
            // # field8, id_number, 身份证号
            // # field9, qq, qq 号
            // # field10, landline, 座机
            var params = {
              "name": outparams["FMEMNAME"],
              "sex": outparams["FMEMSEX"],
              "birthday": outparams["FMEMBIRTH"],
              "address": outparams["FMEMADDRESS"],
              "telphone": outparams["FMEMMOBILEPHONE"],
              "card_number": outparams["FCARDNUM"],
              "email": outparams["FMEMEMAILADR"],
            };
            window.ServerAPI.save_member(params);
          } else {
            window.localStorage.removeItem('sFCARDNUM');
            window.TKH._chu();
            window.TKH._chuConsumerInf();
            window.TKH._chuExchangeInfo();

            if (typeof(outparams['FMSG']) === 'string' && outparams['FMSG'].length > 0) {
              layer.msg(outparams['FMSG'], { time: 2000 });
            }

            $('#wx').parent().css('display', 'block');
            $('#live_dz').parent().css('display', 'block');
            $('.bc, .legal-provision-dz').css('display', 'block');
            $('.xy').css('display', 'none');
            $("#search").val('');
          };
        },
        complete: function(xmlHttpRequest, status) {
          console.log(xmlHttpRequest);
        },
        error: function(xmlHttpRequest) {
          console.log(xmlHttpRequest);
          layer.msg("ERROR - QUERYMEMBERINFOJSON", { time: 3000 });
        }
      });
    }
  },
  _do: function(data) {
    $('#mz').val(data.FMEMNAME);
    $('#xb').val(data.FMEMSEX);
    $('#live_dz').val(data.FMEMADDRESS);
    // $('#work_dz').val(data.FMEMADDRESS);
    if (data.FMEMBIRTH) {
      var birthday = data.FMEMBIRTH.substr(0, 4) + '-' + data.FMEMBIRTH.substr(4, 2) + '-' + data.FMEMBIRTH.substr(6, 2);
      $('#ymd').val(birthday);
    }
  },
  _doConsumerInfo: function(ConsumerInfo, xia) {
    if (ConsumerInfo.length > 0) {
      if (!xia) {
        $("#ConsumerInfo").empty();
        var html = '';
        var ye = 1;
      } else {
        $("#ConsumerInfo").find('.gengduo').remove();
        var html = $("#ConsumerInfo").html();
        $("#ConsumerInfo").empty();
        var ye = xia;
      }
      // "REALAMT ": "60",  消费金额
      // "POSNO": "180",  收银机号
      // "FLOWNO": "201405230004",  流水号
      // "ACTION": "消费", 动作：有消费，修正
      // "MEMBERNAME": "郭一云",  会员姓名
      // "CARDNUM": "40000035", 卡号
      // "FILDATE": "2014.05.23 09:36:53",  流水产生时间
      // "RN": "2",  行号
      // "STORECODE": "0001",  门店代码
      // " CARDTYPE ": "201", 卡类型
      // "NOTE": “收银机号:180,流水号201405230004”,  备注
      // "SCORE": "6" 本次发生积分,
      // “BRAND”:”ONLY” 品牌
      for (a = 0; a < ConsumerInfo.length; a++) {
        html += '<div class="xf"><p>消费日期 : 消费金额 - 店铺名称 / Date : Amount - Merchant name</p>';
        html += '<p>' + ConsumerInfo[a].FILDATE + ':CNY ' + ConsumerInfo[a].REALAMT + ' - ' + ConsumerInfo[a].NOTE + '</p></div>';
      }
      //if(ConsumerInfo.length==10){
      // html +='<div class="xf gengduo"><p></p><p class="ConsumerInfo" style="text-align: center"><input type="hidden" value="'+ye+'">加载更多</p></div>';
      //}
      $("#ConsumerInfo").append(html);
    } else {
      window.TKH._chuConsumerInf()
    }
  },
  _doExchangeInfo: function(ExchangeInfo, xia) {
    if (ExchangeInfo.length > 0) {
      if (!xia) {
        $("#ExchangeInfo").empty();
        var html = '';
        var ye = 1;
      } else {
        $("#ExchangeInfo").find('.gengduo').remove();
        var html = $("#ExchangeInfo").html();
        $("#ExchangeInfo").empty();
        var ye = xia;
      }
      var html = '';
      for (var i = 0, ilen = ExchangeInfo.length; i < ilen; i++) {
        html += '<div class="xf"><p>兑换记录 : 礼品 / Redemption date : gifts</p>';
        for (var j = 0, jlen = ExchangeInfo[i]["FGOODS"].length; j < jlen; j++) {
          html += ' <p>' + ExchangeInfo[i].FBILLNUM + ':CNY ' + ExchangeInfo[i]["FGOODS"][j].AMOUNT + ' - ' + ExchangeInfo[i]["FGOODS"][j].NAME + '</p></div>';
        }
      }
      if (ExchangeInfo.length == 10) {
        html += '<div class="xf gengduo"><p></p><p class="ExchangeInfo" style="text-align: center"><input type="hidden" value="' + ye + '">加载更多</p></div>';
      }
      console.log(html);
      $("#ExchangeInfo").append(html);
    } else {
      window.TKH._chuExchangeInfo()
    }
  },
  _chu: function() {
    $('#mz').val('');
    $('#xb').val('');
    $('#live_dz').val('');
    // $('#work_dz').val();
    $('#ymd').val('');
  },
  _chuExchangeInfo: function() {
    $("#ExchangeInfo").empty();
    var html = '<div class="xf"><p>兑换日期 : 礼品 / Redemption date : gifts</p><p></p></div>';
    $("#ExchangeInfo").append(html);
  },
  _chuConsumerInf: function() {
    $("#ConsumerInfo").empty();
    var html = '<div class="xf"><p>消费日期 : 消费金额 - 店铺名称 / Date : Amount - Merchant name</p><p></p></div>';
    $("#ConsumerInfo").append(html);
  },
  openCardJson: function() {
    if($("#checkbox_legal").prop('checked')) {
      window.TKH.CRMWeiXinOpenCardJson();
    } else {
     window.localStorage.setItem('sFCARDNUM', '-');
     layer.open({
          type:1,
          area:"450px",
          content:$('.tishibuton')
      });
      $(".layui-layer").css({"top": "30%", "min-height": "230px"});
      $(".button, .tishibuton").css({"display": "block"});
    }
  },
  // 注册会员
  CRMWeiXinOpenCardJson: function() {
    var fmbrmobilephone = $('#search').val();
    var $phe = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
    if (!($phe.test(fmbrmobilephone))) {
      layer.msg('请输入正确的手机号码', { time: 2000 });
      return false;
    }
    var fmbrname = $.trim($('#mz').val()),
        fmbrsex = $.trim($('#xb option:selected').val()),
        fmbrbirth = $.trim($('#ymd').val()),
        faddress = $.trim($('#live_dz').val());

    if (fmbrname.length == 0) {
      layer.msg('请输入用户名', {
        time: 2000
      });
      return false;
    }

    var fopenid = 'm0' + (new Date()).valueOf(),
      fcardid = '0210';
    var params = '{&quot;FOPENID&quot;:&quot;' + fopenid + '&quot;,&quot;FCARDID&quot;:&quot;' + fcardid + '&quot;,&quot;FMBRNAME&quot;:&quot;' + fmbrname + '&quot;,&quot;FMBRSEX&quot;:&quot;' + fmbrsex + '&quot;,&quot;FMBRBIRTH&quot;:&quot;' + fmbrbirth + '&quot;,&quot;FMBRMOBILEPHONE&quot;:&quot;' + fmbrmobilephone + '&quot;,&quot;FADDRESS&quot;:&quot;' + faddress + '&quot;}';

    var clientCookie = window.localStorage.getItem('sClientCookie');
    var check_xml = '<SOAP-ENV:Envelope \
    xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
    xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
    xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
    xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
    xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
    SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
    <SOAP-ENV:Header/>\
      <ns2:Body>\
        <ns0:DoClientCommand>\
          <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
          <sCommand xsi:type="ns3:string">CRMWeiXinOpenCardJson</sCommand>\
          <sParams xsi:type="ns3:string">' + params + '</sParams>\
        </ns0:DoClientCommand>\
      </ns2:Body>\
    </SOAP-ENV:Envelope>';

    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: check_xml,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        var ret = JSON.parse(resultstring);
        layer.closeAll();
        if (ret["FRESULT"] === 0) {
          layer.msg("注册成功，卡号：" + ret["FCARDNUM"], {
            time: 0,
            btn: ['确定'],
            yes: function(index) {
              layer.close(index);
            }
          });
          $(".layui-layer-btn").css("text-align", "center");

          $('.bc, .legal-provision-dz').css('display', 'none');
          $('.xy').css('display', 'block');


          // # field5, email, 邮箱
          // # field6, sex, 性别
          // # field7, married, 婚姻状态
          // # field8, id_number, 身份证号
          // # field9, qq, qq 号
          // # field10, landline, 座机
          var params = {
            "name": fmbrname,
            "sex": fmbrsex,
            "birthday": fmbrbirth,
            "address": faddress,
            "telphone": fmbrmobilephone,
            "card_number": ret["FCARDNUM"]
          };
          window.ServerAPI.save_member(params);
        } else {
          layer.msg(ret["FMSG"], {
            time: 2000, //2s后自动关闭
            // btn: ['明白了', '知道了', '哦']
          });
          $('#wx').parent().css('display', 'none');
          $('#live_dz').parent().css('display', 'none');
          $('.bc, .legal-provision-dz').css('display', 'block');
          $('.xy').css('display', 'block');
        };
      },
      complete: function(xmlHttpRequest, status) {
        console.log('complete');
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        layer.msg("ERROR - CRMWeiXinOpenCardJson", { time: 3000 });
      }
    });
  },
  // 消费录入，打开商户选择
  searchDQM: function(ctl) {
    var dpm = null,
      gndgid = null;
    dpm = $(ctl).parent().find('.store-name');
    gndgid = $(ctl).parent().find('.gndgid');
    dpm.parent(".dp").addClass('suoding');
    var dpm_val = dpm.val();

    window.TKH.queryMallGndWeb();
  },
  // 消费录入，选择商户选择
  selectedDQM: function(ctl) {
    console.log($(ctl).find('.gndname').val());
    $(".suoding").find(".store-name").val($(ctl).find('.gndname').val());
    $(".suoding").find(".gndgid").val($(ctl).find('.gndgid').val());
    $('.xuanZe').fadeOut(200);
    $(".suoding").removeClass("suoding");
  },
  // 消费录入，添加录入框
  addRecordInput: function() {
    var dq_count = $(".content_2 .dq-wrapper").length + 1;

    $('.content_2').append(
      '<div class="dq-wrapper dq-wrapper-' + dq_count + '">\
         <div class="dp"> \
           <p>店铺名称 / Merchant</p>\
           <input type="text" disabled="disabled" placeholder="店铺名称" class="store-name"/><input type="hidden" placeholder="GNDGID" class="gndgid"/>\
          <a href="javascript:void (0)" onClick="window.TKH.searchDQM(this);"  class="search"><img src="../assets/image/search.png"/></a>\
         </div>\
         <div>\
           <p>流水号 / Serial Number</p>\
           <input type="text" placeholder="流水号" class="serial-num" value=""/>\
         </div>\
         <div>\
           <p>消费金额 / Amount</p>\
           <input type="number" placeholder="0.00" class="amount"/>\
         </div>\
         <a href="javascript:void(0);" class="jian">-</a>\
       </div>'
    )
  },
  // 3.2.7 查询有效商铺信息
  queryMallGndWeb: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie');
    var fstorecode = '0210',
      fpageindex = '1',
      fpagesize = '30';
    var params = '{&quot;FSTORECODE&quot;:&quot;' + fstorecode + '&quot;,&quot;FPAGEINDEX&quot;:&quot;' + fpageindex + '&quot;,&quot;FPAGESIZE&quot;:&quot;' + fpagesize + '&quot;}';

    var check_xml = '<SOAP-ENV:Envelope \
            xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
            xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
            xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
            xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
            xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
            xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
            SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
            <SOAP-ENV:Header/>\
              <ns2:Body>\
                <ns0:DoClientCommand>\
                  <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
                  <sCommand xsi:type="ns3:string">QueryMallGndWeb</sCommand>\
                  <sParams xsi:type="ns3:string">' + params + '</sParams>\
                </ns0:DoClientCommand>\
              </ns2:Body>\
            </SOAP-ENV:Envelope>';
    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: check_xml,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring)
        var outparams = JSON.parse(resultstring);
        if (outparams["FRESULT"] === 0) {

          $('.xuanZe .hangHu').html('');
          $('.xuanZe').fadeIn(200);
          var html = '';
          var data = outparams["FDATA"];
          for (i = 0; i < data.length; i++) {
            html += "<div class='soudingname' onClick='window.TKH.selectedDQM(this);'>\
                        <div>\
                          <p>" + data[i].GNDNAME + "</p>\
                          <p>\
                            <b>" + data[i].GNDGID + "</b>\
                          </p>\
                        </div>\
                        <input type='hidden' value='" + data[i].GNDGID + "' class='gndgid'/>\
                        <input type='hidden' value='" + data[i].GNDNAME + "' class='gndname'/>\
                        <input type='hidden' value='" + data[i].GNDCODE + "' class='gndcode'/>\
                        <input type='hidden' value='" + data[i].RN + "' class='rn'/>\
                      </div> ";
          }
          console.log(html);
          $('.xuanZe .hangHu').append(html);
        } else {
          if (outparams["FMSG"].length > 0) {
            layer.msg(outparams["FMSG"], { time: 3000 });
          }
        }
        console.log(resultstring)
      },
      complete: function(xmlHttpRequest, status) {
        console.log('complete');
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        console.log('error');
        console.log(xmlHttpRequest);
        layer.msg("ERROR - QueryMallGndWeb", { time: 3000 });
      }
    });
  },
  // 3.2.7 查询有效商铺信息，后台同步使用该接口
  queryGiftForSync: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie');
        fstorecode = '0210',
        fpageindex = '1',
        fpagesize = '30';

    if(clientCookie === null) {
      window.TKH.loginBackground();
    }

    clientCookie = window.localStorage.getItem('sClientCookie');
    if(clientCookie === null || !clientCookie.length) {
      return false;
    };
    var params = '{&quot;FSTORECODE&quot;:&quot;' + fstorecode + '&quot;,&quot;FPAGEINDEX&quot;:&quot;' + fpageindex + '&quot;,&quot;FPAGESIZE&quot;:&quot;' + fpagesize + '&quot;}';
    var xmlString = '<SOAP-ENV:Envelope \
            xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
            xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
            xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
            xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
            xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
            xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
            SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
            <SOAP-ENV:Header/>\
              <ns2:Body>\
                <ns0:DoClientCommand>\
                  <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
                  <sCommand xsi:type="ns3:string">QueryMallGndWeb</sCommand>\
                  <sParams xsi:type="ns3:string">' + params + '</sParams>\
                </ns0:DoClientCommand>\
              </ns2:Body>\
            </SOAP-ENV:Envelope>';
    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: xmlString,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring)
        var outparams = JSON.parse(resultstring);
        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
          var html = '';
          var data = outparams["FDATA"];
          for (i = 0; i < data.length; i++) {
            html += "<div class='soudingname' onClick='window.TKH.selectedDQM(this);'>\
                        <div>\
                          <p>" + data[i].GNDNAME + "</p>\
                          <p>\
                            <b>" + data[i].GNDGID + "</b>\
                          </p>\
                        </div>\
                        <input type='hidden' value='" + data[i].GNDGID + "' class='gndgid'/>\
                        <input type='hidden' value='" + data[i].GNDNAME + "' class='gndname'/>\
                        <input type='hidden' value='" + data[i].GNDCODE + "' class='gndcode'/>\
                        <input type='hidden' value='" + data[i].RN + "' class='rn'/>\
                      </div> ";
          }
          console.log(html);
        } else {
          if (outparams["FMSG"].length > 0) {
            alert(outparams["FMSG"]);
          }
        }
        console.log(resultstring)
      },
      complete: function(xmlHttpRequest, status) {
        console.log('complete');
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        console.log('error');
        console.log(xmlHttpRequest);
        layer.msg("ERROR - QueryMallGndWeb", { time: 3000 });
      }
    });
  },
  // 3.2.30 查询有效的赠品促销接口（P.53)
  // 兑奖页面，查询可用兑奖项
  queryMallGiftPromInfo: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie');
    var ffildate = (new Date()).format('yyyy.MM.dd hh:mm:ss');
    console.log(ffildate);
    var params = '{&quot;FFILDATE&quot;:&quot;' + ffildate + '&quot;}';
    console.log(params);
    var check_xml = '<SOAP-ENV:Envelope \
      xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
      xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
      xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
      xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
      SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
      <SOAP-ENV:Header/>\
        <ns2:Body>\
          <ns0:DoClientCommand>\
            <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
            <sCommand xsi:type="ns3:string">CRMQueryMallGiftPromInfo</sCommand>\
            <sParams xsi:type="ns3:string">' + params + '</sParams>\
          </ns0:DoClientCommand>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>';
    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: check_xml,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring);
        var outparams = JSON.parse(resultstring);

        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
          $('.shangPing.jin').empty();
          var html = '',
            item = {};
          for (var i = 0, len = outparams["Data"].length; i < len; i++) {
            item = outparams["Data"][i];
            html += "<div class='xuzh_jin'><input type='hidden' class='gift_id' value='" + item["FGID"] + "'/>";
            html += "<input type='hidden' class='fnum' value='" + item["FNUM"] + "'/>";
            html += "  <img style='' src='../assets/image/gift.png'/><p><span class='gift_name'>" + item["FNAME"] + "</span></p>";
            html += "  <div class='gou'>";
            html += "  <img src='../assets/image/gou.png' />";
            html += "  </div>";
            html += "</div>";
          }
          $('.shangPing.jin').append(html);
        } else {
          if (outparams["FMSG"].length > 0) {
            layer.msg(outparams["FMSG"], {
              time: 2000
            });
          }
        }

      },
      complete: function(xmlHttpRequest, status) {
        console.log('complete');
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        console.log('error');
        console.log(xmlHttpRequest);
        layer.msg("ERROR - CRMQueryMallGiftPromInfo", { time: 3000 });
      }
    });
  },
  // 3.2.31 生成赠品发放单接口
  genMallSupplyBill: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie');
    var fcardnum = window.localStorage.getItem('sFCARDNUM');
    var fildate = (new Date()).format('yyyy.MM.dd hh:mm:ss');

    var paies = [],
      gid, flowno, crttime, famt;
    $(".xf").each(function() {
      if ($(this).hasClass("checked")) {
        fgndgid = $(this).find(".guoxiao_gndgid").val();
        fflowno = $(this).find(".guoxiao_serialnum").val();
        famt = (new Number($(this).find(".guoxiao_amount").val())).toFixed(2);
        focrtime = (new Date()).format('yyyy.MM.dd hh:mm:ss');

        console.log('fgndgid - ' + fgndgid);
        paies.push('{&quot;FGNDGID&quot;:&quot;' + fgndgid + '&quot;,&quot;FFLOWNO&quot;:&quot;' + fflowno + '&quot;,&quot;FOCRTIME&quot;:&quot;' + focrtime + '&quot;,&quot;FAMT&quot;:&quot;' + famt + '&quot;}');
      }
    });
    // var fgndgid = '1000021',
    //     fflowno = (new Date()).valueOf(),
    //     focrtime = (new Date()).format('yyyy.MM.dd hh:mm:ss');
    // var fsupplypay_params = '{&quot;FGNDGID&quot;:&quot;' + fgndgid + '&quot;,&quot;FFLOWNO&quot;:&quot;' + fflowno + '&quot;,&quot;FOCRTIME&quot;:&quot;' + focrtime + '&quot;}';
    var gifts = [],
      gift_id, amount = 1;
    $(".xuzh_jin").each(function() {
      if ($(this).hasClass("xuanZhong")) {
        gift_id = $(this).find(".gift_id").val();
        gifts.push('{&quot;FLAGGID&quot;:&quot;' + gift_id + '&quot;,&quot;FAMOUNT&quot;:&quot;' + amount + '&quot;}');
      }
    });
    // var flaggid = '1000000',
    //     famount = parseInt(Math.random() * 10 + 1);
    // var fsupplydtl_params = '{&quot;FLAGGID&quot;:&quot;' + flaggid + '&quot;,&quot;FAMOUNT&quot;:&quot;' + famount + '&quot;}';

    var fnum = $(".shangPing .xuanZhong .fnum").val();
    ftotal = $("#today_amount_guo").html(),
      fmember = '',
      fmobilephone = '',
      fcardid = '',
      femail = '';
    var params = '{&quot;FMEMBER&quot;:&quot;' + fmember + '&quot;,\
                   &quot;FMOBILEPHONE&quot;:&quot;' + fmobilephone + '&quot;,\
                   &quot;FCARDID&quot;:&quot;' + fcardid + '&quot;,\
                   &quot;FEMAIL&quot;:&quot;' + femail + '&quot;,\
                   &quot;FCARDNUM&quot;:&quot;' + fcardnum + '&quot;,\
                   &quot;FNUM&quot;:&quot;' + fnum + '&quot;,\
                   &quot;FTOTAL&quot;:&quot;' + ftotal + '&quot;,\
                   &quot;FSUPPLYPAY&quot;:[' + paies.join(",") + '],\
                   &quot;FSUPPLYDTL&quot;:[' + gifts.join(",") + ']\
                 }';
    var check_xml = '<SOAP-ENV:Envelope \
      xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
      xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
      xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
      xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
      SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
      <SOAP-ENV:Header/>\
        <ns2:Body>\
          <ns0:DoClientCommand>\
            <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
            <sCommand xsi:type="ns3:string">CRMGenMallSupplyBill</sCommand>\
            <sParams xsi:type="ns3:string">' + params + '</sParams>\
          </ns0:DoClientCommand>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>';

    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: check_xml,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring);
        var outparams = JSON.parse(resultstring);

        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
          layer.msg('礼品兑换成功', {
            time: 0,
            btn: ['知道了'],
            yes: function(index) {
              layer.close(index);
              window.localStorage.removeItem("records");
              window.location.href = "exchange.html"
            }
          });
          $(".layui-layer-btn").css("text-align", "center");
        } else {
          layer.msg(outparams["FMSG"], { time: 2000 });
        }
      },
      complete: function(xmlHttpRequest, status) {
        console.log('complete');
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        console.log('error');
        console.log(xmlHttpRequest);
        layer.msg("ERROR - CRMGenMallSupplyBill", { time: 2000 });
      }
    });
  },
  // 3.2.32 查询调查问卷模板信息
  queryCRMQuestionnaireMode: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie');
    console.log(clientCookie);

    var fname = '';
    var params = '{&quot;FNAME&quot;:&quot;' + fname + '&quot;}';

    console.log(params);
    var check_xml = '<SOAP-ENV:Envelope \
      xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
      xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
      xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
      xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
      SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
      <SOAP-ENV:Header/>\
        <ns2:Body>\
          <ns0:DoClientCommand>\
            <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
            <sCommand xsi:type="ns3:string">CRMQueryCRMQuestionnaireMode </sCommand>\
            <sParams xsi:type="ns3:string">' + params + '</sParams>\
          </ns0:DoClientCommand>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>';
    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: check_xml,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring);
        var outparams = JSON.parse(resultstring);

        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
          window.localStorage.setItem("questionnaire", resultstring);
        } else {
          if (outparams["FMSG"].length) {
            layer.msg(outparams["FMSG"], {
              time: 2000
            });
          }
        }
      },
      complete: function(xmlHttpRequest, status) {
        console.log('complete');
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        console.log('error');
        console.log(xmlHttpRequest);
        layer.msg("ERROR - CRMQueryCRMQuestionnaireMode", { time: 2000 });
      }
    });
  },
  // 3.2.33 保存调查问卷信息
  saveCRMQuestionnaire: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie'),
      fcardnum = window.localStorage.getItem('sFCARDNUM');
    console.log(clientCookie);

    var questionResult = window.localStorage.getItem("questionResult"),
      questionJSON = JSON.parse(questionResult);

    var fdata_params = [],
      item;
    for (var key in questionJSON) {
      item = questionJSON[key];
      fdata_params.push('{&quot;FTITELID&quot;:&quot;' + item["ftitleid"] + '&quot;,&quot;FVALUEID&quot;:&quot;' + item["fvalueid"] + '&quot;,&quot;FVALUE&quot;:&quot;' + item["fvalue"] + '&quot;}')
    }
    // '{&quot;FTITELID&quot;:&quot;' + ftitelid + '&quot;,&quot;FVALUEID&quot;:&quot;' + fvalueid + '&quot;,&quot;FVALUE&quot;:&quot;' + fvalue + '&quot;}';

    var fnum = $("#fnum").val();
    var params = '{&quot;FCARDNUM&quot;:&quot;' + fcardnum + '&quot;,&quot;FNUM&quot;:&quot;' + fnum + '&quot;,&quot;FDATA&quot;:[' + fdata_params.join(',') + ']}';

    console.log(params);
    var check_xml = '<SOAP-ENV:Envelope \
      xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
      xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
      xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
      xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
      xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
      SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
      <SOAP-ENV:Header/>\
        <ns2:Body>\
          <ns0:DoClientCommand>\
            <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
            <sCommand xsi:type="ns3:string">CRMSaveCRMQuestionnaire </sCommand>\
            <sParams xsi:type="ns3:string">' + params + '</sParams>\
          </ns0:DoClientCommand>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>';
    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: check_xml,
      timeout: 10000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring);
        var outparams = JSON.parse(resultstring);
        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
          window.localStorage.removeItem("questionnaire");
          window.localStorage.removeItem("questionResult");
          layer.msg(outparams["FMSG"], {
            time: 4000
          });

          layer.msg('您的问卷已保存', {
            time: 0,
            btn: ['确定'],
            yes: function(index) {
              layer.close(index);
              window.location.href = "signature.html"
            }
          });
          $(".layui-layer-btn").css("text-align", "center");
        } else {
          if (outparams["FMSG"].length) {
            layer.msg(outparams["FMSG"], {
              time: 2000
            });
          }
        }
      },
      complete: function(xmlHttpRequest, status) {
        console.log('complete');
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        console.log('error');
        console.log(xmlHttpRequest);
        layer.msg("ERROR - CRMSaveCRMQuestionnaire", { time: 2000 });
      }
    });
  },
  signatureDone: function() {
    layer.msg('确认签字无误？', {
      time: 0 //不自动关闭
        ,
      btn: ['确定', '取消'],
      yes: function(index) {
        var $sigdiv = $("#signature"),
          datapair = $sigdiv.jSignature("getData", "base30");
        window.localStorage.setItem("signature", datapair)

        layer.close(index);
        window.location.href = 'complete.html';
      }
    });
  }
}
