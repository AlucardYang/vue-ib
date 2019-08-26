<template>
  <div class="com-frame" style="background-color:#f6f6f6;">
    <div class="com-scroll-y aux-bar">
      <!-- 订单列表入口 -->
      <care-order-list-enter :c-user-uuid="rootUserInfo['c_user_uuid']"></care-order-list-enter>
      <header>
        <div class="banner" :class="'banner-' + detail.status">
          <div v-if="detail.status == 'topay'" class="state">
            <h3><i class="iconfonti">&#xe67a;</i>{{plug.sm(simply, '待支付')}}<em style="float:right;">{{plug.smft(simply, '剩余', '剩餘')}}：{{changeInterval(detail.countdown)}}</em></h3>
            <p>{{plug.sm(simply, '預約库存有限，请尽快付款')}}</p>
            <p v-if='inApp'>{{plug.sm(simply, '支持分享给客户，输入授权手机号可进入支付页面')}}</p>
          </div>
          <div v-if="detail.status == 'verifying'" class="state">
            <h3><i class="iconfonti">&#xe67a;</i>{{plug.sm(simply, '待审核')}}</h3>
            <p>{{plug.sm(simply, '我們會在1個工作日內完成審核')}}</p>
          </div>
          <div v-if="detail.status == 'unconsumed'" class="state">
            <h3><i class="iconfonti">&#xe683;</i>{{plug.sm(simply, '審核通過，待消费')}}</h3>
            <p>{{plug.sm(simply, '预约已经通过审核')}}</p>
            <p>{{plug.sm(simply, '请就診人在预约的时间到店就诊')}}</p>
          </div>
          <div v-if="detail.status == 'consumed'" class="state">
            <h3><i class="iconfonti">&#xe683;</i>{{plug.sm(simply, plug.apphshow(inApp, '客户已消费', '已消费'))}}</h3>
            <p v-if="inApp">iBer Coin {{plug.sm(simply, '將每個月結算至您')}}{{plug.smft(simply, '设置', '設定')}}{{plug.sm(simply, '的指定賬戶')}}</p>
          </div>
          <div v-if="detail.status == 'refunding'" class="state">
            <h3><i class="iconfonti">&#xe682;</i>{{plug.sm(simply, '退款中')}}</h3>
            <p>{{plug.sm(simply, '正在退款，定金将原路返還，请稍等')}}</p>
          </div>
          <div v-if="detail.status == 'cancel'" class="state">
            <h3><i class="iconfonti">&#xe684;</i>{{plug.sm(simply, '已取消')}}</h3>
            <p v-if="detail.identify == 4 || detail.is_oss_cancel == 1">{{plug.sm(simply, '您的訂單被系統取消，定金會在3個工作日內原路返還')}}</p>
            <p v-else>{{plug.sm(simply, '支付时间超时，订单已自动取消，请重新下单预约')}}</p>
          </div>
          <div v-if="detail.status == 'expire'" class="state">
            <h3><i class="iconfonti">&#xe684;</i>{{plug.sm(simply, '已过期')}}</h3>
            <p>{{plug.sm(simply, '就診人未按照預約時間前往消費，訂單已过期')}}</p>
          </div>
          <div v-if="detail.status == 'refunded'" class="state">
            <h3><i class="iconfonti">&#xe683;</i>{{plug.sm(simply, '已退款')}}</h3> 
            <p>{{plug.sm(simply, '请注意，支付的定金已按原路返还')}}</p>
          </div>
        </div>
      </header>
      <div class="com-marlt card">
        <div @click="goProductDetail" class="com-disx" :style="setBgSize(detail.banner_url)">
          <div class="product-show" :src="detail.banner_url" :style="{'background-image': 'url(' + detail.banner_url + '?x-oss-process=image/resize,w_200' + ')', 'background-size': detail.banner_size}"></div>
          <div class="info"> 
            <h3><i v-if="detail.pro" class="iconfonti">&#xe662;</i>{{detail.title}}</h3>
            <div v-if="detail.status == 'consumed'">
              <p class="money">{{plug.price(inApp, simply)}} {{calcNum(detail.price)}} <span>({{plug.sm(simply, '已付定金')}} {{plug.price(inApp, simply)}} {{calcNum(detail.deposited)}})</span></p>
              <p class="pay">{{plug.sm(simply, '到店实际支付')}} {{plug.price(inApp, simply)}} {{calcNum(detail.shop_price)}}</p>
            </div>
            <div v-if="detail.status == 'unconsumed'">
              <p class="money">{{plug.price(inApp, simply)}} {{calcNum(detail.price)}} <span>({{plug.sm(simply, '已付定金')}}{{plug.price(inApp, simply)}} {{calcNum(detail.deposited)}})</span></p>
              <p class="pay">{{plug.sm(simply, '到店預計支付')}} {{plug.price(inApp, simply)}} {{calcNum(detail.shop_price)}}</p>
            </div>
            <div v-if="detail.status == 'verifying' || detail.status == 'expire'">
              <p class="money">{{plug.price(inApp, simply)}} {{calcNum(detail.price)}}</p>
              <p class="pay">{{plug.sm(simply, '预约定金')}} {{plug.price(inApp, simply)}} {{calcNum(detail.deposit)}}<span>（{{plug.sm(simply, '已支付')}}）</span></p> 
            </div>
            <div v-if="detail.status == 'refunding'">
              <p class="money">{{plug.price(inApp, simply)}} {{calcNum(detail.price)}}</p>
              <p class="pay">{{plug.sm(simply, '预约定金')}} {{plug.price(inApp, simply)}} {{calcNum(detail.deposit)}}<span>（{{plug.sm(simply, '退款中')}}）</span></p>
            </div>
            <div v-if="detail.status == 'refunded'">
              <p class="money">{{plug.price(inApp, simply)}} {{calcNum(detail.price)}}</p>
              <p class="pay">{{plug.sm(simply, '预约定金')}} {{plug.price(inApp, simply)}} {{calcNum(detail.deposit)}}<span style="color:#FF3B23;">（{{plug.sm(simply, '原路返還')}}）</span></p>
            </div>
            <div v-if="detail.status == 'topay' || detail.status == 'cancel'">
              <p class="money">{{plug.price(inApp, simply)}} {{calcNum(detail.price)}}</p>
              <p class="pay">{{plug.sm(simply, '预约定金')}} {{plug.price(inApp, simply)}} {{calcNum(detail.deposit)}}</p>
            </div>
          </div>
        </div>
      </div>
      <section class="com-marlt" style="overflow:hidden;padding-bottom:.05rem;">
        <dl v-if="detail.consume && (detail.consume.length > 0)" class="aux com-marlt">
          <dt>{{plug.sm(simply, '其他消费')}}</dt>
          <dd class="consume">
            <p v-for="(dx,index) in detail.consume">{{dx.title}}（{{plug.apphshow(inApp, 'Coin')}} {{plug.price(inApp, simply)}} {{calcNum(dx.price)}}）</p> 
          </dd>
        </dl> 
        <dl v-if="detail.status == 'topay'" class="aux" style="padding:.12rem;line-height:.2rem;font-size:.14rem;color:#FF3B23;letter-spacing:0;">{{plug.sm(simply, '支付定金後，需等待訂單審核通過才可前往門店消費')}}</dl>
        <dl v-if="detail.status == 'verifying'" class="aux" style="padding:.12rem;line-height:.2rem;font-size:.14rem;color:#FF3B23;letter-spacing:0;">
          {{plug.sm(simply, '就診人需等待訂單審核通過才可前往門店消費')}}</dl>
        <dl class="aux com-marlt">
          <dt>{{plug.sm(simply, '预约信息')}}</dt>
          <dd class="tb appointment" style="padding-bottom:0;">
            <p class="com-disx "><label>{{plug.sm(simply, '就诊人姓名')}}：</label><span class="com-wrap">{{detail.appoint.name}}</span></p>
            <p v-if="detail.appoint.age" class="com-disx "><label>{{plug.sm(simply, '就诊人年龄')}}：</label><span class="com-wrap">{{detail.appoint.age}}</span></p>
            <p class="com-disx">
              <label>{{plug.sm(simply, '就诊人电话')}}：</label>
              <span v-if="inApp">+{{detail.appoint.mobile_pre}} {{detail.appoint.mobile}}<i @click="call" class="iconfonti" style="margin-left:.1rem;font-size: .15rem;color:#3364E4;">&#xe624;</i></span> 
              <span v-else>+{{detail.appoint.mobile_pre}} {{plug.phoneFormat(detail.appoint.mobile)}}</span>
            </p>
            <p class="com-disx "><label>{{plug.sm(simply, '預約时间')}}：</label><span>{{detail.appoint.time}}</span></p>
            <p class="com-disx "><label>{{plug.sm(simply, '預約門店')}}：</label><span>{{detail.appoint.shop}}</span></p>
            <p class="com-disx "><label>{{plug.sm(simply, '門店地址')}}：</label><span>{{detail.appoint.address}}</span></p>
            <div v-for="(dx, index) in detail.appoint.extra"> 
              <p v-if="dx.type == 'text'" class="com-disx"><label>{{dx.name}}：</label><span>{{dx.value}}</span></p>
              <p v-if="dx.type == 'image' && dx.value.length > 0" class="com-disx" style="padding-bottom:0;"><label>{{dx.name}}：</label><span></span></p>
              <div v-if="dx.type == 'image' && dx.value.length > 0" style="margin-top:.12rem;">
                <div v-for="(idx, index) in dx.value" :key="index" @click="openAlbum(dx.value, index)" class="portrait" :style="{'background-image': 'url(' + idx + '?x-oss-process=image/resize,w_200)', 'background-size': dx.size[index]}"></div> 
              </div> 
              <p v-if="dx.type == 'textarea'" class="com-disx" style="padding-bottom:0;"><label>{{dx.name}}：</label><span></span></p>
              <div v-if="dx.type == 'textarea'" style="margin-top:.06rem;padding-bottom:.12rem;line-height:.23rem;" v-html="dx.value"></div>
            </div> 
          </dd>
        </dl>
        <dl class="aux com-marlt">
          <dt>{{plug.sm(simply, '订单信息')}}</dt>
          <!--待支付--><!--已取消-->
          <dd v-if="detail.status == 'topay' || detail.status == 'cancel'" class="info">
            <p class="com-disx"><label>{{plug.sm(simply, '订单编号')}}：</label><span>{{detail.id}}</span></p>
            <p class="com-disx"><label>{{plug.sm(simply, '下单时间')}}：</label><span>{{detail.time}}</span></p>
          </dd>
          <!--待審核--><!--待消費--><!--已过期-->
          <dd v-if="detail.status == 'verifying' || detail.status == 'unconsumed' || detail.status == 'expire'" class="info">
            <p class="com-disx"><label>{{plug.sm(simply, '订单编号')}}：</label><span>{{detail.id}}</span></p>
            <p class="com-disx"><label>{{plug.sm(simply, '下单时间')}}：</label><span>{{detail.time}}</span></p>
            <p v-if="detail.pay_time != '0000-00-00 00:00:00'" class="com-disx"><label>{{plug.sm(simply, '支付时间')}}：</label><span>{{detail.pay_time}}</span></p>
          </dd>
          <!--退款中-->
          <dd v-if="detail.status == 'refunding'" class="info">
            <p class="com-disx"><label>{{plug.sm(simply, '订单编号')}}：</label><span>{{detail.id}}</span></p>
            <p class="com-disx"><label>{{plug.sm(simply, '下单时间')}}：</label><span>{{detail.time}}</span></p>
            <p v-if="detail.pay_time != '0000-00-00 00:00:00' && detail.identify != 4" class="com-disx"><label>{{plug.sm(simply, '支付时间')}}：</label><span>{{detail.pay_time}}</span></p>
          </dd>
          <!--已消費-->
          <dd v-if="detail.status == 'consumed'" class="info">
            <p class="com-disx"><label>{{plug.sm(simply, '订单编号')}}：</label><span>{{detail.id}}</span></p>
            <p class="com-disx"><label>{{plug.sm(simply, '下单时间')}}：</label><span>{{detail.time}}</span></p>
            <p v-if="detail.pay_time != '0000-00-00 00:00:00' && detail.identify != 4" class="com-disx">
              <label>{{plug.sm(simply, '支付时间')}}：</label><span>{{detail.pay_time}}</span></p>
            <p class="com-disx"><label>{{plug.sm(simply, '消费时间')}}：</label><span>{{detail.consume_time}}</span></p>
          </dd>
          <!--已退款-->
          <dd v-if="detail.status == 'refunded'" class="info">
            <p class="com-disx"><label>{{plug.sm(simply, '订单编号')}}：</label><span>{{detail.id}}</span></p>
            <p class="com-disx"><label>{{plug.sm(simply, '下单时间')}}：</label><span>{{detail.time}}</span></p>
            <p v-if="detail.pay_time != '0000-00-00 00:00:00' && detail.identify != 4" class="com-disx">
              <label>{{plug.sm(simply, '支付时间')}}：</label><span>{{detail.pay_time}}</span></p>
            <p class="com-disx"><label>{{plug.sm(simply, '退款时间')}}：</label><span>{{detail.status_time}}</span></p>
          </dd>
        </dl>
        <dl v-if='plug.valueValid(detail.attention)' class="aux com-marlt">
          <dt>{{plug.sm(simply, '注意事项')}}</dt>
          <dd class="tb attention"><pre v-html="detail.attention"></pre></dd>
        </dl>
        <dl v-if='plug.valueValid(detail.tips)' class="aux com-marlt">
          <dt>{{plug.sm(simply, '预约须知')}}</dt>
          <dd class="tb tips"><pre v-html="detail.tips"></pre></dd>
        </dl>
        <button v-if="((inApp && (detail.identify == 1 || detail.identify == 4)) || !inApp) && (detail.status == 'verifying' || detail.status == 'unconsumed')" @click="updateOrderDetail" class="aux order" :class="{invalid: !detail.canUpdate}" type="button">{{plug.sm(simply, '修改订单信息')}}</button> 

        <consultant-card class='ibercare-order-detail' style="margin-top: .55rem;border-radius: .06rem;" :user-uuid="query.user_uuid" :target-uuid="query.care_product_uuid" :share-health="true"
          :from-type="share.target_type"> 
        </consultant-card>
      </section>
      <div style="width:100%;height:1rem;"></div>
    </div>


    <div v-if="start_pay && !inApp" @click="goPay" class="com-bottom" style="z-index:9;padding:.08rem .12rem;background-color: #fff;">
      <button type="button" class="aux" style="width:100%;height:.4rem;border-radius: .4rem;background-image: linear-gradient(90deg, #FE6519 0%, #FF912A 100%);font-size: .15rem;color:#fff;">{{plug.sm(simply, '支付定金')}}（{{plug.price(inApp, simply)}}{{calcNum(detail.deposit)}}）</button> 
    </div>

    <com-agent-album :params="comAAMData"></com-agent-album>
    <com-ibercare-login v-model="showiBerCareLogin" :params='iBerCareLogin' @change='login'></com-ibercare-login>

  </div>
