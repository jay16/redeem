window.ServerAPI = {
  server: 'http://123.56.91.131:4567',
  login: function() {
    var email = $("#email").val(),
        password = $("#password").val(),
        is_remember = $("#remember").prop('checked'),
        params = {
          "email": email,
          "password": password
        },
        errors = [];
    if(!email.length) { errors.push("请填写登录邮箱"); }
    if(!password.length) { errors.push("请填写登录密码"); }


    if(errors.length) {
      alert(errors.join("\n"));
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
          window.localStorage.setItem("email", email);
          window.localStorage.setItem("password", password);
          window.localStorage.setItem("remember", is_remember);
          window.location.href = "manager.shtml";
        } else {
          alert(xhr.info);
        }
      }
    });
    return false;
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
  }
}

if(window.location.protocol === 'file:') {
  window.ServerAPI.server = 'http://localhost:4567';
}
