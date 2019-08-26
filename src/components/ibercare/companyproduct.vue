<template>
    <div v-show="isLoaded" class="care-company-product">
        <!-- 主体页面 -->
        <div class="care-company-product-content com-scroll-y" @scroll="scrollFn">
            <!-- 订单列表入口 -->
            <care-order-list-enter :c-user-uuid="rootUserInfo['c_user_uuid']"></care-order-list-enter>
            <div class="banner-box" @click="goCareCompanyDetail()">
                <img :src="companyInfo.banner_img">
            </div>
            <div ref="swiperContent" class="swiper-content">
                <div class="swiper-tabs-box" v-show="companyInfo.categorys && (companyInfo.categorys.length > 1)">
                    <ul class="swiper-tabs" :style="swiperTabsStyle">
                        <li class="swiper-tabs-block" :class="{'current': tabIndex === index}" v-for="(item, index) in companyInfo.categorys" @click="selectTab(item.uuid, index)">
                            <span>{{item.name}}</span>
                        </li>
                    </ul>
                </div>
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div :id="'swiperSlide' + index1" class="swiper-slide" v-for="(item1, index1) in companyInfo.categorys" :style="{'height': swiperSlideHeight}">
                            <ul class="product-list">
                                <li class="product-list-block clearfix" v-for="(item, index) in item1.productList" @click="goCareProductDetail(item)">
                                    <div v-if="index !== 0" class="separate-line"></div>
                                    <img class="left-img" :src="item.image">
                                    <img v-if="item.is_new" class="new" src="https://static.iberhk.com/v2/web/images/iber_care/new.png">
                                    <div class="right-text">
                                        <div v-if="item.title" class="name">
                                            <!-- <span class="pro">pro</span> -->
                                            <i v-if="item.is_pro" class="iconfonti pro-icon">&#xe662;</i>
                                            <span>{{item.title}}</span>
                                        </div>
                                        <div v-if="item.price" class="money">
                                            <span class="unit">{{inApp ? 'HK$' : (simply ? '港币' : '港幣')}}</span>
                                            <span class="num">{{item.price | formatMoney(0, '')}}</span>
                                        </div>
                                        <div class="factory">{{item.pharmaceutical_factory}}</div>
                                    </div>
                                </li>
                                <li v-show="item1.allLoaded" class="product-bottom-tip-box">
                                    <span>{{simply ? '更多产品敬请期待' : '更多產品敬請期待'}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </div>
</template>

<script>
  import cmn from "@/components/ibercare/common.js";
import CommonJS from '@/components/shared/service/common.js';
import CareOrderListEnter from "@/components/shared/component/card/careorderlistenter.vue";
//小程序环境
let wxSdk = null;
if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
    wxSdk = require('weixin-js-sdk');
}

