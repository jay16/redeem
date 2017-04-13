window.ServerAPI = {
  version: '0.0.3',
  server: 'http://123.56.91.131:4567',
  login: function(type) {
    var username = $("#username").val(),
        password = $("#password").val(),
        is_remember = $("#remember").prop('checked'),
        params = {
          "username": username,
          "password": password
        };
    if (!username.length) {
      layer.tips('请输入用户名', '#username', {
        tips: [2, '#faab20']
      });
      return false;
    }
    if (!password.length) {
      layer.tips('请输入密码', '#password', {
        tips: [2, '#faab20']
      });
      return false;
    }

    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/authen/login",
      type: 'post',
      async: false,
      dataType: 'json',
      data: params,
      timeout: 10000,
      success: function(xhr) {
        if(xhr.code === 200) {
          window.localStorage.setItem("username", username);
          window.localStorage.setItem("password", password);
          window.localStorage.setItem("remember", is_remember);
          window.localStorage.setItem("logined", "yes");
          if(type === 'ipad') {
            window.TKH.loginWithinIPad('search.html');
          }
          if(type === 'background') {
            window.location.href = 'manager.html';
          }
        } else {
          alert(xhr.info);
        }
      }
    });
    return false;
  },
  logout: function() {
    layer.msg('确认退出登录', {
      time: 0,
      btn: ['确定', '取消'],
      yes: function(index) {
        window.localStorage.setItem("logined", "no");
        layer.close(index);
        window.location.href = 'login.html';
      }
    });
  },
  members: function() {
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/members",
      type: 'get',
      async: false,
      dataType: 'json',
      data: data,
      timeout: 10000,
      success: function(xhr) {
        console.log(xhr);
      }
    });
  },
  save_member: function(data) {
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/member",
      type: 'post',
      async: true,
      dataType: 'json',
      data: data,
      timeout: 10000,
      success: function(xhr) {
        console.log(xhr);
      }
    });
  },
  save_gift: function(data) {
    console.log('-------->save_gift<----------');
    console.log(data);
    console.log('--------<save_gift>----------');
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/gift",
      type: 'post',
      async: true,
      dataType: 'json',
      data: data,
      timeout: 10000,
      success: function(xhr) {
        console.log(xhr);
      }
    });
  },
  save_store: function(data) {
    console.log('-------->save_store<----------');
    console.log(data);
    console.log('--------<save_store>----------');
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/store",
      type: 'post',
      async: true,
      dataType: 'json',
      data: data,
      timeout: 10000,
      success: function(xhr) {
        console.log(xhr);
      }
    });
  },
  save_questionnaire: function(data) {
    console.log('-------->save_questionnaire<----------');
    console.log(data);
    console.log('--------<save_questionnaire>----------');
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/questionnaire",
      type: 'post',
      async: true,
      dataType: 'json',
      data: data,
      timeout: 10000,
      success: function(xhr) {
        console.log(xhr);
      }
    });
  },
  save_redeem: function(data) {
    console.log('-------->save_redeem<----------');
    console.log(data);
    console.log('--------<save_redeem>----------');
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/redeem",
      type: 'post',
      async: false,
      dataType: 'json',
      data: data,
      timeout: 10000,
      success: function(xhr) {
        console.log(xhr);
      }
    });
  },
  save_answer: function(data) {
    console.log('-------->save_answer<----------');
    console.log(data);
    console.log('--------<save_answer>----------');
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/answer",
      type: 'post',
      async: false,
      dataType: 'json',
      data: data,
      timeout: 10000,
      success: function(xhr) {
        console.log(xhr);
      }
    });
  },
  truncate_table: function(table_name) {
    console.log('-------->truncate_table<----------');
    console.log(table_name);
    console.log('--------<truncate_table>----------');
    $.ajax({
      cache: false,
      url: window.ServerAPI.server + "/api/v1/truncate/" + table_name,
      type: 'post',
      async: true,
      dataType: 'json',
      timeout: 10000,
      success: function(xhr) {
        console.log(xhr);
      }
    });
  }
}

if(window.location.protocol === 'file:') {
  window.ServerAPI.server = 'http://localhost:4567';
}
