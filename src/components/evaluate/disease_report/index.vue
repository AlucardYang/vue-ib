<template>
  <div class="com-frame" style="padding-bottom:.5rem;" :class="{'com-wxix-frame': wxixm}">
    <div class="com-scroll-y aux-bar com-bg">
      <h3>{{diseaseInfo.evaluate_title}}{{plug.sm(simply, '結果')}}</h3> 
      <div class="echarts-title"> 
        <h3>{{diseaseInfo.disease_rate}}%</h3>
        <p>{{plug.sm(simply, '發病率')}}</p>
        <em>{{diseaseInfo.risk_rank_title}}</em> 
      </div> 
      <dl class="profile echarts">
        <dd>  
          <p><a href="javascript:;" @click="evaluateAgain">{{plug.sm(simply, '重新評測')}}</a></p>
          <div id="riskEcharts"></div>
        </dd> 
      </dl>
      <dl class="profile illness">
        <dt>
          <h3>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
            <span>{{plug.sm(simply, '疾病簡介')}}</span>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_right.png" alt="">
          </h3>
          <p></p>
        </dt>
        <dd>{{diseaseInfo.disease_intro}}</dd>
      </dl>
      <dl class="profile risk" v-if="riskDefaultList.length > 0">
        <dt>
          <h3>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
            <span>{{plug.sm(simply, '風險因子')}}</span>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_right.png" alt="">
          </h3>
          <p></p>
        </dt>
        <dd>
          <dl v-for="(dx, index) in riskList" :key="index">
            <dt>{{dx.content}}</dt>
            <dd>
              <div :style="setBg(dx.bg, dx.value)"></div>
              <p>{{dx.value}}</p> 
            </dd>
          </dl>
          <p v-if="riskDefaultList.length > 5">
            <span @click="lookMore" v-if="isExtend"><i class="iconfont">&#xe631;</i>{{plug.sm(simply, '展開')}}</span>
            <span @click="lookMore" v-if="!isExtend"><i class="iconfont">&#xe635;</i>{{plug.sm(simply, '收縮')}}</span>
          </p>
        </dd> 
      </dl>
      <dl class="profile preview">
        <dt>
          <h3>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
            <span>{{plug.sm(simply, '建議與預防')}}</span>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_right.png" alt="">
          </h3>
          <p></p>
        </dt>
        <dd> 
          <div v-if="diseaseInfo.suggest != undefined && diseaseInfo.suggest.length > 0">
            <p v-for="(dx,index) in diseaseInfo.suggest" :key="index">{{dx}}</p>
          </div> 
          <p v-else>{{plug.sm(simply, '預防勝於治療。按時作息，多做運動，健康飲食，才能遠離疾病困擾哦。')}}</p>
        </dd>   
      </dl>
      <dl class="profile program">
        <dt>
          <h3>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
            <span>{{plug.sm(simply, '推薦方案')}}</span>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_right.png" alt="">
          </h3>
          <p></p>
        </dt> 
        <dd> 
          <p v-if="plug.valueValid(diseaseInfo.recommendation)">{{diseaseInfo.recommendation}}</p>
          <p v-if="!plug.valueValid(diseaseInfo.recommendation)">{{plug.sm(simply, '預防勝於治療。按時作息，多做運動，健康飲食，才能遠離疾病困擾哦。')}}</p> 
          <div style="background:#fffbee;margin-bottom:.2rem;">
            <h3><em style="background:#ffc200;"></em>{{plug.sm(simply, '重疾')}}</h3>
            <p>{{diseaseInfo.serious_illness_insurance}}</p> 
          </div>  
          <div style="background:#fff4f4;">
            <h3><em style="background:#ff5959;"></em>{{plug.sm(simply, '醫療')}}</h3>
            <p>{{diseaseInfo.medical_insurance}}</p>
          </div>
        </dd>
      </dl>
      <div class="other-service-title">{{plug.sm(simply, '更多評測')}}</div>
      <div class="other-service-block">
        <div class="other-service-block-title">{{plug.sm(simply, 'AI智能風險評測')}}</div>
        <div class="other-service-block-content">{{plug.sm(simply, '每個人都有一個風險防護罩，你的防護罩夠堅固嗎？讓可愛的AITiMi爲你的生活把一把脈吧~')}}</div>
        <em class="aux-go-evaluate" @click="goRisk">{{plug.sm(simply, '去評測')}}</em>
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
      <consultant-card style="background-color:transparent;padding:0;min-height:auto;margin-bottom:.35rem;" :user-uuid="user_uuid" :target-uuid="answer_uuid" :from-type="'92'" page-name="disease"></consultant-card>

      <p style="color:#fff;font-size:.14rem;margin-top:.1rem;line-height:.2rem;"><label v-if="simply">评测内容及/或评测结果作为一般性参考，不构成任何诊断、治疗/或销售建议，iBer亦不承担任何责任。</label><label v-if="!simply">評測內容及/或評測結果僅作一般性參考，不構成任何診斷、治療/或銷售建議，iBer亦不承擔任何責任。</label></p>

    </div>


    <button class="com-btn com-button-action aux-abs-full" :class="{'com-wxix-button': wxixm}" type="button" @click="consultAgent"><label v-if="simply">咨询顾问</label><label v-if="!simply">諮詢顧問</label></button>

    <!--底部卡片-->
    <com-agent-wechat-evaluate :params="comAWEData"></com-agent-wechat-evaluate>
  </div> 
</template>   
  
  
<script src="./index.js"></script>
<style scoped src="./index.css"></style>