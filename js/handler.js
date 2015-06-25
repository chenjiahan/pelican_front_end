/**
 * Created by Chen Jiahan on 2015/6/25.
 */

/*
 *  @author: Cjh
 *  @description: 获取Url参数
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
        r = decodeURI(window.location.search).substr(1).match(reg);
    if (r !== null) {
        return r[2];
    }
    return null;
}

/*
 *  @author: Cjh
 *  @description: 执行animate
 */
function doAnimate(selector, animate) {
    $(selector)
        .addClass(animate + ' animated')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass(animate + ' animated');
        });
}

+function($) {

    /*
     *  @description: 初始化editor
     */
    $('.editor').wysiwyg();

    /*
     *  @description: 左侧菜单切换
     */
    $('.slide-menu-ul li').click(function () {
        if ( !$(this).hasClass('active-li')) {
            $('.active-li').removeClass('active-li');
            $(this).addClass('active-li');
        }
    });

} (jQuery);