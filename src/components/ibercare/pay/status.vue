<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar status">
      <img src="https://static.iberhk.com/v2/web/images/iber_care/loading.gif">
      <p>{{plug.sm(simply, '正在支付')}}（<span>{{count}}</span>s）…</p>
    </div>
  </div>
</template>


<script>
  import cmn from "@/components/ibercare/common.js";


  export default {
    name: '',
    data() {
      return {
        query: {},
        c_user_uuid: null,
        second: 10,
        count: null,
        interval: null
      }
    },
    created() { 
      document.title = plug.sm(this.simply, "定金支付");

      let query = this.$route.query;
      let links = this.urlParams;

      this.query.user_uuid = (query && query.user_uuid) ? query.user_uuid : links.user_uuid;
      this.query.care_order_uuid = (query && query.care_order_uuid) ? query.care_order_uuid : links.care_order_uuid;
      console.log(query && query.mobile_pre);

      if (!plug.objectValue(this.query)) { 
        this.$root.pageLoading.layer = 2;
        return;
      }
      this.getRootUserInfo().then((auth) => {
        this.c_user_uuid = auth.c_user_uuid;
        if (!this.inApp) {
          this.calculate();
        } 
      });
    },
    beforeRouteLeave(to, from, next) {
      window.clearInterval(this.interval);
      next(true);
    }, 
    mounted() {
      this.$nextTick(()=> {
        if (this.inApp) {
          this.calculate();
        }
      });
    },
    methods: {
      calculate() {
        this.count = this.second;

        this.interval = window.setInterval(()=> {
          if (this.count <= 0) {
            window.clearInterval(this.interval);   
            //小程序
            if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
              cmn.miniPagePath({
                object: this,
                type: 'redirectTo',
                route: "/pages/ibercare/failed",
                path: "/iber-care/pay-failed",
                title: plug.sm(this.simply, '支付失败'),
                query: {
                  user_uuid: this.query.user_uuid,
                  care_order_uuid: this.query.care_order_uuid,
                  language: this.lang
                }
              });
              return;
            }
            this.$router.push({
              path: '/iber-care/pay-failed',
              query: {
                user_uuid: this.query.user_uuid,
                care_order_uuid: this.query.care_order_uuid,
                language: this.lang
              }
            });
            return ;
          }
          this.checkStatus();
          this.count--;
        }, 1000);
      },
      checkStatus() {
        let reqData = {
          in_app: this.inApp ? 1 : 0,
          user_uuid: this.query.user_uuid,
          c_user_uuid: this.c_user_uuid,
          care_order_uuid: this.query.care_order_uuid
        };
        this.$http.ajax({
          path: "/iber-care/pay-result",
          type: "get",
          data: reqData,
          err() {return ;} 
        }).then((res) => {
          this.query.order_url = res.data.order_url;
          //this.query.product_list_url = res.data.product_list_url;
          //业务模型
          window.clearInterval(this.interval);
          if (res.data.status == 'verifying') {
            //小程序
            if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
              cmn.miniPagePath({
                object: this,
                type: 'redirectTo',
                route: "/pages/ibercare/success",
                path: "/iber-care/pay-success",
                title: plug.sm(this.simply, '支付成功'),
                query: {
                  user_uuid: this.query.user_uuid,
                  care_order_uuid: this.query.care_order_uuid,
                  language: this.lang
                }
              });
              return;
            }
            this.$router.push({
              path: '/iber-care/pay-success',
              query: { 
                user_uuid: this.query.user_uuid,
                care_order_uuid: this.query.care_order_uuid,
                language: this.lang
              }
            }); 
            return ;
          }
          //小程序
          if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
            cmn.miniPagePath({
              object: this,
              type: 'redirectTo',
              route: "/pages/ibercare/failed",
              path: "/iber-care/pay-failed",
              title: plug.sm(this.simply, '支付失败'),
              query: {
                user_uuid: this.query.user_uuid,
                care_order_uuid: this.query.care_order_uuid,
                language: this.lang
              }
            });
            return;
          }
          this.$router.push({
            path: '/iber-care/pay-failed',
            query: {
              user_uuid: this.query.user_uuid,
              care_order_uuid: this.query.care_order_uuid,
              language: this.lang
            } 
          });

        });
      }
    }
  }
</script>

<style scoped>
  div.status {padding-top: 1.6rem;text-align: center;background-color: #fff;}
  img {margin-bottom:.2rem;width:.8rem;}
  p {text-align: center;font-size: .16rem;color:#2a2a2a;}
</style>