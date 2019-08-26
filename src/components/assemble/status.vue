<template>
  <div class="com-frame iber-pay-status">
    <div class="com-scroll-y com-flex">
      <mt-spinner type="triple-bounce" class="triple-bounce"></mt-spinner>
      <p>正在支付(<span>{{time}}s</span>) ...</p>
    </div>


  </div>
</template>


<script>
  // import Vue from 'vue';
  import { Spinner } from 'mint-ui';
  // Vue.component(Spinner.name, Spinner);


  export default {
    name: 'AssembleStatus',
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
          path: "assemble/api/check-status",
          type: "get",
          data: {
            order_uuid: this.order_uuid
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