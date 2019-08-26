<!--
  <com-agent-wechat-ibercare :params="comAWIData"></com-agent-wechat-ibercare>
  import comAgentWechatIbercare from "@/components/component/com_agent_wechat_ibercare.vue";

  comAWIData: {
    layer: 0, 
    name: "comAWIData",
    name_en: "",
    name_zn: "",
    id: "",  
    qr_url: ""
  },

  components: {
    comAgentWechatIbercare
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
        <dd class="com-blastpicker" :class="{comBlast: slide}" style="overflow:visible;">
          <header v-if="!simply">顧問QR Code</header>
          <header v-if="simply">顾问QR Code</header>
          <div class="qr-show">
            <img :src="params.qr_url" alt="">
          </div>
          <p class="long">長按添加微信好友</p>
          <h2>{{params.name_en}}</h2>
          <h3>{{params.name_zn}}</h3>
          <button id="privWechatID" @click="copyWechatID" class="com-btn" :data-clipboard-text="params.id">點擊複製WeChat ID</button> 
          <i class="iconfont" style="position:absolute;width:1.2rem;font-size:.28rem;line-height:.28rem;bottom: -.48rem;left:50%;margin-left:-.6rem;color:#fff;" @click="close">&#xe686;</i>
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
        copyWechatID: function() {
          const clipboard = new Clipboard("#privWechatID");
          clipboard.on("success", (e)=> {
            this.$toast('已複製到粘貼板');
            clipboard.destroy();  
          }); 
          clipboard.on("error", (e)=> {
            this.$toast('複製失敗，請重新複製');
            clipboard.destroy();
          }); 
        }
      },
      created () {
        if (this.params.layer == 1) {
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
        }
      }
    }
  </script>  
  
  <style scoped>
    dl>dd {
      width:3.26rem;
      background:#f8f8f8;
      border-radius: .16rem;
      text-align: center;
    }
    header {
      height: 1.55rem;
      padding-top: .32rem;
      font-size: .24rem;
      color: #fff;
      text-align: center;
      background: url('https://static.iberhk.com/v2/web/images/common/banner.png') no-repeat;
      background-size: cover;
      border-top-right-radius: .16rem;
      border-top-left-radius: .16rem;
    }
    div.qr-show {
      width: 1.6rem;
      height: 1.6rem;
      border-radius: .1rem;
      -webkit-border-radius: .1rem;
      margin: -.8rem auto 0;
      padding: .05rem;
      background: #fff;
    }
    div.qr-show img {
      width: 100%;
      height: 100%; 
    }
    p.long { 
      font-size: .12rem;
      color: #979797;
      margin: .13rem auto;
    }
    h2 {
      font-size: .20rem;
      color: #333;
      margin: 0;
      height: .24rem;
      line-height: .24rem;
      margin-bottom: .05rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    h3 { 
      font-size: .18rem;
      color: #333;
      margin: 0;
    }
    button {
      margin-top: 0.16rem;
      color: #3364e4;
      font-size: .16rem;
      margin-bottom: .25rem;
    }
  </style>