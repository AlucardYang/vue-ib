<!--
  <com-agent-ratar :params="comARRData"></com-agent-ratar>
  import comAgentRatar from "@/components/component/com_agent_ratar.vue";

  comARRData: {
    layer: 0, 
    name: "comARRData"
  },

  components: {
    comAgentRatar
  },

  beforeRouteLeave (to, from, next) {
    if (this.comARRData.layer > 0) {
      this.comARRData.layer -= 1;
      next(false); 
      return ;
    }   
    next(true);
  }, 
-->
<template>
  <transition name="fade">
    <dl v-if="show" class="com-mask-frame com-flex com-bgrs">
      <dt class="aux-mask"></dt>
      <dd class="com-blastpicker com-flexv com-bgrs" :class="{comBlast: slide}">
        <header>
          <div class="com-flex robit">
            <img class="left big" src="https://static.iberhk.com/v2/web/images/agent/radar/left_big.png" alt="">
            <img class="left lit" src="https://static.iberhk.com/v2/web/images/agent/radar/left_lit.png" alt="">
            <img class="robit" src="https://static.iberhk.com/v2/web/images/agent/radar/robit.png" alt="">
            <img class="right lit" src="https://static.iberhk.com/v2/web/images/agent/radar/right_lit.png" alt="">
            <img class="right big" src="https://static.iberhk.com/v2/web/images/agent/radar/right_big.png" alt="">
          </div>
          <div class="com-flex body"><img src="https://static.iberhk.com/v2/web/images/agent/radar/robit_body.png" alt=""></div>
        </header>
        <div class="title">
          <h3><label v-if="simply">分析结果</label><label v-if="!simply">分析結果</label></h3>
          <p v-if="params.type == 0 || params.type == 1"><label v-if="simply">鉴于我们对Ta的了解还不是很多，建议您可以……</label><label v-if="!simply">鑒於我們對Ta的了解還不是很多，建議您可以……</label></p> 
          <p v-if="params.type == 2"><label v-if="simply">您对她已经有了充分了解以下建议可以让您和她建立更良好的关系</label><label v-if="!simply">您對她已經有了充分了解以下建議可以讓您和她建立更良好的關系</label></p>
        </div>
        <section class="com-scroll-y aux-bar">
          <!--分享路径页面-->
          <div v-if="params.type == 0" class="avatar">
            <p class="com-wrap"><label v-if="simply">他是 {{params.info.nickname}} 的朋友，可以寻求 {{params.info.nickname}} 的转介绍</label><label v-if="!simply">他是 {{params.info.nickname}} 的朋友，可以尋求 {{params.info.nickname}} 的轉介紹</label></p>
            <img :src="params.info.avatar" alt="">
            <h3 class="com-nowrap">{{params.info.nickname}}</h3>
          </div>

          <!--AI分析推荐（一）-->
          <ul v-if="params.type == 1" class="aux">
            <li v-for="(dx, index) in params.data"  @click="openAnalyzePage(dx.app_url)" class="com-disx">
              <p>{{dx.title}}</p>
              <div class="com-flex"><i class="iconfont">&#xe774;</i></div>
            </li>
          </ul>

          <!--AI分析推荐（二）-->
          <ul v-if="params.type == 2" class="aux">
            <li v-for="(dx, index) in params.data" @click="openAnalyzePage(dx.app_url)" class="com-disx">
              <p>{{dx.title}}</p>
              <div class="com-flex"><i class="iconfont">&#xe774;</i></div>
            </li>
          </ul>

        </section>
        <footer>
          <!--分享路径页面-->
          <button v-if="params.type == 0" @click="openInfo" class="com-bgrs com-btn" type="button"><label v-if="simply">查看他的资料</label><label v-if="!simply">查看他的資料</label></button>
          <p v-if="params.type == 0"><label v-if="simply">看下Adam的资料，可以帮助你了解到更多的信息</label><label v-if="!simply">看下Adam的資料，可以幫助妳了解到更多的信息</label></p>

          <!--AI分析推荐（一）-->
          <button v-if="params.type == 1" @click="perfectInfo" class="com-bgrs com-btn" type="button"><label v-if="simply">继续完善资料</label><label v-if="!simply">繼續完善資料</label></button>
        </footer>
      </dd>   
    </dl>  
  </transition>
