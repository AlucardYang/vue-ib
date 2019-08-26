const emergence = require("emergence.js");
import CommonJS from '@/components/shared/service/common.js';
import CareerDiseaseChart from '@/components/shared/component/chart/careerdiseasechart.vue';
import comAgentWechatEvaluate from "@/components/component/com_agent_wechat_evaluate.vue";
import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import cmn from "@/components/evaluate/common.js";
 
export default {
  name: 'RiskEvaluation', 
  data() {
    return {
      wxixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,
      
      type: null, 
      agent: {},
      remark: [
        { type: 0, label: this.simply ? "风险较低" : "風險較低", bg: 'https://static.iberhk.com/v2/web/images/evaluate/risk_rank_bg_00.png', color: '#57A1FE'},
        { type: 1, label: this.simply ? "风险一般" : "風險一般", bg: 'https://static.iberhk.com/v2/web/images/evaluate/risk_rank_bg_01.png', color: '#6086FF'},
        { type: 2, label: this.simply ? "风险较高" : "風險較高", bg: 'https://static.iberhk.com/v2/web/images/evaluate/risk_rank_bg_02.png', color: '#4C86D2'},
        { type: 3, label: this.simply ? "风险极高" : "風險極高", bg: 'https://static.iberhk.com/v2/web/images/evaluate/risk_rank_bg_03.png', color: '#4A75D1'}
      ],
      riskInfo: {},
      xAxisData: [],
      yAxisData: [],
      share: {
        type: 'news',
        title: this.simply ? "你的风险防护罩够坚固吗？" : "你的風險防護罩够堅固嗎？",
        thumbImage: "https://static.iberhk.com/v2/risk.png",
        desc: this.simply ? "生活习惯、理财状态......一切尽在掌握，未来更有底气。" : "生活習慣、理財狀態……一切盡在掌握，未來更有底氣。",
        url: window.location.origin + window.location.pathname,

        isReport: true, // 分享上报，不上报可不传
        target_type: 94,
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
      },

      ageDiseaseOptions: {}
    }
  },
  components: {
    CareerDiseaseChart,
    comAgentWechatEvaluate,
    ConsultantCard
  },
  beforeCreate() {
    // 异步加载echarts.min.js
    const echartsScript = document.createElement('script');
    echartsScript.id = 'echartsScript';
    echartsScript.type = "text/javascript";
    echartsScript.src = "https://static.iberhk.com/res/js/echarts.min.js";
    document.getElementsByTagName('head')[0].appendChild(echartsScript);
  },

  created: function() {
    document.title = this.simply ? "AI风险评测结果" : "AI風險評測結果";

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
      this.answer_uuid = this.urlParams.answer_uuid;
      this.user_uuid = this.urlParams.user_uuid; 
    }

    //分享URL 
    let exUrl = "evaluate/risk-dialog?user_uuid=" + this.user_uuid;
    this.share.link = plug.exchangeUrl(exUrl); 

    this.getRootUserInfo().then((auth)=> {
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
        if (res.data.risk_rank != undefined && res.data.risk_rank == 0) {
          this.type = null;
        } else {
          this.type = res.data.risk_rank / 10 - 1;
        }
        this.riskInfo = res.data;
  
        this.code = res.data.mobile_pre; 
        this.mphone = res.data.mobile;


        //判断Echarts是否加载完成，没有完成，则等待加载
        cmn.echarts(()=> {
          try {
            this.renderData();
          } catch(e) {
            console.log("异常");
            console.log(e);
          }   
          this.$root.pageLoading.layer = 0;
        }, ()=> {
          this.$root.pageLoading.info = plug.sm(simply, 'Echarts组件加载失败');
          this.$root.pageLoading.layer = 2;
        }); 

      });
    });

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
    goDisease: function() {
      let data = {
        user_uuid: this.user_uuid,
        auth: this.$route.query.auth,
        card: this.$route.query.card,
        language: this.$route.query.language,
        sapp_uuid: this.riskInfo.disease_app_uuid
      } 
      window.location.href = "/v2/evaluate/disease-dialog" + plug.jsonToUrl(data);

    },   
    consultAgent: function() {  
      // 打开留言流程弹窗
      plug.openGuestBook({
        object: this,
        wx_qrcode: window.agentInfo.wx_qrcode,
        wechat_num: window.agentInfo.wechat_num
      });    
    },  
    evaluateAgain: function() { 
      this.$router.push({
        path: '/evaluate/risk-dialog',
        query: {
          user_uuid: this.user_uuid,
          auth: this.$route.query.auth,
          card: this.$route.query.card,
          language: this.$route.query.language,
          sapp_uuid: this.riskInfo.risk_app_uuid
        }
      });
    },

    renderData() {
      if (this.riskInfo.disease_incidences != undefined) {
        this.xAxisData = [];
        this.yAxisData = [];
        this.riskInfo.disease_incidences.forEach((value, index, array) => {
          this.xAxisData.push(value[0]);
          this.yAxisData.push(value[1]);
        }); 
      }
      this.ageDiseaseOptions = {
        legend: {
          data: ["疾病"],
          left: 0,
          bottom: 0,
          textStyle: {
            color: "#999",
            fontSize: 10
          },
          itemWidth: 24,
          itemHeight: 12,
          selectedMode: false
        },
        grid: {
          left: "18%",
          right: "4%",
          top: "16%",
          bottom: "22%"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xAxisData,  //ageDiseaseOptions.xAxis.data = this.xAxisData;
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#999",
            fontSize: 10
          },
          axisLine: {
            lineStyle: {
              color: "#DDDDDD",
              width: 1
            }
          }
        },
        yAxis: {
          name: this.simply ? "疾病发生率" : "疾病發生率",
          nameTextStyle: {
            color: "#999999",
            fontSize: 10,
            padding: [0, 0, 0, -45]
          },
          type: "value",
          splitNumber: 6,
          splitLine: {
            lineStyle: {
              color: ["#DDDDDD"]
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#999",
            fontSize: 10,
            formatter: "{value} %"
          },
          axisLine: {
            show: false
          }
        },
        series: [{
          name: "疾病",
          data: this.yAxisData,  //ageDiseaseOptions.series.data = this.yAxisData;
          type: "line",
          smooth: true,
          itemStyle: {
            color: "#2B77EF"
          },
          areaStyle: {
            color: "#C7DDFF"
          },
          lineStyle: {
            color: "#2B77EF",
            width: 1
          },
          symbolSize: 0
        }] 
      };
      let ageDisease = echarts.init(document.getElementById("ageDiseaseTable"));
      ageDisease.setOption(this.ageDiseaseOptions);


    }


  }


}