import cmn from "@/components/evaluate/common.js";


export default {
  name: '',
  data () {
    return { 
      riskDefaultList: [],
      riskList: [],
      isExtend: true,
      reportTitle: "",
      diseaseInfo: {},
      user_uuid: null,
      answer_uuid: null
    }  
  }, 
  methods: { 
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

    let query = this.$route.query;
    if (!plug.valueValid(query) || !plug.valueValid(query.agent_uuid) || !plug.valueValid(query.answer_uuid)) {
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
      this.diseaseInfo = res.data;  

      let str = res.data.evaluate_title;
      this.reportTitle = this.simply ? str.replace("评测", "") : str.replace("評測", "");   

      cmn.echarts((res)=> {
        try {
          this.renderData();
        } catch(e) {
          console.log("异常");
          console.log(e);
        } 
        this.$root.pageLoading.layer = 0;
      }, (err)=> {
        this.$root.pageLoading.info = plug.sm(simply, 'Echarts组件加载失败');
        this.$root.pageLoading.layer = 2;
      });

    });

  }
}