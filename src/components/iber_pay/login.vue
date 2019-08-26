<template>
  <div class="com-frame" style="padding-bottom:1rem;">
    <div class="com-scroll-y aux-bar">
      <i class="iconfont">&#xe62d;</i>
      <p>iBer Payment</p>
      <ul>
        <li>
          <input type="text" class="com-btn aux-btn" placeholder="郵箱" v-model.trim="account" value="">
        </li>
        <li>
          <input type="password" class="com-btn aux-btn" placeholder="密碼" v-model.trim="passowrd" @keyup.enter="login" value="">
        </li>
      </ul>
    </div>

    <button class="com-btn com-button-action aux-abs-margin" type="button" @click="login">登入</button>
  </div>
</template>


<script>
  import cmn from './common.js';


  export default {
    name: '',
    data () {
      return {
        account: "",
        passowrd: ""
      }
    },
    methods: {
      login: function() {
        let account = this.account.replace(/\s/g, ""); 
        let passowrd = this.passowrd.replace(/\s/g, ""); 

        if (account.length == 0) {
          this.$toast("請填寫郵箱");
          return ;
        }
        if (passowrd.length == 0) {
          this.$toast("請填寫密碼");
          return ;  
        } 

        //发起POST登录 
        this.$root.progress.layer = 1;
        this.$root.progress.info = "正在登入中";

        this.$http.ajax({
          path: "payment/center/login",
          type: "post",
          data: {
            email: this.account,
            password: this.passowrd
          },  
          intercept: (msg)=> {
            this.$root.progress.layer = 0;
            if (msg) {
              this.$toast(msg);
            }
          } 
        }).then((res)=> {
          //业务模型  
          this.$root.progress.layer = 0; 
          window.location.href = baseUrl + "/pay/perfect?t=" + Date.now();
        });
      }
    },  
    beforeRouteEnter(to, from, next) {
      window.setTimeout(() => { cmn.run(); }, 1000); 
      next(); 
    },
    created () {
      document.title = "iBerPay登入"; 
    }
  }
</script>
<style scoped>
  .com-scroll-y {text-align:center;padding-top: .4rem;}
  i {font-size: .74rem;line-height: .74rem;color:#3364E4;}
  p {font-size: .2rem;columns: #2a2a2a;margin-top:.2rem;}
  ul {overflow:hidden;margin-top:.35rem;padding-right:.25rem;padding-left:.25rem;}
  ul>li {overflow:hidden;height:.6rem;border-bottom:1px solid #ddd;}
  ul>li input {font-size:.18rem;height:100%;width:100%;color:#2a2a2a;}
  input::-webkit-input-placeholder {color:#ccc;}
</style>