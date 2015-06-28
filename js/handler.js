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
    setTimeout(function(){
        $('#task .no-content').addClass('grow');
    },1);
    $('.slide-menu-ul li').click(function () {
        if ( !$(this).hasClass('active-li')) {
            //隐藏当前页
            $('#' + $('.active-li').data('to')).hide();
            $('#' + $('.active-li').data('to') + ' .no-content').removeClass('grow');
            $('.active-li').removeClass('active-li');

            //显示新页面
            $(this).addClass('active-li');
            var target = '#' + $(this).data('to');
            $(target).show();
            setTimeout(function(){
                $(target + ' .no-content').addClass('grow');
            },1);
        }
    });

    //mail title focus效果
    $('.mail-title input').focus(function() {
        $(this).parent().addClass('mail-title-focus');
    });
    $('.mail-title input').blur(function() {
        $(this).parent().removeClass('mail-title-focus');
    });
} (jQuery);