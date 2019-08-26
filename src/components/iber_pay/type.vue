<template>
  <div class="com-frame" style="padding-bottom:1rem;">
    <div class="com-scroll-y aux-bar">
      <section>
        <h2>港幣{{pay_data.total}}</h2>
        <h4>（人民幣 {{price}}）</h4>
        <p>1港幣 = {{pay_data.rate}}人民幣</p>
      </section>
      <h3>支付方式</h3>
      <ul>
        <li class="com-disx" v-for="(dx,index) in payList" v-if="dx.filter" :key="index" @click="selectPay(index)">
          <div style="width:.5rem;height:.5rem;background:#fff;border-radius: .08rem;">
            <i class="iconfont" v-html="dx.icon" style="font-size:.5rem;line-height:.5rem;" :style="dx.color"></i>
          </div>
          <div style="flex:1;flex-direction:column;justify-content: center;padding: .05rem .12rem;" class="com-disx">
            <h3>{{dx.label}}</h3>
            <p v-if="juage(dx.desc)">{{dx.desc}}</p>
          </div>
          <div style="width:.24rem;line-height:.5rem;">
            <span v-if="!juage(dx.desc)" class="mint-checkbox-core" :class="{'com-checkbox-active': dx.active}"></span>
            <span v-if="juage(dx.desc)" class="mint-checkbox-core" :class="{'com-checkbox-active': dx.active}"
              :style="{opacity: .2, 'background-color': 'rgba(0,0,0,.3)', border: '1px solid #eee'}"></span>
          </div>
        </li>
      </ul>
    </div>

    <button class="com-btn aux-btn com-button-action aux-abs-margin" type="button" @click="goPay">立即支付</button>
  </div>
</template>


