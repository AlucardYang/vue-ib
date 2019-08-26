<template>
    <div v-show="isLoaded" class="care-company-detail">
        <!-- 主体页面 -->
        <div class="care-company-detail-content com-scroll-y">
            <div class="company-img-box">
                <img class="company-img" :src="companyInfo.company_img">
            </div>
            <ul class="company-stores">
                <li class="company-stores-block" v-for="(item, index) in companyInfo.stores" :style="{'border-bottom': (index === companyInfo.stores.length - 1)  && 'none'}" @click="openMap(item.address)">
                    <div class="left">
                        <span class="name">{{item.name}}:</span>
                        <span class="address">{{item.address}}</span>
                    </div>
                    <i class="iconfonti address-icon">&#xe7e1;</i>
                </li>
            </ul>
            <consultant-card :user-uuid="userUuid" :target-uuid="care_company_uuid" :share-health="true" :from-type="share.target_type" style="margin-top: .1rem; background-color: transparent;padding-bottom: .32rem;"></consultant-card>
        </div>
    
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';
import tranSim from '@/components/shared/language/tranSim.js';

import ConsultantCard from "@/components/shared/component/card/consultant.vue";
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
        };
    },
    components: {
        ConsultantCard
    },
    created() {
        this.$root.blueLoadingParams.show = false;
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: false, // 分享上报，不上报可不传
            care_company_uuid: this.care_company_uuid,
            target_type: '62',
            router: window.location.pathname,
            url: '',
        };
        // 获取公共用户信息
        this.getUserInfoFn();
    },
    mounted() {
        // 获取医疗集团详情
        this.getCareCompanyDetail();
    },
    methods: {
        // 获取公共用户信息
        getUserInfoFn() {
            if (!this.inApp) {
                let firstReportParam = {
                    care_company_uuid: this.care_company_uuid
                };
                this.userUuid && this.getRootUserInfo(firstReportParam).finally(() => {
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    // 顶部消息提醒
                    this.$root.getAgentMsg();
                });
            }
        },
        // 获取集团详情
        getCareCompanyDetail() {
            this.$root.blueLoadingParams.show = true;
            this.$http.get('/iber-care/company-detail', {
                care_company_uuid: this.care_company_uuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.companyInfo = res.data.detail;
                    document.title = this.companyInfo.name;
                    // 设置分享信息
                    this.share.title = res.data.share.title;
                    this.share.thumbImage = res.data.share.thumbImage;
                    this.share.desc = res.data.share.desc;
                    this.share.url = window.location.origin + window.location.pathname + '?care_company_uuid=' + this.care_company_uuid + '&user_uuid=' + this.userUuid;
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    // app从H5获取分享数据
                    this.appFn.getShareFromH5(this.share, this.shareSetting);
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                } else {
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                    window.location.href = window.baseUrl + '/error/404';
                }
            }, err => {
                this.$root.blueLoadingParams.show = false;
                this.isLoaded = true;
                this.$root.pageLoading.layer = 2;
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

            let url = 'https://apis.map.qq.com/uri/v1/search?keyword=' + tranSim.simplized(addr) + '&region=香港&referer=PSRBZ-LREKQ-4EV56-GZBHY-6LL5T-CVFJN';
            if (this.inApp) {
                this.appFn.commonFn('openMap', {
                    url: url,
                    name: addr
                });
            } else {
                window.location.href = url;
            }
        },
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

.care-company-detail {
    font-family: PingFangSC-Regular;
    width: 100%;
}

.care-company-detail-content {
    width: 100%;
    background-color: #F6F6F6;
}

.company-img-box {
    width: 100%;
    margin-bottom: .1rem;
    min-height: 70%;
}

.company-img {
    width: 100%;
}

.company-stores {
    width: 100%;
    padding: 0 .12rem;
    background-color: #FFFFFF;
    margin-bottom: .1rem;
}

.company-stores-block {
    padding: .16rem 0;
    border-bottom: 1px solid #E8E8E8;
    overflow: hidden;
    cursor: pointer;
}

.company-stores-block .left {
    width: calc(100% - .25rem);
    float: left;
}

.company-stores-block .name {
    display: inline-block;
    vertical-align: middle;
    font-family: PingFangSC-Semibold;
    font-size: .14rem;
    color: #333333;
    line-height: .19rem;
    max-width: .9rem;
}

.company-stores-block .address {
    display: inline-block;
    vertical-align: middle;
    font-size: .14rem;
    color: #333333;
    line-height: .19rem;
    max-width: calc(100% - 1rem);
}

.company-stores-block .address-icon {
    color: #3364E4;
    font-size: .22rem;
    float: right;
}
</style>
