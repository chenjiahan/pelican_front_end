+function($) {
    /**
     * 获取token
     */
    var token = $.cookie('token'),
        name = $.cookie('name');
    document.getElementById('username').innerHTML = name;
    topAlert('欢迎回来','welcome');

    /**
     * 登出
     */
    document.getElementsByClassName('logout')[0].addEventListener('click', function(){
        $.cookie('token', '');
        $.cookie('name', '');
        window.location.href = 'index.html';
    })

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
    showTaskList(nowPage);
    function showTaskList(page) {
        $.ajax({
            url: "/api/distribution/getMailList",
            type: 'GET',
            dataType: 'json',
            data: {
                token:token,
                page:page
            },
            success: function (obj) {
                if(obj.status === 0) {
                    var delay = 0;
                    if (obj.list.length === 0) {
                        document.getElementById('email-list').innerHTML = '<div class="vertical-middle-t"> <div class="vertical-middle-tc"> <div class="no-content"> <p>没有需要处理的邮件</p> </div> </div> </div>';
                        setTimeout(function () {
                            document.querySelector('#email-list .no-content').classList.add('grow');
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
                    for (var i = 0; i < obj.list.length; i++) {
                        if (obj.list[i].receiveTime.substr(0, 10) === today) {
                            tList.push(obj.list[i]);
                        } else if (obj.list[i].receiveTime.substr(0, 10) === yesterday) {
                            yList.push(obj.list[i]);
                        } else {
                            aList.push(obj.list[i]);
                        }
                    }
                    if (tList.length) {
                        delay = Math.min(delay + 100, 1000);
                        html += '<div class="mail-line"><p class="delay-' + delay + ' animated zoomIn">今天</p><ul class="mail-ul">';
                        for (var i = 0; i < tList.length; i++) {
                            html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name">' +
                                tList[i].senderName +
                                '</span><span class="li-title" data-id="' + tList[i].mailId + '">' +
                                tList[i].title +
                                '</span><span class="li-done"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
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
                            html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name">' +
                                yList[i].senderName +
                                '</span><span class="li-title" data-id="' + yList[i].mailId + '">' +
                                yList[i].title +
                                '</span><span class="li-done"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
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
                            html += '<li class="delay-' + delay + ' animated zoomIn"><span class="li-name">' +
                                aList[i].senderName +
                                '</span><span class="li-title" data-id="' + aList[i].mailId + '">' +
                                aList[i].title +
                                '</span><span class="li-done"><i class="fa fa-check" title="标记为已处理"></i></span><span class="li-time">' +
                                aList[i].receiveTime.replace('T',' ') +
                                '</span></li>';
                            delay = Math.min(delay + 100, 1000);
                        }
                        html += '</ul></div>';
                    }
                    document.getElementById('email-list').innerHTML = html;
                } else {
                    topAlert('网络错误','error');
                }
            },
            error: function() {
                topAlert('网络错误','error');
            }
        });
        
        }
    }

    /**
     * #email事件绑定
     */
    $('#email-list')
        //查看邮件详情
        .delegate('.li-title', 'click', function(this) {
            window.open("distributionEmailInfo.html?id="+this.id, "_self");
        })
        //返回邮件列表
        // .delegate('.back-btn', 'click', function() {
        //     showTaskList(testList,nowPage);
        // })
        // //回复邮件
        // .delegate('.reply-btn', 'click', function() {
        //     changePage('task','send');
        // })
        //详情页标记为已处理
        // .delegate('.done-btn', 'click', function() {
        //     $.ajax({
        //         url: "/api/email/manage",
        //         type: 'POST',
        //         dataType: 'json',
        //         data: {
        //             token:token,
        //             mailId: '123'
        //         },
        //         success: function (obj) {
        //             if(obj.status === 0) {
        //                 topAlert('处理成功','success');
        //                 showTaskList(testList,nowPage);
        //             } else {
        //                 topAlert('处理失败','error');
        //             }
        //         },
        //         error: function() {
        //             topAlert('处理失败','error');
        //         }
        //     });
        // })
        //列表页标记为已处理
        // .delegate('.li-done','click', function () {
        //     $.ajax({
        //         url: "/api/email/manage",
        //         type: 'POST',
        //         dataType: 'json',
        //         data: {
        //             token:token,
        //             mailId: '123'
        //         },
        //         success: function (obj) {
        //             if(obj.status === 0) {
        //                 topAlert('处理成功','success');
        //                 var line = $(this).parent(),
        //                     ul = line.parent();
        //                 line.removeClass()
        //                     .addClass('fadeOutRight animated')
        //                     .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        //                         $(this).remove();
        //                         //移除空ul
        //                         if (ul.html().indexOf('li') < 0) {
        //                             ul.parent().remove();
        //                         }
        //                         //若无待处理邮件，则显示提醒
        //                         if ($('#task').html().indexOf('mail-line') < 0) {
        //                             document.getElementById('task').innerHTML = '<div class="vertical-middle-t"> <div class="vertical-middle-tc"> <div class="no-content"> <p>没有需要处理的邮件</p> </div> </div> </div>';
        //                             setTimeout(function () {
        //                                 $('#task .no-content').addClass('grow');
        //                             }, 1);
        //                         }
        //                     });
        //             } else {
        //                 topAlert('处理失败','error');
        //             }
        //         },
        //         error: function() {
        //             topAlert('处理失败','error');
        //         }
        //     });
        // });

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

