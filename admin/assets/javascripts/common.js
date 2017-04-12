var AJAXCITYURL = "../taikooli/public/common/ajaxcity";
var AJAXDISITRCTURL = "../taikooli/public/common/ajaxdistrict";

var url = window.location,
    paths = window.location.pathname.split('/'),
    current_path = paths[paths.length-1];
console.log(current_path);

var element = $('ul.sidebar-menu a').filter(function() {
  console.log($(this).attr("href"));
  if ($(this).attr("href") === current_path) {
    $(this).parent().addClass('active');
    if ($(this).parent().parent().attr('class') == 'treeview-menu') {
      $(this).parent().parent().parent().addClass('active');
    }
  }
});
