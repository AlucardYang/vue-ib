<template>
    <div v-show="isLoaded" class="illness-detail">
        <div class="illness-detail-content com-scroll-y" @scroll="scrollFn">
            <div class="illness-title-box">
                <div class="illness-title">{{illnessInfo.lang.name}}</div>
                <div v-show="illnessInfo.cate.cate_name" class="illness-cate">{{illnessInfo.cate.cate_name}}</div>
            </div>
            <div v-show="(inApp && (illnessInfo.products_count != '0')) || (illnessInfo.share_num > 0)" class="illness-association-product">
                <span>{{simply ? '关联保险产品' : '關聯保險產品'}}</span>
                <div v-if="inApp" class="illness-association-product-remark">共 {{illnessInfo.products_count}} 款， 已{{simply ? '选择' : '選擇'}} <span class="bold">{{illnessInfo.share_num}}</span> 款分享可{{simply ? '见' : '見'}}</div>
                <div class="operate-box" @click="goProductList()">
                    <span class="go-see-product" v-if="inApp">{{simply ? '去设置' : '去設定'}}</span>
                    <span class="go-see-product" v-if="!inApp">共有 {{illnessInfo.share_num}} 款</span>
                    <i class="iconfont arrow-right">&#xe774;</i>
                </div>
            </div>
            <mt-navbar v-if="illnessInfo.lang.abstract || illnessInfo.lang.symptom || illnessInfo.lang.cause || illnessInfo.lang.description" v-model="tabSelect">
                <mt-tab-item id="abstract" v-if="illnessInfo.lang.abstract">{{simply ? '简介' : '簡介'}}</mt-tab-item>
                <mt-tab-item id="symptom" v-if="illnessInfo.lang.symptom">{{simply ? '诊断' : '診斷'}}</mt-tab-item>
                <mt-tab-item id="cause" v-if="illnessInfo.lang.cause">{{simply ? '治疗' : '治療'}}</mt-tab-item>
                <mt-tab-item id="description" v-if="illnessInfo.lang.description">{{simply ? '相关资讯' : '相關資訊'}}</mt-tab-item>
            </mt-navbar>
            <mt-tab-container v-if="illnessInfo.lang.abstract || illnessInfo.lang.symptom || illnessInfo.lang.cause || illnessInfo.lang.description" class="tab-container" v-model="tabSelect" :swipeable="true" :style="{'min-height': inApp && 'calc(100% - 1.35rem)'}">
                <mt-tab-container-item id="abstract" v-if="illnessInfo.lang.abstract">
                    <div class="container-item richText" v-html="illnessInfo.lang.abstract"></div>
                </mt-tab-container-item>
                <mt-tab-container-item id="symptom" v-if="illnessInfo.lang.symptom">
                    <div class="container-item richText" v-html="illnessInfo.lang.symptom"></div>
                </mt-tab-container-item>
                <mt-tab-container-item id="cause" v-if="illnessInfo.lang.cause">
                    <div class="container-item richText" v-html="illnessInfo.lang.cause"></div>
                </mt-tab-container-item>
                <mt-tab-container-item id="description" v-if="illnessInfo.lang.description">
                    <div class="container-item richText" v-html="illnessInfo.lang.description"></div>
                </mt-tab-container-item>
            </mt-tab-container>
            <consultant-card :user-uuid="userUuid" :target-uuid="illness_uuid" :share-from="true" :from-type="share.target_type"></consultant-card>
            <disclaimer :text="disclaimer_des" :style="{'padding-bottom': inApp ? '.6rem' : '.12rem'}"></disclaimer>
        </div>
        <share-btn :share="share" :setting="shareSetting"></share-btn>
        <contact-btn :user-uuid="userUuid" :target-uuid="illness_uuid" :scroll-top="comScrollYScrollTop"></contact-btn>
    </div>
</template>

