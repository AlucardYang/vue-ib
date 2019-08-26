<template>
  <div class="com-frame iber-pay-status">
    <div class="com-scroll-y aux-bar com-flex">
      <mt-spinner type="triple-bounce" class="triple-bounce"></mt-spinner>
      <p>正在支付(<span>{{time}}s</span>) ...</p>
    </div>


  </div>
</template>


<script>
  import cmn from './common.js';
  import { Spinner } from 'mint-ui';


  export default {
    name: '',
    data () {
      return {
        time: 10, 
        timeVal: 10,
        order_uuid: null
      }
    }, 
    components: {
      'mt-spinner': Spinner,
    },
    mounted: function () {
      this.$nextTick(() => {
        window.setTimeout(() => { cmn.run(); }, 1000);
      });
    },
    created () {
      document.title = "iBer Payment";

      if (this.$route.query.order_uuid == undefined) {
        this.$toast("訂單ID參數異常");
      } 
      this.order_uuid = this.$route.query.order_uuid;
      let count = 0;
      let interval = window.setInterval(()=> {
        count ++;
        if (this.time <= 0) {
          window.clearInterval(interval);
          this.$router.push({
            path: "/pay/failure",
            query: {
              order_uuid: this.order_uuid
            } 
          });  
          return ;
        }
        this.time = this.timeVal - count;  

        this.$http.ajax({
          path: "payment/code/check-status",
          type: "get",
          data: {
            order_uuid: this.order_uuid
          },
          authority: (res)=> {
            window.location.href = baseUrl + "/pay/login?t=" + Date.now();
          }, 
          filter: (res)=> {
            let order_id = res.data.data.order_id;
            if (res.data.data.status == 2) {
              window.clearInterval(interval);
              this.$router.push({   
                path: "/pay/success", 
                query: {
                  order_uuid: this.order_uuid,
                  order_id: order_id
                }
              });   
            }
          }
        });
      }, 1000);
    },
    watch: {

    }
  }
</script>
<style scoped>
  .com-scroll-y {flex-direction:column;}
  p {margin-top: .2rem;font-size:.16rem;}
</style>