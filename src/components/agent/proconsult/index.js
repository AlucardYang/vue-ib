import Clipboard from "clipboard";
import comAgentWechat from "@/components/component/com_agent_wechat.vue";
import comOauthedPhone from "@/components/component/com_oauthed_phone.vue";

export default {
  name: '',
  data () {  
    return {
      wxixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,

      fbixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/fb.{2,}\//) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120, 
      
      info: {
        iber_info: {}
      },
      
      agent: {
        nickname: null,
        name_zh: null,
        name_en: null,
        position: null,
        avatar: null
      },
      sendMsgInfo: null,
      loadingMsg: this.simply ? "发送消息" : "發送消息",
      consultState: false,
      showWechat: true,
      userAvatar: null,

      key: {  //处理IOS系统部分在微信升级至版本 6.7.4引起软键盘收起时留下灰白BUG
        state: false,
        send: false
      },

      user_uuid: null,
      answer_uuid: null, 
      from_type: null,
      v2_c_user_uuid: null,
      
      msgID: null,
      msgCountLength: 0,
      msgContent: "", 
      isSend: false, 

      comAgentWechatData: { 
        layer: 0,
        name: "comAgentWechatData",
        id: "",
        qr_url: ""
      },

      authedData: {
        name: "authedData",
        layer: 0,
        mphone: null,
        mobile_pre: null
      },

      dialogList: []
    }
  },      
  components: {
    comAgentWechat,
    comOauthedPhone
  },
  methods: {
    compatible: function() {
      if (plug.ios) {
        window.setTimeout(()=> {
          document.body.scrollTop = document.body.scrollHeight;
        }, 200); 
      }  
    },
    quit: function() {
      this.$refs.msgTag.blur();
    },
    send: function() {  
      //过滤字符串前后空格
      this.msgContent = this.msgContent.replace(/(^\s*)|(\s*$)/g, '');
      if (this.msgContent == "") {
        return ;
      }

      //处理部分软键盘在ISO上的微信升级版本至版本 6.7.4存在的灰白BUG
      this.key.send = true;
      this.$refs.msgTag.focus(); 

      //清除輪詢
      window.clearInterval(this.sendMsgInfo); 
 
      this.getRootUserInfo().then((auth)=> {
        //auth.c_user_uuid
        if (!plug.valueValid(this.v2_c_user_uuid)) {
          this.v2_c_user_uuid = auth.c_user_uuid;
        }

        this.pushMsgList({
          msg: this.msgContent,
          c_user_uuid: this.v2_c_user_uuid
        }); 
        this.msgContent = "";  
         
        this.sendMsgInfo = window.setInterval(()=> {
          this.pushMsgList({
            msg: "",
            c_user_uuid: this.v2_c_user_uuid
          });   
        }, 1000);
      });  
    },

    //轮询消息
    pushMsgList: function(args) {
      this.$http.ajax({
        path: "message/index",
        type: "post", 
        language: this['language']['currentLang'],
        data: {
          iberId: this.user_uuid,
          c_user_uuid: args.c_user_uuid,
          lastId: this.msgID, 
          message: args.msg == undefined ? "" : args.msg,
          fromType: this.from_type,
          fromId: this.answer_uuid 
        },
        toast: false
      }).then((res)=> {  
        this.pullMsgList(res.data.list, res.data.iber_info.wechat_num, auth.c_user_uuid);
      });
    },

    //处理返回数据模型
    pullMsgList: function(dataList, wechat_num, c_user_uuid) {
      let dialogArray = [];
      if (dataList != undefined && dataList.length > 0) {
        dataList.forEach((value, index, array)=> {
          //微信信息
          if (index == 0 && value.authorid == this.user_uuid) {
            let dialog = {
              type: 0,   
              uuid: "hello",
              time: value.create_at,
              content: value.msg,
              template: 0,
              params: {
                wechatID: wechat_num
              }
            }; 
            dialogArray.push(dialog);
          }
          //agent消息
          if (index > 0 && value.authorid == this.user_uuid) {
            let dialog = {
              type: 0,  
              uuid: value.uuid,
              loading: false, 
              continueSend: false,  
              time: value.create_at,
              content: value.msg
            };  
            dialogArray.push(dialog);
          }
          //user消息
          if (index > 0 && value.authorid != this.user_uuid) {
            let dialog = {
              type: 1,  
              uuid: value.uuid,
              loading: false, 
              continueSend: false,  
              time: value.create_at,
              content: value.msg
            };  
            dialogArray.push(dialog);
          }
        });
        this.dialogList = [];
        this.dialogList = dialogArray;


        //推送消息下推
        if (dataList.length > this.msgCountLength) {
          this.msgCountLength = dataList.length;  
          window.setTimeout(()=> {
            this.$refs.scrollBom.scrollTop = this.$refs.scrollBom.scrollHeight; 
          }, 200); 
        } 
      }
    },

    //复制Wechat
    copyWechat: function(id) {
      if (!plug.valueValid(id)) {
        let _toast = this.simply ? "微信ID不存在或无效" : "微信ID不存在或無效";
        this.$toast(_toast);
        return ;  
      }
      let clipboard = new Clipboard("#wechatID");
      clipboard.on("success", (e)=> {
        let _toast = this.simply ? "已复制到粘贴板" : "已複製到粘貼板";
        this.$toast(_toast);
        clipboard.destroy();  
      }); 
      clipboard.on("error", (e)=> {
        let _toast = this.simply ? "复制失败，请重新复制" : "複製失敗，請重新複製";
        this.$toast(_toast);
        clipboard.destroy();
      });   
    },

    //获取授权
    getOAuth: function() {
      this.$root.consauth.identity = "consult"; 
      this.$root.consauth.user_uuid = this.user_uuid; 
      this.$root.consauth.answer_uuid = this.answer_uuid;
      this.$root.consauth.layer = 1;   
    },

    getOAuthed: function() {
      this.authedData.layer = 1;
    },

    goAgentURL: function() {
      let agentUrl = this.info.iber_info.home_page_url;

      //小程序环境
      if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
        //window.location.href = args.page;
        //Peter逻辑
        const wxSdk = require('weixin-js-sdk');
        setTimeout(()=>{
          wxSdk.miniProgram.switchTab({
            url: '/pages/broker/broker?scene=' + this.user_uuid
          });
        }, 500);

        return ;
      } 

      window.location.href = agentUrl;
    },
    call: function() {
      window.open('tel:' + this.info.iber_info.user_mobile);
    },
    openWechat: function() {
      let id = this.comAgentWechatData.id;
      let qr = this.comAgentWechatData.qr_url;
      if (plug.valueValid(id) && !plug.valueValid(qr)) {
        let clipboard = new Clipboard("#copyAgentW");
        clipboard.on("success", (e)=> {
          let _toast = this.simply ? "已复制到粘贴板" : "已複製到粘貼板";
          this.$toast(_toast);
          clipboard.destroy();  
        }); 
        clipboard.on("error", (e)=> {
          let _toast = this.simply ? "复制失败，请重新复制" : "複製失敗，請重新複製";
          this.$toast(_toast);
          clipboard.destroy();
        }); 
        return ;  
      }

      // this.comAgentWechatData.layer = 1;
      // 打开微信弹窗
      this.$root.agentCardInfo.show = true;
      this.$root.agentCardInfo.qrcode_type = 1;
    }
  }, 
  mounted: function() {
    this.$nextTick(()=> {
      //alert("[信息] @开始监听");
      this.getRootUserInfo().then((auth)=> {
        //auth.c_user_uuid
        if (!plug.valueValid(this.v2_c_user_uuid)) {
          this.v2_c_user_uuid = auth.c_user_uuid;
        } 

        //授权识别    
        this.$http.ajax({      
          path: "c-user/whether-need-auth-mobile",
          type: "post",
          language: this['language']['currentLang'],
          data: {
            user_uuid: this.user_uuid,
            c_user_uuid: this.v2_c_user_uuid 
          },
          intercept: (msg)=> {
            this.$root.pageLoading.layer = 2;  
          }
        }).then((res)=> {  
          this.$root.consauth.code = res.data.mobile_pre; 
          this.$root.consauth.mphone = res.data.mobile;
          this.$root.consauth.anonymous = res.data.is_anonymous; 

          this.authedData.mphone = res.data.mobile;
          this.authedData.mobile_pre = res.data.mobile_pre;

          /*
           *@自动弹窗
           *@字段：out_message_page_view
           **/
          //主动弹框 - 不需要用户输入手机号
          if (res.data.out_message_page_view == "has_mobile") {
            this.$root.pageLoading.layer = 0;
            this.$root.consauth.mphone_auth = 1;
            this.$root.consauth.user_uuid = this.user_uuid;
            this.$root.consauth.answer_uuid = this.answer_uuid;
            this.$root.consauth.layer = 1;            
          }

          //主动弹框 - 需要用户输入手机号
          if (res.data.out_message_page_view == "no_mobile") {
            this.$root.pageLoading.layer = 0;
            this.$root.consauth.mphone_auth = 0; 
            this.$root.consauth.user_uuid = this.user_uuid;
            this.$root.consauth.answer_uuid = this.answer_uuid;
            this.$root.consauth.layer = 1;
          }


          /*
           *@及时接收顾问回复
           *@字段：in_message_page_view
           **/

          //顾问及时接收回复 - 不需要用户输入手机号
          if (res.data.in_message_page_view == "has_mobile") {
            this.$root.consauth.mphone_auth = 1;
            this.consultState = false;
          } 

          //顾问及时接收回复 - 需要用户输入手机号
          if (res.data.in_message_page_view == "no_mobile") {
            this.$root.consauth.mphone_auth = 0;
            this.consultState = false;           
          }

          if (!plug.valueValid(res.data.in_message_page_view)) {
            this.consultState = true; 
          }





          if (res.data.out_message_page_view == "") {
            //消息流数据
            this.$http.ajax({
              path: "message/index", 
              type: "post", 
              language: this['language']['currentLang'],
              data: { 
                iberId: this.user_uuid,
                c_user_uuid: this.v2_c_user_uuid,
                lastId: this.msgID,    
                message: "",
                fromType: this.from_type,
                fromId: this.answer_uuid
              },
              toast: false, 
              intercept: (msg)=> {
                this.$root.pageLoading.layer = 0;
                //同步IM消息
                this.sendMsgInfo = window.setInterval(()=> {
                  this.pushMsgList({
                    msg: "",
                    c_user_uuid: this.v2_c_user_uuid
                  }); 
                }, 1000);     
              }
            }).then((res)=> {
              //Agent資料  
              this.info = res.data;
              let obj = res.data.iber_info; 
              this.agent.nickname = !plug.valueValid(obj.nickname) ? plug.phoneFormat(res.data.auth_phone) : obj.nickname;
              this.agent.name_en = obj.name_en;
              this.agent.position = obj.position;
              this.agent.avatar = obj.avatar;  
              this.userAvatar = res.data.customInfo.avatar;
        
              this.comAgentWechatData.id = res.data.iber_info.wechat_num;
              this.comAgentWechatData.qr_url = res.data.iber_info.wx_qrcode_content;
        
              // 微信弹窗二维码和微信ID数据
              this.$root.agentCardInfo.wechat_num = res.data.iber_info.wechat_num;
              this.$root.agentCardInfo.qrcode = res.data.iber_info.wx_qrcode_content;

              let wx_id = res.data.iber_info.wechat_num;
              let wx_src = res.data.iber_info.wx_qrcode_content;
              if (!plug.valueValid(wx_id) && !plug.valueValid(wx_src)) {
                this.showWechat = false;
              } 
        
              this.pullMsgList(res.data.list, res.data.iber_info.wechat_num, this.v2_c_user_uuid);

              this.$root.pageLoading.layer = 0;
              this.sendMsgInfo = window.setInterval(()=> {
                this.pushMsgList({
                  msg: "", 
                  c_user_uuid: this.v2_c_user_uuid
                });
              }, 1000);   
            });  
          }

        }); 

      }); 

    });
  }, 
  created () {  
    document.title = this.simply ? "咨询顾问" : "諮詢顧問";

    this.$root.pageLoading.layer = 1; 
    this.$root.pageLoading.info = this.simply ? "获取消息中" : "獲取消息中";

    this.$root.msgAlert = false; 

    console.log(this.urlParams);

    let query = this.$route.query; 
    if (!plug.valueValid(query) || !plug.valueValid(query.user_uuid) || !plug.valueValid(query.answer_uuid) || !plug.valueValid(query.from_type)) { 
      this.user_uuid = this.urlParams.user_uuid; 
      this.answer_uuid = this.urlParams.answer_uuid; 
      this.from_type = this.urlParams.from_type;

    } else {
      this.user_uuid = query.user_uuid; 
      this.answer_uuid = query.answer_uuid; 
      this.from_type = query.from_type;
    }
    //小程序环境
    if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
      //
    }    
    
    //处理部分软键盘在ISO上的微信升级版本至版本 6.7.4存在的灰白BUG(待出最佳方案)
    document.addEventListener('focusin', () => {  //软键盘弹起事件
      this.key.state = true; 
    });

    document.addEventListener('focusout', (e) => { //软键盘关闭事件
      this.key.state = false; 

      if (plug.ios && !plug.iphone5) {
        window.setTimeout(()=> {
          if (!this.key.send) {
            document.body.scrollTop = document.body.scrollHeight + 1;
            this.iosVersion = false;
          }
        }, 800);
      }

    });
    

  },
  watch: {
    msgContent: function(val, oldVal) {
      let filt = val.replace(/(^\s*)|(\s*$)/g, '');
      if (filt.length > 0) {
        this.isSend = true;
      } else { 
        this.isSend = false;
      }
    },
    
    "key.send": function(val, oldVal) {
      if (val) {
        window.setTimeout(()=> {
          this.key.send = false;
        }, 2000);
      }
    }
  }
}