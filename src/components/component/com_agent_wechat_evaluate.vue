<!--
  <com-agent-wechat-evaluate :params="comAWEData"></com-agent-wechat-evaluate>
  import comAgentWechatEvaluate from "@/components/component/com_agent_wechat_evaluate.vue";

  comAWEData: {
    layer: 0, 
    name: "comAWEData",
    name_en: "",
    name_zn: "",
    id: "",  
    qr_url: ""
  },

  components: {
    comAgentWechatEvaluate
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
          <header><label v-if="simply">顾问QR Code</label><label v-if="!simply">顧問QR Code</label></header>
          <div class="qr-show">
            <img :src="params.qr_url" alt=""> 
          </div>
          <p><label v-if="simply">长按识别QR Code</label><label v-if="!simply">長按識別 QR Code</label></p>
          <i class="iconfont" style="position:absolute;width:1.2rem;font-size:.28rem;line-height:.28rem;bottom: -.48rem;left:50%;margin-left:-.6rem;color:#fff;" @click="close">&#xe686;</i> 
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
      padding-bottom: .25rem;
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
      background: #eee;
    }
    p { 
      line-height: .4rem;
      font-size: .13rem;
      color: #9999;
    }
    h2 {
      font-size: .20rem;
      color: #333;
      margin: 0;
      height: .24rem;
      line-height: .24rem;
      margin-top: .1rem;
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