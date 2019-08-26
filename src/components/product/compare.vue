<template>
    <div v-show="isLoaded" class="product-compare">
        <div class="row th top-head">
            <div class="td left show-same-box" @click="showSameFn()">
                <img v-show="isShowSame" class="show-same" src="https://static.iberhk.com/v2/web/images/product/hide.png">
                <img v-show="!isShowSame" class="show-same" src="https://static.iberhk.com/v2/web/images/product/show.png">
                <span v-show="isShowSame" class="show-same-text">{{simply ? '隐藏相同' : '隱藏相同'}}</span>
                <span v-show="!isShowSame" class="show-same-text">{{simply ? '显示相同' : '顯示相同'}}</span>
            </div>
            <div class="separate-line"></div>
            <div class="td center" style="margin-left: 1.09rem;">
                <img ref="productImg" :src="productCompare.productInfo.thumbnail1" class="product-img" :style="animateImg">
                <span v-show="productCompare.productInfo.product_name1" style="display: inline-block;">{{productCompare.productInfo.product_name1}}（{{productCompare.productInfo.plan_name1}}）</span>
            </div>
            <div class="separate-line-right"></div>
            <div class="td right">
                <img :src="productCompare.productInfo.thumbnail2" class="product-img" :style="animateImg">
                <span v-show="productCompare.productInfo.product_name2" style="display: inline-block;">{{productCompare.productInfo.product_name2}}（{{productCompare.productInfo.plan_name2}}）</span>
            </div>
        </div>
        <div class="compare-content com-scroll-y" :style="{'padding-bottom': inApp && '0.53rem'}" @scroll="scrollFn">
            <div class="background-F6F6F6"></div>
            <ul class="compare-table" v-if="productCompare.compareBase && productCompare.compareBase.length > 0">
                <li class="title-row" @click="allBaseCheckedFn()">
                    <span v-if="!is_edit" class="title-separate"></span>
                    <img v-if="is_edit" v-show="allBaseChecked" class="check-box" src="https://static.iberhk.com/v2/web/images/product/checked.png">
                    <img v-if="is_edit" v-show="!allBaseChecked" class="check-box" src="https://static.iberhk.com/v2/web/images/product/unchecked.png">
                    <span>基本信息</span>
                    <span v-if="is_edit" class="title-row-remark">{{simply ? '以下对比项选中为分享可见' : '以下對比項選中為分享可見'}}</span>
                </li>
                <li v-show="isShowSame || (!isShowSame && (item.content1 !== item.content2))" class="row clearfix" v-for="(item, index) in productCompare.compareBase" :class="{'unchecked': !item.checked}" @click="checkedChange(item, 'base')" :style="{'z-index': productCompare.compareBase.length - index, 'border-bottom': productCompare.compareBase.length - 1 === index ? 'none' : '1px solid #E8E8E8'}">
                    <div class="td left">
                        <img v-if="is_edit" v-show="item.checked" class="check-box" src="https://static.iberhk.com/v2/web/images/product/checked.png">
                        <img v-if="is_edit" v-show="!item.checked" class="check-box" src="https://static.iberhk.com/v2/web/images/product/unchecked.png">
                        <span class="left-text">{{item.name}}</span>
                    </div>
                    <div v-show="item.content1 !== item.content2" class="td center">{{item.content1}}</div>
                    <div class="separate-line"></div>
                    <div v-show="item.content1 !== item.content2" class="separate-line-right"></div>
                    <div class="td" :class="{'right': item.content1 !== item.content2, 'max-right': item.content1 === item.content2}">{{item.content2}}</div>
                    <!-- <div class="separate-line-bottom"></div> -->
                </li>
            </ul>
            <ul class="compare-table" v-if="productCompare.compareGuarantee && (productCompare.compareGuarantee.length > 0) && item.child && (item.child.length > 0)" v-for="(item, index) in productCompare.compareGuarantee">
                <li class="title-row" @click="allCheckedFn(item)">
                    <span v-if="!is_edit" class="title-separate"></span>
                    <img v-if="is_edit" v-show="item.checked" class="check-box" src="https://static.iberhk.com/v2/web/images/product/checked.png">
                    <img v-if="is_edit" v-show="!item.checked" class="check-box" src="https://static.iberhk.com/v2/web/images/product/unchecked.png">
                    <span>{{item.name}}</span>
                    <!-- <span v-if="is_edit" class="title-row-remark">{{simply ? '以下对比项选中为分享可见' : '以下對比項選中為分享可見'}}</span> -->
                </li>
                <li v-show="isShowSame || (!isShowSame && (item1.content1 !== item1.content2))" class="row clearfix" v-for="(item1, index1) in item.child" :class="{'unchecked': !item1.checked}" @click="checkedChange(item1, 'right', item)" :style="{'z-index': item.child.length - index1, 'border-bottom': item.child.length - 1 === index1 ? 'none' : '1px solid #E8E8E8'}">
                    <div class="td left">
                        <img v-if="is_edit" v-show="item1.checked" class="check-box" src="https://static.iberhk.com/v2/web/images/product/checked.png">
                        <img v-if="is_edit" v-show="!item1.checked" class="check-box" src="https://static.iberhk.com/v2/web/images/product/unchecked.png">
                        <span class="left-text">{{item1.name}}</span>
                    </div>
                    <div class="separate-line"></div>
                    <div v-show="item1.content1 !== item1.content2" class="td center" style="text-align: left;">{{item1.content1}}</div>
                    <div v-show="item1.content1 !== item1.content2" class="separate-line-right"></div>
                    <div class="td" :class="{'right': item1.content1 !== item1.content2, 'max-right': item1.content1 === item1.content2}" style="text-align: left;">{{item1.content2}}</div>
                    <!-- <div class="separate-line-bottom"></div> -->
                </li>
            </ul>
            <!-- 表格底部线条 -->
            <div class="separate-line-bottom"></div>
            <consultant-card :user-uuid="userUuid" :target-uuid="product_compare_uuid" :share-from="true" :from-type="share.target_type" style="padding-top: .4rem !important;"></consultant-card>
            <share-data v-if="is_edit" :analyze="productCompare.analyze"></share-data>
            <disclaimer v-if="!is_edit" :text="disclaimer_des"></disclaimer>
        </div>
        <contact-btn :user-uuid="userUuid" :target-uuid="product_compare_uuid" :scroll-top="comScrollYScrollTop"></contact-btn>
        <ul v-if="inApp" class="shared-now-operating">
            <li class="icon" v-if="is_edit && !is_preview" @click="getReviewUrl()">
                <img src="https://static.iberhk.com/v2/web/images/product/review.png">
                <span>{{simply ? '预览' : '預覽'}}</span>
            </li>
            <li class="share-btn" :style="{width: !is_edit || is_preview ? '100%' : 'calc(100% - .7rem)'}" @click="getCheckedKey()">立即分享</li>
        </ul>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import ShareData from "@/components/shared/component/card/sharedata.vue";
