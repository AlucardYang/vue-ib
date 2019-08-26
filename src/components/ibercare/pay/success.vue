<template>
  <div class="com-frame" style="background-color: #f6f6f6;">
    <div class="com-scroll-y aux-bar">
      <section>
        <i class="iconfonti">&#xe728;</i>
        <h3>{{plug.sm(simply, '支付成功')}}</h3>
        <h5>{{plug.sm(simply, '需等待审核通过才可前往消费')}}</h5>
        <p>{{plug.sm(simply, '我們會在1個工作日內完成審核')}}</p>
        <p>{{plug.sm(simply, '審核結果將以短信方式通知就診人')}}</p>
        <button @click="goOrderDetail" type="button" class="aux">{{plug.sm(simply, '查看订单')}}</button>
        <button @click="goProductDetail" type="button" class="aux">{{plug.sm(simply, '返回产品详情')}}</button>
      </section> 

      <dl class="aux">
        <dt>{{plug.sm(simply, '请务必查看以下预约事项')}}</dt>
        <dd>
          <p v-if="plug.valueValid(query.attention)">{{plug.sm(simply, '注意事项：')}}</p>
          <div style="margin-bottom:.16rem;"><pre v-html="query.attention"></pre></div>
          <p v-if="plug.valueValid(query.tips)">{{plug.sm(simply, '预约须知：')}}</p>
          <div><pre v-html="query.tips"></pre></div> 
        </dd>
      </dl>
    </div>



  </div>
</template>


<script>
  import cmn from "@/components/ibercare/common.js";

  //小程序环境
  let wxSdk = null;
  if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
    wxSdk = require('weixin-js-sdk');
  }

  export default {
    name: 'iBerCarePaySuccess',
    data() {
      return {
        query: {
          attention: "",
          tips: ""
        }
      }
    },
    created() { 
      document.title = plug.sm(this.simply, "支付成功");
      let query = this.$route.query;
      for (let i in query) {
        this.query[i] = query[i];
      }  
      if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
        this.query['page_back'] = query.page_back || "";
      }
      if (!plug.objectValue(this.query)) {
        this.$root.pageLoading.layer = 2;
        return;
      }
      this.getRootUserInfo().then((auth) => {
        this.c_user_uuid = auth.c_user_uuid;
        this.getOrderInfo();
      });
      
    },
    methods: {
      getOrderInfo() {
        this.$http.ajax({
          path: "/iber-care/pay-result",
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
          let query = res.data;
          for (let i in query) {
            this.query[i] = query[i];
          }

        });
      },
      goOrderDetail() {
        //小程序
        if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
          //订单详情-小程序支付  | "订单详情"按钮  直接触发返回极致
          if (this.query['page_back'] == 'page-order-detail') {
            wxSdk.miniProgram.navigateBack();
            return;
          }
          cmn.miniPagePath({
            object: this,
            type: 'redirectTo',
            route: "/pages/ibercare/orderdetail",
            path: "/iber-care/order-detail",
            title: plug.sm(this.simply, '订单详情'),
            keys: {page_back: 'product-list'},
            query: {
              user_uuid: this.query.user_uuid,
              care_order_uuid: this.query.care_order_uuid
            }
          });
          return;
        }
        if (this.inApp) {
          postMessage(JSON.stringify({
            type: "lookOrder",
            data: {
              path: "/iber-care/order-detail",
              user_uuid: this.query.user_uuid,
              care_order_uuid: this.query.care_order_uuid
            }
          }), '*');
          return;
        }
        this.$router.push({
          path: '/iber-care/order-detail',
          query: {
            user_uuid: this.query.user_uuid,
            care_order_uuid: this.query.care_order_uuid
          }
        });
      },
      goProductDetail() {
        //小程序
        if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
          //产品详情-报名预约-小程序支付  | "产品详情"按钮  直接触发返回极致
          if (this.query['page_back'] == 'page-reserve') {
            wxSdk.miniProgram.navigateBack();
            return;
          }
          if (this.query['page_back'] == 'page-order-list') {
            wxSdk.miniProgram.navigateBack({ delta: 2 });
            return;
          }
          if (this.query['page_back'] == 'page-order-detail') {
            wxSdk.miniProgram.navigateBack({ delta: 3 });
            return;
          }
          cmn.miniPagePath({
            object: this,
            route: "/pages/ibercare/productdetail",
            path: "/iber-care/product-detail",
            title: plug.sm(this.simply, '产品详情'),
            keys: {page_back: 'product-list'},
            query: {
              user_uuid: this.query.user_uuid,
              care_product_uuid: this.query.care_product_uuid
            }
          });
          return;
        }
        if (this.inApp) {
          postMessage(JSON.stringify({
            type: "careProductDetail",
            data: {
              path: "/iber-care/product-detail",
              user_uuid: this.query.user_uuid,
              care_product_uuid: this.query.care_product_uuid
            }
          }), '*');
          return;
        }
        this.$router.push({
          path: '/iber-care/product-detail',
          query: {
            user_uuid: this.query.user_uuid,
            care_product_uuid: this.query.care_product_uuid
          }
        });
      }
    }
  }
</script>

<style scoped>
  section {overflow:hidden;padding-top:.32rem;padding-bottom:.32rem;background-color: #fbfbfb;text-align:center;}
  section i {line-height:.67rem;font-size:.67rem;color:#04C511;}
  section h3 {margin-top:.16rem;margin-bottom:.08rem;height:.22rem;line-height:.22rem;font-size: .18rem;}
  section h5 {margin-bottom:.08rem;height:.17rem;line-height:.17rem;font-size: .14rem;}
  section p {height:.17rem;line-height:.17rem;font-size:.12rem;color:#999;}
  button {margin-top:.16rem;width:1.1rem;height:.32rem;border: 1px solid #bbb;border-radius: .32rem;background-color:transparent;font-size:.13rem;color:#999;}
  button:last-child {margin-left:.2rem;}
  button:active {opacity: .8;}

  dl {padding:.16rem;color:#666;}
  dl>dt {height:.2rem;line-height:.2rem;font-size: .16rem;}
  dl>dd {margin-top:.16rem;line-height:.23rem;font-size: .14rem;}
  dl>dd pre {margin: 0;white-space: pre-wrap;word-wrap: break-word;}
</style>