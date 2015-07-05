/**
 * Created by Chen Jiahan on 2015/6/25.
 */
+function($) {
    /**
     * 获取token
     */
    var token = $.cookie('token'),
        name = $.cookie('name');
    document.getElementById('username').innerHTML = name;
    topAlert('欢迎回来','welcome');

    /**
     * @description: 初始化editor
     */
    $('.editor').wysiwyg();

    /**
     * 登出
     */
    document.getElementsByClassName('logout')[0].addEventListener('click', function(){
        $.cookie('token', '');
        $.cookie('name', '');
        window.location.href = 'index.html';
    })

    /**
     * @description: 左侧菜单切换
     */
    $('.slide-menu-ul li').click(function () {
        changePage($('.active-li').data('to'), $(this).data('to'));
    });

    /**
     * 切换显示的页面
     * @param now
     * @param target
     */
    function changePage(now,target) {
        if(now !== target){
            //隐藏当前页
            $('#' + now).hide();
            $('#' + now + ' .no-content').removeClass('grow');
            $('.active-li').removeClass('active-li');
            //显示新页面
            $('.' + target + '-li').addClass('active-li');
            $('.head-nav')[0].className = 'head-nav head-nav-' + target;
            $('#' + target).show();
            if(target !== 'task' && target !== 'send') {
                setTimeout(function(){
                    document.querySelector('#' + target + ' .no-content').classList.add('grow');
                },1);
            } else if (target === 'task'){
                showTaskList(nowPage);
            }
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
        var receiver = document.getElementById('receiver').value,
            subject = document.getElementById('subject').value,
            html = document.getElementsByClassName('editor')[0].innerHTML,
            btn = this;
        if(!receiver) {
            topAlert('收信人不能为空','error');
        } else if (!subject) {
            topAlert('邮件主题不能为空','error');
        } else if (!html) {
            topAlert('邮件正文不能为空','error');
        } else {
            btn.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';
            $.ajax({
                url: "/api/email/send",
                type: 'POST',
                dataType: 'json',
                data: {
                    token: token,
                    receiver: receiver,
                    title: subject,
                    content: html
                },
                success: function (obj) {
                    if(obj.status === 0) {
                        topAlert('发送成功','success');
                        document.getElementById('receiver').value = '';
                        document.getElementById('subject').value = '';
                        document.getElementsByClassName('editor')[0].innerHTML = '';
                    } else {
                        topAlert('发送失败','error');
                    }
                    btn.html('发送');
                },
                error: function() {
                    topAlert('发送失败','error');
                    btn.html('发送');
                }
            });
        }
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
    var nowPage = 1;
    function showTaskList(page) {
        document.getElementById('task').innerHTML = '';
        $.ajax({
            url: "/api/email/list",
            type: 'GET',
            dataType: 'json',
            data: {
                token:token,
                page:page
            },
            success: function (obj) {
                if(obj.status === 0) {
                    var delay = 0,
                        mList = obj.data.list;
                    if (mList.length === 0) {
                        document.getElementById('task').innerHTML = '<div class="vertical-middle-t"><div class="vertical-middle-tc"> <div class="no-content"> <p>没有需要处理的邮件</p> </div> </div> </div>';
                        setTimeout(function () {
                            document.querySelector('#task .no-content').classList.add('grow');
                        }, 1);
                    } else {
                        var delay = 0,
                            tList = [],
                            yList = [],
                            aList = [],
                            today = GetDateStr(0),
                            yesterday = GetDateStr(-1),
                            html = '';
                        //邮件根据日期归类
                        for (var i = 0; i < mList.length; i++) {
                            mList[i].senderName[0].name = mList[i].senderName[0].name || '发件人：无';
                            if (mList[i].receiveTime.substr(0, 10) === today) {
                                tList.push(mList[i]);
                            } else if (mList[i].receiveTime.substr(0, 10) === yesterday) {
                                yList.push(mList[i]);
                            } else {
                                aList.push(mList[i]);
                            }
                        }
                        if (tList.length) {
                            delay = Math.min(delay + 100, 1000);
                            html += '<div class="mail-line"><p class="delay-' + delay + ' animated zoomIn">今天</p><ul class="mail-ul">';
                            for (var i = 0; i < tList.length; i++) {
                                html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name nowrap">' +
                                    tList[i].senderName[0].name +
                                    '</span><span class="li-title nowrap" data-id="' + tList[i].mailId + '">' +
                                    tList[i].title +
                                    '</span><span class="li-done" data-id="' + tList[i].mailId + '"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
                                    tList[i].receiveTime.substr(11, 5) +
                                    '</span></li>';
                                delay  = Math.min(delay + 100, 1000);
                            }
                            html += '</ul></div>';
                        }
                        if (yList.length) {
                            delay = Math.min(delay + 100, 1000);
                            html += '<div class="mail-line"><p class="delay-' + delay + ' animated zoomIn">昨天</p><ul class="mail-ul">';
                            for (var i = 0; i < yList.length; i++) {
                                html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name nowrap">' +
                                    yList[i].senderName[0].name +
                                    '</span><span class="li-title nowrap" data-id="' + yList[i].mailId + '">' +
                                    yList[i].title +
                                    '</span><span class="li-done" data-id="' + yList[i].mailId + '"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
                                    yList[i].receiveTime.substr(11, 5) +
                                    '</span></li>';
                                delay = Math.min(delay + 100, 1000);
                            }
                            html += '</ul></div>';
                        }
                        if (aList.length) {
                            delay = Math.min(delay + 100, 1000);
                            html += '<div class="mail-line"><p class="delay-' + delay + ' animated zoomIn">更早</p><ul class="mail-ul">';
                            for (var i = 0; i < aList.length; i++) {
                                html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name nowrap">' +
                                    aList[i].senderName[0].name +
                                    '</span><span class="li-title nowrap" data-id="' + aList[i].mailId + '">' +
                                    aList[i].title +
                                    '</span><span class="li-done" data-id="' + aList[i].mailId + '"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
                                    aList[i].receiveTime.replace('T',' ') +
                                    '</span></li>';
                                delay = Math.min(delay + 100, 1000);
                            }
                            html += '</ul></div>';
                        }
                        html += '<div class="btn-line clearfix"><a href="javascript:" class="prev-btn"><i class="fa fa-arrow-left"></i>上一页</a><a href="javascript:" class="next-btn">下一页</a></div>'
                        document.getElementById('task').innerHTML = html;
                    }
                } else {
                    topAlert('网络错误','error');
                }
            },
            error: function() {
                topAlert('网络错误','error');
            }
        });
    }
    showTaskList(nowPage);

    /**
     * 显示邮件详情
     */
    function showMailDetail(id) {
        $.ajax({
            url: "/api/email/detail",
            type: 'GET',
            dataType: 'json',
            data: {
                token: token,
                mailId: id
            },
            success: function (obj) {
                if(obj.status === 0) {
                    obj.data.id = id;
                    obj.data.receivedDate = obj.data.receivedDate.substr(0,16).replace('-','年').replace('-','月').replace('T','日 ');
                    document.getElementById('task').innerHTML = template('md-tmpl',obj);
                } else {
                    topAlert('网络错误','error');
                }
            },
            error: function() {
                topAlert('网络错误','error');
            }
        });
    }

    /**
     * #task事件绑定
     */
    $('#task')
        //查看邮件详情
        .delegate('.li-title', 'click', function() {
            showMailDetail($(this).data('id'));
        })
        //返回邮件列表
        .delegate('.back-btn', 'click', function() {
            showTaskList(nowPage);
        })
        //回复邮件
        .delegate('.reply-btn', 'click', function() {
            changePage('task','send');
        })
        //详情页标记为已处理
        .delegate('.done-btn', 'click', function() {
            $.ajax({
                url: "/api/email/manage",
                type: 'POST',
                dataType: 'json',
                data: {
                    token:token,
                    mailId: $(this).data('id')
                },
                success: function (obj) {
                    if(obj.status === 0) {
                        topAlert('处理成功','success');
                        showTaskList(nowPage);
                    } else {
                        topAlert('处理失败','error');
                    }
                },
                error: function() {
                    topAlert('处理失败','error');
                }
            });
        })
        //列表页标记为已处理
        .delegate('.li-done','click', function () {
            var line = $(this).parent(),
                ul = line.parent();
            $.ajax({
                url: "/api/email/manage",
                type: 'POST',
                dataType: 'json',
                data: {
                    token:token,
                    mailId: $(this).data('id')
                },
                success: function (obj) {
                    if(obj.status === 0) {
                        topAlert('处理成功','success');
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
                    } else {
                        topAlert('处理失败','error');
                    }
                },
                error: function() {
                    topAlert('处理失败','error');
                }
            });
        });

    /**
     * 顶部弹出框
     * @param word 显示内容
     * @param type success为绿色成功框
     *             welcome为蓝色欢迎框
     *             error为红色警告框
     * @param time 显示时间，默认值为2000
     */
    function topAlert(word,type,time) {
        var oldBox = document.getElementsByClassName('alert-box')[0],
            box = document.createElement('div'),
            icon = {
                'success': '<i class="fa fa-check"></i>',
                'welcome': '<i class="fa fa-leaf"></i>',
                'error':   '<i class="fa fa-exclamation-triangle"></i>'
            };
        if(oldBox){
            oldBox.remove();
        }
        box.className = 'alert-box animated fadeInDownBig alert-' + type;
        box.innerHTML = icon[type] + word;
        document.body.appendChild(box);
        setTimeout(function(){
            box.className = 'alert-box animated fadeOutUpBig alert-' + type;
            box.addEventListener('animationend',function() {
                box.remove();
            });
        },time || 2000);
    }
} (jQuery);