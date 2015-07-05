+function($) {
    /**
     * 获取token
     */
    var token = $.cookie('token'),
        name = $.cookie('name');
    var maidId = getQueryString("id");
    document.getElementById('username').innerHTML = name;
    topAlert('欢迎回来','welcome');

    //截取URL参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
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

    $.ajax({
        type: "GET",
        url:  "/api/distribution/getMailInfo",
        data: {
            token: token,
            mailId:mailId
        },
        success:function(obj) {
            if (obj.status === 0) {
                console.log("success");
            }
        },
    });
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

