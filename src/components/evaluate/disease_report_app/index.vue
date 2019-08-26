<template>
  <div class="com-frame">
    <div v-if="!simply" class="com-scroll-y aux-bar com-bg">
      <h3>{{diseaseInfo.evaluate_title}}結果</h3> 
      <div class="echarts-title"> 
        <h3>{{diseaseInfo.disease_rate}}%</h3>
        <p>发病率</p>
        <em>{{diseaseInfo.risk_rank_title}}</em> 
      </div> 
      <dl class="profile echarts">
        <dd>  
          <div id="riskEcharts">
          </div>
        </dd>
      </dl>
      <dl class="profile illness">
        <dt>
          <h3>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
            <span>疾病簡介</span>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_right.png" alt="">
          </h3>
          <p></p>
        </dt>
        <dd>{{diseaseInfo.disease_intro}}</dd>
      </dl>
      <dl class="profile risk">
        <dt>
          <h3>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
            <span>風險因子</span>
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
            <span @click="lookMore" v-if="isExtend"><i class="iconfont">&#xe631;</i>展開</span>
            <span @click="lookMore" v-if="!isExtend"><i class="iconfont">&#xe635;</i>收縮</span>
          </p>
        </dd> 
      </dl>
      <dl class="profile preview">
        <dt>
          <h3>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
            <span>建議與預防</span>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_right.png" alt="">
          </h3>
          <p></p>
        </dt>
        <dd> 
          <p v-if="diseaseInfo.suggest != undefined && diseaseInfo.suggest.length > 0" v-for="(dx,index) in diseaseInfo.suggest" :key="index">{{dx}}</p>
          <p v-if="diseaseInfo.suggest == undefined || diseaseInfo.suggest.length == 0">預防勝於治療。按時作息，多做運動，健康飲食，才能遠離疾病困擾哦。</p>
        </dd>   
      </dl>
      <dl class="profile program">
        <dt>
          <h3>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
            <span>推薦方案</span>
            <img src="https://static.iberhk.com/v2/web/images/evaluate/title_right.png" alt="">
          </h3>
          <p></p>
        </dt> 
        <dd> 
          <p v-if="diseaseInfo.recommendation != undefined && diseaseInfo.recommendation != ''">{{diseaseInfo.recommendation}}</p>
          <p v-if="diseaseInfo.recommendation == undefined || diseaseInfo.recommendation == ''">預防勝於治療。按時作息，多做運動，健康飲食，才能遠離疾病困擾哦。</p> 
          <div style="background:#fffbee;margin-bottom:.2rem;">
            <h3><em style="background:#ffc200;"></em>重疾</h3>
            <p>{{diseaseInfo.serious_illness_insurance}}</p> 
          </div>  
          <div style="background:#fff4f4;">
            <h3><em style="background:#ff5959;"></em>醫療</h3>
            <p>{{diseaseInfo.medical_insurance}}</p>
          </div>
        </dd>
      </dl>

      <p style="color:#fff;font-size:.14rem;margin-top:.1rem;line-height:.2rem;">評測內容及/或評測結果僅作一般性參考，不構成任何診斷、治療/或銷售建議，iBer亦不承擔任何責任。</p>

    </div>

    <div v-if="simply" class="com-scroll-y aux-bar com-bg">
        <h3>{{diseaseInfo.evaluate_title}}结果</h3> 
        <div class="echarts-title"> 
          <h3>{{diseaseInfo.disease_rate}}%</h3>
          <p>发病率</p>
          <em>{{diseaseInfo.risk_rank_title}}</em> 
        </div> 
        <dl class="profile echarts">
          <dd>  
            <div id="riskEcharts"></div>
          </dd>
          <dt>
            <p></p>  
            <div>
              <p>问君能有几多愁</p>
              <p>——比如不幸患上{{reportTitle}}</p>
            </div>
          </dt> 
        </dl>
        <dl class="profile illness">
          <dt>
            <h3>
              <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
              <span>疾病简介</span>
              <img src="https://static.iberhk.com/v2/web/images/evaluate/title_right.png" alt="">
            </h3>
            <p></p>
          </dt>
          <dd>{{diseaseInfo.disease_intro}}</dd>
        </dl>
        <dl class="profile risk">
          <dt>
            <h3>
              <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
              <span>风险因子</span>
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
              <span @click="lookMore" v-if="isExtend"><i class="iconfont">&#xe631;</i>展开</span>
              <span @click="lookMore" v-if="!isExtend"><i class="iconfont">&#xe635;</i>收缩</span>
            </p>
          </dd> 
        </dl>
        <dl class="profile preview">
          <dt>
            <h3>
              <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
              <span>建议与预防</span>
              <img src="https://static.iberhk.com/v2/web/images/evaluate/title_right.png" alt="">
            </h3>
            <p></p>
          </dt>
          <dd> 
            <p v-if="diseaseInfo.suggest != undefined && diseaseInfo.suggest.length > 0" v-for="(dx,index) in diseaseInfo.suggest" :key="index">{{dx}}</p>
            <p v-if="diseaseInfo.suggest == undefined || diseaseInfo.suggest.length == 0">预防与治疗。按时作息，多做运动，健康饮食，才能远离疾病困扰哦。</p>
          </dd>   
        </dl>
        <dl class="profile program">
          <dt>
            <h3>
              <img src="https://static.iberhk.com/v2/web/images/evaluate/title_left.png" alt="">
              <span>推荐方案</span>
              <img src="https://static.iberhk.com/v2/web/images/evaluate/title_right.png" alt="">
            </h3>
            <p></p>
          </dt> 
          <dd> 
            <p v-if="diseaseInfo.recommendation != undefined && diseaseInfo.recommendation != ''">{{diseaseInfo.recommendation}}</p>
            <p v-if="diseaseInfo.recommendation == undefined || diseaseInfo.recommendation == ''">预防与治疗。按时作息，多做运动，健康饮食，才能远离疾病困扰哦。</p> 
            <div style="background:#fffbee;margin-bottom:.2rem;">
              <h3><em style="background:#ffc200;"></em>重疾</h3>
              <p>{{diseaseInfo.serious_illness_insurance}}</p> 
            </div>  
            <div style="background:#fff4f4;">
              <h3><em style="background:#ff5959;"></em>医疗</h3>
              <p>{{diseaseInfo.medical_insurance}}</p>
            </div>
          </dd>
        </dl>
  
        <p style="color:#fff;font-size:.14rem;margin-top:.1rem;line-height:.2rem;">评测内容及/或评测结果作为一般性参考，不构成任何诊断、治疗/或销售建议，iBer亦不承担任何责任。</p>
  
      </div>

      
  </div>
</template>
  
  
<script src="./index.js"></script>
<style scoped src="./index.css"></style>