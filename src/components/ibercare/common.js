//import cmn from "@/components/ibercare/common.js";

//小程序环境
let wxSdk = null;
if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
  wxSdk = require('weixin-js-sdk');
}


export default {
  name: 'iBerCare公共函数',


  run() {
    console.log(this.name);
  },

  //优化页面切换倒计时暂停事件机制
  toInterval(load, unload) {
    function getHiddenProp() {
      let prefixes = ['webkit','moz','ms','o'];
      if ('hidden' in document) {
        return 'hidden';
      }
      for (let i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document) {
          return prefixes[i] + 'Hidden';
        }  
      }
      return null;
    }
    function getVisibilityState() {
      var prefixes = ['webkit', 'moz', 'ms', 'o'];
      if ('visibilityState' in document) {
        return 'visibilityState';
      }
      for (let i = 0; i < prefixes.length; i++) {
        if ((prefixes[i] + 'VisibilityState') in document){
          return prefixes[i] + 'VisibilityState';
        }  
      }
    }
    let visProp = getHiddenProp();
    let aux = visProp.replace(/[H|h]idden/, "");
    let eventName = null;
    if (aux == "") {
      eventName = 'visibilitychange';
    } else {
      eventName = aux + 'Visibilitychange';
    }  
    document.addEventListener(eventName, ()=> {
      //从前台切换到后台 
      if (document.webkitVisibilityState=='hidden') {
        if (unload) {
          unload();
        }
        return ;
      } 
      //从后台切换到前台
      if (load) {
        load();  
      }
    }, false);
  },

  //小程序路由控制
  miniPagePath(options) {
    options = options || {};
    options.route = options.route || "/pages/frame/box";
    options.path = options.path || "";
    options.title = options.title || "这位童鞋为什么不传页面名称? 出来解释。";
    options.keys = options.keys || {};
    options.query = options.query || {};
    options.type = options.type || "navigateTo";  //wx.redirectTo

    let key = "";
    for (let j in options.keys) {
      key += j + '=' + options.keys[j] + '&';
    }

    let path = "";
    for(let i in options.query) {
      path += i + '=' + options.query[i] + '&';
    }
    path = window.baseUrl + options.path + '?' + path.replace(/\&$/g, '');

    let pathUrl = options.route + '?title=' + options.title + '&url=' + encodeURIComponent(path);
    if (key != "") {
      pathUrl = options.route + '?' + key + 'title=' + options.title + '&url=' + encodeURIComponent(path);
    }
    if (options.type) {
      wxSdk.miniProgram[options.type]({url: pathUrl});
      return ;
    }
    wxSdk.miniProgram[options.type]({url: pathUrl});
  },

  //小程序支付
  miniWxPay(options) {
    options = options || {};
    options.type = options.type || "navigateTo";
    options.page_back = options.page_back;

    let pathUrl = '/pages/pay/pay?user_uuid=' + options.user_uuid + '&care_order_uuid=' + options.care_order_uuid;
    if (options.page_back) {
      pathUrl = pathUrl + "&page_back=" + options.page_back;
    }
    let self = options.object;
    self.getRootUserInfo().then((auth) => {
      options.c_user_uuid = auth.c_user_uuid;
      wxSdk.miniProgram[options.type]({
        url: pathUrl+ '&c_user_uuid=' + options.c_user_uuid
      }); 
    });
  },

  //获取

  //金额·千分位符
  changeFormat(value) {
    if (!plug.valueValid(value)) {
      value = "";
    }
    value = value.toString();
    return value.replace('.00', '').toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }

}