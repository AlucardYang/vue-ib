<template>
    <div class="com-frame com-bgrs iber-radar" :style="{'padding-top': plug.iphonex ? '.5rem' : '.25rem'}">
    <div class="com-frame com-bgrs com-flexv radar-frame">
      <img @click="backWindow" class="close" src="https://static.iberhk.com/v2/web/images/agent/radar/close.png" alt="">

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
        <h3><label v-if="simply">分析结果</label><label v-else>分析結果</label></h3>
        <p v-if="params.type == 0 || params.type == 1"><label v-if="simply">鉴于我们对他的了解还不是很多，建议您可以……</label><label v-else>鑒於我們對他的了解還不是很多，建議您可以……</label></p> 
        <p v-if="params.type == 2"><label v-if="simply">您对他已经有了充分了解以下建议可以让您和他建立更良好的关系</label><label v-else>您對他已經有了充分了解以下建議可以讓您和他建立更良好的關系</label></p>
      </div>
      <section class="com-scroll-y">
        <!--分享路径页面-->
        <div v-if="params.type == 0" class="avatar">
          <p class="com-wrap"><label v-if="simply">他是 {{params.info.nickname}} 的朋友，可以寻求 {{params.info.nickname}} 的转介绍</label><label v-else>他是 {{params.info.nickname}} 的朋友，可以尋求 {{params.info.nickname}} 的轉介紹</label></p>
          <img :src="params.info.avatar" alt="">
          <h3 class="com-nowrap">{{params.info.nickname}}</h3>
        </div>

        <!--AI分析推荐（一）：触发“立即分析”-->
        <ul v-if="params.type == 1" class="aux">
          <li v-for="(dx, index) in params.data" :key="index" @click="openAnalyzePage(dx)" class="com-disx">
            <p>{{dx.title}}</p>
            <div class="com-flex"><i class="iconfont">&#xe774;</i></div>
          </li>
        </ul>

        <!--AI分析推荐（二）：答完题-->
        <ul v-if="params.type == 2" class="aux">
          <li v-for="(dx, index) in params.data" @click="openAnalyzePage(dx)" class="com-disx">
            <p>{{dx.title}}</p>
            <div class="com-flex"><i class="iconfont">&#xe774;</i></div>
          </li>
        </ul>

      </section>
      <footer>
        <!--分享路径页面-->
        <button v-if="params.type == 0" @click="openInfo" class="com-bgrs com-btn" type="button"><label v-if="simply">查看他的资料</label><label v-else>查看他的資料</label></button>
        <p v-if="params.type == 0"><label v-if="simply">看下{{params.info.nickname}}的资料，可以帮助你了解到更多的信息</label><label v-else>看下{{params.info.nickname}}的資料，可以幫助妳了解到更多的信息</label></p>

        <!--AI分析推荐（一）-->
        <button v-if="params.type == 1" @click="perfectInfo" class="com-bgrs com-btn" type="button"><label v-if="simply">继续完善资料</label><label v-else>繼續完善資料</label></button>
      </footer>
    </div>

    

  </div>
</template>


<script>
  export default {
    name: '',
    data () {
      return {
        name: '',
        params: {
          c_user_uuid: "",
          type: null, //0:查看他的资料   1:分析推荐（一） 2:分析推荐（二）
          from: "",
          search: "",
          data: [],
          info: {}
        }
      }
    },
    created () {
      document.title = "分析推荐";

      if (this.inApp) {
        this.$root.blueLoadingParams.show = true;
        this.$root.blueLoadingParams.bg = "#fff";
      } 

      let query = this.$route.query;
      if (!plug.valueValid(query)) {
        let _toast = this.simply ? "当前页面参数异常" : "當前頁面參數異常";
        this.$toast(_toast);
        return ;    
      } 

      let result = JSON.parse(query.params);
      let info = JSON.parse(result.info);
      let data = JSON.parse(result.data);

      if (plug.objectValue(info) || data.length > 0) {
        this.params.c_user_uuid = result.c_user_uuid;
        this.params.type = result.type;
        this.params.from = result.from;
        this.params.search = result.search;
        this.params.info = info;  
        this.params.data = data;       
      }
      window.setTimeout(()=> {this.$root.blueLoadingParams.show = false;}, 1500);
      
    },
    watch: {
      $route: {
        handler: function(val, oldVal) {
          let rstJSON = val.query.params;
          this.params.c_user_uuid = rstJSON.c_user_uuid;
          this.params.type = rstJSON.type;
          this.params.from = rstJSON.from;
          this.params.search = rstJSON.search;
          this.params.data = JSON.parse(rstJSON.data);
          this.params.info = JSON.parse(rstJSON.info); 
        },
        deep: true
      }
    },
    methods: {
      //打开链接
      openAnalyzePage: function(obj) {
        let iberObject = obj;
        iberObject.from = this.params.from;
        postMessage(JSON.stringify({
          type: "links-url", 
          data: iberObject
        })); 
      },
      //继续完善资料
      perfectInfo: function() {
        let search = this.params.search;

        let req = {};
        let arr = search.replace(/^\?/i, "").split("&");
        arr.forEach((value, index, array)=> {
          req[value.split("=")[0]] = value.split("=")[1];
        }); 
        req.type = "radar";
        window.localStorage.setItem("continueState", "true");
        req.c_user_uuid = this.params.c_user_uuid;
        

        window.location.href = window.baseUrl + "/radar/index" + plug.jsonToUrl(req);
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
      },
      //返回上一页  
      backWindow: function() {
        if (plug.iphonex) {
          //alert(this.$route.query.type);
        }
        postMessage(JSON.stringify({
          type: "close", 
          data: {
            from: this.params.from
          }
        }));
      }
    }
  }
</script>
<style scoped>
  .iber-radar {
    background-image: url(https://static.iberhk.com/v2/web/images/agent/radar/bg.png);
    padding: .12rem;
    padding-top: .25rem;
  }
  .radar-frame {
    background-image: url(https://static.iberhk.com/v2/web/images/agent/radar/card.png);
    padding: 0 .12rem;
  }
  .close {
    position: absolute;
    top: .11rem;
    right: .11rem;
    width: .2rem;
    height: .2rem;
    z-index: 1000;
  }

  header {width:100%;height:1.18rem;}
  header div.robit {position: absolute;top: .41rem;left: 0;width: 100%;height: .7rem;z-index: 2;}
  header div.robit img.robit {height: 100%;}

  header div.robit img.lit {height: 100%;opacity: 0;animation: litAnimate 3s infinite;}
  header div.robit img.big {height: 100%;opacity: 0;animation: bigAnimate 3s infinite;}
  @keyframes litAnimate {0% {opacity: 0;} 30% {opacity: 1;} 60% {opacity: 1;} 100% {opacity: 0;}}
  @keyframes bigAnimate {0% {opacity: 0;} 10% {opacity: 0;} 60% {opacity: 1;} 100% {opacity: 0;}} 

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

  footer {width: 100%;text-align: center;padding: .25rem .32rem .2rem .32rem;}
  footer button {width: 100%;height: .5rem;font-size: .15rem;color: #A3B6FF;background-image: url(https://static.iberhk.com/v2/web/images/agent/radar/button.png);}
  footer p {height: .25rem;line-height: .25rem;color: #B1E7FF;font-size: .13rem;}
  footer p i {display: inline-block;font-size: .12rem;transform: scale(.8);}
</style>