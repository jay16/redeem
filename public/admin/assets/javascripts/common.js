var url = window.location,
    paths = window.location.pathname.split('/'),
    current_path = paths[paths.length - 1],
    login_state = window.localStorage.getItem("logined"),
    layer_index = layer.load(1),
    timestamp = (new Date()).valueOf();

if (login_state && login_state.length && login_state === 'yes') {
    if (current_path === 'login.html') {
        window.location.href = 'index.html?timestamp=' + timestamp;
    } else {
        var href_path = '';
        $('ul.sidebar-menu a').each(function() {
            href_path = ($(this).attr("href") ? $(this).attr("href").split('?')[0] : '')
            if (href_path === current_path) {
                $(this).parent("li").addClass('active');
                if ($(this).parent().parent().attr('class') === 'treeview-menu') {
                    $(this).parent().parent().parent().addClass('active');
                }
            }
        });
    }

    var expiredIn = window.localStorage.getItem("expiredIn");
    if (expiredIn === null || (new Date()).valueOf() >= parseInt(expiredIn)) {
        window.TKH.loginWithinIPad(current_path);
    }

    var username = window.localStorage.getItem("username");
    $(".current-username").html(username);

    if(username === 'superadmin') {
      $(".li-logger, .todo-li-api-mapping").removeClass("hidden");
    }
} else {
    if (current_path !== 'login.html') {
        window.location.href = 'login.html?timestamp=' + timestamp;
    } else {
        var username = window.localStorage.getItem("username"),
            password = window.localStorage.getItem("password"),
            is_remember = window.localStorage.getItem("remember");

        if (username && username.length) {
            $("#username").val(username);
        }
        if (is_remember && is_remember.length && is_remember === 'true') {
            if (password && password.length) {
                $("#password").val(password);
            }
            $("#remember").attr("checked", true);
        }
    }
}

layer.close(layer_index);