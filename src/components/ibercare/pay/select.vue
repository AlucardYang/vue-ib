<template>
  <div class="com-frame" style="padding-bottom:.7rem;">
    <div class="com-scroll-y aux-bar">
      <section>
        <h3>{{plug.price(inApp, simply)}} {{calcNum(pay.reserve_fee)}}</h3>
        <h5>（{{plug.sm(simply, '人民幣')}} {{calcNum(pay.reserve_fee_cny)}}）</h5>
        <p>1{{plug.price(inApp, simply)}} = {{pay.exchange_rate}}{{plug.sm(simply, '人民幣')}}</p>
        <span>{{plug.sm(simply, '疫苗庫存有限，請盡快支付，還剩')}} {{changeInterval(pay.countdown)}}</span>
      </section>
      <p>{{plug.sm(simply, '支付方式')}}</p>
      <div class="pay">
        <ul class="aux" :class="{wx: !payList[1].valid}">
          <li class="com-flexv" v-for="(dx,index) in payList" v-if='dx.valid' @click="changePay(index)" :class="{focus: dx.state}" :key="index">
            <i class="iconfonti" :style="{color: dx.color}" v-html="dx.icon"></i>
            <p>{{dx.name}}</p> 
          </li>
        </ul>
      </div>
    </div>


    <button type='button' @click="goPay" class="aux ysun-btn-handle">{{plug.sm(simply, '立即支付')}}</button>
  </div>
</template>


