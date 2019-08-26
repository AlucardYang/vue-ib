<template>
  <div class="com-frame" style="background-color: #f6f6f6;">
    <div class="com-scroll-y aux-bar">
      <section>
        <i class="iconfonti">&#xe6d4;</i>
        <h3>{{plug.sm(simply, '支付失败')}}</h3>
        <button @click="goProductDetail" type="button" class="aux">{{plug.sm(simply, '返回产品详情')}}</button>
      </section> 

      <dl class="aux">
        <dt>{{plug.sm(simply, '请务必查看以下预约事项')}}！！！</dt>
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
    name: 'iBerCarePayFailed',
    data() {
      return {
        query: {
          attention: "",
          tips: ""
        }
      }
    },
    created() { 
      document.title = plug.sm(this.simply, "支付失敗");

      let query = this.$route.query;
      let links = this.urlParams;

      this.query.user_uuid = (query && query.user_uuid) ? query.user_uuid : links.user_uuid;
      this.query.care_order_uuid = (query && query.care_order_uuid) ? query.care_order_uuid : links.care_order_uuid;

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
          filter: (res)=> {
            res = res.data;

            //支付成功、支付失败
            if (res.code == 0 || res.code == 1000) {
              let query = res.data;
              for (let i in query) {
                this.query[i] = query[i];
              }
              return ;
            } 

            //支付异常
            let msg = res.msg;
            if (plug.valueValid(msg)) {
              this.$root.pageLoading.info = msg;
            }
            this.$root.pageLoading.layer = 2;
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
            wxSdk.miniProgram.navigateBack({delta: 2});
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
          return ;
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
  section i {line-height:.67rem;font-size:.67rem;color:#f00;}
  section h3 {margin-top:.16rem;height:.22rem;line-height:.22rem;font-size: .18rem;}
  button {margin-top:.16rem;width:1.1rem;height:.32rem;border: 1px solid #bbb;border-radius: .32rem;font-size:.13rem;background-color:transparent;color:#999;}
  button:active {opacity: .8;}

  dl {padding:.16rem;color:#666;}
  dl>dt {height:.2rem;line-height:.2rem;font-size: .16rem;}
  dl>dd {margin-top:.16rem;}
  dl>dd p {line-height:.23rem;font-size: .14rem;}
  dl>dd pre {margin: 0;white-space: pre-wrap;word-wrap: break-word;}
</style>