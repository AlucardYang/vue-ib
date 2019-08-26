<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar">
      <dl class="rule">
        <dt><label v-if="simply">积分说明</label><label v-else>積分說明</label></dt>
        <dd><label v-if="simply">积分是对用户持续使用iBer App的回馈，用户完成指定任务之后即可获得积分，用户凭借积分即可在兑换中心参与奖品的兑换。</label><label v-else>積分是對用戶持續使用iBer App的回饋，用戶完成指定任務之後即可獲得積分，用戶憑藉積分即可在兌換中心參與獎品的兌換。</label></dd>
      </dl>
      <dl class="rule">
        <dt><label v-if="simply">积分兑换</label><label v-else>積分兌換</label></dt>
        <dd><label v-if="simply">用户的可兑换积分需要高于奖品所需积分，点击兑换之后会扣除掉相应积分，iBer工作人员将会在5个工作日内联系您。</label><label v-else>用戶的可兌換積分需要高於獎品所需積分，點擊兌換之後會扣除掉相應積分，iBer工作人員將會在5個工作日內聯繫您。</label></dd>
      </dl>
      <dl class="rule rank">
        <dt><label v-if="simply">用户等级</label><label v-else>用戶等級</label></dt>
        <dd><label v-if="simply">用户等级随着不断完成任务得到提升，一共分为十六个等级，每个等级对应不同的积分段。等级只计算用户累计获取的积分，积分兑换不影响等级。</label><label v-else>用戶等級隨著不斷完成任務得到提升，一共分為十六個等級，每個等級對應不同的積分段。等級只計算用戶累計獲取的積分，積分兌換不影響等級。</label></dd>
        <p><label v-if="simply">各等级对应的分值见下图</label><label v-else>各等級對應的分值見下圖</label></p>
        <ul class="aux">
          <li class="com-disx" v-for="(dx,index) in rankList" :key="index">
            <span class="rank">{{dx.rank}}</span>
            <div><h3></h3><h4 :style="{width: dx.percent}"></h4></div>
            <span class="mark">{{dx.mark}}</span> 
          </li>
        </ul>
      </dl>
      <dl class="rule declare">
        <dt><label v-if="simply">特别声明</label><label v-else>特別聲明</label></dt>
        <dd>
          <ul class="aux">
            <li><label v-if="simply">iBer App提醒用户注意上述活动规则，用户参与活动即视为您认可并愿意接受本活动规则的约束。</label><label v-else>iBer App提醒用戶注意上述活動規則，用戶參與活動即視為您認可並願意接受本活動規則的約束。</label></li>
            <li><label v-if="simply">禁止任何用户以不正当手段及舞弊行为参与积分活动，一经发现，我们有权将不正当积分清零，并取消该用户领取礼品的资格。</label><label v-else>禁止任何用戶以不正當手段及舞弊行為參與積分活動，一經發現，我們有權將不正當積分清零，並取消該用戶領取禮品的資格。</label></li>
            <li><label v-if="simply">iBer App对活动拥有最终解释权，如对活动规则有异议，请通过“我的-意见反馈”进行反馈。</label><label v-else>iBer App對活動擁有最終解釋權，如對活動規則有異議，請通過“我的﹣意見反饋”進行反饋。</label></li>
          </ul>
        </dd>
      </dl>
    </div>

    

  </div>
</template>


<script>
  export default {
    name: '',
    data () {
      return {
        rankList: [
          {rank: "V1", mark: 0, percent: "0"},
          {rank: "V2", mark: 75, percent: "16%"},
          {rank: "V3", mark: 150, percent: "22%"},
          {rank: "V4", mark: 300, percent: "28%"},
          {rank: "V5", mark: 525, percent: "34%"},
          {rank: "V6", mark: 750, percent: "40%"},
          {rank: "V7", mark: 1125, percent: "46%"},
          {rank: "V8", mark: 1725, percent: "52%"},
          {rank: "V9", mark: 2475, percent: "58%"},
          {rank: "V10", mark: 3375, percent: "64%"},
          {rank: "V11", mark: 4875, percent: "70%"},
          {rank: "V12", mark: 7875, percent: "76%"},
          {rank: "V13", mark: 12375, percent: "82%"},
          {rank: "V14", mark: 18375, percent: "88%"},
          {rank: "V15", mark: 30000, percent: "94%"},
          {rank: "V16", mark: 45000, percent: "100%"}
        ]
      }
    },
    created () {
      document.title = this.simply ? "积分规则" : "積分規則";

      this.$root.pageLoading.layer = 1;
      window.setTimeout(()=> {
        this.$root.pageLoading.layer = 0;
      }, 200);
    }
  }
</script>
<style scoped>
  dl.rule {margin-top:.15rem;padding-left:.15rem;}
  dl.rule>dt {height:.2rem;line-height:.2rem;font-size:.16rem;font-weight:bold;color:#cbac6c;}
  dl.rule>dd {margin-top: .05rem;padding-bottom:.15rem;line-height:.2rem;border-bottom:1px solid #e8e8e8;font-size:.14rem;color:#999;}
  dl.rule:last-child>dd {border-bottom:0;}

  dl.rank>dd {border-bottom:0;}
  dl.rank>p {margin-top:.15rem;margin-bottom:.15rem;height:.2rem;line-height:.2rem;font-size: .14rem;color:#cbac6c;}
  dl.rank>ul {padding-right:.15rem;padding-bottom:.15rem;border-bottom:1px solid #e8e8e8;}
  dl.rank>ul>li {height:.21rem;line-height:.21rem;}
  dl.rank>ul>li span.rank {width:.35rem;font-size:.14rem;font-weight:bold;color:#cbac6c;}
  dl.rank>ul>li span.mark {padding-left:.15rem;width:.6rem;font-size:.14rem;font-weight:bold;color:#cbac6c;}
  dl.rank>ul>li div {flex:1;overflow:hidden;padding-top:.06rem;}
  dl.rank>ul>li div h3 {width:100%;height:.08rem;border-radius:.08rem;background-color: #ede8de;}
  dl.rank>ul>li div h4 {position:absolute;top:.06rem;left:0;height:.08rem;border-radius:.08rem;background-image: linear-gradient(90deg, #E6C88A 0%, #CBAC6C 100%);}

  dl.declare>dd ul>li {margin-bottom:.2rem;padding-left:.15rem;line-height:.2rem;}
  dl.declare>dd ul>li::before {
    content: "";
    position: absolute;
    top: .07rem;
    left: 0;
    width: .06rem;
    height: .06rem;  
    border-radius: 100%;
    background-color: #e3c587;
  }
</style>