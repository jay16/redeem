
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
    //显示重置密码
    $('.wj,.hf').click(function() {
        $('.chongshe').fadeIn(200);
        if ($(this).hasClass('hf')) {
            $('.yc').hide();
            $('.xs').show();
            $('.gn').css('WebkitAnimation', 'yd1 0.4s forwards');
        }
    });
    $('.gb').click(function() {
        $('.xg').fadeOut(200);
    });
    $('.dl').click(function() {
        $('.yc').hide();
        $('.xs').show();
        $('.gn').css('WebkitAnimation', 'yd1 0.4s forwards');
    });
    $('.chongshemima').on('click', function() {
        var username = $('#xg_mz').val();
        var email = $('#xg_yj').val();
        if (!username || !email) {
            layer.msg('邮箱或用户名不能为空！', {
                time: 2000, //2s后自动关闭
            });
            return false;
        }
    });
})
