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
  version: '0.4.26',
  server: 'http://180.169.127.188:7071/HDCRMWebService.dll/soap/IHDCRMWebService',
  userGid: '1000020',
  userPwd: 'CAB371810F12B8C2',
  workStation: '172.17.104.164',
  storeCode: '0210',
  oper: 'HDCRM[0]',
  params: function() {
    var query = {},
        search = window.location.search.substring(1),
        parts = search.split('&'),
        pairs = [];

    for(var i = 0, len = parts.length; i < len; i++) {
      pairs = parts[i].split('=');
      query[pairs[0]] = (pairs.length > 1 ? decodeURIComponent(pairs[1]) : null);
    }

    return query;
  },
  redirect_to_with_timestamp: function(pathname) {
      var timestamp = (new Date()).valueOf(),
          split_str = pathname.indexOf('?') >= 0 ? '&' : '?';
          pathname_with_timestamp = pathname + split_str + 'l_timestamp=' + timestamp;

      window.location.href = pathname_with_timestamp;
  },
  // 3.1.1 登录
  loginWithinIPad: function(toPathName) {
    var username = $('#yhm').val(),
      password = $('#pwd').val(),
      area_id = $('input[name="area_id"]:checked').val();
      layer.msg('登录中...', {
        icon: 16,
        shade: 0.01
      });
    var clientCookie,
        userGid = window.TKH.userGid,
        userPwd = window.TKH.userPwd,
        workStation = window.TKH.workStation,
        storeCode = window.TKH.storeCode,
        Oper = window.TKH.oper;
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
    console.log(xmlString);
    $.ajax({
      url: window.TKH.server + "?op=LogIn",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: xmlString,
      timeout: 5000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log(xmlHttpRequest);
        clientCookie = $(xmlHttpRequest).find('sClientCookie').text();
        console.log(clientCookie);
        if(clientCookie !== null && clientCookie.length > 0) {
          window.localStorage.setItem('sClientCookie', clientCookie);
          window.localStorage.setItem('userGid', userGid);
          window.localStorage.setItem('logined', "yes");
          var current = new Date(),
              expiredIn = current.valueOf() + 1 * 60 * 60 * 1000;
          current.setTime(expiredIn);
          window.localStorage.setItem('expiredIn', expiredIn);
          window.localStorage.setItem('expiredInDate', current);

          window.TKH.redirect_to_with_timestamp(toPathName);
        } else {
          layer.msg("『底层接口』用户验证失败", { time: 3000 });
        }
      },
      complete: function(xmlHttpRequest, status) {
        console.log(status);
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        layer.msg("『底层接口』用户验证失败，请重新登录", {
          time: 0,
          btn: ['确定'],
          btnAlign: 'c',
          yes: function(index) {
            layer.close(index);
            window.localStorage.setItem('logined', "no");

            window.TKH.redirect_to_with_timestamp('login.html');
          }
        });
      }
    });
  },
  loginWithinAdmin: function() {
    var clientCookie,
        userGid = window.TKH.userGid,
        userPwd = window.TKH.userPwd,
        workStation = window.TKH.workStation,
        storeCode = window.TKH.storeCode,
        Oper = window.TKH.oper;

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
      timeout: 5000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log(xmlHttpRequest);
        console.log(xmlHttpRequest.responseText);
        clientCookie = $(xmlHttpRequest).find('sClientCookie').text();
        console.log(clientCookie);
        if(clientCookie !== null && clientCookie.length > 0) {
          window.localStorage.setItem('sClientCookie', clientCookie);
          window.localStorage.setItem('userGid', userGid);
          var current = new Date(),
              expiredIn = current.valueOf() + 1 * 60 * 60 * 1000;
          current.setTime(expiredIn);
          window.localStorage.setItem('expiredIn', expiredIn);
          window.localStorage.setItem('expiredInDate', current);
        } else {
          layer.msg('『底层接口』用户验证失败，请重新登录', {
            time: 0,
            btn: ['知道了'],
            btnAlign: 'c',
            yes: function(index) {
              window.TKH.redirect_to_with_timestamp('login.html');
            }
          });
        }
      },
      complete: function(xmlHttpRequest, status) {
        console.log(status);
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        alert("『底层接口』登录失败");
      }
    });
  },
  // 3.1.2 退出
  logout: function() {
    layer.msg('确认退出登录', {
      time: 0,
      btn: ['确定', '取消'],
      yes: function(index) {
        window.localStorage.setItem("logined", "no");
        layer.close(index);
        window.TKH.redirect_to_with_timestamp('login.html');

        // var clientCookie = window.localStorage.getItem('sClientCookie');
        // var xmlString = '<SOAP-ENV:Envelope \
        //   xmlns:ns3="http://www.w3.org/2001/XMLSchema" \
        //   xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" \
        //   xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" \
        //   xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" \
        //   xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" \
        //   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
        //   xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" \
        //   SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\
        //   <SOAP-ENV:Header/>\
        //     <ns2:Body>\
        //       <ns0:LogOut>\
        //       <sClientCookie xsi:type="ns3:string">' + clientCookie + '</sClientCookie>\
        //       </ns0:LogOut>\
        //     </ns2:Body>4\
        // </SOAP-ENV:Envelope>'

        // $.ajax({
        //   url: window.TKH.server + "?op=LogOut",
        //   type: 'POST',
        //   async: false,
        //   dataType: 'xml',
        //   data: xmlString,
        //   timeout: 5000,
        //   contentType: "text/xml; charset=UTF-8",
        //   success: function(xmlHttpRequest) {
        //     layer.closeAll();
        //     window.localStorage.setItem('logined', "no");
        //     layer.msg("退出成功", { time: 3000 });
        //     window.TKH.redirect_to_with_timestamp('login.html');
        //   },
        //   complete: function(xmlHttpRequest, status) {},
        //   error: function(xmlHttpRequest) {
        //     layer.msg("退出失败", { time: 2000 });
        //   }
        // });
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
      timeout: 5000,
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
      layer.msg('操作中...', { icon: 16, shade: 0.01 });

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

      window.localStorage.removeItem('sFCARDNUM');
      window.localStorage.removeItem('current_telphone');
      $.ajax({
        url: window.TKH.server + "?op=DoClientCommand",
        type: 'POST',
        async: false,
        dataType: 'xml',
        data: xmlstring,
        timeout: 5000,
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
            $('.content_1 > div:eq(0)').click();

            window.localStorage.setItem('sFCARDNUM', outparams["FCARDNUM"]);
            window.TKH._do(ret.data);
            window.TKH._doConsumerInfo(ret.ConsumerInfo, false);
            window.TKH._doExchangeInfo(ret.ExchangeInfo, false);
            $('#wx').parent().css('display', 'block');
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
            params["total_score"] = outparams["FCARDTOTALSCORE"];
            params["balance"] = outparams["FCARDBALANCE"];
            window.localStorage.setItem('current_telphone', JSON.stringify(params));
          } else {
            window.localStorage.removeItem('sFCARDNUM');
            window.TKH._chu();
            window.TKH._chuConsumerInf();
            window.TKH._chuExchangeInfo();

            if (typeof(outparams['FMSG']) === 'string' && outparams['FMSG'].length > 0) {
              layer.msg(outparams['FMSG'], { time: 2000 });
            }

            $('#wx').parent().css('display', 'block');
            $('.bc, .legal-provision-dz').css('display', 'block');
            $('.xy').css('display', 'none');
            // $("#search").val('');
          };
        },
        complete: function(xmlHttpRequest, status) {
          console.log(xmlHttpRequest);
        },
        error: function(xmlHttpRequest) {
          console.log(xmlHttpRequest);
          layer.msg("『底层接口』ERROR - QUERYMEMBERINFOJSON", { time: 3000 });
        }
      });

      return false;
    }
    return false;
  },
  _do: function(data) {
    $('#mz').val(data.FMEMNAME);
    $('#xb').val(data.FMEMSEX);

    var ldd_province = '选择省',
        ldd_city = '选择市',
        ldd_distinct = '选择区',
        dist_json = {
          province: ldd_province,
          city: ldd_city,
          district: ldd_distinct
        };
    if(data.FMEMADDRESS && data.FMEMADDRESS.length && data.FMEMADDRESS.split('-').length >= 3) {
      var ldd_parts = data.FMEMADDRESS.split('-'),
          ldd_part = [],
          ldd_other = '';
      for(var i = 0, len = ldd_parts.length; i < len; i ++) {
        ldd_part = ldd_parts[i];
        console.log(i + ' - ' + ldd_part);
        if(i === 0) {
          ldd_province = ldd_part;
        } else if(i === 1) {
          ldd_city = ldd_part;
        } else if(i === 2) {
          ldd_distinct = ldd_part;
        } else {
          if(ldd_other.length) {
            ldd_other += '-' + ldd_part;
          } else {
            ldd_other = ldd_part;
          }
        }
      }
      dist_json = {
        province: ldd_province,
        city: ldd_city,
        district: ldd_distinct
      };
      console.log(dist_json);
      $("#live_dz_distpicker").distpicker('destroy');
      $("#live_dz_distpicker").distpicker(dist_json);
    } else {
      $("#live_dz_distpicker").distpicker('reset', true);
    }
    if(data.FMEMCOMPANY && data.FMEMCOMPANY.length && data.FMEMCOMPANY.split('-').length >= 3) {
      var wdd_parts = data.FMEMCOMPANY.split('-'),
          wdd_part,
          wdd_province,
          wdd_city,
          wdd_distinct,
          wdd_other = '';
      for(var i = 0, len = wdd_parts.length; i < len; i ++) {
        wdd_part = wdd_parts[i];
        if(i === 0) {
          wdd_province = wdd_part;
        } else if(i === 1) {
          wdd_city = wdd_part;
        } else if(i === 2) {
          wdd_distinct = wdd_part;
        } else {
          if(wdd_other.length) {
            wdd_other += '-' + wdd_part;
          } else {
            wdd_other = wdd_part;
          }
        }
      }
      $("#work_dz_distpicker").distpicker('destroy');
      $("#work_dz_distpicker").distpicker({
        province: ldd_province,
        city: ldd_city,
        district: ldd_distinct
      });
    }

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
      $("#ExchangeInfo > div:eq(0)").empty();
      $("#ExchangeInfo > div:eq(1)").empty();

      // only show first 10
      var html = '';
      for (var i = 0, ilen = (ExchangeInfo.length > 9 ? 9 : ExchangeInfo.length); i < ilen; i++) {
        html = '<div class="xf">'; //<p>兑换记录 : 礼品 / Redemption date : gifts</p>
        for (var j = 0, jlen = ExchangeInfo[i]["FGOODS"].length; j < jlen; j++) {
          html += ' <p>' + ExchangeInfo[i].FBILLNUM + ':CNY ' + ExchangeInfo[i]["FGOODS"][j].AMOUNT + ' - ' + ExchangeInfo[i]["FGOODS"][j].NAME + '</p></div>';
        }
        if(i <= 4) {
          $("#ExchangeInfo > div:eq(0)").append(html);
        } else {
          $("#ExchangeInfo > div:eq(1)").append(html);
        }
      }
    } else {
      window.TKH._chuExchangeInfo()
    }
  },
  _chu: function() {
    $('#mz').val('');
    $('#xb').val('');
    // $('#work_dz').val();
    $('#ymd').val('');
  },
  _chuExchangeInfo: function() {
    $("#ExchangeInfo > div:eq(0)").empty();
    $("#ExchangeInfo > div:eq(1)").empty();
  },
  _chuConsumerInf: function() {
    $("#ConsumerInfo").empty();
    var html = '<div class="xf"><p>消费日期 : 消费金额 - 店铺名称 / Date : Amount - Merchant name</p><p></p></div>';
    $("#ConsumerInfo").append('');
  },
  openCardJson: function() {
    if($("#checkbox_legal").prop('checked')) {
      window.TKH.CRMWeiXinOpenCardJson();
    } else {
      window.localStorage.setItem('sFCARDNUM', '-');
      var fmbrmobilephone = $('#search').val(),
          fmbrname = $.trim($('#mz').val()),
          fmbrsex = $.trim($('#xb option:selected').val()),
          fmbrbirth = $.trim($('#ymd').val()),
          ldd_province = $("#ldd_province").val(),
          ldd_city = $("#ldd_city").val(),
          ldd_district = $("#ldd_district").val(),
          faddress = ldd_province + '-' + ldd_city + '-' + ldd_district,
          params = {
            "name": fmbrname,
            "sex": fmbrsex,
            "birthday": fmbrbirth,
            "address": faddress,
            "telphone": fmbrmobilephone,
            "card_number": '-'
          };

      if(fmbrbirth.length === 10) {
        ymd_date = new Date(Date.parse(fmbrbirth.replace("-", "/")));
        if(ymd_date > (new Date())) {
          layer.msg('请入合理出生日期', { time: 2000 });
          return false;
        }
      }
      window.localStorage.setItem('current_telphone', JSON.stringify(params));
      // window.TKH.genMallSupplyBill();
      layer.open({
        type:1,
        area:"450px",
        content:$('.tishibuton-area')
      });
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
        ldd_province = $("#ldd_province").val(),
        ldd_city = $("#ldd_city").val(),
        ldd_district = $("#ldd_district").val();
        faddress = ldd_province + '-' + ldd_city + '-' + ldd_district;

    if (fmbrname.length == 0) {
      layer.msg('请输入用户名', { time: 2000 });
      return false;
    }
    if(fmbrbirth.length === 10) {
      ymd_date = new Date(Date.parse(fmbrbirth.replace("-", "/")));
      if(ymd_date > (new Date())) {
        layer.msg('请入合理出生日期', { time: 2000 });
        return false;
      }
    }

    var fopenid = 'm0' + (new Date()).valueOf(),
        fcardid = '0210';
    var params = '{&quot;FOPENID&quot;:&quot;' + fopenid + '&quot;,&quot;FCARDID&quot;:&quot;' + fcardid + '&quot;,&quot;FMBRNAME&quot;:&quot;' + fmbrname + '&quot;,&quot;FMBRSEX&quot;:&quot;' + fmbrsex + '&quot;,&quot;FMBRBIRTH&quot;:&quot;' + fmbrbirth + '&quot;,&quot;FMBRMOBILEPHONE&quot;:&quot;' + fmbrmobilephone + '&quot;,&quot;FADDRESS&quot;:&quot;' + faddress + '&quot;}';

    var clientCookie = window.localStorage.getItem('sClientCookie'),
        xmlString = '<SOAP-ENV:Envelope \
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

    window.localStorage.removeItem('sFCARDNUM');
    window.localStorage.removeItem('current_telphone');
    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: xmlString,
      timeout: 5000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        var ret = JSON.parse(resultstring);
        layer.closeAll();
        if (ret["FRESULT"] === 0) {
          $("#fnum_span").html(ret["FCARDNUM"]);
          layer.open({
              type:1,
              area:"450px",
              content:$('.regisitered-area')
          });

          $(".layui-layer-page").css({"top": "20%"});
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
          window.localStorage.setItem('sFCARDNUM', ret["FCARDNUM"]);
          window.localStorage.setItem('current_telphone', JSON.stringify(params));
          window.ServerAPI.save_member(params);
        } else {
          layer.msg("『底层接口』ERROR - " + ret["FMSG"], { time: 2000 });
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
        layer.msg("『底层接口』ERROR - CRMWeiXinOpenCardJson", { time: 3000 });
      }
    });
  },
  // 消费录入/积分录入，打开商户选择
  searchDQM: function(ctl) {
    var dpm = null,
      gndgid = null;
    dpm = $(ctl).parent().find('.store-name');
    gndgid = $(ctl).parent().find('.gndgid');
    dpm.parent(".dp").addClass('suoding');
    var dpm_val = dpm.val();

    window.TKH.queryMallGndWeb();
  },
  // 消费录入/积分录入，选择商户选择
  selectedDQM: function(ctl) {
    console.log($(ctl).find('.gndname').val());
    $(".suoding").find(".store-name").val($(ctl).find('.gndname').val());
    $(".suoding").find(".gndgid").val($(ctl).find('.gndgid').val());
    $(".suoding").find(".gndcode").val($(ctl).find('.gndcode').val());
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
            <input type="text" disabled="disabled" placeholder="店铺名称" class="store-name"/>\
            <input type="hidden" class="gndgid"/>\
            <input type="hidden" class="gndcode"/>\
            <a href="javascript:void(0);" onClick="window.TKH.searchDQM(this);"  class="search">\
              <img src="assets/images/search.png"/>\
            </a>\
         </div>\
         <div>\
           <p>流水号 / Serial Number</p>\
           <input type="text" placeholder="流水号" class="serial-num" value=""/>\
         </div>\
         <div style="width: 28%;">\
           <p>消费时间 / Time</p>\
           <input type="datetime-local" value="' + (new Date).format('yyyy-MM-ddThh:mm') + '" placeholder="" class="datetime"/>\
         </div>\
         <div style="width: 14%;">\
           <p>消费金额 / Amount</p>\
           <input style="width:60%" type="number" placeholder="0.00" class="amount"/>\
           <a href="javascript:void(0);" class="jian">-</a>\
         </div>\
       </div>'
    );
  },
  // 3.2.7 查询有效商铺信息
  queryMallGndWeb: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie');
    var fstorecode = '0210',
        fpageindex = '1',
        fpagesize = '30';
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
    console.log(xmlString);
    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: xmlString,
      timeout: 5000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring)
        var outparams = JSON.parse(resultstring);
        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {

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
          $('.xuanZe .hangHu').append(html);
        } else {
          if (outparams["FMSG"].length > 0) {
            layer.msg("『底层接口』ERROR - " + outparams["FMSG"], { time: 3000 });
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
        layer.msg("『底层接口』ERROR - QueryMallGndWeb", { time: 3000 });
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
      data: xmlString,
      timeout: 5000,
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
            item = {},
            gift_image;
          for (var i = 0, len = outparams["Data"].length; i < len; i++) {
            gift_image = 'gift.png';
            if(['1000000', '1000001', '1000020'].indexOf(item["FGID"]) >= 0) {
              gift_image = 'gift-' + item["FGID"] + '.jpg';
            }
            item = outparams["Data"][i];
            html += "<div class='xuzh_jin' style='display: none;'>"
            html += "  <input type='hidden' class='gift_id' value='" + item["FGID"] + "'/>";
            html += "  <input type='hidden' class='fnum' value='" + item["FNUM"] + "'/>";
            html += "  <input type='hidden' class='gift_code' value='" + item["FCODE"] + "'/>";
            html += "  <input type='hidden' class='gift_name' value='" + item["FNAME"] + "'/>";
            html += "  <input type='hidden' class='address' value='" + item["FLOCATION"] + "'/>";
            html += "  <input type='hidden' class='begin_date' value='" + item["FENDTIME"] + "'/>";
            html += "  <input type='hidden' class='end_date' value='" + item["FENDTIME"] + "'/>";
            html += "  <input type='hidden' class='theme_name' value='" + item["FSUBJECT"] + "'/>";
            html += "  <input type='hidden' class='price' value='" + item["FPRICE"] + "'/>";
            html += "  <input type='hidden' class='count' value='" + item["FQTY"] + "'/>";
            html += "  <input type='hidden' class='min_amount' value='" + item["FLOWAMT"] + "'/>";
            html += "  <img style='' src='assets/images/" + gift_image + "'/><p><span class='gift_name'>" + item["FNAME"] + "</span></p>";
            html += "  <div class='gou'>";
            html += "  <img src='assets/images/gou.png' />";
            html += "  </div>";
            html += "</div>";
          }
          $('.shangPing.jin').append(html);
        } else {
          if (outparams["FMSG"].length > 0) {
            layer.msg("『底层接口』ERROR - " + outparams["FMSG"], { time: 2000 });
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
        layer.msg("『底层接口』ERROR - CRMQueryMallGiftPromInfo", { time: 3000 });
      }
    });
  },
  displayGiftWithAmount: function(today_amount) {
    var temp_gift_num = 0, ok_gift_num = 0;
    $(".xuzh_jin").each(function() {
      $(this).css({"display": "none"});
    });

    $(".xuzh_jin").each(function() {
      temp_gift_num += 1;
      var gift_price = $(this).find(".min_amount").val();
      console.log(gift_price);
      if(!isNaN(gift_price)) {
        if(today_amount >= parseFloat(gift_price)) {
          $(this).css({"display": "inline-block"});
          ok_gift_num += 1;
        }
      }
    });

    if(temp_gift_num > 0 && ok_gift_num == 0) {
      layer.msg('消费金额暂无合适礼品可兑换！', {
        time: 3000 //2s后自动关闭
      });
    }
  },
  // 3.2.31 生成赠品发放单接口
  genMallSupplyBill: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie'),
        fcardnum = window.localStorage.getItem('sFCARDNUM'),
        fildate = (new Date()).format('yyyy.MM.dd hh:mm:ss'),
        currentQueryMember = window.localStorage.getItem('current_telphone'),
        currentQueryMemberJSON = {};

    if(currentQueryMember && currentQueryMember.length) {
      currentQueryMemberJSON = JSON.parse(currentQueryMember);
    }

    var paies = [], gid, flowno, crttime, famt,
        post_params = {},
        post_param_consumes = [],
        post_param_gifts = [];
    // 消费记录
    $(".xf").each(function() {
      if ($(this).hasClass("checked")) {
        var fgndgid = $(this).find(".guoxiao_gndgid").val(),
            fgndcode = $(this).find(".guoxiao_gndcode").val()
            storename = $(this).find(".guoxiao_store").val(),
            fflowno = $(this).find(".guoxiao_serialnum").val(),
            famt = (new Number($(this).find(".guoxiao_amount").val())).toFixed(2),
            focrtime = (new Date()).format('yyyy.MM.dd hh:mm:ss');

        console.log('fgndgid - ' + fgndgid);
        paies.push('{&quot;FGNDGID&quot;:&quot;' + fgndgid + '&quot;,&quot;FFLOWNO&quot;:&quot;' + fflowno + '&quot;,&quot;FOCRTIME&quot;:&quot;' + focrtime + '&quot;,&quot;FAMT&quot;:&quot;' + famt + '&quot;}');

        // # field0, name, 会员名称
        // # field1, card_number, 会员卡号
        // # field2, serial_number, 流水号
        // # field3, amount, 消费金额
        // # field4, store_code, 商铺代号
        // # field5, store_name, 商铺名称
        //
        // name":"asdfasdf","sex":"男","birthday":"","address":"asdfsadfsdf","telphone":"13569897852","card_number":"80000567"}
        post_param_consumes.push({
          "name": currentQueryMemberJSON["name"],
          "card_number": fcardnum,
          "serial_number": fflowno,
          "amount": famt,
          "store_code": fgndcode,
          "store_name": storename
        });

        if(fcardnum !== null && fcardnum !== '-') {
          var score_data = {
            card_number: fcardnum,
            show_code: fgndcode,
            real_amt: famt,
            score: parseInt(famt)
          };
          window.TKH.calcMallScoreExWeb(score_data, 0);
        }
      }
    });
    // var fgndgid = '500021',
    //     fflowno = (new Date()).valueOf(),
    //     focrtime = (new Date()).format('yyyy.MM.dd hh:mm:ss');
    // var fsupplypay_params = '{&quot;FGNDGID&quot;:&quot;' + fgndgid + '&quot;,&quot;FFLOWNO&quot;:&quot;' + fflowno + '&quot;,&quot;FOCRTIME&quot;:&quot;' + focrtime + '&quot;}';

    // 消费记录
    var gifts = [], gift_id, amount = 1;
    $(".xuzh_jin").each(function() {
      if ($(this).hasClass("xuanZhong")) {
        gift_id = $(this).find(".gift_id").val();
        gifts.push('{&quot;FLAGGID&quot;:&quot;' + gift_id + '&quot;,&quot;FAMOUNT&quot;:&quot;' + amount + '&quot;}');

        // # field0, theme_code, 主题单号
        // # field1, theme_name, 主题名称
        // # field2, begin_date, 开始时间
        // # field3, end_date, 结束时间
        // # field4, address, 促销地点
        // # field5, gift_code, 赠品代码
        // # field6, gift_name, 赠品名称
        // # field7, count, 赠品数量
        // # field8, min_amount, 起始金额
        // # field9, price, 赠品单价
        post_param_gifts.push({
          "gift_code": $(this).find(".gift_code").val(),
          "gift_name": $(this).find(".gift_name").val(),
          "address": $(this).find(".address").val(),
          "begin_date": $(this).find(".begin_date").val(),
          "end_date": $(this).find(".end_date").val(),
          "price": $(this).find(".price").val(),
          "theme_name": $(this).find(".theme_name").val(),
          "count": $(this).find(".count").val(),
          "min_amount": $(this).find(".min_amount").val(),
          "count": $(this).find(".count").val(),
          "address": $(this).find(".address").val()
        });
      }
    });
    // var flaggid = '500000',
    //     famount = parseInt(Math.random() * 10 + 1);
    // var fsupplydtl_params = '{&quot;FLAGGID&quot;:&quot;' + flaggid + '&quot;,&quot;FAMOUNT&quot;:&quot;' + famount + '&quot;}';

    var fnum = $(".shangPing .xuanZhong .fnum").val();
        ftotal = $("#today_amount_guo").html(),
        fmember = currentQueryMemberJSON["name"],
        fmobilephone = currentQueryMemberJSON["telphone"],
        fcardid = fcardnum,
        femail = currentQueryMemberJSON["email"];
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
            <sCommand xsi:type="ns3:string">CRMGenMallSupplyBill</sCommand>\
            <sParams xsi:type="ns3:string">' + params + '</sParams>\
          </ns0:DoClientCommand>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>';
    console.log(xmlString);

    $.ajax({
      url: window.TKH.server + "?op=DoClientCommand",
      type: 'POST',
      async: false,
      dataType: 'xml',
      data: xmlString,
      timeout: 5000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring);
        var outparams = JSON.parse(resultstring);

        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
          // # field3, amount, 兑换金额
          // # field4, redeem_state, 兑换状态
          // # field5, gift_name, 礼品名称
          // # field6, gift_id, 礼品ID
          // # field7, store_id, 门店ID
          // # field8, store_name, 门店名称
          // # field9, serial_number, 流水号
          // # text1, consumers, 消费列表
          // # text2, gifts, 礼品信息
          post_param = {
            "member": currentQueryMemberJSON["name"],
            "card_number": fcardnum,
            "telphone": currentQueryMemberJSON["telphone"],
            "amount": ftotal,
            "gift_name": $(".xuanZhong").find(".gift_name").val(),
            "gift_id": $(".xuanZhong").find(".gift_code").val(),
            "consumes": post_param_consumes,
            "gifts": post_param_gifts,
            "redeem_state": "兑换成功"
          };
          window.ServerAPI.save_redeem(post_param);

          window.localStorage.removeItem("records");
          window.TKH.redirect_to_with_timestamp("questionnaire.html?from=exchange.html");
        } else {
          layer.msg("『底层接口』ERROR - " + outparams["FMSG"], { time: 2000 });
        }
      },
      complete: function(xmlHttpRequest, status) {
        console.log('complete');
        console.log(xmlHttpRequest);
      },
      error: function(xmlHttpRequest) {
        console.log('error');
        console.log(xmlHttpRequest);
        layer.msg("『底层接口』ERROR - CRMGenMallSupplyBill", { time: 2000 });
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
      data: xmlString,
      timeout: 5000,
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
            layer.msg("『底层接口』ERROR - " + outparams["FMSG"], { time: 2000 });
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
        layer.msg("『底层接口』ERROR - CRMQueryCRMQuestionnaireMode", { time: 2000 });
      }
    });
  },
  // 3.2.33 保存调查问卷信息
  saveCRMQuestionnaire: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie'),
        fcardnum = window.localStorage.getItem('sFCARDNUM'),
        questionResult = window.localStorage.getItem("questionResult"),
        questionJSON = JSON.parse(questionResult),
        fdata_params = [],
        item,
        post_param = {};

    for (var key in questionJSON) {
      item = questionJSON[key];
      fdata_params.push('{&quot;FTITELID&quot;:&quot;' + item["ftitleid"] + '&quot;,&quot;FVALUEID&quot;:&quot;' + item["fvalueid"] + '&quot;,&quot;FVALUE&quot;:&quot;' + item["fvalue"] + '&quot;}')
    }
    // '{&quot;FTITELID&quot;:&quot;' + ftitelid + '&quot;,&quot;FVALUEID&quot;:&quot;' + fvalueid + '&quot;,&quot;FVALUE&quot;:&quot;' + fvalue + '&quot;}';

    var fnum = $("#fnum").val();
    var params = '{&quot;FCARDNUM&quot;:&quot;' + fcardnum + '&quot;,&quot;FNUM&quot;:&quot;' + fnum + '&quot;,&quot;FDATA&quot;:[' + fdata_params.join(',') + ']}';

    console.log(params);
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
      data: xmlString,
      timeout: 5000,
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
          window.localStorage.removeItem("questionnaire_state");
          window.localStorage.removeItem("questionResult");


          var questionPostParam = window.localStorage.getItem("questionPostParam");
          if(questionPostParam !== null) {
            post_param = JSON.parse(questionPostParam);
            window.ServerAPI.save_answer(post_param);
          }
          layer.msg('问卷提交成功', {
            time: 0,
            btn: ['确定'],
            btnAlign: 'c',
            yes: function(index) {
              layer.close(index);

              window.TKH.redirect_to_with_timestamp("signature.html");
            }
          });
        } else {
          if (outparams["FMSG"].length) {
            layer.msg("『底层接口』ERROR - " + outparams["FMSG"], { time: 3000 });
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
        layer.msg("『底层接口』ERROR - CRMSaveCRMQuestionnaire", { time: 2000 });
      }
    });
  },
  signatureDone: function() {
    layer.msg('确认签字无误？', {
      time: 0,
      btn: ['确定', '取消'],
      yes: function(index) {
        layer.close(index);
        layer.msg('保存数据...', { icon: 16 ,shade: 0.01 ,time: 1000 });

        var queriedMemberString = window.localStorage.getItem('current_telphone'),
            queriedMember = JSON.parse(queriedMemberString),
            post_params = {
              "member": queriedMember["name"],
              "telphone": queriedMember["telphone"],
              "card_number": queriedMember["card_number"],
              "questionnaire_code": "todo",
              "questionnaire_name": "todo",
              "encoded_type": "base30",
              "signature": $("#signature").jSignature("getData", "base30").join(',')
            };
        window.ServerAPI.save_signature(post_params);

        layer.msg('页面跳转...', { icon: 16 ,shade: 0.01 ,time: 1000 });

        window.TKH.redirect_to_with_timestamp('complete.html');
      }
    });
  },
  // 积分录入，添加录入框
  addScoreInput: function() {
    var dq_count = $(".content_2 .dq-wrapper").length + 1;

    $('.content_2').append(
      '<div class="dq-wrapper dq-wrapper-' + dq_count + '">\
         <div class="dp"> \
            <p>店铺名称 / Merchant</p>\
            <input type="text" disabled="disabled" placeholder="店铺名称" class="store-name"/>\
            <input type="hidden" class="gndgid"/>\
            <input type="hidden" class="gndcode"/>\
            <a href="javascript:void (0)" onClick="window.TKH.searchDQM(this);"  class="search">\
              <img src="assets/images/search.png"/>\
            </a>\
         </div>\
         <div>\
           <p>流水号 / Serial Number</p>\
           <input type="text" placeholder="流水号" class="serial-num" value=""/>\
         </div>\
         <div style="width: 28%;">\
           <p>消费时间 / Time</p>\
           <input type="datetime-local" value="' + (new Date).format('yyyy-MM-ddThh:mm') + '" placeholder="" class="datetime"/>\
         </div>\
         <div style="width: 14%;">\
           <p>消费金额 / Amount</p>\
           <input style="width: 60%" type="number" placeholder="0.00" class="amount"/>\
           <a href="javascript:void(0);" class="jian">-</a>\
         </div>\
       </div>');
  },
  // 3.2.18 生成HDMall消费积分单
  // display_alert: 1/0
  calcMallScoreExWeb: function(data, display_alert) {
    var clientCookie = window.localStorage.getItem('sClientCookie');
    var card_num = data.card_number,
        trant_time = (new Date()).format('yyyyMMddhhmmss'),
        show_code = data.show_code,
        real_amt = data.real_amt,
        score = data.score,
        params = '{&quot;FCARDNUM&quot;:&quot;' + card_num + '&quot;,&quot;FTRANTIME&quot;:&quot;' + trant_time + '&quot;,&quot;FSHOPCODE&quot;:&quot;' + show_code + '&quot;,&quot;FREALAMT&quot;:&quot;' + real_amt + '&quot;,&quot;FSCORE&quot;:&quot;' + score + '&quot;}';
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
          <sCommand xsi:type="ns3:string">CRMCalcMallScoreExWeb</sCommand>\
          <sParams xsi:type="ns3:string">' + params + '</sParams>\
        </ns0:DoClientCommand>\
      </ns2:Body>\
    </SOAP-ENV:Envelope>'

    console.log(params);
    console.log(xmlString);
    $.ajax({
        url: window.TKH.server + "?op=DoClientCommand",
        type: 'POST',
        async: false,
        dataType: 'xml',
        data: xmlString,
        timeout: 5000,
        contentType: "text/xml; charset=UTF-8",
        success: function(xmlHttpRequest) {
          console.log('success');
          console.log(xmlHttpRequest);
          var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
          console.log(errMsg);
          var resultstring = $(xmlHttpRequest).find('sOutParams').text();
          console.log(resultstring);
          var outparams = JSON.parse(resultstring);
          if (display_alert === 1 && (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0")) {
            layer.msg('恭喜您积分成功', {
              time: 0,
              btn: ['确定'],
              btnAlign: 'c',
              yes: function(index) {
                layer.close(index);
                window.TKH.redirect_to_with_timestamp("complete.html");
              }
            });
          } else {
            if (outparams["FMSG"].length) {
              layer.msg("『底层接口』ERROR - " + outparams["FMSG"], { time: 2000 });
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
        }
    });
  },
  // 3.2.7 查询有效商铺信息，后台同步使用该接口
  queryStoreForSync: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie');
        fstorecode = '0210',
        fpageindex = '1',
        fpagesize = '30';

    if(clientCookie === null || !clientCookie.length) {
      window.TKH.loginWithinAdmin();
    }

    clientCookie = window.localStorage.getItem('sClientCookie');
    if(clientCookie === null || !clientCookie.length) {
      alert("用户二次验证失败");
      return false;
    };

    $("#sync_state").html("开始同步店铺...");
    window.ServerAPI.truncate_table('store');
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
      timeout: 5000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        var outparams = JSON.parse(resultstring);
        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
          var data = outparams["FDATA"],
              post_param = {};
          for (i = 0; i < data.length; i++) {
            post_param["name"] = data[i].GNDNAME;
            post_param["gid"] = data[i].GNDGID;
            post_param["code"] = data[i].GNDCODE;
            window.ServerAPI.save_store(post_param);
          }

          $("#sync_state").html((new Date()).format("[yyyy-MM-dd hh:mm:ss] 同步完成 ") + data.length + " 份店铺");
        } else {
          if (outparams["FMSG"].length) {
            layer.msg("『底层接口』ERROR - " + outparams["FMSG"], { time: 2000 });
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
  queryGiftForSync: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie');
    if(clientCookie === null || !clientCookie.length) {
      window.TKH.loginWithinAdmin();
    }

    clientCookie = window.localStorage.getItem('sClientCookie');
    if(clientCookie === null || !clientCookie.length) {
      alert("用户二次验证失败");
      return false;
    };

    $("#sync_state").html("开始同步礼品...");
    window.ServerAPI.truncate_table('gift');
    var ffildate = (new Date()).format('yyyy.MM.dd hh:mm:ss'),
        params = '{&quot;FFILDATE&quot;:&quot;' + ffildate + '&quot;}',
        xmlString = '<SOAP-ENV:Envelope \
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
      data: xmlString,
      timeout: 5000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring);
        var outparams = JSON.parse(resultstring);

        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
          var data = outparams["Data"],
              post_param = {};
          for (i = 0; i < data.length; i++) {
            console.log(data[i]);
            // {
            // "FBGNTIME":"2017.03.01",
            // "FMUNIT":"个",
            // "FLOWAMT":"",
            // "FSUBJECT":"121212",
            // "FRULENAME":"",
            // "FRULECODE":"",
            // "FLOCATION":"",
            // "FENDTIME":"2020.04.30 23:59:59",
            // "FSUMMUL":"",
            // "FADDTOPROM":"0",
            // "FNAME":"精美钥匙扣",
            // "FCODE":"00000017",
            // "FQTY":"10261",
            // "FNUM":"02101703310001",
            // "FGID":"500000",
            // "FCLS":"01",
            // "FPRICE":"10"
            // }
            post_param['theme_code'] = data[i].FGID;
            post_param['theme_name'] = data[i].FSUBJECT;
            post_param['begin_date'] = data[i].FBGNTIME;
            post_param['end_date'] = data[i].FENDTIME;
            post_param['address'] = data[i].FLOCATION;
            post_param['gift_code'] = data[i].FCODE;
            post_param['gift_name'] = data[i].FNAME;
            post_param['count'] = data[i].FQTY;
            post_param['min_amount'] = data[i].FLOWAMT;
            post_param['price'] = data[i].FPRICE;
            window.ServerAPI.save_gift(post_param);
          }

          $("#sync_state").html((new Date()).format("[yyyy-MM-dd hh:mm:ss] 同步完成 ") + data.length + " 份礼品");
        } else {
          if (outparams["FMSG"].length > 0) {
            layer.msg("『底层接口』ERROR - " + outparams["FMSG"], { time: 2000 });
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
  questionnaireOptionType: function(type) {
    console.log(type);
    type = parseInt(type);
    if(type === 0) {
      return "单选题";
    } else if(type === 1) {
      return "多选题";
    } else if(type === 2) {
      return "填空题";
    } else {
      return type;
    }
  },
  // 3.2.32 查询调查问卷模板信息
  queryQuestionnaireForSync: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie');
    if(clientCookie === null || !clientCookie.length) {
      window.TKH.loginWithinAdmin();
    }

    clientCookie = window.localStorage.getItem('sClientCookie');
    if(clientCookie === null || !clientCookie.length) {
      alert("用户二次验证失败");
      return false;
    };

    $("#sync_state").html("开始同步问卷...");
    window.ServerAPI.truncate_table('questionnaire');
    var fname = '',
        params = '{&quot;FNAME&quot;:&quot;' + fname + '&quot;}';
        xmlString = '<SOAP-ENV:Envelope \
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
      data: xmlString,
      timeout: 5000,
      contentType: "text/xml; charset=UTF-8",
      success: function(xmlHttpRequest) {
        console.log('success');
        console.log(xmlHttpRequest);
        var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
        var resultstring = $(xmlHttpRequest).find('sOutParams').text();
        console.log(resultstring);
        var outparams = JSON.parse(resultstring);

        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
          var data = outparams["DATA"],
              post_param = {},
              data_items = [],
              data_item = {},
              data_item_options = [];

          // 问卷
          for (var i = 0, ilen = data.length; i < ilen; i++) {
            post_param['questionnaire_code'] = data[i].FNUM;
            post_param['questionnaire_name'] = data[i].FNAME;

            data_items = data[i].MODEDTL;

            $("#sync_state").html("正在同步 " + (i+1) + "/" + ilen + " 份问卷...");
            // 题目
            for (var j = 0, jlen = data_items.length; j < jlen; j ++) {
              post_param['subject_index'] = (j + 1);
              post_param['subject_id'] = data_items[j].FTITLEID;
              post_param['subject'] = data_items[j].FTITLE;
              post_param['subject_type'] = window.TKH.questionnaireOptionType(data_items[j].FTYPE);
              post_param['questionnaire_content'] = JSON.stringify(data[i]);
              data_item = data_items[i].OPTIONDTL;
              data_item_options = [];
              for(var k = 0, klen = data_item.length; k < klen; k ++) {
                data_item_options.push({
                  "option_index": (k + 1),
                  "option_id": data_item[k].FVALUEID,
                  "option_value": data_item[k].FVALUE
                });
              }
              post_param['options'] = data_item_options;
              window.ServerAPI.save_questionnaire(post_param);
            }
            $("#sync_state").html((new Date()).format("[yyyy-MM-dd hh:mm:ss] 同步完成 ") + data.length + " 份问卷");
          }
        } else {
          if (outparams["FMSG"].length) {
            layer.msg("『底层接口』ERROR - " + outparams["FMSG"], { time: 2000 });
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
  // 3.2.4 积分明细查询
  queryCardScoreDetails: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie'),
        fcardnum = window.localStorage.getItem('sFCARDNUM');

      var now = new Date(),
          start_date = now.format('yyyy.MM.dd hh:mm:ss'),
          end_date;
      now.setTime(now.valueOf() - 30 * 24 * 60 * 60 * 1000);
      end_date = now.format('yyyy.MM.dd hh:mm:ss');

      var params = "[\\]\nFACCOUNTNO=" + fcardnum + "\nFSCORESORT=-\nFSTARTDATE=" + end_date + "\nFENDTDATE=" + start_date + "\n",
          xmlString = '<SOAP-ENV:Envelope \
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
            <sCommand xsi:type="ns3:string">QueryCardScoreDetails</sCommand>\
            <sParams xsi:type="ns3:string">' + params + '</sParams>\
          </ns0:DoClientCommand>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>'

      console.log(params);
      console.log(xmlString);

      $.ajax({
          url: window.TKH.server + "?op=DoClientCommand",
          type: 'POST',
          async: false,
          dataType: 'xml',
          data: xmlString,
          timeout: 5000,
          contentType: "text/xml; charset=UTF-8",
          success: function(xmlHttpRequest) {
              console.log('success');
              console.log(xmlHttpRequest);
              var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
              var resultstring = $(xmlHttpRequest).find('sOutParams').text();
              console.log(resultstring);
              // [\]
              // FRESULT=0
              // FMSG=
              // FCOUNT=1

              // [FSCOREDETAIL1]
              // LSTUPDTIME=2017.04.27 10:54:04
              // SCORESORT=-
              // SCORE=24624600
              // NUM=02100000006295170427105404
              var temp_array = resultstring.split('FSCOREDETAIL'),
                  temp_str,
                  limit_time = 0;
              $("#ScoreInfo > div:eq(1)").html('');
              for(var len = temp_array.length, i = len - 1; i >= 0; i --) {
                temp_str = temp_array[i];
                var mm1 = temp_str.match(/LSTUPDTIME=(.*?)\n/),
                    mm2 = temp_str.match(/SCORE=(.*?)\n/),
                    input_string = '';
                if(mm1) {
                  console.log(mm1[1]);
                  console.log(mm2[1]);
                  if(limit_time < 5) {
                    input_string = "<input type=text value='" + mm1[1] + '    ' + mm2[1] + "'>";
                    $("#ScoreInfo > div:eq(1)").append(input_string);
                  }
                  limit_time += 1;
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
          }
      });
  },
  // 1.查询赠品发放信息接口
  queryLAGSupplyInfo: function() {
    var clientCookie = window.localStorage.getItem('sClientCookie'),
        fcardnum = window.localStorage.getItem('sFCARDNUM'),
        currentQueryMember = window.localStorage.getItem('current_telphone'),
        currentQueryMemberJSON = {};

      if(currentQueryMember && currentQueryMember.length) {
        currentQueryMemberJSON = JSON.parse(currentQueryMember);
      } else {
        return false;
      }
      var params = '{&quot;FPHONE&quot;:&quot;' + currentQueryMemberJSON["telphone"] + '&quot;,&quot;FPAGEINDEX&quot;:&quot;' + 1 + '&quot;,&quot;FPAGESIZE&quot;:&quot;' + 10 + '&quot;}';

      console.log(params);
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
            <sCommand xsi:type="ns3:string">CRMQueryLAGSupplyInfo</sCommand>\
            <sParams xsi:type="ns3:string">' + params + '</sParams>\
          </ns0:DoClientCommand>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>'

      console.log(xmlString);

      $.ajax({
          url: window.TKH.server + "?op=DoClientCommand",
          type: 'POST',
          async: false,
          dataType: 'xml',
          data: xmlString,
          timeout: 5000,
          contentType: "text/xml; charset=UTF-8",
          success: function(xmlHttpRequest) {
              console.log('success');
              console.log(xmlHttpRequest);
              var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
              console.log(errMsg);
              var resultstring = $(xmlHttpRequest).find('sOutParams').text();
              console.log(resultstring);
              var outparams = JSON.parse(resultstring);

              if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
                var data = outparams["FDATA"];

                $("#ExchangeInfo > div:eq(0)").html('');
                $("#ExchangeInfo > div:eq(1)").html('');
                var input_items = [];
                for(var i = 0, len = data.length; i < len; i ++) {
                  var focrtime = data[i]["FOCRTIME"];
                  for(var j = 0, jlen = data[i]["FGIFT"].length; j < jlen; j ++) {
                    var gift = data[i]["FGIFT"][j];
                    input_items.push("<input type=text value='" + focrtime + '    ' + gift["FGIFTNAME"] + ' x ' + gift["FQTY"] + "'>");
                  }
                }
                console.log(input_items);
                for(var i = 0; i < 9; i ++) {
                  if(i < 5) {
                    $("#ExchangeInfo > div:eq(0)").append(input_items[i]);
                  } else {
                    $("#ExchangeInfo > div:eq(1)").append(input_items[i]);
                  }
                }
              } else {
                if (outparams["FMSG"].length > 0) {
                  layer.msg("『底层接口』ERROR - " + outparams["FMSG"], { time: 2000 });
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
              alert("手机号查询信息失败")
          }
      });
  }
}