</template>


<script>
  export default {
    name: '',
    props: {
      params: {
        type: Object,
        default: {}
      }
    },
    data: function() {
      return {
        show: false,
        slide: false
      }
    },
    methods: {
      //关闭
      close: function() {
        this.slide = false;
        window.setTimeout(()=> {
          this.show = false;
          this.$parent[this.params.name].layer = 0;
        }, 50);
      },
      //打开
      open: function() {
        this.show = true;
        window.setTimeout(()=> {  
          this.slide = true; 
          this.$parent[this.params.name].layer = 1;
        }, 50);
      },
      controlVisual: function(val) {
        if (val == 1) {
          this.open();
        } else { 
          this.close();
        }
      },
      //打开链接
      openAnalyzePage: function(url) {
        postMessage(JSON.stringify({
          type: "links-url", 
          data: {
            from: this.params.from,
            url: url,  //跳转URL
            twpe: ""
          }
        })); 
      },
      //继续完善资料
      perfectInfo: function() {
        this.$parent.user.state = true;
        this.$parent[this.params.name].layer = 0;
      },
      //查看他的资料
      openInfo: function() {
        postMessage(JSON.stringify({
          type: "agent_info", 
          data: {
            from: this.params.from,
            uuid: this.params.info.c_user_uuid
          }
        }));       
      }
    },
    created () {
      this.controlVisual(this.params.layer);
    },
    watch: {
      "params.layer": function(val, oldVal) {
        this.controlVisual(val);
      } 
    }
  }
</script>
<style scoped>
  dl {padding: .12rem;}
  dl>dd {padding: .12rem;width:100%;height:100%;}
  header {width:100%;height:1.18rem;}
  header div.robit {position: absolute;top: .22rem;left: 0;width: 100%;height: .7rem;z-index: 2;}
  header div.robit img.robit {height: 100%;margin-right:.1rem;margin-left:.1rem;}
  header div.robit img.big {height: 100%;opacity: 0;animation: voiceAnimate 1s infinite;animation-delay: 500ms;}
  header div.robit img.lit {height: 100%;opacity: 0;animation: voiceAnimate 1s infinite;}
  @keyframes voiceAnimate {0% {opacity: 0;}100% {opacity: 1;}}
  header div.body {position:absolute;bottom:0;width:100%;height:.35rem;}
  header div.body img {height:100%;}

  div.title {width: 100%;height: 1.3rem;text-align: center;background-size: 100% 100%;background-image:url(https://static.iberhk.com/v2/web/images/agent/radar/analyze_bg.png);}
  div.title h3 {margin-top:.285rem;margin-bottom:.17rem;height:.27rem;line-height:.27rem;color:#fff;font-size:.22rem;}
  div.title p {line-height:.2rem;padding: 0 .15rem;font-size:.15rem;color:#fff;}

  section {width: 100%;flex: 1;}

  /*--模板--*/
  section div.avatar {background:#fff;border-bottom-left-radius: .06rem;border-bottom-right-radius: .06rem;text-align: center;padding: .2rem .35rem;}
  section div.avatar p {line-height:.2rem;font-size: .15rem;}
  section div.avatar img {width:.64rem;height:.64rem;border-radius: 100%;margin-top: .32rem;}
  section div.avatar h3 {font-size: .15rem;height:.35rem;line-height:.35rem;}

  /*--模板--*/
  section ul {background:#fff;border-bottom-left-radius: .06rem;border-bottom-right-radius: .06rem;}
  section ul>li {border-top:1px solid #ddd;padding: .1rem 0 .1rem .15rem;}
  section ul>li:first-child {border-top:0;}
  section ul>li p {flex:1;font-size: .15rem;line-height:.2rem;}
  section ul>li div {width:.38rem;}
  section ul>li div i {font-size: .12rem;color:#ccc;}

  footer {width: 100%;text-align: center;padding-top: .25rem;padding-bottom: .28rem;}
  footer button {width: 2.85rem;height: .44rem;font-size: .15rem;color: #A3B6FF;background-image: url(https://static.iberhk.com/v2/web/images/agent/radar/button.png);}
  footer p {height: .25rem;line-height: .25rem;color: #B1E7FF;font-size: .13rem;}
  footer p i {display: inline-block;font-size: .12rem;transform: scale(.8);}
</style>