<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar" style="padding-bottom:.3rem;">
      <i class="iconfont">&#xe65f;</i>
      <h3>恭喜您，支付成功</h3>
      <div>訂單號: {{order_id}}</div>
    </div>
  </div>
</template>


<script>
  import cmn from './common.js';


  export default {
    name: '',
    data () {
      return {
        order_id: null
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        window.setTimeout(() => { cmn.run(); }, 1000);
      });
    },
    created () {
      document.title = "支付結果";
  
      if (this.$route.query.order_id == undefined) {
        this.$toast("訂單ID參數異常");
        return ;
      }
      this.order_id = this.$route.query.order_id;
    }
  }
</script>
<style scoped>
  .com-scroll-y {text-align:center;padding-top: .6rem;}
  i {font-size: .74rem;line-height: .74rem;color:#3364E4;}
  h3 {margin-top:.16rem;font-size: .18rem;color: #2a2a2a;} 
  p {font-size: .13rem;color: #2a2a2a;}
  div.com-scroll-y div {display:inline-block;padding-left:.1rem;padding-right:.1rem;height:.5rem;line-height:.5rem;border:1px solid #ddd;margin-left: auto;margin-right:auto;border-radius: .1rem;font-size: .16rem;color:#2a2a2a;margin-top:.15rem;} 
</style>