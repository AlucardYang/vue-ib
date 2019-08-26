<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar com-bg" style="padding:.12rem;">
      <section class="iber-pane show">
        <div class="com-bgrs">
          <img src="https://static.iberhk.com/v2/web/images/evaluate/result_left.png" alt="">
          <h3>{{plug.sm(simply, '評測結果')}}</h3>
          <p>{{plug.sm(simply, '恭喜您！您已經完成本次評測')}}</p>
          <p>{{plug.sm(simply, 'TiMi為您寫了一份評測報告，快來查看吧')}}</p>
        </div>
        <button type="button" class="com-btn" @click="getUrl">{{plug.sm(simply, '查看詳情')}}</button>
      </section> 
      <section class="iber-pane result" :style="{backgroundImage: 'url(' + rightImg + ')'}">
        <h1 class="com-mgrl">{{plug.sm(simply, '關注微信公眾號')}}<br>{{plug.sm(simply, '隨時看結果')}}</h1>
        <p class="info">{{plug.sm(simply, '關注後發送報告碼')}}
          <button class="com-btn" type="button" id="privCodeID" @click="copyCodeID" :data-clipboard-text="data.answer_code">[{{plug.sm(simply, '複製')}}]
          </button>
        </p>
        <h3>{{data.answer_code}}</h3>
        <img :src="data.qrcode_img" alt>
        <p>{{plug.sm(simply, '長按識別二維碼即可關注')}}</p>
        <p>{{plug.sm(simply, 'TiMi還為你準備了更多測試噢')}}</p>
      </section>
    </div>
  </div>
</template>
    
<script>
import Clipboard from "clipboard";

export default {
  name: "",
  data() {
    return {
      rightImg: "https://static.iberhk.com/v2/web/images/evaluate/result_right.png",
      data: {}
    };
  },
  methods: {
    copyCodeID: function() {
      if (this.data.answer_code == undefined || this.data.answer_code == "") {
        let _toast = this.simply ? "报告码不存在或无效" : "報告碼不存在或無效";
        this.$toast(_toast);
        return;
      }
      const clipboard = new Clipboard("#privCodeID");
      clipboard.on("success", e => {
        let _toast = this.simply ? "已复制到粘贴板" : "已複製到粘貼板";
        this.$toast(_toast);
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        let _toast = this.simply ? "复制失败，请重新复制" : "複製失敗，請重新複製";
        this.$toast(_toast);
        clipboard.destroy();
      });
    },
    getUrl: function() {
      if (!plug.valueValid(this.data.result_url)) {
        let _toast = this.simply ? "链接异常" : "鏈接异常";
        this.$toast(_toast);
        return;
      }
      window.location.href = this.data.result_url;
    }
  },
  created() {
    document.title = this.simply ? "关注公众号，查看评测结果" : "關注公眾號，查看評測結果";

    this.data = JSON.parse(this.$route.query.data);

    let card = "auth=" + this.data.card.auth + "&card=" + this.data.card.card + "&language=" + this.data.card.language;
    let result = this.data.result_url;
    if (result.match(/\?/g) != null) {
      result += "&" + card;
    } else {
      result += "?" + card;
    }
    this.data.result_url = result;
    console.log(this.data.result_url); 
  },
  watch: {}
};
</script>

<style scoped>
.iber-pane {
  margin-bottom: .1rem;
  border-radius: .08rem;
  overflow: hidden;
  background-color: #fff;
}
section.show {
  text-align: center;
}
section.show div {
  padding-top: .3rem;
  height: 1.55rem;
  background-image: url(https://static.iberhk.com/v2/web/images/evaluate/evaluate_result.png);
}
section.show div>img {
  position: absolute;
  top: 0;
  left: 0;
  width: 1rem;
}
section.show h3 {
  margin-bottom: .2rem;
  height: .3rem;
  line-height: .3rem;
  font-size: .24rem;
  color: #fff;
}
section.show p {
  line-height: .22rem;
  font-size: .16rem;
  color: #fff;
}
section.show button {
  width: 100%;
  height: .5rem;
  font-size: .16rem;
  color:#3364E4;
}
section.result {
  text-align: center;
  padding-top: 0.35rem;
  padding-bottom: 0.15rem;
  background-repeat: no-repeat;
  background-size: 0.92rem 1.2rem;
  background-position: top right;
}
section.result h1 {
  width: 1.6rem;
  line-height: .26rem;
  font-size: .19rem;
  color: #2a2a2a;
}
section.result p {
  line-height: .18rem;
  font-size: .13rem;
  color: #999;
}
section.result p.info {
  margin-top: 0.2rem;
  height: 0.2rem;
  line-height: 0.2rem;
  font-size: 0.16rem;
}
section.result p.info button {
  padding: 0;
  color: #3364e4;
  margin-left: 0.05rem;
  font-size: 0.16rem;
}
section.result h3 {
  margin-top: 0.05rem;
  margin-bottom: 0.2rem;
  height: 0.3rem;
  line-height: 0.3rem;
  color: #2a2a2a;
  font-size: 0.25rem;
}
section.result img {
  width: 1.9rem;
  height: 1.9rem;
  margin-bottom: 0.05rem;
}
</style>
