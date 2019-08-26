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
      wxixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,
      
      userAvatar: null,
      user_uuid: null,
      answer_uuid: null,
      sappUuid: this['urlParams'] ? this['urlParams']['sapp_uuid'] : (this.$route.query['sapp_uuid'] ? this.$route.query['sapp_uuid']: 'b05ff214ad59251c404e9516b8a5461d'),
      evaluateList: [],
      ageJuageList: [],
      defaultList: [],
      agentList: [],
      dialogList: [],
      resultData: {},   

      comLayout: false, 
      ageJuage: false,

      incomePane: false,
      incomeAddr: null,
      incomeList: [],
      incomeRank: null,

      defrayPane: false,
      defrayAddr: null,
      defrayList: [],

      pushEvaluateState: false,
      pushNetwwork: false,
      pushRepeatSend: false,
      submitCount: 0,

      riskID: null,
      sendMsgVData: {
        id: null, 
        type: 'risk',
        auth: {
          state: false,
          code: null,
          mphone: null
        },
        name: "sendMsgVData",
        layer: 0  
      },
      share: {
        page_name: 'risk', 
        type: 'news',
        title: this.simply ? "你的风险防护罩够坚固吗？" : "你的風險防護罩够堅固嗎？",
        thumbImage: "https://static.iberhk.com/v2/risk.png",
        desc: this.simply ? "生活习惯、理财状态......一切尽在掌握，未来更有底气。" : "生活習慣、理財狀態……一切盡在掌握，未來更有底氣。",
        isReport: true, // 分享上报，不上报可不传
        target_type: 91,
        sapp_uuid: this.sappUuid,
        user_uuid: this.user_uuid,
        c_user_uuid: '',
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
    document.title = this.simply ? "AI风险评测" : "AI風險評測";

    if (!this.inApp) {
      this.$root.pageLoading.layer = 1;
      this.$root.pageLoading.info = this.simply ? "加载题库中" : "加載題庫中";
    } 
 
    if (this.$route.query != undefined && this.$route.query.user_uuid != undefined) {
      this.user_uuid = this.$route.query.user_uuid;

      //获取卡片数据
      this.card.auth = this.$route.query.auth;
      this.card.card = this.$route.query.card;
      this.card.language = this.$route.query.language;
    } else {
      this.user_uuid = this.urlParams.user_uuid; 

      //获取卡片数据
      this.card.auth = this.urlParams.auth;
      this.card.card = this.urlParams.card;
      this.card.language = this.urlParams.language;
    } 
    // 分享参数
    this.share.user_uuid = this.user_uuid;
    this.share.sapp_uuid = this.sappUuid;

    let firstReportParam = {
      sapp_uuid: this.sappUuid,
    };
    this.getRootUserInfo(firstReportParam).then((auth)=> {
      this.loadService(auth);  
    });  
    
    cmn.czcPv();

  }, 
  watch: {
    ageJuage: function(val, oldVal) {
      if (val == true) {    
        this.defaultList = this.ageJuageList;
      } else {
        this.defaultList = this.evaluateList;
      }    
    }
  },
  methods: {
    loadService: function(auth) {
      if (plug.valueValid(auth.avatar)) {
        this.userAvatar = auth.avatar; 
      }

      // 分享信息
      this.share.url = window.location.origin + window.location.pathname + '?user_uuid=' + this.user_uuid + '&sapp_uuid=' + this.sappUuid + '&target_type=' + this.share.target_type + '&one_way=' + this.user_uuid;
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
          type: 1
        }, 
        intercept: (msg)=> { 
          this.$root.pageLoading.layer = 2; 
        } 
      }).then((res)=> { 
        //业务模型 
        return res.data.evaluate_list[0].uuid;
      }).then((id)=> {
        this.riskID = id;
  
        this.$http.ajax({
          path: "evaluate/subject-list",
          type: "get",
          language: this['language']['currentLang'],
          data: {
            uuid: this.riskID
          },  
          intercept: (msg)=> {
            this.$root.pageLoading.layer = 2; 
          } 
        }).then((res)=> {
          //业务模型 
          window.localStorage.setItem("disease_evaluate_list", JSON.stringify(res.data.subjects));
          return res.data.subjects; 
        }).then((data)=> { 
          let storageData = window.localStorage.getItem("disease_evaluate_list"); 
  
          this.evaluateList = JSON.parse(storageData);  

          //当年龄选择60岁以上时，则不出现选择[行业]
          this.ageJuageList = JSON.parse(storageData); 
          Array.prototype.remove = function(index) {
            if ((typeof index).toLowerCase() === 'number') {
              for (let i = 0, n = 0; i < this.length; i++) {
                if (index != i)
                {
                  this[n] = this[i];
                  n++;  
                }  
              }
              this.length -= 1;
              return this;
            } else {
              let _toast = this.simply ? "参数传输类型或值错误" : "參數傳輸類型或值錯誤";
              this.$toast(_toast);
            }
          }; 
          this.ageJuageList.remove(2);   

          this.defaultList = this.evaluateList; 
  
          window.setTimeout(()=> {    
            this.$root.pageLoading.layer = 0;
            this.loadQuestionData();
          }, 200); 
        });
  
      }); 
    },

    //初始化答题
    loadQuestionData: function() {
      this.loadAgentMsg();  
      window.setTimeout(()=> {
        let dataJSON = {
          content: this.simply ? "嗨，我是你的专属风险管家TiMi，初次见面，请多关照~" : "嗨，我是你的專屬風險管家TiMi，初次見面，請多關照~"   
        };
        this.pushAgentMsg(dataJSON); 

        this.loadAgentMsg();
        window.setTimeout(()=> {
          let dataJSON = {
            content: this.simply ? "我会简单地问你10个问题，要按实际情况回答噢，这样TiMi才能为你更准确地评估风险。" : "我會簡單地問你10個問題，要按實際情況回答噢，這樣TiMi才能爲你更準確地評估風險。" 
          };
          this.pushAgentMsg(dataJSON); 

          this.loadAgentMsg();  
          window.setTimeout(()=> {
            let dataJSON = {
              content: this.simply ? "那么现在，开始我们的第一步吧~" : "那麽現在，開始我們的第一步吧~" 
            };
            this.pushAgentMsg(dataJSON); 


            this.loadAgentMsg();
            window.setTimeout(()=> { 
              this.pushAgentMsg(this.changeData());

              this.saveAgentData(); 
            }, 1000);
          }, 1000);  
        }, 1000);
      }, 2000);
    },





    //推送Agent载入动效
    loadAgentMsg: function() {
      let info = {type: 0, loading: true}; 
      this.dialogList.push(info);   
    },  

    //推送agent消息流，追加this.dialogList  
    pushAgentMsg: function(res) {
      let dial = this.dialogList.length;

      this.dialogList[dial - 1].loading = false;  
      this.dialogList[dial - 1].info = res;  

      //拦截“重选”类型
      if (res.temp == undefined) {
        return ;
      }

      if (res.temp == 0) {  //选择块
        this.dialogList[dial - 2].reelect = true;
      } 

      if (res.temp == 1) {  //选择框
        this.dialogList[dial - 2].reelect = true;
        this.dialogList[dial - 1].wake = true;
      } 
      
      //是否添加“重选”
      if (res.temp == 2) {  //成员类型
        this.dialogList[dial - 1].info.data.forEach((value, index, array)=> {
          value.disabled = false; 
        }); 
        this.dialogList[dial - 2].reelect = true;  
      }   
  
      if (res.temp == 3) {   //收入类型
        this.incomeList = res.data;  
        this.dialogList[dial - 3].reelect = true; 
        this.dialogList[dial - 1].wake = true;
      }  

      if (res.temp == 4) {  //支出类型 
        this.defrayList = []; 
        let agenl = this.agentList.length - 1; 
        this.defrayAddr = this.defaultList[agenl].options[this.incomeRank].content;
        let list = this.defaultList[agenl].options[this.incomeRank].items; 
        let _data = [];  
        list.forEach((value, index, array)=> {
          let _json = {id: value.uuid, label: value.content, active: false};
          _data.push(_json);
        });  
        this.defrayList = _data;  

        this.dialogList[dial - 2].reelect = true;
        this.dialogList[dial - 1].wake = true;
      }  

      if (res.temp == 5) {  //出行
        this.defrayAddr = null; 
        this.dialogList[dial - 3].reelect = true;
      }

    },      

    //推送customer消息流  
    pushCustomerMsg: function(msg) { 
      let dial = this.dialogList.length - 1;
      let info = {type: 1, reelect: false, info: {content: msg}};
      this.dialogList.push(info);
      this.dialogList[dial].info.data = [];
    }, 





    //储存当前agent会话        
    saveAgentData: function() {
      let json = {type: 0, loading: true, info: this.changeData()};
      this.agentList.push(json);
    },

    //转换数据格式 
    changeData: function(ageLimit) {
      let data = [];     
      let agenl = this.agentList.length;  
      let dataList = this.defaultList[agenl].options;
      dataList.forEach((value, index, array)=> {
        let _json = {id: value.uuid, label: value.content, active: false};
        data.push(_json); 
      });

      //处理选择age < 60限制[行业]出现"退休"
      if (ageLimit != undefined && ageLimit != 0 && ageLimit < 60) {
        console.log("[信息] @根据选择不同阶段年龄限制行业退休选项 |  ageLimit=" + ageLimit);
        let count = null;
        data.forEach((value, index, array)=> {
          if (value.label == "退休") {
            count = index;
          }
        });
        data = plug.remove(data, count);
        //console.log(JSON.stringify(data));
      } 

      let template = null;
      let _type = this.defaultList[agenl].type;
      //判断模板
      let _attr = this.defaultList[agenl].attrs.type;

      let serial = this.defaultList[agenl].serial_number;

      
      if (_type == 1 && _attr == undefined) {
        template = 0;  //圆块单选
      }
      if (_type == 1 && _attr != undefined) {
        template = 1;  //弹窗单选
      }
      if (_type == 2 && serial == 7) {
        template = 2;  //方块多选
      }
      if (_type == 6 && serial == 8) {
        template = 3;  //收入弹窗选择   
      } 
      if (_type == 6 && serial == 9) {
        template = 4;  //支出弹窗选择  
      }
      if (_type == 2 && serial == 10) {
        template = 5;  //出行选择 
      }
      let dataJSON = { 
        temp: template,
        number: this.defaultList[agenl].serial_number,
        content: this.defaultList[agenl].title,
        data: data
      };  
      return dataJSON;  
    },






    //重选 
    reelect: function(idx, content) {
      let temp = this.dialogList[idx - 1].info.temp,
      number = this.dialogList[idx - 1].info.number,
      order = number - 1;      
   
      if (number == 1 || number == 2) { 
        this.ageJuage = false;
      }

      //备份agent数据 
      let reelectList = [];
      
      //根据选择年龄是否大于等于60岁，动态调整重选后数据
      let ageLimit = 0;
      if (this.ageJuage) {
        this.agentList.forEach((value, index, array)=> {
          if (index < order - 1) { 
            reelectList.push(value);  
          } 
        }); 
      } else {  
        this.agentList.forEach((value, index, array)=> {
          if (index < order) { 
            reelectList.push(value);  
          } 
        });
      }
      //console.log("[信息] @判断是否重选行业" + JSON.stringify(reelectList[reelectList.length - 1]));

      this.agentList = []; 
      this.agentList = reelectList;

      //备份对话数据
      let dialog = [];  
      this.dialogList.forEach((value, index, array)=> {
        if (index < idx - 1) {
          dialog.push(value);  
        }
      });    
      //console.log("[信息] @对话数据渲染" + JSON.stringify(dialog[dialog.length - 1]));
      let limitData = dialog[dialog.length - 1].info.content;
      if (limitData.match("歲") != null || limitData.match("岁") != null) {
        let age = parseInt(limitData.slice(0,2));
        ageLimit = age;
      }

      this.dialogList = dialog;   

      this.loadAgentMsg();     
      window.setTimeout(()=> {      
        this.pushAgentMsg(this.changeData(ageLimit));
        this.saveAgentData();
      }, 1000);  
    },


    //请选择
    startLayout: function() {
      let dial = this.dialogList.length - 1; 
      let temp = this.dialogList[dial].info.temp;
      console.log(this.dialogList[dial]);

      if (temp == 1) {
        this.comLayout = true;
      }
      if (temp == 3) {
        this.incomePane = true;
      } 
      if (temp == 4) { 
        this.defrayPane = true;
      } 
    },


    //单选事件
    emitItemValue: function(label, idx, temp) {
      let agenl = this.agentList.length - 1;
      this.resultData[this.defaultList[agenl].uuid] = this.defaultList[agenl].options[idx].uuid;
      this.pushCustomerMsg(label); 

      //隐藏所有【重选】，重新渲染
      this.dialogList.forEach((value, index, array)=> {
        if (value.type == 1) {
          value.reelect = false;
        }
      }); 
      
      window.setTimeout(()=> {
        this.loadAgentMsg();
        window.setTimeout(()=> {    
          this.pushAgentMsg(this.changeData());
          this.saveAgentData();
        }, 1000);   
      }, 500);
    }, 

    //列表单选事件
    emitListValue: function(label, idx, temp) {
      let agenl = this.agentList.length - 1;
      this.resultData[this.defaultList[agenl].uuid] = this.defaultList[agenl].options[idx].uuid;

      this.comLayout = false;  
      this.pushCustomerMsg(label); 

      //重置“请选择”
      this.dialogList.forEach((value, index, array)=> {
        if (value.wake != undefined) {
          this.dialogList[index].wake = false;
        } 
      });

      //选择年龄，是否大于60岁？ 小于60岁，隐藏下一选项的"退休"
      let ageLimit = 0;
      if (this.defaultList[agenl].type == 1 && this.defaultList[agenl].serial_number == 2) {
        let age = parseInt(label.slice(0,2));
        ageLimit = age;
        if (age < 60) {
          this.ageJuage = false;    
        } else {   
          this.resultData[this.defaultList[2].uuid] = "";
          this.ageJuage = true;  
        }  
      }

      //隐藏所有【重选】，重新渲染
      this.dialogList.forEach((value, index, array)=> {
        if (value.type == 1) {
          value.reelect = false;
        }
      }); 

      window.setTimeout(()=> {
        this.loadAgentMsg();
        window.setTimeout(()=> {    
          this.pushAgentMsg(this.changeData(ageLimit));
          this.saveAgentData();
        }, 1000);   
      }, 500); 
    },

    //选择家庭成员
    selectMember: function(id) {
      let dial = this.dialogList.length - 1;  
      if (this.dialogList[dial].info.data[id].disabled == true) {
        return ;   
      }
      if (id == 2 && this.dialogList[dial].info.data[id].active == false) {
        this.dialogList[dial].info.data[3].disabled = true;
        this.dialogList[dial].info.data[4].disabled = true;
      }
      if (id == 2 && this.dialogList[dial].info.data[id].active == true) {
        this.dialogList[dial].info.data[3].disabled = false;
        this.dialogList[dial].info.data[4].disabled = false;
      } 

      if (id == 3 && this.dialogList[dial].info.data[id].active == false) {
        this.dialogList[dial].info.data[2].disabled = true;
        this.dialogList[dial].info.data[4].disabled = true;
      }
      if (id == 3 && this.dialogList[dial].info.data[id].active == true) {
        this.dialogList[dial].info.data[2].disabled = false;
        this.dialogList[dial].info.data[4].disabled = false;
      } 

      if (id == 4 && this.dialogList[dial].info.data[id].active == false) {
        this.dialogList[dial].info.data[2].disabled = true;
        this.dialogList[dial].info.data[3].disabled = true;
      }
      if (id == 4 && this.dialogList[dial].info.data[id].active == true) {
        this.dialogList[dial].info.data[2].disabled = false;
        this.dialogList[dial].info.data[3].disabled = false;
      }

      this.dialogList[dial].info.data[id].active = !this.dialogList[dial].info.data[id].active;
      this.$forceUpdate();
    },
    //提交成员选值
    emitMemberValue: function() {
      let agenl = this.agentList.length - 1; 
      let str = "";
      let dial = this.dialogList.length - 1;
      let arr = this.dialogList[dial].info.data;
      let _arr = [];
      arr.forEach((value, index, array)=> {
        if (value.active == true) {
          str += "、" + value.label;
          _arr.push(this.defaultList[agenl].options[index].uuid);
        }
      });
      if (_arr.length == 0) {
        let _toast = this.simply ? "至少选择1项成员" : "至少選擇1項成員";
        this.$toast(_toast);
        return ;
      }
      let label = str.replace(/^\、/i, "");

      this.resultData[this.defaultList[agenl].uuid] = _arr;
      this.pushCustomerMsg(label);

      //隐藏所有【重选】，重新渲染
      this.dialogList.forEach((value, index, array)=> {
        if (value.type == 1) {
          value.reelect = false;  
        }
      }); 

      window.setTimeout(()=> { 
        this.loadAgentMsg();
        window.setTimeout(()=> {  
          let dataJSON = {
            content: this.simply ? "马上就答完啦~再陪TiMi聊一聊呗" : "馬上就答完啦~再陪TiMi聊一聊唄" 
          };
          this.pushAgentMsg(dataJSON);  

          window.setTimeout(()=> {
            this.loadAgentMsg(); 
            window.setTimeout(()=> {    
              this.pushAgentMsg(this.changeData());
              this.saveAgentData();
            }, 1000);   
          }, 1000);   
        }, 1000);
      }, 1000); 

    },

    //收入
    backIncomeAddr: function() {
      this.incomeAddr = null;   
      let dial = this.dialogList.length - 1;
      this.incomeList = this.dialogList[dial].info.data;
    },
    emitIncomeValue: function(label, idx) {
      let agenl = this.agentList.length - 1; 
      if (this.incomeAddr == null) {
        this.incomeRank = idx;
        this.incomeAddr = label;
        let list = this.defaultList[agenl].options[idx].items;
        let _data = [];
        list.forEach((value, index, array)=> {
          let _json = {id: value.uuid, label: value.content, active: false};
          _data.push(_json);
        });
        this.incomeList = _data;
        return ; 
      }
      this.resultData[this.defaultList[agenl].uuid] = this.defaultList[agenl].options[this.incomeRank].items[idx].uuid;
      this.incomePane = false;
      let _val = this.incomeAddr + ', ' + label; 
      this.incomeAddr = null;  
      this.defrayAddr = null;

      this.pushCustomerMsg(_val); 

      //重置“请选择”
      this.dialogList.forEach((value, index, array)=> {
        if (value.wake != undefined) {
          this.dialogList[index].wake = false;
        } 
      });

      //隐藏所有【重选】，重新渲染
      this.dialogList.forEach((value, index, array)=> {
        if (value.type == 1) {
          value.reelect = false;
        }
      }); 

      window.setTimeout(()=> {
        this.loadAgentMsg();  
        window.setTimeout(()=> {      
          this.pushAgentMsg(this.changeData());
          this.saveAgentData();    
        }, 1000);     
      }, 500);
    }, 

    //提交支出
    emitDefrayValue: function(label, idx) {
      let agenl = this.agentList.length - 1; 
      this.resultData[this.defaultList[agenl].uuid] = this.defaultList[agenl].options[this.incomeRank].items[idx].uuid;
      this.defrayPane = false;
      let _val = this.defrayAddr + ', ' + label;
      this.defrayAddr = null; 
 
      this.pushCustomerMsg(_val);

      //重置“请选择”
      this.dialogList.forEach((value, index, array)=> {
        if (value.wake != undefined) {
          this.dialogList[index].wake = false;
        } 
      });

      //隐藏所有【重选】，重新渲染
      this.dialogList.forEach((value, index, array)=> {
        if (value.type == 1) {
          value.reelect = false;
        }
      });    

      window.setTimeout(()=> { 
        this.loadAgentMsg();
        window.setTimeout(()=> {  
          let dataJSON = {
            content: this.simply ? "最后一题啦~" : "最後一題啦~"
          };
          this.pushAgentMsg(dataJSON);  
          
          this.loadAgentMsg();
          window.setTimeout(()=> {
            this.pushAgentMsg(this.changeData());
            this.saveAgentData();
          }, 1000);  
        }, 1000);     
      }, 500); 
    },


    //选择出行类型
    selectTraval: function(idx) {
      let dial = this.dialogList.length - 1;
      if (this.dialogList[dial].info.data[idx].disabled == true) {
        return ;
      }
      let arr = [];
      this.dialogList[dial].info.data.forEach((value, index, array)=> {
        if (value.active == true) {
          arr.push(value.active);
        }
      });
      this.dialogList[dial].info.data[idx].active = !this.dialogList[dial].info.data[idx].active;
      let _arr = [];
      this.dialogList[dial].info.data.forEach((value, index, array)=> {
        if (value.active == true) {
          _arr.push(value.active);
        }
      });
      if (_arr.length == 3) {
        this.dialogList[dial].info.data.forEach((value, index, array)=> {
          if (value.active == false) {
            value.disabled = true;
          }
        });
      } else {
        this.dialogList[dial].info.data.forEach((value, index, array)=> {
          value.disabled = false;
        });
      }
      this.$forceUpdate();
    },
    emitTravalValue: function() {
      let agenl = this.agentList.length - 1; 
      let str = "";
      let dial = this.dialogList.length - 1;
      let arr = this.dialogList[dial].info.data;
      let _arr = [];
      arr.forEach((value, index, array)=> {
        if (value.active == true) {
          str += "、" + value.label;
          _arr.push(this.defaultList[agenl].options[index].uuid);
        }
      });
      if (_arr.length != 2 && _arr.length != 3) {
        let _toast = this.simply ? "请选择2-3项出行状态" : "請選擇2-3項出行狀態";
        this.$toast(_toast);
        return ;
      } 
      let label = str.replace(/^\、/i, "");

      this.resultData[this.defaultList[agenl].uuid] = _arr;
      this.pushCustomerMsg(label); 

      //隐藏所有【重选】，重新渲染
      this.dialogList.forEach((value, index, array)=> {
        if (value.type == 1) {
          value.reelect = false;
        }
      });  

      window.setTimeout(()=> {  

        this.loadAgentMsg();
        window.setTimeout(()=> {      
          let dataJSON = {
            content: this.simply ? "评测结束，TiMi正在飞速为你导出评测报告..." : "評測結束，TiMi正在飛速為你導出評測報告..." 
          }; 
          this.pushAgentMsg(dataJSON); 

          //提交評測  
          this.sendResult();
          
        }, 1000);    

      }, 1000);     
    },


    //发送结果数据
    sendResult: function(type) {
      if (type != undefined && type == 1) {
        this.submitCount++;
      }

      this.pushNetwwork = false; 
      this.$root.progress.layer = 1;
      this.$root.progress.info = this.simply ? "生成报告中" : "生成報告中";

      let sendArgs = {
        user_uuid: this.user_uuid, 
        uuid: this.riskID,   
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

    //重新答题
    startQuestion: function() {
      this.dialogList = [];
      this.agentList = [];
      this.resultData = {};

      this.incomeList = [];
      this.defrayList = [];

      this.pushNetwwork = false; 
      this.pushRepeatSend = false; 
      this.submitCount = 0;
      this.loadQuestionData();
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
        window.location.href = window.baseUrl + "/evaluate/risk-app" + plug.jsonToUrl(params);

        return ; 
      }

      cmn.czcEv('cdj_fengxianchakanxiangqing', '查看详情');

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
          if (!plug.valueValid(res.data.mobile) || !plug.valueValid(res.data.mobile_pre)) {
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

    }




  }
}