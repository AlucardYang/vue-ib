export default {
  name: "agent API",


  //函数
  run: function() {
    //
  },

  getMoreData(self) {
    if (self.more.request) {
      return ; 
    }
    self.more.request = true;
    
    if (self.more.stop) {
      self.more.state = false; 
      return ;
    }
    self.more.state = true;

    self.$http.ajax({
      path: "user/user-photo-list",
      type: "get",
      data: {
        user_uuid: self.user_uuid,  
        page: self.more.page
      },
      toast: true,
      intercept: (msg)=> {
        self.more.request = false;
        self.more.state = false; 
      }
    }).then((res)=> {
      self.more.request = false;
      //业务模型
      res.data.forEach((value, index, array)=> {
        for (let i = 0; i < value.photo_list.length; i++) {
          res.data[index].photo_list[i].setbg = ""; 
          res.data[index].photo_list[i].state = false;
          res.data[index].photo_list[i].ref = "img" + index + "id" + i;
          res.data[index].photo_list[i].src = res.data[index].photo_list[i].url + "?x-oss-process=image/resize,w_300";
          if (plug.iphone5) {
            res.data[index].photo_list[i].url += "?x-oss-process=image/resize,w_500";
          }
        }
      }); 
      res.data.forEach((value, index)=> {
        self.agent.photos.push(res.data[index]);
      });
      
      if (res.data.length < 3) {
        self.more.state = false; 
        self.more.stop = true;
        return ; 
      }  
      self.more.page += 1;
    });
  },

  /*
   *@咨询顾问 
   agn.consultAgent({
     object: this,
    user_uuid: "",
    answer_uuid: "",
    from_type: "",
    qrcode: "",
    wechat_num: ""
   });
   **/
  consultAgent: function(options) {
    options = options || {};

    let self = options.object;

    // 小程序环境
    if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
      if (!plug.valueValid(options.user_uuid) || !plug.valueValid(options.answer_uuid) || !plug.valueValid(options.from_type)) {
        let _toast = self.simply ? "当前参数错误" : "當前參數錯誤";
        self.$toast(_toast);
        return ;
      }
      plug.authAddress({
        object: self, //Vue对象或子对象，注意作用域
        user_uuid: options.user_uuid,
        answer_uuid: options.answer_uuid,
        from_type: options.from_type
      });
    } else {
      // 打开留言流程弹窗
      self.$root.agentCardInfo.nickname = self.agent.baseInfo.nickname;
      self.$root.agentCardInfo.mobile = self.agent.baseInfo.mobile;
      self.$root.agentCardInfo.targetUuid = self.user_homepage_template_uuid;
      plug.openGuestBook({
        object: self,
        wx_qrcode: options.qrcode,
        wechat_num: options.wechat_num
      });
    }
  },


  beforeDeclare: function(self) {
    if (self.urlParams == undefined) {
      let query = self.$route.query;
      self.user_uuid = self.$route.query.user_uuid; 
    } else {
      self.user_uuid = self.urlParams.user_uuid; 
    }
    if (window.__wxjs_environment != "miniprogram" && window.platform != 7) {
      plug.autoDeclare({
        object: self,  //Vue对象或子对象，注意作用域
        app: inApp, 
        user_uuid: self.user_uuid  //agent ID
      });   
    }
  },

  //重置图片属性
  setImgAttr: function(self, refId, imgUrl, index, c_index) {
    let obj = refId;
    obj = new Image();
    obj.src = imgUrl;
    obj.onload = ()=> {
      if (obj.width > obj.height) {
        self.agent.photos[index].photo_list[c_index].setbg = "auto 100%";
      } else {
        self.agent.photos[index].photo_list[c_index].setbg = "100% auto";
      } 
      self.agent.photos[index].photo_list[c_index].state = true;
    } 
  },

  //设置标题
  setTitle: function(simply, nickname, mobile) {
    simply = simply || false;
    let title = "";
    let title_name = "";
    if (plug.valueValid(nickname)) {
      title_name = nickname;
    } else { 
      title_name = plug.phoneFormat(mobile);
    }
    title = simply ? title_name + "的个人主页" : title_name + "的個人主頁";
    document.title = title;
    return title;
  },

  //请求模板数据
  /*
   agn.getTemplData({
     object: this,
     callback: (res)=> {}
   });
   */
  getTemplData: function(options) {
    options = options || {};

    let self = options.object;
    let reportData = {
      user_homepage_template_uuid: self.user_homepage_template_uuid
    }
    self.getRootUserInfo(reportData).then((auth)=> {
      //auth.c_user_uuid
      self.$http.ajax({
        path: "user/personal-home-page",
        type: "get",
        language: self['language']['currentLang'],
        data: {
          user_uuid: self.user_uuid,
          c_user_uuid: auth.c_user_uuid,
          user_homepage_template_uuid: self.user_homepage_template_uuid
        },  
        dealwith: (msg)=> {
          self.$root.pageLoading.layer = 2; 
          self.$root.blueLoadingParams.show = false;
        }, 
        intercept: (msg)=> { 
          self.$root.pageLoading.layer = 2; 
          self.$root.blueLoadingParams.show = false;
        }
      }).then((res)=> {
        //设置不显示个人相册时, 禁止上拉加载相册
        if (res.data.photos.length == 0) {
          self.more.stop = true;
        }
        
        options.callback(res); 
      });
    });

  }
}