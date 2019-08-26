<!--
  <com-agent-auth :params="comAAHData"></com-agent-auth>
  import comAgentAuth from "@/components/component/com_agent_auth.vue";

  comAAHData: {
    layer: 0, 
    name: "comAAHData",
    img_url: ""
  },

  components: {
    comAgentAuth
  },

  beforeRouteLeave (to, from, next) {
    if (this.comAAHData.layer > 0) {
      this.comAAHData.layer -= 1;
      next(false); 
      return ;
    }  
    next(true);
  },
-->

<template>
  <transition name="fade">
    <dl v-if="show" class="com-mask-frame com-flex com-wechat-id">
      <dt class="aux-mask e-bubble" @click="close"></dt>
      <dd class="com-blastpicker" :class="{comBlast: slide}" style="overflow:visible;">
        <div class="qr-show">
          <img v-if="params.state == 1" src="https://static.iberhk.com/v2/web/images/common/auth_vip.svg" alt=""> 
          <img v-if="params.state == 0" src="https://static.iberhk.com/v2/web/images/common/auth_user.svg" alt=""> 
        </div>
        <h2 v-if="simply && params.state == 1">实名认证已通过</h2>
        <h2 v-if="!simply && params.state == 1">實名認證已通過</h2>
        <h3 v-if="simply && params.state == 1">身份认证经iBer认证，真实有效</h3>
        <h3 v-if="!simply && params.state == 1">身份認證經iBer認證，真實有效</h3>

        <h2 v-if="simply && params.state == 0">实名认证未开通或通过</h2>
        <h2 v-if="!simply && params.state == 0">實名認證未開通或通過</h2>
        
        <i class="iconfont e-bubble" style="position:absolute;width:1.2rem;font-size:.28rem;line-height:.28rem;bottom: -.48rem;left:50%;margin-left:-.6rem;color:#fff;" @click="close">&#xe686;</i> 
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
    background:#fff;
    border-radius: .1rem;
    text-align: center;
    padding: .3rem 0;
  }
  div.qr-show {
    width: 1rem;
    height: 1rem;
    margin: 0 auto;
    padding: .05rem;
  }
  div.qr-show img {
    width: 100%;
    height: 100%; 
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
    font-weight: 400;
    font-size: .16rem;
    color: #999;
    margin: 0;
  }
</style>