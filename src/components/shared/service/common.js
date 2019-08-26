// ***
// 业务使用的公用方法
// ***
export default {
    isWeiXin: /micromessenger/.test(navigator.userAgent.toLowerCase()),
    isOnTheMini: window.__wxjs_environment === 'miniprogram',
    // 懒加载
    lazyLoadImg() {
        setTimeout(() => {
            const emergence = require("emergence.js");
            emergence.init({
                container: document.querySelector(".com-scroll-y"), // 滚动或者滑动事件的主体对象
                callback: function (element, state) {
                    if (state === 'visible') {
                        element.src = element.getAttribute('data-src');
                    }
                }
            });
            setTimeout(() => {
                document.querySelector(".com-scroll-y") && (document.querySelector(".com-scroll-y").scrollTop = 1);
            }, 100);
        }, 100);
    },
    // 获取路径参数值
    getQueryParams(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    // 设置cookie  
    setCookie(name, value, seconds) {
        seconds = seconds || 0;
        var expires = "";
        if (seconds != 0) {
            var date = new Date();
            date.setTime(date.getTime() + (seconds * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + escape(value) + expires + "; path=/";
    },
    // 清除cookie  
    clearCookie(name) {
        setCookie(name, "", -1);
    },
    // 随机生成uuid
    guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
    },
    // 浏览上报
    readReport(reportObj, appAgentView) {
        // let reportObj = {
        //      router: 上报的路由地址
        //      target_uuid: 转发或浏览那东西的 uuid
        //      target_type: 转发或浏览那东西的类型，类型如下
        //          11、資訊，12、保险产品，13、疾病，14、文章，15、个人主页，16、产品对比
        //          51、贺卡 61、醫療產品 71、个人主页（小程式）81、醫療產品（报名表）
        //      one_way: 转发的用户的 uuid 的路径，以逗号分隔，
        //      c_user_uuid: 客户浏览的 uuid
        //      mark: 前端需要生成的唯一标识
        //      duration: 浏览的时长
        //      length: 浏览的篇幅 
        //      platform: -1旧数据 1:微信, 2:facebook, 3:qq, 4:tw, 5:whatsApp, 6:weibo, 7:小程序, 8:浏览器
        // }
        let maxScroll = 0;
        let startTime = new Date().getTime();
        window.isReportReady = false;
        let reportInterval = null;
        const ua = navigator.userAgent.toLowerCase();
        reportObj.mark = window.markUuid;
        reportObj.one_way = this.getQueryParams('one_way') ? this.getQueryParams('one_way') : window.userUuid;
        reportObj.duration = 10;
        reportObj.c_user_uuid = window.rootUserInfo['c_user_uuid'];
        reportObj.platform = window.platform;
        // 赋值全局上报参数
        window.reportParam = reportObj;
        // console.log('上报平台：' + reportObj.platform);
        setTimeout(() => {
            if (document.querySelector('.com-scroll-y')) {
                document.querySelector('.com-scroll-y').onscroll = function () {
                    let scrollTop = this.scrollTop;
                    maxScroll = parseInt(scrollTop > maxScroll ? scrollTop : maxScroll);
                }
            }
        }, 100);

        // 上报接口
        const reportFn = function () {
            setTimeout(() => {
                let pageH = 0;
                document.querySelector('.com-scroll-y') && (pageH = document.querySelector('.com-scroll-y').scrollHeight); // 页面完整高度
                let windowH = document.body.clientHeight; // 页面可视区域高度
                let nowTime = new Date();
                let time = Math.round((nowTime - startTime) / 1000);
                reportObj.length = (pageH > 0 ? parseInt(((maxScroll + windowH) / pageH).toFixed(2) * 100) : 0); // 浏览的篇幅
                reportObj.length > 100 && (reportObj.length = 100);
                // 赋值全局上报参数
                window.reportParam = reportObj;
                // console.log(reportObj);
                window.$http.post(appAgentView ? '/behavior/agent-view' : '/behavior/view', reportObj).then(res => {
                    window.isReportReady = true;
                }, err => {
                    window.isReportReady = false;
                });
                // 400s后不再轮询
                if (time > reportObj.duration * 40) {
                    clearInterval(reportInterval);
                }
            }, 100);
        }
        reportFn();
        reportInterval = setInterval(() => {
            if (window.isReportReady) {
                reportFn();
            }
        }, reportObj.duration * 1000);
    },
    // 分享上报
    reportWxShare(reportObj) {
        reportObj.one_way = ((this.getQueryParams('one_way') ? this.getQueryParams('one_way') : window.userUuid) + ',' + window.rootUserInfo['c_user_uuid']);
        // console.log(reportObj);
        window.$http.post('/behavior/share', reportObj);
    },
    // 初始化微信分享
    initWX(share) {
        // console.log(share);
        // let share = {
        //     title: '',  // 默认分享标题
        //     thumbImage: '', // 分享缩略图
        //     desc: '', // 分享描述
        //     user_uuid: '', // agent的uuid 
        //     c_user_uuid: '', // 分享用户uuid
        //     link: '', // 自定义分享链接
        //     isReport: '', // 是否上报
        //     customTitle: '', // 自定义分享标题
        //     platform: -1旧数据 1:微信, 2:facebook, 3:qq, 4:tw, 5:whatsApp, 6:weibo, 7:小程序, 8:浏览器
        // }

        // user_uuid和c_user_uuid从全局取
        if (window.userUuid && window.rootUserInfo['c_user_uuid']) {
            share.c_user_uuid = window.rootUserInfo['c_user_uuid'];
            share.platform = window.platform;
        }
        // 赋值全局分享参数
        window.shareParam = share;

        // 缩略图尺寸
        if (!window.inApp && /static.iberhk.com/ig.test(share['thumbImage']) && !/!/ig.test(share['thumbImage'])) {
            share['thumbImage'] = ((share['platform'] === 1) ? (share['thumbImage'] + '!wechat-thumb') : ((share['platform'] === 2) ? (share['thumbImage'] + '!fb-thumb') : (share['thumbImage'] + '!thumb-250')));
        }
        // console.log(share['thumbImage']);

        const wx = require('weixin-js-sdk'),
            ua = navigator.userAgent.toLowerCase(),
            _this = this;
        window.wx = wx;
        if (wx && /micromessenger/.test(ua) || /wechatdevtools/.test(ua)) {
            let link = (share['link'] || window.location.href);
            let codeReg = new RegExp((/&code=/.test(link) ? '&code=' : 'code=') + this.getQueryParams('code'), 'ig');
            let stateReg = new RegExp((/&state=/.test(link) ? '&state=' : 'state=') + this.getQueryParams('state'), 'ig');
            link = link.replace(codeReg, '').replace(stateReg, '');
            // user_uuid和c_user_uuid从全局取
            if (window.userUuid && window.rootUserInfo['c_user_uuid']) {
                let oneWay = this.getQueryParams('one_way');
                let oneWayString = 'one_way=' + oneWay;
                link = link.replace('wac=1', '').replace(oneWayString + '&', '').replace(oneWayString, '');
                let oneWayLink = 'one_way=' + ((oneWay ? oneWay : window.userUuid) + ',' + window.rootUserInfo['c_user_uuid']);
                if (link.indexOf('?') === -1) {
                    link += '?' + oneWayLink;
                } else {
                    link += '&' + oneWayLink;
                }
            }
            console.warn(link);
            window.$http.get('/c-user/get-wechat-js-config', {}).then(res => {
                if (res.code === 0) {
                    window.wxConfig = res.data;
                    wx.config({
                        debug: false,
                        appId: window.wxConfig.appId,
                        timestamp: window.wxConfig.timestamp,
                        nonceStr: window.wxConfig.nonceStr,
                        signature: window.wxConfig.signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
                    });
                    wx.ready(function () {
                        // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                        wx.onMenuShareTimeline({
                            title: share['customTitle'] ? share['customTitle'] : share['title'],
                            link: link,
                            imgUrl: share['thumbImage'],
                            success: function () {
                                share['isReport'] && _this.reportWxShare(share);
                            }
                        });
                        // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                        wx.onMenuShareAppMessage({
                            title: share['title'],
                            desc: share['desc'],
                            link: link,
                            imgUrl: share['thumbImage'],
                            success: function () {
                                share['isReport'] && _this.reportWxShare(share);
                            },
                        });
                        // 获取“分享到QQ”按钮点击状态及自定义分享内容接口
                        wx.onMenuShareQQ({
                            title: share['title'],
                            desc: share['desc'],
                            link: link,
                            imgUrl: share['thumbImage'],
                            success: function () {
                                share['isReport'] && _this.reportWxShare(share);
                            }
                        });
                        // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
                        wx.onMenuShareWeibo({
                            title: share['title'],
                            desc: share['desc'],
                            link: link,
                            imgUrl: share['thumbImage'],
                            success: function () {
                                share['isReport'] && _this.reportWxShare(share);
                            }
                        });
                        // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
                        wx.onMenuShareQZone({
                            title: share['title'],
                            desc: share['desc'],
                            link: link,
                            imgUrl: share['thumbImage'],
                            success: function () {
                                share['isReport'] && _this.reportWxShare(share);
                            }
                        });

                        // 显示微信右上角按钮
                        wx.showOptionMenu();
                    })
                }
            });
        }
    },
    // 获取对应年月当月的天数
    getDaysInMonth(year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
    },
    // 获取日期数据
    getDateData(start, end, showUnit = true) {
        let years = [],
            months = [],
            nowYear = new Date().getFullYear();
        for (let i = start; i <= end; i++) {
            years.push(i + (showUnit && '年'));
        }
        for (let i = 1; i <= 12; i++) {
            months.push((String(i).length === 1 && '0') + i + (showUnit && '月'));
        }
        return {
            years: years,
            months: months
        }
    },
    // 加载js
    loadScript(url, callback, error) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        // anonymous即不发送Cookie和HTTP认证信息
        // script.crossOrigin = "Anonymous";
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
            error && (script.onerror = function (msg, url, l) {
                error(msg, url, l);
            });
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    // 加载css
    loadStyle(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    },
    // 日期格式化
    formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
            }
        }
        return fmt;
    },
    // 货币格式化
    formatMoney(num, places, symbol, thousand, decimal) {
        !num && (num = 0);
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : '$';
        thousand = thousand || ',';
        decimal = decimal || '.';
        var number = num,
            negative = number < 0 ? '-' : '',
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '',
            j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '');
    },
    // 判断是否是数组
    isArray(arr) {
        return Object.prototype.toString.call(arr) == '[object Array]';
    },
    //假定字符串的每节数都在5位以下
    toNum(a) {
        if (a) {
            var a = a.toString();
            //也可以这样写 var c=a.split(/\./);
            var c = a.split('.');
            var num_place = ["", "0", "00", "000", "0000"], r = num_place.reverse();
            for (var i = 0; i < c.length; i++) {
                var len = c[i].length;
                c[i] = r[len] + c[i];
            }
            var res = c.join('');
            return res;
        }
    },
    // 版本对比
    compareVersion(a, b) {
        // a当前版本，b规定版本号
        var _a = this.toNum(a), _b = this.toNum(b);
        if (_a >= _b) { return true; }
        if (_a < _b) { return false; }
    },
    // 引入友盟事件统计
    youmengTrackEvent(category, action, label, value, nodeid) {
        // _czc.push(["_trackEvent", category, action, label, value, nodeid]);
        (typeof (_czc) != 'undefined') && _czc.push(["_trackEvent", category, action, label, value, nodeid]);
    },
};