<script>
  import cmn from './common.js';
  import FunctionJS from '@/components/shared/service/function.js';


  export default {
    name: "",
    data() {
      return {
        type: 0,
        price: null,
        totalPrice: null,
        pay_data: {},
        payType: [2, 1, 7],
        payList: [
          {
            icon: "&#xe67f;",
            color: { color: "#00CF0A" },
            label: "微信支付",
            desc: "",
            active: true,
            filter: true
          },
          {
            icon: "&#xe67e;",
            color: { color: "#00AAEE" },
            label: "支付寶",
            desc: "使用瀏覽器打開本頁面時可用",
            active: false,
            filter: true
          },
          {
            icon: "&#xe69b;",
            color: { color: "#FF7417" },
            label: "信用卡支付",
            desc: "使用瀏覽器打開本頁面時可用",
            active: false,
            filter: true
          }
        ],
        stripePay: null
      };
    },
    mounted() {
      this.$nextTick(() => {
        //二次转发  
        window.setTimeout(() => { cmn.run(); }, 1000);
        this.flush(); 
      });
    },
    created() {
      document.title = "確認支付";

      let query = this.$route.query;
      if (query.pay_data == undefined) {
        this.$toast("當前頁面參數異常");
      } 
      this.pay_data = JSON.parse(query.pay_data);

      let mobile_pre = this.pay_data.mobile_pre;
      this.pay_data.mobile_pre = mobile_pre.replace("+", "").replace(/\s/g, "");
      console.log(this.pay_data);

      this.type = this.payType[0];
      this.totalPrice = parseInt(this.pay_data.total.replace(",", "")) * 100;

      this.price = (
        parseInt(this.pay_data.total.replace(",", "")) * this.pay_data.rate
      ).toFixed(2);
    },
    methods: {
      flush() {
        let query = this.$route.query;
        if (this.judgeUrlKey(query, 'flush_share')) {
          return ;
        }
        window.location.href = window.location.href + "&flush_share=" + Date.now();
      }, 
      //删除对象字段
      deleteObjKey(obj, key) {
        let _obj = {};
        for (let i in obj) {
          if (i == key) {
            continue;
          }
          _obj[i] = obj[i];
        }
        return _obj;
      },
      //将对象转换为PATH
      exchangeUrlPath(obj) {
        let path = "";
        for (let i in obj) {
          path += i + "=" + obj[i] + "&";
        }
        return path.replace(/\&$/g, '');
      },
      //判断URL是否还有指定健
      judgeUrlKey(obj, key) {
        let state = false;
        for (let i in obj) {
          if (i == key) {
            state = true;
            break;
          }
        }
        return state;
      },
      initLoadPage() {
        let query = this.$route.query;
        let hasObject = false;
        let domain = window.location.href.replace(window.location.search, '');

        //刷新 
        if (!this.judgeUrlKey(query, 'iber_flush')) {
          query['iber_flush'] = Date.now();
          window.location.replace(domain + "?" + this.exchangeUrlPath(query));
        }
      },
      juage: function (content) {
        if (content == "") {
          return false;
        }
        if (plug.wx.platform) {
          return true;
        }
        return false;
      },
      selectPay: function (id) {
        if (plug.wx.platform) {
          return;
        }
        this.payList.forEach((value, index, array) => {
          value.active = false;
        });
        this.type = this.payType[id];
        this.payList[id].active = true;
      },
      goPay: function () {
        if (this.type == null) {
          this.$toast("請選擇支付方式");
          return;
        }
        if (this.pay_data.pay_id == undefined) {
          this.$toast("支付碼不能為空");
          return;
        }
        if (this.pay_data.buyer_name == undefined) {
          this.$toast("姓名不能為空");
          return;
        }
        if (this.pay_data.mobile_pre == undefined) {
          this.$toast("區號不能為空");
          return;
        }
        if (this.pay_data.mobile == undefined) {
          this.$toast("手機號不能為空");
          return;
        }
        if (this.pay_data.quantity == undefined) {
          this.$toast("數量不能為空");
          return;
        }
        this.$root.progress.layer = 1;
        this.$root.progress.info = "正在支付中";

        //信用卡支付
        if (this.type == 7) {
          if (this.totalPrice < 500) {
            this.$root.progress.layer = 0;
            this.$toast("小於HK$5.00的訂單不支持信用卡支付");
            return;
          }
          let self = this;
          //let key = "pk_test_4wh4W3HfrG8iiTxCWCGPTe48";
          let key = "pk_live_D8PlGf9MHnsR0ljdrzreeNhY";
          this.stripePay = StripeCheckout.configure({
            key: key,
            locale: "auto",
            token: function (token) {
              //正在支付中...
              self.$http
                .ajax({
                  path: "payment/code/out-pay",
                  type: "post",
                  data: {
                    pay_id: self.pay_data.pay_id,
                    buyer_name: self.pay_data.buyer_name,
                    mobile_pre: self.pay_data.mobile_pre,
                    mobile: self.pay_data.mobile,
                    quantity: self.pay_data.quantity,
                    type: self.type,
                    id: token.id,
                    email: token.email
                  },
                  authority: res => {
                    window.location.href = baseUrl + "/pay/login?t=" + Date.now();
                  },
                  intercept: () => {
                    self.$root.progress.layer = 0;
                  }
                })
                .then(res => {
                  //业务模型
                  console.log(res);
                  self.$root.progress.layer = 0;
                  self.$router.push({
                    path: "/pay/status",
                    query: {
                      order_uuid: res.data.order_uuid
                    }
                  });
                });
            }
          });

          window.setTimeout(() => {
            this.stripePay.open({
              name: "iBerPay金額",
              description: "訂單號：" + this.pay_data.pay_id,
              currency: "hkd",
              amount: this.totalPrice
            });
          }, 300);
          window.setTimeout(() => {
            this.$root.progress.layer = 0;
          }, 1500);
          return;
        }

        //微信与支付宝支付
        let payJSON = {
          pay_id: this.pay_data.pay_id,
          buyer_name: this.pay_data.buyer_name,
          mobile_pre: this.pay_data.mobile_pre,
          mobile: this.pay_data.mobile,
          quantity: this.pay_data.quantity,
          type: this.type
        };

        let goPay = (payConfig)=> {
          this.$http.ajax({
            path: "payment/code/out-pay",
            type: "post",
            data: payConfig,
            authority: res => {
              window.location.href = baseUrl + "/pay/login?t=" + Date.now();
            },
            intercept: () => {
              this.$root.progress.layer = 0;
            }
          }).then(res => {
            console.log(res);
            this.$root.progress.layer = 0;

            //支付宝支付
            if (this.type == 1) {
              this.aliPay(res);
              return;
            }
            this.wxPay(res);
          }); 
        }

        if (plug.wx.platform) {
          payJSON.openid = FunctionJS.getCookie('iBerPay_openId');
          goPay(payJSON);
          return ;
        }
        goPay(payJSON);  

      },
      aliPay(res) {
        this.$router.push({
          path: "/pay/transact",
          query: {
            type: 1,
            payUrl: encodeURIComponent(res.data.html)
          }
        });
      },
      wxPay(res) {
        if (this.type == 2 && plug.wx.platform) {
          //微信瀏覽器
          let self = this;
          let order_uuid = res.data.json.order_uuid;
          function onBridgeReady() {
            WeixinJSBridge.invoke(
              "getBrandWCPayRequest",
              {
                appId: res.data.json.appId,
                timeStamp: res.data.json.timeStamp,
                nonceStr: res.data.json.nonceStr,
                package: res.data.json.package,
                signType: res.data.json.signType,
                paySign: res.data.json.paySign
              },
              function (res) {
                self.$router.push({
                  path: "/pay/status",
                  query: {
                    order_uuid: order_uuid
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

        //外部浏览器
        let url = res.data.redirect;
        this.$router.push({
          path: "/pay/transact",
          query: {
            type: 0,
            payUrl: encodeURIComponent(url)
          }
        });
      }
    },
    beforeCreate() {
      if (!plug.wx.platform) {
        let stripe = "https://checkout.stripe.com/checkout.js";
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = stripe;
        document.body.appendChild(script);
      }
    }
  };
</script>
<style scoped>
  section {
    height: 1.8rem;
    background-image: linear-gradient(left top, #629df3 0%, #3364e4 100%);
    text-align: center;
    padding-top: 0.4rem;
    color: #fff;
  }

  section h2 {
    font-size: 0.3rem;
  }

  section h4 {
    font-size: 0.16rem;
    line-height: 0.4rem;
  }

  section p {
    font-size: 0.16rem;
    margin-top: 0.35rem;
  }

  div.com-scroll-y>h3 {
    margin-top: 0.35rem;
    color: #2a2a2a;
    font-size: 0.2rem;
    padding-left: 0.12rem;
  }

  ul {
    overflow: hidden;
    padding-right: 0.12rem;
    padding-left: 0.12rem;
  }

  ul>li {
    overflow: hidden;
    height: 0.8rem;
    border-bottom: 1px solid #ddd;
    padding-top: 0.15rem;
    padding-bottom: 0.15rem;
  }

  ul>li div {
    height: 100%;
  }

  ul>li div h3 {
    font-size: 0.16rem;
    font-weight: 400;
    color: #2a2a2a;
    line-height: 0.2rem;
  }

  ul>li div p {
    color: #999;
    font-size: 0.12rem;
  }

  ul>li div span {
    top: -2px;
  }
</style>