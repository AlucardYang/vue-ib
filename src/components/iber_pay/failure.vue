<template>
    <div class="com-frame">
      <div class="com-scroll-y aux-bar" style="padding-bottom:.3rem;">
        <i class="iconfont">&#xe776;</i>
        <h3>很遺憾，支付失敗</h3>
        <p>請聯繫服務顧問，諮詢詳情</p>
        <div>{{advisor_name}}: ({{advisor_mobile_pre}}) {{advisor_mobile}}</div>
      </div>
    </div>
  </template>
  
  
  <script>
    import cmn from './common.js';


    export default {
      name: '',
      data () {
        return { 
          advisor_name: "",
          advisor_mobile_pre: "",
          advisor_mobile: ""
        }
      },
      created () {
        document.title = "支付結果";
        
        if (this.$route.query.order_uuid == undefined) {
          this.$toast("訂單ID參數異常");
          return ;
        }
        this.$http.ajax({
          path: "payment/code/advisor",
          type: "get",
          data: {
            order_uuid: this.$route.query.order_uuid
          }
        }).then((res)=> {
          //业务模型 
          this.advisor_name = res.data.advisor_name;
          this.advisor_mobile_pre = res.data.advisor_mobile_pre;
          this.advisor_mobile = res.data.advisor_mobile;

          window.setTimeout(() => { cmn.run(); }, 1000);
        });

      },
      watch: {
  
      }
    }
  </script>
  <style scoped>
    .com-scroll-y {text-align:center;padding-top: .6rem;}
    i {font-size: .74rem;line-height: .74rem;color:#ddd;}
    h3 {margin-top:.16rem;font-size: .18rem;color: #2a2a2a;} 
    p {font-size: .13rem;color: #2a2a2a;}
    div.com-scroll-y div {display:inline-block;padding-left:.1rem;padding-right:.1rem;height:.5rem;line-height:.5rem;border:1px solid #ddd;margin-left: auto;margin-right:auto;border-radius: .1rem;font-size: .16rem;color:#2a2a2a;margin-top:.15rem;} 
  </style>