</template>


<script>
  import cmn from "@/components/ibercare/common.js";
  import comAgentAlbum from "@/components/component/com_agent_album.vue";
  import comIbercareLogin from "@/components/component/com_ibercare_login.vue";
  import CareOrderListEnter from "@/components/shared/component/card/careorderlistenter.vue";
  import CommonJS from '@/components/shared/service/common.js';
  import ConsultantCard from "@/components/shared/component/card/consultant.vue";

  export default {
    name: 'iBerCareOrderDetail',
    data() {
      return {
        query: {},
        c_user_uuid: null,
        detail: {
          order: {},
          appoint: {},
          info: {}
        },
        start_pay: false,
        comAAMData: {
          layer: 0,
          name: "comAAMData",
          imgArray: [],
          index: 0
        },
        showiBerCareLogin: false,
        iBerCareLogin: {
          mobile_pre: null, 
          mobile: null
        },
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
        },
        shareSetting: {
          hide_platform: [],
          language: 'auto',
          auth: 'force',
          card: 'full',
          comment: 'null',
          moreShare: 'null'
        }
      }
    },
    components: {
      comAgentAlbum,
      CareOrderListEnter,
      comIbercareLogin,
      ConsultantCard
    },
    created() { 
      document.title = plug.sm(this.simply, '订单详情');
      this.$root.pageLoading.layer = 1;
      
      let query = this.$route.query;
      let links = this.urlParams;

      this.query.user_uuid = (query && query.user_uuid) ? query.user_uuid : links.user_uuid;
      this.query.care_order_uuid = (query && query.care_order_uuid) ? query.care_order_uuid : links.care_order_uuid;

      if (!plug.objectValue(this.query)) { 
        this.$root.pageLoading.layer = 2;
        return;
      }

      this.getRootUserInfo().then((auth) => {
        this.c_user_uuid = auth.c_user_uuid;
        if (this.inApp) {
          this.getDetail();
          return ;
        }
        
        this.getMobile();
      });

      window.getOrderDetail = ()=> {
        this.getDetail();
      }
    },
    methods: {
      //进入产品详情
      goProductDetail() {
        let care_product_uuid = this.query.care_product_uuid;
        if (typeof care_product_uuid == 'undefined' || care_product_uuid == "") {
          return ;
        }
        //小程序
        if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
          cmn.miniPagePath({
            object: this,
            path: "/iber-care/product-detail",
            title: plug.sm(this.simply, '产品详情'),
            query: {
              user_uuid: this.query.user_uuid,
              care_product_uuid: this.query.care_product_uuid,
              c_user_uuid: this.c_user_uuid
            }
          });
          return;
        }
        if (this.inApp) {
          postMessage(JSON.stringify({
            type: "iBerCareProductDetail",
            data: {
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
      },
      //验证手机验证码
      verifyState() {
        if (localStorage.getItem('care_verify_mobile') && localStorage.getItem('care_verify_mobile_pre') && localStorage.getItem('care_verify_code')) {
          this.$http.ajax({
            path: "iber-care/verify-sms-code",
            type: "post",
            data: {
              mobile: localStorage.getItem('care_verify_mobile'),
              mobile_pre: localStorage.getItem('care_verify_mobile_pre'),
              code: localStorage.getItem('care_verify_code')
            },
            filter: (res)=> {
              if (res.data.code == 0) {
                this.getDetail();
                return ;
              }
              this.checkValid();
            },
            intercept: (msg)=> {
              this.$root.pageLoading.layer = 2;
            }
          }).then((res) => {
            //业务模型 
            this.getDetail();
          });
          return;
        }
        this.checkValid();
      },
      login(obj) {  
        this.$root.pageLoading.layer = 1;
        this.getDetail();
      },
      getMobile() {
        this.$http.ajax({
          path: "/iber-care/get-reserve-mobile",
          type: "get",
          data: {
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
          this.query.mobile_pre = res.data.mobile_pre;
          this.query.mobile = res.data.mobile;

          // 设置本地缓存
          localStorage.setItem('care_verify_mobile', res.data.mobile);
          localStorage.setItem('care_verify_mobile_pre', res.data.mobile_pre.replace(/\+/, ''));

          this.verifyState(); 
        });
      },
      checkValid() {
        this.$http.ajax({
          path: "/c-user/check-c-user-mobile",
          type: "get",
          data: {
            user_uuid: this.query.user_uuid,
            c_user_uuid: this.c_user_uuid,
            care_order_uuid: this.query.care_order_uuid,
            mobile_pre: this.query.mobile_pre,
            mobile: this.query.mobile
          },
          intercept: (msg) => {
            if (plug.valueValid(msg)) {
              this.$root.pageLoading.info = msg;
            } 
            this.$root.pageLoading.layer = 2;
          } 
        }).then((res) => {
          //业务模型
          if (res.data.checked) {
            this.getDetail();
            return ;
          }
          this.$root.pageLoading.layer = 0;

          this.iBerCareLogin = {
            mobile_pre: this.query.mobile_pre,
            mobile: this.query.mobile
          }
          this.showiBerCareLogin = true;
        });
      },
      goPay() {
        //小程序支付
        if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
          cmn.miniWxPay({
            object: this,
            user_uuid: this.query.user_uuid,
            c_user_uuid: this.query.care_order_uuid,
            care_order_uuid: this.query.care_order_uuid,
            page_back: "page-order-detail"
          });
          return;
        }

        if (this.inApp) {
          postMessage(JSON.stringify({
            type: "iBerCarePay",
            data: {
              user_uuid: this.query.user_uuid,
              care_order_uuid: this.query.care_order_uuid,
              mobile_pre: this.query.mobile_pre,
              mobile: this.query.mobile 
            }
          }), '*'); 
          return;
        }

        window.location.href = window.baseUrl + "/iber-care/pay-select?user_uuid=" + this.query.user_uuid + "&care_order_uuid=" + this.query.care_order_uuid;
      },
      openAlbum(imgArray, index) {
        let urlArray = []; 
        if (imgArray instanceof Array) {
          imgArray.forEach((value, index) => {
            let obj = { url: value };
            urlArray.push(obj);
          });
        } else {
          let obj = { url: imgArray};
          urlArray.push(obj); 
        } 

        if (this.inApp) {
          plug.getAgentAlbum(urlArray, index);
          return;
        }
        if (plug.wx.platform) {
          plug.wxAlbum(urlArray, index);
          return; 
        } 
        this.comAAMData.imgArray = urlArray;
        this.comAAMData.index = index;
        this.comAAMData.layer = 1;
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
      setBgSize(imgUrl) {
        let ref = new Image();
        ref.src = imgUrl;
        ref.onload = () => {
          if (ref.width > ref.height) {
            this.detail.banner_size = "auto 100%";
          } else {
            this.detail.banner_size = "100% auto";
          }
        }
      },
      getDetail() { 
        this.$http.ajax({
          path: "/iber-care/order-detail",
          type: "get",
          data: {
            in_app: this.inApp ? 1 : 0,
            user_uuid: this.query.user_uuid,
            c_user_uuid: this.c_user_uuid,
            care_order_uuid: this.query.care_order_uuid,
            mobile: localStorage.getItem('care_verify_mobile'),
            mobile_pre: localStorage.getItem('care_verify_mobile_pre'),
            code: localStorage.getItem('care_verify_code'),
          },
          intercept: (msg, status) => {
            if (plug.valueValid(msg)) {
              this.$root.pageLoading.info = msg;
            } 
            if (status.code == 3003) {
              this.$root.pageLoading.button = false;
            }
            this.$root.pageLoading.layer = 2;
          }
        }).then((res) => {
          if (this.inApp) {
            window.orderDetailStatus = function() {
              postMessage(JSON.stringify({
                type: 'complete',
                data: {
                  state: 'ok'
                }
              }));
            };  
          }
          this.query.care_product_uuid = res.data.care_product_uuid;
          
          //设置记录图片 
          let extra = res.data.appoint.extra;
          for (let i = 0; i < extra.length; i++) {
            if (extra[i].type == 'image') {
              res.data.appoint.extra[i].size = [];
              for (let j = 0; j < extra[i].value.length; j++) {
                let random = "_random_" + Date.now();
                random = new Image();
                random.src = extra[i].value[j];
                random.onload = () => {
                  let size = "";
                  if (random.width > random.height) {
                    size = "auto 100%";
                  } else {
                    size = "100% auto";
                  } 
                  res.data.appoint.extra[i].size.push(size);
                }
              }
            }
          }  

          res.data.banner_size = ""; 
          this.detail = res.data;

          // 设置分享信息
          this.share.title = res.data.share.title;
          this.share.thumbImage = res.data.share.thumbImage;
          this.share.desc = res.data.share.desc;
          this.share.care_product_uuid = res.data.care_product_uuid;
          this.share.url = window.location.origin + window.location.pathname + '?user_uuid=' + this.query.user_uuid + "&care_order_uuid=" + this.query.care_order_uuid;
  
          // 微信分享初始化 
          CommonJS.initWX(this.share);
          // app从H5获取分享数据
          this.appFn.getShareFromH5(this.share, this.shareSetting);

          if (this.detail.status != 'topay' || this.detail.countdown == 0) {
            this.$root.pageLoading.layer = 0; 
            return;
          }

          let interval = null;
          let startInterval = () => {
            window.clearInterval(interval);
            this.start_pay = true; 
            this.detail.countdown = parseInt(this.detail.expire_time - this.detail.now_time);
            interval = window.setInterval(() => {
              if (this.detail.countdown <= 0) {
                window.clearInterval(interval);
                this.detail.status = 'cancel';
                this.start_pay = false;
                postMessage(JSON.stringify({
                  type: 'orderDetailStatusCancel',
                  data: {
                    user_uuid: this.query.user_uuid,
                    care_order_uuid: this.query.care_order_uuid,
                    status: 'cancel'
                  }
                }), '*');
              }
              this.detail.countdown --;
            }, 1000);
          }
          startInterval();

          cmn.toInterval(() => {
            console.log("从后台切换到前台");
            startInterval();
          }, () => {
            console.log("从前台切换到后台");
          });
          this.$root.pageLoading.layer = 0; 
        });  
      },
      goOrderList() {
        this.$router.push({
          path: '/iber-care/order-list',
          query: {
            user_uuid: this.query.user_uuid,
            mobile_pre: this.query.mobile_pre,
            mobile: this.query.mobile
          }
        });
      },
      updateOrderDetail() {
        if (!this.detail.canUpdate) {
          this.$toast(plug.sm(this.simply, '只允许修改预约日期大于3天的订单'));
          return ;
        }
        //小程序
        if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
          cmn.miniPagePath({
            object: this,
            route: "/pages/frame/box",
            path: "/iber-care/order-reserve-info",
            title: plug.sm(this.simply, '报名预约'),
            query: {
              user_uuid: this.query.user_uuid,
              care_order_uuid: this.query.care_order_uuid
            }
          });
          return;
        }

        if (this.inApp) {
          postMessage(JSON.stringify({
            type: "iBerCareUpdateOrderDetail",
            data: {
              user_uuid: this.query.user_uuid,
              care_order_uuid: this.query.care_order_uuid
            }
          }), '*');
          return;
        }

        this.$router.push({
          path: '/iber-care/order-reserve-info',
          query: {  
            user_uuid: this.query.user_uuid,
            care_order_uuid: this.query.care_order_uuid
          }
        });
      },
      call: function () {
        let mobile_pre = this.detail.appoint.mobile_pre;
        let mobile = this.detail.appoint.mobile;
        if (!plug.valueValid(mobile)) {
          this.$toast(plug.sm(this.simply, '手机号无效'));
          return ;
        } 
        postMessage(JSON.stringify({
          type: 'callPhone',
          data: {
            mobile_pre: mobile_pre,
            mobile: mobile
          }
        }), '*');
        //window.open('tel:' + mobile_pre + mobile.replace(/\s+/g, ''))
      },
      calcNum(value) {
        return cmn.changeFormat(value);
      }
    }
  }
</script>

<style scoped>
  header div.banner {overflow:hidden;padding-bottom:.525rem;}
  header div.banner-consumed {background-image: linear-gradient(270deg, #4C7FFF 0%, #3863FF 100%);}
  header div.banner-topay {background-image: linear-gradient(90deg, #FE6519 0%, #FF912A 100%);}
  header div.banner-verifying {background-image: linear-gradient(90deg, #FF4C35 0%, #FF5F5F 100%);}
  header div.banner-unconsumed {background-image: linear-gradient(90deg, #FF4C35 0%, #FF5F5F 100%);}
  header div.banner-expire {background-image: linear-gradient(90deg, #757A86 0%, #929DB3 100%);}
  header div.banner-refunding {background-image: linear-gradient(90deg, #757A86 0%, #929DB3 100%);}
  header div.banner-refunded {background-image: linear-gradient(90deg, #757A86 0%, #929DB3 100%);}
  header div.banner-cancel {background-image: linear-gradient(90deg, #757A86 0%, #929DB3 100%);}
  
  header div.state {overflow:hidden;padding:.12rem;padding-right:.24rem;padding-left:.24rem;}
  header div.state h3 {margin-bottom:.1rem;height:.2rem;line-height:.2rem;font-size: .16rem;color:#fff;}
  header div.state h3 span {float:right;font-size: .13rem;font-weight: 400;}
  header div.state h3 i {margin-right:.05rem;;font-size: .16rem;}
  header div.state p {line-height:.18rem;font-size: .13rem;color:#fff;}
  div.card {overflow: hidden;margin-top:-.525rem;margin-bottom:.12rem;}
  div.card>div {padding:.12rem;border-radius: .06rem;background-color:#fff;box-shadow: 0 .02rem .16rem 0 rgba(29,29,29,0.06);}
  div.product-show {overflow:hidden;width:1.08rem;height:.8rem;border-radius: .08rem;}
  div.card .info {flex:1;margin-left:.12rem;}
  div.card .info h3 {line-height:.2rem;font-size: .15rem;color:#333;}
  div.card .info h3 i {float:left;margin-right:.05rem;font-size: .14rem;font-weight: 400;color:#FF9613;}
  div.card .info p.money {margin-top:.05rem;margin-bottom:.05rem;line-height:.17rem;font-size: .14rem;color:#FF3B23;}
  div.card .info p.money span {font-size: .11rem;color:#999;}
  div.card .info p.pay {line-height:.16rem;font-size: .13rem;color:#2a2a2a;}

  section dl {margin-bottom:.12rem;border-radius: .06rem;background-color: #fff;}
  section dl>dt {height:.45rem;line-height:.45rem;border-bottom:1px solid #e8e8e8;font-size: .16rem;font-weight: 600;color:#2a2a2a;}
  section dl>dd {line-height:.4rem;}
  section dl>dd.tb {padding-top:.12rem;padding-bottom:.12rem;}

  section dl>dd.consume {line-height:.21rem;font-size: .14rem;color:#2a2a2a;}
  section dl>dd.consume p {padding-top:.1rem;padding-bottom:.1rem;}
  section dl>dd.appointment p {padding-top:.1rem;padding-bottom:.1rem;line-height:.21rem;font-size: .14rem;}
  section dl>dd.appointment p label {width:1.05rem;color:#999;}
  section dl>dd.appointment p span {overflow:hidden;flex:1;color:#2a2a2a;}
  section dl>dd.appointment div.portrait {float:left;margin-right:.24rem;margin-bottom:.12rem;width:.74rem;height:.74rem;border-radius:.04rem;text-align:center;}
  section dl>dd.appointment div {overflow:hidden;}
  section dl>dd.info {line-height:.41rem;font-size: .14rem;}
  section dl>dd.info div {overflow:hidden;}
  section dl>dd.info label {width:.94rem;color:#999;} 
  section dl>dd.info span {flex: 1;color:#2a2a2a;}
  section dl>dd.attention {line-height:.21rem;color:#2a2a2a;}
  section dl>dd.tips {line-height:.21rem;color:#2a2a2a;}
  section dl>dd.attention pre {margin: 0;white-space: pre-wrap;word-wrap: break-word;}
  section dl>dd.tips pre {margin: 0;white-space: pre-wrap;word-wrap: break-word;}
  button.order {width:100%;height:.42rem;border:1px solid #979797;border-radius: .42rem;background-color:#fff;font-size:.15rem;color:#333;} 
  button.order.invalid {background-color: #eee;border: 1px solid #eee;color: #ddd;}
  button:active {opacity:.7;}
</style>