import CommonJS from '@/components/shared/service/common.js';
import comAgentWechatEvaluate from "@/components/component/com_agent_wechat_evaluate.vue";
import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import cmn from "@/components/evaluate/common.js";

export default {
  name: '',
  data () {
    return {
      wxixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,

      riskDefaultList: [],
      riskList: [],
      isExtend: true,
      reportTitle: "",
      diseaseInfo: {},
      share: {
        type: 'news',
        title: this.simply ? "一分钟预知你的健康风险" : "一分鐘預知你的健康風險",
        thumbImage: "https://static.iberhk.com/v2/disease.png",
        desc: this.simply ? "及时了解健康状况，提早防范风险噢！" : "及時了解健康狀況，提早防範風險噢！",
        url: window.location.origin + window.location.pathname,
        link: null,

        isReport: true, // 分享上报，不上报可不传
        target_type: 95,
        answer_uuid: this.answer_uuid,  
        user_uuid: this.user_uuid,
        c_user_uuid: '', 
        router: window.location.pathname
      },
      user_uuid: null,
      answer_uuid: null,
      code: null,
      mphone: null,

      cardState: false,
      comAWEData: {
        layer: 0,  
        name: "comAWEData",
        name_en: "",
        name_zn: "",
        id: "", 
        qr_url: ""
      }
    }  
  }, 
  components: { 
    comAgentWechatEvaluate,
    ConsultantCard
  },
  methods: { 
    enterAgentPage: function(url) {
      if (!plug.valueValid(url)) {
        let _toast = this.simply ? "链接异常" : "鏈接异常";
        this.$toast(_toast);
        return;
      }
      window.location.href = url;
    },
    agentQR: function() {
      this.comAWEData.layer = 1;
    },
    goRisk: function() {
      let data = {
        user_uuid: this.user_uuid,
        auth: this.$route.query.auth,
        card: this.$route.query.card,
        language: this.$route.query.language,
        sapp_uuid: this.diseaseInfo.risk_app_uuid
      }
      window.location.href = "/v2/evaluate/risk-dialog" + plug.jsonToUrl(data);

      return ;
      //废弃不用，存在缓存问题
      this.$router.push({
        path: '/evaluate/risk-dialog',
        query: {
          user_uuid: this.user_uuid,
          auth: this.$route.query.auth,
          card: this.$route.query.card,
          language: this.$route.query.language,
          sapp_uuid: this.diseaseInfo.risk_app_uuid
        }
      });
    },
    evaluateAgain: function() {
      this.$router.push({
        path: "/evaluate/disease-dialog",
        query: {
          user_uuid: this.user_uuid,
          auth: this.$route.query.auth,
          card: this.$route.query.card,
          language: this.$route.query.language,
          sapp_uuid: this.diseaseInfo.disease_app_uuid
        } 
      });
    },
    consultAgent: function() {
      // 打开留言流程弹窗
      plug.openGuestBook({
        object: this,
        wx_qrcode: window.agentInfo.wx_qrcode,
        wechat_num: window.agentInfo.wechat_num
      });
    },
    lookMore: function() {
      if (this.isExtend == true) {
        this.riskList = this.riskDefaultList;
        this.isExtend = false;
        return ;
      }
      this.riskList = [];
      for (let i = 0; i < 5; i++) {
        this.riskList.push(this.riskDefaultList[i]);
      }
      this.isExtend = true;
    },
    setBg: function(bg, num) {
      return { 
        background: bg,
        width: num
      } 
    },
    setDiseaseRate: function(disease_rate) {
      let setOptions = {
        backgroundColor: "#fff",
        series: [
          { 
            name: '刻度',
            type: 'gauge',
            center: ['50%', '67%'], 
            radius: '110%',  
            min:0,
            max:1000,  
            splitNumber: 10,  //刻度数量
            startAngle: 210,
            endAngle: -30,
            axisLine: {show: true,lineStyle: {width: 1,color: [[1,'rgba(0,0,0,0)']]}},//仪表盘轴线
            axisLabel: {show: false},  //刻度标签。
            axisTick: {show: true,lineStyle: {color: '#ccc',width: 1},length: 6 },//刻度样式
            splitLine: {show: false},  //分隔线样式
            detail: {show: false},
            pointer: {show: false}
          },
          {
            type: 'gauge',
            radius: '130%',
            center: ['50%', '67%'],
            splitNumber: 0,  //刻度数量
            startAngle: 210,
            endAngle: -30,
            axisLine: {show: true,lineStyle: {width: 8,
                color: [[0, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{offset: 0,color: '#FFD585'},{offset: 1,color: '#FF5A04'}])],[1, '#EEEEEE']]}},
            
            splitLine: {show: false,},  //分隔线样式。
            axisLabel: {show: false},
            axisTick: {show: false},
            pointer: {show: false},
            title: {show: false, offsetCenter: [0, '-20%'], textStyle: {color: '#ddd',fontSize: 50}},
            //仪表盘详情，用于显示数据。
            detail: {show: false,offsetCenter: [0, 0],color: '#ddd',formatter: function(params) {return params}, textStyle: {fontSize: 40}},    
            data: [{value: 0}] 
          }
        ]  
      };

      let total = disease_rate, count = total;
      let iberEcharts = echarts.init(document.getElementById('riskEcharts'));

      let interval = window.setInterval(()=> {  
        if (count >= 0) {  
          count -= 0.008;
          setOptions.series[1].axisLine.lineStyle.color[0][0] = total - count;
          this.percent = Math.floor((total - count) * 100) + "%";
           
          iberEcharts.setOption(setOptions, true); 
        } else { 
          window.clearInterval(interval);
        }    
      },10);
    },
    renderData() {
      let rate = this.diseaseInfo.disease_rate / 100;
      this.setDiseaseRate(rate);

      let mark_color = ['#8543E0','#0195FF','#47C853','#FFD349','#9488FF','#FF5981','#3436C7','#1890FF','#1E9C48','#FA8C16','#8543E0','#0195FF','#47C853','#FFD349','#9488FF','#FF5981','#3436C7','#1890FF','#1E9C48','#FA8C16','#8543E0','#0195FF','#47C853','#FFD349','#9488FF','#FF5981','#3436C7','#1890FF','#1E9C48','#FA8C16'];

      let riskFactor = this.diseaseInfo.risk_factor;
      if (riskFactor != undefined && riskFactor.length > 0) {
        this.diseaseInfo.risk_factor.forEach((value, index, array)=> {
          let json = {
            content: value.content, 
            value: value.value, 
            bg: mark_color[index]
          };
          this.riskDefaultList.push(json); 
        }); 
      }  
      if (this.riskDefaultList.length > 5) {
        for (let i = 0; i < 5; i++) {
          this.riskList.push(this.riskDefaultList[i]);
        }
        return ;
      } 
      this.riskList = this.riskDefaultList;
    }
  },
  beforeCreate() {
    // 异步加载echarts.min.js
    const echartsScript = document.createElement('script');
    echartsScript.id = 'echartsScript';
    echartsScript.type = "text/javascript";
    echartsScript.src = "https://static.iberhk.com/res/js/echarts.min.js";
    document.getElementsByTagName('head')[0].appendChild(echartsScript);
  },
  created () {
    document.title = this.simply ? "疾病评测结果" : "疾病評測結果";

    this.$root.pageLoading.layer = 1;
    

    //获取Agent ID 
    if (this.urlParams == undefined) {
      let query = this.$route.query;
      if (!plug.valueValid(query) || !plug.valueValid(query.user_uuid) || !plug.valueValid(query.answer_uuid)) {
        this.$root.pageLoading.layer = 2;
        return ;  
      }
      this.user_uuid = this.$route.query.user_uuid;
      this.answer_uuid = this.$route.query.answer_uuid;
    } else {
      this.user_uuid = this.urlParams.user_uuid; 
      this.answer_uuid = this.urlParams.answer_uuid;
    } 

    //分享URL
    let exUrl = "evaluate/disease-dialog?user_uuid=" + this.user_uuid;
    this.share.link = plug.exchangeUrl(exUrl); 

    this.getRootUserInfo().then((auth)=> {
      //auth.c_user_uuid
      // 浏览上报 
      this.share.user_uuid = this.user_uuid;
      this.share.answer_uuid = this.answer_uuid; 
      this.share.c_user_uuid = auth.c_user_uuid;
   
      !this.inApp && CommonJS.readReport(this.share);
      CommonJS.initWX(this.share); 
      
      this.$root.getAgentMsg(); 

      this.$http.ajax({
        path: "evaluate/result",
        type: "get",
        language: this['language']['currentLang'],
        data: {
          user_uuid: auth.c_user_uuid,
          answer_uuid: this.answer_uuid
        },  
        intercept: (msg)=> { 
          this.$root.pageLoading.layer = 2;
        }
      }).then((res)=> {
        //业务模型 
        this.diseaseInfo = res.data;  
  
        let str = res.data.evaluate_title;
        this.reportTitle = this.simply ? str.replace("评测", "") : str.replace("評測", "");
        
        this.code = res.data.mobile_pre; 
        this.mphone = res.data.mobile;


        //Echarts组件渲染
        let rate = this.diseaseInfo.disease_rate / 100;

        window.setTimeout(()=> {
          try {
            console.log(echarts);
            this.setDiseaseRate(rate);   
          } catch(e) {
            console.log(e.message);
            this.$root.pageLoading.layer = 0;
            let _toast = this.simply ? "Echarts组件加载失败" : "Echarts組件加載失敗";
            this.$toast(_toast);
            
          }
    
          let mark_color = ['#8543E0','#0195FF','#47C853','#FFD349','#9488FF','#FF5981','#3436C7','#1890FF','#1E9C48','#FA8C16','#8543E0','#0195FF','#47C853','#FFD349','#9488FF','#FF5981','#3436C7','#1890FF','#1E9C48','#FA8C16','#8543E0','#0195FF','#47C853','#FFD349','#9488FF','#FF5981','#3436C7','#1890FF','#1E9C48','#FA8C16'];
    
          console.log(this.diseaseInfo);
          let riskFactor = this.diseaseInfo.risk_factor;
          if (riskFactor != undefined && riskFactor.length > 0) {
            this.diseaseInfo.risk_factor.forEach((value, index, array)=> {
              let json = {
                content: value.content, 
                value: value.value,
                bg: mark_color[index]
              };
              this.riskDefaultList.push(json); 
            }); 
          }  
          if (this.riskDefaultList.length > 5) {
            for (let i = 0; i < 5; i++) {
              this.riskList.push(this.riskDefaultList[i]);
            }
          } else {
            this.riskList = this.riskDefaultList;
          } 

          this.$root.pageLoading.layer = 0;
        }, 1500);


      });
    });

  }
}