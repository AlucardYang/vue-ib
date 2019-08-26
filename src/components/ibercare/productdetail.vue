<template>
    <div class="goods-detail">
        <!-- 顶部tab -->
        <ul v-show="isLoaded" v-if="codeStatus === 0" ref="topTabs" class="tabs" :style="{'padding-top': inApp ? '.' + this.navbar_height + 'rem' : 0}">
            <li class="tab-li"></li>
            <li class="tab-li" @click="goTabContent('goodsInfo')" :class="{'current': tabType === 'goodsInfo'}">
                <span class="text">{{simply ? '产品' : '產品'}}</span>
            </li>
            <li class="tab-li" @click="goTabContent('goodsStore')" :class="{'current': tabType === 'goodsStore'}">
                <span class="text">{{simply ? '门店' : '門店'}}</span>
            </li>
            <li class="tab-li" @click="goTabContent('goodsDetail')" :class="{'current': tabType === 'goodsDetail'}">
                <span class="text">{{simply ? ' 详情' : '詳情'}}</span>
            </li>
            <li v-show="inApp" class="tab-li" @click="goTabContent('goodsAttachments')" :class="{'current': tabType === 'goodsAttachments'}">
                <span class="text">附件</span>
            </li>
            <li class="tab-li"></li>
        </ul>
        <!-- 后退按钮 -->
        <div v-if="inApp" class="back-icon-box" :style="backIconStyle" @click="goBack()">
            <i ref="backIcon" class="iconfonti back-icon">&#xe7e8;</i>
        </div>
        <!-- 收藏按钮 -->
        <div v-show="isLoaded" v-if="inApp" class="back-icon-box collect-icon-box" :style="backIconStyle" @click="saveProduct()">
            <i v-if="detailInfo.collect_status" ref="collectIcon" class="iconfonti back-icon" style="margin-top: -0.01rem;">&#xe730;</i>
            <i v-if="!detailInfo.collect_status" ref="collectIcon" class="iconfonti back-icon" style="margin-top: -0.01rem;">&#xe72f;</i>
        </div>
        <!-- 客服按钮 -->
        <div v-show="isLoaded" v-if="inApp" class="service-btn" @click="openServiceCard('iber')">
            <i class="iconfonti">&#xe7e0;</i>
            <span>客服</span>
        </div>
        <!-- 咨询按钮 -->
        <div v-show="isLoaded" v-if="!inApp && (codeStatus !== 2001) && (codeStatus !== 2002) && (codeStatus !== 2003) && (card !== 'hide')" class="service-btn" @click="openServiceCard('agent')">
            <i class="iconfonti">&#xe717;</i>
            <span>{{simply ? '咨询' : '諮詢'}}</span>
        </div>
        <!-- 主体页面 -->
        <div v-show="isLoaded" v-if="inApp || (!inApp && (codeStatus === 0))" class="detail-content com-scroll-y" @scroll="scrollFn">
            <!-- 订单列表入口 -->
            <care-order-list-enter :c-user-uuid="rootUserInfo['c_user_uuid']"></care-order-list-enter>
            <div ref="imgBanner" class="banner">
                <img ref="bannerImg" v-if="detailInfo.banner_img" :src="detailInfo.banner_img">
            </div>
            <ul class="tab-content">
                <li id="goodsInfo" class="tab-content-page">
                    <div class="detail-info">
                        <div v-if="detailInfo.name" class="title">
                            <i v-if="detailInfo.is_pro" class="iconfonti pro-icon">&#xe686;</i>
                            <span v-if="detailInfo.is_pro">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span class="text">{{detailInfo.name}}</span>
                        </div>
                        <div v-if="detailInfo.vip_price" class="money">
                            <span class="unit">{{inApp ? 'HK$' : (simply ? '港币' : '港幣')}}</span>
                            <span class="num">{{detailInfo.vip_price | formatMoney(0, '')}}</span>
                        </div>
                        <div v-if="detailInfo.abstract" class="desc">
                            <div v-for="(item, index) in detailInfo.abstracts">{{item}}</div>
                        </div>
                        <div v-if="detailInfo.pharmaceutical_factory" class="factory">
                            <span>{{simply ? '药厂：' : '藥廠：'}}</span><span>{{detailInfo.pharmaceutical_factory}}</span>
                        </div>
                    </div>
                </li>
                <li id="goodsStore" class="tab-content-page">
                    <div v-if="detailInfo.company" class="tab-content-page-title">
                        <span class="tab-content-page-title-separate"></span>
                        <span>{{simply ? '医疗集团' : '醫療集團'}}</span>
                    </div>
                    <div v-if="detailInfo.company" class="group-box">
                        <img :src="detailInfo.company.img">
                        <div class="text-box">
                            <div class="title">{{detailInfo.company.title}}</div>
                            <div class="tags">{{detailInfo.company.care_product_categories.join(' ')}}</div>
                        </div>
                        <div class="all-goods-btn" @click="goCareCompanyProduct()">{{simply ? '全部产品' : '全部產品'}}</div>
                        <div class="go-detail-btn" @click="goCareCompanyDetail()">{{simply ? '查看详情' : '查看詳情'}}</div>
                    </div>
                    <div v-if="detailInfo.company && detailInfo.stores && (detailInfo.stores.length > 0)" class="separate-line" style="width: calc(100% - .32rem);margin-left: .16rem;"></div>
                    <div v-if="detailInfo.stores && (detailInfo.stores.length > 0)" class="tab-content-page-title">
                        <span class="tab-content-page-title-separate"></span>
                        <span>{{simply ? '预约门店' : '預約門店'}}</span>
                    </div>
                    <div v-if="detailInfo.stores && (detailInfo.stores.length > 0)" class="tab-content-detail" style="padding: 0 .16rem .04rem .16rem;">
                        <div class="store-box" v-for="(item, index) in detailInfo.stores" @click="openMap(item.addr)">
                            <div class="name">
                                <span>{{item.name}}</span>
                                <i class="iconfonti">&#xe68a;</i>
                            </div>
                            <div class="addr">
                                <span class="left">{{simply ? '营业时间：' : '營業時間：'}}</span>
                                <div v-for="(chlidItem, chlidIndex) in item.business_hours" class="right">
                                    <span>{{chlidItem}}</span>
                                </div>
                            </div>
                            <div class="addr">
                                <span class="left">{{simply ? '门店地址：' : '門店地址：'}}</span>
                                <span class="right">{{item.addr}}</span>
                            </div>
                        </div>
                    </div>
                </li>
                <li id="goodsDetail" class="tab-content-page" :style="{'height': detailInfo.content ? 'auto' : 0}">
                    <div class="tab-content-page-title">
                        <span class="tab-content-page-title-separate"></span>
                        <span>{{simply ? '产品详情' : '產品詳情'}}</span>
                    </div>
                    <div class="tab-content-detail">
                        <img class="promotional-img" :src="detailInfo.content" @click="drawLongImage(detailInfo.content)">
                        <img class="long-img-top" :src="simply ? 'https://static.iberhk.com/v2/web/images/iber_care/long-img-top-cn.png' : 'https://static.iberhk.com/v2/web/images/iber_care/long-img-top-tw.png'" @click="drawLongImage(detailInfo.content)">
                        <img class="special-qrcode" :src="detailInfo.agentInfo.base64_qrcode" @click="drawLongImage(detailInfo.content)">
                    </div>
                </li>
                <li id="goodsAttachments" class="tab-content-page" :style="{height: inApp ? 'auto': 0, 'margin-bottom': inApp ? '0.1rem': 0, overflow: 'hidden'}">
                    <div class="tab-content-page-title">
                        <span class="tab-content-page-title-separate"></span>
                        <span>{{simply ? '相关附件' : '相關附件'}}</span>
                    </div>
                    <ul class="annex-list">
                        <li v-for="(item, index) in detailInfo.attachments" :key="index" @click="drawLongImage(item.url, 'download')">
                            <span class="attachment-name com-nowrap">{{item.name}}</span>
                            <img class="display-verticle-middle" src="https://static.iberhk.com/v2/web/images/product/download.png">
                        </li>
                    </ul>
                </li>
            </ul>
            <consultant-card :user-uuid="userUuid" :target-uuid="care_product_uuid" :share-health="true" :from-type="share.target_type" :style="{'background-color': 'transparent', 'padding-top': '.34rem'}"></consultant-card>
            <div class="detail-content-wrapper"></div>
        </div>
        <!-- 错误页面提示 -->
        <div v-show="isLoaded" v-if="!inApp && (codeStatus !== 0)" class="detail-error-content com-scroll-y">
            <care-order-list-enter :c-user-uuid="rootUserInfo['c_user_uuid']"></care-order-list-enter>
            <div class="goods-error-box">
                <!-- 无法预约 -->
                <img v-if="codeStatus === 2001" src="https://static.iberhk.com/v2/web/images/iber_care/no-order.png">
                <div v-if="codeStatus === 2001" class="text">
                    <span>{{simply ? '此产品暂时无法预约' : '此產品暫時無法預約'}}</span><br>
                    <span>{{simply ? '请联系顾问获取最新信息' : '請聯絡顧問獲取最新信息'}}</span>
                </div>
                <!-- 产品下架 -->
                <img v-if="codeStatus === 2002" src="https://static.iberhk.com/v2/web/images/iber_care/sold-out.png">
                <div v-if="codeStatus === 2002" class="text">
                    <span>{{simply ? '该产品已下架' : '該產品已下架'}}</span>
                </div>
                <!-- 库存不足 -->
                <img v-if="codeStatus === 2003" src="https://static.iberhk.com/v2/web/images/iber_care/no-stock.png">
                <div v-if="codeStatus === 2003" class="text">
                    <span>{{simply ? '产品库存不足' : '產品庫存不足'}}</span><br>
                    <span>{{simply ? '请联系顾问获取最新信息' : '請聯絡顧問獲取最新信息'}}</span>
                </div>
            </div>
            <simple-consultant-card :user-uuid="userUuid" :target-uuid="care_product_uuid" :share-health="true" :from-type="share.target_type"></simple-consultant-card>
        </div>
        <!-- 图片预览 -->
        <com-agent-avatar :params="comAARData"></com-agent-avatar>
        <!-- 底部按钮 -->
        <div v-show="isLoaded" v-if="inApp || (!inApp && (codeStatus === 0))" class="bottom-order-box">
            <div v-if="!inApp" class="order-box">
                <div v-if="detailInfo.stock">
                    <div class="deposit">
                        <div class="top-text-box">
                            <span>定金:</span>
                            <span class="money">{{inApp ? 'HK$' : (simply ? '港币' : '港幣')}} {{detailInfo.reserve_fee | formatMoney(0, '')}}</span>
                        </div>
                    </div>
                    <div class="order-btn" @click="goProductReserve()">{{simply ? '立即预约' : '立即預約' }}</div>
                </div>
                <div v-if="!detailInfo.stock" class="no-stock-btn">{{simply ? '暫無庫存' : '暂无库存'}}</div>
            </div>
            <div v-if="inApp" class="order-box">
                <div v-if="detailInfo.stock">
                    <div class="deposit">
                        <div class="top-text-box" @click="showCoinTipFn()">
                            <i class="iconfonti coin-tip-icon">&#xe776;</i>
                            <div v-show="showCoinTip" class="coin-tip-box">{{coinTip}}</div>
                            <span style="color: #999999;">Coin:</span>
                            <span :style="{'color': isPro ? '#FF3B23' : '#999999'}">{{inApp ? 'HK$' : (simply ? '港币' : '港幣')}} {{detailInfo.coin_fee | formatMoney(0, '')}}</span>
                        </div>
                        <div v-if="!isPro" class="pro-coin-tip-text" @click="appFn.goProPage()">{{simply ? '升级Pro可获取' : '升级Pro可獲取'}}</div>
                    </div>
                    <div v-if="(!isPro && !detailInfo.is_pro) || isPro" class="order-btn">
                        <span class="left" @click="goProductReserve()">{{simply ? '帮客户预约' : '幫客戶預約'}}</span>
                        <span class="right" @click="getShareData()">立即分享</span>
                    </div>
                    <div v-if="!isPro && detailInfo.is_pro" class="order-btn upgrade-btn" @click="appFn.goProPage()">{{simply ? 'Pro专属，立即升级' : 'Pro專屬，立即升級'}}</div>
                </div>
                <div v-if="!detailInfo.stock" class="no-stock-btn">{{simply ? '更多资讯请联系客服' : '更多資訊請聯絡客服'}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import cmn from "@/components/ibercare/common.js";
import CommonJS from '@/components/shared/service/common.js';
import tranSim from '@/components/shared/language/tranSim.js';

import SelectDropdown from "@/components/shared/component/popup/selectdropdown.vue";
import ExpandDown from "@/components/shared/component/popup/expanddown.vue";
import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import SimpleConsultantCard from "@/components/shared/component/card/simpleconsultant.vue";
import comAgentAvatar from "@/components/component/com_agent_avatar.vue";
import ContactBtn from "@/components/shared/component/card/contactbtn.vue";
import CareOrderListEnter from "@/components/shared/component/card/careorderlistenter.vue";

//小程序环境
let wxSdk = null;
if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
    wxSdk = require('weixin-js-sdk');
}


