<template>
    <div v-show="isLoaded" class="insurance-product">
        <ul ref="topTabs" class="tabs">
            <li class="tab-li" @click="goTabContent('productDetail')" :class="{'current': tabType === 'productDetail'}">
                <span class="text">{{simply ? ' 详情' : '詳情'}}</span>
            </li>
            <li v-show="productInfo.plans && productInfo.plans.length > 0" class="tab-li" @click="goTabContent('productRight')" :class="{'current': tabType === 'productRight'}">
                <span class="text">{{simply ? '权益' : '權益'}}</span>
            </li>
            <li v-show="productInfo.customer_case && productInfo.customer_case.length > 0" class="tab-li" @click="goTabContent('productCase')" :class="{'current': tabType === 'productCase'}">
                <span class="text">案例</span>
            </li>
            <li v-show="productInfo.common_question && productInfo.common_question.length > 0" class="tab-li" @click="goTabContent('productQuestion')" :class="{'current': tabType === 'productQuestion'}">
                <span class="text">{{simply ? '疑问' : '疑問'}}</span>
            </li>
            <li v-show="inApp" class="tab-li" @click="goTabContent('productAttachments')" :class="{'current': tabType === 'productAttachments'}">
                <span class="text">附件</span>
            </li>
        </ul>
        <div ref="productContent" class="product-content com-scroll-y" @scroll="scrollFn">
            <!-- 长图示例 -->
            <!-- <img id="longImg" src="" width="100%"> -->
            <div ref="imgBanner" class="banner">
                <img v-if="productInfo.picture && (productInfo.picture.length > 0)" ref="bannerImg" :src="productInfo.picture[0]">
                <div v-if="productInfo.abstract" class="introduction">{{productInfo.abstract}}</div>
                <ul v-if="productInfo.tags && productInfo.tags.length > 0" class="characteristics com-nowrap">
                    <li class="characteristics-block" v-for="(item, index) in productInfo.tags" :key="index">{{item}}</li>
                </ul>
            </div>
            <ul class="tab-content">
                <li id="productDetail" class="tab-content-page">
                    <div class="tab-content-page-title">
                        <span class="tab-content-page-title-separate"></span>
                        <span>基本信息</span>
                    </div>
                    <ul class="product-detail">
                        <li v-if="productInfo.company" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '所属公司' : '所屬公司'}}</div>
                            <div class="right" :style="{'color': productInfo.company_web_site && '#3364E4', 'cursor': 'pointer'}" @click="goCompanyLink()">
                                <span class="display-verticle-middle">{{productInfo.company}}</span>
                                <span v-show="this.productInfo.company_web_site" class="display-verticle-middle" style="margin-top: -.02rem;">></span>
                            </div>
                        </li>
                        <li v-if="productInfo.name_en" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '英文简称' : '英文簡稱'}}</div>
                            <div class="right">{{productInfo.name_en}}</div>
                        </li>
                        <li v-if="productInfo.category_name" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '产品类型' : '產品類型'}}</div>
                            <div class="right">{{productInfo.category_name}}</div>
                        </li>
                        <li v-if="productInfo.guarantee_age" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '投保年龄' : '投保年齡'}}</div>
                            <div class="right">{{productInfo.guarantee_age}}</div>
                        </li>
                        <li v-if="productInfo.sale_status" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '产品状态' : '產品狀態'}}</div>
                            <div class="right">{{productInfo.sale_status}}</div>
                        </li>
                        <li v-if="productInfo.premiun_currency" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '保费币种' : '保費幣種'}}</div>
                            <div class="right">{{productInfo.premiun_currency}}</div>
                        </li>
                        <li v-if="productInfo.renewal_perion" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '缴费年限' : '繳費年限'}}</div>
                            <div class="right">{{productInfo.renewal_perion}}</div>
                        </li>
                        <li v-if="productInfo.guarantee_period" class="product-detail-block clearfix">
                            <div class="left">保障期</div>
                            <div class="right">{{productInfo.guarantee_period}}</div>
                        </li>
                        <li v-if="productInfo.payment_method" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '缴付方式' : '繳付方式'}}</div>
                            <div class="right">{{productInfo.payment_method}}</div>
                        </li>
                        <li v-if="productInfo.premiun_model" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '保费模式' : '保費模式'}}</div>
                            <div class="right">{{productInfo.premiun_model}}</div>
                        </li>
                        <li v-if="productInfo.calm_period" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '冷静期' : '冷靜期'}}</div>
                            <div class="right">{{productInfo.calm_period}}</div>
                        </li>
                        <li v-if="productInfo.death_compensation" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '身故赔偿' : '身故賠償'}}</div>
                            <div class="right">{{productInfo.death_compensation}}</div>
                        </li>
                        <li v-if="productInfo.waiting_period" class="product-detail-block clearfix">
                            <div class="left">等候期</div>
                            <div class="right">{{productInfo.waiting_period}}</div>
                        </li>
                        <li v-if="productInfo.min_insurance_limit" class="product-detail-block clearfix">
                            <div class="left">{{simply ? '最低保额' : '最低保額'}}</div>
                            <div class="right">{{productInfo.min_insurance_limit}}</div>
                        </li>
                    </ul>
                    <div v-if="productInfo.special && (productInfo.special.length > 0)" class="special-box">
                        <img v-for="(item, index) in productInfo.special" :key="index" class="promotional-img" :src="item" @click="drawShareLongImage(item)">
                        <img class="special-qrcode" :src="productInfo.agentInfo.base64_qrcode">
                    </div>
                </li>
                <li id="productRight" class="tab-content-page" :style="{'height': (productInfo.plans && productInfo.plans.length > 0) ? 'auto' : 0, 'margin-bottom': (productInfo.plans && productInfo.plans.length > 0) ? '.1rem' : 0}">
                    <div class="tab-content-page-title">
                        <span class="tab-content-page-title-separate"></span>
                        <span>{{simply ? '保障权益' : '保障權益'}}</span>
                    </div>
                    <select-dropdown :data="productInfo.planChilds" :default="productInfo.planUuid" @updateData="updatePlans"></select-dropdown>
                    <expand-down :data="productInfo.defaultRight" :title="'title'" :desc="'content'" :mark="'premium'"></expand-down>
                </li>
                <li id="productCase" class="tab-content-page" :style="{'height': (productInfo.customer_case && productInfo.customer_case.length > 0) ? 'auto' : 0, 'margin-bottom': (productInfo.customer_case && productInfo.customer_case.length > 0) ? '.1rem' : 0}">
                    <div class="tab-content-page-title">
                        <span class="tab-content-page-title-separate"></span>
                        <span>{{simply ? '产品案例' : '產品案例'}}</span>
                    </div>
                    <div v-if="productInfo.customer_case && (productInfo.customer_case.length > 0)" class="special-box">
                        <img v-for="(item, index) in productInfo.customer_case" :key="index" class="promotional-img" :src="item" @click="drawShareLongImage(item)">
                        <img class="special-qrcode" :src="productInfo.agentInfo.base64_qrcode">
                    </div>
                </li>
                <li id="productQuestion" class="tab-content-page" :style="{'height': (productInfo.common_question && productInfo.common_question.length > 0) ? 'auto' : 0, 'margin-bottom': (productInfo.common_question && productInfo.common_question.length > 0) ? '.1rem' : 0}">
                    <div class="tab-content-page-title">
                        <span class="tab-content-page-title-separate"></span>
                        <span>{{simply ? '常见问题' : '常見問題'}}</span>
                    </div>
                    <expand-down :data="productInfo.common_question" :title="'question'" :desc="'answer'"></expand-down>
                </li>
                <li id="productAttachments" class="tab-content-page" :style="{height: inApp ? 'auto': 0, 'margin-bottom': inApp ? '0.1rem': 0, overflow: 'hidden'}">
                    <div class="tab-content-page-title">
                        <span class="tab-content-page-title-separate"></span>
                        <span>{{simply ? '相关附件' : '相關附件'}}</span>
                    </div>
                    <ul class="annex-list">
                        <li v-for="(item, index) in productInfo.attachments" :key="index" @click="goAnnexDetail(item)">
                            <span class="attachment-name com-nowrap">{{item.name}}</span>
                            <img class="display-verticle-middle" src="https://static.iberhk.com/v2/web/images/product/view.png">
                            <!-- <img class="display-verticle-middle" v-if="!item.link_url" src="https://static.iberhk.com/v2/web/images/product/download.png"> -->
                        </li>
                        <li v-show="productInfo.special && productInfo.special.length > 0" @click="drawShareLongImage(productInfo.special[0], 'download')">
                            <span>{{simply ? '特色图' : '特色圖'}}</span>
                            <img src="https://static.iberhk.com/v2/web/images/product/download.png">
                        </li>
                        <li v-show="productInfo.customer_case && productInfo.customer_case.length > 0" @click="drawShareLongImage(productInfo.customer_case[0], 'download')">
                            <span>客戶案例</span>
                            <img src="https://static.iberhk.com/v2/web/images/product/download.png">
                        </li>
                    </ul>
                </li>
            </ul>
            <consultant-card :user-uuid="userUuid" :target-uuid="product_uuid" :share-from="true" :from-type="share.target_type"></consultant-card>
            <disclaimer :text="disclaimer_des"></disclaimer>
        </div>
        <com-agent-avatar :params="comAARData"></com-agent-avatar>
        <contact-btn :user-uuid="userUuid" :target-uuid="product_uuid" :scroll-top="comScrollYScrollTop"></contact-btn>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