export default {
    name: "CompanyProduct",
    data() {
        return {
            care_company_uuid: this.$route.query['care_company_uuid'] ? this.$route.query['care_company_uuid'] : (this['urlParams'] ? this.urlParams['care_company_uuid'] : ''),
            isLoaded: false,
            share: {},
            shareSetting: {
                hide_platform: [],
                language: 'auto',
                auth: 'force',
                card: 'full',
                comment: 'null',
                moreShare: 'null'
            },
            companyInfo: {},
            productList: [],
            tabIndex: 0,
            swiperTabsStyle: {},
            swiper: null,
            swiperSlideHeight: 'auto',
            page_size: 10
        };
    },
    components: {
        CareOrderListEnter,
    },
    created() {
        CommonJS.loadStyle('https://static.iberhk.com/res/css/swiper.min.css');

        this.$root.blueLoadingParams.show = false;
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: false, // 分享上报，不上报可不传
            care_company_uuid: this.care_company_uuid,
            target_type: '61',
            router: window.location.pathname,
            url: '',
        };
    },
    mounted() {
        // 加载swiper轮播插件
        CommonJS.loadScript('https://static.iberhk.com/res/js/swiper.min.js', () => {
            // 获取疾病詳情
            this.getCareCompanyProduct();
            // 获取公共用户信息
            this.getUserInfoFn();
        });
    },
    methods: {
        // 获取公共用户信息
        getUserInfoFn() {
            if (!this.inApp) {
                this.userUuid && this.getRootUserInfo().finally(() => {});
            }
        },
        // 获取产品详情
        getCareCompanyProduct() {
            this.$root.blueLoadingParams.show = true;
            this.$http.get('/iber-care/company-product', {
                care_company_uuid: this.care_company_uuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.companyInfo = res.data.detail;
                    //屏蔽小程序标题
                    if (window.__wxjs_environment != "miniprogram" && window.platform != 7){
                      document.title = this.companyInfo.name;
                    }
                    this.companyInfo.categorys.forEach((item, index) => {
                        item.productList = [];
                        item.page = 1;
                        item.go_page = 0;
                    });
                    if (this.companyInfo.categorys.length > 0) {
                        this.getCareCompanyProductList();
                    }
                    // 设置分享信息
                    this.share.title = res.data.share.title;
                    this.share.thumbImage = res.data.share.thumbImage;
                    this.share.desc = res.data.share.desc;
                    this.share.url = window.location.origin + window.location.pathname + '?care_company_uuid=' + this.care_company_uuid + '&user_uuid=' + this.userUuid;
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                    this.createSwiper();
                } else {
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                }
            }, err => {
                this.isLoaded = true;
                window.location.href = window.baseUrl + '/error/404';
            });
        },
        // 获取产品详情
        getCareCompanyProductList() {
            const categorys = this.companyInfo.categorys[this.tabIndex];
            if ((categorys.page !== categorys.go_page) && !categorys.allLoaded) {
                categorys.go_page = categorys.page;
                this.$root.blueLoadingParams.show = true;
                this.$http.get('/iber-care/company-product-list', {
                    care_company_uuid: this.care_company_uuid,
                    category_uuid: categorys.uuid,
                    page: categorys.page,
                    page_size: this.page_size
                }).then(res => {
                    if (res && res.code === 0) {
                        // 测试数据
                        // res.data.list[0].is_new = 1;
                        // res.data.list[0].is_pro = 1;
                        const list = res.data['list'];
                        this.companyInfo.categorys[this.tabIndex].productList = this.companyInfo.categorys[this.tabIndex].productList.concat(list);
                        // 小于返回数组小于page_size时显示到底啦
                        if (list) {
                            if (list.length < this.page_size) {
                                this.companyInfo.categorys[this.tabIndex].allLoaded = true;
                            } else {
                                this.companyInfo.categorys[this.tabIndex].page += 1;
                            }
                        }
                        this.$forceUpdate();
                        setTimeout(() => {
                            let productListHeight = document.querySelector('#swiperSlide' + this.tabIndex + ' .product-list');
                            if (productListHeight) {
                                this.swiperSlideHeight = productListHeight.clientHeight + 'px';
                            }
                        }, 100);
                        this.$root.blueLoadingParams.show = false;
                    } else {
                        this.$root.blueLoadingParams.show = false;
                    }
                }, err => {
                    window.location.href = window.baseUrl + '/error/404';
                });
            }
        },
        // 选中对应tab
        selectTab(uuid, index) {
            if (this.tabIndex !== index) {
                this.tabIndex = index;
                this.swiper.slideTo(this.tabIndex);
            }
        },
        // 滚动事件
        scrollFn(event) {
            // 当前滚动位置
            let scrollTop = event.target.scrollTop;
            // tab距离顶部高度
            let tabsOffsetTop = this.$refs.swiperContent.offsetTop;
            // 当前滚动位置到tab时tab栏吸顶
            if (scrollTop >= tabsOffsetTop) {
                this.swiperTabsStyle = {
                    width: document.querySelector('#frameworkView').clientWidth + 'px',
                    position: 'fixed',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    'z-index': 100
                };
            } else {
                this.swiperTabsStyle = {};
            }
            const comScrollY = document.querySelector('.com-scroll-y');
            if (comScrollY.scrollHeight === (scrollTop + comScrollY.clientHeight)) {
                this.getCareCompanyProductList();
            }

        },
        // tab轮播
        createSwiper() {
            const _this = this;
            setTimeout(() => {
                this.swiper = new Swiper(".swiper-container", {
                    initialSlide: 0,
                    direction: "horizontal",
                    loop: false,
                    freeMode: false,
                    pagination: {
                        el: null,
                    },
                    on: {
                        init: function() {

                        },
                        slideChange: function() {
                            _this.tabIndex = this.activeIndex;
                            _this.getCareCompanyProductList();
                            let productListHeight = document.querySelector('#swiperSlide' + _this.tabIndex + ' .product-list');
                            if (productListHeight) {
                                _this.swiperSlideHeight = productListHeight.clientHeight + 'px';
                            }
                        },
                        slideNextTransitionEnd: function() {

                        },
                        slidePrevTransitionStart: function() {

                        }
                    }
                });
            }, 100);
        },
        // 跳转医疗保险详情
        goCareProductDetail(item) {
          //小程序
          if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
            cmn.miniPagePath({
              object: this,
              route: "/pages/frame/detail",
              path: "/iber-care/product-detail",
              title: plug.sm(this.simply, '医疗保险详情'),
              query: {
                user_uuid: this.userUuid,
                care_product_uuid: item.uuid,
                language: this.lang
              }
            });
            return;
          }
            if (!this.inApp) {
                window.location.href = window.baseUrl + '/iber-care/product-detail?care_product_uuid=' + item.uuid + '&user_uuid=' + this.userUuid + '&in_app=' + (this.inApp ? 1 : 0) + '&auth=' + window.auth + '&card=' + this.card + '&language=' + this.lang;
            }
        },
        // 跳转集团详情
        goCareCompanyDetail(uuid) {
          //小程序
          if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
            cmn.miniPagePath({
              object: this,
              route: "/pages/frame/detail",
              path: "/iber-care/company-detail",
              title: plug.sm(this.simply, '集团详情'),
              query: {
                user_uuid: this.userUuid,
                care_company_uuid: this.care_company_uuid,
                language: this.lang
              }
            });
            return;
          }
            if (!this.inApp) {
                window.location.href = window.baseUrl + '/iber-care/company-detail?care_company_uuid=' + this.care_company_uuid + '&user_uuid=' + this.userUuid + '&in_app=' + (this.inApp ? 1 : 0) + '&auth=' + window.auth + '&card=' + this.card + '&language=' + this.lang;
            }
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.care-company-product {
    font-family: PingFangSC-Regular;
    width: 100%;
}

