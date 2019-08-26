<!--
  <com-agent-wechat :params="comAgentWechatData"></com-agent-wechat>
  import comAgentWechat from "@/components/component/com_agent_wechat.vue";

  comAgentWechatData: {
    layer: 0, 
    name: "comAgentWechatData",
    id: "",
    qr_url: ""
  },

  components: {
    comAgentWechat
  },

  beforeRouteLeave (to, from, next) {
    if (this.componentData.layer > 0) {
      this.componentData.layer -= 1;
      next(false); 
      return ;
    }  
    next(true);
  },
-->
<template>
  <transition name="fade">
    <dl v-if="show" class="com-mask-frame com-flex com-wechat-id">
      <dt class="aux-mask" @click="close"></dt>
      <dd class="com-blastpicker" :class="{comBlast: slide}">
        <header v-if="!simply"><i class="iconfont">&#xe6c1;</i>顧問QR Code</header>
        <header v-if="simply"><i class="iconfont">&#xe6c1;</i>顾问QR Code</header>
        <aside v-if="plug.valueValid(params.id)"> 
          <i class="iconfont wechat-icon">&#xe773;</i>
          <span>WeChat ID: </span>
          <span>{{params.id}}</span>  
        </aside> 
        <button v-if="!simply && plug.valueValid(params.id)" id="privWechatID" @click="copyWechatID" class="com-btn" :data-clipboard-text="params.id">點擊複製WeChat ID</button> 
          <button v-if="simply && plug.valueValid(params.id)" id="privWechatID" @click="copyWechatID" class="com-btn" :data-clipboard-text="params.id">点击复制WeChat ID</button> 
        <img v-if="qr_img" :src="params.qr_url"> 
        
        <p v-if="plug.wx.platform && !simply">長按識別 QR Code</p>  
        <p v-if="plug.wx.platform && simply">长按识别 QR Code</p>  

        <i class="iconfont close" style="position:absolute;width:1.2rem;font-size:.28rem;line-height:.28rem;bottom: -.48rem;left:50%;margin-left:-.6rem;color:#fff;" @click="close">&#xe686;</i>
      </dd>   
    </dl>  
  </transition>
</template>


<script>
  import Clipboard from "clipboard";

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
        slide: false,
        qr_img: false
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
      copyWechatID: function() {
        if (!plug.valueValid(this.params.id)) {
          let _toast = this.simply ? "微信ID不存在或无效" : "微信ID不存在或無效";
          this.$toast(_toast);
          return ; 
        }
        const clipboard = new Clipboard("#privWechatID");
        clipboard.on("success", (e)=> {
          let _toast = this.simply ? "已复制到粘贴板" : "已複製到粘貼板";
          this.$toast(_toast);
          clipboard.destroy();  
        }); 
        clipboard.on("error", (e)=> {
          let _toast = this.simply ? "复制失败，请重新复制" : "複製失敗，請重新複製";
          this.$toast(_toast);
          clipboard.destroy();
        }); 
      }
    },
    created () {
      if (!plug.valueValid(this.params.qr_url)) {
        this.qr_img = false;
      } else {
        this.qr_img = true;
      }
      if (this.params.layer) {
        this.open();
      } else { 
        this.close();
      }
    },
    watch: {
      "params.layer": function(val, oldVal) {
        if (val == 1) {
          this.open();
        } else { 
          this.close();
        }
      },
      "params.qr_url": function(val, oldVal) {
        if (!plug.valueValid(val)) {
          this.qr_img = false; 
        } else { 
          this.qr_img = true;
        }
      }
    }
  }
</script>  

<style scoped>
  dl.com-wechat-id>dd {
    width:3.26rem;
    background:#fff;
    border-radius: .16rem;
    text-align: center;
    padding-bottom: .35rem; 
    overflow: visible;
  }
  dl.com-wechat-id>dd header {
    height: .7rem;
    line-height: .7rem;
    font-size: .24rem;
    color: #fff;
    text-align: center; 
    background: url('https://static.iberhk.com/v2/web/images/common/banner_title.png') no-repeat;
    background-size: cover;
    margin-bottom: .2rem;
    font-weight: 600;
  }
  dl.com-wechat-id>dd header i {
    font-size: .24rem;
    margin-right: .1rem;
  }
  dl.com-wechat-id>dd aside {
    font-size: 0.16rem;
    color: #2a2a2a; 
    margin-bottom: .1rem;
  }
  dl.com-wechat-id>dd aside .wechat-icon {
    color: #87dc49;
    margin-right: 0.05rem;
  }
  dl.com-wechat-id>dd button {
    color: #3364e4;
    font-size: .16rem;
    margin-bottom: .15rem;
  }
  dl.com-wechat-id>dd img {
    display: block;
    margin: auto;
    width: 1.3rem;
    height: 1.3rem;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }
  dl.com-wechat-id>dd p {
    font-size: 0.13rem;
    line-height: .3rem;
    color: #999;
  }
</style>