export default {
    name: "ProductDetail",
    data() {
        return {
            care_product_uuid: this.$route.query['care_product_uuid'] ? this.$route.query['care_product_uuid'] : (this['urlParams'] ? this.urlParams['care_product_uuid'] : ''),
            navbar_height: this.$route.query['navbar_height'] ? parseInt(this.$route.query['navbar_height']) : 0,
            codeStatus: 0,
            isPro: 1,
            isLoaded: false,
            // 滚动顶部距离
            comScrollYScrollTop: 0,
            backIconStyle: {
                'background-color': 'rgba(0, 0, 0, .5)',
                top: this.inApp ? '.28rem' : '.06rem'
            },
            share: {},
            shareSetting: {
                hide_platform: [],
                language: 'auto',
                auth: 'force',
                card: 'full',
                comment: 'null',
                moreShare: 'null'
            },
            // 选中的tab栏
            tabType: 'goodsInfo',
            // 显示选中的tab栏状态
            showFocus: true,
            // 显示coin提示
            showCoinTip: false,
            // 点击显示大图对象
            comAARData: {
                layer: 0,
                name: "comAARData",
                id: "",
                url: ""
            },
            coinTip: simply ? 'Coin为分享不可见，升级Pro的iBer会员可获取全部订单产生的Coin，每个月的Coins结算会于隔个月后转账／寄出支票。' : 'Coin為分享不可見，升級Pro的iBer會員可獲取全部訂單產生的Coin，每個月的Coins結算會於隔個月後轉帳／寄出支票。',
            detailInfo: {
                banner_img: '',
                name: '',
                is_pro: 1,
                price: 0,
                abstract: '',
                pharmaceutical_factory: '',
                company: {
                    img: '',
                    title: '',
                    care_product_categories: []
                },
                stores: [{
                    name: '',
                    addr: '',
                    business_hours: []
                }],
                reserve_fee: 0, // 定金
                coin_fee: 0, // 佣金
                stock: 1,
                collect_status: 1,
                content: '',
                attachments: [{
                    name: "",
                    url: ""
                }],
                agentInfo: {
                    avatar: "",
                    base64_qrcode: "",
                    name: "",
                    uuid: ""
                },
            },
            c_user_uuid: null
        };
    },
    components: {
        SelectDropdown,
        ExpandDown,
        ConsultantCard,
        SimpleConsultantCard,
        comAgentAvatar,
        ContactBtn,
        CareOrderListEnter,
    },
    created() {
        this.$root.blueLoadingParams.show = false;
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: true, // 分享上报，不上报可不传
            care_product_uuid: this.care_product_uuid,
            target_type: '61',
            router: window.location.pathname,
            url: '',
        };

        // 改变顶部icon位置
        this.backIconStyle.top = this.inApp ? '.' + (this.navbar_height < 4 ? ('0' + (this.navbar_height + 6)) : this.navbar_height + 6) + 'rem' : '.06rem';

        // 获取公共用户信息
        this.getUserInfoFn();
        // 获取疾病詳情
        this.getDetailInfo();
        // 刷新产品详情
        this.reloadDetailInfo();

        this.getRootUserInfo().then((auth) => {
            this.c_user_uuid = auth.c_user_uuid;
        });
    },
    mounted() {
        // 隐藏coin提示事件
        this.hideTipFn();
    },
    destroyed() {
        window.isReportReady = false;
    },
    methods: {
        hideTipFn() {
            const _this = this;
            document.querySelector('.com-scroll-y').onclick = function(event) {
                if ((event.target.className.indexOf('top-text-box') === -1) && (event.target.className.indexOf('tip-box') === -1)) {
                    _this.showCoinTip = false;
                }
            };
        },
        showCoinTipFn() {
            this.showCoinTip = !this.showCoinTip;
        },
        // 获取公共用户信息
        getUserInfoFn() {
            if (!this.inApp) {
                let firstReportParam = {
                    care_product_uuid: this.care_product_uuid
                };
                this.userUuid && this.getRootUserInfo(firstReportParam).finally(() => {
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    // 浏览上报
                    CommonJS.readReport(this.share);
                    // 顶部消息提醒
                    this.$root.getAgentMsg();
                });
            }
        },
        // 获取产品详情
        getDetailInfo() {
            this.$root.blueLoadingParams.show = true;
            this.$http.get('/iber-care/product-detail', {
                care_product_uuid: this.care_product_uuid
            }).then(res => {
                // *** 测试数据 ***
                // res.code = 2002; // 2002 产品已下架状态 后台直接返回code
                // *** 测试数据 ***
                this.codeStatus = res.code;
                res.extra && (this.isPro = res.extra.is_pro);
                if (res && res.code === 0) {
                    this.detailInfo = res.data.detail;
                    this.detailInfo.abstracts = this.detailInfo.abstract.split('\n');
                    this.detailInfo.agentInfo = res.data.user_info;
                    document.title = this.detailInfo.name;
                    this.detailInfo.content = this.detailInfo.content + (this.simply ? '!care-cn' : '!care-tw');

                    // *** 测试数据 ***
                    // this.detailInfo.pharmaceutical_factory = '丹麥諾和諾德';
                    // this.detailInfo.is_pro = 0;
                    // this.detailInfo.stock = 1;
                    // this.detailInfo.collect_status = 1;
                    // this.isPro = 0;
                    // *** 测试数据 ***

                    // 2001 产品暂时无法预约（H5页面用户查看非pro用户的pro产品时显示无法预约提示）
                    if (!this.inApp && !this.isPro && this.detailInfo.is_pro) {
                        this.codeStatus = 2001;
                    }
                    // 2003 产品库存不足（H5页面用户查看产品库存不足时显示无法预约提示）
                    if (!this.inApp && !this.detailInfo.stock) {
                        this.codeStatus = 2003;
                    }
                    // 设置分享信息
                    this.share.title = res.data.share.title;
                    this.share.thumbImage = res.data.share.thumbImage;
                    this.share.desc = res.data.share.desc;
                    this.share.url = window.location.origin + window.location.pathname + '?care_product_uuid=' + this.care_product_uuid + '&user_uuid=' + this.userUuid + '&target_type=' + this.share.target_type + '&one_way=' + this.userUuid;
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                } else if (res && (res.code === 1000)) {
                    window.location.href = window.baseUrl + '/error/notfound?tip=' + res['msg'] + '&in_app=' + (this.inApp ? 1 : 0) + '&show_back=1&back_fn=careProductBack&navbar_height=' + this.navbar_height + '&language=' + this.lang;
                } else if (res && (res.code === 2002)) {
                    if (this.inApp) {
                        window.location.href = window.baseUrl + '/error/soldout?tip=' + res['msg'] + '&in_app=' + (this.inApp ? 1 : 0) + '&show_back=1&back_fn=careProductBack&navbar_height=' + this.navbar_height + '&language=' + this.lang;
                    } else {
                        this.$root.blueLoadingParams.show = false;
                        this.isLoaded = true;
                    }
                }
            }, err => {
                this.$root.pageLoading.layer = 2;
            });
        },
        // 刷新产品详情
        reloadDetailInfo() {
            const _this = this;
            window.reloadDetailInfo = function() {
                _this.getDetailInfo();
            }
        },
        // 滚动事件
        scrollFn(event) {
            // 顶部banner的高度，会变化
            let imgBannerHeight = this.$refs.imgBanner.clientHeight;
            // 顶部banner图片的高度，不会变化
            let bannerImgHeight = this.$refs.bannerImg.clientHeight;
            // 当前滚动位置
            let scrollTop = event.target.scrollTop;
            // tab栏高度
            let tabsHeight = this.$refs.topTabs.clientHeight;
            // 顶部按钮元素
            let backIcon = this.$refs.backIcon;
            let collectIcon = this.$refs.collectIcon;
            // banner框的高度会随着滚动缩小或者变大，最大不会超过图片实际高度，最小为0
            let imgBannerNewHeight = bannerImgHeight - scrollTop;
            // 设置banner框的高度
            // this.$refs.imgBanner.style.height = ((imgBannerNewHeight > 0) ? imgBannerNewHeight : 0) + 'px';
            // this.$refs.bannerImg.style.transform = 'translateY(' + (scrollTop / 2 <= 30 ? scrollTop : 30) + 'px)';
            // tab栏的透明度
            let tabOpacity = scrollTop / (bannerImgHeight * (1 / 2) - tabsHeight);
            // 顶部按钮透明度
            let backIconOpacity = 0.5 - 0.5 * tabOpacity;
            this.comScrollYScrollTop = scrollTop;
            // tab栏的透明度处理
            if (tabOpacity >= 0.95) {
                tabOpacity = 0.95;
                // 改变顶部按钮颜色
                backIcon && (backIcon.style.color = '#2A2A2A');
                collectIcon && (collectIcon.style.color = '#FF4416');
            } else {
                // 改变顶部按钮颜色
                backIcon && (backIcon.style.color = '#FFFFFF');
                collectIcon && (collectIcon.style.color = '#FFFFFF');
            }
            this.$refs.topTabs.style.opacity = tabOpacity;
            // 顶部按钮透明度处理
            (backIconOpacity > 0.5) && (backIconOpacity = 0.5);
            (backIconOpacity < 0) && (backIconOpacity = 0);
            this.backIconStyle = {
                'background-color': 'rgba(0, 0, 0, ' + backIconOpacity + ')',
                top: this.inApp ? '.' + (this.navbar_height < 4 ? ('0' + (this.navbar_height + 6)) : this.navbar_height + 6) + 'rem' : '.06rem'
            };
            // 滑到顶部时处理tab栏高度
            this.$refs.topTabs.style.height = (scrollTop === 0 ? 0 : (this.inApp ? '.' + (this.navbar_height + 44) + 'rem' : '0.44rem'));
            scrollTop === 0 && (this.$refs.topTabs.style.opacity = 0);
            this.autoFocus();
        },
        // 切换到对应内容
        goTabContent(selector) {
            if (this.showFocus) {
                this.showFocus = false;
                this.tabType = selector;
                const anchor = this.$el.querySelector('#' + selector);
                const goOrderList = document.querySelector('#goOrderList');
                let scrollTop = this.$el.querySelector('.com-scroll-y').scrollTop;
                let offsetTop = anchor.offsetTop + this.$refs.imgBanner.clientHeight - this.$refs.topTabs.clientHeight + (goOrderList ? goOrderList.clientHeight : 0);
                (selector === 'goodsInfo') && (offsetTop = 0);
                let maxTimes = Math.abs(offsetTop - scrollTop);
                let times = 0;
                let timer = setInterval(() => {
                    times += 70;
                    this.$el.querySelector('.com-scroll-y').scrollTop = offsetTop >= scrollTop ? (scrollTop + times) : (scrollTop - times);
                    if (times > maxTimes) {
                        this.showFocus = true;
                        clearInterval(timer);
                        this.$el.querySelector('.com-scroll-y').scrollTop = offsetTop;
                    }
                }, 1);
            }
        },
        // 自动定位到对应tab页
        autoFocus() {
            if (this.showFocus) {
                const goOrderList = document.querySelector('#goOrderList');
                const clientHeight = this.$refs.imgBanner.clientHeight - this.$refs.topTabs.clientHeight + (goOrderList ? goOrderList.clientHeight : 0);
                const goodsInfo = this.$el.querySelector('#goodsInfo').offsetTop + clientHeight;
                const goodsStore = this.$el.querySelector('#goodsStore').offsetTop + clientHeight;
                const goodsDetail = this.$el.querySelector('#goodsDetail').offsetTop + clientHeight;
                const goodsAttachments = this.$el.querySelector('#goodsAttachments').offsetTop + clientHeight;
                const comScrollY = this.$el.querySelector('.com-scroll-y');
                const scrollTop = comScrollY.scrollTop;
                if (scrollTop < goodsStore) {
                    this.tabType = 'goodsInfo';
                } else if ((scrollTop >= goodsStore) && (scrollTop < goodsDetail)) {
                    this.tabType = 'goodsStore';
                } else if ((scrollTop >= goodsDetail) && (scrollTop < goodsAttachments)) {
                    this.tabType = 'goodsDetail';
                } else {
                    this.tabType = 'goodsAttachments';
                }
                // 滑倒最底部时，默认选中最后一个
                if (scrollTop === (comScrollY.scrollHeight - comScrollY.clientHeight)) {
                    if (this.inApp) {
                        this.tabType = 'goodsAttachments';
                    } else {
                        this.tabType = 'goodsDetail';
                    }
                }
            }
        },
        // app内后退
        goBack() {
            this.appFn.commonFn('careProductBack');
        },
        // 收藏
        saveProduct() {
            this.appFn.commonFn('saveProduct', { status: this.detailInfo.collect_status });
        },
        // 打开客户服务卡
        openServiceCard() {
            if (this.inApp) {
                this.appFn.commonFn('openServiceCard');
                return;
            }
            this.goConsultAgent();
        },
        // 諮詢
        goConsultAgent() {
            //小程序
            if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
                let params = {
                    user_uuid: this.userUuid,
                    answer_uuid: this.$root.agentCardInfo.targetUuid,
                    from_type: this.$root.fromType
                }
                plug.authAddress(params);
                return;
            }
            //打开留言流程弹窗
            plug.openGuestBook({
                object: this,
                wx_qrcode: window.agentInfo.wx_qrcode,
                wechat_num: window.agentInfo.wechat_num
            });
        },
        // 跳转地图
        openMap(addr) {
            //小程序
            if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
                wxSdk.miniProgram.navigateTo({
                    url: "/pages/frame/map?address=" + tranSim.simplized(addr)
                });
                return;
            }
            // 这里的url需要根据不同平台做适配，https://lbs.qq.com/guides/startup.html 列出了所有可用的 api 
            // 目前使用的是 webservice  ，android可能需要使用 H5
            let url = '';
            if (this.inApp && this.$root.isAndroid) {
                url = 'https://apis.map.qq.com/tools/poimarker?type=1&keyword=' + tranSim.simplized(addr) + '&region=香港&key=PSRBZ-LREKQ-4EV56-GZBHY-6LL5T-CVFJN&referer=iBer';
                console.log(url);
            } else {
                url = 'https://apis.map.qq.com/uri/v1/search?keyword=' + tranSim.simplized(addr) + '&region=香港&referer=PSRBZ-LREKQ-4EV56-GZBHY-6LL5T-CVFJN';
            }
            if (this.inApp) {
                this.appFn.commonFn('openMap', {
                    url: url,
                    name: addr
                });
            } else {
                window.location.href = url;
            }
        },
        // 跳转附件详情
        goAnnexDetail(item) {
            // 优先附件链接
            if (item.url) {
                if (this.inApp) {
                    this.appFn.openFile(item.url);
                } else {
                    this.$root.blueLoadingParams.show = true;
                    const a = document.createElement('a');
                    a.setAttribute('download', '');
                    a.setAttribute('href', item.url);
                    a.click();
                }
                return;
            }
            // 页面链接
            if (item.link_url) {
                if (this.inApp) {
                    // android终端打开附件链接跳转外部浏览器
                    if (this.$root.isAndroid && /.pdf|.doc|.docx|.ppt|.pptx|.xls|.xlsx/ig.test(item.link_url)) {
                        this.appFn.openBrowser(item.link_url);
                    } else {
                        let param = {
                            is_sapp: false, // 是否是sapp
                            sapp_uuid: '', // sapp的uuid
                            page_type: 2, // 1:原生，2:h5
                            page_h5_title: '', // h5页面的标题
                            page_url: item.link_url, // page链接
                            page_params: {} // page参数
                        };
                        this.appFn.goPage(param);
                    }
                } else {
                    window.location.href = item.link_url;
                }
            }
        },
        // 跳转集团下所有医疗产品
        goCareCompanyProduct() {
            //小程序
            if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
                cmn.miniPagePath({
                    object: this,
                    route: "/pages/frame/list",
                    path: "/iber-care/company-product",
                    title: plug.sm(this.simply, '全部产品'),
                    query: {
                        user_uuid: this.userUuid,
                        care_company_uuid: this.detailInfo.company.uuid,
                        language: this.lang
                    }
                });
                return;
            }

            if (!this.inApp) {
                window.location.href = window.baseUrl + '/iber-care/company-product?care_company_uuid=' + this.detailInfo.company.uuid + '&user_uuid=' + this.userUuid + '&in_app=' + (this.inApp ? 1 : 0) + '&auth=' + window.auth + '&card=' + this.card + '&language=' + this.lang;
            } else {
                this.appFn.commonFn('allProduct', {
                    care_company_uuid: this.detailInfo.company.uuid
                });
            }
        },
        // 跳转集团详情
        goCareCompanyDetail() {
            //小程序
            if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
                cmn.miniPagePath({
                    object: this,
                    route: "/pages/frame/detail",
                    path: "/iber-care/company-detail",
                    title: plug.sm(this.simply, this.detailInfo.company.title),
                    query: {
                        user_uuid: this.userUuid,
                        care_company_uuid: this.detailInfo.company.uuid,
                        care_company_name: this.detailInfo.company.title,
                        language: this.lang
                    }
                });
                return;
            }
            if (!this.inApp) {
                window.location.href = window.baseUrl + '/iber-care/company-detail?care_company_uuid=' + this.detailInfo.company.uuid + '&user_uuid=' + this.userUuid + '&in_app=' + (this.inApp ? 1 : 0) + '&auth=' + window.auth + '&card=' + this.card + '&language=' + this.lang;
            } else {
                this.appFn.commonFn('productDetail', {
                    care_company_uuid: this.detailInfo.company.uuid,
                    care_company_name: this.detailInfo.company.title
                });
            }
        },
        // 客户端下载图片
        downloadCard(url) {
            if (this.inApp) {
                this.appFn.commonFn('saveImageAlbum', {
                    imgUrl: url
                });
                return;
            }
            if (plug.wx.platform) {
                plug.wxAlbum(url, 0);
                return;
            }
            this.comAARData.url = url;
            this.comAARData.layer = 1;
        },
        // 预览图片
        openAvatar(url) {
            if (this.inApp) {
                plug.getAgentAlbum(url, 0);
                return;
            }
            if (plug.wx.platform) {
                plug.wxAlbum(url, 0);
                return;
            }
            this.comAARData.url = url;
            this.comAARData.layer = 1;
        },
        // 调起app分享
        getShareData() {
            this.appFn.shareFn(this.share, this.setting);
        },
        // 生成长图（无底部名片）
        drawLongImage(imgUrl, type) {
            if (this.inApp) {
                this.$root.blueLoadingParams.show = true;
                const _this = this;
                const canvas = document.createElement('canvas');
                const imgBg = new Image();
                imgBg.setAttribute("crossOrigin", 'Anonymous');
                imgBg.src = imgUrl;
                imgBg.onload = function() {
                    const longImgTop = new Image();
                    longImgTop.setAttribute("crossOrigin", 'Anonymous');
                    longImgTop.src = _this.simply ? 'https://static.iberhk.com/v2/web/images/iber_care/long-img-top-cn.png' : 'https://static.iberhk.com/v2/web/images/iber_care/long-img-top-tw.png';
                    longImgTop.onload = function() {
                        const qrcode = new Image();
                        qrcode.setAttribute("crossOrigin", 'Anonymous');
                        qrcode.src = _this.detailInfo.agentInfo.base64_qrcode;
                        qrcode.onload = function() {
                            canvas.width = imgBg.width;
                            // 长图高度是特色图和底部名片加起来的总长
                            canvas.height = imgBg.height;
                            let ctx = canvas.getContext('2d');
                            // 背景图像加载后画到canvas画布上 
                            // 绘制特色图
                            ctx.drawImage(imgBg, 0, 0, imgBg.width, imgBg.height);
                            // 绘制顶部说明
                            ctx.drawImage(longImgTop, 0, 0, longImgTop.width, longImgTop.height);
                            // 绘制顶部二维码
                            ctx.drawImage(qrcode, imgBg.width - 128 - 32, 26, 128, 128);
                            // 打开图片
                            !type && _this.openAvatar(canvas.toDataURL("image/jpeg"));
                            // 下载图片
                            (type === 'download') && _this.downloadCard(canvas.toDataURL("image/jpeg"));
                            console.log(canvas.toDataURL("image/jpeg"));
                            _this.$root.blueLoadingParams.show = false;
                        }
                    }
                }
            }
        },
        // 跳转预约表
        goProductReserve() {
            //小程序
            if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
                cmn.miniPagePath({
                    object: this,
                    route: "/pages/ibercare/reserve",
                    path: "/iber-care/product-reserve",
                    title: plug.sm(this.simply, '报名预约'),
                    query: {
                        care_product_uuid: this.care_product_uuid,
                        user_uuid: this.userUuid,
                        in_app: 0,
                        auth: window.auth,
                        card: this.card
                    }
                });
                return;
            }

            if (this.inApp) {
                this.appFn.commonFn('productSubscribe', {
                    care_product_uuid: this.care_product_uuid,
                });
            } else {
                // 当前路径存在sessionStorage
                // sessionStorage.setItem('product_reserve_redirct_url', window.location.href);
                // this.$router.push({
                //     path: '/iber-care/product-reserve',
                //     query: {
                //         care_product_uuid: this.care_product_uuid,
                //         user_uuid: this.userUuid,
                //         in_app: 0,
                //         auth: window.auth,
                //         card: this.card
                //     }
                // });
                window.location.href = window.baseUrl + '/iber-care/product-reserve?care_product_uuid=' + this.care_product_uuid + '&user_uuid=' + this.userUuid + '&in_app=0&auth=' + window.auth + '&card=' + this.card + '&language=' + this.lang;
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.separate-line {
    width: 100%;
    height: 0;
    border-top: 1px solid #E8E8E8;
}

.goods-detail {
    font-family: PingFangSC-Regular;
    width: 100%;
}

.goods-detail .detail-content {
    width: 100%;
    /* padding-bottom: 1.2rem; */
    background-color: #F6F6F6;
}

.detail-content-wrapper {
    width: 100%;
    height: 1.2rem;
    background-color: #F6F6F6;
}

.goods-detail .detail-error-content {
    background-color: #FFFFFF;
}

.goods-detail .banner {
    width: 100%;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.goods-detail .banner img {
    width: 100%;
}

.detail-info {
    padding: .16rem;
}

.detail-info .title {
    width: 100%;
    font-family: PingFangSC-Medium;
    font-size: .18rem;
    color: #2A2A2A;
    line-height: .22rem;
}

.detail-info .title .pro {
    margin-top: .03rem;
    display: inline-block;
    vertical-align: top;
    width: .24rem;
    height: .14rem;
    border: .01rem solid #FF9613;
    border-radius: .04rem;
    text-align: center;
    font-family: PingFangSC-Semibold;
    font-size: .11rem;
    color: #FF9613;
    line-height: .13rem;
    box-sizing: content-box;
}

.detail-info .title .pro-icon {
    font-size: .14rem;
    color: #FF9613;
    position: absolute;
    line-height: .2rem;
    left: 0;
    top: 0;
}

.detail-info .money {
    width: 100%;
    font-size: .13rem;
    color: #FF4416;
    line-height: .16rem;
    margin-top: .06rem;
}

.detail-info .money .num {
    font-family: PingFangSC-Semibold;
    font-size: .22rem;
    color: #FF4416;
    line-height: .27rem;
}

.detail-info .desc {
    width: 100%;
    font-size: .14rem;
    color: #666666;
    line-height: .19rem;
    margin-top: .06rem;
}

.detail-info .factory {
    width: 100%;
    font-size: .14rem;
    color: #666666;
    line-height: .17rem;
    padding-top: .12rem;
    border-top: 1px solid #E8E8E8;
    margin-top: .12rem;
}

.goods-detail .tabs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    line-height: .44rem;
    background-color: rgba(255, 255, 255, .95);
    opacity: 0;
    display: flex;
    z-index: 100;
    transition: all 300ms;
    overflow: hidden;
}

.goods-detail .tabs .tab-li {
    flex: 1;
    text-align: center;
    cursor: pointer;
    font-size: .15rem;
    color: #999999;
}

.goods-detail .tabs .tab-li.current {
    color: #2A2A2A;
}

.goods-detail .tabs .tab-li .text {
    display: inline-block;
}

.goods-detail .tabs .tab-li.current .text {
    font-weight: bold;
}

.back-icon-box {
    position: absolute;
    left: .16rem;
    top: .06rem;
    width: .32rem;
    height: .32rem;
    line-height: .32rem;
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .5);
    padding-left: .01rem;
    z-index: 101;
    transition: all 200ms;
}