import SelectDropdown from "@/components/shared/component/popup/selectdropdown.vue";
import ExpandDown from "@/components/shared/component/popup/expanddown.vue";
import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import comAgentAvatar from "@/components/component/com_agent_avatar.vue";
import Disclaimer from "@/components/shared/component/card/disclaimer.vue";
import ContactBtn from "@/components/shared/component/card/contactbtn.vue";

export default {
    name: "ProductDetail",
    data() {
        return {
            product_uuid: this.$route.query['product_uuid'] ? this.$route.query['product_uuid'] : (this['urlParams'] ? this.urlParams['product_uuid'] : ''),
            isLoaded: false,
            // 滚动顶部距离
            comScrollYScrollTop: 0,
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
            tabType: 'productDetail',
            // 显示选中的tab栏状态
            showFocus: true,
            // 点击显示大图对象
            comAARData: {
                layer: 0,
                name: "comAARData",
                id: "",
                url: ""
            },
            productInfo: {
                agentInfo: {}, // 用户信息
                abstract: '', // 简介
                attachments: [], // 附件
                calm_period: '', // 冷静期
                common_question: [], //常见问题
                company: '', // 所属公司
                company_web_site: '', // 公司网站
                customer_case: [], // 案例
                guarantee_age: '', // 投保年龄
                guarantee_period: '', // 保障年限
                name: '', // 名称
                name_en: '', // 英文名称
                payment_method: '', // 缴付方式
                picture: [], // banner图
                plans: [], // 保障权益计划
                planChilds: [], // 计划名称数组
                planUuid: '', // 计划名称
                defaultRight: [], // 保障权益
                premiun_currency: '', // 保费币种
                premiun_model: '', // 保费模式
                renewal_perion: '', // 缴费年限
                sale_status: '', // 状态
                special: [], // 特色图
                tags: [] // 标签
            },
            disclaimer_des: this.simply ? '免责声明：以上内容仅供参考，实际以保险公司具体规定为准' : '免責聲明：以上內容僅供參考，實際以保險公司具體規定為準',
        };
    },
    components: {
        SelectDropdown,
        ExpandDown,
        ConsultantCard,
        comAgentAvatar,
        Disclaimer,
        ContactBtn,
    },
    created() {
        this.$root.blueLoadingParams.show = true;
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: true, // 分享上报，不上报可不传
            product_uuid: this.product_uuid,
            target_type: '12',
            router: window.location.pathname,
            url: '',
        };
        // 获取公共用户信息
        this.getUserInfoFn();
        // 获取产品詳情
        this.getProductInfo();
        // 提供app分享数据
        this.getShareData();
    },
    mounted() {
        // 向app发送产品对比参数
        this.sendParamToApp();
    },
    methods: {
        // 获取公共用户信息
        getUserInfoFn() {
            if (!this.inApp) {
                let firstReportParam = {
                    product_uuid: this.product_uuid
                };
                this.userUuid && this.getRootUserInfo(firstReportParam).finally(() => {
                    // 小程序内不需要地址申报
                    if (window.__wxjs_environment == "miniprogram" || (window.platform === 7) || /wechatdevtools/.test(navigator.userAgent.toLowerCase())) {
                        // return;
                    } else {
                        // 地址申报
                        this.userUuid && plug.autoDeclare({
                            object: this, //Vue对象或子对象，注意作用域
                            app: this.inApp,
                            user_uuid: this.userUuid //agent ID
                        });
                    }
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
        getProductInfo() {
            this.$root.blueLoadingParams.show = true;
            this.$http.get('/product/detail', {
                product_uuid: this.product_uuid
            }).then(res => {
                if (res && res.extra && res.extra.is_pro === 0) {
                    window.location.href = window.baseUrl + '/error/notfound';
                    return;
                }
                if (res && res.code === 0) {
                    this.productInfo = res.data.detail;
                    this.productInfo.agentInfo = res.data.user_info;
                    // 长图示例
                    // this.drawShareLongImage(this.productInfo.special[0]);
                    // 子计划
                    this.productInfo.planChilds = [];
                    this.productInfo.plans.forEach((item, index) => {
                        this.productInfo.planChilds.push({
                            name: item.name,
                            id: item.uuid
                        });
                    });
                    // 特色图片处理
                    // this.drawLongImage(this.productInfo.special);
                    // 案例图片处理
                    // this.drawLongImage(this.productInfo.customer_case);
                    // 默认计划名称
                    this.productInfo.planUuid = (this.productInfo.plans.length > 0 ? this.productInfo.plans[0].uuid : '');
                    // 默认计划权益
                    this.formatRights();
                    // 提供给app获取参数
                    this.getParamFromH5();
                    // 设置分享信息
                    this.share.title = res.data.share.title;
                    this.share.thumbImage = res.data.share.thumbImage;
                    this.share.desc = res.data.share.desc;
                    this.share.url = window.location.origin + window.location.pathname + '?product_uuid=' + this.product_uuid + '&user_uuid=' + this.userUuid + '&target_type=' + this.share.target_type + '&one_way=' + this.userUuid;
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                    // 向app发送产品对比参数
                    this.sendParamToApp();
                } else if (res && res.code === 1000) {
                    window.location.href = window.baseUrl + '/error/notfound';
                } else {
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                }
            }, err => {
                window.location.href = window.baseUrl + '/error/404';
            });
        },
        // 向app发送产品对比参数
        sendParamToApp() {
            if (this.inApp && !CommonJS.compareVersion(window.apiHeaders['version'], '2.3.2')) {
                setTimeout(() => {
                    this.productInfo.name && this.appFn.commonFn('get_plans', {
                        plans: this.productInfo.plans,
                        product_category_uuid: this.productInfo.product_category_uuid,
                        product_category_uuids: this.productInfo.product_category_uuids,
                        name: this.productInfo.name,
                        product_uuid: this.product_uuid,
                        thumbnail: this.productInfo.thumbnail
                    });
                }, 1000);
            }
        },
        // 提供给app获取参数
        getParamFromH5() {
            this.appFn.getParamFromH5('get_plans', {
                plans: this.productInfo.plans,
                product_category_uuid: this.productInfo.product_category_uuid,
                product_category_uuids: this.productInfo.product_category_uuids,
                name: this.productInfo.name,
                product_uuid: this.product_uuid,
                thumbnail: this.productInfo.thumbnail
            });
        },
        // 更新选择的产品
        updatePlans(event) {
            this.productInfo.planUuid = event.id;
            this.formatRights();
            this.$forceUpdate();
        },
        // 取对应计划的权益
        formatRights() {
            this.productInfo.plans.forEach((item, index) => {
                if (item.uuid === this.productInfo.planUuid) {
                    this.productInfo.defaultRight = item.rights;
                }
            });
        },
        // 跳转公司主页
        goCompanyLink() {
            if (this.productInfo.company_web_site) {
                if (this.inApp) {
                    let param = {
                        is_sapp: false, // 是否是sapp
                        sapp_uuid: '', // sapp的uuid
                        page_type: 2, // 1:原生，2:h5
                        page_h5_title: '', // h5页面的标题
                        page_url: this.productInfo.company_web_site, // page链接
                        page_params: {} // page参数
                    };
                    this.appFn.goPage(param);
                } else {
                    this.$root.blueLoadingParams.show = true;
                    window.location.href = this.productInfo.company_web_site;
                }

            }
        },
        // 滚动事件
        scrollFn(event) {
            let bannerImgHeight = this.$refs.bannerImg.clientHeight;
            let scrollTop = event.target.scrollTop;
            let tabsHeight = this.$refs.topTabs.clientHeight;
            this.comScrollYScrollTop = scrollTop;
            this.$refs.topTabs.style.opacity = scrollTop / (bannerImgHeight - tabsHeight);
            this.$refs.topTabs.style.height = (scrollTop === 0 ? 0 : '0.42rem');
            scrollTop === 0 && (this.$refs.topTabs.style.opacity = 0);
            this.autoFocus();
        },
        // 切换到对应内容
        goTabContent(selector) {
            if (this.showFocus) {
                this.showFocus = false;
                this.tabType = selector;
                const anchor = this.$el.querySelector('#' + selector);
                let scrollTop = this.$el.querySelector('.com-scroll-y').scrollTop;
                let offsetTop = anchor.offsetTop + this.$refs.imgBanner.clientHeight - this.$refs.topTabs.clientHeight + 10;
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
                const clientHeight = this.$refs.imgBanner.clientHeight - this.$refs.topTabs.clientHeight + 10;
                const productDetail = this.$el.querySelector('#productDetail').offsetTop + clientHeight;
                const productRight = this.$el.querySelector('#productRight').offsetTop + clientHeight;
                const productCase = this.$el.querySelector('#productCase').offsetTop + clientHeight;
                const productQuestion = this.$el.querySelector('#productQuestion').offsetTop + clientHeight;
                const productAttachments = this.$el.querySelector('#productAttachments').offsetTop + clientHeight;
                const comScrollY = this.$el.querySelector('.com-scroll-y');
                const scrollTop = comScrollY.scrollTop;
                if (scrollTop < productRight) {
                    this.tabType = 'productDetail';
                } else if ((scrollTop >= productRight) && (scrollTop < productCase)) {
                    this.tabType = 'productRight';
                } else if ((scrollTop >= productCase) && (scrollTop < productQuestion)) {
                    this.tabType = 'productCase';
                } else if ((scrollTop >= productQuestion) && (scrollTop < productAttachments)) {
                    this.tabType = 'productQuestion';
                } else {
                    this.tabType = 'productAttachments';
                }
                // 滑倒最底部时，默认选中最后一个
                if (scrollTop === (comScrollY.scrollHeight - comScrollY.clientHeight)) {
                    if (this.inApp) {
                        this.tabType = 'productAttachments';
                    } else {
                        this.productInfo.plans && this.productInfo.plans.length > 0 && (this.tabType = 'productRight');
                        this.productInfo.customer_case && this.productInfo.customer_case.length > 0 && (this.tabType = 'productCase');
                        this.productInfo.common_question && this.productInfo.common_question.length > 0 && (this.tabType = 'productQuestion');
                    }
                }
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
                    // window.location.href = item.url;
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
        // 增加底部名片的长图
        buildLongImg(url, type) {
            if (this.inApp) {
                let imgUrl = window.apiBaseURL + '/product/build-long-img?user_uuid=' + this.userUuid + '&img_url=' + encodeURIComponent(url);
                if (type === 'download') {
                    this.downloadCard(imgUrl);
                } else {
                    this.openAvatar(imgUrl);
                }
            }
        },
        // 调起app分享
        getShareData() {
            const _this = this;
            window.getShareData = function() {
                _this.appFn.shareFn(_this.share, _this.setting);
            }
        },
        // 生成图片
        createImage(content) {
            // console.log(content);
            const _this = this;
            var blob = _this.base64Img2Blob(content); //new Blob([content]);
            return URL.createObjectURL(blob);
        },
        // base64转成blob对象
        base64Img2Blob(code) {
            var parts = code.split(';base64,');
            var contentType = parts[0].split(':')[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;
            var uInt8Array = new Uint8Array(rawLength);
            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], { type: contentType });
        },
        // canvas绘制圆图
        drawCircleImage(url, callback) {
            const _this = this;
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.setAttribute("crossOrigin", 'Anonymous');
            img.src = url;
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                let ctx = canvas.getContext("2d");
                //获取图片宽高的最小值
                let min = Math.min(img.width, img.height);
                let r = min / 2;
                ctx.fillStyle = ctx.createPattern(img, 'no-repeat');
                ctx.clearRect(0, 0, img.width, img.height);
                ctx.arc(img.width / 2, img.height / 2, r, 0, Math.PI * 2);
                ctx.fill();
                console.log(_this.createImage(canvas.toDataURL("image/jpeg")));
                callback(_this.createImage(canvas.toDataURL("image/jpeg")));
            };
        },
        // 生成长图（有底部名片）
        drawShareLongImage(imgUrl, type) {
            if (this.inApp) {
                this.$root.blueLoadingParams.show = true;
                const _this = this;
                const canvas = document.createElement('canvas');
                const imgBg = new Image();
                imgBg.setAttribute("crossOrigin", 'Anonymous');
                imgBg.src = imgUrl + '?t=' + new Date().getTime();
                imgBg.onload = function() {
                    const agentBg = new Image();
                    agentBg.setAttribute("crossOrigin", 'Anonymous');
                    agentBg.src = 'https://static.iberhk.com/v2/web/images/product/agent_card_bg.png';
                    agentBg.onload = function() {
                        const qrcode = new Image();
                        qrcode.setAttribute("crossOrigin", 'Anonymous');
                        qrcode.src = _this.productInfo.agentInfo.base64_qrcode;
                        qrcode.onload = function() {
                            const avatar = new Image();
                            avatar.setAttribute("crossOrigin", 'Anonymous');
                            avatar.src = _this.productInfo.agentInfo.avatar;
                            avatar.onload = function() {
                                canvas.width = imgBg.width;
                                // 长图高度是特色图和底部名片加起来的总长
                                canvas.height = imgBg.height + agentBg.height;
                                let ctx = canvas.getContext('2d');
                                // 背景图像加载后画到canvas画布上 
                                // 绘制特色图
                                ctx.drawImage(imgBg, 0, 0, imgBg.width, imgBg.height);
                                // 绘制底部名片背景
                                ctx.drawImage(agentBg, 0, imgBg.height, agentBg.width, agentBg.height);
                                // 绘制顶部二维码
                                ctx.drawImage(qrcode, imgBg.width - 88 - 30, 44, 88, 88);
                                // 绘制底部二维码
                                ctx.drawImage(qrcode, 218, imgBg.height + 319, 314, 314);
                                // 绘制底部卡片头像
                                ctx.drawImage(avatar, 321, imgBg.height + 104, 108, 108);
                                // 绘制顶部文字
                                ctx.font = 'normal 20px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = '#BBBBBB';
                                ctx.fillText(_this.simply ? '分享来自【iBer Pro】App' : '分享來自【iBer Pro】App', 375, imgBg.height + 52);
                                // 绘制顶部横线
                                ctx.strokeStyle = '#BBBBBB';
                                ctx.moveTo(148, imgBg.height + 44);
                                ctx.lineTo(238, imgBg.height + 44);
                                ctx.stroke();
                                ctx.moveTo(512, imgBg.height + 44);
                                ctx.lineTo(602, imgBg.height + 44);
                                ctx.stroke();
                                // 绘制底部卡片agent名称
                                ctx.font = 'bold 32px sans-serif';
                                ctx.fillStyle = '#333333';
                                ctx.fillText(_this.productInfo.agentInfo.name, 375, imgBg.height + 268);
                                // 绘制底部文字
                                ctx.font = 'normal 24px sans-serif';
                                ctx.fillStyle = '#BBBBBB';
                                ctx.fillText(_this.simply ? '长按识别 QRcode' : '長按識別 QRcode', 375, imgBg.height + 676);
                                ctx.fillText(_this.simply ? '致力为您提供一对一的保险咨询服务' : '致力為您提供一對一的保險諮詢服務', 375, imgBg.height + 754);
                                // 打开图片
                                !type && _this.openAvatar(canvas.toDataURL("image/jpeg"));
                                // 下载图片
                                (type === 'download') && _this.downloadCard(canvas.toDataURL("image/jpeg"));
                                console.log(canvas.toDataURL("image/jpeg"));
                                // 长图示例
                                // document.getElementById('longImg').src = _this.createImage(canvas.toDataURL("image/jpeg"));
                                _this.$root.blueLoadingParams.show = false;
                            }
                        }
                    }
                }
            }
        },
        // 生成长图（无底部名片）
        drawLongImage(arr) {
            arr.forEach((item, index) => {
                const _this = this;
                const canvas = document.createElement('canvas');
                const imgBg = new Image();
                imgBg.setAttribute("crossOrigin", 'Anonymous');
                imgBg.src = item;
                imgBg.onload = function() {
                    const qrcode = new Image();
                    qrcode.setAttribute("crossOrigin", 'Anonymous');
                    qrcode.src = _this.productInfo.agentInfo.base64_qrcode;
                    qrcode.onload = function() {
                        canvas.width = imgBg.width;
                        // 长图高度是特色图和底部名片加起来的总长
                        canvas.height = imgBg.height;
                        let ctx = canvas.getContext('2d');
                        // 背景图像加载后画到canvas画布上 
                        // 绘制特色图
                        ctx.drawImage(imgBg, 0, 0, imgBg.width, imgBg.height);
                        // 绘制顶部二维码
                        ctx.drawImage(qrcode, imgBg.width - 88 - 30, 44, 88, 88);
                        arr[index] = canvas.toDataURL("image/jpeg");
                    }
                }
            });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.insurance-product {
    width: 100%;
    background-color: #F6F6F6;
}

.insurance-product .product-content {
    width: 100%;
}

.insurance-product .banner {
    width: 100%;
    background-color: #FFFFFF;
    margin-bottom: .1rem;
}

.insurance-product .banner img {
    width: 100%;
}

.insurance-product .introduction {
    width: 100%;
    padding: .12rem .12rem 0 .12rem;
    font-size: .14rem;
    color: #666666;
    line-height: .19rem;
}

.insurance-product .characteristics {
    width: 100%;
    padding: .12rem .12rem .04rem .12rem;
}

.insurance-product .characteristics-block {
    float: left;
    width: auto;
    height: .18rem;
    line-height: .18rem;
    padding: 0 .08rem;
    font-size: .12rem;
    color: #999999;
    border: 1px solid #E8E8E8;
    border-radius: .09rem;
    margin-right: .12rem;
    margin-bottom: .08rem;
}

.insurance-product .tabs {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: .42rem;
    line-height: .40rem;
    background-color: #FFFFFF;
    border-bottom: 1px solid #E8E8E8;
    opacity: 0;
    display: flex;
    z-index: 100;
    transition: all 300ms;
}

.insurance-product .tabs .tab-li {
    flex: 1;
    text-align: center;
    cursor: pointer;
    font-size: .15rem;
    color: #303030;
}

.insurance-product .tabs .tab-li.current {
    color: #3364E4;
    font-weight: bold;
}

.insurance-product .tabs .tab-li .text {
    display: inline-block;
    border-bottom: .02rem solid transparent;
}

.insurance-product .tabs .tab-li.current .text {
    border-bottom: .02rem solid #3364E4;
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
    height: .48rem;
    line-height: .44rem;
    font-size: .16rem;
    color: #333333;
    letter-spacing: 0;
    font-weight: bold;
    padding: 0 .12rem;
}

.tab-content-page-title span {
    display: inline-block;
    vertical-align: middle;
}

.tab-content-page-title-separate {
    width: .04rem;
    height: .16rem;
    background-color: #3364E4;
    margin-right: .04rem;
}

.product-detail {
    width: 100%;
    font-size: .14rem;
    color: #999999;
    line-height: .17rem;
    padding: 0 .12rem;
    margin-bottom: .1rem;
}

.product-detail-block {
    height: auto;
    line-height: .17rem;
    padding: .1rem 0;
}

.product-detail-block .left {
    float: left;
    width: .96rem;
}

.product-detail-block .right {
    float: left;
    width: calc(100% - .96rem);
    color: #2A2A2A;
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

.special-qrcode {
    position: absolute;
    top: .21rem;
    right: .16rem;
    width: .44rem;
}
</style>