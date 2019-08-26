<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar" style="padding-bottom:.15rem;">
      <div class="goods"><img v-loading :src="goodsInfo.img" alt=""></div>
      <dl class="aux profile">
        <dt class="com-nowrap">
          <span>{{goodsInfo.spend_score}}<label v-if="simply">积分</label><label v-else>積分</label></span>
          <label v-if="simply">剩余：{{goodsInfo.surplus_stock}}</label><label v-else>剩餘：{{goodsInfo.surplus_stock}}</label>
        </dt>
        <dd>
          <h3>{{goodsInfo.goods_name}}</h3>
          <p>{{goodsInfo.introduction}}</p>
        </dd> 
      </dl>
      <div class="detail-line"><div><label v-if="simply">商品详情</label><label v-else>商品詳情</label></div></div>
      <div class="detail">
        <img v-for="(dx,index) in goodsInfo.details" v-loading :src="dx.detail_img" alt="">
      </div>
    </div>


  </div>
</template>


<script>
  export default {
    name: '',
    data () {
      return {
        prize_id: null,
        user_uuid: null,
        goodsInfo: {}
      }
    },
    created () {
      document.title = this.simply ? "商品详情" : "商品詳情";
      this.$root.pageLoading.layer = 1;
      let query = this.$route.query;

      if (!plug.valueValid(this.urlParams)) {
        if (!plug.valueValid(query) || !plug.valueValid(query.prize_uuid)) {
          this.postData();
          this.$root.pageLoading.layer = 2;
          return; 
        } 
        this.user_uuid = query.user_uuid;
        this.prize_id = query.prize_uuid;
      } else {   
        if (!plug.valueValid(this.urlParams.prize_uuid)) {
          this.postData();
          this.$root.pageLoading.layer = 2;
          return; 
        } 
        this.user_uuid = this.urlParams.user_uuid; 
        this.prize_id = this.urlParams.prize_uuid; 
      } 

      this.getGooodsInfo();
    },
    methods: {
      postData: function() {
        console.log("Error");
        window.setTimeout(() => {
          postMessage(JSON.stringify({
            type: 'app_goodsDetail_state',
            data: {
              state: "failed" 
            }
          }), '*');
        }, 500);
      },
      getGooodsInfo: function() {
        this.$http.ajax({
          path: "grow-center/goods-detail",
          type: "get",
          data: {
            user_uuid: this.user_uuid,
            prize_id: this.prize_id 
          },
          intercept: (msg) => {
            this.postData();
            this.$root.pageLoading.layer = 2;
            this.$root.pageLoading.info = msg;
          },
          err: () => { this.postData(); this.$root.pageLoading.layer = 2; }
        }).then((res) => {
          //业务模型 
          this.goodsInfo = res.data;  
          
          this.$root.pageLoading.layer = 0;
          window.setTimeout(() => {
            postMessage(JSON.stringify({
              type: 'app_goodsDetail_state',
              data: {
                state: "success"
              }
            }), '*');
          }, 500);
        });
      }
    }
  }
</script>
<style scoped>
  div.goods {width:100%;height:0;padding-bottom:100%;}
  div.goods img {position: absolute;top:0;left:0;width:100%;height:100%;}

  dl.profile {margin-top: .1rem;margin-bottom:.15rem;padding-right:.15rem;padding-left:.15rem;}
  dl.profile>dt {height:.22rem;line-height:.22rem;}
  dl.profile>dt span {font-weight:600;font-size:.18rem;color:#e3c587;}
  dl.profile>dt>label {float:right;font-size: .13rem;color:#999;}
  dl.profile>dd {margin-top:.15rem;}
  dl.profile>dd h3 {line-height:.24rem;font-size: .2rem;color:333;}
  dl.profile>dd p {margin-top:.05rem;line-height:.2rem;font-size: .13rem;color:#333;}

  div.detail-line {padding-right:.15rem;padding-left:.15rem;height:.5rem;line-height:.5rem;text-align:center;font-size:.13rem;color:#999;}
  div.detail-line label {padding-right:.1rem;padding-left:.1rem;background-color:#fff;}
  div.detail-line>div::before {content:"";position: absolute;top: 50%;left:0;width:100%;height:1px;background-color:#e8e8e8;}
  
  div.detail {overflow:hidden;width:100%;}
  div.detail img {display:block;width:100%;}
</style>