.back-icon-box .back-icon {
    color: rgba(255, 255, 255, 1);
    font-size: .22rem;
    transition: all 200ms;
    cursor: pointer;
    display: inline-block;
}

.collect-icon-box {
    left: auto;
    right: .16rem;
}

.tab-content {
    width: 100%;
}

.tab-content-page {
    width: 100%;
    background-color: #FFFFFF;
    margin-bottom: .1rem;
}

.tab-content-page-title {
    font-family: PingFangSC-Medium;
    height: .5rem;
    line-height: .46rem;
    font-size: .15rem;
    color: #333333;
    padding: 0 .16rem;
}

.tab-content-page-title span {
    display: inline-block;
    vertical-align: middle;
}

.tab-content-page-title-separate {
    width: .04rem;
    height: .16rem;
    background-color: #3364E4;
}

.tab-content-detail {
    width: 100%;
    font-size: .14rem;
    color: #999999;
    line-height: .17rem;
    margin-bottom: .1rem;
}

.group-box {
    width: 100%;
    overflow: hidden;
    padding: 0 .16rem .16rem .16rem;
}

.group-box img {
    width: .32rem;
    height: .32rem;
    float: left;
}

.group-box .text-box {
    float: left;
    max-width: calc(100% - 1.6rem);
    margin-left: .04rem;
}

