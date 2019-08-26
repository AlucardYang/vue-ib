<template>
  <div class="com-frame">
    <div class="com-frame" v-html="html"></div>
  </div>
</template>


<script>
  export default {
    name: '',
    data() {
      return {
        query: {},
        html: null
      }
    },
    created() {
      document.title = plug.sm(this.simply, '支付交易');
      this.query =  this.$route.query;

      if (!plug.objectValue(this.query)) {
        this.$root.pageLoading.layer = 2;
        return;
      }
      this.html = decodeURIComponent(this.query.html);
      //微信
      if (this.query.type == 0) {
        window.location.href = this.html;
        return ;
      }
      //支付寶  
      if (this.query.type == 1) {
        window.setTimeout(() => {
          document.forms['alipaysubmit'].submit();
        }, 500);

      }
    }
  }
</script>