window.onload = function() {
    $('#jiaZai').hide();
    $('#main').show();
}
$(function() {
    var dt = new Date();
    var m = new Array("Jan ", "Feb ", "Mar ", "Apr ", "May ", "Jun ", "Jul ", "Aug ", "Spt ", "Oct ", "Nov ", "Dec ");
    var mn = dt.getMonth();
    var dn = dt.getDate();
    $('.time').html(m[mn] + "&nbsp;" + dn + '，' + dt.getFullYear());

    //右侧功能栏隐藏显示
    $('.xs').click(function() {
        $(this).hide();
        $('.yc').show();
        $('.gn').css('WebkitAnimation', 'yd2 0.4s forwards');
    });
    $('.yc').click(function() {
        $(this).hide();
        $('.xs').show();
        $('.gn').css('WebkitAnimation', 'yd1 0.4s forwards');
    });

    //侧栏操作
    $('.lp').click(function() {
        $('.yc').hide();
        $('.xs').show();
        $('.gn').css('WebkitAnimation', 'yd1 0.4s forwards');
    });
    $('.mm').click(function() {
        $('.yc').hide();
        $('.xs').show();
        $('.gn').css('WebkitAnimation', 'yd1 0.4s forwards');
        $('.xg').fadeIn(200);
    });
    $('.gb').click(function() {
        $('.xg').fadeOut(200);
    });

    var myDate = new Date();
    $('.info p').html(myDate.toLocaleDateString());

    //显示重置密码
    $('.wj, .hf').click(function() {
        $('.chongshe').fadeIn(200);
        if ($(this).hasClass('hf')) {
            $('.yc').hide();
            $('.xs').show();
            $('.gn').css('WebkitAnimation', 'yd1 0.4s forwards');
        }
    });
    $('.dl').click(function() {
        $('.yc').hide();
        $('.xs').show();
        $('.gn').css('WebkitAnimation', 'yd1 0.4s forwards');
    });
})

var url = window.location,
    paths = window.location.pathname.split('/'),
    current_path = paths[paths.length-1],
    login_state = window.localStorage.getItem("logined");

if(login_state && login_state.length && login_state === 'yes') {
  if(current_path === 'login.html') {
    window.TKH.redirect_to_with_timestamp('search.html');
  }

  var expiredIn = window.localStorage.getItem("expiredIn");
  if(expiredIn === null || (new Date()).valueOf() >= parseInt(expiredIn)) {
    window.TKH.loginWithinIPad(current_path);
  }

  $('#userGid').html(window.localStorage.getItem("username"));
} else {
  if(current_path !== 'login.html') {
    window.TKH.redirect_to_with_timestamp('login.html');
  } else {
    var username = window.localStorage.getItem("username"),
        password = window.localStorage.getItem("password");

    if(username && username.length) {
      $("#username").val(username);
    }
  }
}