.group-box .text-box .title {
    width: 100%;
    font-size: .13rem;
    color: #2A2A2A;
    line-height: .16rem;
    max-height: .32rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.group-box .text-box .tags {
    width: 100%;
    font-size: .11rem;
    color: #999999;
    line-height: .14rem;
    max-height: .28rem;
    margin-top: .04rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.all-goods-btn {
    position: absolute;
    top: 0;
    right: .77rem;
    width: .56rem;
    height: .2rem;
    line-height: .2rem;
    border: 1px solid #3364E4;
    border-radius: .11rem;
    text-align: center;
    font-size: .1rem;
    color: #3364E4;
    box-sizing: border-box;
    cursor: pointer;
    margin-top: .01rem;
}

.go-detail-btn {
    position: absolute;
    top: 0;
    right: .16rem;
    width: .56rem;
    height: .2rem;
    line-height: .2rem;
    background-color: #3364E4;
    border-radius: .11rem;
    text-align: center;
    font-size: .1rem;
    color: #FFFFFF;
    margin-left: .05rem;
    cursor: pointer;
    margin-top: .01rem;
}

.store-box {
    width: 100%;
    padding-bottom: .12rem;
    font-size: .13rem;
    color: #999999;
    line-height: .18rem;
    overflow: hidden;
    cursor: pointer;
}

.store-box .name {
    font-size: .15rem;
    color: #2A2A2A;
    line-height: .2rem;
}

.store-box .name i {
    color: #3364E4;
    font-size: .2rem;
}

.store-box .addr {
    margin-top: .09rem;
    overflow: hidden;
}

.store-box .addr .left {
    float: left;
}

.store-box .addr .right {
    float: right;
    width: calc(100% - .7rem);
}

.promotional-img {
    width: 100%;
    height: auto;
    min-height: 2rem;
    background-color: #FFFFFF;
}

.annex-list {
    padding: 0 .12rem;
    font-size: .14rem;
    color: #2A2A2A;
    line-height: .17rem;
}

.annex-list li {
    padding: .12rem 0;
    cursor: pointer;
}

.annex-list li img {
    width: .22rem;
    height: .22rem;
    float: right;
    margin-top: -.03rem;
    cursor: pointer;
}

.attachment-name {
    display: inline-block;
    vertical-align: middle;
    max-width: calc(100% - .3rem);
}

.special-box {
    width: 100%;
}

.long-img-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
}

.special-qrcode {
    position: absolute;
    top: .13rem;
    right: .16rem;
    width: .64rem;
    z-index: 2;
}

.service-btn {
    position: absolute;
    right: .08rem;
    bottom: .7rem;
    z-index: 1;
    width: .46rem;
    height: .46rem;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.80);
    box-shadow: 0 .01rem .06rem 0 rgba(0, 0, 0, 0.16);
    font-size: .1rem;
    color: #3364E4;
    line-height: .12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    z-index: 10;
}

