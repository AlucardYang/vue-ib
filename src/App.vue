<template>
  <div id="app" class="main-container" :class="{'msg-alert': $root.msgAlert}">
    <header v-if="simply && $root.msgAlert" class="com-marlr com-nowrap com-disx" :class="{'msg-alert': $root.msgAlert}">
      <span style="flex:1;">有一位顾问发来{{$root.msgNum}}条信息</span>
      <em @click="consultAgent" style="width:.8rem;text-decoration:underline;">点击查看</em>
      <i class="iconfont">&#xe76b;</i> 
    </header> 
    <header v-if="!simply && $root.msgAlert" class="com-marlr com-nowrap com-disx" :class="{'msg-alert': $root.msgAlert}">
      <span style="flex:1;">有一位顧問發來{{$root.msgNum}}條訊息</span>
      <em @click="consultAgent" style="width:.8rem;text-decoration:underline;">點擊查看</em>
      <i class="iconfont">&#xe76b;</i>
    </header>
    <transition :name="swipeAnimate">
      <router-view id="frameworkView" class="framework-view"></router-view>
    </transition> 
    <!--页面加载框-->
    <com-page-loading :params="$root.pageLoading"></com-page-loading>
    <!-- 黑色背景加载中 -->
    <com-progress :params="$root.progress"></com-progress>
    <!-- 蓝色小圈加载中 -->
    <blue-loading :params="$root.blueLoadingParams"></blue-loading>
    <!-- agent二维码显示 -->
    <agent-wechat ref="agentWechat" :params="$root.agentCardInfo"></agent-wechat>
    <!-- 留言板 -->
    <guest-book :params="$root.guestBook"></guest-book>
    <!--咨询顾问授权-->
    <com-oauth-consult :params="$root.consauth"></com-oauth-consult>
    <!--页面Loading组件-->
    <com-loading :params="$root.loading"></com-loading>
    
    </div>
</template>

<script>
import BlueLoading from '@/components/shared/component/loading/blueloading.vue';
import AgentWechat from "@/components/shared/component/card/agentwechat.vue";
import GuestBook from "@/components/shared/component/card/guestbook.vue";
import comOauthConsult from "@/components/component/com_oauth_consult.vue";

export default {
  name: "App",
  data() {
    return {
      name: "",
      swipeAnimate: ""
    };
  },
  components: {
    BlueLoading,
    AgentWechat,
    GuestBook,
    comOauthConsult
  },
  watch: {
    $route(to, from) {
      if (!this.valueValid(to.meta.index) || !this.valueValid(from.meta.index)) {
        return ;
      }
      if (to.meta.index > from.meta.index) {
        this.swipeAnimate = "slide-left";
        return ;
      }
      this.swipeAnimate = "slide-right";
    }
  },
  methods: { 
    valueValid(varible) {
      if (typeof varible == "number") {
        return true;
      }
      if (varible == undefined || varible == "undefined" || varible == null || varible == "null" || varible == "") {
        return false;
      }
      return true;
    },
    consultAgent: function() {
      let params = {
        user_uuid: this.$root.msgAlertData.user_uuid,
        answer_uuid: this.$root.msgAlertData.answer_uuid,
        from_type: this.$root.msgAlertData.from_type
      }
      if (!plug.valueValid(params.user_uuid) || !plug.valueValid(params.answer_uuid) || !plug.valueValid(params.from_type)) {
        let _toast = this.simply ? "当前页面参数异常" : "當前頁面參數異常";
        this.$toast(_toast);
        return ;
      }
      if (plug.valueValid(this.$root.msgAlertData.language)) {
        params.language = this.$root.msgAlertData.language; 
      }


      //小程序环境
      if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
        params.c_user_uuid = this.$root.msgAlertData.c_user_uuid;
        let programUrl = window.baseUrl + "/agent/proconsult" + plug.jsonToUrl(params);  
        const wxSdk = require('weixin-js-sdk');
        setTimeout(()=>{
          wxSdk.miniProgram.navigateTo({
            url: '/pages/consult/consult?url=' + encodeURIComponent(programUrl)
          }); 
        }, 500);
        
        return ;
      }
      window.location.href = window.baseUrl + "/agent/consult" + plug.jsonToUrl(params);   
    }
  }
};

</script>

<style>
  /* @import "../node_modules/mint-ui/lib/style.css"; */
  @import "./assets/css/default.css";
  @import "./assets/library/component.css";
  @import "./assets/css/style.css";

  div.main-container.msg-alert {
    padding-top: .45rem;
  }   
  header.msg-alert {
    position: absolute;
    top: 0;
    width: 100%;
    height: .45rem;
    line-height: .45rem;
    font-size: .14rem;
    color: #fff;
    background: #2d7bff;
    z-index: 9;
  }

  .slide-right-enter-active, .slide-right-leave-active, .slide-left-enter-active, .slide-left-leave-active {
    will-change: transform;
    transition: all 200ms;
    position: absolute;
  }
  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }  
</style>
