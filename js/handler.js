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
            $('.head-nav')[0].className = 'head-nav head-nav-' + $(this).data('to');
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
        btn.html('<i class="fa fa-spinner fa-pulse"></i>');
        /*
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
        });*/
    });

    /**
     * 标记为已完成
     */
    $('#task').delegate('.li-done','click', function () {
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
                    document.getElementById('task').innerHTML = '<div class="vertical-middle-t"> <div class="vertical-middle-tc"> <div class="no-content"> <p>没有需要处理的邮件</p> </div> </div> </div>';
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

    /**
     * 获取日期字符串
     * @param offset
     */
    function GetDateStr(offset) {
        var dd = new Date(),
            y = dd.getFullYear(),
            m = dd.getMonth() + 1,
            d = dd.getDate();
        dd.setDate(dd.getDate() + offset);
        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        return y + "-" + m + "-" + d;
    }

    /**
     * 测试待处理列表
     */
    var testList = {
        "apiVersion": "1.0",
        "status": 0,
        "list": [ {
                "mailId":"1",
                "title": "Yihao Feng添加了您可能认识的联系人",
                "senderName": "领英动态",
                "receiveTime":"2015-06-29T13:13"
            }, {
                "mailId":"2",
                "title": "《天谕》6月19日超人气开放性测试开启",
                "senderName": "网易游戏",
                "receiveTime":"2015-06-29T14:47"
            }, {
                "mailId":"3",
                "title": "百度站长平台：http://www.51zhiquan.com/漏洞检测结果",
                "senderName": "zhanzhang",
                "receiveTime":"2015-06-29T09:12"
            }, {
                "mailId":"4",
                "title": "buaasoft_os1221 自动回复: 12211123_陈嘉涵_OS6",
                "senderName": "buaasoft_os1221",
                "receiveTime":"2015-06-22T18:49"
            }, {
                "mailId":"5",
                "title": "Hi neverland，你收到了 6 次关注、喜欢等互动，快回来看看",
                "senderName": "LOFTER",
                "receiveTime":"2015-06-18T20:57"
            }, {
                "mailId":"6",
                "title": "你在 Facebook 上的朋友比想象中要多",
                "senderName": "Facebook",
                "receiveTime":"2015-06-29T15:51"
             }, {
                "mailId":"7",
                "title": "你看过最奇葩的自建房是哪个？",
                "senderName": "知乎每周精选",
                "receiveTime":"2015-06-25T14:17"
              }, {
                "mailId":"8",
                "title": "2015年互联网工程师高薪专场火热招聘！",
                "senderName": "猎聘网",
                "receiveTime":"2015-06-17T15:02"
              }, {
                "mailId":"8",
                "title": "您的帐户在Windows设备上的Chrome中有新的登录活动",
                "senderName": "Google",
                "receiveTime":"2015-06-28T11:02"
              }
        ]
    }
    var nowPage = 1;
    function showTaskList(obj,page) {
        var delay = 0;
        if (obj.list.length === 0) {
            document.getElementById('task').innerHTML = '<div class="vertical-middle-t"> <div class="vertical-middle-tc"> <div class="no-content"> <p>没有需要处理的邮件</p> </div> </div> </div>';
            setTimeout(function () {
                $('#task .no-content').addClass('grow');
            }, 1);
        } else {
            var delay = 0,
                todayList = [],
                yesterdayList = [],
                agoList = [],
                today = GetDateStr(0),
                yesterday = GetDateStr(-1),
                html = '';
            //邮件根据日期归类
            for (var i = 0; i < obj.list.length; i++) {
                if (obj.list[i].receiveTime.substr(0, 10) === today) {
                    todayList.push(obj.list[i]);
                } else if (obj.list[i].receiveTime.substr(0, 10) === yesterday) {
                    yesterdayList.push(obj.list[i]);
                } else {
                    agoList.push(obj.list[i]);
                }
            }
            if (todayList.length) {
                delay = Math.min(delay + 100, 1000);
                html += '<div class="mail-line"><p class="delay-' + delay + ' animated zoomIn">今天</p><ul class="mail-ul">';
                for (var i = 0; i < todayList.length; i++) {
                    html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name">' +
                        todayList[i].senderName +
                        '</span><span class="li-title">' +
                        todayList[i].title +
                        '</span><span class="li-done"><i class="fa fa-check"></i></span><span class="li-time">' +
                        todayList[i].receiveTime.substr(11, 5) +
                        '</span></li>';
                    delay  = Math.min(delay + 100, 1000);
                }
                html += '</ul></div>';
            }
            if (yesterdayList.length) {
                delay = Math.min(delay + 100, 1000);
                html += '<div class="mail-line"><p class="delay-' + delay + ' animated zoomIn">昨天</p><ul class="mail-ul">';
                for (var i = 0; i < yesterdayList.length; i++) {
                    html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name">' +
                        yesterdayList[i].senderName +
                        '</span><span class="li-title">' +
                        yesterdayList[i].title +
                        '</span><span class="li-done"><i class="fa fa-check"></i></span><span class="li-time">' +
                        yesterdayList[i].receiveTime.substr(11, 5) +
                        '</span></li>';
                    delay = Math.min(delay + 100, 1000);
                }
                html += '</ul></div>';
            }
            if (agoList.length) {
                delay = Math.min(delay + 100, 1000);
                html += '<div class="mail-line"><p class="delay-' + delay + ' animated zoomIn">更早</p><ul class="mail-ul">';
                for (var i = 0; i < agoList.length; i++) {
                    html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name">' +
                        agoList[i].senderName +
                        '</span><span class="li-title">' +
                        agoList[i].title +
                        '</span><span class="li-done"><i class="fa fa-check"></i></span><span class="li-time">' +
                        agoList[i].receiveTime.replace('T',' ') +
                        '</span></li>';
                    delay = Math.min(delay + 100, 1000);
                }
                html += '</ul></div>';
            }
            document.getElementById('task').innerHTML = html;
        }
    }
    showTaskList(testList,nowPage);
} (jQuery);