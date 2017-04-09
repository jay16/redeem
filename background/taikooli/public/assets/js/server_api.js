window.ServerAPI = {
  server: 'http://localhost:4567',
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
