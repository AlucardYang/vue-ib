<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar com-bg risk-evaluation">
      <div class="color-bg"> 
        <div class="risk-evaluation-summary" v-if="type != null" :style="{backgroundImage: 'url(' + remark[type].bg + ')'}">
          <!--分险较低-->
          <div class="risk-animate-frame" v-if="type == 0">
            <img class="risk_rank_00_00" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_00_00.png" alt="">
            <div class="risk_rank_00_01_frame">
              <em class="risk_rank_00_01"></em>
            </div>
            <img class="risk_rank_00_02" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_00_02.png" alt="">
            <img class="risk_rank_00_03" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_00_03.png" alt="">
            <img class="risk_rank_00_04" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_00_04.png" alt="">
          </div> 

          <!--分险一般-->
          <div class="risk-animate-frame" v-if="type == 1">
            <img class="risk_rank_01_00" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_01_00.png" alt="">
            <img class="risk_rank_01_01" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_01_01.png" alt="">
          </div>

          <!--分险较高-->
          <div class="risk-animate-frame" v-if="type == 2">
            <img class="risk_rank_02_00" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_02_00.png" alt="">
            <img class="risk_snow risk_snow_00" src="https://static.iberhk.com/v2/web/images/evaluate/snow_00.png" alt="">
            <img class="risk_snow risk_snow_01" src="https://static.iberhk.com/v2/web/images/evaluate/snow_01.png" alt="">
            <img class="risk_snow risk_snow_02" src="https://static.iberhk.com/v2/web/images/evaluate/snow_02.png" alt="">
            <img class="risk_snow risk_snow_03" src="https://static.iberhk.com/v2/web/images/evaluate/snow_03.png" alt="">
          </div>
          
          <!--风险极高-->
          <div class="risk-animate-frame" v-if="type == 3">
            <div class="risk-rain-frame">
              <div class="risk-rain">
                <div class="risk-rain-line-00"></div>
                <div class="risk-rain-line-01"></div>
                <div class="risk-rain-line-02"></div>
                <div class="risk-rain-line-03"></div>
                <div class="risk-rain-line-04"></div>
                <div class="risk-rain-line-05"></div>
                <div class="risk-rain-line-06"></div>
              </div>
              <div class="risk-rain risk-rain-01">
                <div class="risk-rain-line-00"></div>
                <div class="risk-rain-line-01"></div>
                <div class="risk-rain-line-02"></div>
                <div class="risk-rain-line-03"></div>
                <div class="risk-rain-line-04"></div>
                <div class="risk-rain-line-05"></div>
                <div class="risk-rain-line-06"></div>
              </div>
              <div class="risk-rain risk-rain-02">
                <div class="risk-rain-line-00"></div>
                <div class="risk-rain-line-01"></div>
                <div class="risk-rain-line-02"></div>
                <div class="risk-rain-line-03"></div>
                <div class="risk-rain-line-04"></div>
                <div class="risk-rain-line-05"></div>
                <div class="risk-rain-line-06"></div>
              </div>
            </div>
            <div class="risk-cloud-first">
              <img class="risk_rank_03_02" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_03_02.png" alt="">
              <img class="risk_rank_03_00" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_03_00.png" alt="">
            </div>
            <div class="risk-cloud-second">
              <img class="risk_rank_03_03" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_03_03.png" alt="">
              <img class="risk_rank_03_01" src="https://static.iberhk.com/v2/web/images/evaluate/risk_rank_03_01.png" alt="">
            </div>  
          </div> 

          <img v-if="type == 0" class="risk-robit" src="https://static.iberhk.com/v2/web/images/evaluate/risk_robit_0.png" alt="">
          <img v-if="type == 1" class="risk-robit" src="https://static.iberhk.com/v2/web/images/evaluate/risk_robit_1.png" alt="">
          <img v-if="type == 2" class="risk-robit" src="https://static.iberhk.com/v2/web/images/evaluate/risk_robit_2.png" alt="">
          <img v-if="type == 3" class="risk-robit" src="https://static.iberhk.com/v2/web/images/evaluate/risk_robit_3.png" alt="">

          <div class="summary-dialog" :style="{'background-color': remark[type].color}">
            <div class="summary-dialog-arrows" :style="{'border-bottom-color': remark[type].color}"></div>
            <div v-for="(dx,index) in riskInfo.risk_rank_desc" :key="index">{{dx}}</div>
          </div>
        </div>

        <div class="risk-evaluation-content" v-if="!simply">
          <div class="content-remark">根據您的風險評測報告显示</div>
          <div class="content-title">您需要重視以下三項風險</div>
          <div class="content-main">
            <div class="content-main-title clearfix">
              <img src="https://static.iberhk.com/v2/web/images/evaluate/evaluate_healthy.png" alt="">
              <div class="right com-nowrap">
                <span class="right-top-pre">健康</span>
                <span class="right-title">{{riskInfo.health_title}}</span>
                <span class="right-bar"></span>
              </div>
            </div>
            <div class="your-age">您的年齡：{{riskInfo.age}}歲</div>
            <div class="age-disease-table">
              <div class="table" id="ageDiseaseTable"></div> 
              <div class="mark-line" :style="{'left': 16 + (riskInfo.age * 80 / xAxisData[xAxisData.length - 1]) + '%'}"></div>
            </div> 
            <div class="content-main-desc">{{riskInfo.health_content}}</div>
            <div class="your-age">您的職業：{{riskInfo.profession}}</div> 
            <career-disease-chart refId="careerDiseaseChart" ref="careerDiseaseChart" :title="riskInfo.profession" :career="riskInfo.profession_diseases"></career-disease-chart> 
            <div class="content-main-desc" style="margin-top: .12rem" v-html="plug.transBr(riskInfo.profession_content)"></div>
            <div class="content-main-title">  
              <img src="https://static.iberhk.com/v2/web/images/evaluate/evaluate_finance.png" alt=""> 
              <div class="right com-nowrap">
                <span class="right-top-pre second-title-pre">財務</span>
                <span class="right-title">{{riskInfo.finance_title}}</span>
                <span class="right-bar"></span>
              </div> 
            </div>
            <div class="content-main-desc" style="margin-top: .1rem" v-html="plug.transBr(riskInfo.finance_content)"></div>
            <div class="content-main-title">
              <img src="https://static.iberhk.com/v2/web/images/evaluate/evaluate_accident.png" alt="">
              <div class="right com-nowrap">
                <span class="right-top-pre third-title-pre">意外</span>
                <span class="right-title">{{riskInfo.accident_title}}</span>
                <span class="right-bar"></span>
              </div>
            </div>
            <div class="content-main-desc" style="margin: .1rem 0 .14rem 0" v-html="plug.transBr(riskInfo.accident_content)"></div>
          </div> 
        </div>

        <div class="risk-evaluation-content" v-if="simply">
          <div class="content-remark">根据您的风险评测报告显示</div>
          <div class="content-title">您需要重视以下三项风险</div>
          <div class="content-main">
            <div class="content-main-title clearfix">
              <img src="https://static.iberhk.com/v2/web/images/evaluate/evaluate_healthy.png" alt="">
              <div class="right com-nowrap">
                <span class="right-top-pre">健康</span>
                <span class="right-title">{{riskInfo.health_title}}</span>
                <span class="right-bar"></span>
              </div>
            </div>
            <div class="your-age">您的年龄：{{riskInfo.age}}岁</div>
            <div class="age-disease-table" v-if="echartsJS">
              <div class="table" id="ageDiseaseTable"></div> 
              <div class="mark-line" :style="{'left': 16 + (riskInfo.age * 80 / xAxisData[xAxisData.length - 1]) + '%'}"></div>
            </div> 
            <div class="content-main-desc">{{riskInfo.health_content}}</div>
            <div class="your-age">您的职业：{{riskInfo.profession}}</div> 
            <career-disease-chart refId="careerDiseaseChart" ref="careerDiseaseChart" :title="riskInfo.profession" :career="riskInfo.profession_diseases"></career-disease-chart> 
            <div class="content-main-desc" style="margin-top: .12rem" v-html="plug.transBr(riskInfo.profession_content)"></div>
            <div class="content-main-title">  
              <img src="https://static.iberhk.com/v2/web/images/evaluate/evaluate_finance.png" alt=""> 
              <div class="right com-nowrap">
                <span class="right-top-pre second-title-pre">财务</span>
                <span class="right-title">{{riskInfo.finance_title}}</span>
                <span class="right-bar"></span>
              </div> 
            </div>
            <div class="content-main-desc" style="margin-top: .1rem" v-html="plug.transBr(riskInfo.finance_content)"></div>
            <div class="content-main-title">
              <img src="https://static.iberhk.com/v2/web/images/evaluate/evaluate_accident.png" alt="">
              <div class="right com-nowrap">
                <span class="right-top-pre third-title-pre">意外</span>
                <span class="right-title">{{riskInfo.accident_title}}</span>
                <span class="right-bar"></span>
              </div>
            </div>
            <div class="content-main-desc" style="margin: .1rem 0 .14rem 0" v-html="plug.transBr(riskInfo.accident_content)"></div>
          </div> 
        </div>

      </div>
    </div> 

    
  </div>
</template> 

<script src="./index.js"></script>  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./index.css"></style>