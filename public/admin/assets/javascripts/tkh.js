// 用于压缩图片的canvas
var txterror, scorescc;

// 找到支持的方法, 使用需要全屏的 element 调用
function launchFullScreen(element) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// 在支持全屏的浏览器中启动全屏
// 整个页面
//launchFullScreen(document.documentElement);

function getpark(obj, i) {
    // 测试地址var tokenchar="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBfaWQiOiJoZCIsImlhdCI6MTUxMDA0MzQ1NCwiZXhwIjo0NjYzNjQzNDU0fQ.dpdcrYjGXBiZGpiuS53NziIoB0-x5yk_CNJOxjVgpkI";
    var tokenchar = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBfaWQiOiIxIiwiaWF0IjoxNTEwMjk4NDA5LCJleHAiOjQ2NjM4OTg0MDl9.oNfxRgu7xIIR-NHA5nZu_4kbi2DdLBCL7vNzxvhMUB0";
    console.log("park    " + obj);

    $.ajax({
        //测试地址 url: "http://taikoohuitest.smartac.co/api/taikoohui.customer/req_send_park_hdcrm_coupon_list",
        url: "http://hkritaikoohui.smartac.co/api/taikoohui.customer/req_send_park_hdcrm_coupon_list",
        data: obj,
        cache: false,
        dataType: "json",
        headers: { 'Authorization': 'token ' + tokenchar },
        type: 'POST',
        /*   beforeSend:function(xhr){
               xhr.setRequestHeader('authorization', 'token '+tokenchar);
           },*/

        success: function(data) {
            // $(".dq-wrapper").eq(i).append('<div class="showtips">'+data.errmsg+'<i class="tipsg"></i></div>');
            txterror = data.errmsg;
            if (i == 5) {
                txterror = scorescc + "<br>" + txterror;
            }
            showtip();
        },
        error: function() {
            $(".dq-wrapper").eq(i).append('<div class="showtips">请稍后再试<i class="tipsg"></i></div>');
        }
    })
}

function showtip() {
    var layer_index2 = layer.alert("停车券兑换结果：" + txterror, { time: 10000 });
}

function saveimgstore() {
    var imgarr = [],
        arr_imgurl = [];
    $(".input_imgid").each(function(i) {
        imgarr.push($(this).val());
    })
    $(".imgdataurl").each(function() {
        arr_imgurl.push($(this).val());
    })
    var imgdata = {
        imgid: imgarr,
        imgurl: arr_imgurl
    }
    window.localStorage.setItem("storageImg", JSON.stringify(imgdata));
}
var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
//    瓦片canvas
var tCanvas = document.createElement("canvas");
var tctx = tCanvas.getContext("2d");
var maxsize = 400 * 1024;
/*服务器*/
var picServer = '';
/*本地服务器
var picServer = 'http://123.56.91.131:4567/';*/
var imgpostarr = [];
/**
 * 获取blob对象的兼容性写法
 * @param buffer
 * @param format
 * @returns {*}
 */
/*function imgcallback(img,type,nowId) {
    var data = compress(img, type);
    upload(data, type,nowId);
    img = null;
}*/
function upload(basestr, type, nowId) {
    var text = window.atob(basestr.split(",")[1]);
    var buffer = new Uint8Array(text.length);
    var pecent = 0,
        loop = null;
    for (var i = 0; i < text.length; i++) {
        buffer[i] = text.charCodeAt(i);
    }
    var blob = getBlob([buffer], type);
    var formdata = getFormData();
    formdata.append('image0', blob);
    formdata.append('module_name', 'tkh');
    $.ajax({
        url: picServer + "/api/v1/upload/images",
        data: formdata,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "JSON",
        type: 'POST',
        beforeSend: function() {
            //  $("#imgbtn" + listid).css("display", "none");
        },
        success: function(data) {
            window.TKH.finishChoice(data.data, nowId);
        },
        error: function() {
            // $("#imgbtn" + listid).css("display", "inline-block");
        }
    })
}

function getBlob(buffer, format) {
    try {
        return new Blob(buffer, { type: format });
    } catch (e) {
        var bb = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
        buffer.forEach(function(buf) {
            bb.append(buf);
        });
        return bb.getBlob(format);
    }
}
/**
 * 获取formdata
 */
function getFormData() {
    var isNeedShim = ~navigator.userAgent.indexOf('Android') &&
        ~navigator.vendor.indexOf('Google') &&
        !~navigator.userAgent.indexOf('Chrome') &&
        navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
    return isNeedShim ? new FormDataShim() : new FormData()
}
/**
 * formdata 补丁, 给不支持formdata上传blob的android机打补丁
 * @constructor
 */
function FormDataShim() {
    var o = this,
        parts = [],
        boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36),
        oldSend = XMLHttpRequest.prototype.send;
    this.append = function(name, value, filename) {
        parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
        if (value instanceof Blob) {
            parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
            parts.push(value);
        } else {
            parts.push('\r\n\r\n' + value);
        }
        parts.push('\r\n');
    };
    // Override XHR send()
    XMLHttpRequest.prototype.send = function(val) {
        var fr,
            data,
            oXHR = this;
        if (val === o) {
            // Append the final boundary string
            parts.push('--' + boundary + '--\r\n');
            // Create the blob
            data = getBlob(parts);
            // Set up and read the blob into an array to be sent
            fr = new FileReader();
            fr.onload = function() {
                oldSend.call(oXHR, fr.result);
            };
            fr.onerror = function(err) {
                throw err;
            };
            fr.readAsArrayBuffer(data);
            // Set the multipart content type and boudary
            this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
            XMLHttpRequest.prototype.send = oldSend;
        } else {
            oldSend.call(this, val);
        }
    };
}

function compress(img, type) {
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    } else {
        ratio = 1;
    }
    canvas.width = width;
    canvas.height = height;
    //        铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }
    //进行最小压缩
    var ndata = canvas.toDataURL(type, 0.1);
    console.log('压缩前：' + initSize);
    console.log('压缩后：' + ndata.length);
    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
}
/*===图片上传相关函数 end===*/

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

window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    console.log('--------------------');
    console.log("错误信息：", errorMessage);
    console.log("出错文件：", scriptURI);
    console.log("出错行号：", lineNumber);
    console.log("出错列号：", columnNumber);
    console.log("错误详情：", errorObj);
    console.log(errorObj);
    console.log(typeof(errorObj));
    console.log('--------------------');

    try {
        var data = {
          platform: "礼品兑换前端",
          scene: "全局监控",
          operator_type: "",
          operator_identifer: "",
          action: "onerror",
          action_description1: errorMessage, // 查询的内容
          exception_file_name: scriptURI,
          exception_line_number: lineNumber,
          exception: JSON.stringify(errorObj)
        }
        window.ServerAPI.post_logger(data);   
    } catch(e) {}

    if (layer) { layer.closeAll(); }
    // alert("错误详情: \n" + errorObj);
    layer.msg('操作有误，请修改或重新提交该流程。', {
        time: 0,
        btn: ['确定'],
        btnAlign: 'c',
        yes: function(index) {
            layer.close(index);

            window.location.reload();
        }
    });
}