<script>
  import cmn from "@/components/ibercare/common.js";
  import CommonJS from '@/components/shared/service/common.js';


  export default {
    name: '',
    data() {
      return {
        query: {},
        c_user_uuid: null,
        pay: {
          reserve_fee: null,
          exchange_rate: null,
          reserve_fee_cny: null,
          countdown: null
        },
        payList: [
          {name: '微信支付', type: 0, icon: '&#xe777;', color: '#00CF0A', state: false, valid: true},
          {name: plug.sm(this.simply, '支付寶'), type: 1, icon: '&#xe77a;', color: '#00AAEE', state: false, valid: true},
          {name: '信用卡支付', type: 2, icon: '&#xe696;', color: '#FF7417', state: false, valid: true}
        ],
        payType: null,
        share: {
          type: 'news',
          title: '',
          thumbImage: '',
          desc: '',
          isReport: false, // 分享上报，不上报可不传
          care_order_uuid: '',
          care_product_uuid: '',
          target_type: '61',
          router: window.location.pathname,
          url: ''
        }
      }
    },
    created() { 
      document.title = plug.sm(this.simply, "定金支付");

      this.query = this.$route.query;
      if (!plug.objectValue(this.query)) {
        this.$root.pageLoading.layer = 2;
        return;
      }
      if (plug.wx.platform) {
        this.payList[1].valid = false;
      }
      //Andorid系统-微信-隐藏
      if (plug.wx.platform && plug.android) {
        this.payList[2].valid = false;
      }
      this.getRootUserInfo().then((auth) => {
        if (plug.wx.platform && !plug.valueValid(auth.openid)) {
          //清除缓存, 重新授权
        }
        this.c_user_uuid = auth.c_user_uuid;
        this.getPayInfo();
      });

      this.initData();
    },
    methods: {
      initData() {
        if (plug.wx.platform) {
          this.payList[0].state = true;
          this.payType = this.payList[0].type;
        }
      },
      changePay(id) {
        this.payList.forEach((value, index) => {
          this.payList[index].state = false;
        });
        this.payList[id].state = true;
        this.payType = this.payList[id].type;
      },
      changeInterval(time) { 
        let hour = Math.floor(time / 3600);
        let minite = Math.floor((time % 3600) / 60);
        let second = (time % 3600) % 60;
        minite = minite > 9 ? minite : '0' + minite;
        second = second > 9 ? second : '0' + second;

        let input = hour + ':' + minite + ':' + second;
        return input;
      }, 
      calcNum(value) {
        return cmn.changeFormat(value);
      },
      getPayInfo() {
        this.$http.ajax({
          path: "iber-care/pay-info",
          type: "get",
          data: {
            in_app: this.inApp ? 1 : 0,
            user_uuid: this.query.user_uuid,
            c_user_uuid: this.c_user_uuid,
            care_order_uuid: this.query.care_order_uuid
          },
          intercept: (msg) => {
            if (plug.valueValid(msg)) {
              this.$root.pageLoading.info = msg;
            }
            this.$root.pageLoading.layer = 2;
          }
        }).then((res) => {
          //业务模型 
          for (let i in res.data.order) { 
            this.pay[i] = res.data.order[i];
          }

          if (this.pay.status != 'topay' || this.pay.countdown == 0) {
            return ;
          }

          // 设置分享信息
          this.share.title = res.data.share.title;
          this.share.thumbImage = res.data.share.thumbImage;
          this.share.desc = res.data.share.desc; 
          this.share.care_order_uuid = res.data.care_order_uuid;
          this.share.url = window.location.origin + window.location.pathname + '?user_uuid=' + this.query.user_uuid + "&care_order_uuid=" + this.query.care_order_uuid;

          // 微信分享初始化 
          CommonJS.initWX(this.share);

          let interval = null;
          let startInterval = ()=> {
            window.clearInterval(interval);
            this.pay.countdown = parseInt(this.pay.expire_time - this.pay.now_time);
            interval = window.setInterval(() => {
              if (this.pay.countdown <= 0) {
                window.clearInterval(interval);
                this.pay.countdown = 0; 
                this.pay.status = 'cancel';
                return; 
              }
              this.pay.countdown --;
            }, 1000); 
          }
          startInterval();
          
          cmn.toInterval(() => {
            console.log("从后台切换到前台");
            startInterval(); 
          }, () => {
            console.log("从前台切换到后台");
          });
        });
      },
      goPay() { 
        if (this.payType == null) {
          this.$toast(plug.sm(this.simply, '请选择支付类型'));
          return ;
        }

        if (this.inApp) {
          let typeString = "";
          if (this.payType == 0) {
            typeString = "wetChatPay";
          }
          if (this.payType == 1) {
            typeString = "aliPay";
          }
          if (this.payType == 2) {
            typeString = "StripePay";
          }
          postMessage(JSON.stringify({
            type: typeString,
            data: { 
              user_uuid: this.query.user_uuid,
              c_user_uuid: this.c_user_uuid,
              care_order_uuid: this.query.care_order_uuid,
              mobile_pre: this.query.mobile_pre,
              mobile: this.query.mobile 
            }
          }), '*');
          return ;
        }

        //信用卡支付
        if (this.payType == 2) {
          let price = this.price * 100;
          if (price < 500) {
            this.$toast(plug.sm(this.simply, '小於HK$5.00的訂單不支持信用卡支付'));
            return;
          }
          this.$root.progress.info = plug.sm(this.simply, '正在支付中');
          this.$root.progress.layer = 1;

          if (typeof StripeCheckout == 'undefined') {
            let limit = 15;
            let count = 0;
            let interval = window.setInterval(()=> {
              if (count > limit) {
                window.clearInterval(interval);
                this.$root.progress.layer = 0;
                this.$toast(plug.sm(this.simply, '信用卡环境加载超时')); 
                return ; 
              }
              if (typeof StripeCheckout != 'undefined') {
                window.clearInterval(interval);
                this.$root.progress.layer = 0;
                this.stripePay();
                return ;
              }
              count += 0.5;
            }, 500);
            return; 
          }
          this.stripePay();
          return ;
        }

        this.$root.progress.info = plug.sm(this.simply, '正在支付中');
        this.$root.progress.layer = 1;

        let pay_type = null;
        let openid = null;
        if (this.payType == 0) {
          if (plug.wx.platform) {
            pay_type = 1;   
          } else {
            pay_type = 4;
          } 
        }     
        if (this.payType == 1) {
          pay_type = 2;
        }

        let payJSON = {
          type: pay_type, 
          user_uuid: this.query.user_uuid,
          c_user_uuid: this.c_user_uuid,
          care_order_uuid: this.query.care_order_uuid,
          language: this.lang
        }

        let goPay = (payData)=> {
          this.$http.ajax({
            path: "/iber-care/go-pay",
            type: "post",
            data: payData,
            intercept: (msg) => {
              if (plug.valueValid(msg)) {
                this.$toast(msg);
              }
              this.$root.progress.layer = 0;
            }
          }).then((res) => {
            //业务模型
            this.$root.progress.layer = 0;
            //微信支付
            if (this.payType == 0) {
              this.wxPay(res);
              return;
            }
            //支付宝支付
            if (this.payType == 1) {
              this.aliPay(res);
            }
          });
        }

        if (plug.wx.platform) {
          this.getRootUserInfo().then((res) => {
            payJSON.openid = res.openid;
            if (!plug.valueValid(payJSON.openid)) {
              this.$toast(plug.sm(simply, 'openid不能为空'));
              return ;
            }
            goPay(payJSON);
          }); 
          return ;
        } 
        goPay(payJSON); 
    
      }, 
      aliPay(res) {
        this.$router.push({
          path: "/iber-care/pay-container",
          query: {
            type: 1,
            html: encodeURIComponent(res.data.html)
          } 
        });
      },
      wxPay(res) {
        console.log("微信浏览器提交数据: " + JSON.stringify(res));
        //微信浏览器
        let self = this;
        if (plug.wx.platform) {
          function onBridgeReady() {
            WeixinJSBridge.invoke("getBrandWCPayRequest", {
              appId: res.data.json.appId,
              timeStamp: res.data.json.timeStamp,
              nonceStr: res.data.json.nonceStr,
              package: res.data.json.package,
              signType: res.data.json.signType,
              paySign: res.data.json.paySign
            }, function(res) {
              console.log("微信浏览器支付结果: " + JSON.stringify(res));
              self.$router.push({
                path: "/iber-care/pay-status",
                query: {
                  user_uuid: self.query.user_uuid,
                  c_user_uuid: self.c_user_uuid,
                  care_order_uuid: self.query.care_order_uuid,
                  mobile_pre: self.query.mobile_pre,
                  mobile: self.query.mobile,
                  language: this.lang
                }
              });
              }
            );
          }
          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener(
                "WeixinJSBridgeReady",
                onBridgeReady,
                false
              );
            } else if (document.attachEvent) {
              document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
              document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
            }
          } else {
            onBridgeReady();
          }
          return;
        }
        //其他浏览器
        this.$router.push({
          path: "/iber-care/pay-container",
          query: { 
            type: 0, 
            html: encodeURIComponent(res.data.redirect)
          }
        });
      },
      stripePay() {
        //let key = "pk_test_4wh4W3HfrG8iiTxCWCGPTe48";  //测试KEY
        let key = "pk_live_D8PlGf9MHnsR0ljdrzreeNhY";

        let stripePay = StripeCheckout.configure({
          key: key,
          locale: "auto",
          token: (token)=> {
            this.$http.ajax({
              path: "/iber-care/stripe-pay",
              type: "post",
              data: {
                type: 3,
                user_uuid: this.query.user_uuid,
                c_user_uuid: this.c_user_uuid,
                care_order_uuid: this.query.care_order_uuid,
                id: token.id,
                email: token.email
              },
              intercept: (msg)=> {
                this.$root.progress.layer = 0;
                if (plug.valueValid(msg)) {
                  this.$toast(msg);
                }
              }
            }).then((res)=> {
              //业务模型
              this.$root.progress.layer = 0;
              this.$router.push({
                path: "/iber-care/pay-status",
                query: {
                  user_uuid: this.query.user_uuid,
                  c_user_uuid: this.c_user_uuid,
                  care_order_uuid: this.query.care_order_uuid,
                  mobile_pre: this.query.mobile_pre,
                  mobile: this.query.mobile,
                  language: this.lang
                }
              });
            });
          }
        });

        window.setTimeout(() => {
          stripePay.open({
            name: plug.sm(this.simply, 'iBerPay定金'),
            description: plug.sm(this.simply, '港币') + "：" + this.pay.reserve_fee,
            currency: "hkd",
            amount: this.price
          });
        }, 300);
        window.setTimeout(() => {
          this.$root.progress.layer = 0;
        }, 1500);
      }
    }, 
    beforeCreate() {
      let stripe = "https://checkout.stripe.com/checkout.js";
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = stripe;
      document.body.appendChild(script);
    }
  }