.service-btn i {
    font-size: .2rem;
    line-height: .2rem;
}

.service-btn span {
    display: inline-block;
    margin-top: .02rem;
}

.bottom-order-box {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: .54rem;
    background-color: #FFFFFF;
    font-size: .15rem;
    color: #2A2A2A;
    line-height: .18rem;
}

.order-box {
    padding: .08rem .16rem;
}

.order-box .deposit {
    line-height: .18rem;
    height: .38rem;
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.order-box .deposit .money {
    color: #FF3B23;
    line-height: .18rem;
}

.order-box .deposit .top-text-box {
    cursor: pointer;
}

.order-box .coin-tip-icon {
    color: #BBBBBB;
    font-size: .14rem;
}

.order-box .order-btn {
    float: right;
    width: 1.94rem;
    height: .38rem;
    line-height: .38rem;
    border-radius: .19rem;
    background-color: #3364E4;
    text-align: center;
    font-size: .14rem;
    color: #FFFFFF;
    cursor: pointer;
}

.order-box .order-btn .left {
    float: left;
    width: 50%;
}

.order-box .order-btn .right {
    float: right;
    width: 50%;
    background-color: #4579FF;
    border-radius: 0 .19rem .19rem 0;
}

.order-box .no-stock-btn {
    width: 100%;
    height: .38rem;
    line-height: .38rem;
    border-radius: .19rem;
    background-color: #BBBBBB;
    text-align: center;
    font-size: .14rem;
    color: #FFFFFF;
}

.order-box .pro-coin-tip-text {
    font-size: .12rem;
    color: #FCA217;
    line-height: .15rem;
    margin-top: .04rem;
    cursor: pointer;
}

.order-box .upgrade-btn {
    background-image: linear-gradient(270deg, #F99200 0%, #FFBA3D 100%);
}

.coin-tip-box {
    position: absolute;
    top: -.85rem;
    left: 4%;
    width: 2.6rem;
    height: .64rem;
    padding: .1rem;
    border-radius: .06rem;
    background-color: rgba(0, 0, 0, .6);
    color: #fff;
    z-index: 1;
    /* box-shadow: 0 .01rem .02rem 0 rgba(0, 0, 0, 0.50); */
    font-size: .11rem;
    color: #FFFFFF;
    line-height: .15rem;
    text-align: left;
    cursor: pointer;
}

.coin-tip-box:before {
    position: absolute;
    top: .64rem;
    left: 19%;
    content: '';
    border: .1rem solid transparent;
    border-left-width: .06rem;
    border-right-width: .06rem;
    border-top: .08rem solid rgba(0, 0, 0, .6);
    z-index: 2;
}

.goods-error-box {
    text-align: center;
    /* padding: .6rem 0 1.22rem 0; */
    height: calc(100% - 1.82rem);
    display: flex;
    align-items: center;
    justify-content: center;
}

.goods-error-box img {
    width: 2.8rem;
    height: 2.8rem;
}

.goods-error-box .text {
    width: 100%;
    position: absolute;
    top: calc(50% + .4rem);
    left: 0;
    color: #BBBBBB;
    line-height: .21rem;
}
</style>
