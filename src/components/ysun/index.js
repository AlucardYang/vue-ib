// import Vue from 'vue';
import { Button, MessageBox, Popup, Picker} from 'mint-ui';
// Vue.component(Button.name, Button);
// Vue.component(Popup.name, Popup);
// Vue.component(Picker.name, Picker);

import comOauthPhone from "@/components/component/com_oauth_phone.vue";
import comOauthConsult from "@/components/component/com_oauth_consult.vue";
import comAgentWechatContact from "@/components/component/com_agent_wechat_contact.vue";

import comAgentWechat from "@/components/component/com_agent_wechat.vue";
import comAgentWechatIbercare from "@/components/component/com_agent_wechat_ibercare.vue";
import comIbercareLogin from "@/components/component/com_ibercare_login.vue";

import cmn from "@/components/ibercare/common.js";

//幻灯片
import '@/assets/library/slide.js';

import Clipboard from "clipboard";


export default {
  name: 'ysun',
  data () {
    return {
      wxixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,

      fbixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/fb.{2,}\//) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120, 

      showiBerCareLogin: false,
      iBerCareLogin: {
        user_uuid: 'fd20092d9487516103b9f3978ca6bd5f',
        c_user_uuid: '28c5d29c4b6efbc44e274d9ac8c6c3b9',
        mobile_pre: '86', 
        mobile: '12600001111',
        path: '/iber-care/pay-success',
        query: {}
      },

      sendMsgVData: {
        id: "Admin",
        auth: {
          state: false,
          code: "86",
          mphone: "13718647330"
        },
        name: "sendMsgVData", 
        layer: 0
      },

      pickerVState: false,

      radioVItem: false,
      radioVList: [
        {content: "", id: "", active: false},
        {content: "", id: "", active: false},
        {content: "", id: "", active: false}
      ],
      checkBoxVList: [
        {content: "", id: "", active: false},
        {content: "", id: "", active: false},
        {content: "", id: "", active: false}
      ], 
      toolBarTitle: "picker框",
      pickerValue: null,
      pickerSlots: [
        {
          flex: 1,
          values: [
            {value: "你好1", id: "1111"},
            {value: "你好2", id: "2222"}
          ]
        }
      ],
      comAgentWechatData: {
        layer: 0, 
        name: "comAgentWechatData",
        id: "ysun8dfd6df",
        qr_url: "https://static.iberhk.com/v2/web/images/evaluate/evaluate_qr.png"
      },
      comAWIData: { 
        layer: 0, 
        name: "comAWIData",
        name_en: "Admin",
        name_zn: "林大帅",
        id: "ysun8dfd6df",
        qr_url: "https://static.iberhk.com/v2/web/images/evaluate/evaluate_qr.png"
      },
      comAWCData: {
        layer: 0, 
        name: "comAWCData",
        name_en: "Admin",
        name_zn: "林大帅",
        id: "ysun8dfd6df",
        qr_url: "https://static.iberhk.com/v2/web/images/evaluate/evaluate_qr.png"   
      },
      
      controlPraise: false,

      inputNumber: "",
      scroll: {
        state: false,
        object: null
      },
      unloadPage: "前台展示"
    }  
  },
  components: {
    comOauthPhone,
    comOauthConsult,
    comAgentWechat,
    comAgentWechatIbercare,
    comAgentWechatContact,
    comIbercareLogin,
    'mt-button': Button,
    'mt-popup': Popup,
    'mt-picker': Picker,
  },
  beforeRouteLeave (to, from, next) {
    if (this.sendMsgVData.layer > 0) {
      this.sendMsgVData.layer -= 1;
      next(false); 
      return ;
    }  
    next(true); 
  },
  mounted() {
    this.$nextTick(()=> {
      //plug.shieldWXspring(); 
    });
  },
  created () { 
    document.title = "Ysun"; 

    let self = this;
    let interval = null;
    function startInterval() {
      window.clearInterval(interval);
      let date = new Date();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();

      self.unloadPage = "从前台切换到后台: " + hour + ":" + minute + ":" + second;

      interval = window.setInterval(()=> {
        if (hour >= 23) {
          hour = 0;
        }
        if (minute >= 60) {
          hour ++;
          minute = 0;
        }
        if (second >= 60) {
          minute ++;
          second = 0;
        }
        second ++;

        let _hour = null;
        let _minute = null;
        let _second = null;

        _second = second > 9 ? second : '0' + second;
        _minute = minute > 9 ? minute : '0' + minute;
        _hour = hour;

        let out = _hour + ":" + _minute + ":" + _second;
        self.inputNumber = out;
      }, 1000);
    }
    startInterval();

    cmn.toInterval(()=> {
      console.log("从后台切换到前台");
      startInterval();
    }, ()=> {
      //console.log("从前台切换到后台");
      this.unloadPage = "从前台切换到后台: " + Date.now();
    });

  },
  methods: {
    //iBerCare授权登录
    doiBerCareLogin() {
      this.showiBerCareLogin = true;
    },
    doPaste() {
      const clipboard = new Clipboard("#getClipboardID");
      clipboard.on("success", e => {
        let _toast = this.simply ? "已复制到粘贴板" : "已複製到粘貼板";
        this.$toast(_toast);
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        let _toast = this.simply ? "复制失败，请重新复制" : "複製失敗，請重新複製";
        this.$toast(_toast);
        clipboard.destroy();
      });
    },
    getSlideCount(index) {
      if (plug.valueValid(index)) {
        console.log(index);
      }
    },

    //事件
    debugHAct() {
      //this.$toast("提示"); 

      this.$http.ajax({
        base: "http://127.0.0.1:8010/",
        path: "",
        type: "get",
        data: {
          name: "世界",
          count: 100
        },
        filter: (res)=> {
          console.log(res.data);
        }
      }).then((res)=> {
        //业务模型 
      });
    },
    //页面加载框
    doPageLoading() {
      this.$root.pageLoading.layer = 1;

      this.$root.pageLoading.callback = ()=> {
        this.$root.pageLoading.layer = 1;
        window.setTimeout(()=> {
          this.$root.pageLoading.layer = 0;
        }, 2000); 
      };
      window.setTimeout(()=> {
        this.$root.pageLoading.layer = 2; 
      }, 3000);      
    },
    //加载数据框
    doLoading() {
      this.$root.loading.layer = 1;
      window.setTimeout(()=> {
        this.$root.loading.layer = 0; 
      }, 3000); 
    },
    doProgress() {
      this.$root.progress.layer = 1;
      window.setTimeout(()=> {
        this.$root.progress.layer = 0; 
      }, 3000);
    },

    scrollHandle: function(e) {
      plug.scroll(e, this);
    },
    backTop() {
      plug.backTop(this);
    },

    resetRender() {
      document.body.scrollTop = document.body.scrollHeight + 1;
    },
    getKeyCode: function(e) {
      //alert(e.keyCode);
    },
    

    //转换格式
    focusFormat() {
      this.inputNumber = this.inputNumber.toString().replace(/,/g, "");
    },
    blurFormat() {
      this.inputNumber = this.inputNumber.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
    //关闭当前窗口
    closecurWindow() {
      //window.open("about:blank","_self").close();
    },
    //点赞
    praiseAgent() {
      this.controlPraise = true;
      window.setTimeout(()=> {
        this.controlPraise = false; 
      }, 2000);
    },
    //联系顾问
    openAgentWCHAct() { 
      this.comAWCData.layer = 1;
    },
    //打开健康顾问
    openAgentWIHAct() { 
      this.comAWIData.layer = 1;
    },
    //打开顾问微信
    openAgentWechatHAct() {
      this.comAgentWechatData.layer = 1;
    },
    pickerHAct() {
      this.pickerVState = true;
    },
    onValuesChange: function(picker, values) {
      if (values[0] != undefined) {
        this.pickerValue = values[0];
      }
    },
    cancel() {
      this.pickerVState = false;
    }, 
    confirm() { 
      this.pickerVState = false;   
    },

    getOpenidHData() {
      if (plug.wx.platform && plug.wx.openid != undefined) {
        MessageBox('提示', plug.wx.openid); 
      } else {   
        MessageBox('提示', '當前系統暫無權限');
      }  
    },
    sendMsgHData() {
      this.sendMsgVData.layer = 1; 
    },
    pushMsgHData() {
      this.$root.consauth.layer = 1;
    },
    consultAgentHData() {
      this.$root.consultAgent({
        layer: 1,
        user_uuid: "027d25db9ffa0bea6ca15acd8df0ca6e",
        answer_uuid: "eb4a09e618df9cfe8a3a2caae2977f30",
        code: "86",
        mphone: "13718647330"
      });
    },
    openProgressHAct() {
      this.$root.progress.layer = 1;
      window.setTimeout(()=> {
        this.$root.progress.layer = 0;
      }, 2000);
    },
    openConfirmHAct() {
      MessageBox({
        title: "提示",
        message: this.simply ? "拒绝授权手机号将退出当前页面，确认要关闭吗？" : "拒絕授權手機號將退出當前頁面，確認要關閉嗎？",
        showCancelButton: true,
        confirmButtonText: this.simply ? "残忍拒绝" : "殘忍拒絕",
        cancelButtonText: this.simply ? "继续授权" : "繼續授權"
      }).then((res)=> {
        //确定返回："confirm"

        //取消返回："cancel"
        if (res == "confirm") {
          console.log(plug);
        }
      });
    },
    openToastHAct() {
      this.$toast('提示信息');
    },


    radioHItem() {
      this.radioVItem = !this.radioVItem;
    },
    radioHList: function(idx) {
      this.radioVList.forEach((value, index, array)=> {
        value.active = false; 
      });
      this.radioVList[idx].active = true;
    },
    checkBoxHList: function(idx) {
      this.checkBoxVList[idx].active = !this.checkBoxVList[idx].active;
    },
    pushPath: function(path) {
      //评测结果
      if (path == "/evaluate/result") {
        let res = {};  
        res.data = {
          mobile_pre: "86",
          mobile: "137 1892 6648",
          answer_code: "AQLFOZ",
          qrcode_img: "https://static.iberhk.com/v2/qrcode.jpg",
          result_url: "https://mp.goodiber.com/v2/RZrh2Wdq"
        };
        this.$router.push({
          path: path, 
          query: { 
            data: JSON.stringify(res.data)
          }
        });
      }
    }
  }
}