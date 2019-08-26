const emergence = require("emergence.js");
import CareerDiseaseChart from '@/components/shared/component/chart/careerdiseasechart.vue';
import cmn from "@/components/evaluate/common.js";
 
export default {
  name: 'RiskEvaluation',
  data() {
    return {
      echartScript: null,
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
      user_uuid: null,
      answer_uuid: null
    }
  },
  components: {
    CareerDiseaseChart
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
    
    let query = this.$route.query;
    if (!plug.valueValid(query) || !plug.valueValid(query.agent_uuid)) {
      this.$root.pageLoading.layer = 2;
      return ; 
    }
    this.user_uuid = this.$route.query.agent_uuid;
    this.answer_uuid = this.$route.query.answer_uuid;

    this.$http.ajax({  
      path: "evaluate/result",
      type: "get", 
      language: this['language']['currentLang'],
      data: { 
        answer_uuid: this.answer_uuid
      }, 
      intercept: (msg)=> {
        this.$root.pageLoading.layer = 2;  
      } 
    }).then((res)=> {
      //业务模型 
      this.type = res.data.risk_rank / 10 - 1;
      this.riskInfo = res.data;
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

  },
  methods: {
    renderData() {
      if (this.riskInfo.disease_incidences != undefined) {
        this.riskInfo.disease_incidences.forEach((value, index, array) => {
          this.xAxisData.push(value[0]);
          this.yAxisData.push(value[1]);
        }); 
      }  

      let ageDiseaseOptions = {
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
          data: this.xAxisData,
          axisTick: {show: false},
          axisLabel: {color: "#999", fontSize: 10},
          axisLine: {
            lineStyle: {color: "#DDDDDD", width: 1}
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
          axisTick: {show: false},
          axisLabel: {
            color: "#999",
            fontSize: 10,
            formatter: "{value} %"
          },
          axisLine: {show: false}
        },
        series: [{
          name: "疾病",
          data: this.yAxisData,
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
      ageDisease.setOption(ageDiseaseOptions);
    }
  }  
}