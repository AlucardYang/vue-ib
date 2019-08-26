<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar aux-pdm" style="background-color: #fff;">
      <dl class="theme info">
        <dt></dt>
        <dd></dd>
      </dl>
      <dl class="theme autograph">
        <dt></dt>
        <dd></dd>
      </dl>
      <dl class="theme profile">
        <dt></dt>
        <dd></dd>
      </dl>
      <dl class="theme experience">
        <dt></dt>
        <dd></dd>
      </dl>
      <dl class="theme honor">
        <dt></dt>
        <dd></dd>
      </dl>
      <dl class="theme album">
        <dt></dt>
        <dd></dd>
      </dl>
    </div>


  </div>
</template>


<script src="./js/a_a_k.js"></script>
<style scoped src="./css/agent.css"></style>
<style scoped src="./css/a_a_k.css"></style>

<!--
dl.theme {

}
dl.theme>dt {
  
}
dl.theme>dd {
  
}

/*--个人资料--*/
dl.info {}
dl.info>dt {}
dl.info>dd {}


/*--个性签名--*/
dl.autograph {}
dl.autograph>dt {}
dl.autograph>dd {}


/*--个人简介--*/
dl.profile {}
dl.profile>dt {}
dl.profile>dd {}


/*--从业经验--*/
dl.experience {}
dl.experience>dt {}
dl.experience>dd {}


/*--个人荣誉--*/
dl.honor {}
dl.honor>dt {}
dl.honor>dd {}


/*--个人相簿--*/
dl.album {}
dl.album>dt {}
dl.album>dd {}

-->


<!--
import CommonJS from '@/components/shared/service/common.js'; 
import agn from "./agent.js";


export default {
  name: "",
  data: function() {
    return {
      wxixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,
      user_uuid: null,
      user_homepage_template_uuid: null,
      mdrt: {
        state: null,
        level: null
      },
      share: {
        type: 'news',
        title: "",
        thumbImage: "",
        desc: this.simply ? "极致服务，卓越专属的保险咨询顾问" : "極致服務，卓越專屬的保險諮詢顧問",
        isReport: true, // 分享上报，不上报可不传
        target_type: 15,
        url: null,
        link: null,
        user_homepage_template_uuid: null,
        user_uuid: this.user_uuid,
        router: window.location.pathname
      },
      agent: {
        baseInfo: {},
        workExperience: {},
        photos: {},
        honors: {}
      },

      pageError: false,
      
      praise: {state: false, handle: false},
      scroll: {
        state: false,
        object: null
      }
    }
  },
  created () {
    this.initData();
    this.getData();
  },
  watch: {},
  methods: {
    initData: function() {
      if (plug.valueValid(this.$route.query.in_app) && this.$route.query.in_app == 1) {
        this.inApp = true; 
      }
      if (!plug.valueValid(this.$route.query.in_app) && plug.valueValid(this.urlParams) && this.urlParams.in_app == 1) {
        this.inApp = true;
      }
      if (this.inApp) {
        this.$root.blueLoadingParams.show = true;
        this.$root.blueLoadingParams.bg = "#fff";
      }

      //获取Agent ID
      if (!plug.valueValid(this.urlParams)) {
        let query = this.$route.query;
        if (!plug.valueValid(query) || !plug.valueValid(query.user_uuid)) {
          let _toast = this.simply ? "当前页面参数异常" : "當前頁面參數異常";
          this.$toast(_toast);
          return ;  
        }
        this.user_uuid = this.$route.query.user_uuid; 
        this.user_homepage_template_uuid = this.$route.query.user_homepage_template_uuid;
      } else {
        this.user_uuid = this.urlParams.user_uuid; 
        this.user_homepage_template_uuid = this.urlParams.user_homepage_template_uuid;
      }

      //申报地址
      if (window.__wxjs_environment != "miniprogram" && window.platform != 7) {
        plug.autoDeclare({
          object: this,  //Vue对象或子对象，注意作用域
          app: this.inApp, 
          user_uuid: this.user_uuid  //agent ID
        }); 
      } 

      // 分享参数
      this.share.user_uuid = this.user_uuid;
      this.share.user_homepage_template_uuid = this.user_homepage_template_uuid;

      //分享URL 
      let exUrl = plug.getAgentPath() + "?user_uuid=" + this.user_uuid + "&user_homepage_template_uuid=" + this.user_homepage_template_uuid;
      this.share.link = plug.exchangeUrl(exUrl); 
  
      this.share.url =  window.location.origin + window.location.pathname + "?user_uuid=" + this.user_uuid + "&user_homepage_template_uuid=" + this.user_homepage_template_uuid + "&target_type=" + this.share.target_type + "&one_way=" + this.user_uuid;

    },
    getData: function() {
      agn.getTemplData({
        object: this,
        callback: (res)=> {
          this.mdrt.state = res.data.baseInfo.mdrt;
          this.mdrt.level = res.data.baseInfo.mdrt_level;
          //this.comTMDRTdata.level = res.data.baseInfo.mdrt_level;

          //设置标题
          let title = agn.setTitle(this.simply,res.data.baseInfo.nickname, res.data.baseInfo.mobile1);

          //点赞状态
          this.praise.state = res.data.approval == 1 ? true : false;

          this.share.title = title;
          this.share.thumbImage = res.data.baseInfo.share_avatar;
          this.share.desc = plug.shareAgentHome(this.simply, res.data.baseInfo.abstract);

          // 浏览上报
          !this.inApp && CommonJS.readReport(this.share);
          CommonJS.initWX(this.share);

          res.data.photos.forEach((value, index, array)=> {
            for (let i = 0; i < value.photo_list.length; i++) {
              res.data.photos[index].photo_list[i].setbg = ""; 
              res.data.photos[index].photo_list[i].state = false;
              res.data.photos[index].photo_list[i].ref = "img" + index + "id" + i;
              res.data.photos[index].photo_list[i].src = res.data.photos[index].photo_list[i].url + "?x-oss-process=image/resize,w_300";
              if (plug.iphone5) {
                res.data.photos[index].photo_list[i].url += "?x-oss-process=image/resize,w_500";
              }
            }
          });
          this.agent = res.data; 
          this.agent.baseInfo.avatarLimit = res.data.baseInfo.avatar + "!thumb-750";

          plug.sendAgentShare(this.share, "personal_home_page");
          window.setTimeout(()=> {
            this.$root.pageLoading.layer = 0;
            this.$root.blueLoadingParams.show = false;
          }, 1000);

        }
      }); 
    }
  },
  components: {
  },
  mounted: function() {
    this.$nextTick(()=> {     
    }); 
  }
}
-->