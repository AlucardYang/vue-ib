import Vue from 'vue';
import * as dom from "@/assets/library/dom.js";
import font from '@/assets/library/simply.js';

export default {
  name: "iBer Plugin",
  system: {
    port: window.location.port,
    env: window.location.port == 8080,
    docH: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  },

  ua: navigator.userAgent.toLowerCase(),
  ios: navigator.userAgent.toLowerCase().match(/iphone/i) != null,
  android: navigator.userAgent.toLowerCase().match(/android/i) != null,
  iphone5: navigator.userAgent.toLowerCase().match(/iphone/) != null && window.screen.height == 568 && window.screen.width == 320,
  iphonex: window.screen.height == 812 && window.screen.width == 375,  //.4rem
  huawei: navigator.userAgent.toLowerCase().match(/\/huawei/g) != null,  //华为
  samsung: navigator.userAgent.toLowerCase().match(/\Wsm-/g) != null,  //三星
  qihu: navigator.userAgent.toLowerCase().match(/build\/mmb29m/g) != null,  //360
  chrome: navigator.userAgent.toLowerCase().match(/chrome/i) != null,
  safari: navigator.userAgent.toLowerCase().match(/iphone/i) != null && navigator.userAgent.toLowerCase().match(/safari\/[1-9]/i) != null,
  qq: navigator.userAgent.toLowerCase().match(/QQ\/[1-9]/i) != null,
  fb: navigator.userAgent.toLowerCase().match(/fb.{2,}\//) != null,
  weibo: navigator.userAgent.toLowerCase().match(/weibo/g) != null,
  fbixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/fb.{2,}\//) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,  
  wxix: navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375,
  wxixb: (window.screen.height - document.documentElement.clientHeight) > 120,
  tab: window.screen.height - document.documentElement.clientHeight > 10,
  wxixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,

  href: window.location.href,
  search: window.location.search, 

  wx: {  //plug.wx.platform
    platform: navigator.userAgent.toLowerCase().match(/micromessenger/) != null
  },

  ...dom,

  //对象转为PATH参数
  transObjectPath(obj) {
    obj = obj || {};

    let path = "";
    for(let i in obj) {
      path += i + '=' + obj[i] + '&';
    } 
    path = path.replace(/\&$/g, '');
    return path;
  },

  //APP显示, 其他不显示  {{plug.apphshow(inApp, '', '')}}
  apphshow(app, text, other) {
    other = other || "";
    if (app) {
      return text;
    }
    return other;
  },

  //APP显示HK$, H5显示港币  {{plug.price(inApp, simply)}}
  price(app, simply) {
    if (app) {
      return "HK$";
    }
    return this.sm(simply, '港幣');
  },

  //获取DOM元素距离文档顶部位置
  getElDocument: function(el) {
    if (!el || el.nodeType != 1) {
      console.log("请传入元素对象Element");
      return ;
    }
    if(el.parentElement) {
      return this.getElDocument(el.parentElement) + el.offsetTop;
    }
    return el.offsetTop;
  },

  /*
   *@获取CSS属性值
   *@plug.getCssVal()
   **/
  getCssVal: function(el) {
    let attr = null;
    if (window.getComputedStyle) {
      attr = window.getComputedStyle(el, null);
    } else {
      attr = el.currentStyle;
    }
    return attr;
  },

  /*
   *@功能: 滚动
   plug.scroll(e, this);
   **/
  scroll: function(e, self, callback) {
    self.scroll.object = e.srcElement;
    let scroll = {
      width: e.srcElement.clientWidth,
      height: (self.inApp && this.valueValid(self.$route.query.height)) ? self.$route.query.height : e.srcElement.clientHeight,
      w: e.srcElement.scrollWidth,
      h: e.srcElement.scrollHeight,
      top: e.srcElement.scrollTop
    }
    for (let i in scroll) {
      self.scroll[i] = scroll[i];
    }
    if (callback) {
      callback(self, scroll);
    }
    if (scroll.top/scroll.height > 2) {
      self.scroll.state = true;
      return ;
    } 
    self.scroll.state = false;
  },  

  /*
   *@功能: 返回顶部
   plug.backTop(this);
   **/
  backTop: function(self) {
    let top = self.scroll.top;
    let interval = window.setInterval(()=> {
      top -= Math.ceil(top/5);
      if (top < 1) {  
        top = 0;
        window.clearInterval(interval);
      }
      self.scroll.object.scrollTop = top;
    }, 1);
  },

  /*
   *@Func: 点赞
   *@: praise: {state: false, handle: false}
   plug.approval({
     object: this,
     approval: {user_homepage_template_uuid: this.user_homepage_template_uuid, user_uuid: this.user_uuid}
   }); 
   */
  approval: function(args) {
    args = args || {};

    let self = args.object;
    if (self.inApp) {
      return ;
    }
    if (self.praise.handle) {
      let _toast = self.simply ? "不可反复操作" : "不可反復操作";
      self.$toast(_toast);
      return ;
    }
    self.praise.handle = true;
    //设置
    if (!this.valueValid(args.approval.c_user_uuid)) {
      args.approval.c_user_uuid = window.rootUserInfo['c_user_uuid'];
    }
    //默认模板为agent主页
    if (!this.valueValid(args.approval.target_type)) {
      args.approval.target_type = 15;
    }
    args.approval.router = window.location.pathname;
    args.approval.platform = window.platform;

    self.$http.ajax({
      path: "behavior/like",
      type: "post",
      data: args.approval,
      intercept: ()=> {
        window.setTimeout(() => {
          self.praise.handle = false;
        }, 2000); 
      }
    }).then((res)=> {
      //已点赞
      if (res.data.isCanceled == 0) {
        window.setTimeout(() => {
          self.praise.state = true;
          self.praise.handle = false;
        }, 1000); 
        return;
      }
      let _toast = self.simply ? "已取消点赞" : "已取消點讚";
      self.$toast(_toast);
      
      self.praise.state = false;
      window.setTimeout(() => {
        self.praise.handle = false;
      }, 3000);
    });
  },

  /*
   *@功能：判断JS文件是否加载完成
    plug.loadScript({
      object: this,
      url: "",
      id: "",
      callback: ()=> {}
    });
   */ 
  loadScript: function(args) {
    args = args || {};

    let scriptID = null;
    if (this.valueValid(args.url)) {
      scriptID = document.createElement("script");
　　　 scriptID.type = "text/javascript";
　　　 scriptID.src = args.url;
　　　 document.getElementsByTagName('head')[0].appendChild(scriptID);
    } else {
      scriptID = args.id;
    }

    //IE9低版本（含IE9以下）
    if (scriptID.readyState == "complete" || scriptID.readyState == "loaded") {
      scriptID.onreadystatechange = null;
      args.callback();
    } else {
      scriptID.onload = function() {
        console.log(scriptID);
        args.callback();
      }
    }
  },


  //获取Cookie值this.plug.getCookieValue(name)
  getCookieValue: function(name) {
    if (this.valueValid(document.cookie)) {
      let arr = document.cookie.replace(/\s/g, "").split(";");
      let state = false;
      for (let i = 0; i < arr.length; i++) {
        let getArr = arr[i].split("=");
        if (getArr[0] == name) {
          state = true;
          return getArr[1];
        }
      }
      if (!state) {
        return "";
      }
    }
    return "";
  },

  //阻止冒泡this.plug.bubble()
  bubble: function(e) {
    if (this.valueValid(e.target.className)) {
      if (e.target.className.match("e-bubble") != null || e.currentTarget.className.match("e-bubble") != null) {
        return true; 
      }
      return false;
    }
    return false;
  },

  //plug.wxAlbum(url, index);
  wxAlbum: function(url, index) {
    let arr = [];
    let imgArray = [];

    if (url.constructor == Array) {
      imgArray = url;
    } else {
      imgArray.push({url: url});
    }
    imgArray.forEach((value, index, array)=> {
      arr.push(value.url);
    });
    const wx = require('weixin-js-sdk');
    wx.previewImage({
      current: arr[index],
      urls: arr
    });
  },

  //plug.getAgentAlbum(url, index);
  getAgentAlbum: function(url, index) {
    let arr = [];
    let imgArray = [];
    
    if (url.constructor == Array) {
      imgArray = url;
    } else {
      imgArray.push({url: url});
    }
    imgArray.forEach((value, index, array)=> {
      arr.push(value.url);
    });
    postMessage(JSON.stringify({
      type: "previewPhoto",
      data: {
        imgs: arr,
        select: index,
        enableSave: true
      }
    }));   
  },

  //获取JSON字符串
  getStrJSON: function(content) {
    return JSON.stringify(content);
  },

  //获取user/a-a-模板PATH
  getAgentPath: function() {
    let path = this.href.replace(window.baseUrl, "");
    path = path.split("?")[0].replace(/^\//g, "");
    //user/a-a-i
    return path;
  },

  //plug.sendAgentShare(this.share, "personal_home_page");
  sendAgentShare: function(share, type) {
    window.personShare = function() {
      postMessage(JSON.stringify({
        type: "sharePicker", 
        data: {
          type: type,
          share: share, 
          setting: {
            hide_platform: [], // 默认值：全显示传[] ['timeline', 'wechat', 'facebook', 'whatsapp', 'instagram', 'qq', 'weibo', 'copy', 'more'],
            language: 'auto', //显示语言，默认值：auto, 可选值：null, 'auto', 'zh-cn', 'zh-tw'
            auth: 'force', //微信授权，默认值：force, 可选值：null, 'force', 'free'
            card: 'null', //底部名片，默认值：full, 可选值：null, 'full', 'simple', 'hide'
            comment: 'null', //个人感想，默认值：show, 可选值: null, 'show', 'hide'
            moreShare: 'null'
          }
        }
      }));
    }
  },
  
  //过滤空格
  filterSpace: function(content) {
    if (!this.valueValid(content)) {
      return ""; 
    }
    return content.replace(/\s/g, "");
  },

  //将字符串转换为数组-分隔符：\n或<br>
  strSplit: function(content) {
    if (this.valueValid(content)) {
      if (content.match("\n") != null) {
        return content.split("\n");
      } else if (content.match("<br>") != null) {
        return content.split("<br>");
      } else if (content.match("<br\>") != null) {
        return content.split("<br\>"); 
      } else {
        return content.split("\n");
      }
    }
    return [];
  },

  //将\n转换为<br>
  transBr: function(content) { 
    if (this.valueValid(content)) {
      let ctn = content.replace(/\s/g, "&nbsp;");
      return ctn.replace(/\n/g, "<br>"); 
    }
    return content; 
  }, 
  //<p v-for="(dx,index) in plug.transBrArr(dx.content)" :key="index" class="com-p-html">{{dx}}</p>
  transBrArr(content) {
    if (this.valueValid(content)) {
      let ctn = content.split("<br/>");
      return ctn;
    }
    return content;
  },
  //<p v-for="(dx,index) in plug.transBrArr(dx.content)" :key="index" class="com-p-html">{{dx}}</p>
  transBrArr(content) {
    if (this.valueValid(content)) {
      let ctn = content.split("<br/>");
      return ctn;
    }
    return content;
  },
  prohibitFilter: function(content) {
    if (this.valueValid(content)) {
      let result = content;
      result = result.replace(/\n/g, "-nn-");
      result = result.replace(new RegExp("<", "g"), "&lt;");
      result = result.replace(/-nn-/g, "<br>");
      return result; 
    }
    return "";
  },

  //删除URL指定参数，并返回删除参数后的URL
  deleteUrlArgs: function(url, data) {
    let path = url;
    if (!this.valueValid(url)) {
      path = this.href;
    }

    let result = "";
    if (path.match(/\?/g) == null) {
      result = path;
      return result; 
    }

    let base = path.split("?")[0];
    let search = path.split("?")[1];
    let args = search.split("&");

    if (data != undefined && data.length > 0) {
      data.forEach((value, index, array)=> {
        for (let i = 0; i < args.length; i++) {
          if (args[i].match(value) != null) {
            this.remove(args, i);
          }
        }
      });
    } 

    args.forEach((value, index, array)=> {
      result += "&" + value;
    });
    result = result.replace(/^\&/i, "?");
    return base + result;  
  },

  //URL与JSON互相转换
  jsonToUrl: function(value) {
    //value不存在，当!this.valueValid(value)为true，则实现url参数转换为json
    let req = {};
    if (!this.valueValid(value)) {
      if (!this.valueValid(this.search)) {
        return req;
      }
      let path = this.search;
      let arr = path.replace(/^\?/i, "").split("&");
      arr.forEach((value, index, array)=> {
        req[value.split("=")[0]] = value.split("=")[1];
      }); 
      return req;  
    } 

    
    //当!this.valueValid(value)为false，则实现json转换为url参数
    let url = "";
    for (let i in value) {
      //过滤对象中回调函数 
      if ((typeof value[i]).toLowerCase() == "function") {
        continue; 
      }
      url += "&" + i + "=" + value[i];
    } 
    url = url.replace(/^\&/i, "?");
    //备注：禁止启动 url = url.replace(/\&$/i, "");
    return url;   
  }, 
  getAgentID: function(urlTopath) {
    let href = this.href.split("?")[1];
    if (urlTopath == undefined) {
      if (!this.valueValid(href)) {   
        return "undefined"; 
      } else {     
        if (href.match("user_uuid") != null) {
          return href.split("user_uuid")[1].split("&")[0].split("=")[1];
        } else { 
          return "undefined";
        } 
      } 
    } else {  //this.urlParams
      return urlTopath.user_uuid;
    }  
  },  
  
  /*
   *@进入页面判断是否已申报页面
   *@跳转到-咨询对话
   plug.authAddress({
    object: this,  //Vue对象或子对象，注意作用域 
    user_uuid: this.user_uuid,
    c_user_uuid: this.c_user_uuid,
    answer_uuid: this.answer_uuid,
    from_type: this.$root.fromType
   });  
   */
  authAddress: function(args) {
    args = args || {};

    let self = args.object;

    let params = {
      user_uuid: args.user_uuid,
      answer_uuid: args.answer_uuid,
      from_type: args.from_type,
      v2_c_user_uuid: args.v2_c_user_uuid, 
      from_ib_url: args.from_ib_url,
      callback_url: args.callback_url,
      auth: window.auth
    }
    let miniParams = {
      user_uuid: args.user_uuid,
      answer_uuid: args.answer_uuid,
      from_type: args.from_type,
      v2_c_user_uuid: args.v2_c_user_uuid
    }

    let reg = this.href.match(/\/agent\/consult/) != null || this.href.match(/\/agent\/address/) != null; 
    if (!reg) {
      params.callback_url = encodeURIComponent(this.href);
    } 

    //小程序环境
    if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
      //咨询页面，不处理
      if (args.page == "proconsult" || args.page == "consult") {
        return ;
      }

      let programUrl = window.baseUrl + "/agent/proconsult" + plug.jsonToUrl(params);

      //Peter逻辑
      const that = this;
      const wxSdk = require('weixin-js-sdk');
      setTimeout(()=>{
        wxSdk.miniProgram.navigateTo({
          url: '/pages/consult/consult?url=' + encodeURIComponent(programUrl)
        }); 
      }, 500);

      return ;
    }

    //判断是否需要地址申报
    self.$http.ajax({
      path: "/user/agent-setting",
      type: "get",
      data: {
        user_uuid: args.user_uuid
      }
    }).then((res)=> {
      //业务模型 
      
      //visit_need_area_declare == 0 不需要地址申报
      if (res.data.visit_need_area_declare == 0 && args.page != "consult") {
        window.location.href = window.baseUrl + "/agent/consult" + this.jsonToUrl(params);
        return ;
      }
      if (res.data.visit_need_area_declare == 0 && args.page == "consult") {
        return ;
      }
      
      //visit_need_area_declare == 1 需要地址申报
      let address_term_time = window.localStorage.getItem("address_term_time");
      if (this.valueValid(address_term_time)) {
        let date = new Date();
        let term_time = date.getTime() - address_term_time;
        let is_term = term_time / 3600000;
  
        //申报地址有效期处于1小时内 
        if (is_term < 1) {
          if (args.page == "consult") {
            return ; 
          }
          window.location.href = window.baseUrl + "/agent/consult" + this.jsonToUrl(params);
          return ; 
        }
        //申报地址过期
        window.location.href = window.baseUrl + "/agent/address" + this.jsonToUrl(params);
        return ; 
      }
      //未申报地址
      window.location.href = window.baseUrl + "/agent/address" + this.jsonToUrl(params);

    });

  }, 


  /*
   *@地址申报
   *@其他页面在跳转至”个人主页“之前判断是否需要申报地址
   plug.addrDeclare({
     object: this,  //Vue对象或子对象，注意作用域
     app: this.inApp,
     page: "",  //申报地址成功后跳转URL
     user_uuid: ""  //agent ID
   });
   */
  addrDeclare: function(args) {
    args = args || {};

    let self = args.object;

    let path = args.page;
    if (path.match(/\?/g) != null) {
      args.page += "&in_app=" + (args.app ? 1 : 0);
    } else {
      args.page += "?in_app=" + (args.app ? 1 : 0);
    }
    if (args.app) {
      window.location.href = args.page;
      return ;
    }
    
    args.language = self['lang'];
    //注释此URL, 避免在地址申报中异常出现两次user_uuid
    //args.url = this.href;  //当前页面URL

    //H5拼接语言参数 
    if (this.judgeUrlKey(args.page)) {
      if (!this.getUrlKey("language")) {
        args.page += ("&language=" + args.language + "&auth=" + window.auth);
      } 
    } else { 
      args.page += ("?language=" + args.language + "&auth=" + window.auth);
    }

    //小程序环境
    if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
      //window.location.href = args.page;
      //Peter逻辑
      const that = this;
      const wxSdk = require('weixin-js-sdk');
      setTimeout(()=>{
        wxSdk.miniProgram.navigateTo({
          url: '/pages/container/container?url=' + args.page
        }); 
      }, 500);

      return ;
    } 

    //判断是否需要地址申报
    self.$http.ajax({
      path: "/user/agent-setting",
      type: "get",
      data: {
        user_uuid: args.user_uuid
      }
    }).then((res)=> {
      //业务模型 
      //visit_need_area_declare == 0 不需要地址申报
      if (res.data.visit_need_area_declare == 0) {
        window.location.href = args.page;
        return ;
      }
      
      //visit_need_area_declare == 1 需要地址申报
      let address_term_time = window.localStorage.getItem("address_term_time");

      if (this.valueValid(address_term_time)) {
        let date = new Date();
        let term_time = date.getTime() - address_term_time;
        let is_term = term_time / 3600000;
  
        //申报地址有效期处于1小时内 
        if (is_term < 1) {
          window.location.href = args.page;
          return ; 
        }

        //申报地址过期
        args.page = encodeURIComponent(args.page); 
        window.location.href = window.baseUrl + "/address" + this.jsonToUrl(args);
        return ; 
      }
      //未申报地址
      args.page = encodeURIComponent(args.page); 
      window.location.href = window.baseUrl + "/address" + this.jsonToUrl(args);

    });


  },


  /*
   *@打开个人主页申报地址
   *@若不需要申报，则不做处理；若申报，则申报后返回个人主页
    plug.autoDeclare({
      object: this,  //Vue对象或子对象，注意作用域
      app: this.inApp,
      user_uuid: ""  //agent ID
    });
   **/
  autoDeclare: function(args) {
    args = args || {};

    if (args.app) {
      return ;
    }
    let self = args.object;
    args.stringify = true;
    args.page = encodeURIComponent(this.href);
 

    //判断是否需要地址申报
    self.$http.ajax({    
      path: "/user/agent-setting",
      type: "get",
      data: {
        user_uuid: args.user_uuid
      }
    }).then((res)=> {
      //业务模型 
      
      //visit_need_area_declare == 0 不需要地址申报
      if (res.data.visit_need_area_declare == 0) {
        return ;
      }
      //visit_need_area_declare == 1 需要地址申报
      let address_term_time = window.localStorage.getItem("address_term_time");
    
      if (this.valueValid(address_term_time)) {
        let date = new Date();
        let term_time = date.getTime() - address_term_time;
        let is_term = term_time / 3600000;
  
        //申报地址有效期处于1小时内 
        if (is_term < 1) {
          return ; 
        }
        //申报地址过期
        window.location.href = window.baseUrl + "/address" + this.jsonToUrl(args);
        return ; 
      }
      //未申报地址
      window.location.href = window.baseUrl + "/address" + this.jsonToUrl(args);

    });


  },


  //手机隐藏格式
  phoneFormat: function(mphone) {
    mphone = mphone + "";
    let phone = mphone.replace(/\s/g, "");
    let format = "";
    if (phone.length == 11) {
      format = phone.substr(0, 3) + " " + phone.substr(3, 2) + "** **" + phone.substr(9, 2); 
    }
    if (phone.length == 10) {
      format = phone.substr(0, 3) + " " + phone.substr(3, 1) + "** **" + phone.substr(7, 2); 
    }
    if (phone.length == 8) { 
      format = phone.substr(0, 2) + "** **" + phone.substr(6, 2);
    }
    return format;
  },

  //判断手机号码
  judgePhone: function(mphone) {
    if (!this.valueValid(mphone)) {
      return false;
    }
    let phone = mphone.replace(/\s/g, "");
    return (phone.length == 11 || phone.length == 10 || phone.length == 8) ? true : false;
  },

  //语言转换
  language: function() {
    let path = window.location.href.split("?")[1];
    if (path == undefined) {
      return path;
    }
    let params = path.split("&");
    let language = null;
    params.forEach((value, index, array)=> {
      let item = value.split("=");
      if (item[0] == "language") {
        language = item[1];
      }
    });
    if (language == null) {
      return undefined;
    }
    return language;
  },

  //获取URL
  exchangeUrl: function(args) {
    let path = window.baseUrl + "/" + args; 
    return path;    
  },

  //判断该值是否有效
  valueValid: function(varible) {
    if (varible == undefined || varible == "undefined" || varible == null || varible == "null" || varible == "") {
      return false;
    } 
    return true;
  },

  //该对象是否有值 plug.objectValue()
  objectValue: function(obj) {
    obj = obj || {};

    for (let i in obj) {
      return true;
    }
    return false;
  },

  judgeUrlKey: function(url) {
    let URL = url;
    let key = url.indexOf("?");
    if (key !== -1) {
      return true;
    }
    return false;
  },

  //获取参数
  getUrlKey: function(tagID) {
    let href = this.href.split("?")[1];
    if (this.valueValid(href) && href.match(tagID) != null) {
      return href.split(tagID)[1].split("&")[0].split("=")[1];
    } 
    return false;  
  },

  //禁止微信下拉回弹
  shieldWXspring: function() {
    //禁止微信下拉回弹
    let shield = {
      obj: document.getElementsByClassName("com-scroll-y")[0],
      startY: 0,
      prevY: null,
      moveY: 0
    };

    //触摸事件
    document.body.addEventListener("touchstart", function (e) {
      shield.startY = e.touches[0].pageY;
      shield.moveY = 0;
    }, false);

    //移动事件
    document.body.addEventListener("touchmove", function (e) {
      shield.moveY = e.touches[0].pageY;
      
      //记录上一次移动Y
      let prevY = null;
      if (shield.prevY == null) {
        prevY = shield.startY;
      } else {
        prevY = shield.prevY;
      }

      //更新上一次Y
      shield.prevY = shield.moveY;

      let differY = prevY - shield.moveY;

      //下移
      if (differY <= 0) {
        if (shield.obj.scrollTop <= 0) {
          e.preventDefault(); 
        }
      }  
    }, false);

    //结束事件
    document.body.addEventListener("touchend", function (e) {
      shield.prevY = null;
      shield.moveY = 0;
    }, false);
  },

  //移除数组中某一值
  remove: function(array, idx) {
    array = array || [];

    if ((typeof idx).toLowerCase() === 'number') {
      for (let i = 0, n = 0; i < array.length; i++) {
        if (idx != i)
        {
          array[n] = array[i];
          n++;  
        }  
      }
      array.length -= 1;
      return array;
    } else {
      console.log('参数传输类型或值错误');
    }    
  },

  //获取URL参数code
  getLocation: function() {
    this.location = { 
      url: window.location.href,
      search: window.location.search,
      query: {}
    }; 
    if (this.location.search != "") {
      let search = this.location.search || "";
      let args = search.replace("?");
      let arr = args.split("&");

      arr.forEach((value, index, array)=> {
        if (value.match("code=") != null) {
          let _arr = value.split("=");
          this.location.query.code = _arr[1];
        } 
      });
    }
    return this.location; 
  }, 

  //微信授权获取open_id与用户信息
  getWXOAuth: function(args) {
    args = args || {};

    let self = args.object;

    //微信系统平台
    if (this.wx.platform) { 
      let storage = window.localStorage.getItem("wx_oauth_info");
      let json = null;
      let openID = null; 
      if (storage != null && storage != undefined && storage != "") {
        json = JSON.parse(storage); 
        openID = json.openid; 
      }

      if (!this.valueValid(openID)) {  
        this.getLocation();   
        let wx_code = this.location.query.code;

        if (wx_code != undefined) {
          self.$http.ajax({
            path: "c-user/iber-pay-open-id",
            type: "get",
            data: { 
              code: wx_code 
            }
          }).then((res) => {   
            //业务模型                     
            window.localStorage.setItem("wx_oauth_info", JSON.stringify(res.data));
            this.wx.openid = res.data.openid;
            this.wx.oauth = res.data; 
            if (args != undefined && args.callback != undefined) {
              args.callback(res.data);
            }
          });
          return ;
        }
        self.$http.ajax({
          path: "c-user/get-wechat-js-config",
          type: "get",
          data: {}
        }).then((res) => { 
          //业务模型   
          let config = res.data; 
          let redirect = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.appId + "&redirect_uri=" + encodeURIComponent(window.location.href) + "&response_type=code&scope=snsapi_userinfo&state=123&t=" + Date.now() + "#wechat_redirect";   
          window.location.href = redirect;       
        });
        
        return; 
      } 

      this.wx.openid = openID;   
      this.wx.oauth = JSON.parse(window.localStorage.getItem("wx_oauth_info"));
      if (args != undefined && args.callback != undefined) {
        args.callback(this.wx.oauth);
      } 
    }
  },

  // 打开留言弹窗
  openGuestBook: function (args){
    args = args || {};

    let self = args.object;
    self.$root.guestBook.wx_qrcode = args.wx_qrcode;
    self.$root.guestBook.wechat_num = args.wechat_num;
    self.$root.guestBook.show = true;
  },

  // 打开留言弹窗
  openAgentQrcode: function (args){
    args = args || {};
    
    let self = args.object;
    // agent设定的二维码
    self.$root.agentCardInfo.qrcode_type = args.qrcode_type;
    self.$root.agentCardInfo.qrcode = args.qrcode;
    args.wechat_num && (self.$root.agentCardInfo.wechat_num = args.wechat_num);
    self.$root.agentCardInfo.show = true;
  },

  //获取日期-对象
  setDate: function(args) {
    let date = new Date();
    date.setYear("2010");
    date.setMonth("1");
    date.setDate("1");
    date.setHours("1");
    date.setMinutes("1");
    date.setSeconds("1");
    //date.getMilliseconds();
    return date;
  },

  //获取日期-年
  getYear: function(dateObj, format) {
    let date = !this.valueValid(dateObj) ? new Date() : dateObj;

    let time = date.getFullYear();
    return time;
  },

  //获取日期-月
  getMonth: function(dateObj, format) {
    let date = !this.valueValid(dateObj) ? new Date() : dateObj;

    let time = date.getMonth();

    let result = time > 9 ? time : "0" + time;
    return !this.valueValid(format) ? time : result; 
  },

  //获取日期-日
  getDate: function(dateObj, format) {
    let date = !this.valueValid(dateObj) ? new Date() : dateObj;

    let time = date.getDate(); 

    let result = time > 9 ? time : "0" + time; 
    return !this.valueValid(format) ? time : result; 
  },

  //获取时间-时
  getHours: function(arg) {
    let date = null;
    if (arg != undefined) {
      date = arg;
    } else {
      date = new Date();
    }
    let time = date.getHours();
    let result = null;
    result = time > 9 ? time : "0" + time;
    return result;
  },

  //获取时间-分
  getMinutes: function(arg) {
    let date = null;
    if (arg != undefined) {
      date = arg;
    } else {
      date = new Date();
    }
    let time = date.getMinutes();
    let result = null;
    result = time > 9 ? time : "0" + time;
    return result;
  },

  //获取时间-秒
  getSeconds: function(arg) {
    let date = null;
    if (arg != undefined) {
      date = arg;
    } else {
      date = new Date();
    }
    let time = date.getSeconds();
    let result = null;
    result = time > 9 ? time : "0" + time;
    return result;
  },

  //获取时间-毫秒
  getMilliseconds: function(arg) {
    let date = null;
    if (arg != undefined) {
      date = arg;
    } else {
      date = new Date();
    }
    let time = date.getMilliseconds();
    return time;
  },


  shareAgentHome: function(simply, content) {
    let text = "";
    let back = "";
    if (simply) {
      text = "为您提供卓越专属的极致服务";
    } else {
      text = "為您提供卓越專屬的極致服務";
    }
    if (!this.valueValid(content)) {
      back = text;
    } else {
      back = content;
    }
    return back;
  },
  
  //个人主页底部申明{{plug.agentDeclare(simply)}}
  agentDeclare: function(simply) {
    if (simply) {
      return "本页内容仅为个人观点，不代表内容中提及的公司/机构/团体之意见，亦不构成其官方通信";
    }
    return "本頁內容僅為個人觀點，不代表內容中提及的公司/機構/團體之意見，亦不構成其官方通訊";
  },
  simplyAgentBottomTxt: "本页内容仅为个人观点，不代表内容中提及的公司/机构/团体之意见，亦不构成其官方通信",
  agentBottomTxt: "本頁內容僅為個人觀點，不代表內容中提及的公司/機構/團體之意見，亦不構成其官方通訊",

  //plug.smft(simply, '', '')   {{plug.smft(simply, '', '')}}
  smft(simply, sm, unsm) {
    if (simply) {
      return sm;
    }
    return unsm;
  },

  //plug.sm(simply, '') plug.sm(this.simply, '')   {{plug.sm(simply, '')}}
  sm(simply, value) {
    let _simply = font.simply;
    let _unsimy = font.unsimply;

    //转换为简体 
    let simfont = function(content) {
      let _content = "";
      for (let i = 0; i < content.length; i++) {
        let _font = content.charAt(i);
        if (_unsimy.indexOf(_font) != -1) {
          _content += _simply.charAt(_unsimy.indexOf(_font));
        } else { 
          _content += _font;
        }   
      }
      return _content;
    };

    //转换为繁体 
    let unmfont = function(content) {
      let _content = "";
      for (let i = 0; i < content.length; i++) {
        let _font = content.charAt(i);
        if (_simply.indexOf(_font) != -1) {
          _content += _unsimy.charAt(_simply.indexOf(_font));
        } else {
          _content += _font;
        }
      }
      return _content;
    }

    value = simfont(value);
    if (simply) {  
      return value;   
    } 
    return unmfont(value);
  }, 

  end: "iBer 版权所属"
}