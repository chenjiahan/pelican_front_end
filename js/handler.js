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
     * 初始化editor
     */
    $('.editor').wysiwyg();

    /**
     * 初始化审核人chosen
     */
    $.ajax({
        url: "/api/handler/checkers",
        type: 'GET',
        dataType: 'json',
        data: {
            token: token
        },
        success: function (obj) {
            if(obj.status === 0) {
                var list = '';
                var checkers = obj.data.users;
                var len = checkers.length;
                for(var i = 0;i < len; i++) {
                    list += '<option value="' + checkers[i].id + '">' + checkers[i].username + '</option>'
                }
                document.getElementById('checker').innerHTML += list;
                $('#checker').chosen({disable_search: true, width: "140px"});
            }
        }
    });

    /**
     * 初始化邮件数据
     */
    var taskPage = 1;
    var donePage = 1;
    var checkPage = 1;
    var returnPage = 1;
    var sendedPage = 1;
    showTaskList(taskPage);

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
            $('.active-li').removeClass('active-li');
            //显示新页面
            $('.' + target + '-li').addClass('active-li');
            $('.head-nav')[0].className = 'head-nav head-nav-' + target;
            $('#' + target).show();
            if (target === 'task'){
                showTaskList(taskPage);
            } else if (target === 'check') {
                showCheckList(checkPage);
            } else if (target === 'done') {
            } else if(target === 'return') {

            } else if(target === 'sended') {
                showSendedList();
            }
        }
    }

    /*-------------------- task start --------------------*/
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
    function showTaskList(page) {
        document.getElementById('task').innerHTML = '';
        $.ajax({
            url: "/api/handler/unseen",
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
                            delay = Math.min(delay + 50, 1000);
                            html += '<div class="mail-line"><p class="delay-' + delay + ' animated zoomIn">今天</p><ul class="mail-ul">';
                            for (var i = 0; i < tList.length; i++) {
                                html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name nowrap">' +
                                    tList[i].senderName[0].name +
                                    '</span><span class="li-title nowrap" data-id="' + tList[i].mailId + '">' +
                                    tList[i].title +
                                    '</span><span class="li-done" data-id="' + tList[i].mailId + '"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
                                    tList[i].fromNow +
                                    '</span></li>';
                                delay  = Math.min(delay + 50, 1000);
                            }
                            html += '</ul></div>';
                        }
                        if (yList.length) {
                            delay = Math.min(delay + 50, 1000);
                            html += '<div class="mail-line"><p class="delay-' + delay + ' animated zoomIn">昨天</p><ul class="mail-ul">';
                            for (var i = 0; i < yList.length; i++) {
                                html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name nowrap">' +
                                    yList[i].senderName[0].name +
                                    '</span><span class="li-title nowrap" data-id="' + yList[i].mailId + '">' +
                                    yList[i].title +
                                    '</span><span class="li-done" data-id="' + yList[i].mailId + '"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
                                    yList[i].fromNow +
                                    '</span></li>';
                                delay = Math.min(delay + 50, 1000);
                            }
                            html += '</ul></div>';
                        }
                        if (aList.length) {
                            delay = Math.min(delay + 50, 1000);
                            html += '<div class="mail-line"><p class="delay-' + delay + ' animated zoomIn">更早</p><ul class="mail-ul">';
                            for (var i = 0; i < aList.length; i++) {
                                html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name nowrap">' +
                                    aList[i].senderName[0].name +
                                    '</span><span class="li-title nowrap" data-id="' + aList[i].mailId + '">' +
                                    aList[i].title +
                                    '</span><span class="li-done" data-id="' + aList[i].mailId + '"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
                                    aList[i].fromNow +
                                    '</span></li>';
                                delay = Math.min(delay + 50, 1000);
                            }
                            html += '</ul></div>';
                        }
                        //添加分页按钮
                        html += '<div class="btn-line clearfix">';
                        if( taskPage !== obj.data.pageCount) {
                            html += '<a href="javascript:" class="next-btn animated zoomIn delay-' + delay + '">下一页<i class="fa fa-arrow-right"></i></a>';
                        }
                        if (taskPage !== 1) {
                            html += '<a href="javascript:" class="prev-btn animated zoomIn delay-' + delay + '"><i class="fa fa-arrow-left"></i>上一页</a>';
                        }
                        html += '</div>';
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
    /**
     * #task事件绑定
     */
    $('#task')
        //查看邮件详情
        .delegate('.li-title', 'click', function() {
            showMailDetail($(this).data('id'),'task');
        })
        //返回邮件列表
        .delegate('.back-btn', 'click', function() {
            showTaskList(taskPage);
        })
        //点击回复邮件
        .delegate('.reply-btn', 'click', function() {
            changePage('task','send');
            $('#receiver').val(senderInfo.address);
            $('#subject').val('回复：' + senderInfo.subject);
            $('.editor').html('<br><br><br><br><br>在 ' + senderInfo.date + '，"' + senderInfo.name + '" <' + senderInfo.address + '> 写道：' + senderInfo.html);
        })
        //详情页标记为已处理
        .delegate('.done-btn', 'click', function() {
            $.ajax({
                url: "/api/handler/manage",
                type: 'POST',
                dataType: 'json',
                data: {
                    token:token,
                    mailId: $(this).data('id')
                },
                success: function (obj) {
                    if(obj.status === 0) {
                        topAlert('处理成功','success');
                        showTaskList(taskPage);
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
                url: "/api/handler/manage",
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
        })
        .delegate('.prev-btn','click',function(){
            showTaskList(--taskPage);
        })
        .delegate('.next-btn','click',function(){
            showTaskList(++taskPage);
        })
    /*-------------------- task end --------------------*/


    /*-------------------- send end --------------------*/
    /**
     * 发送邮件
     */
    $('.send-btn').click(function () {
        var receiver = document.getElementById('receiver').value,
            subject = document.getElementById('subject').value,
            html = document.getElementsByClassName('editor')[0].innerHTML,
            checker = document.getElementById('checker').value,
            btn = this;
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(!receiver) {
            topAlert('收信人不能为空','error');
        } else if(!filter.test(receiver)) {
            topAlert('邮箱格式错误','error');
        } else if (!subject) {
            topAlert('邮件主题不能为空','error');
        } else if (!checker) {
            topAlert('请选择审核人','error');
        } else if (!html) {
            topAlert('邮件正文不能为空','error');
        } else {
            html = '<div>' + html + '</div>';
            btn.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';
            $.ajax({
                url: "/api/handler/send",
                type: 'POST',
                dataType: 'json',
                data: {
                    token: token,
                    to: receiver,
                    subject: subject,
                    html: html,
                    text: '',
                    checker: checker
                },
                success: function (obj) {
                    if(obj.status === 0) {
                        topAlert('发送成功','success');
                        document.getElementById('receiver').value = '';
                        document.getElementById('subject').value = '';
                        document.getElementsByClassName('editor')[0].innerHTML = '';
                    } else {
                        if(obj.message.name === 'RecipientError') {
                            topAlert('邮箱地址错误','error');
                        } else {
                            topAlert('发送失败','error');
                        }
                    }
                    btn.innerHTML = '发送';
                },
                error: function() {
                    topAlert('发送失败','error');
                    btn.innerHTML = '发送';
                }
            });
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
    /*-------------------- send end --------------------*/

    /*-------------------- check start --------------------*/
    function showCheckList(page) {
        document.getElementById('check').innerHTML = '';
        $.ajax({
            url: "/api/handler/checking",
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
                        document.getElementById('check').innerHTML = '<div class="vertical-middle-t"><div class="vertical-middle-tc"><div class="no-content"><p>没有在审核中的邮件</p></div></div></div>';
                        setTimeout(function () {
                            document.querySelector('#check .no-content').classList.add('grow');
                        }, 1);
                    } else {
                        var delay = 0, html = '';
                        //邮件根据日期归类
                        for (var i = 0; i < mList.length; i++) {
                            mList[i].senderName[0].name = mList[i].senderName[0].name || '发件人：无';
                        }
                        delay = Math.min(delay + 50, 1000);
                        html += '<div class="mail-line">&nbsp;<ul class="mail-ul">';
                        for (var i = 0; i < mList.length; i++) {
                            delay = Math.min(delay + 50, 1000);
                            html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name nowrap">' +
                                mList[i].senderName[0].name +
                                '</span><span class="li-title nowrap" data-id="' + mList[i].mailId + '">' +
                                mList[i].title +
                                '</span><span class="li-time">' +
                                mList[i].fromNow +
                                '</span></li>';
                        }
                        html += '</ul></div>';
                        //添加分页按钮
                        html += '<div class="btn-line clearfix">';
                        if( taskPage !== obj.data.pageCount) {
                            html += '<a href="javascript:" class="next-btn animated zoomIn delay-' + delay + '">下一页<i class="fa fa-arrow-right"></i></a>';
                        }
                        if (taskPage !== 1) {
                            html += '<a href="javascript:" class="prev-btn animated zoomIn delay-' + delay + '"><i class="fa fa-arrow-left"></i>上一页</a>';
                        }
                        html += '</div>';
                        document.getElementById('check').innerHTML = html;
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
    /**
     * #check事件绑定
     */
    $('#check')
        //查看邮件详情
        .delegate('.li-title', 'click', function() {
            showMailDetail($(this).data('id'),'check');
        })
        //返回邮件列表
        .delegate('.back-btn', 'click', function() {
            showCheckList(checkPage);
        })
        .delegate('.prev-btn','click',function(){
            showCheckList(--checkPage);
        })
        .delegate('.next-btn','click',function(){
            showCheckList(++checkPage);
        })
    /*-------------------- check end --------------------*/

    /*-------------------- sended start --------------------*/
    function showSendedList(page) {
        document.getElementById('sended').innerHTML = '';
        $.ajax({
            url: "/api/handler/sent",
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
                        document.getElementById('sended').innerHTML = '<div class="vertical-middle-t"><div class="vertical-middle-tc"><div class="no-content"><p>没有已发送的邮件</p></div></div></div>';
                        setTimeout(function () {
                            document.querySelector('#sended .no-content').classList.add('grow');
                        }, 1);
                    } else {
                        var delay = 0, html = '';
                        //邮件根据日期归类
                        for (var i = 0; i < mList.length; i++) {
                            mList[i].senderName[0].name = mList[i].senderName[0].name || '发件人：无';
                        }
                        delay = Math.min(delay + 50, 1000);
                        html += '<div class="mail-line">&nbsp;<ul class="mail-ul">';
                        for (var i = 0; i < mList.length; i++) {
                            delay = Math.min(delay + 50, 1000);
                            html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name nowrap">' +
                                mList[i].senderName[0].name +
                                '</span><span class="li-title nowrap" data-id="' + mList[i].mailId + '">' +
                                mList[i].title +
                                '</span><span class="li-time">' +
                                mList[i].fromNow +
                                '</span></li>';
                        }
                        html += '</ul></div>';
                        //添加分页按钮
                        html += '<div class="btn-line clearfix">';
                        if( taskPage !== obj.data.pageCount) {
                            html += '<a href="javascript:" class="next-btn animated zoomIn delay-' + delay + '">下一页<i class="fa fa-arrow-right"></i></a>';
                        }
                        if (taskPage !== 1) {
                            html += '<a href="javascript:" class="prev-btn animated zoomIn delay-' + delay + '"><i class="fa fa-arrow-left"></i>上一页</a>';
                        }
                        html += '</div>';
                        document.getElementById('sended').innerHTML = html;
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
    /**
     * #sended事件绑定
     */
    $('#sended')
        //查看邮件详情
        .delegate('.li-title', 'click', function() {
            showMailDetail($(this).data('id'),'sended');
        })
        //返回邮件列表
        .delegate('.back-btn', 'click', function() {
            showSendedList(sendedPage);
        })
        .delegate('.prev-btn','click',function(){
            showSendedList(--sendedPage);
        })
        .delegate('.next-btn','click',function(){
            showSendedList(++sendedPage);
        })
    /*-------------------- sended end --------------------*/

    /*-------------------- return start --------------------*/
    function showReturnList(page) {
        document.getElementById('return').innerHTML = '';
        $.ajax({
            url: "/api/handler/return",
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
                        document.getElementById('return').innerHTML = '<div class="vertical-middle-t"><div class="vertical-middle-tc"><div class="no-content"><p>没有退回的邮件</p></div></div></div>';
                        setTimeout(function () {
                            document.querySelector('#return .no-content').classList.add('grow');
                        }, 1);
                    } else {
                        var delay = 0, html = '';
                        //邮件根据日期归类
                        for (var i = 0; i < mList.length; i++) {
                            mList[i].senderName[0].name = mList[i].senderName[0].name || '发件人：无';
                        }
                        delay = Math.min(delay + 50, 1000);
                        html += '<div class="mail-line">&nbsp;<ul class="mail-ul">';
                        for (var i = 0; i < mList.length; i++) {
                            delay = Math.min(delay + 50, 1000);
                            html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name nowrap">' +
                                mList[i].senderName[0].name +
                                '</span><span class="li-title nowrap" data-id="' + mList[i].mailId + '">' +
                                mList[i].title +
                                '</span><span class="li-time">' +
                                mList[i].fromNow +
                                '</span></li>';
                        }
                        html += '</ul></div>';
                        //添加分页按钮
                        html += '<div class="btn-line clearfix">';
                        if( taskPage !== obj.data.pageCount) {
                            html += '<a href="javascript:" class="next-btn animated zoomIn delay-' + delay + '">下一页<i class="fa fa-arrow-right"></i></a>';
                        }
                        if (taskPage !== 1) {
                            html += '<a href="javascript:" class="prev-btn animated zoomIn delay-' + delay + '"><i class="fa fa-arrow-left"></i>上一页</a>';
                        }
                        html += '</div>';
                        document.getElementById('return').innerHTML = html;
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
    /**
     * #return事件绑定
     */
    $('#return')
        //查看邮件详情
        .delegate('.li-title', 'click', function() {
            showMailDetail($(this).data('id'),'return');
        })
        //返回邮件列表
        .delegate('.back-btn', 'click', function() {
            showReturnList(returnPage);
        })
        .delegate('.prev-btn','click',function(){
            showReturnList(--returnPage);
        })
        .delegate('.next-btn','click',function(){
            showReturnList(++returnPage);
        })
    /*-------------------- return end --------------------*/

    /*-------------------- done start --------------------*/
    function showDoneList(page) {
        document.getElementById('done').innerHTML = '';
        $.ajax({
            url: "/api/handler/managed",
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
                        document.getElementById('done').innerHTML = '<div class="vertical-middle-t"><div class="vertical-middle-tc"><div class="no-content"><p>没有已处理的邮件</p></div></div></div>';
                        setTimeout(function () {
                            document.querySelector('#done .no-content').classList.add('grow');
                        }, 1);
                    } else {
                        var delay = 0, html = '';
                        //邮件根据日期归类
                        for (var i = 0; i < mList.length; i++) {
                            mList[i].senderName[0].name = mList[i].senderName[0].name || '发件人：无';
                        }
                        delay = Math.min(delay + 50, 1000);
                        html += '<div class="mail-line">&nbsp;<ul class="mail-ul">';
                        for (var i = 0; i < mList.length; i++) {
                            delay = Math.min(delay + 50, 1000);
                            html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name nowrap">' +
                                mList[i].senderName[0].name +
                                '</span><span class="li-title nowrap" data-id="' + mList[i].mailId + '">' +
                                mList[i].title +
                                '</span><span class="li-time">' +
                                mList[i].fromNow +
                                '</span></li>';
                        }
                        html += '</ul></div>';
                        //添加分页按钮
                        html += '<div class="btn-line clearfix">';
                        if( taskPage !== obj.data.pageCount) {
                            html += '<a href="javascript:" class="next-btn animated zoomIn delay-' + delay + '">下一页<i class="fa fa-arrow-right"></i></a>';
                        }
                        if (taskPage !== 1) {
                            html += '<a href="javascript:" class="prev-btn animated zoomIn delay-' + delay + '"><i class="fa fa-arrow-left"></i>上一页</a>';
                        }
                        html += '</div>';
                        document.getElementById('done').innerHTML = html;
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
    /**
     * #done事件绑定
     */
    $('#done')
        //查看邮件详情
        .delegate('.li-title', 'click', function() {
            showMailDetail($(this).data('id'),'done');
        })
        //返回邮件列表
        .delegate('.back-btn', 'click', function() {
            showDoneList(donePage);
        })
        .delegate('.prev-btn','click',function(){
            showDoneList(--donePage);
        })
        .delegate('.next-btn','click',function(){
            showDoneList(++donePage);
        })
    /*-------------------- done end --------------------*/

    /**
     * 显示邮件详情
     */
    var senderInfo = {}; //记录发件人信息，用于回复邮件
    function showMailDetail(id,boxId) {
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
                    obj.boxId = boxId;
                    obj.data.id = id;
                    obj.data.receivedDate = obj.data.receivedDate.substr(0,16).replace('-','年').replace('-','月').replace('T','日 ');
                    document.getElementById(boxId).innerHTML = template('md-tmpl',obj);
                    //修改iframe并显示邮件内容
                    var iframe = document.getElementById('detail-iframe');
                    var ifrdoc = iframe.contentWindow.document;
                    ifrdoc.designMode = "on";
                    ifrdoc.open();
                    ifrdoc.write(obj.data.html);
                    ifrdoc.close();
                    ifrdoc.designMode ="off";
                    var subWeb = document.frames ? document.frames["detail-iframe"].document : iframe.contentDocument;
                    if(iframe != null && subWeb != null) {
                        iframe.height = subWeb.body.scrollHeight + 10;
                    }
                    //记录发件人信息
                    senderInfo.name = obj.data.from[0].name;
                    senderInfo.address = obj.data.from[0].address;
                    senderInfo.subject = obj.data.subject;
                    senderInfo.html = obj.data.html;
                    senderInfo.date = obj.data.receivedDate.substr(0,16).replace('-','年').replace('-','月').replace('T','日 ');
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