/**
 * Created by Sunyao_Will on 15/6/29.
 */

/**
 * 顶部弹出框
 * @param word 显示内容
 * @param type success为绿色成功框，error为红色警告框
 * @param time 显示时间，默认值为2000
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
    },time || 2000);
}

/**
 * 登出
 */
document.getElementsByClassName('logout')[0].addEventListener('click', function(){
    $.cookie('token', '');
    $.cookie('name', '');
    window.location.href = 'index.html';
})