import Disclaimer from "@/components/shared/component/card/disclaimer.vue";
import ContactBtn from "@/components/shared/component/card/contactbtn.vue";

export default {
    name: "ProductCompare",
    data() {
        return {
            product_compare_uuid: this.$route.query['product_compare_uuid'] ? this.$route.query['product_compare_uuid'] : (this['urlParams'] ? this.urlParams['product_compare_uuid'] : ''),
            // 来源产品
            product_from_uuid: this.$route.query['product_from_uuid'] ? this.$route.query['product_from_uuid'] : (this['urlParams'] ? this.urlParams['product_from_uuid'] : ''),
            // 对比产品
            product_to_uuid: this.$route.query['product_to_uuid'] ? this.$route.query['product_to_uuid'] : (this['urlParams'] ? this.urlParams['product_to_uuid'] : ''),
            // 来源产品子计划
            product_plan_from_uuid: this.$route.query['product_plan_from_uuid'] ? this.$route.query['product_plan_from_uuid'] : (this['urlParams'] ? this.urlParams['product_plan_from_uuid'] : ''),
            // 对比产品子计划
            product_plan_to_uuid: this.$route.query['product_plan_to_uuid'] ? this.$route.query['product_plan_to_uuid'] : (this['urlParams'] ? this.urlParams['product_plan_to_uuid'] : ''),

            product_plan_to_name: this.$route.query['product_plan_to_name'] ? this.$route.query['product_plan_to_name'] : (this['urlParams'] ? this.urlParams['product_plan_to_name'] : ''),
            product_plan_from_name: this.$route.query['product_plan_from_name'] ? this.$route.query['product_plan_from_name'] : (this['urlParams'] ? this.urlParams['product_plan_from_name'] : ''),
            is_same_category: this.$route.query['is_same_category'] ? this.$route.query['is_same_category'] : (this['urlParams'] ? this.urlParams['is_same_category'] : ''),
            selected_index: this.$route.query['selected_index'] ? this.$route.query['selected_index'] : (this['urlParams'] ? this.urlParams['selected_index'] : ''),
            selected_category_uuid: this.$route.query['selected_category_uuid'] ? this.$route.query['selected_category_uuid'] : (this['urlParams'] ? this.urlParams['selected_category_uuid'] : ''),

            // 是否编辑状态，app内编辑用
            is_edit: (this.$route.query['is_edit'] === '1') ? true : false,
            // 是否动态预览跳转的页面
            is_preview: (this.$route.query['is_preview'] === '1') ? true : false,
            // 链接中选中name值的参数
            base_checkeds: this.$route.query['base_checkeds'] ? JSON.parse(decodeURIComponent(this.$route.query['base_checkeds'])) : [],
            guarantee_checkeds: this.$route.query['guarantee_checkeds'] ? JSON.parse(decodeURIComponent(this.$route.query['guarantee_checkeds'])) : [],
            isLoaded: false,
            // 滚动顶部距离
            comScrollYScrollTop: 0,
            // 是否显示相同项，默认显示
            isShowSame: true,
            // 基本信息全选中状态，默认选中
            allBaseChecked: true,
            // 顶部产品图片动效
            animateImg: {},
            share: {},
            shareSetting: {
                hide_platform: [],
                language: 'auto',
                auth: 'force',
                card: 'full',
                comment: 'null',
                moreShare: 'null'
            },
            productCompare: {
                productInfo: {},
                analyze: {},
                compareBase: [],
                compareGuarantee: [],
            },
            disclaimer_des: this.simply ? '免责声明：以上内容仅供参考，实际以保险公司具体规定为准' : '免責聲明：以上內容僅供參考，實際以保險公司具體規定為準',
        };
    },
    components: {
        ConsultantCard,
        ShareData,
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
            product_compare_uuid: this.product_compare_uuid,
            target_type: '16',
            router: window.location.pathname,
            url: ''
        };
        if (!this.inApp) {
            let firstReportParam = {
                product_compare_uuid: this.product_compare_uuid
            };
            this.userUuid && this.getRootUserInfo(firstReportParam).then(res => {
                // 地址申报
                this.userUuid && plug.autoDeclare({
                    object: this, //Vue对象或子对象，注意作用域
                    app: this.inApp,
                    user_uuid: this.userUuid //agent ID
                });
                // 浏览上报
                CommonJS.readReport(this.share);
                // 顶部消息提醒
                this.$root.getAgentMsg();
                // 获取疾病詳情
                this.getProductCompare();
            }, err => {
                // 地址申报
                this.userUuid && plug.autoDeclare({
                    object: this, //Vue对象或子对象，注意作用域
                    app: this.inApp,
                    user_uuid: this.userUuid //agent ID
                });
                // 获取疾病詳情
                this.getProductCompare();
            });
            !this.userUuid && (this.$root.blueLoadingParams.show = false);
        } else {
            // 获取疾病詳情
            this.getProductCompare();
        }
    },
    mounted() {},
    methods: {
        // 获取产品对比信息
        getProductCompare() {
            this.$root.blueLoadingParams.show = true;
            let param = {};
            this.product_compare_uuid && (param.product_compare_uuid = this.product_compare_uuid);
            this.product_from_uuid && (param.product_from_uuid = this.product_from_uuid);
            this.product_to_uuid && (param.product_to_uuid = this.product_to_uuid);
            this.product_plan_from_uuid && (param.product_plan_from_uuid = this.product_plan_from_uuid);
            this.product_plan_to_uuid && (param.product_plan_to_uuid = this.product_plan_to_uuid);

            this.product_plan_to_name && (param.product_plan_to_name = this.product_plan_to_name);
            this.product_plan_from_name && (param.product_plan_from_name = this.product_plan_from_name);
            this.is_same_category && (param.is_same_category = this.is_same_category);
            this.selected_index && (param.selected_index = this.selected_index);
            this.selected_category_uuid && (param.selected_category_uuid = this.selected_category_uuid);

            this.$http.get(this.product_compare_uuid ? '/product/compare' : '/product/compare-preview', param).then(res => {
                if (res && res.extra && res.extra.is_pro === 0) {
                    window.location.href = window.baseUrl + '/error/notfound';
                    return;
                }
                if (res && res.code === 0) {
                    this.productCompare = res.data;
                    // 统计数据
                    this.inApp && this.getProductStat();
                    // 解析选中的状态
                    this.parseChecked();
                    // 检查全选或者不全选状态
                    this.examAllCheckStatus();
                    if (this.is_edit) {
                        // 编辑状态过滤同时为空的项
                        this.productCompare.compareBase = this.productCompare.compareBase.filter(item => item.content1 || item.content2);
                        this.productCompare.compareGuarantee.forEach((item, index) => {
                            this.productCompare.compareGuarantee[index].child = item.child.filter(item1 => item1.content1 || item1.content2);
                        });
                    } else {
                        // 预览状态过滤同时为空和选中项
                        this.productCompare.compareBase = this.productCompare.compareBase.filter(item => (item.content1 || item.content2) && item.checked);
                        this.productCompare.compareGuarantee.forEach((item, index) => {
                            this.productCompare.compareGuarantee[index].child = item.child.filter(item1 => (item1.content1 || item1.content2) && item1.checked);
                        });
                    }
                    console.log(this.productCompare.compareBase);
                    console.log(this.productCompare.compareGuarantee);
                    // 重置uuid
                    if (this.productCompare.compareInfo) {
                        this.productCompare.compareInfo['product_from_uuid'] && (this.product_from_uuid = this.productCompare.compareInfo.product_from_uuid);
                        this.productCompare.compareInfo['product_to_uuid'] && (this.product_to_uuid = this.productCompare.compareInfo.product_to_uuid);
                        this.productCompare.compareInfo['product_plan_from_uuid'] && (this.product_plan_from_uuid = this.productCompare.compareInfo.product_plan_from_uuid);
                        this.productCompare.compareInfo['product_plan_to_uuid'] && (this.product_plan_to_uuid = this.productCompare.compareInfo.product_plan_to_uuid);
                        this.productCompare.compareInfo['product_category_uuid'] && (this.product_category_uuid = this.productCompare.compareInfo.product_category_uuid);

                        this.productCompare.compareInfo['product_plan_to_name'] && (this.product_plan_to_name = this.productCompare.compareInfo.product_plan_to_name);
                        this.productCompare.compareInfo['product_plan_from_name'] && (this.product_plan_from_name = this.productCompare.compareInfo.product_plan_from_name);
                        this.productCompare.compareInfo['is_same_category'] && (this.is_same_category = this.productCompare.compareInfo.is_same_category);
                        this.productCompare.compareInfo['selected_index'] && (this.selected_index = this.productCompare.compareInfo.selected_index);
                        this.productCompare.compareInfo['selected_category_uuid'] && (this.selected_category_uuid = this.productCompare.compareInfo.selected_category_uuid);
                    }
                    // 设置滑动框顶部背景高度与顶部高度一致，防止动画页面抖动，顶部动画外框设置成position:absolute
                    setTimeout(() => {
                        document.querySelector('.background-F6F6F6').style.height = document.querySelector('.top-head').clientHeight + 'px';
                    }, 100);
                    // 设置分享信息
                    this.share.title = res.data.share.title;
                    this.share.thumbImage = res.data.share.thumbImage;
                    this.share.desc = res.data.share.desc;
                    this.share.url = window.location.origin + window.location.pathname + '?product_compare_uuid=' + this.product_compare_uuid + '&user_uuid=' + this.userUuid + '&target_type=' + this.share.target_type + '&one_way=' + this.userUuid;
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                } else if (res && res.code === 1000) {
                    window.location.href = window.baseUrl + '/error/notfound?tip=' + res['msg'];
                } else {
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                }
            }, err => {
                window.location.href = window.baseUrl + '/error/404';
            });
        },
        // 获取分享出去的统计数据
        getProductStat() {
            if (this.is_edit && this.product_compare_uuid) {
                this.$http.get('/product/get-compare-stat', {
                    product_compare_uuid: this.product_compare_uuid
                }).then(res => {
                    if (res && res.code === 0) {
                        this.productCompare.analyze = res.data;
                        this.$forceUpdate();
                    }
                });
            }
        },
        // 滚动事件
        scrollFn(event) {
            let scrollTop = event.target.scrollTop;
            this.comScrollYScrollTop = scrollTop;
            if (scrollTop > this.$refs.productImg.clientHeight / 2) {
                this.animateImg = {
                    'height': '0',
                    'margin-bottom': '0rem',
                    'opacity': 0,
                };
            } else {
                this.animateImg = {};
            }
        },
        // 解析选中的状态
        parseChecked() {
            if (!this.is_edit && this.inApp && !this.is_preview) {
                this.productCompare.compareBase.forEach((item, index) => {
                    if (this.base_checkeds.length === 0) {
                        item.checked = false;
                    } else {
                        for (let i = 0; i < this.base_checkeds.length; i++) {
                            item.checked = false;
                            if (this.base_checkeds[i] === item.item) {
                                item.checked = true;
                                break;
                            }
                        }
                    }
                });
                this.productCompare.compareGuarantee.forEach((item, index) => {
                    item.child.forEach((item1, index1) => {
                        if (this.guarantee_checkeds.length === 0) {
                            item1.checked = false;
                        } else {
                            for (let i = 0; i < this.guarantee_checkeds.length; i++) {
                                item1.checked = false;
                                if (this.guarantee_checkeds[i] === item1.uuid) {
                                    item1.checked = true;
                                    break;
                                }
                            }
                        }
                    });
                });
            }
        },
        // 显示或者隐藏相同项
        showSameFn() {
            this.isShowSame = !this.isShowSame;
        },
        // 全选基本信息
        allBaseCheckedFn() {
            if (this.is_edit) {
                this.allBaseChecked = !this.allBaseChecked;
                this.productCompare.compareBase.forEach((item, index) => {
                    item.checked = this.allBaseChecked;
                });
            }
        },
        // 全选保障权益
        allCheckedFn(guarantee) {
            if (this.is_edit) {
                guarantee.checked = !guarantee.checked;
                guarantee.child.forEach((item, index) => {
                    item.checked = guarantee.checked;
                });
            }
        },
        // 选中或者不选中单条的
        checkedChange(item, type, guarantee) {
            if (this.is_edit) {
                item.checked = !item.checked;
                (type === 'base') ? this.examBaseAllCheckStatus(item): this.examRightAllCheckStatus(guarantee);
            }
        },
        // 检查全部全选或者不全选状态
        examAllCheckStatus() {
            this.examBaseAllCheckStatus();
            this.productCompare.compareGuarantee.forEach((guarantee, index) => {
                this.examRightAllCheckStatus(guarantee);
            });
        },
        // 检查基本信息全选或者不全选状态
        examBaseAllCheckStatus() {
            this.allBaseChecked = (this.productCompare.compareBase.filter(item => item.checked).length === this.productCompare.compareBase.length);
        },
        // 检查权益各项的全选或者不全选状态
        examRightAllCheckStatus(guarantee) {
            guarantee.checked = (guarantee.child.filter(item => item.checked).length === guarantee.child.length);
        },
        // 获取预览参数
        getReviewParam() {
            this.base_checkeds = [];
            this.guarantee_checkeds = [];
            this.productCompare.compareBase.forEach((item, index) => {
                item.checked && this.base_checkeds.push(item.item);
            });
            this.productCompare.compareGuarantee.forEach((item, index) => {
                item.child.forEach((item1, index1) => {
                    item1.checked && this.guarantee_checkeds.push(item1.uuid);
                });
            });
        },
        // 获取预览路径
        getReviewUrl() {
            // 获取预览参数
            this.getReviewParam();
            // 预览路径
            let url = window.baseUrl + '/product/compare?base_checkeds=' + encodeURIComponent(JSON.stringify(this.base_checkeds)) + '&guarantee_checkeds=' + encodeURIComponent(JSON.stringify(this.guarantee_checkeds));
            let page_params = {};
            this.product_from_uuid && (page_params.product_from_uuid = this.product_from_uuid);
            this.product_to_uuid && (page_params.product_to_uuid = this.product_to_uuid);
            this.product_plan_from_uuid && (page_params.product_plan_from_uuid = this.product_plan_from_uuid);
            this.product_plan_to_uuid && (page_params.product_plan_to_uuid = this.product_plan_to_uuid);
            this.product_category_uuid && (page_params.product_category_uuid = this.product_category_uuid);

            this.product_plan_to_name && (page_params.product_plan_to_name = this.product_plan_to_name);
            this.product_plan_from_name && (page_params.product_plan_from_name = this.product_plan_from_name);
            this.is_same_category && (page_params.is_same_category = this.is_same_category);
            this.selected_index && (page_params.selected_index = this.selected_index);
            this.selected_category_uuid && (page_params.selected_category_uuid = this.selected_category_uuid);

            for (let key in page_params) {
                url += ('&' + key + '=' + page_params[key]);
            }
            page_params.url = url;
            let param = {
                is_sapp: false, // 是否是sapp
                sapp_uuid: '', // sapp的uuid
                page_type: 1, // 1:原生，2:h5
                page_h5_title: '', // h5页面的标题
                page_url: 'IBerSappModule_ProductPreViewPage', // page链接
                page_params: page_params // page参数
            };
            this.appFn.goPage(param);
            console.log(url);
        },
        // 获取选中勾选的key值
        getCheckedKey() {
            this.appFn.commonFn('product_dialog', {});
            const _this = this;
            window.getCheckedKey = function() {
                _this.$root.blueLoadingParams.show = true;
                // 获取预览参数
                _this.getReviewParam();
                // 预览选中参数
                let page_params = {
                    items: JSON.stringify(_this.base_checkeds),
                    guarantee_uuids: JSON.stringify(_this.guarantee_checkeds)
                };

                if (_this.productCompare.compareInfo) {
                    _this.productCompare.compareInfo['product_from_uuid'] && (page_params.product_from_uuid = _this.productCompare.compareInfo.product_from_uuid);
                    _this.productCompare.compareInfo['product_to_uuid'] && (page_params.product_to_uuid = _this.productCompare.compareInfo.product_to_uuid);
                    _this.productCompare.compareInfo['product_plan_from_uuid'] && (page_params.product_plan_from_uuid = _this.productCompare.compareInfo.product_plan_from_uuid);
                    _this.productCompare.compareInfo['product_plan_to_uuid'] && (page_params.product_plan_to_uuid = _this.productCompare.compareInfo.product_plan_to_uuid);
                    _this.productCompare.compareInfo['product_category_uuid'] && (page_params.product_category_uuid = _this.productCompare.compareInfo.product_category_uuid);

                    _this.productCompare.compareInfo['product_plan_to_name'] && (page_params.product_plan_to_name = _this.productCompare.compareInfo.product_plan_to_name);
                    _this.productCompare.compareInfo['product_plan_from_name'] && (page_params.product_plan_from_name = _this.productCompare.compareInfo.product_plan_from_name);
                    _this.productCompare.compareInfo['is_same_category'] && (page_params.is_same_category = _this.productCompare.compareInfo.is_same_category);
                    _this.productCompare.compareInfo['selected_index'] && (page_params.selected_index = _this.productCompare.compareInfo.selected_index);
                    _this.productCompare.compareInfo['selected_category_uuid'] && (page_params.selected_category_uuid = _this.productCompare.compareInfo.selected_category_uuid);
                }

                _this.$http.post('/product/compare-share', page_params).then(res => {
                    if (res && res.code === 0) {
                        _this.share.url = window.location.origin + window.location.pathname + '?product_compare_uuid=' + res.data.product_compare_uuid + '&user_uuid=' + _this.userUuid + '&target_type=' + _this.share.target_type + '&one_way=' + _this.userUuid;
                        _this.appFn.commonFn('compare_list', {});
                        _this.appFn.shareFn(_this.share, _this.setting);
                    } else if (res && res.code === 1000) {
                        window.location.href = window.baseUrl + '/error/notfound?tip=' + res['msg'];
                    }
                    _this.$root.blueLoadingParams.show = false;
                }, err => {
                    _this.$root.blueLoadingParams.show = false;
                });
                console.log(page_params);
            }

        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.product-compare {
    width: 100%;
}

.compare-content {
    width: 100%;
}

.background-F6F6F6 {
    width: 100%;
    height: 1.18rem;
    background-color: #F6F6F6;
}

.compare-table {
    width: 100%;
    box-sizing: border-box;
}

.product-compare .row {
    box-sizing: border-box;
    width: 100%;
    font-size: .13rem;
    color: #2A2A2A;
    text-align: center;
    line-height: .18rem;
    background-color: #FFFFFF;
    min-height: .485rem;
    border-bottom: 1px solid #E8E8E8;
}

.product-compare .top-head {
    border-bottom: none;
}

.product-compare .title-row {
    padding: .13rem .12rem;
    font-size: .14rem;
    color: #2A2A2A;
    line-height: .18rem;
    font-weight: bold;
    background-color: #F6F6F6;
    overflow: hidden;
}

.product-compare .row span,
.product-compare .title-row span {
    float: left;
}

.product-compare .row.unchecked {
    color: #CCCCCC;
}

.product-compare .th {
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.08);
    position: absolute;
    top: 0;
    z-index: 100;
}

.product-compare .td {
    padding: .16rem .1rem .16rem .12rem;
    float: left;
    height: 100%;
    word-break: break-all;
}

.product-compare .td .left-text {
    float: left;
    width: calc(100% - .24rem);
}

.product-compare .show-same-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
}

