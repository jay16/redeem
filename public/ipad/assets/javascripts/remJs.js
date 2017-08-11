/**
 * 2016/3/19 */

(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            var font = 20 * (clientWidth / 320) < 40 ? 20 * (clientWidth / 320) : 40;
            docEl.style.fontSize = font + 'px';
            console.log('clientWidth: ' + clientWidth);
            console.log('font: ' + font + 'px');
            if(font < 30){
                $('.tgl').hide();
            }else{
                $('.tgl').show();
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

