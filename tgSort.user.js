// ==UserScript==
// @name         Tg Sort by reactions
// @name:ru      Tg Сортировка по реакциям
// @name:zh      Tg 按反应排序
// @version      0.1.3
// @description  Allows you to find posts with a lot of reactions (likes) in Telegram
// @description:ru Позволяет найти сообщения с наибольшим количеством реакций (лайков) в Телеграм
// @description:zh 允许您在电报中找到有很多反应（喜欢）在 Telegram
// @author       sokollondon
// @match        https://web.telegram.org/z/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.3/jquery.scrollTo.min.js
// @grant        none
// @namespace    https://gist.github.com/sokollondon/4be0d13f33a371895308ed7b1dc15fcf
// ==/UserScript==

(function() {
    let style = `
#sBtn{position:fixed;top:73px;right:16px;width:45px;height:45px;padding:5px;border-radius:10px;text-align:center;font-size:20px;padding-top:5px;z-index:2;opacity: .7;background:url(https://cdn0.iconfinder.com/data/icons/font-awesome-solid-vol-4/512/sort-amount-down-alt-64.png) no-repeat center center;background-size:32px;background-color:#fff;cursor:pointer;}
.theme-dark #sBtn{background-color: #a9a9a9;}
@media screen and (max-width: 600px) {
    #sBtn{top: 111px;right: 8px;}
}
    `;
    $('body').prepend('<style>'+style+'</style>');

    //Btn
    $('body').prepend("<div id='sBtn' title='Сортировать по количеству реакций'></div>");

    $('#sBtn').click(function() {
        $('.message-date-group').each(function() {//add date to msg
            let date = $(this).find('.sticky-date').text();
            $(this).find('.message-list-item').each(function() {
                $(this).find('.message-time').prepend(date+' ');
            });
        });
        $('.message-list-item').detach().sort(function(a, b) {
            let $aQty = $(a).find('.Reactions .Button:first').text2qty(),
                $bQty = $(b).find('.Reactions .Button:first').text2qty();
            return $aQty - $bQty;
        }).appendTo($('.messages-container'));
        $('.MessageList').scrollTo($('.message-list-item:last .Reactions'),{axis:'y'});
    });

    $.fn.text2qty = function () {
        let t = $(this).text(),
            qty = toFloat(t),
            ava = $(this).find('.Avatar');
        if(ava.length){
            qty = ava.length;
        }else if(t.match("K$")){
            qty = qty*1000;
        }else if(t.match("M$")){
            qty = qty*1000000;
        }
        //console.info(qty);
        return qty;
    }

    function toFloat(str) {
        return str.replace(/[^0-9.,]/g,'').replace(/[,]/g,'.');
    }
})();