.product-compare .td.left {
    width: 1.09rem;
    text-align: left;
    float: left;
    cursor: pointer;
}

.product-compare .td.center {
    float: left;
    width: calc(50% - .545rem);
}

.product-compare .td.right {
    float: left;
    width: calc(50% - .545rem);
}

.product-compare .td.max-right {
    float: left;
    width: calc(100% - 1.09rem);
}

.show-same {
    width: .18rem;
    margin-right: .06rem;
}

.show-same-text {
    color: #3364E4;
    font-weight: bold;
}

.product-img {
    float: left;
    margin-left: calc(50% - .25rem);
    margin-bottom: .1rem;
    width: .5rem;
    height: .5rem;
    transition: all 100ms;
}

.check-box {
    width: .18rem;
    height: .18rem;
    float: left;
    margin-right: .06rem;
    cursor: pointer;
}

.title-separate {
    width: .02rem;
    height: .14rem;
    background-color: #3364E4;
    margin: .02rem .06rem 0 0;
}

.title-row-remark {
    font-size: .12rem;
    color: #999999;
    float: right !important;
    line-height: .18rem;
    font-weight: normal;
}

.separate-line,
.separate-line-right {
    border-right: 1px solid #E8E8E8;
    position: absolute;
    top: 0;
    left: 1.09rem;
    height: 100%;
    box-sizing: border-box;
    z-index: 4;
}

.separate-line-right {
    left: auto;
    right: calc(50% - .545rem);
}

.separate-line-bottom {
    border-bottom: 1px solid #E8E8E8;
    width: 100%;
    box-sizing: border-box;
}

.shared-now-operating {
    width: 100%;
    height: 0.54rem;
    background-color: #fff;
    padding: 0.07rem 0.16rem;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #E8E8E8;
    z-index: 100;
}

.shared-now-operating .icon {
    text-align: center;
    float: left;
    color: #666;
    margin: 0 0.26rem 0 .17rem;
    cursor: pointer;
    margin-top: -.02rem;
}

.shared-now-operating li img {
    width: .2rem;
    display: inline-block;
}

.shared-now-operating li span {
    display: block;
    font-size: 0.12rem;
    line-height: 0.15rem;
}

.shared-now-operating .share-btn {
    text-align: center;
    float: right;
    width: calc(100% - .7rem);
    height: 0.38rem;
    line-height: 0.38rem;
    color: #fff;
    font-size: 0.14rem;
    background-color: #3364e4;
    border-radius: 0.19rem;
    margin: 0;
    font-weight: bold;
    cursor: pointer;
}
</style>