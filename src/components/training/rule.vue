<template>
  <div class="com-frame iber-train-rule">
    <!--简体-->
    <div v-if="simply" class="com-scroll-y aux-bar com-bg aux-pdm">
      <dl class="aux">
          <dt>
            <span>
              <img class="left" src="https://static.iberhk.com/v2/web/images/train/train_rule_left.png" alt="">
              学习须知及规则
              <img class="right" src="https://static.iberhk.com/v2/web/images/train/train_rule_right.png" alt="">
            </span>
          </dt>
          <dd>
            <ul>
              <li>iBer会籍一年可享有18次培训课时。</li>
              <li>每报名一个课程，消耗一次课时。</li>
              <li>每个课程包含：参与1次该课程【现场学习】课堂；无限次播放该课程【在线学习视频】（如果想再次参与该课程【现场学习】课堂，则消耗多1个课时，以此类推）。</li>
              <li>iBer提供的课程均由业内专业人士独家讲授，所授知识不代表全行业观点，iBer拥有最终解释权。课程仅可本人使用，不可转移他人。</li>
            </ul>
          </dd>
        </dl>
        <dl class="aux">
          <dt>
            <span>
              <img class="left" src="https://static.iberhk.com/v2/web/images/train/train_rule_left.png" alt="">
              「现场学习」课程须知
              <img class="right" src="https://static.iberhk.com/v2/web/images/train/train_rule_right.png" alt="">
            </span>
          </dt>
          <dd>
            <ul>
              <li>请提前10分钟现场签到入场，为维持课堂质量，开课后15分钟将停止签到进场，并视迟到为自动放弃该课程。</li>
              <li>若因个人原因取消课程，需在开课2小时前取消。</li>
              <li>如因官方原因取消和变动课程，导致会员不能按计划参加，课时将会被返还到您的可用课时内。</li>
              <li>请遵守纪律，严禁录影及接听电话以维持课堂秩序。</li>
              <li>为使得会员们更快适应内地互联网语言环境，我们授课将统一使用普通话。</li>
              <li>为使学习效果最大化，所有线下课程，满5人则开课，少于5人，我们将与报名会员沟通，顺延到下次同主题课程。</li>
            </ul>
          </dd>
        </dl>
    </div>


    <!--繁体-->
    <div v-else class="com-scroll-y aux-bar com-bg aux-pdm">
      <dl class="aux">
        <dt>
          <span>
            <img class="left" src="https://static.iberhk.com/v2/web/images/train/train_rule_left.png" alt="">
            學習須知及規則
            <img class="right" src="https://static.iberhk.com/v2/web/images/train/train_rule_right.png" alt="">
          </span>
        </dt>
        <dd>
          <ul>
            <li>iBer會籍一年可享有18次培訓課時。</li>
            <li>每報名一個課程，消耗一次課時。</li>
            <li>每個課程包含：參與1次該課程【現場學習】課堂；無限次播放該課程【在線學習視頻】（如果想再次參與該課程【現場學習】課堂，則消耗多1個課時，以此類推）。</li>
            <li>iBer提供的課程均由業內專業人士獨家講授，所授知識不代表全行業觀點，iBer擁有最終解釋權。課程僅可本人使用，不可轉移他人。</li>
          </ul>
        </dd>
      </dl>
      <dl class="aux">
        <dt>
          <span>
            <img class="left" src="https://static.iberhk.com/v2/web/images/train/train_rule_left.png" alt="">
            「現場學習」課程須知
            <img class="right" src="https://static.iberhk.com/v2/web/images/train/train_rule_right.png" alt="">
          </span>
        </dt>
        <dd>
          <ul>
            <li>請提前10分鐘現場簽到入場，為維持課堂質量，開課後15分鐘將停止簽到進場，並視遲到為自動放棄該課程。</li>
            <li>若因個人原因取消課程，需在開課2小時前取消。</li>
            <li>如因官方原因取消和變動課程，導致會員不能按計劃參加，課時將會被返還到您的可用課時內。</li>
            <li>請遵守紀律，嚴禁錄影及接聽電話以維持課堂秩序。</li>
            <li>為使得會員們更快適應内地互聯網語言環境，我們授課將統一使用普通話。</li>
            <li>為使學習效果最大化，所有線下課程，滿5人則開課，少於5人，我們將與報名會員溝通，順延到下次同主題課程。</li>
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
        name: ""
      }
    },
    methods: {},
    created () {
      document.title = this.simply ? "学习须知及规则" : "學習須知及規則";
    }
  }
</script>
<style scoped>
  .iber-train-rule>div {padding: .15rem;}
  
  dl {background: #fff;padding-top:.1rem;border-radius: .1rem;margin-bottom:.1rem;}
  dl>dt {height:.5rem;line-height:.5rem;font-size: .16rem;color:#3364e4;font-weight: 600;text-align: center;}
  dl>dt img {position:absolute;width:.2rem;}
  dl>dt img.left {top: 0;left:-.25rem;}
  dl>dt img.right {top: 0;right:-.25rem;}
  dl>dd {padding:0 .15rem;padding-bottom:.15rem;color:#666;}

  ul {list-style-type: unset;padding-left:.2rem;}
  ul>li {line-height:.25rem;}
</style>