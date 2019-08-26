<template>
  <div class="com-scroll-y share-code">
    <div class="code-box">
      <div class="title">{{what_code}}</div>
      <div>{{what_code_answer}}</div>
    </div>
    <div class="code-box">
      <div class="title">{{what_scenes}}</div>
      <div>{{what_secenes_answer}}</div>
    </div>
    <div class="code-box">
      <div class="title">{{what_get_code}}</div>
      <div>{{what_get_code_answer}}</div>
      <div class="copy-num-box">
        <div class="share-code-num com-nowrap">{{shareCode}}</div>
        <div class="copy-num" :data-clipboard-text="shareCode" @click="copyShareCode">{{copy_code}}</div>
      </div>
    </div>
    <div class="code-box" style="margin-bottom: 0;">
      <div class="title">{{how_use}}</div>
      <div>{{how_use_answer1}}</div>
      <div class="share-code-little">
        <img v-if="simply" class="select-button-img" src="https://static.iberhk.com/v2/web/images/action/select-button-cn.png">
        <img v-else class="select-button-img" src="https://static.iberhk.com/v2/web/images/action/select-button-tw.png">
        <img v-if="simply" class="select-type-img" src="https://static.iberhk.com/v2/web/images/action/select-type-cn.png">
        <img v-else class="select-type-img" src="https://static.iberhk.com/v2/web/images/action/select-type-tw.png">
      </div>
      <div style="margin-bottom: .08rem">{{how_use_answer2}}</div>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import { Toast } from "mint-ui";

export default {
  name: "ShareCode",
  data() {
    return {
      shareCode: this.$route.query['code'] ? this.$route.query['code'] : '',
      what_code: this.simply ? '什么是共享码？' : '什麼是共享碼？',
      what_code_answer: this.simply ? '每个iBer用户都有唯一共享码用来查看好友的行动报告' : '每個iBer用戶都有唯一共享碼用來查看好友的行動報告',
      what_scenes: this.simply ? '共享码的使用场景？' : '共享碼的使用場景？',
      what_secenes_answer: this.simply ? '将您的行动报告共享给好友或者Team成员，您的好友或者Team成员将同步看到您的行动报告，为保护私隐，共享人员将看不到您行动的具体内容。例如您有一条行动：“#邀约：Andy在海港城会面”，共享出去的行动报告将只看到“邀约（1），而不会看到其具体内容“Andy在海港城会面”' : '將您的行動報告共享給好友或者Team成員，您的好友或者Team成員將同步看到您的行動報告，為保護私隱，共享人員將看不到您行動的具體內容。例如您有一條行動：“#邀約：Andy在海港城會面”，共享出去的行動報告將只看到“邀約（1），而不會看到其具體內容“Andy在海港城會面”',
      what_get_code: this.simply ? '怎样获取好友的行动报告？' : '怎樣獲取好友的行動報告？',
      what_get_code_answer: this.simply ? '复制我的共享码发给他，好友输入后我就可以查看到他的行动报告。' : '複製我的共享碼發給他，好友輸入後我就可以查看到他的行動報告。',
      copy_code: this.simply ? '复制' : '複製',
      how_use: this.simply ? '怎样共享我的行动报告？' : '怎樣共享我的行動報告？',
      how_use_answer1: this.simply ? '1.输入好友给我的共享码，选择允许共享的行动报告类型，点击确定。' : '1.輸入好友给我的共享碼，選擇允許共享的行動報告類型，點擊確定。',
      how_use_answer2: this.simply ? '2.共享后也可修改共享权限喔' : '2.共享後也可修改共享權限喔',
      copy_success_tip: this.simply ? '已复制到粘贴板' : '已複製到粘貼板',
      copy_error_tip: this.simply ? '复制失败，请重新复制' : '複製失敗，請重新複製',
    };
  },
  components: {},
  mounted: function() {},
  methods: {
    copyShareCode(){
      const clipboard = new Clipboard(".copy-num");
      const _this = this;
      clipboard.on("success", e => {
        Toast({
          message: _this.copy_success_tip
        });
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        Toast({
          message: _this.copy_error_tip
        });
        clipboard.destroy();
      });
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.share-code {
  padding: 0.1rem 0.125rem;
  text-align: center;
  background-color: #3364e4;
}

.share-code-num {
  float: left;
  font-size: 0.3rem;
  color: #2a2a2a;
  font-weight: bold;
  line-height: 0.55rem;
  width: calc(100% - .71rem);
  text-align: center;
  color: #3263E3;
  padding: 0 .05rem;
}

.copy-num {
  float: right;
  width: .7rem;
  line-height: 0.54rem;
  font-size: 0.17rem;
  color: #3263E3;
  text-align: center;
  cursor: pointer;
  border-left: .005rem solid #3263E3;
}

.code-box {
  width: 100%;
  background: #fff;
  border-radius: 0.08rem;
  font-size: 0.15rem;
  color: #999999;
  line-height: 0.2rem;
  padding: 0.16rem 0.12rem;
  text-align: left;
  margin-bottom: 0.1rem;
}

.code-box .title {
  font-size: 0.16rem;
  color: #2a2a2a;
  line-height: 0.2rem;
  margin-bottom: 0.16rem;
  font-weight: 700;
}

.use-code {
  padding: 0.12rem;
}

.share-code-little {
  width: 100%;
  text-align: center;
  font-size: 0.2rem;
  color: #2a2a2a;
  line-height: 0.15rem;
  margin: .16rem 0 .24rem 0;
}

.select-button-img {
  display: inline-block;
  width: 2.62rem;
  margin-bottom: .16rem;
}

.select-type-img {
  display: inline-block;
  width: 2.62rem;
}

.copy-num-box {
  border: .005rem solid #3263E3;
  border-radius: .08rem;
  height: .55rem;
  line-height: .55rem;
  width: calc(100% - .27rem);
  margin: .26rem 0 .135rem .1rem;
}
</style>