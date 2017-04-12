$(function(){
    $(".iframe").off('click').on('click', function(event){
        event.preventDefault();
        var url = $(this).attr('href');
        var type = BootstrapDialog.TYPE_PRIMARY;
        if($(this).attr('title')=='涓婁紶') type = BootstrapDialog.TYPE_SUCCESS
        BootstrapDialog.show({
            title: $(this).attr('title'),
            message: $('<div></div>').load(url),
            type: type,
        });
    });

    var ups = new Array();
    var items = $(".upload_hidden");
    for(var i=0; i<items.length; i++){
        ups[i] = items.eq(i).attr("id");
    }

    for (var n = 0; n < ups.length; n++) {
        var attach_op = "#"+ups[n];
        $(attach_op).after("<ul id='"+ups[n]+"_imgs'></ul>");
        var attach_ids = $(attach_op).val();
        if(attach_ids){
            $.ajax({
                url: AJAXATTACHURL,
                type: "get",
                data: "ids="+attach_ids+'&up='+ups[n],
                datatype:"json",
                success: function(data) {
                    if (data) {
                        var container = ('#'+data[0].up+'_imgs');
                        for (var i=0; i<data.length; i++){
                            $(container).append("<li><a href='"+ATTACHURL+'/'+data[i].name+"' data-lightbox='roadtrip'><img src='"+ATTACHURL+'/'+data[i].name+"' width='120' height='80'></a><br/><a data-op='"+data[i].up+"' data-id='"+data[i].id+"' class='esc_img btn btn-default btn-xs'>鍙栨秷鍥剧墖</a></li>");
                        }

                        $(container+' .esc_img').bind('click',function(){
                            var esc_id = $(this).attr('data-id');
                            var data_op = $(this).attr('data-op');
                            var ids = $('#'+data_op).val().split(',');
                            var att_ids = '';
                            for(var j=0; j<ids.length;j++){
                                if (esc_id!=ids[j] && ids[j]) {
                                    att_ids = att_ids + ids[j]+',';
                                };
                            }
                            $('#'+data_op).val(att_ids);
                            $(this).parent().hide();
                        })
                    }
                }
            })
        }
    };
});