// import Vue from 'vue';
import { Spinner, Popup } from 'mint-ui';
// Vue.component(Spinner.name, Spinner);
// Vue.component(Popup.name, Popup);


import comOauthPhone from "@/components/component/com_oauth_phone.vue";
import CommonJS from '@/components/shared/service/common.js';
import ShareBtn from "@/components/shared/component/card/sharebtn.vue";
import cmn from "@/components/evaluate/common.js";


export default {
  name: "",
  data () {
    return {
      userAvatar: null,
      user_uuid: null,
      sappUuid: this['urlParams'] ? this['urlParams']['sapp_uuid'] : (this.$route.query['sapp_uuid'] ? this.$route.query['sapp_uuid']: 'b05ff214ad59251c404e9516b8a5461d'),
      answer_uuid: null,
      diseaseList: [],
      defaultList: [],
      agentList: [],
      dialogList: [],
      resultData: {},  

      diseasePane: false,

      pushEvaluateState: false,
      pushNetwwork: false,
      pushRepeatSend: false,
      submitCount: 0,

      diseaseID: null, 
      sendMsgVData: {
        id: null, 
        type: 'disease',
        auth: {
          state: false,
          code: null,
          mphone: null
        },
        name: "sendMsgVData",
        layer: 0 
      },  
      share: {
        page_name: 'disease',
        type: 'news',
        title: this.simply ? "一分钟预知你的健康风险" : "一分鐘預知你的健康風險",
        thumbImage: "https://static.iberhk.com/v2/disease.png", 
        desc: this.simply ? "及时了解健康状况，提早防范风险噢！" : "及時了解健康狀況，提早防範風險噢！",
        isReport: true, // 分享上报，不上报可不传
        target_type: 92,
        sapp_uuid: this.sappUuid,  
        user_uuid: this.user_uuid,
        router: window.location.pathname
      },
      user_info: {
        mobile_pre: null,
        mobile: null
      },
      card: {}
    }
  },  
  components: { 
    comOauthPhone,
    ShareBtn,
    'mt-spinner': Spinner,
    'mt-popup': Popup,
  },
  methods: {
    //推送Agent载入动效
    loadAgentMsg: function() {
      let info = {type: 0, loading: true}; 
      this.dialogList.push(info);   
    }, 

    //推送agent消息流
    pushAgentMsg: function(res) {
      let dial = this.dialogList.length;

      this.dialogList[dial - 1].loading = false;  
      this.dialogList[dial - 1].info = res;  

      //疾病类型
      if (res.temp != undefined && res.temp == 0) {
        this.dialogList[dial - 2].reelect = true;
        this.dialogList[dial - 1].wake = true;
      } 

      //题库
      if (res.temp != undefined && res.temp == 1) {
        this.dialogList[dial- 2].reelect = true;
      } 
    },  

    //推送customer消息流 
    pushCustomerMsg: function(msg) {
      let dial = this.dialogList.length - 1;
      let info = {type: 1, wake: false, reelect: false, info: {content: msg}};
      this.dialogList.push(info);
      this.dialogList[dial].info.data = [];
    }, 

    //储存当前agent会话        
    saveAgentData: function() {
      let json = {type: 0, loading: true, info: this.changeData()};
      this.agentList.push(json);
    },

    //转换数据格式 
    changeData: function() {
      let data = [];     
      let agenl = this.agentList.length;
      let dataList = this.defaultList[agenl].options;
      dataList.forEach((value, index, array)=> {
        let _json = {id: value.uuid, label: value.content, active: false};
        data.push(_json);    
      });

      let dataJSON = {  
        number: this.defaultList[agenl].serial_number, 
        content: this.defaultList[agenl].title,  
        temp: (this.defaultList[agenl].attrs == undefined || this.defaultList[agenl].attrs.type == undefined) ? 1 : 2,
        data: data   
      }; 
      return dataJSON;
    },

    //重选
    reelect: function(idx) {
      let temp = this.dialogList[idx - 1].info.temp;
      let order = this.dialogList[idx - 1].info.number - 1;  
      if (temp == 0) { 
        let _dialog = [];
        this.dialogList.forEach((value, index, array)=> {
          if (index < idx - 1) {
            _dialog.push(value);   
          } 
        });    
        this.dialogList = _dialog;  
        this.agentList = [];  

        this.loadAgentMsg();
        let data = [];
          this.diseaseList.forEach((value, index, array)=> {
            let _json = {id: value.uuid, label: value.title, active: false};
            data.push(_json); 
          });
          let _dataJSON = {  
            number: 0,
            content: plug.sm(this.simply, 'TiMi為你精心準備了一些常見高發的惡性腫瘤評測，快選擇你關注的危疾，進入評測吧。'),
            temp: 0,
            data: data 
          }; 
          this.diseasePane = true;
          window.setTimeout(()=> {
            this.pushAgentMsg(_dataJSON); 
          }, 1000);

        return ;
      }  

      //备份agent数据 
      let reelectList = [];
      this.agentList.forEach((value, index, array)=> {
        if (index < order) {
          reelectList.push(value); 
        }
      });  
      this.agentList = []; 
      this.agentList = reelectList;

      //备份对话数据
      let dialog = [];
      this.dialogList.forEach((value, index, array)=> {
        if (index < idx - 1) {
          dialog.push(value);  
        }
      });    
      this.dialogList = dialog; 

      this.loadAgentMsg();     
      window.setTimeout(()=> {      
        this.pushAgentMsg(this.changeData());
        this.saveAgentData();
      }, 1000);  
    },
    //请选择
    startLayout: function() {
      let dial = this.dialogList.length - 1; 
      let temp = this.dialogList[dial].info.temp;
      if (temp == 0) {
        this.diseasePane = true;   
      }
    },

    //疾病类型
    emitDiseaseValue: function(label, idx) {   
      this.diseaseID = this.diseaseList[idx].uuid;
      this.diseasePane = false;

      let dial = this.dialogList.length - 1; 
      this.pushCustomerMsg(label);
      this.dialogList[dial].wake = false;  

      window.setTimeout(()=> { 
        this.loadAgentMsg();    

        this.$http.ajax({
          path: "evaluate/subject-list",
          type: "get",
          language: this['language']['currentLang'],
          data: {
            uuid: this.diseaseID
          }
        }).then((res)=> {
          //业务模型
          document.title = res.data.title;  
          return res.data.subjects; 
        }).then((data)=> {
          this.defaultList = data;   
          window.setTimeout(()=> {  
            this.pushAgentMsg(this.changeData());
            this.saveAgentData(); 
          }, 1000);
        });
      }, 500);
    },

    //单选
    emitItemValue: function(label, idx, temp) {
      let agenl = this.agentList.length - 1; 
      this.resultData[this.defaultList[agenl].uuid] = this.defaultList[agenl].options[idx].uuid;
      this.pushCustomerMsg(label); 

      //重置【重选】
      this.dialogList.forEach((value, index, array)=> {
        if (value.type == 1) {
          value.reelect = false;
        }
      });  
      
      this.loadAgentMsg();
      if (this.agentList.length < this.defaultList.length) {
        window.setTimeout(()=> {    
          this.pushAgentMsg(this.changeData());
          this.saveAgentData();
        }, 1000); 

        return ;
      }  
  
      window.setTimeout(()=> {
        let dataJSON = { 
          content: plug.sm(this.simply, '評測結束，TiMi正在飛速為你整理評測報告...'),
          temp: null,  
          data: null  
        };
        this.pushAgentMsg(dataJSON);

        //提交評測  
        this.sendResult(); 
        
      }, 1000);      
    },
    sendResult: function(type) {
      if (type != undefined && type == 1) {
        this.submitCount++;
      }

      this.pushNetwwork = false; 
      this.$root.progress.layer = 1;
      this.$root.progress.info = this.simply ? "生成报告中" : "生成報告中";

      let sendArgs = {
        user_uuid: this.user_uuid,
        uuid: this.diseaseID, 
        source: window.platform,
        answers: JSON.stringify(this.resultData),
        from_type: 1
      };

      if (this.inApp) {
        sendArgs.from_type = 2;
      }

      this.getRootUserInfo().then((auth)=> {
        //auth.c_user_uuid
        sendArgs.cuser_uuid = auth.c_user_uuid;


        this.$http.ajax({ 
          timeout: 10000, 
          path: "evaluate/submit",
          type: "post",
          language: this['language']['currentLang'],
          data: sendArgs,
          intercept: (res)=> {
            this.$root.progress.layer = 0;
          },
          err: ()=> {
            this.$root.progress.layer = 0;

            if (this.submitCount > 2) { 
              let _toast = this.simply ? "您的网络不给力，请稍候再试" : "您的網絡不給力，請稍候再試";
              this.$toast(_toast);
              this.pushRepeatSend = true; 
              return ; 
            } 
            this.pushNetwwork = true;
          } 
        }).then((res)=> { 
          //业务模型
          this.answer_uuid = res.data.answer_uuid;
          this.sendMsgVData.id = res.data.answer_uuid;

          this.user_info.mobile_pre = res.data.mobile_pre;
          this.user_info.mobile = res.data.mobile;

          window.setTimeout(()=> {   
            this.pushEvaluateState = true;
            this.$root.progress.layer = 0;
          }, 1000);  
        });

      }); 
    },

    //查看详情
    enterPage: function() { 
      if (this.inApp) {
        if (!plug.valueValid(this.user_uuid) || !plug.valueValid(this.answer_uuid)) {
          let _toast = this.simply ? "当前页面参数异常" : "當前頁面參數異常";
          this.$toast(_toast);
          return ;
        }
        let params = {
          agent_uuid: this.user_uuid, 
          answer_uuid: this.answer_uuid 
        };
        window.location.href = window.baseUrl + "/evaluate/disease-app" + plug.jsonToUrl(params);
      }

      cmn.czcEv('cdj_jibingchakanxiangqing', '查看详情');

      this.getRootUserInfo().then((auth)=> {
        //auth.c_user_uuid
        this.$http.ajax({
          path: "c-user/whether-need-auth-mobile",
          type: "post",
          language: this['language']['currentLang'],
          data: {
            user_uuid: this.user_uuid,
            c_user_uuid: auth.c_user_uuid
          }
        }).then((res)=> {
          if (!plug.valueValid(res.data.mobile)) {
            this.sendMsgVData.auth.code = this.user_info.mobile_pre;
            this.sendMsgVData.auth.mphone = this.user_info.mobile;  
          } else {   
            this.sendMsgVData.auth.code = res.data.mobile_pre;
            this.sendMsgVData.auth.mphone = res.data.mobile; 
          }

          if (res.data.is_anonymous == 0 &&  plug.valueValid(this.sendMsgVData.auth.code) && plug.valueValid(this.sendMsgVData.auth.mphone)) {
            //已经授权 
            this.sendMsgVData.auth.state = true;  
          } 
          this.sendMsgVData.layer = 1; 
        });

      });

    },





    //重新答题
    startQuestion: function() {
      this.dialogList = [];
      this.agentList = [];
      this.resultData = {};

      this.pushNetwwork = false; 
      this.pushRepeatSend = false; 
      this.submitCount = 0;
      this.loadQuestionData();
    },

    //初始化答题
    loadQuestionData: function() {
      this.loadAgentMsg();
  
      window.setTimeout(()=> {
        let dataJSON = {
          content: this.simply ? "欢迎来到重疾评测环节~准备评估疾病发生概率，才能更好地预防疾病发生哦。" : "歡迎來到危疾評測環節~準確評估疾病發生概率，才能更好地預防疾病發生哦。"
        }; 
        this.pushAgentMsg(dataJSON);  
        this.loadAgentMsg();

        let data = [];
        this.diseaseList.forEach((value, index, array)=> {
          let _json = {id: value.uuid, label: value.title, active: false};
          data.push(_json); 
        });
        let _dataJSON = {  
          number: 0,
          content: this.simply ? "TiMi为你精心准备了一些常见高发的恶性肿瘤评测，快速选择你关注的重疾，进入评测吧。" : "TiMi為你精心準備了一些常見高發的惡性腫瘤評測，快選擇你關注的危疾，進入評測吧。",
          temp: 0,
          data: data
        };
        window.setTimeout(()=> {
          this.pushAgentMsg(_dataJSON); 
        }, 1000);
      }, 1000);
    }
  },
  mounted: function() {
    this.$nextTick(()=> {
      this.$refs.scrollBom.scrollTop = this.$refs.scrollBom.scrollHeight;
    });
  },
  updated: function() {
    this.$nextTick(()=> {
      this.$refs.scrollBom.scrollTop = this.$refs.scrollBom.scrollHeight;
    });
  },
  beforeRouteLeave (to, from, next) {
    if (this.sendMsgVData.layer > 0) {
      this.sendMsgVData.layer -= 1;
      next(false); 
      return ;
    }  
    next(true);
  },
  created () {
    document.title = this.simply ? "AI疾病评测" : "AI疾病評測";

    if (!this.inApp) {
      this.$root.pageLoading.layer = 1;
      this.$root.pageLoading.info = this.simply ? "加载题库中" : "加載題庫中";
    } 

    let agent_id = null;
    if (this.$route.query != undefined && this.$route.query.user_uuid != undefined) {
      agent_id = this.$route.query.user_uuid;

      //获取卡片数据
      this.card.auth = this.$route.query.auth;
      this.card.card = this.$route.query.card;
      this.card.language = this.$route.query.language;

    } else {
      agent_id = this.urlParams.user_uuid; 

      //获取卡片数据
      this.card.auth = this.urlParams.auth;
      this.card.card = this.urlParams.card;
      this.card.language = this.urlParams.language;
    } 

    if ((typeof agent_id).toLowerCase() === "string") {
      this.user_uuid = agent_id;
    } else if (agent_id.constructor === Array) {
      this.user_uuid = agent_id[1];  
    } else {
      this.user_uuid = agent_id;
    }

    // 分享参数
    this.share.user_uuid = this.user_uuid;
    this.share.sapp_uuid = this.sappUuid;

    let firstReportParam = {
      sapp_uuid: this.sappUuid,
    };
    this.getRootUserInfo(firstReportParam).then((auth)=> {
      //auth.c_user_uuid
      if (plug.valueValid(auth.avatar)) {
        this.userAvatar = auth.avatar; 
      }

      // 分享信息
      this.share.url =  window.location.origin + window.location.pathname + '?user_uuid=' + this.user_uuid + '&sapp_uuid=' + this.sappUuid + '&target_type=' + this.share.target_type + '&one_way=' + this.user_uuid;
      // 浏览上报
      !this.inApp && CommonJS.readReport(this.share);
      // 微信分享初始化
      CommonJS.initWX(this.share);

      //业务模型
      this.$http.ajax({
        path: "evaluate/list",
        type: "get",
        language: this['language']['currentLang'],
        data: {
          type: 2
        }, 
        intercept: (msg)=> {
          this.$root.pageLoading.layer = 2; 
        } 
      }).then((res)=> {
        //业务模型 
        return res.data.evaluate_list;
      }).then((data)=> {
        this.diseaseList = data;
        setTimeout(()=> {
          this.$root.pageLoading.layer = 0;
          
          this.loadQuestionData();
        }, 200);  
      });
    });  
    
    cmn.czcPv();

  } 
}