/**
 * Created by Chen Jiahan on 2015/6/25.
 */

/**
 * @description: 获取Url参数
 * @param name
 * @returns {*}
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
        r = decodeURI(window.location.search).substr(1).match(reg);
    if (r !== null) {
        return r[2];
    }
    return null;
}

/**
 * @description: 执行animate
 * @param selector
 * @param animate
 */
function doAnimate(selector, animate) {
    $(selector)
        .addClass(animate + ' animated')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass(animate + ' animated');
        });
}

+function($) {

    /**
     *  去除链接的虚线边框
     *  为了美化IE浏览器的链接点击
     */
    $('a').bind('focus', function () {
        if (this.blur) {
            this.blur();
        }
    });

    /**
     * @description: 初始化editor
     */
    $('.editor').wysiwyg();

    /**
     * @description: 载入动画
     */
    setTimeout(function(){
        $('#task .no-content').addClass('grow');
    },1);

    /**
     * @description: 左侧菜单切换
     */
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

    /**
     * mail title focus效果
     */
    $('.mail-title input')
        .focus(function() {
            $(this).parent().addClass('mail-title-focus');
        })
        .blur(function() {
            $(this).parent().removeClass('mail-title-focus');
        });

    /**
     * 发送邮件
     */
    $('.send-btn').click(function () {
        var btn = $(this);
        btn.html('发送中');
        $.ajax({
            url: "/api/url",
            type: 'POST',
            dataType: 'json',
            data: {},
            success: function (obj) {

            },
            error: function() {
                btn.html('发送');
            }
        });
    });

    /**
     * 标记为已完成
     */
    $('.li-done').click(function () {
        var line = $(this).parent(),
            ul = line.parent();
        line.removeClass()
            .addClass('fadeOutRight animated')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass('fadeOutRight animated').remove();
                //移除空ul
                if (ul.html().indexOf('li') < 0) {
                    ul.parent().remove();
                }
                //若无待处理邮件，则显示提醒
                if ($('#task').html().indexOf('mail-line') < 0) {
                    $('#task').html('<div class="vertical-middle-t"> <div class="vertical-middle-tc"> <div class="no-content"> <p>没有需要处理的邮件</p> </div> </div> </div>');
                    setTimeout(function () {
                        $('#task .no-content').addClass('grow');
                    }, 1);
                }
            });
    });

    /**
     * 登出
     */
    $('.logout').click(function() {
       window.location.href = 'index.html'
    });
} (jQuery);