</script>

<style scoped>
  section {padding-top: .3rem;height:2rem;background-image: linear-gradient(270deg, #4C7FFF 0%, #3863FF 100%);text-align:center;color:#fff;}
  section h3 {margin-bottom:.05rem;height:.36rem;line-height:.36rem;font-size:.3rem;}
  section h5 {height:.2rem;line-height:.2rem;font-size:.16rem;}
  section p {margin-top:.4rem;margin-bottom:.06rem;height:.2rem;line-height:.2rem;font-size:.16rem;}
  section span {height:.2rem;line-height:.2rem;font-size:.12rem;}
  section ~ p {margin-top:.34rem;margin-bottom:.3rem;padding-left:.12rem;height:.2rem;line-height:.2rem;font-size: .16rem;color:#2a2a2a;}
  div.pay {text-align:center;}
  ul {display:inline-block;}
  ul.wx {padding-left:.1rem;width:100%;} 
  ul>li {float:left;margin-left:.1rem;width:1.1rem;height:1.1rem;border:1px solid #ddd;border-radius: .08rem;text-align:center;}
  ul>li:first-child {margin-left:0;}
  ul>li.focus {border:1px solid #5484ff;}
  ul>li i {line-height:.4rem;font-size: .4rem;}
  ul>li p {height:.3rem;line-height:.3rem;font-size: .14rem;color:#2a2a2a;}

  button {position: absolute;bottom:.1rem;left:.125rem;width:3.5rem;height:.5rem;border-radius: .08rem;font-size:.17rem;}
</style>