.care-company-product-content {
    width: 100%;
    background-color: #F6F6F6;
}

.go-order-list {
    width: 100%;
    height: .32rem;
    line-height: .32rem;
    background-color: #FFECE7;
    font-size: .13rem;
    color: #FF4416;
    text-align: center;
    line-height: .32rem;
    cursor: pointer;
}

.banner-box {
    padding: .16rem;
    background-color: #FFFFFF;
    cursor: pointer;
}

.banner-box img {
    width: 100%;
    box-shadow: 0 .02rem .08rem 0 rgba(0, 0, 0, 0.20);
    border-radius: .06rem;
}

.swiper-content {
    width: 100%;
    margin-top: .1rem;
    background-color: #FBFBFB;
}

.swiper-tabs-box {
    width: 100%;
    height: .44rem;
}

.swiper-tabs {
    width: 100%;
    height: .44rem;
    line-height: .4rem;
    display: flex;
    font-size: .15rem;
    color: #666666;
    padding-top: .02rem;
    background-color: #FFFFFF;
    /* transition: all 300ms; */
    cursor: pointer;
}

.swiper-tabs-block {
    flex: 1;
    text-align: center;
    cursor: pointer;
}

.swiper-tabs-block.current {
    font-family: PingFangSC-Medium;
    color: #3364E4;
}

.swiper-tabs-block span {
    border-bottom: .02rem solid transparent;
}

.swiper-tabs-block.current span {
    display: inline-block;
    border-bottom: .02rem solid #3364E4;
    box-sizing: content-box;
    transition: all 300ms;
}

.product-list {
    width: 100%;
    padding: 0 .16rem;
    min-height: 1.15rem;
}

.product-list-block {
    padding: .16rem 0;
    /* border-bottom: 1px solid #E8E8E8; */
    /* height: 1.14rem; */
    cursor: pointer;
}

.separate-line {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background-color: #E8E8E8;
    display: block;
    z-index: 15;
    transform: scaleY(0.5);
}

.product-list-block .left-img {
    float: left;
    width: 1.1rem;
    height: .82rem;
    border-radius: .06rem;
}

.product-list-block .new {
    position: absolute;
    left: -.03rem;
    top: .13rem;
    width: .34rem;
}

.pro-icon {
    font-size: .12rem;
    color: #FF9613;
}

.product-list-block .right-text {
    float: left;
    width: calc(100% - 1.1rem);
    padding-left: .08rem;
}

.product-list-block .right-text .pro {
    margin-top: .05rem;
    display: inline-block;
    vertical-align: top;
    width: .22rem;
    height: .12rem;
    border: .01rem solid #FF9613;
    border-radius: .02rem;
    text-align: center;
    font-family: PingFangSC-Semibold;
    font-size: .09rem;
    color: #FF9613;
    line-height: .12rem;
    box-sizing: content-box;
}

.product-list-block .right-text .name {
    font-size: .15rem;
    color: #333333;
    line-height: .2rem;
    height: .4rem;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.product-list-block .right-text .money {
    width: 100%;
    font-size: .11rem;
    color: #FF4416;
    margin-top: .04rem;
    line-height: .21rem;
}

.product-list-block .right-text .money .num {
    font-size: .17rem;
    color: #FF4416;
}

.product-list-block .right-text .factory {
    width: 100%;
    font-size: .12rem;
    color: #999999;
    margin-top: .02rem;
    line-height: .15rem;
}

.product-bottom-tip-box {
    margin-right: -.16rem;
    margin-left: -.16rem;
    text-align: center;
    font-size: .12rem;
    color: #BBBBBB;
    line-height: .16rem;
    padding: .16rem;
    background-color: #F6F6F6;
}
</style>