<script>
// import Vue from 'vue';
import { Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui';
// Vue.component(Navbar.name, Navbar);
// Vue.component(TabItem.name, TabItem);
// Vue.component(TabContainer.name, TabContainer);
// Vue.component(TabContainerItem.name, TabContainerItem);

import CommonJS from '@/components/shared/service/common.js';
import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import ShareBtn from "@/components/shared/component/card/sharebtn.vue";
import Disclaimer from "@/components/shared/component/card/disclaimer.vue";
import ContactBtn from "@/components/shared/component/card/contactbtn.vue";

export default {
    name: "IllnessDetail",
    data() {
        return {
            illness_uuid: this.$route.query['illness_uuid'] ? this.$route.query['illness_uuid'] : (this['urlParams'] ? this.urlParams['illness_uuid'] : ''),
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
            tabs: [],
            tabSelect: 'abstract',
            illnessInfo: {
                lang: {},
                cate: {}
            },
            disclaimer_des: this.simply ? '免责声明：以上内容仅供参考，实际以保险公司具体规定为准' : '免責聲明：以上內容僅供參考，實際以保險公司具體規定為準',
        };
    },
    components: {
        ConsultantCard,
        ShareBtn,
        Disclaimer,
        ContactBtn,
        'mt-navbar': Navbar, 
        'mt-tab-item': TabItem, 
        'mt-tab-container': TabContainer, 
        'mt-tab-container-item': TabContainerItem
    },
    created() {
        this.$root.blueLoadingParams.show = true;
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: true, // 分享上报，不上报可不传
            illness_uuid: this.illness_uuid,
            target_type: '13',
            router: window.location.pathname,
            url: ''
        };
        if (!this.inApp) {
            let firstReportParam = {
                illness_uuid: this.illness_uuid
            };
            this.userUuid && this.getRootUserInfo(firstReportParam).then(res => {
                // 浏览上报
                CommonJS.readReport(this.share);
                // 顶部消息提醒
                this.$root.getAgentMsg();
                // 获取疾病詳情
                this.getIllnessInfo();
            }, err => {
                // 获取疾病詳情
                this.getIllnessInfo();
            });
        } else {
            // 获取疾病詳情
            this.getIllnessInfo();
        }
    },
    mounted() {
        // 重新刷新接口数据
        this.reloadApi();
    },
    methods: {
        // 获取疾病详情
        getIllnessInfo() {
            this.$root.blueLoadingParams.show = true;
            this.$http.get('/illness/detail', {
                illness_uuid: this.illness_uuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.illnessInfo = res.data;
                    this.tabSelect = (this.illnessInfo.lang.abstract ? 'abstract' : (this.illnessInfo.lang.symptom ? 'symptom' : (this.illnessInfo.lang.cause ? 'cause' : (this.illnessInfo.lang.description ? 'description' : 'abstract'))))
                    // 设置分享信息
                    this.share.title = this.illnessInfo.share.title;
                    this.share.thumbImage = this.illnessInfo.share.thumbImage;
                    this.share.desc = this.illnessInfo.share.desc;
                    this.share.url = window.location.origin + window.location.pathname + '?illness_uuid=' + this.illness_uuid + '&user_uuid=' + this.userUuid + '&target_type=' + this.share.target_type + '&one_way=' + this.userUuid;
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
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
        // 重新刷新接口数据
        reloadApi() {
            const _this = this;
            window.reloadApi = function() {
                _this.getIllnessInfo();
            }
        },
        // 跳转疾病关联的产品列表页
        goProductList() {
            if (this.inApp) {
                let param = {
                    is_sapp: false, // 是否是sapp
                    sapp_uuid: '', // sapp的uuid
                    page_type: 1, // 1:原生，2:h5
                    page_h5_title: '', // h5页面的标题
                    page_url: 'IBerSappModule_SeriousIllnessCorrelationProductPage', // page链接
                    page_params: {
                        illness_uuid: this.illness_uuid
                    }, // page参数
                };
                this.appFn.goPage(param);
            } else {
                window.location.href = window.baseUrl + '/illness/get-share-list?illness_uuid=' + this.illness_uuid + '&user_uuid=' + this.userUuid + '&in_app=' + (this.inApp ? 1 : 0) + '&auth=' + window.auth + '&card=' + this.card + '&share_link=' + encodeURIComponent(window.location.href);
            }
        },
        // 滚动事件
        scrollFn(event) {
            this.comScrollYScrollTop = event.target.scrollTop;
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.illness-detail {
    width: 100%;
    background-color: #F6F6F6;
}

.illness-detail-content {
    width: 100%;
}

.illness-title-box {
    width: 100%;
    background-color: #FFFFFF;
    padding: .12rem;
    margin-bottom: .1rem;
}

.illness-title {
    font-size: .23rem;
    color: #2A2A2A;
    letter-spacing: 0;
    line-height: .33rem;
    word-break: break-word;
    font-weight: bold;
}

.illness-cate {
    display: inline-block;
    border: 1px solid #E8E8E8;
    border-radius: .09rem;
    padding: .03rem .08rem;
    font-size: .12rem;
    color: #999999;
    line-height: .12rem;
}

.illness-association-product {
    width: 100%;
    background-color: #FFFFFF;
    padding: .16rem .12rem;
    margin-bottom: .1rem;
    font-size: .15rem;
    color: #2A2A2A;
    line-height: .18rem;
}

.illness-association-product-remark {
    margin-top: .06rem;
    font-size: .12rem;
    color: #999999;
    line-height: .15rem;
}

.illness-association-product-remark .bold {
    font-weight: bold;
    color: #666666;
}

.operate-box {
    position: absolute;
    right: .12rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.go-see-product {
    color: #3364E4;
    display: inline-block;
    vertical-align: middle;
}

.arrow-right {
    color: #CCCCCC;
    font-size: .1rem;
    display: inline-block;
    vertical-align: middle;
}

.container-item {
    padding: .16rem .12rem;
}

.tab-container {
    margin-bottom: .1rem;
    background-color: #FFFFFF;
    min-height: 3rem;
}
</style>

<!-- 重置mint的mt-tab-container样式 -->
<style>
.mint-navbar {
    height: .42rem;
    font-size: .15rem;
    color: #2A2A2A;
    line-height: .18rem;
    cursor: pointer;
    border-bottom: .01rem solid #DEDFE0;
}

.mint-navbar .mint-tab-item.is-selected {
    border-bottom: none;
    color: #3B5EDF;
    font-weight: bold;
    margin-bottom: 0;
}

.mint-navbar .mint-tab-item {
    padding: 0;
    font-size: .15rem;
}

.mint-tab-item-label {
    color: inherit;
    font-size: .15rem;
    line-height: .4rem;
    display: inline-block;
}

.mint-navbar .mint-tab-item.is-selected .mint-tab-item-label {
    border-bottom: .02rem solid #3364E4;
}

.mint-tab-container-item {
    background-color: #FFFFFF;
}
</style>