window.TKH = {
    version: '0.6.33',
    environment: 'deprecated',
    /*服务器 start*/
    api_server: '', // 后台管理
    server: '', // HD server*!/
    userGid: '',
    userPwd: '',
    workStation: '',
    storeCode: '',
    oper: '',
    api_mapping: {},
    setting: {
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
            server: 'http://10.254.2.17:7072/HDCRMWebService.dll/soap/IHDCRMWebService',
            userGid: '1000185',
            userPwd: 'B3E6E46E1BC2C968',
            storeCode: '0210',
            workStation: '10.254.2.9',
            oper: 'website'
        }
    },
    errorLayer: function(text) {
        layer.msg(text, {
            time: 0,
            btn: ['确定'],
            btnAlign: 'c',
            yes: function(index) {
                layer.close(index);
            }
        });
    },
    refreshAPIMapping: function() {
        var apiMapping = JSON.parse(window.localStorage.getItem("api_mapping"));
        window.TKH.api_mapping = apiMapping.data;
        for(var key in apiMapping.data) {
            if(key === 'server') { window.TKH.server = apiMapping.data.server; }
            if(key === 'userGid') { window.TKH.userGid = apiMapping.data.userGid; }
            if(key === 'userPwd') { window.TKH.userPwd = apiMapping.data.userPwd; }
            if(key === 'workStation') { window.TKH.workStation = apiMapping.data.workStation; }
            if(key === 'storeCode') { window.TKH.storeCode = apiMapping.data.storeCode; }
            if(key === 'oper') { window.TKH.oper = apiMapping.data.oper; }
        }
    },
    initialized: function() {
        var host_origin = window.location.host,
            port = window.location.port,
            host = host_origin.replace(":" + port, ""),
            setting = {},
            environment,
            api_mapping;

        environment = (window.TKH.setting.production_hosts.indexOf(host) >= 0 ? "production" : "development");
        setting = window.TKH.setting[environment];

        api_mapping = window.localStorage.getItem("api_mapping");
        if(api_mapping) {     
            window.TKH.refreshAPIMapping();
        } else { 
            window.ServerAPI.api_mapping(host, function(data) {
                window.localStorage.setItem("api_mapping", JSON.stringify(data));
                window.TKH.refreshAPIMapping();
            })
        }
    },
    currentENV: function() {
        console.log({
            environment: window.TKH.environment,
            server: window.TKH.server,
            userGid: window.TKH.userGid,
            userPwd: window.TKH.userPwd,
            workStation: window.TKH.workStation,
            storeCode: window.TKH.storeCode,
            oper: window.TKH.oper
        })
    },
    version_info: function() {
        console.log({
            version: window.TKH.version,
            jquery: window.$.fn.jquery,
            timestamp: (new Date()).format('yyyy-MM-dd hh:mm:ss'),
            environemnt: window.TKH.environment,
            server: window.TKH.server,
            userGid: window.TKH.userGid,
            userPwd: window.TKH.userPwd,
            workStation: window.TKH.workStation,
            storeCode: window.TKH.storeCode,
            oper: window.TKH.oper
        });
    },
    params: function() {
        var query = {},
            search = window.location.search.substring(1),
            parts = search.split('&'),
            pairs = [];

        for (var i = 0, len = parts.length; i < len; i++) {
            pairs = parts[i].split('=');
            query[pairs[0]] = (pairs.length > 1 ? decodeURIComponent(pairs[1]) : null);
        }

        return query;
    },
    reload_with_params: function(params) {
        var items = [];
        for (var key in params) {
            items.push(key + '=' + params[key]);
        }
        window.location.href = window.location.href.split('?')[0] + '?' + items.join('&');
    },
    redirect_to_with_timestamp: function(pathname) {
        var timestamp = (new Date()).valueOf(),
            split_str = pathname.indexOf('?') >= 0 ? '&' : '?';
        pathname_with_timestamp = pathname + split_str + 'timestamp=' + timestamp;

        window.location.href = pathname_with_timestamp;
    },
    redirect_to_with_telphone: function(pathname) {
        var timestamp = (new Date()).valueOf(),
            split_str = pathname.indexOf('?') >= 0 ? '&' : '?';
        pathname_with_timestamp = pathname + split_str + 'timestamp=' + timestamp;

        var currentQueryMember = window.localStorage.getItem('current_telphone'),
            currentQueryMemberJSON = {};

        if (currentQueryMember && currentQueryMember.length) {
            currentQueryMemberJSON = JSON.parse(currentQueryMember);
        }
        window.localStorage.setItem("temp_telphone", currentQueryMemberJSON['telphone']);
        window.location.href = pathname_with_timestamp;
    },
    /*
     * window.location.href?timestamp=#{timestamp}
     *
     * 判断 timestamp 有效期 30 分钟，否则强制刷
     */
    avoid_page_cache: function() {
        var params = window.TKH.params();
        try {
            var date = new Date(),
                now = new Date(),
                interval = (now - date.setTime(params.timestamp)) / 1000 / 60;

            if (isNaN(interval) || interval > 30) {
                params.timestamp = (new Date()).valueOf();
                window.TKH.reload_with_params(params);
            }
        } catch (e) {
            params.timestamp = (new Date()).valueOf();
            window.TKH.reload_with_params(params);
        }
    },
    // 登录：ipad(礼品兑换)/background(后台管理)
    login: function(type) {
        var username = $("#username").val(),
            password = $("#password").val(),
            is_remember = $("#remember").prop('checked'),
            params = {
                "username": username,
                "password": password
            };
        if (!username.length) {
            layer.tips('请输入用户名', '#username', { tips: [2, '#faab20'] });
            return false;
        }
        if (!password.length) {
            layer.tips('请输入密码', '#password', { tips: [2, '#faab20'] });
            return false;
        }
        $.ajax({
            cache: false,
            url: window.TKH.api_server + "/api/v1/authen/login",
            type: 'post',
            async: false,
            dataType: 'json',
            data: params,
            timeout: 15000,
            success: function(xhr) {
                if (xhr.code === 200) {
                    window.localStorage.setItem("username", username);
                    window.localStorage.setItem("password", password);
                    window.localStorage.setItem("remember", is_remember);
                    window.localStorage.setItem("logined", "yes");

                    if (type === 'ipad') {
                        window.TKH.loginWithinIPad('search.html');
                    } else if (type === 'background') {
                        window.TKH.redirect_to_with_timestamp('manager.html');
                    }
                } else {
                    layer.msg(xhr.info, {
                        time: 0,
                        btn: ['确定'],
                        yes: function(index) {
                            layer.close(index);
                        }
                    });
                    $(".layui-layer-btn").css({ "text-align": "center" });
                }
            }
        });
        return false;
    },
    // 3.1.1 登录
    loginWithinIPad: function(toPathName) {
        var username = $('#yhm').val(),
            password = $('#pwd').val(),
            area_id = $('input[name="area_id"]:checked').val(),
            userGid = window.TKH.userGid,
            userPwd = window.TKH.userPwd,
            workStation = window.TKH.workStation,
            storeCode = window.TKH.storeCode,
            oper = window.TKH.oper,
            xmlString = '<?xml version="1.0" encoding="utf-8"?>\
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
            <sOper xsi:type="ns3:string">' + oper + '</sOper>\
            <sStoreCode xsi:type="ns3:string">' + storeCode + '</sStoreCode>\
            <sWorkStation xsi:type="ns3:string">' + workStation + '</sWorkStation>\
            <nUserGid xsi:type="ns3:int">' + userGid + '</nUserGid>\
            <sUserPwd xsi:type="ns3:string">' + userPwd + '</sUserPwd>\
            <sClientCookie xsi:type="ns3:string"/>\
          </ns0:LogIn>\
        </ns2:Body>\
      </SOAP-ENV:Envelope>',
            index_loading_layer = layer.load(0);

        console.log(xmlString);
        $.ajax({
            url: window.TKH.server + "?op=LogIn",
            type: 'POST',
            async: false,
            dataType: 'xml',
            data: xmlString,
            timeout: 15000,
            contentType: "text/xml; charset=UTF-8"
        }).done(function(xmlHttpRequest) {
            var clientCookie = $(xmlHttpRequest).find('sClientCookie').text();
            console.log(xmlHttpRequest);
            console.log(clientCookie);
            if (clientCookie !== null && clientCookie.length > 0) {
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
                layer.msg('『底层接口』用户验证失败，请重新登录', {
                    time: 0,
                    btn: ['知道了'],
                    btnAlign: 'c',
                    yes: function(index) {
                        layer.close(index);
                    }
                });
            }
        }).fail(function(xhr, textstatus, errorThrown) {
            // XMLHttpRequest.readyState: 状态码的意思
            // 0 － （未初始化）还没有调用send()方法
            // 1 － （载入）已调用send()方法，正在发送请求
            // 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
            // 3 － （交互）正在解析响应内容
            // 4 － （完成）响应内容解析完成，可以在客户端调用了
            console.log("loginWithinIPad");
            console.log(" =========== FAILED BEGIN ===========");
            console.log("xhr:");
            console.log(xhr);
            console.log("textstatus:");
            console.log(textstatus);
            console.log("errorThrown:");
            console.log(errorThrown);
            console.log(" =========== FAILED END ===========");

            try {
                var data = {
                  platform: "礼品兑换前端",
                  scene: "登录",
                  operator_type: "",
                  operator_identifer: "",
                  action: "ajax",
                  action_description1: textstatus,
                  exception_file_name: '',
                  exception_line_number: '',
                  exception: ''
                }
                window.ServerAPI.post_logger(data);   
            } catch(e) {}

            var error_msg = '';
            if (xhr.readyState === 0) {
                error_msg = '请确认网络环境正常';
            } else if (xhr.readyState === 1 || xhr.readyState === 2) {
                error_msg = '请确认网络环境正常，请求发出前出现异常';
            } else if (xhr.readyState === 3) {
                error_msg = '请确认网络环境正常，解析响应内容时异常';
            } else if (xhr.readyState === 4) {
                error_msg = '本地回调函数处理异常';
            } else {
                error_msg = '未知处理异常(' + xhr.readyState + ')' + errorThrown;
            }
            layer.msg(error_msg, {
                time: 0,
                btnAlign: 'c',
                btn: ['确定'],
                yes: function(index) {
                    layer.close(index);
                }
            });
        }).always(function(result, textstatus, xhr) {
            if (index_loading_layer) {
                layer.close(index_loading_layer);
            }
        });
    },
    loginWithinAdmin: function() {
        var userGid = window.TKH.userGid,
            userPwd = window.TKH.userPwd,
            workStation = window.TKH.workStation,
            storeCode = window.TKH.storeCode,
            oper = window.TKH.oper,
            index_loading_layer = layer.load(0);

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
            <sOper xsi:type="ns3:string">' + oper + '</sOper>\
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
            timeout: 15000,
            contentType: "text/xml; charset=UTF-8"
        }).done(function(xmlHttpRequest) {
            var clientCookie = $(xmlHttpRequest).find('sClientCookie').text();

            console.log(xmlHttpRequest);
            console.log(clientCookie);
            if (clientCookie !== null && clientCookie.length > 0) {
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
                        layer.close(index);
                        window.TKH.redirect_to_with_timestamp('login.html');
                    }
                });
            }
        }).fail(function(xhr, textstatus, errorThrown) {
            // XMLHttpRequest.readyState: 状态码的意思
            // 0 － （未初始化）还没有调用send()方法
            // 1 － （载入）已调用send()方法，正在发送请求
            // 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
            // 3 － （交互）正在解析响应内容
            // 4 － （完成）响应内容解析完成，可以在客户端调用了
            console.log("loginWithinAdmin");
            console.log(" =========== FAILED BEGIN ===========");
            console.log("xhr:");
            console.log(xhr);
            console.log("textstatus:");
            console.log(textstatus);
            console.log("errorThrown:");
            console.log(errorThrown);
            console.log(" =========== FAILED END ===========");

            var error_msg = '';
            if (xhr.readyState === 0) {
                error_msg = '请确认网络环境正常';
            } else if (xhr.readyState === 1 || xhr.readyState === 2) {
                error_msg = '请确认网络环境正常，请求发出前出现异常';
            } else if (xhr.readyState === 3) {
                error_msg = '请确认网络环境正常，解析响应内容时异常';
            } else if (xhr.readyState === 4) {
                error_msg = '本地回调函数处理异常';
            } else {
                error_msg = '未知处理异常(' + xhr.readyState + ')' + errorThrown;
            }

            layer.msg(error_msg, {
                time: 0,
                btnAlign: 'c',
                btn: ['确定'],
                yes: function(index) {
                    layer.close(index);
                }
            });
        }).always(function(result, textstatus, xhr) {
            if (index_loading_layer) {
                layer.close(index_loading_layer);
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
                window.localStorage.removeItem("api_mapping");
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
    escapeQUOTA: function(string) {
        while (string.indexOf("&quot;") >= 0) {
            string = string.replace("&quot;", '"');
        }
        console.log(string);
    },
    // 所有操作的通用接口
    hdClientCommand: function(data, callback) {
        var clientCookie = window.localStorage.getItem('sClientCookie'),
            xmlString = '\
        <SOAP-ENV:Envelope \
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
              <sCommand xsi:type="ns3:string">' + data.command + '</sCommand>\
              <sParams xsi:type="ns3:string">' + data.params + '</sParams>\
            </ns0:DoClientCommand>\
          </ns2:Body>\
        </SOAP-ENV:Envelope>',
            index_loading_layer = -1,
            async_state = (data.async !== undefined ? data.async : false);

        console.log((new Date()).format('yy-MM-dd hh:mm:ss load ') + data.command);
        console.log('api version:' + window.TKH.version);
        console.log('xml params:');
        console.log(xmlString);
        console.log(window.TKH.escapeQUOTA(data.params));
        index_loading_layer = layer.load(0);
        $.ajax({
            url: window.TKH.server + "?op=DoClientCommand",
            type: 'POST',
            async: async_state,
            dataType: 'xml',
            data: xmlString,
            timeout: 15000,
            contentType: "text/xml; charset=UTF-8"
        }).done(function(result) {
            console.log('response:');
            console.log(result);
            if (callback) { callback(result); }
        }).fail(function(xhr, textstatus, errorThrown) {
            // XMLHttpRequest.readyState: 状态码的意思
            // 0 － （未初始化）还没有调用send()方法
            // 1 － （载入）已调用send()方法，正在发送请求
            // 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
            // 3 － （交互）正在解析响应内容
            // 4 － （完成）响应内容解析完成，可以在客户端调用了
            console.log("hdClientCommand");
            console.log(" =========== FAILED BEGIN ===========");
            console.log(data);
            console.log("xhr:");
            console.log(xhr);
            console.log("textstatus:");
            console.log(textstatus);
            console.log("errorThrown:");
            console.log(errorThrown);
            console.log(" =========== FAILED END ===========");
            var error_msg = '';
            if (xhr.readyState === 0) {
                error_msg = '请确认网络环境正常';
            } else if (xhr.readyState === 1 || xhr.readyState === 2) {
                error_msg = '请确认网络环境正常，请求发出前出现异常';
            } else if (xhr.readyState === 3) {
                error_msg = '请确认网络环境正常，解析响应内容时异常';
            } else if (xhr.readyState === 4) {
                error_msg = '本地回调函数处理异常';
            } else {
                error_msg = '未知处理异常(' + xhr.readyState + ')' + errorThrown;
            }

            layer.msg(error_msg, {
                time: 0,
                btnAlign: 'c',
                btn: ['确定'],
                yes: function(index) {
                    layer.close(index);
                }
            });
        }).always(function(result, textstatus, xhr) {
            if (index_loading_layer) {
                layer.close(index_loading_layer);
            }
            console.log((new Date()).format('yy-MM-dd hh:mm:ss deal ') + data.command + ' done');
        });
    },
    // 搜索手机号
    // 查询会员信息
    queryMemberInfoJSON: function() {
        var phone = $('#search').val();
        if (!phone) {
            layer.tips('请输入手机号码', '#search', { tips: [3, '#faab20'] });
            return false;
        }

        var $phe = /^1[0-9]{10}$/; // /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if (!($phe.test(phone))) {
            layer.msg('请输入正确的手机号码', { time: 2000 });
            return false;
        }

        /* fixed(170619):
         *
         *  查询未注册的手机号，不勾选会员章程，会对『保存』按钮进行样式及文字调整
         *  重新查询时，应恢复『保存』按钮的样式及文字
         */
        $("#checkbox_legal").prop("checked", true);
        $(".btn-save").removeClass("xy").addClass("bc").html("保存<br>Save");
        $('#birthday').mobiscroll('setDate', (new Date(1970, 0, 1, 0, 0, 0, 0)), false);

        window.localStorage.removeItem('sFCARDNUM');
        window.localStorage.removeItem('current_telphone');

        var data = {
            async: true,
            command: 'QUERYMEMBERINFOJSON',
            params: '{&quot;FCARDNUM&quot;:&quot;&quot;,&quot;FMOBILEPHONE&quot;:&quot;' + phone + '&quot;, &quot;FQUERYTYPE&quot;:&quot;1&quot;,&quot;FCARNUM&quot;:&quot;&quot;}'
        };
        window.TKH.hdClientCommand(data, function(result) {
            console.log(result);
            var errMsg = $(result).find('sErrMsg').text(),
                resultstring = $(result).find('sOutParams').text();

            window.localStorage.setItem('sOutParams', resultstring);
            var outparams = JSON.parse(resultstring),
                ret = {};
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

                for (var key in outparams) {
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
        });
        return false;
    },
    _do: function(data) {
        if (data.FMEMBIRTH) {
            if (data.FMEMBIRTH.indexOf('-') >= 0) {
                $('#birthday').val(data.FMEMBIRTH);
            } else {
                var birthday = data.FMEMBIRTH.substr(0, 4) + '-' + data.FMEMBIRTH.substr(4, 2) + '-' + data.FMEMBIRTH.substr(6, 2);
                $('#birthday').val(birthday);
            }
        }

        $('#mz').val(data.FMEMNAME);
        $('#xb').val(data.FMEMSEX);

        $("#live_dz_text").val(data.FMEMADDRESS);
        $("#live_dz_text").removeClass('hidden');
        $("#live_dz_distpicker_wrapper").addClass('hidden');

        $("#work_dz_text").val("");
        $("#work_dz_text").removeClass('hidden');
        $("#work_dz_distpicker_wrapper").addClass('hidden');

        return false;

        var dist_json = {
            province: '选择省',
            city: '选择市',
            district: '选择区'
        };
        if (data.FMEMADDRESS && data.FMEMADDRESS.length) {
            var ldd_parts = data.FMEMADDRESS.split('-'),
                ldd_part = [],
                distSuffix = ["市", "省", "区", "县", "盟", "旗", "州", "里", "路", "湾", "岛", "域", "辖"],
                tempSuffix = "";
            for (var i = 0, len = ldd_parts.length; i < len; i++) {
                ldd_part = $.trim(ldd_parts[i]);
                console.log(i + ' - ' + ldd_part);
                if (!ldd_part.length) { continue; }

                tempSuffix = ldd_part.charAt(ldd_part.length - 1)
                if (distSuffix.indexOf(tempSuffix) < 0) { continue; }

                if (i === 0) {
                    dist_json.province = ldd_part;
                } else if (i === 1) {
                    dist_json.city = ldd_part;
                } else if (i === 2) {
                    dist_json.district = ldd_part;
                }
            }
            $("#live_dz_distpicker").distpicker('destroy');
            $("#live_dz_distpicker").distpicker(dist_json);
        } else {
            $("#live_dz_distpicker").distpicker('reset', true);
        }
        if (data.FMEMCOMPANY && data.FMEMCOMPANY.length && data.FMEMCOMPANY.split('-').length >= 3) {
            var wdd_parts = data.FMEMCOMPANY.split('-'),
                wdd_part,
                wdd_province,
                wdd_city,
                wdd_distinct,
                wdd_other = '';
            for (var i = 0, len = wdd_parts.length; i < len; i++) {
                wdd_part = wdd_parts[i];
                if (i === 0) {
                    wdd_province = wdd_part;
                } else if (i === 1) {
                    wdd_city = wdd_part;
                } else if (i === 2) {
                    wdd_distinct = wdd_part;
                } else {
                    if (wdd_other.length) {
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
                if (i <= 4) {
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
        $('#birthday').val('');

        $("#live_dz_text").val("");
        $("#live_dz_text").addClass('hidden');
        $("#live_dz_distpicker_wrapper").removeClass('hidden');

        $("#work_dz_text").val("");
        $("#work_dz_text").addClass('hidden');
        $("#work_dz_distpicker_wrapper").removeClass('hidden');
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
        // 非会员通道
        if (!$("#checkbox_legal").prop('checked')) {
            window.localStorage.setItem('sFCARDNUM', '-');
            var fmbrmobilephone = $('#search').val(),
                fmbrname = $.trim($('#mz').val()),
                fmbrsex = $.trim($('#xb option:selected').val()),
                fmbrbirth = $.trim($('#birthday').val()),
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

            if (fmbrbirth.length === 10) {
                ymd_date = new Date(Date.parse(fmbrbirth.replace("-", "/")));
                if (ymd_date > (new Date())) {
                    layer.msg('请入合理出生日期', { time: 2000 });
                    return false;
                }
            }
            window.localStorage.setItem('current_telphone', JSON.stringify(params));
            // window.TKH.genMallSupplyBill();
            layer.open({
                type: 1,
                area: "450px",
                content: $('.tishibuton-area')
            });
            return false;
        }
        // 会员通道
        window.TKH.weiXinOpenCardJson();
    },
    // 注册会员
    weiXinOpenCardJson: function() {
        var fmbrmobilephone = $('#search').val(),
            $phe = /^1[0-9]{10}$/; // $phe = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if (!($phe.test(fmbrmobilephone))) {
            layer.msg('请输入正确的手机号码', { time: 2000 });
            return false;
        }
        var fmbrname = $.trim($('#mz').val()),
            fmbrsex = $.trim($('#xb option:selected').val()),
            fmbrbirth = $.trim($('#birthday').val()),
            ldd_province = $("#ldd_province").val(),
            ldd_city = $("#ldd_city").val(),
            ldd_district = $("#ldd_district").val();
        faddress = ldd_province + '-' + ldd_city + '-' + ldd_district;

        if (fmbrname.length == 0) {
            layer.msg('请输入用户名', { time: 2000 });
            return false;
        }
        /*==updatecynthia0926 start 性别和生日必填===*/
        if (fmbrsex.length == 0) {
            layer.msg('请选择性别', { time: 2000 });
            return false;
        }
        if (fmbrbirth.length == 0) {
            layer.msg('请选择生日', { time: 2000 });
            return false;
        }
        /*==updatecynthia0926 start 性别和生日必填===*/
        if (fmbrbirth.length === 10) {
            ymd_date = new Date(Date.parse(fmbrbirth.replace("-", "/")));
            if (ymd_date > (new Date())) {
                layer.msg('请入合理出生日期', { time: 2000 });
                return false;
            }
        }

        var fopenid = 'IPAD' + (new Date()).valueOf() + 'r' + Math.floor(Math.random() * 100000 + 1),
            fcardid = window.TKH.storeCode,
            params = '{&quot;FOPENID&quot;:&quot;' + fopenid + '&quot;,&quot;FCARDID&quot;:&quot;' + fcardid + '&quot;,&quot;FMBRNAME&quot;:&quot;' + fmbrname + '&quot;,&quot;FMBRSEX&quot;:&quot;' + fmbrsex + '&quot;,&quot;FMBRBIRTH&quot;:&quot;' + fmbrbirth + '&quot;,&quot;FMBRMOBILEPHONE&quot;:&quot;' + fmbrmobilephone + '&quot;,&quot;FADDRESS&quot;:&quot;' + faddress + '&quot;}',
            data = {
                params: params,
                command: 'CRMWeiXinOpenCardJson'
            };

        window.localStorage.removeItem('sFCARDNUM');
        window.localStorage.removeItem('current_telphone');
        window.TKH.hdClientCommand(data, function(result) {
            var errMsg = $(result).find('sErrMsg').text(),
                resultstring = $(result).find('sOutParams').text(),
                ret = JSON.parse(resultstring);
            layer.closeAll();
            if (ret["FRESULT"] === 0 || ret["FRESULT"] === '0') {
                $("#fnum_span").html(ret["FCARDNUM"]);
                layer.open({
                    type: 1,
                    area: "450px",
                    content: $('.regisitered-area')
                });

                $(".layui-layer-page").css({ "top": "20%" });
                $('.bc, .legal-provision-dz').css('display', 'none');
                $('.xy').css('display', 'block');

                // # field5, email, 邮箱
                // # field6, sex, 性别
                // # field7, married, 婚姻状态
                // # field8, id_number, 身份证号
                // # field9, qq, qq 号
                // # field10, landline, 座机
                var post_params = {
                    "name": fmbrname,
                    "sex": fmbrsex,
                    "birthday": fmbrbirth,
                    "address": faddress,
                    "telphone": fmbrmobilephone,
                    "card_number": ret["FCARDNUM"]
                };
                window.localStorage.setItem('sFCARDNUM', ret["FCARDNUM"]);
                window.localStorage.setItem('current_telphone', JSON.stringify(post_params));
                window.ServerAPI.save_member(post_params);
            } else {
                layer.msg("『底层接口』提示： " + ret["FMSG"], { time: 2000 });
                $('#wx').parent().css('display', 'none');
                $('#live_dz').parent().css('display', 'none');
                $('.bc, .legal-provision-dz').css('display', 'block');
                $('.xy').css('display', 'block');
            };
        });
    },
    // udatemember更新会员资料 start
    udatemember: function() {
        var fmbrmobilephone = $('#search').val(),
            $phe = /^1[0-9]{10}$/; // $phe = /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if (!($phe.test(fmbrmobilephone))) {
            layer.msg('请输入正确的手机号码', { time: 2000 });
            return false;
        }
        var fmbrname = $.trim($('#mz').val()),
            fmbrsex = $.trim($('#xb option:selected').val()),
            fmbrbirth = $.trim($('#birthday').val()),
            ldd_province = $("#ldd_province").val(),
            ldd_city = $("#ldd_city").val(),
            ldd_district = $("#ldd_district").val(),
            FACCOUNTNO = window.localStorage.getItem('sFCARDNUM');
        faddress = $.trim($('#live_dz_text').val());
        if (fmbrname.length == 0) {
            layer.msg('请输入用户名', { time: 2000 });
            return false;
        }
        /*==updatecynthia0926 start 性别和生日必填===*/
        if (fmbrsex.length == 0) {
            layer.msg('请选择性别', { time: 2000 });
            return false;
        }
        if (fmbrbirth.length == 0) {
            layer.msg('请选择生日', { time: 2000 });
            return false;
        }
        /*==updatecynthia0926 start 性别和生日必填===*/
        if (fmbrbirth.length === 10) {
            ymd_date = new Date(Date.parse(fmbrbirth.replace("-", "/")));
            if (ymd_date > (new Date())) {
                layer.msg('请入合理出生日期', { time: 2000 });
                return false;
            }
        }
        var fcardid = window.TKH.storeCode,
            params = "[\\]\nFACCOUNTNO=" + FACCOUNTNO + "\nFNAME=" + fmbrname + "\nFSEX=" + fmbrsex + "\nFBIRTH=" + fmbrbirth + "\nFMOBILEPHONE=" + fmbrmobilephone + "\nFADDRESS=" + faddress + "\n"
        data = {
            params: params,
            command: 'UPDATEMBRINFO'
        };

        window.TKH.hdClientCommand(data, function(result) {
            var errMsg = $(result).find('sErrMsg').text(),
                resultstring = $(result).find('sOutParams').text().split("\\");
            layer.closeAll();
            if (resultstring[1].match("Result=0") == "Result=0") {
                layer.msg("会员资料修改成功", { time: 2000 });
                var post_params = {
                    "name": fmbrname,
                    "sex": fmbrsex,
                    "birthday": fmbrbirth,
                    "address": faddress,
                    "telphone": fmbrmobilephone,
                    "card_number": FACCOUNTNO
                };
                window.ServerAPI.update_member(post_params);
                layer.open({
                    type: 1,
                    area: "450px",
                    content: $('.tishibuton-area')
                });
            }
        });
    }, // udatemember更新会员资料 end
    hideDQM: function() {
        $('.xuanZe').fadeOut(200);
    },
    // 消费录入/积分录入，打开商户选择
    searchDQM: function(ctl) {
        var dpm = $(ctl).parent().find('.store-name');
        dpm.parent(".dp").addClass('suoding');
        $(".search-store").val("");
        $('.xuanZe').fadeIn(200);
        // window.TKH.queryMallGndWeb(1);
        window.TKH.queryMallGndWebV2();
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
    initJEDate: function(datetimeId) {
        $("#" + datetimeId).jeDate({
            isinitVal: true,
            festival: false,
            ishmsVal: false,
            minDate: '1800.12.28 23:59:59',
            maxDate: (new Date()).format('yyyy.MM.dd hh:mm:ss'),
            format: "YYYY.MM.DD hh:mm:ss",
            zIndex: 3000
        })
    },
    removeRecordInput: function(ctl) {
        var $wrapper_class = $(ctl).closest('.dq-wrapper');
        // 关闭历史提示框
        $wrapper_class.find("input").each(function() {
            var li = $(this).data("layerindex"),
                li_number = parseInt(li);

            if (!isNaN(li_number)) { layer.close(li_number); }
        });
        var idx = $(ctl).parents(".dq-wrapper").index();
        $(".layui-layer-tips").eq(idx - 1).remove();
        if ($(".dq-wrapper").length == 0) {
            isrepeat = 0;
        }
        $wrapper_class.remove();

    },
    // 消费录入，添加录入框
    addRecordInput: function() {
        var dqCount = $(".content_2 .dq-wrapper").length + 1,
            datetimeId = "datetime_" + dqCount;
        $('.content_2').append(
            '<div class="dq-wrapper dq-wrapper-' + dqCount + '" data-class="dq-wrapper-' + dqCount + '" data-submited="no" data-layerindex="0">\
         <div class="dq-control dp"> \
            <p>店铺名称 / Merchant</p>\
            <input type="text" readonly="readonly" placeholder="店铺名称" class="store-name" onclick="window.TKH.searchDQM(this);"/>\
            <input type="hidden" class="gndgid"/>\
            <input type="hidden" class="gndcode"/>\
            <a style="display: none;" href="javascript:void(0);" onclick="window.TKH.searchDQM(this);"  class="search">\
              <img src="assets/images/search.png"/>\
            </a>\
         </div>\
         <div class="dq-control">\
           <p>流水号 / Serial Number</p>\
           <input type="text" placeholder="流水号" class="serial-num" value=""/>\
         </div>\
         <div class="dq-control">\
           <p>消费时间 / Time</p>\
           <input type="text" id="' + datetimeId + '" value="' + (new Date).format('yyyy.MM.dd hh:mm:ss') + '" class="datetime" readonly />\
         </div>\
         <div class="dq-control">\
           <p>消费金额 / Amount</p>\
           <input style="width:100%" type="number" placeholder="0.00" class="amount"/>\
         </div>\
         <div class="dq-remove">\
           <p>&nbsp;</p>\
           <button href="javascript:void(0);" class="jian" onclick="window.TKH.removeRecordInput(this);">-</button>\
         </div>\
       </div>'
        );
        window.TKH.initJEDate(datetimeId);

    },
    // 3.2.7 查询有效商铺信息
    queryMallGndWebV2: function(fpageindex) {
        var index_loading_layer = layer.load(0);
        $.ajax({
            url: window.TKH.api_server + "/api/v1/list/store?format=json&length=1000",
            type: 'get',
            async: true,
            dataType: 'json',
            timeout: 15000,
            /*===服务器要加contentType===*/
            /*contentType: "application/json; charset=UTF-8"*/
        }).done(function(result) {
            if (result.code === 200) {
                $('.xuanZe .hangHu').html('');
                var data = {};
                for (i = 0, len = result.data.length; i < len; i++) {
                    data = result.data[i];
                    $('.xuanZe .hangHu').append(
                        "<div class='soudingname' data-name='" + data.name + "' onclick='window.TKH.selectedDQM(this);'>\
                <div>\
                  <p>" + data.name + "</p>\
                  <p>\
                    <b>" + data.code + "</b>\
                  </p>\
                </div>\
                <input type='hidden' value='" + data.gid + "' class='gndgid'/>\
                <input type='hidden' value='" + data.name + "' class='gndname'/>\
                <input type='hidden' value='" + data.code + "' class='gndcode'/>\
                <input type='hidden' value='" + data.rn + "' class='rn'/>\
              </div> "
                    );
                }
            }
        }).fail(function(xhr, textstatus, errorThrown) {
            // XMLHttpRequest.readyState: 状态码的意思
            // 0 － （未初始化）还没有调用send()方法
            // 1 － （载入）已调用send()方法，正在发送请求
            // 2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
            // 3 － （交互）正在解析响应内容
            // 4 － （完成）响应内容解析完成，可以在客户端调用了

            var error_msg = '';
            if (xhr.readyState === 0) {
                error_msg = '请确认网络环境正常';
            } else if (xhr.readyState === 1 || xhr.readyState === 2) {
                error_msg = '请确认网络环境正常，请求发出前出现异常';
            } else if (xhr.readyState === 3) {
                error_msg = '请确认网络环境正常，解析响应内容时异常';
            } else if (xhr.readyState === 4) {
                error_msg = '本地回调函数处理异常';
            } else {
                error_msg = '未知处理异常(' + xhr.readyState + ')' + errorThrown;
            }

            layer.msg(error_msg, {
                time: 0,
                btnAlign: 'c',
                btn: ['确定'],
                yes: function(index) {
                    layer.close(index);
                }
            });
        }).always(function(result, textstatus, xhr) {
            if (index_loading_layer) {
                layer.close(index_loading_layer);
            }
        });
    },
    queryMallGndWeb: function(fpageindex) {
        var fstorecode = window.TKH.storeCode,
            fpagesize = '100',
            params = '{&quot;FSTORECODE&quot;:&quot;' + fstorecode + '&quot;,&quot;FPAGEINDEX&quot;:&quot;' + fpageindex + '&quot;,&quot;FPAGESIZE&quot;:&quot;' + fpagesize + '&quot;}',
            data = {
                params: params,
                command: 'QueryMallGndWeb',
                async: true
            };
        // fpageindex = 1
        if ($('.xuanZe').css("display") === 'none') {
            $('.xuanZe').fadeIn(200);
        }
        window.TKH.hdClientCommand(data, function(result) {
            var errMsg = $(result).find('sErrMsg').text(),
                resultstring = $(result).find('sOutParams').text(),
                outparams = JSON.parse(resultstring);
            if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
                if (fpageindex === 1 || fpageindex === '1') {
                    $('.xuanZe .hangHu').html('');
                }
                var html = '',
                    fdata = outparams["FDATA"];
                for (i = 0; i < fdata.length; i++) {
                    html += "<div class='soudingname' data-name='" + fdata[i].GNDNAME + "' onclick='window.TKH.selectedDQM(this);'>\
                      <div>\
                        <p>" + fdata[i].GNDNAME + "</p>\
                        <p>\
                          <b>" + fdata[i].GNDCODE + "</b>\
                        </p>\
                      </div>\
                      <input type='hidden' value='" + fdata[i].GNDGID + "' class='gndgid'/>\
                      <input type='hidden' value='" + fdata[i].GNDNAME + "' class='gndname'/>\
                      <input type='hidden' value='" + fdata[i].GNDCODE + "' class='gndcode'/>\
                      <input type='hidden' value='" + fdata[i].RN + "' class='rn'/>\
                    </div> ";
                }
                console.log(html);
                $('.xuanZe .hangHu').append(html);
                if (fdata.length) {
                    window.TKH.queryMallGndWeb(fpageindex + 1);
                }
            } else {
                if (outparams["FMSG"].length) {
                    layer.msg("『底层接口』提示 " + outparams["FMSG"], { time: 3000 });
                }
            }
        });
    },
    // 3.2.30 查询有效的赠品促销接口（P.53)
    // 兑奖页面，查询可用兑奖项
    queryMallGiftPromInfo: function() {
        var ffildate = (new Date()).format('yyyy.MM.dd hh:mm:ss'),
            params = '{&quot;FFILDATE&quot;:&quot;' + ffildate + '&quot;}',
            data = {
                params: params,
                command: 'CRMQueryMallGiftPromInfo',
                async: true
            };
        window.TKH.hdClientCommand(data, function(xmlHttpRequest) {
            var errMsg = $(xmlHttpRequest).find('sErrMsg').text(),
                resultstring = $(xmlHttpRequest).find('sOutParams').text(),
                outparams;

            try {
                outparams = JSON.parse(resultstring)
            } catch(e) {
                window.TKH.errorLayer("获取礼品列表失败，请尝试刷新；\n定位原因：响应数据格式不是 JSON 格式");
                return false;
            }

            if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
                $('.shangPing.jin').empty();
                var html = '',
                    item = {},
                    gift_image;

                if (outparams["Data"] === undefined || !outparams["Data"].length) {
                    layer.msg("赠品已全部被兑换", { time: 3000 });
                    return false;
                }
                var fcodes = ['0001', '0002', '0003', '0006', '0007', '0008', '0009', '0010', '0011', '0012', '0013', '0014', '0015'];
                for (var i = 0, len = outparams["Data"].length; i < len; i++) {
                    item = outparams["Data"][i];
                    gift_image = 'gift.png';
                    
                    /*
                     * FCODE: 0001, FGID: 1000022 FNAME: 乐高精美礼品 FNUM: 02101707090001
                     * FCODE: 0002, FGID: 1000023 FNAME: Hottoys主题抱枕 FNUM: 02101707090001
                     * FCODE: 0003, FGID: 1000024 FNAME: 乐高主题豪华套装 FNUM: 02101707090001
                     * FCODE: 0005, FGID: 1000040 FNAME: 日置名媛5888元体验券 FNUM: 02101707090001
                     * FCODE: 0006, FGID: 1000060 FNAME: FUN享嗲礼 消费满2000礼券 FNUM: 02101708010001
                     * FCODE: 0007, FGID: 1000061 FNAME: FUN享嗲礼 消费满5000礼券 FNUM: 02101708010001
                     * FCODE: 0008, FGID: 1000062 FNAME: FUN享嗲礼 消费满8000礼券 FNUM: 02101708010001
                     *
                     *
                     * FCODE: 0004, FGID: 1000025 FNAME: 抽奖 FNUM: 02101707090001
                     */

                    if (fcodes.indexOf($.trim(item["FCODE"])) >= 0) {
                        gift_image = 'data:image/jpg;base64,' + item["IMGCONTENT"];
                    }
                    console.log(item["FNAME"] + ' - ' + gift_image);
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
                    html += "  <img style='' src='" + gift_image + "'/><p><span class='gift_name'>" + item["FNAME"] + "</span></p>";
                    html += "  <div class='gou'>";
                    html += "  <img src='assets/images/gou.png' />";
                    html += "  </div>";
                    html += "</div>";
                }
                $('.shangPing.jin').append(html);

                var today_amount = parseInt($("#today_amount_guo").html());
                window.TKH.displayGiftWithAmount(today_amount);
            } else {
                if (outparams["FMSG"].length) {
                    layer.msg("『底层接口』提示：" + outparams["FMSG"], { time: 2000 });
                }
            }
        });
    },
    displayGiftWithAmount: function(today_amount) {
        var temp_gift_num = 0,
            ok_gift_num = 0;
        $(".xuzh_jin").each(function() {
            $(this).css({ "display": "none" });
        });

        $(".xuzh_jin").each(function() {
            temp_gift_num += 1;
            var gift_price = $(this).find(".min_amount").val();
            if (!isNaN(gift_price)) {
                if (today_amount >= parseFloat(gift_price)) {
                    $(this).css({ "display": "inline-block" });
                    ok_gift_num += 1;
                }
            }
        });

        if (temp_gift_num > 0 && ok_gift_num == 0) {
            layer.msg('消费金额暂无合适礼品可兑换！', {
                time: 3000 //2s后自动关闭
            });
        }
    },
    /*
     * 礼品兑换
     * 3.2.31 生成赠品发放单接口
     */
    genMallSupplyBill: function() {
        $("#queren").attr("disabled", "true");
        var clientCookie = window.localStorage.getItem('sClientCookie'),
            fcardnum = window.localStorage.getItem('sFCARDNUM'),
            fildate = (new Date()).format('yyyy.MM.dd hh:mm:ss'),
            currentQueryMember = window.localStorage.getItem('current_telphone'),
            currentQueryMemberJSON = {},
            questionnaire_remark = $("#questionnaire_remark").val();

        if (currentQueryMember && currentQueryMember.length) {
            currentQueryMemberJSON = JSON.parse(currentQueryMember);
        }

        var paies = [],
            gid, flowno, crttime, famt,
            post_params = {},
            post_param_consumes = [],
            post_param_gifts = [],
            store_input_records = [],
            wrapper_class;
        // 消费记录
        $(".xf").each(function() {
            if ($(this).hasClass("checked")) {
                var fgndgid = $(this).find(".guoxiao_gndgid").val(),
                    fgndcode = $(this).find(".guoxiao_gndcode").val(),
                    storename = $(this).find(".guoxiao_store").val(),
                    fflowno = $(this).find(".guoxiao_serialnum").val(),
                    famt = (new Number($(this).find(".guoxiao_amount").val())).toFixed(2),
                    focrtime = $(this).find(".guoxiao_datetime").val();
                wrapper_class = $(this).data("class");
                // (new Date()).format('yyyy.MM.dd hh:mm:ss');
                paies.push('{' +
                    '&quot;FGNDGID&quot;:&quot;' + fgndgid + '&quot;' +
                    ',&quot;FFLOWNO&quot;:&quot;' + fflowno + '&quot;' +
                    ',&quot;FOCRTIME&quot;:&quot;' + focrtime + '&quot;' +
                    ',&quot;FAMT&quot;:&quot;' + famt + '&quot;' +
                    '}');

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
                /*===updatecynthia0925 start===*/
                if (fcardnum !== null && fcardnum !== '-') {
                    store_input_records.push({
                        card_number: fcardnum,
                        store_code: fgndcode,
                        store_name: storename,
                        serial_num: fflowno,
                        gndgid: fgndgid,
                        real_amt: famt,
                        score: parseInt(famt),
                        datetime: focrtime,
                        wrapper_class: wrapper_class
                    });
                }
            }
        });
        if (store_input_records.length) {
            console.log(store_input_records);
            window.localStorage.setItem("scoreInputRecords", JSON.stringify(store_input_records));
        }
        // var fgndgid = '500021',
        //     fflowno = (new Date()).valueOf(),
        //     focrtime = (new Date()).format('yyyy.MM.dd hh:mm:ss');
        // var fsupplypay_params = '{&quot;FGNDGID&quot;:&quot;' + fgndgid + '&quot;,&quot;FFLOWNO&quot;:&quot;' + fflowno + '&quot;,&quot;FOCRTIME&quot;:&quot;' + focrtime + '&quot;}';

        // 礼品
        var gifts = [],
            gift_id, amount = 1;
        $(".xuzh_jin").each(function() {
            if ($(this).hasClass("xuanZhong")) {
                gift_id = $(this).find(".gift_id").val();
                gifts.push('{' +
                    '&quot;FLAGGID&quot;:&quot;' + gift_id + '&quot;' +
                    ',&quot;FAMOUNT&quot;:&quot;' + amount + '&quot;' +
                    ',&quot;FMEMO&quot;:&quot;' + questionnaire_remark + '&quot;' +
                    '}');

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
        /*==cynthia1017判断email没有就传空===*/
        if (!femail || typeof(femail) == "undefined" || femail == "undefined" || femail == null) { femail = ""; }
        /*==1017判断email没有就传空===*/
        var params = '{&quot;FMEMBER&quot;:&quot;' + fmember + '&quot;,\
                   &quot;FMOBILEPHONE&quot;:&quot;' + fmobilephone + '&quot;,\
                   &quot;FCARDID&quot;:&quot;' + fcardid + '&quot;,\
                   &quot;FEMAIL&quot;:&quot;' + femail + '&quot;,\
                   &quot;FCARDNUM&quot;:&quot;' + fcardnum + '&quot;,\
                   &quot;FNUM&quot;:&quot;' + fnum + '&quot;,\
                   &quot;FTOTAL&quot;:&quot;' + ftotal + '&quot;,\
                   &quot;FSUPPLYPAY&quot;:[' + paies.join(",") + '],\
                   &quot;FSUPPLYDTL&quot;:[' + gifts.join(",") + '],\
                   &quot;FCARDID&quot;:&quot;&quot;\
                 }',
            data = {
                params: params,
                command: 'CRMGenMallSupplyBill',
                async: true
            };

        /*===cynthia赠品发放单号绑定附件 start====*/
        var paramAttachid = JSON.parse(window.localStorage.getItem("storageImg"))["imgid"];
        for (var key in paramAttachid) {
            var img_params = '{' +
                '&quot;FMODULE&quot;:&quot;891&quot;' +
                ',&quot;FBILLNUM&quot;:&quot;' + fnum + '&quot;' +
                ',&quot;FATTACHID&quot;:&quot;' + paramAttachid[key] + '&quot;' +
                '}';
            var img_data = {
                params: img_params,
                command: 'CRMBandMediaAttach',
                async: true
            }
            window.TKH.hdClientCommand(img_data, function(result) {
                var errMsg = $(result).find('sErrMsg').text(),
                    resultstring = $(result).find('sOutParams').text(),
                    outparams = JSON.parse(resultstring);
            })
        }
        /*===cynthia赠品发放单号绑定附件 end====*/
        window.TKH.hdClientCommand(data, function(result) {
            var parkobj = [];
            var errMsg = $(result).find('sErrMsg').text(),
                resultstring = $(result).find('sOutParams').text(),
                outparams;

            try {
                outparams = JSON.parse(resultstring)
            } catch(e) {
                window.TKH.errorLayer("生成赠品发放单接口失败，请刷新后再次尝试；\n定位原因：响应数据格式不是 JSON 格式");
                return false;
            }

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
                    "gift_code": $(".xuanZhong").find(".gift_code").val(),
                    "consumes": post_param_consumes,
                    "gifts": post_param_gifts,
                    "redeem_state": "兑换成功",
                    "images": JSON.parse(window.localStorage.getItem("storageImg"))["imgurl"].join(",")
                };
                console.log("post_param" + post_param);
                window.setTimeout('', 2000);
                /*====兑换停车券 start====*/
                var scoreInputRecordsString = window.localStorage.getItem("scoreInputRecords"),
                    sdata = JSON.parse(scoreInputRecordsString);
                for (var key in sdata) {
                    var trant_time = sdata[key]["datetime"];
                    while (trant_time && trant_time.length &&
                        (trant_time.indexOf(".") >= 0 ||
                            trant_time.indexOf(":") >= 0 ||
                            trant_time.indexOf(" ") >= 0)) {
                        trant_time = trant_time.replace(".", "");
                        trant_time = trant_time.replace(":", "");
                        trant_time = trant_time.replace(" ", "");
                    }
                    var parklist = '{' +
                        '"FCARDNUM":"' + sdata[key]["card_number"] + '"' +
                        ',"FTRANTIME":"' + trant_time + '"' +
                        ',"FSHOPCODE":"' + sdata[key]["store_code"] + '"' +
                        ',"FVOUCHERNUM":"' + sdata[key]["serial_num"] + '"' +
                        ',"FREALAMT":"' + sdata[key]["real_amt"] + '"' +
                        '}';
                    parkobj.push(parklist);
                }
                var paramsobj = '{"detail_list":[' + parkobj + ']}';
                getpark(paramsobj, 0);
                /*====兑换停车券 end====*/
                window.ServerAPI.save_redeem(post_param, function() {
                    window.localStorage.removeItem("records");
                    window.setTimeout('window.TKH.redirect_to_with_timestamp("questionnaire.html?from=exchange.html")', 2000);
                });
                console.log("post_param" + post_param);
                //window.TKH.redirect_to_with_timestamp("questionnaire.html?from=exchange.html");
            } else {
                layer.msg("礼品兑换失败：" + outparams["FMSG"], {
                    time: 0,
                    btn: ['确定'],
                    btnAlign: 'c',
                    yes: function(index) {
                        layer.close(index);

                        window.localStorage.removeItem("records");
                        window.TKH.redirect_to_with_timestamp("questionnaire.html?from=exchange.html");
                    }
                });
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
            timeout: 15000,
            contentType: "text/xml; charset=UTF-8",
            success: function(xmlHttpRequest) {
                console.log('success');
                console.log(xmlHttpRequest);
                var errMsg = $(xmlHttpRequest).find('sErrMsg').text();
                var resultstring = $(xmlHttpRequest).find('sOutParams').text();
                console.log(resultstring);
                var outparams;

                try {
                    outparams = JSON.parse(resultstring)
                } catch(e) {
                    window.TKH.errorLayer("查询调查问卷模板失败，请刷新后再次尝试；\n定位原因：响应数据格式不是 JSON 格式");
                    return false;
                }

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
        var fnum = $("#fnum").val(),
            params = '{&quot;FCARDNUM&quot;:&quot;' + fcardnum + '&quot;,&quot;FNUM&quot;:&quot;' + fnum + '&quot;,&quot;FDATA&quot;:[' + fdata_params.join(',') + ']}',
            data = {
                params: params,
                command: 'CRMSaveCRMQuestionnaire',
                async: true
            };

        window.TKH.hdClientCommand(data, function(result) {
            var errMsg = $(result).find('sErrMsg').text(),
                resultstring = $(result).find('sOutParams').text(),
                outparams;

            try {
                outparams = JSON.parse(resultstring)
            } catch(e) {
                window.TKH.errorLayer("保存调查问卷信息失败，请刷新后再次尝试；\n定位原因：响应数据格式不是 JSON 格式");
                return false;
            }

            if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
                var questionPostParam = window.localStorage.getItem("questionPostParam");
                if (questionPostParam !== null) {
                    post_param = JSON.parse(questionPostParam);
                    window.ServerAPI.save_answer(post_param);
                }
                layer.msg('问卷提交成功', {
                    time: 0,
                    btn: ['确定'],
                    btnAlign: 'c',
                    yes: function(index) {
                        layer.close(index);

                        window.localStorage.removeItem("questionnaire");
                        window.localStorage.removeItem("questionnaire_state");
                        window.localStorage.removeItem("questionResult");
                        var params = window.TKH.params(),
                            /*==updatecynthia0926 start==*/
                            pagename = (params.skip_signature === "1" ? "survey-complete.html" : "signature.html");

                        window.TKH.redirect_to_with_timestamp(pagename);
                    }
                });
            } else {
                if (outparams["FMSG"].length) {
                    layer.msg("『底层接口』提示：" + outparams["FMSG"], { time: 3000 });
                }
            }
        });
    },
    signatureDone: function() {
        var signatureData = $("#signature").jSignature("getData", "base30")[1];

        if (signatureData.length == 0) {
            layer.msg('请您签字~', {
                time: 0,
                btn: ['好的'],
                btnAlign: 'c',
                yes: function(index) {
                    layer.close(index);
                }
            });
            return false;
        }

        layer.msg('确认签字无误？', {
            time: 0,
            btn: ['确定', '取消'],
            yes: function(index) {
                layer.close(index);
                layer.msg('保存数据...', { icon: 16, shade: 0.01, time: 1000 });

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

                window.setTimeout('', 1000);
                window.ServerAPI.save_signature(post_params, function() {
                    //layer.msg('页面跳转...', { icon: 16 ,shade: 0.01 ,time: 1000 });
                    //   alert("跳转");
                    window.TKH.redirect_to_with_timestamp('complete.html');
                });
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
    /*
     * 消费积分(单独积分页面）
     * 3.2.18 生成HDMall消费积分单 calcMallScoreExWeb这个函数可以去掉
     */
    /*  calcMallScoreExWeb: function(data_index, is_async, is_redirect, data_source) {
        $("#submitBtn").css("display", "none");
        $("#nextPage").css("display", "none");

        var scoreInputRecordsString = window.localStorage.getItem("scoreInputRecords"),
            scoreInputRecords = JSON.parse(scoreInputRecordsString),
            data = scoreInputRecords[data_index],
            currentQueryMember = window.localStorage.getItem('current_telphone'),
            currentQueryMemberJSON = {};
        if(currentQueryMember && currentQueryMember.length) {
          currentQueryMemberJSON = JSON.parse(currentQueryMember);
        }

        var trant_time = data.datetime;
        while(trant_time && trant_time.length &&
              (trant_time.indexOf(".") >= 0 ||
               trant_time.indexOf(":") >= 0 ||
               trant_time.indexOf(" ") >= 0)) {
          trant_time = trant_time.replace(".", "");
          trant_time = trant_time.replace(":", "");
          trant_time = trant_time.replace(" ", "");
        }
        var card_num = data.card_number,
            trant_time2 = (new Date()).format('yyyyMMddhhmmss'),
            store_code = data.store_code,
            store_name = data.store_name,
            serial_num = data.serial_num,
            real_amt = data.real_amt,
            score = data.score,
            fvoucher_type = '01',
            params = '{' +
                        '&quot;FCARDNUM&quot;:&quot;' + card_num + '&quot;' +
                        ',&quot;FVOUCHERTYPE&quot;:&quot;' + fvoucher_type + '&quot;' +
                        ',&quot;FVOUCHERNUM&quot;:&quot;' + serial_num + '&quot;' +
                        ',&quot;FCARDNUM&quot;:&quot;' + card_num + '&quot;' +
                        ',&quot;FTRANTIME&quot;:&quot;' + trant_time + '&quot;' +
                        ',&quot;FSHOPCODE&quot;:&quot;' + store_code + '&quot;' +
                        ',&quot;FREALAMT&quot;:&quot;' + real_amt + '&quot;' +
                        ',&quot;FSCORE&quot;:&quot;' + score + '&quot;' +
                      '}',
            ajax_data = {
              params: params,
              command: 'CRMCalcMallScoreExWeb',
              async: is_async
            };
        window.TKH.hdClientCommand(ajax_data, function(result) {
          var errMsg = $(result).find('sErrMsg').text(),
              resultstring = $(result).find('sOutParams').text(),
              outparams = JSON.parse(resultstring);

          console.log(data.wrapper_class);
          var $store_name = $("." + data.wrapper_class).find('.store-name');
          if(outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
            layer.tips("恭喜您积分成功", $store_name, { tips: [1, '#5FB878'], time: 0, tipsMore: true});
          } else {
            layer.tips("提示：" + outparams["FMSG"], $store_name, { tips: [1, '#faab20'], time: 0,  tipsMore: true});
          }

          var post_param              = {};
          post_param["name"]          = currentQueryMemberJSON["name"];
          post_param["card_number"]   = currentQueryMemberJSON["card_number"];
          post_param["serial_number"] = serial_num;
          post_param["amount"]        = real_amt;
          post_param["store_code"]    = store_code;
          post_param["store_name"]    = store_name;
          post_param["data_source"]   = data_source;
          post_param["images"]        = "668ca8f0-23d6-4010-878b-42a0dc0ac668.png";
          window.ServerAPI.save_consume(post_param, function(){});

          if(data_index == scoreInputRecords.length - 1) {

            $("#nextPage").css("display", "block");
            window.localStorage.removeItem("scoreInputRecords");
          } else {
            window.TKH.calcMallScoreExWeb(data_index + 1, is_async, is_redirect, data_source);
          }
        });
      },*/
    /*===判断是否重复积分输入框自动判断 start===*/
    isrepeatscore: function(data) {
        var trant_time = data[0].datetime;
        while (trant_time && trant_time.length &&
            (trant_time.indexOf(".") >= 0 ||
                trant_time.indexOf(":") >= 0 ||
                trant_time.indexOf(" ") >= 0)) {
            trant_time = trant_time.replace(".", "");
            trant_time = trant_time.replace(":", "");
            trant_time = trant_time.replace(" ", "");
        }
        var store_code = data[0].store_code,
            store_name = data[0].store_name,
            serial_num = data[0].serial_num,
            fvoucher_type = '01',
            layer_index;
        var data_params = '{' +
            '&quot;FVOUCHERTYPE&quot;:&quot;' + fvoucher_type + '&quot;' +
            ',&quot;FVOUCHERNUM&quot;:&quot;' + serial_num + '&quot;' +
            ',&quot;FTRANTIME&quot;:&quot;' + trant_time + '&quot;' +
            ',&quot;FSHOPCODE&quot;:&quot;' + store_code + '&quot;' +
            '}',
            ajax_data = {
                params: data_params,
                command: 'CRMCheckMallScoreExWeb',
                async: false
            };
        window.TKH.hdClientCommand(ajax_data, function(result) {
            var errMsg = $(result).find('sErrMsg').text(),
                resultstring = $(result).find('sOutParams').text(),
                outparams = JSON.parse(resultstring);
            var $wrapper_class = $("." + data[0].wrapper_class),
                $store_name = $wrapper_class.find('.store-name');
            if (outparams['FSTAT'] == "1" || outparams['FSTAT'] == 1) {
                layer.close(parseInt($wrapper_class.data("layerindex")));
                layer.close(parseInt($wrapper_class.find(".dq-control").eq(0).data("layerindex")));
                //updatecynthia0927 start layer_index = layer.tips(outparams['FMSG'], $store_name, { tips: [1, '#faab20'], time:5000, tipsMore: true });
                layer_index = layer.tips(outparams['FMSG'], $store_name, { tips: [1, '#faab20'], time: 0, tipsMore: true });
                $wrapper_class.data("layerindex", layer_index);
                // updatecynthia0927 end
                is_error = 1;
                isrepeat = 1;
                return false;
            } else {
                layer.close(parseInt($wrapper_class.data("layerindex")));
                layer.close(parseInt($wrapper_class.find(".dq-control").eq(0).data("layerindex")));
            }
        })
    },
    /*===判断是否重复积分输入框自动判断 end===*/
    /*
     * 消费积分(礼品兑换页面）
     * 3.2.18 生成HDMall消费积分单
     */
    calcMallScoreExWeb2: function(data_index, data_source) {
        var parkobj = [];
        /*===updatecynthia0926==*/
        var scoreInputRecordsString = window.localStorage.getItem("scoreInputRecords"),
            scoreInputRecords = JSON.parse(scoreInputRecordsString),
            data = scoreInputRecords,
            //data = scoreInputRecords[data_index],
            currentQueryMember = window.localStorage.getItem('current_telphone'),
            currentQueryMemberJSON = {};
        if (currentQueryMember && currentQueryMember.length) {
            currentQueryMemberJSON = JSON.parse(currentQueryMember);
        }
        var fdata = [],
            iscalc = false,
            isrepeat = 0,
            consumer_Arr = new Array();
        for (var key in data) {
            var trant_time = data[key].datetime;
            while (trant_time && trant_time.length &&
                (trant_time.indexOf(".") >= 0 ||
                    trant_time.indexOf(":") >= 0 ||
                    trant_time.indexOf(" ") >= 0)) {
                trant_time = trant_time.replace(".", "");
                trant_time = trant_time.replace(":", "");
                trant_time = trant_time.replace(" ", "");
            }
            var trant_time2 = (new Date()).format('yyyyMMddhhmmss'),
                store_code = data[key].store_code,
                store_name = data[key].store_name,
                serial_num = data[key].serial_num,
                real_amt = data[key].real_amt,
                score = data[key].score,
                fvoucher_type = '01';
            /*===updatecynthia0926 重复积分判断 start===*/
            var data_params = '{' +
                '&quot;FVOUCHERTYPE&quot;:&quot;' + fvoucher_type + '&quot;' +
                ',&quot;FVOUCHERNUM&quot;:&quot;' + serial_num + '&quot;' +
                ',&quot;FTRANTIME&quot;:&quot;' + trant_time + '&quot;' +
                ',&quot;FSHOPCODE&quot;:&quot;' + store_code + '&quot;' +
                '}',
                ajax_data = {
                    params: data_params,
                    command: 'CRMCheckMallScoreExWeb',
                    async: false
                };
            var params_list = '{' +
                '&quot;FVOUCHERTYPE&quot;:&quot;' + fvoucher_type + '&quot;' +
                ',&quot;FVOUCHERNUM&quot;:&quot;' + serial_num + '&quot;' +
                ',&quot;FTRANTIME&quot;:&quot;' + trant_time + '&quot;' +
                ',&quot;FSHOPCODE&quot;:&quot;' + store_code + '&quot;' +
                ',&quot;FREALAMT&quot;:&quot;' + real_amt + '&quot;' +
                ',&quot;FSCORE&quot;:&quot;' + score + '&quot;' +
                '}';
            window.TKH.hdClientCommand(ajax_data, function(result) {
                var errMsg = $(result).find('sErrMsg').text(),
                    resultstring = $(result).find('sOutParams').text(),
                    outparams = JSON.parse(resultstring);
                if (outparams['FSTAT'] == "1" || outparams['FSTAT'] == 1) {
                    var $wrapper_class = $("." + data[key].wrapper_class),
                        $store_name = $wrapper_class.find('.store-name');
                    //updatecynthia0927 start layer_index = layer.tips(outparams['FMSG'], $store_name, { tips: [1, '#faab20'], time:5000, tipsMore: true });
                    var layer_index = layer.tips(outparams['FMSG'], $store_name, { tips: [1, '#faab20'], time: 0, tipsMore: true });
                    $wrapper_class.find(".dq-control").eq(0).data("layerindex", layer_index);
                    // updatecynthia0927 end
                    is_error = 1;
                    isrepeat = 1;
                    return false;
                } else {
                    fdata.push(params_list);
                    var object = new Object();
                    object.serial_num = serial_num;
                    object.real_amt = real_amt;
                    object.store_code = store_code;
                    object.store_name = store_name;
                    object.FTRANTIME = trant_time;
                    consumer_Arr.push(object);
                    /*===updatecynthia0927 end===*/
                }
            })
            /*===updatecynthia0926 重复积分判断 end===*/
        }
        if (data.length > 0) {
            var card_num = data[0].card_number,
                params = '{&quot;FCARDNUM&quot;:&quot;' + card_num + '&quot;' +
                ',&quot;FDATA&quot;:[' + fdata + ']}',
                ajax_data = {
                    params: params,
                    command: 'CRMCalcMallScoreExWeb2',
                    async: false
                };
        } else {
            return false;
        }
        window.TKH.hdClientCommand(ajax_data, function(result) {
            var errMsg = $(result).find('sErrMsg').text(),
                resultstring = $(result).find('sOutParams').text(),
                outparams = JSON.parse(resultstring),
                $wrapper_class = $("." + data[0].wrapper_class);
            console.log("wrapper_class: " + data[0].wrapper_class);
            var $store_name = $wrapper_class.find('.store-name'),
                layer_index;
            layer.close(parseInt($wrapper_class.data("layerindex")));
            if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
                //  layer_index =layer.alert("本次积分已成功，本次积分"+outparams["FSCORE"]+"分", {time:5000});
                scorescc = "本次积分已成功，本次积分" + outparams["FSCORE"] + "分";
                $(".dq-wrapper").data("submited", "yes");
                /*==pdatecynthia0927 已积分成功的不允许删除和内容不允许修改===*/
                $(".dq-wrapper").find("button").attr('disabled', 'disabled');
                $(".dq-wrapper").find("input").attr('disabled', 'disabled');
                $(".dq-wrapper").find("input").removeAttr("onclick");
                /*===cynthia积分单和附件绑定 start====*/
                $(".input_imgid").each(function(i) {
                    var img_params = '{' +
                        '&quot;FMODULE&quot;:&quot;3833&quot;' +
                        ',&quot;FBILLNUM&quot;:&quot;' + outparams["FBILLNUM"] + '&quot;' +
                        ',&quot;FATTACHID&quot;:&quot;' + $(this).val() + '&quot;' +
                        '}';
                    var img_data = {
                        params: img_params,
                        command: 'CRMBandMediaAttach',
                        async: true
                    }
                    window.TKH.hdClientCommand(img_data, function(result) {
                        var errMsg = $(result).find('sErrMsg').text(),
                            resultstring = $(result).find('sOutParams').text(),
                            outparams = JSON.parse(resultstring);
                    })
                })
                /*===cynthia积分单和附件绑定 end====*/

            } else {
                if (isrepeat == 0 && outparams["FMSG"] != "消费记录不能为空") { layer_index = layer.tips("提示：" + outparams["FMSG"], $store_name, { tips: [1, '#faab20'], time: 0, tipsMore: true }); }
                $wrapper_class.data("submited", "error");
            }
            // 关闭历史提示框
            $wrapper_class.find("input").each(function() {
                var li = $(this).data("layerindex"),
                    li_number = parseInt(li);
                if (!isNaN(li_number)) { layer.close(li_number); }
            });
            $store_name.data("layerindex", layer_index);
            var img_source = [];
            $(".imgdataurl").each(function(i) {
                img_source.push($(this).val());
            })
            var post_param = {};
            /*===updatecynthia0927 start===*/
            for (i = 0; i < consumer_Arr.length; i++) {
                post_param["name"] = currentQueryMemberJSON["name"];
                post_param["card_number"] = currentQueryMemberJSON["card_number"];
                post_param["telphone"] = currentQueryMemberJSON["telphone"];
                post_param["serial_number"] = consumer_Arr[i]["serial_num"];
                post_param["amount"] = consumer_Arr[i]["real_amt"];
                post_param["store_code"] = consumer_Arr[i]["store_code"];
                post_param["store_name"] = consumer_Arr[i]["store_name"];
                post_param["data_source"] = data_source;
                post_param["images"] = img_source.join(",");
                post_param["fbillnum"] = outparams["FBILLNUM"];
                post_param["fscore"] = outparams["FSCORE"];
                /*===调用停车券 start===*/
                var parklist = '{' +
                    '"FCARDNUM":"' + currentQueryMemberJSON["card_number"] + '"' +
                    ',"FTRANTIME":"' + consumer_Arr[i]["FTRANTIME"] + '"' +
                    ',"FSHOPCODE":"' + consumer_Arr[i]["store_code"] + '"' +
                    ',"FVOUCHERNUM":"' + consumer_Arr[i]["serial_num"] + '"' +
                    ',"FREALAMT":"' + consumer_Arr[i]["real_amt"] + '"' +
                    '}';
                /*===调用停车券 end===*/
                parkobj.push(parklist);
                window.ServerAPI.save_consume(post_param, function() {});
            }
            var paramsobj = '{"detail_list":[' + parkobj + ']}';
            getpark(paramsobj, 5);
            /*====cynthia 生成HDMall消费积分单（多笔消费） start===*/
            window.TKH.checkRedeemStoreSubmited();
            /*====cynthia 生成HDMall消费积分单（多笔消费） end===*/
        });
    },
    /*
     * 消费积分(礼品兑换页面）
     * 2017.09.18 cynthia 拍照上传小票
     */

    uploadImg: function() {
        $("#files").click();
        //  uploadFile("#file");
    },
    uploadFile: function(obj) {
        if (obj.files.length > 0) {
            //var file = obj.files[0];
            if (obj.files.length > 10 || $(".imgitem").length + obj.files.length > 10) {
                alert("最多只能上传10张图片");
                return;
            }
            //判断类型是不是图片
            for (var i = 0; i < obj.files.length; i++) {
                var file = obj.files[i];
                if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
                var reader = new FileReader();
                var size = file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB";
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    var resultimg = this.result;
                    /*===压缩图片 ===*/
                    var hdimg = resultimg;
                    if (resultimg.length > maxsize) {
                        var imgnew = new Image();
                        imgnew.src = resultimg;
                        hdimg = compress(imgnew, file.type);
                    }
                    /*===压缩图片 end ===*/
                    /*===调图片接口 start===*/
                    var params = '{' +
                        '&quot;FATTACHNAME&quot;:&quot;' + file.name + '&quot;' +
                        ',&quot;FATTACH&quot;:&quot;' + hdimg + '&quot;' +
                        '}',
                        ajax_data = {
                            params: params,
                            command: 'CRMMediaService',
                            async: true
                        };
                    window.TKH.hdClientCommand(ajax_data, function(result) {
                        var errMsg = $(result).find('sErrMsg').text(),
                            resultstring = $(result).find('sOutParams').text();
                        outparams = JSON.parse(resultstring);
                        if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
                            $("#piclist").append("<input type='hidden' class='input_imgid' value='" + outparams["FATTACHID"] + "'>");
                            var nowId = outparams["FATTACHID"];
                            /*===显示图片接口 start===*/
                            var img = new Image();
                            img.src = resultimg;
                            //如果图片大小小于100kb，则直接上传
                            if (resultimg.length <= maxsize) {
                                img = null;
                                upload(resultimg, file.type, nowId);
                                return;
                            }
                            //      图片加载完毕之后进行压缩，然后上传
                            if (img.complete) {
                                imgcallback();
                            } else {
                                img.onload = imgcallback;
                            }

                            function imgcallback() {
                                var data = compress(img, file.type);
                                upload(data, file.type, nowId);
                                img = null;
                            }
                            /*===显示图片接口 end===*/
                        } else {
                            // layer_index = layer.tips("提示：" + outparams["FMSG"], $store_name, { tips: [1, '#faab20'], time: 0,  tipsMore: true});
                            var layer_index = layer.alert("提示：图片上传失败" + outparams["FMSG"] + "请重新上传图片", { time: 5000 });
                        }
                    })
                    /*===调图片接口 end===*/
                }
            }

        }
    },
    finishChoice: function(data, nowId) {
        for (var i = 0, len = data.length; i < len; i++) {
            var nowDate = (new Date()).getTime();
            var str = "<div class='boarditem_c_i imgitem' id='picbox" + nowDate + "'>";
            str += "<img id='img" + nowDate + "' src='" + picServer + '/images/tkh/' + data[i] + "' onclick='window.TKH.showLarge()' code='" + data[i] + "'/>";
            str += "<span class='absolute ico loadingico' id='loading" + nowDate + "' style='top:40%;text-align:center;left:0;right:0;'></span>";
            str += "</div>";
            $("#piclist").prepend($(str));
            var str = "<span class='closeico' onclick='window.TKH.delPic($(this))' data='" + nowId + "'></span>";
            $("#picbox" + nowDate).prepend(str);
            $("#piclist").append('<input type="hidden" class="imgdataurl" value="' + data[i] + '">');
        }
        //数量等于10个，隐藏上传按钮
        if ($(".imgitem").length == 10) { $(".boarditem_c_add").hide(); }
    },
    delPic: function(obj) {
        $(".input_imgid").each(function(i) {
            if ($(".input_imgid").eq(i).val() == obj.attr("data")) { $(".input_imgid").eq(i).remove(); }
        })
        $(".imgdataurl").each(function(i) {
            if ($(".imgdataurl").eq(i).val() == obj.next("img").attr("code")) { $(".imgdataurl").eq(i).remove(); }
        })
        obj.parents(".boarditem_c_i").remove();
        if ($(".imgitem").length < 10) {
            $(".boarditem_c_add").show();
        }
    },
    showLarge: function() {
        if (event.target.getAttribute("src") != "") {
            $("#largePic").attr("src", event.target.getAttribute("src"));
            $(".largebox").show();
        }
        $(".imgclose").click(function() {
            $(".largebox").hide();
        })
    },
    /*
     * 消费积分(礼品兑换页面）
     * 2017.09.18 cynthia 拍照上传小票 end
     */
    refreshRedeemScoreInput: function(allow_all) {
        var fcardnum = window.localStorage.getItem('sFCARDNUM');
        var name = '',
            amount = '',
            serialnum = '',
            serialnums = [],
            store_and_datetime = '',
            store_and_datetimes = [],
            gndgid = '',
            gndcode = '',
            datetime = '',
            record = {},
            records = [],
            is_error = 0,
            serial_num_with_store_code,
            wrapper_class,
            store_input_records = [],
            layer_index;
        $(".dq-wrapper").each(function() {
            /*
             *
             * allow_all:
             *     - true: 记录所有消费项
             *     - false:
             *         - submited === yes: 跳过已经提交成功的消费项
             */
            if (!allow_all && $(this).data("submited") === "yes") {
                // return false;
                // skip
            } else {
                name = $(this).find("input.store-name").val();
                serialnum = $(this).find("input.serial-num").val();
                amount = $(this).find("input.amount").val();
                gndgid = $(this).find("input.gndgid").val();
                gndcode = $(this).find("input.gndcode").val();
                datetime = $(this).find("input.datetime").val();
                store_and_datetime = gndgid + datetime;
                is_error = 0,
                    wrapper_class = $(this).data("class");
                if (!name.length) {
                    layer_index = layer.tips('店铺名称不能为空', $(this).find('.store-name'), { tips: [3, '#faab20'], time: 0 });
                    $(this).find('.store-name').data("layerindex", layer_index);
                    is_error = 1;
                    return false;
                }

                if (!serialnum.length) {
                    layer_index = layer.tips('流水号不能为空', $(this).find('.serial-num'), { tips: [3, '#faab20'], time: 0 });
                    $(this).find('.serial-num').data("layerindex", layer_index);
                    is_error = 1;
                    return false;
                }

                if (!amount.length) {
                    layer_index = layer.tips('请正确填写金额', $(this).find('.amount'), { tips: [3, '#faab20'], time: 0 });
                    $(this).find('.amount').data("layerindex", layer_index);
                    is_error = 1;
                    return false;
                }

                if (serialnum.length > 30) {
                    layer_index = layer.tips('请输入正确的流水号', $(this).find('.serial-num'), { tips: [3, '#faab20'], time: 0 });
                    $(this).find('.serial-num').data("layerindex", layer_index);
                    is_error = 1;
                    return false;
                }
                serial_num_with_store_code = gndcode + serialnum;
                if (serialnums.indexOf(serial_num_with_store_code) >= 0) {
                    layer_index = layer.tips('流水号重复', $(this).find('.serial-num'), { tips: [3, '#faab20'], time: 0 });
                    $(this).find('.serial-num').data("layerindex", layer_index);
                    is_error = 1;
                    return false;
                }
                /* updatecynthia if(store_and_datetimes.indexOf(store_and_datetime) >= 0) {
                     layer_index = layer.tips('请勿重复积分', $(this).find('.store-name'), { tips: [3, '#faab20'], time: 0 });
                     $(this).find('.serial-num').data("layerindex", layer_index);
                     is_error = 1;
                     return false;
                   }*/
                serialnums.push(serial_num_with_store_code);
                store_and_datetimes.push(store_and_datetime);
                record = {};
                record["name"] = name;
                record["serialnum"] = serialnum;
                record["amount"] = amount;
                record["gndgid"] = gndgid;
                record["gndcode"] = gndcode;
                record["datetime"] = datetime;
                records.push(record);
                /*==updatecynthia0926 start===*/
                store_input_records.push({
                    card_number: fcardnum,
                    store_code: gndcode,
                    gndgid: gndgid,
                    store_name: name,
                    serial_num: serialnum,
                    real_amt: amount,
                    score: parseInt(amount),
                    datetime: datetime,
                    wrapper_class: wrapper_class
                });
                /*==updatecynthia0926 end===*/
            }
        });

        if (is_error) { return false; }
        /*===1016 start===*/
        if (records.length) {
            window.localStorage.setItem("records", JSON.stringify(records));
        }
        if (store_input_records.length) { window.localStorage.setItem("scoreInputRecords", JSON.stringify(store_input_records)); }
    },
    skipStoreToExchange: function() {
        window.TKH.c(true);
        window.TKH.redirect_to_with_timestamp('exchange.html');
    },
    skipStoreToScoreComplete: function() {
        window.TKH.refreshRedeemScoreInput(true);
        window.TKH.redirect_to_with_timestamp('score-complete.html');
    },
    backToUpdateScoreInput: function(data_source) {
        $(".layui-layer-close").click();

        window.TKH.refreshRedeemScoreInput(false);
        window.TKH.calcMallScoreExWeb2(0, data_source);
    },
    checkRedeemStoreSubmited: function() {
        var is_all_ok = true;
        $(".dq-wrapper").each(function() {
            // 跳过已经提交成功的消费项
            if ($(this).data("submited") !== "yes") {
                is_all_ok = false
            }
        });
        $(".submit-btn").removeAttr("disabled");
        $(".submit-btn").html(is_all_ok ? "下一页<br/>Next" : "提交<br/>Submit");

        if (is_all_ok) {
            //window.localStorage.removeItem("scoreInputRecords");
            $(".submit-btn").css("display", "block");
            $(".skip-btn").css("display", "none");
        } else {
            $(".submit-btn").css("display", "none");
            $(".skip-btn").css("display", "block");
        }
    },
    // 3.2.7 查询有效商铺信息，后台同步使用该接口
    queryStoreForSync: function(fpageindex) {
        var clientCookie = window.localStorage.getItem('sClientCookie');
        fstorecode = window.TKH.storeCode,
            fpagesize = 100;

        if (clientCookie === null || !clientCookie.length) {
            window.TKH.loginWithinAdmin();
        }

        clientCookie = window.localStorage.getItem('sClientCookie');
        if (clientCookie === null || !clientCookie.length) {
            alert("用户二次验证失败");
            return false;
        };

        if (fpageindex === 1) {
            $("#sync_state").html("开始同步店铺...");
            window.ServerAPI.truncate_table('store');
        } else {
            var already_synced_store_num = (fpageindex - 1) * fpagesize;
            $("#sync_state").html("已同步 " + already_synced_store_num + " 家店铺，同步中...");
        }
        var params = '{&quot;FSTORECODE&quot;:&quot;' + fstorecode + '&quot;,&quot;FPAGEINDEX&quot;:&quot;' + fpageindex + '&quot;,&quot;FPAGESIZE&quot;:&quot;' + fpagesize + '&quot;}',
            data = {
                params: params,
                command: 'QueryMallGndWeb',
                async: true
            };
        window.TKH.hdClientCommand(data, function(result) {
            var errMsg = $(result).find('sErrMsg').text(),
                resultstring = $(result).find('sOutParams').text(),
                outparams = JSON.parse(resultstring);

            if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
                var fdata = outparams["FDATA"],
                    post_param = {};
                for (i = 0; i < fdata.length; i++) {
                    post_param = {};
                    post_param["name"] = fdata[i].GNDNAME;
                    post_param["gid"] = fdata[i].GNDGID;
                    post_param["code"] = fdata[i].GNDCODE;
                    post_param["rn"] = fdata[i].RN;
                    post_param["sync_type"] = '手工同步';
                    window.ServerAPI.save_store(post_param);
                }

                if (fdata.length >= fpagesize) {
                    window.TKH.queryStoreForSync(fpageindex + 1)
                } else {
                    var synced_store_num = (fpageindex - 1) * fpagesize + fdata.length;
                    $("#sync_state").html((new Date()).format("[yyyy-MM-dd hh:mm:ss] 同步完成 ") + synced_store_num + " 份店铺");
                }

            } else {
                if (outparams["FMSG"].length) {
                    layer.msg("『底层接口』提示：" + outparams["FMSG"], { time: 2000 });
                }
            }
        });
    },
    // 3.2.30 查询有效的赠品促销接口（P.53)
    // 兑奖页面，查询可用兑奖项
    queryGiftForSync: function() {
        var clientCookie = window.localStorage.getItem('sClientCookie');
        if (clientCookie === null || !clientCookie.length) {
            window.TKH.loginWithinAdmin();
        }

        clientCookie = window.localStorage.getItem('sClientCookie');
        if (clientCookie === null || !clientCookie.length) {
            alert("用户二次验证失败");
            return false;
        };

        $("#sync_state").html("开始同步礼品...");
        window.ServerAPI.truncate_table('gift');
        var ffildate = (new Date()).format('yyyy.MM.dd hh:mm:ss'),
            params = '{&quot;FFILDATE&quot;:&quot;' + ffildate + '&quot;}',
            data = {
                params: params,
                command: 'CRMQueryMallGiftPromInfo',
                async: true
            };

        window.TKH.hdClientCommand(data, function(xmlHttpRequest) {
            var resultstring = $(xmlHttpRequest).find('sOutParams').text(),
                outparams = JSON.parse(resultstring);

            if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
                var fdata = outparams["Data"],
                    post_param = {};
                for (i = 0; i < fdata.length; i++) {
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
                    post_param['theme_code'] = fdata[i].FGID;
                    post_param['theme_name'] = fdata[i].FSUBJECT;
                    post_param['begin_date'] = fdata[i].FBGNTIME;
                    post_param['end_date'] = fdata[i].FENDTIME;
                    post_param['address'] = fdata[i].FLOCATION;
                    post_param['gift_code'] = fdata[i].FCODE;
                    post_param['gift_name'] = fdata[i].FNAME;
                    post_param['count'] = fdata[i].FQTY;
                    post_param['min_amount'] = fdata[i].FLOWAMT;
                    post_param['price'] = fdata[i].FPRICE;
                    window.ServerAPI.save_gift(post_param);
                }

                $("#sync_state").html((new Date()).format("[yyyy-MM-dd hh:mm:ss] 同步完成 ") + fdata.length + " 份礼品");
            } else {
                if (outparams["FMSG"].length) {
                    layer.msg("『底层接口』提示：" + outparams["FMSG"], { time: 2000 });
                }
            }
        });
    },
    questionnaireOptionType: function(type) {
        type = parseInt(type);
        if (type === 0) {
            return "单选题";
        } else if (type === 1) {
            return "多选题";
        } else if (type === 2) {
            return "填空题";
        } else {
            return type;
        }
    },
    // 3.2.32 查询调查问卷模板信息
    queryQuestionnaireForSync: function() {
        var clientCookie = window.localStorage.getItem('sClientCookie');
        if (clientCookie === null || !clientCookie.length) {
            window.TKH.loginWithinAdmin();
        }

        clientCookie = window.localStorage.getItem('sClientCookie');
        if (clientCookie === null || !clientCookie.length) {
            alert("用户二次验证失败");
            return false;
        };

        $("#sync_state").html("开始同步问卷...");
        window.ServerAPI.truncate_table('questionnaire');

        var fname = '',
            params = '{&quot;FNAME&quot;:&quot;' + fname + '&quot;}',
            data = {
                params: params,
                command: 'CRMQueryCRMQuestionnaireMode',
                async: true
            };
        window.TKH.hdClientCommand(data, function(xmlHttpRequest) {
            var errMsg = $(xmlHttpRequest).find('sErrMsg').text(),
                resultstring = $(xmlHttpRequest).find('sOutParams').text(),
                outparams = JSON.parse(resultstring);

            if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
                var fdata = outparams["DATA"],
                    post_param = {},
                    data_items = [],
                    data_item = {},
                    data_item_options = [];

                // 问卷
                for (var i = 0, ilen = fdata.length; i < ilen; i++) {
                    post_param['questionnaire_code'] = fdata[i].FNUM;
                    post_param['questionnaire_name'] = fdata[i].FNAME;

                    data_items = fdata[i].MODEDTL;

                    $("#sync_state").html("正在同步 " + (i + 1) + "/" + ilen + " 份问卷...");
                    // 题目
                    for (var j = 0, jlen = data_items.length; j < jlen; j++) {
                        post_param['subject_index'] = (j + 1);
                        post_param['subject_id'] = data_items[j].FTITLEID;
                        post_param['subject'] = data_items[j].FTITLE;
                        post_param['subject_type'] = window.TKH.questionnaireOptionType(data_items[j].FTYPE);
                        post_param['questionnaire_content'] = JSON.stringify(fdata[i]);
                        data_item = data_items[i].OPTIONDTL;
                        data_item_options = [];
                        for (var k = 0, klen = data_item.length; k < klen; k++) {
                            data_item_options.push({
                                "option_index": (k + 1),
                                "option_id": data_item[k].FVALUEID,
                                "option_value": data_item[k].FVALUE
                            });
                        }
                        post_param['options'] = data_item_options;
                        window.ServerAPI.save_questionnaire(post_param);
                    }
                    $("#sync_state").html((new Date()).format("[yyyy-MM-dd hh:mm:ss] 同步完成 ") + fdata.length + " 份问卷");
                }
            } else {
                if (outparams["FMSG"].length) {
                    layer.msg("『底层接口』提示：" + outparams["FMSG"], { time: 2000 });
                }
            }
        });
    },
    // 查询会员信息页面，第二个页签
    // 3.2.4 积分明细查询
    queryCardScoreDetails: function() {
        var fcardnum = window.localStorage.getItem('sFCARDNUM'),
            now = new Date(),
            start_date = now.format('yyyy.MM.dd'),
            end_date;

        now.setTime(now.valueOf() - 30 * 24 * 60 * 60 * 1000);
        /* var params = "[\\]\nFACCOUNTNO=" + fcardnum + "\nFSCORESORT=-\nFSTARTDATE=" + "2017.05.04 05:11:11" + "\nFENDTDATE=" + start_date + "\n",*/
        var params = '{"FCARDNUM":"' + fcardnum + '","FBEGINDATE":"2017.05.04","FENDDATE":"' + start_date + '","FPAGEINDEX":"0","FPAGESIZE":"100"}',
            data = {
                params: params,
                command: 'QueryScoreHstJSON2',
                async: true
            };
        window.TKH.hdClientCommand(data, function(result) {
            /*      var resultstring = result.FDATA;
                  var temp_array = resultstring,
                      temp_str,
                      limit_time = 0;
                  $("#ScoreInfo > div:eq(1)").html('');
                  for(var len = temp_array.length, i = len - 1; i >= 0; i --) {
                    temp_str = temp_array[i];
                    var mm1 = temp_str["TRANDATE"],
                        mm2 = temp_str["SCORE"],
                        input_string = '';
                    if(mm1) {
                      if(limit_time < 5) {
                        input_string = "<input disabled='disabled' type=text value='" + mm1[1] + '    ' + mm2[1] + "'>";
                        $("#ScoreInfo > div:eq(1)").append(input_string);
                      }
                      limit_time += 1;
                    }
                  }*/
            var resultstring = $(result).find('sOutParams').text(),
                data = JSON.parse(resultstring)["FDATA"],
                limit_time = 0;
            $("#ScoreInfo > div:eq(1)").html('');
            $.each(data, function(index, item) {
                var mm1 = item.TRANDATE,
                    mm2 = item.SCORE,
                    input_string = '';
                if (mm1) {
                    if (limit_time < 5) {
                        input_string = "<input disabled='disabled' type=text value='" + mm1 + '    ' + mm2 + "'>";
                        $("#ScoreInfo > div:eq(1)").append(input_string);
                    }
                    limit_time += 1;
                }
            })
        });
    },
    // 查询会员信息页面，第三个页签
    // 1.查询赠品发放信息接口
    queryLAGSupplyInfo: function() {
        var clientCookie = window.localStorage.getItem('sClientCookie'),
            fcardnum = window.localStorage.getItem('sFCARDNUM'),
            currentQueryMember = window.localStorage.getItem('current_telphone'),
            currentQueryMemberJSON = {};

        if (currentQueryMember && currentQueryMember.length) {
            currentQueryMemberJSON = JSON.parse(currentQueryMember);
        } else {
            layer.msg('已查询会员信息不全', { icon: 16, shade: 0.01, time: 1000 });
            return false;
        }
        var params = '{&quot;FPHONE&quot;:&quot;' + currentQueryMemberJSON["telphone"] + '&quot;,&quot;FPAGEINDEX&quot;:&quot;' + 1 + '&quot;,&quot;FPAGESIZE&quot;:&quot;' + 10 + '&quot;}',
            data = {
                params: params,
                command: 'CRMQueryLAGSupplyInfo',
                async: true
            };

        window.TKH.hdClientCommand(data, function(result) {
            var errMsg = $(result).find('sErrMsg').text(),
                resultstring = $(result).find('sOutParams').text(),
                outparams;

            try {
                outparams = JSON.parse(resultstring)
            } catch(e) {
                window.TKH.errorLayer("查询赠品发放信息失败，请刷新后再次尝试；\n定位原因：响应数据格式不是 JSON 格式");
                return false;
            }

            if (outparams["FRESULT"] === 0 || outparams["FRESULT"] === "0") {
                var fdata = outparams["FDATA"];

                $("#ExchangeInfo > div:eq(0)").html('');
                $("#ExchangeInfo > div:eq(1)").html('');
                var input_items = [],
                    focrtime,
                    gift;
                for (var i = 0, len = fdata.length; i < len; i++) {
                    focrtime = fdata[i]["FOCRTIME"];
                    for (var j = 0, jlen = fdata[i]["FGIFT"].length; j < jlen; j++) {
                        gift = fdata[i]["FGIFT"][j];
                        input_items.push("<input disabled='disabled' type=text value='" + focrtime + '    ' + gift["FGIFTNAME"] + ' x ' + gift["FQTY"] + "'>");
                    }
                }
                for (var i = 0; i < 9; i++) {
                    if (i < 5) {
                        $("#ExchangeInfo > div:eq(0)").append(input_items[i]);
                    } else {
                        $("#ExchangeInfo > div:eq(1)").append(input_items[i]);
                    }
                }
            } else {
                if (outparams["FMSG"].length) {
                    layer.msg("『底层接口』提示：" + outparams["FMSG"], { time: 2000 });
                }
            }
        });
    }
}
window.TKH.initialized();
window.TKH.version_info();
//阻止缩放
/*
window.onload=function () {
    document.addEventListener('touchstart',function (event) {
        if(event.touches.length>1){
            event.preventDefault();
        }
    })
    var lastTouchEnd=0;
    document.addEventListener('touchend',function (event) {
        var now=(new Date()).getTime();
        if(now-lastTouchEnd<=300){
            event.preventDefault();
        }
        lastTouchEnd=now;
    },false)
}
*/