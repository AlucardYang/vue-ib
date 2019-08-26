// ***
// 页面初始化公用方法，勿加业务方法
// ***
export default {
  // 随机生成uuid
  guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
  },
  // 获取路径参数值
  getQueryParams(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  // 加密
  //   encrypt(text) {
  //     const CryptoJS = require("crypto-js"),
  //         // url aes 秘钥
  //         URL_SECRET_KEY = "iBer_Secret_Key_",
  //         URL_SECRET_IV = "iBer_Secret_Key_";
  //     var key = CryptoJS.enc.Utf8.parse(URL_SECRET_KEY);
  //     var iv = CryptoJS.enc.Utf8.parse(URL_SECRET_IV);
  //     var encryptText = CryptoJS.AES.encrypt(text, key, {
  //         iv: iv,
  //         mode: CryptoJS.mode.CBC,
  //         padding: CryptoJS.pad.ZeroPadding
  //     }).toString();
  //     // var decodeEcrypt = encodeURIComponent(encryptText).toString();
  //     // console.log('加密之后：', encryptText);
  //     // console.log('url编码之后：', decodeEcrypt);
  //     return encryptText;
  // },
  // 解密
  decrypt(encryptText) {
    const CryptoJS = require("crypto-js"),
      // url aes 秘钥
      URL_SECRET_KEY = "iBer_Secret_Key_",
      URL_SECRET_IV = "iBer_Secret_Key_";
    var key = CryptoJS.enc.Utf8.parse(URL_SECRET_KEY);
    var iv = CryptoJS.enc.Utf8.parse(URL_SECRET_IV);
    var text = CryptoJS.AES.decrypt(encryptText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString(CryptoJS.enc.Utf8);
    return text;
  },
  // 获取cookies
  getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  },
  // 获取对应环境Api接口域名
  getApiHosts() {
    return {
      'h5.goodiber.com': 'https://h5.goodiber.com',
      'dev1mp.goodiber.com': 'https://dev1mp.goodiber.com/v2/api',
      'dev2mp.goodiber.com': 'https://dev2mp.goodiber.com/v2/api',
      'dev1page.goodiber.com': 'https://dev1page.goodiber.com/v2/api',
      'dev2page.goodiber.com': 'https://dev2page.goodiber.com/v2/api',
      'testmp.goodiber.com': 'https://testmp.goodiber.com/v2/api',
      'testpage.goodiber.com': 'https://testpage.goodiber.com/v2/api',
      'mp.goodiber.com': 'https://mp.goodiber.com/v2/api',
      'page.goodiber.com': 'https://page.goodiber.com/v2/api',
      'expmp.goodiber.com': 'https://expmp.goodiber.com/v2/api',
      'exppage.goodiber.com': 'https://exppage.goodiber.com/v2/api',
      'mp.iberhk.com': 'https://mp.iberhk.com/v2/api',
      'page.iberhk.com': 'https://page.iberhk.com/v2/api',
      'mpv2.iberhk.com': 'https://mpv2.iberhk.com/v2/api',
    };
  },
  // 初始化微信JSSDK
  initWXJSSDK() {
    const wx = require('weixin-js-sdk');
    window.wx = wx;
    if (wx && /micromessenger/.test(ua) || /wechatdevtools/.test(ua)) {
      window.$http.get('/c-user/get-wechat-js-config', {}, {
        backurl: window.location.href
      }).then(res => {
        if (res.code === 0) {
          const config = res.data;
          window.wxConfig = res.data;
          wx.config({
            debug: false,
            appId: config.appId,
            timestamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: ['hideOptionMenu', 'showOptionMenu']
          });
          wx.ready(function () {
            // 隐藏微信右上角按钮
            if (/\/pay\//.test(window.location.href) && !/iber-care/.test(window.location.href)) {

            } else {
              wx.hideOptionMenu();
            }
          });
          window.wx = wx;
        }
      });
    }
  },
  // 获取对应环境域名
  getEnvironments() {
    return {
      'h5dev.iber2.com': 'development',
      'h5.goodiber.com': 'test',
      'mp.goodiber.com': 'test',
      'dev1mp.goodiber.com': 'test',
      'dev2mp.goodiber.com': 'test',
      'dev1page.goodiber.com': 'test',
      'dev2page.goodiber.com': 'test',
      'testmp.goodiber.com': 'test',
      'testpage.goodiber.com': 'test',
      'page.goodiber.com': 'test',
      'expmp.goodiber.com': 'exp',
      'exppage.goodiber.com': 'exp',
      'mp.iberhk.com': 'production',
      'page.iberhk.com': 'production',
      'mpv2.iberhk.com': 'production',
    };
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
  // 友盟统计
  youmengStat() {
    const environments = this.getEnvironments();
    if (environments[location.hostname] === 'production') {
      // 友盟线上域名埋点mp.iberhk.com, page.iberhk.com
      this.loadScript('https://s13.cnzz.com/z_stat.php?id=1267716380&web_id=1267716380', () => { });
    } else if (environments[location.hostname] === 'exp') {
      // 友盟预发布域名埋点 expmp.goodiber.com exppage.goodiber.com
      this.loadScript('https://s23.cnzz.com/z_stat.php?id=1277640566&web_id=1277640566', () => { });
    } else if (environments[location.hostname] === 'test') {
      // 友盟测试域名埋点mp.goodiber.com, page.goodiber.com, dev1mp.goodiber.com, dev2mp.goodiber.com, dev1page.goodiber.com, dev2page.goodiber.com, testmp.goodiber.com, testpage.goodiber.com
      this.loadScript('https://s96.cnzz.com/z_stat.php?id=1277364197&web_id=1277364197', () => { });
    }
  },
  // 引入友盟事件统计
  youmengTrackEvent(category, action, label, value, nodeid) {
    // _czc.push(["_trackEvent", category, action, label, value, nodeid]);
    (typeof (_czc) != 'undefined') && _czc.push(["_trackEvent", category, action, label, value, nodeid]);
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
}