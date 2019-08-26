<template>
  <div class="com-frame">
    <div class="com-frame" v-html="url"></div>
  </div>
</template>


<script>
  import cmn from './common.js';


  export default {
    name: '',
    data () {
      return {
        type: null,
        data: null,
        url: null
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        window.setTimeout(() => { cmn.run(); }, 1000);
      });
    },
    created () {
      document.title = "支付交易";  

      this.type = this.$route.query.type;
      this.data = decodeURIComponent(this.$route.query.payUrl);
      //微信
      if (this.type == 0) { 
        window.location.href = this.data;
      }   

      //支付寶  
      if (this.type == 1) {
        this.url = this.data;
        window.setTimeout(()=> {
          document.forms['alipaysubmit'].submit();
        }, 500);
        
      }  
    }
  }
</script>
<style scoped>
</style>