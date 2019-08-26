<template>
  <div class="com-frame" style="padding-bottom:.5rem;" :class="{'com-wxix-frame': wxixm}">
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

          <div class="summary-top clearfix">
            <button class="summary-button aux-btn" @click="evaluateAgain"><label v-if="simply">重新评测</label><label v-if="!simply">重新評測</label></button>
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


        <div class="risk-evaluation-content">
          <div class="content-remark"><label v-if="simply">根据您的风险评测报告显示</label><label v-if="!simply">根據您的風險評測報告显示</label></div>
          <div class="content-title"><label v-if="simply">您需要重视以下三项风险</label><label v-if="!simply">您需要重視以下三項風險</label></div>
          <div class="content-main">
            <div class="content-main-title clearfix">
              <img src="https://static.iberhk.com/v2/web/images/evaluate/evaluate_healthy.png" alt="">
              <div class="right com-nowrap">
                <span class="right-top-pre"><label v-if="simply">健康</label><label v-if="!simply">健康</label></span>
                <span class="right-title">{{riskInfo.health_title}}</span>
                <span class="right-bar"></span>
              </div>
            </div>
            <div class="your-age"><label v-if="simply">您的年龄：{{riskInfo.age}}岁</label><label v-if="!simply">您的年齡：{{riskInfo.age}}歲</label></div>
            <div class="age-disease-table">
              <div class="table" id="ageDiseaseTable"></div> 
              <div class="mark-line" :style="{'left': 16 + (riskInfo.age * 80 / xAxisData[xAxisData.length - 1]) + '%'}"></div>
            </div> 
            <div class="content-main-desc">{{riskInfo.health_content}}</div>
            <div class="your-age"><label v-if="simply">您的职业</label><label v-if="!simply">您的職業</label>：{{riskInfo.profession}}</div> 
            <career-disease-chart refId="careerDiseaseChart" ref="careerDiseaseChart" :title="riskInfo.profession" :career="riskInfo.profession_diseases"></career-disease-chart> 
            <div class="content-main-desc" style="margin-top: .12rem" v-html="plug.transBr(riskInfo.profession_content)"></div>
            <div class="content-main-title">  
              <img src="https://static.iberhk.com/v2/web/images/evaluate/evaluate_finance.png" alt=""> 
              <div class="right com-nowrap">
                <span class="right-top-pre second-title-pre"><label v-if="simply">财务</label><label v-if="!simply">財務</label></span>
                <span class="right-title">{{riskInfo.finance_title}}</span>
                <span class="right-bar"></span>
              </div> 
            </div>
            <div class="content-main-desc" style="margin-top: .1rem" v-html="plug.transBr(riskInfo.finance_content)"></div>
            <div class="content-main-title">
              <img src="https://static.iberhk.com/v2/web/images/evaluate/evaluate_accident.png" alt="">
              <div class="right com-nowrap">
                <span class="right-top-pre third-title-pre"><label v-if="simply">意外</label><label v-if="!simply">意外</label></span>
                <span class="right-title">{{riskInfo.accident_title}}</span>
                <span class="right-bar"></span>
              </div>
            </div>
            <div class="content-main-desc" style="margin: .1rem 0 .14rem 0" v-html="plug.transBr(riskInfo.accident_content)"></div>
          </div>
          <div class="other-service-title"><label v-if="simply">其他服务</label><label v-if="!simply">其他服務</label></div>
          <div class="other-service-block">
            <div class="other-service-block-title"><label v-if="simply">疾病评测</label><label v-if="!simply">疾病評測</label></div>
            <div class="other-service-block-content"><label v-if="simply">你离恶性肿瘤有多近？你是百毒不侵的体质吗？及时了解健康状况，提早防范风险噢~</label><label v-if="!simply">你離惡性腫瘤有多近？你是百毒不侵的體質嗎？及時了解健康狀況，提早防範風險噢~</label></div>
            <em class="aux-go-evaluate" @click="goDisease"><label v-if="simply">去评测</label><label v-if="!simply">去評測</label></em>
          </div>
          <div class="consultant-info" v-if="false"><!--v-if="cardState"-->
            <div class="com-disx"> 
              <em @click="enterAgentPage(agent.home_page_url)" :style="{'background-image': 'url(' + agent.avatar + ')'}">
                <img v-if="agent.realname_verified == '0'" src="https://static.iberhk.com/v2/web/images/common/auth_user.svg" alt="">
                <img v-if="agent.realname_verified == '1'" src="https://static.iberhk.com/v2/web/images/common/auth_vip.svg" alt="">
              </em>
              <div class="com-nowrap title">{{agent.nickname}}</div>
              <div class="qr">
                <i @click="agentQR" class="iconfont">&#xe7ad;</i>
              </div> 
            </div>
            <p v-if="agent.signature != ''">{{agent.signature}}</p>
          </div>
          <consultant-card style="background-color:transparent;padding:0;min-height:auto;margin-bottom:.35rem;" :user-uuid="user_uuid" :target-uuid="answer_uuid" :from-type="'91'"></consultant-card>
 
          <p style="color:#999;font-size:.14rem;margin-top:.1rem;line-height:.2rem;"><label v-if="simply">评测内容及/或评测结果作为一般性参考，不构成任何诊断、治疗/或销售建议，iBer亦不承担任何责任。</label><label v-if="!simply">評測內容及/或評測結果僅作一般性參考，不構成任何診斷、治療/或銷售建議，iBer亦不承擔任何責任。</label></p>
        </div>

      </div>
    </div> 

    
    <button class="com-btn com-button-action aux-abs-full" :class="{'com-wxix-button': wxixm}" type="button" @click="consultAgent"><label v-if="simply">咨询顾问</label><label v-if="!simply">諮詢顧問</label></button>
    <!--底部卡片-->
    <com-agent-wechat-evaluate :params="comAWEData"></com-agent-wechat-evaluate>
  </div>
</template> 

<script src="./index.js"></script>  
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./index.css"></style>