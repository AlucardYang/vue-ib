/**
 *@iBerCare授权登录
  <com-ibercare-login v-model="iBerCareLogin" :params="iBerCareLogin" @change='login'></com-ibercare-login>
  import comIbercareLogin from "@/components/component/com_ibercare_login.vue";
  iBerCareLogin: {
    mobile_pre: '86',
    mobile: '12600001111'
  }
  components: {
    comIbercareLogin
  }
 */

<template>
  <dl v-if="value" class="com-mask-layer com-flexv">
    <dt></dt>
    <dd>
      <h3>{{plug.sm(simply, '驗證手機號碼')}}</h3>
      <p>{{altTxt}}</p>
      <div class="com-disx">
        <input class="aux aux-plhd" type="text" v-model='code' maxlength="4" :placeholder="plug.sm(simply, '請輸入驗證碼')">
        <em v-if="status == 0" @click="getCode" class="code">{{plug.sm(simply, '獲取驗證碼')}}</em>
        <em v-if="status == 1" class="time">{{time.count}}s</em>
        <em v-if="status == 2" @click="getCode" class="continue">{{plug.sm(simply, '重新獲取')}}</em>
      </div>
      <button @click="submit" class="aux ysun-btn-handle" type="button">{{plug.sm(simply, '确定')}}</button>
    </dd>
  </dl>
</template>


<script>
  export default {
    name: 'ibercare-login',
    data() {
      return {
        altTxt: "",
        status: 0,
        code: null,
        interval: null,
        time: {
          total: 60,
          count: null
        }
      }
    },
    props: {
      value: Boolean, 
      params: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    model: {
      prop: "value",
      event: "submit"   
    },
    created() { 
      this.altTxt = plug.sm(simply, '就診人的電話為+' + this.params.mobile_pre + ' ' + plug.phoneFormat(this.params.mobile) + '，請輸入此號碼收到的驗證碼。');
    },
    watch: {
      value(val) {
        this.altTxt = plug.sm(simply, '就診人的電話為+' + this.params.mobile_pre + ' ' + plug.phoneFormat(this.params.mobile) + '，請輸入此號碼收到的驗證碼。');
      }
    },
    methods: {
      submit() {
        if (this.code == null) {
          this.$toast(plug.sm(this.simply, "请输入验证码"));
          return ;
        }
        if (this.code.length != 4) {
          this.$toast(plug.sm(this.simply, "验证码格式错误"));
          return;
        }
        //提交
        this.$root.progress.layer = 1;

        this.$http.ajax({
          path: "/iber-care/verify-sms-code",
          type: "post", 
          data: {
            code: this.code,
            mobile_pre: this.params.mobile_pre,
            mobile: this.params.mobile
          },
          intercept: (msg)=> {
            if (plug.valueValid(msg)) {
              this.$toast(plug.sm(this.simply, msg));
            }
            this.$root.progress.layer = 0;
          }
        }).then((res) => {
          //业务模型 
          window.localStorage.setItem('care_verify_mobile', this.params.mobile);
          window.localStorage.setItem('care_verify_mobile_pre', this.params.mobile_pre.replace(/\+/, ''));
          window.localStorage.setItem('care_verify_code', this.code);

          this.$root.progress.layer = 0;

          this.$emit("submit", false);  
          this.$emit('change', {
            code: this.code,
            mobile_pre: this.params.mobile_pre,
            mobile: this.params.mobile
          }); 
        });
      },
      getCode() {
        this.$http.ajax({
          path: "/iber-care/care-sms-code",
          type: "post",
          data: { 
            type: 'IBERCARE_AUTH_CODE', 
            mobile_pre: this.params.mobile_pre,
            mobile: this.params.mobile
          },
          intercept: (msg) => {
            if (plug.valueValid(msg)) { 
              this.$toast(plug.sm(this.simply, msg));
            }
          }
        }).then((res) => {
          //业务模型 
          this.$toast(plug.sm(this.simply, '已发送验证码'));
          this.countdown();
        });
      },
      //倒计时
      countdown() {
        this.time.count = this.time.total;
        this.status = 1;

        this.interval = window.setInterval(() => {
          if (this.time.count <= 0) {
            window.clearInterval(this.interval);
            this.status = 2;
            return;
          } 
          this.time.count--;
        }, 1000);
      }
    }
  }
</script>

<style scoped>
  dl {background-color: #fff;}
  dl>dt {background-color: rgba(0, 0, 0, .4);}
  dl>dd {overflow:hidden;padding:.24rem;width:3.1rem;border-radius: .08rem;text-align: center;background-color: #fff;}
  dl>dd h3 {font-size: .18rem;color:#2A2A2A;}
  dl>dd p {margin-top:.24rem;margin-bottom:.16rem;line-height:.28rem;text-align: left;font-size: .14rem;color:#999;}
  dl>dd div {height:.44rem;line-height:.44rem;border-bottom:1px solid #E8E8E8;} 
  dl>dd div input {flex:1;overflow:hidden;font-size: .17rem;color:#2A2A2A;}
  dl>dd div em {top:.08rem;width:.84rem;height:.28rem;line-height:.28rem;border-radius: .28rem;}
  dl>dd div em:active {opacity: .8;}
  dl>dd div em.code {background-color: #3364E4;font-size: .12rem;color:#fff;}
  dl>dd div em.time {border:1px solid #999;font-size: .12rem;color:#999;}
  dl>dd div em.continue {border:1px solid #3364E4;font-size: .12rem;color:#3364E4;}
  dl>dd button {margin-top:.24rem;width:100%;height:.4rem;border-radius: .4rem;font-size: .15rem;}
</style>  