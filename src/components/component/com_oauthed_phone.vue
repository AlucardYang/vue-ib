<!--
  <com-oauthed-phone :params="authedData"></com-oauthed-phone>
  import comOauthedPhone from "@/components/component/com_oauthed_phone.vue";

  authedData: {
    name: "authedData",
    layer: 0,
    mphone: null,
    mobile_pre: null
  }

  开启：this.$root[this.params.name].layer = 1;
  关闭：this.$root[this.params.name].layer = 0;

  components: {
    comOauthedPhone
  }, 

  beforeRouteLeave (to, from, next) {
    if (this.authedData.layer > 0) {
      this.authedData.layer -= 1;
      next(false); 
      return ; 
    }  
    next(true);
  }

-->
 

<template>
  <transition name="fade">
    <dl v-if="show" class="com-mask-frame com-flex">
      <dt class="aux-mask" @click="close"></dt>
      <dd class="com-blastpicker" :class="{comBlast: slide}" style="overflow:visible;">
        <div>
          <h3><label v-if="simply">已授权手机号</label><label v-if="!simply">已授權手機號</label>：+{{params.mobile_pre}} {{plug.phoneFormat(params.mphone)}}</h3>
          <p><label v-if="simply">授权后该顾问将看到您的手机号及时收到短信回复和更好的服务</label><label v-if="!simply">授權後該顧問將看到您的手機號及時收到短信回復和更好的服務</label></p>
          <button @click="close" class="com-btn com-mgrl" type="button">知道了</button>
        </div>
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
  dl>dd {padding: 0 .25rem;}
  div {background-color: #fff;border-radius: .08rem;padding: .235rem;}
  h3 {font-size: .16rem;}
  p {line-height:.2rem;font-size: .13rem; color: #ccc;margin-bottom:.15rem;}
  button {width:2rem;height:.4rem;line-height:.4rem;background-color:#3364E4;color:#fff;font-size:.14rem;border-radius: .4rem;}
</style>