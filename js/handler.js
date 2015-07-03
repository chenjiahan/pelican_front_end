/**
 * Created by Chen Jiahan on 2015/6/25.
 */
+function($) {

    /**
     * @description: 初始化editor
     */
    $('.editor').wysiwyg();

    /**
     * 登出
     */
    $('.logout').click(function() {
        window.location.href = 'index.html';
    });

    /**
     * @description: 左侧菜单切换
     */
    $('.slide-menu-ul li').click(function () {
        changePage($('.active-li').data('to'),$(this).data('to'));
    });

    /**
     * 切换显示的页面
     * @param now
     * @param target
     */
    function changePage(now,target) {
        if(now === target){
            return;
        } else {
            //隐藏当前页
            $('#' + now).hide();
            $('#' + now + ' .no-content').removeClass('grow');
            $('.active-li').removeClass('active-li');

            if(target === 'task') {
                showTaskList(testList,nowPage);
            }
            //显示新页面
            $('.' + target + '-li').addClass('active-li');
            $('.head-nav')[0].className = 'head-nav head-nav-' + target;
            $('#' + target).show();
            setTimeout(function(){
                document.querySelector('#' + target + ' .no-content').classList.add('grow');
            },1);
        }
    }

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
        var title = document.getElementById('title').value,
            subject = document.getElementById('subject').value,
            html = document.getElementsByClassName('editor')[0].innerHTML;
        if(!title) {
            topAlert('收信人不能为空','error',2000);
        } else if (!subject) {
            topAlert('邮件主题不能为空','error',2000);
        } else if (!html) {
            topAlert('邮件正文不能为空','error',2000);
        } else {
            var btn = $(this);
            btn.html('<i class="fa fa-spinner fa-pulse"></i>');
        }
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
        topAlert('处理成功','success',2000);
        var line = $(this).parent(),
            ul = line.parent();
        line.removeClass()
            .addClass('fadeOutRight animated')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).remove();
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
     * 获取日期字符串
     * @param offset
     */
    function GetDateStr(offset) {
        var dd = new Date(),
            y = dd.getFullYear(),
            m = dd.getMonth() + 1;
        dd.setDate(dd.getDate() + offset);
        var d = dd.getDate()
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
                "receiveTime":"2015-07-02T15:02"
              }, {
                "mailId":"9",
                "title": "您的帐户在Windows设备上的Chrome中有新的登录活动",
                "senderName": "Google",
                "receiveTime":"2015-07-03T11:02"
              }
        ]
    }
    var nowPage = 1;
    function showTaskList(obj,page) {
        var delay = 0;
        if (obj.list.length === 0) {
            document.getElementById('task').innerHTML = '<div class="vertical-middle-t"> <div class="vertical-middle-tc"> <div class="no-content"> <p>没有需要处理的邮件</p> </div> </div> </div>';
            setTimeout(function () {
                document.querySelector('#task .no-content').classList.add('grow');
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
                        '</span><span class="li-title" data-id="' + todayList[i].mailId + '">' +
                        todayList[i].title +
                        '</span><span class="li-done"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
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
                        '</span><span class="li-title" data-id="' + yesterdayList[i].mailId + '">' +
                        yesterdayList[i].title +
                        '</span><span class="li-done"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
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
                        '</span><span class="li-title" data-id="' + agoList[i].mailId + '">' +
                        agoList[i].title +
                        '</span><span class="li-done"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
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

    /**
     * 显示邮件详情
     */
    var testData = {
        title: 'xx标题',
        name: '陈嘉涵',
        mail: '416417567@163.com',
        time: '2015年6月29日16:30',
        html: '<pre style="background-color:#222527;color:#ede0ce;font-family:"Source Code Pro";font-size:12.0pt;"><span style="color:#26a6a6;">html </span>{<br>  <span style="color:#ff5d38;">height</span>: <span style="color:#bcd42a;">100</span><span style="color:#26a6a6;">%</span><span style="color:#cc7832;">;<br></span>}<br><span style="color:#26a6a6;">body </span>{<br>  <span style="color:#ff5d38;">height</span>: <span style="color:#bcd42a;">100</span><span style="color:#26a6a6;">%</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">  </span><span style="color:#ff5d38;">overflow-x</span>: <span style="color:#dee3ec;">hidden</span><span style="color:#cc7832;">;<br></span>}<br><br><span style="color:#7a7267;font-style:italic;">/*--head nav--*/<br></span>.<span style="color:#ff5d38;">head-nav </span>{<br>  <span style="color:#ff5d38;">position</span>: <span style="color:#dee3ec;">fixed</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">  </span><span style="color:#ff5d38;">z-index</span>: <span style="color:#bcd42a;">100</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">  </span><span style="color:#ff5d38;">top</span>: <span style="color:#bcd42a;">0</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">  </span><span style="color:#ff5d38;">left</span>: <span style="color:#bcd42a;">0</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">  </span><span style="color:#ff5d38;">right</span>: <span style="color:#bcd42a;">0</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">  </span><span style="color:#ff5d38;">height</span>: <span style="color:#bcd42a;">60</span><span style="color:#dee3ec;">px</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">  </span><span style="color:#ff5d38;">padding</span>: <span style="color:#bcd42a;">0 45</span><span style="color:#dee3ec;">px</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">  </span><span style="color:#ff5d38;">-webkit-box-shadow</span>: <span style="color:#bcd42a;">0 0 4</span><span style="color:#dee3ec;">px </span><span style="color:#bcd42a;">rgba</span>(<span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">.14</span>)<span style="color:#cc7832;">,</span><span style="color:#bcd42a;">0 4</span><span style="color:#dee3ec;">px </span><span style="color:#bcd42a;">8</span><span style="color:#dee3ec;">px </span><span style="color:#bcd42a;">rgba</span>(<span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">.28</span>)<span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">          </span><span style="color:#ff5d38;">box-shadow</span>: <span style="color:#bcd42a;">0 0 4</span><span style="color:#dee3ec;">px </span><span style="color:#bcd42a;">rgba</span>(<span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">.14</span>)<span style="color:#cc7832;">,</span><span style="color:#bcd42a;">0 4</span><span style="color:#dee3ec;">px </span><span style="color:#bcd42a;">8</span><span style="color:#dee3ec;">px </span><span style="color:#bcd42a;">rgba</span>(<span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">0</span><span style="color:#cc7832;">,</span><span style="color:#bcd42a;">.28</span>)<span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">  </span><span style="color:#ff5d38;">-webkit-transition</span>: <span style="color:#dee3ec;">background </span><span style="color:#bcd42a;">.3</span><span style="color:#dee3ec;">s ease-in-out</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">       </span><span style="color:#ff5d38;">-o-transition</span>: <span style="color:#dee3ec;">background </span><span style="color:#bcd42a;">.3</span><span style="color:#dee3ec;">s ease-in-out</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;">          </span><span style="color:#ff5d38;">transition</span>: <span style="color:#dee3ec;">background </span><span style="color:#bcd42a;">.3</span><span style="color:#dee3ec;">s ease-in-out</span><span style="color:#cc7832;">;<br></span><span style="color:#cc7832;"><br></span><span style="color:#cc7832;">  </span><span style="color:#7a7267;font-style:italic;">/*--prevent chrome fixed element blink--*/<br></span><span style="color:#7a7267;font-style:italic;">  </span><span style="color:#ff5d38;">-webkit-transform</span>: <span style="color:#bcd42a;">translateZ</span>(<span style="color:#bcd42a;">0</span>)<span style="color:#cc7832;">;<br></span>}</pre>'
    }
    function showMailDetail() {
        document.getElementById('task').innerHTML = template('md-tmpl',testData);
    }

    /**
     * 查看邮件详情
     * 返回邮件列表
     */
    $('#task')
        .delegate('.li-title', 'click', function() {
            showMailDetail();
        })
        .delegate('.back-btn', 'click', function() {
            showTaskList(testList,nowPage);
        })
        .delegate('.done-btn', 'click', function() {
            topAlert('处理成功','success',3000);
            showTaskList(testList,nowPage);
        })
        .delegate('.reply-btn', 'click', function() {
            changePage('task','send');
        });

    /**
     * 弹出框
     * @param word 显示内容
     * @param type success为绿色成功框，error为红色警告框
     * @param time 显示时间
     */
    function topAlert(word,type,time) {
        var oldBox = document.getElementsByClassName('alert-box')[0],
            box = document.createElement('div'),
            icon = '';
        if(oldBox){
            oldBox.remove();
        }
        if (type === 'success') {
            icon = '<i class="fa fa-check"></i>';
        } else if (type === 'error') {
            icon = '<i class="fa fa-exclamation-triangle"></i>';
        }
        box.className = 'alert-box animated fadeInDownBig alert-' + type;
        box.innerHTML = icon + word;
        document.body.appendChild(box);
        setTimeout(function(){
            box.className = 'alert-box animated fadeOutUpBig alert-' + type;
            box.addEventListener('animationend',function() {
                box.remove();
            });
        },time);
    }
} (jQuery);