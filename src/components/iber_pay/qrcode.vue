<template>
  <div class="com-frame com-bg">
    <iframe :src="qrUrl" frameborder="0"></iframe>
  </div>
</template>


<script>
  import cmn from './common.js';


  export default {
    name: '',
    data () {
      return {
        qrUrl: null
      }
    }, 
    mounted: function () {
      this.$nextTick(() => {
        window.setTimeout(() => { cmn.run(); }, 1000);
      });
    },
    created () {
      document.title = "iBer支付二維碼";
      this.$root.pageLoading.layer = 1;

      this.qrUrl = decodeURIComponent(this.$route.query.qr_url);
      let url = decodeURIComponent(this.$route.query.url);
      window.setTimeout(()=> {
        this.$root.pageLoading.layer = 0;
      }, 200); 
    }
  }
</script>
<style scoped>
  iframe {width: 100%;height: 100%;}
</style>