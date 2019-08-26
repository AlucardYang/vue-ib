<template>
    <div v-show="isLoaded" id="hospitalInquiry">
        <div v-if="hospital.name" class="hospital-inquiry com-scroll-y" :style="{'padding-bottom': inApp ? '.54rem' : 0}">
            <div class="hospital-box">
                <div class="hospital-inner">
                    <div class="hospital-info-top">
                        <span v-if="hospital.name" class="title">{{hospital.name}}</span>
                        <span v-if="hospital.level" class="type" :class="{'gray': hospital.level < 7}">{{hospital.levelName}}</span>
                        <div class="hospital-province">
                            <span v-if="hospital.province">{{hospital.province}}&nbsp;&nbsp;</span>
                            <span v-if="hospital.city">{{hospital.city}}</span>
                        </div>
                    </div>
                    <div class="hospital-info-bottom">
                        <div v-if="hospital.tel" class="row clearfix">
                            <span class="left">{{simply ? '电话' : '電話' }}：</span>
                            <div class="center">
                                <div class="tel-block" v-for="(item, index) in hospital.tels" :key="index">
                                    <span>{{item}}</span>
                                    <!-- <a class="tel-icon" :href="inApp ? 'javascript:void(0);' : 'tel:' + item"><i class="iconfont" @click="appFn.phonePicker(item)">&#xe67c;</i></a> -->
                                </div>
                            </div>
                        </div>
                        <div v-if="hospital.address" class="row clearfix">
                            <span class="left">地址：</span>
                            <div class="center">
                                <div class="tel-block" v-for="(item, index) in hospital.addresses" :key="index">
                                    <span>{{item}}</span>
                                    <!-- <i class="iconfont address-icon" @click="goQQMap(item)">&#xe78a;</i> -->
                                </div>
                            </div>
                        </div>
                        <div v-if="hospital.site" class="row clearfix">
                            <span class="left">{{simply ? '网址' : '網址' }}：</span>
                            <!-- <a :href="hospital.locationHref" class="center" style="color: #3364E4;">{{hospital.locationHref}}</a> -->
                            <span class="center">{{hospital.locationHref}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="hospital.department" class="hospital-box">
                <div class="hospital-inner">
                    <div class="hospital-content-title">科室</div>
                    <div class="department-list clearfix">
                        <div class="department-block" v-for="(item, index) in hospital.departments" :key="index">{{item}}</div>
                    </div>
                </div>
            </div>
            <div class="hospital-box" :style="{'padding-bottom': (userUuid && bottomAgentInfo.nickname && (bottomAgentInfo.card !== 'hide') && !inApp) ? '.1rem' : '0'}">
                <div class="hospital-inner">
                    <div class="hospital-content-title">{{simply ? '医院简介' : '醫院簡介'}}</div>
                    <img v-if="hospital.img" :src="hospital.img" class="hospital-image">
                    <div v-if="hospital.info" class="hospital-content richText" v-html="hospital.info"></div>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :target-uuid="hospitalUuid" :from-type="'11'" :share-from="true" @getAgentInfo="getAgentInfo" style="background-color: #F6F6F6"></consultant-card>
            <div class="disclaimer-box">
                <span>{{disclaimer}}</span>
            </div>
        </div>
        <div v-if="!hospital.name" class="empty-box">
            <div class="empty-center">
                <img src="https://static.iberhk.com/v2/web/images/hospital/delete.svg">
                <span>{{simply ? '该医院已被删除' : '該醫院已被刪除'}}</span>
            </div>
        </div>
        <share-btn :share="share"></share-btn>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';
import tranSim from '@/components/shared/language/tranSim.js';

import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import ShareBtn from "@/components/shared/component/card/sharebtn.vue";

export default {
    name: 'HospitalDetail',
    data() {
        return {
            hospitalUuid: this['urlParams'] ? this.urlParams['hospital_uuid'] : (this.$route.query['hospital_uuid'] ? this.$route.query['hospital_uuid'] : '4dc8c942d9b911e8929948d53963e249'),
            isLoaded: false,
            share: {},
            bottomAgentInfo: {},
            hospital: {
                tels: []
            },
            levels: {
                1: '一甲',
                2: '一乙',
                3: '一丙',
                4: '二甲',
                5: '二乙',
                6: '二丙',
                7: '三甲',
                8: '三乙',
                9: '三丙',
                10: '其他',
            },
            disclaimer: this.simply ? '免责声明：以上资料来自网络' : '免責聲明：以上資料來自網絡'
        }
    },
    components: {
        ConsultantCard,
        ShareBtn
    },
    created() {
        this.$root.blueLoadingParams.show = true;
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: true, // 分享上报，不上报可不传
            hospital_uuid: this.hospitalUuid,
            target_type: this.$root.fromType,
            user_uuid: this.userUuid,
            router: window.location.pathname
        };
    },
    mounted() {
        this.getHospitalInfo();
    },
    methods: {
        getHospitalInfo() {
            this.isLoaded = false;
            this.$http.get('/hospital/detail', {
                hospital_uuid: this.hospitalUuid,
            }).then(res => {
                if (res && res.code === 0) {
                    this.hospital = res.data;
                    this.hospital.levelName = this.levels[this.hospital.level];
                    this.hospital.locationHref = (/http\:\/\//ig.test(this.hospital.site) ? this.hospital.site : ('http://' + this.hospital.site));
                    if (this.hospital.department) {
                        this.hospital.departments = this.hospital.department.split(';');
                        this.hospital.departments = this.hospital.departments.filter((item) => {
                            return item.length > 0;
                        });
                    }
                    // 多个电话和地址处理
                    this.hospital.tel = this.hospital.tel.replace(/\、/ig, '；').replace(/\，/ig, '；').replace(/\,/ig, '；').replace(/\;/ig, '；');
                    this.hospital.address = this.hospital.address.replace(/\、/ig, '；').replace(/\，/ig, '；');
                    if (/\；/ig.test(this.hospital.tel)) {
                        this.hospital.tels = this.hospital.tel.split('；');
                    } else {
                        this.hospital.tels = [this.hospital.tel];
                    }
                    if (/\；/ig.test(this.hospital.address)) {
                        this.hospital.addresses = this.hospital.address.split('；');
                    } else {
                        this.hospital.addresses = [this.hospital.address];
                    }
                    if (/\<video/ig.test(this.hospital.info)) {
                        this.hospital.info = this.hospital.info && this.hospital.info.replace(/\<img src/ig, '<img data-emergence="hidden" data-src');
                        // 有视频时异步加载video-js.min.css和video.min.js
                        CommonJS.loadStyle('https://static.iberhk.com/res/css/video-js.min.css');
                        CommonJS.loadScript('https://static.iberhk.com/res/js/video.min.js', () => {});
                    } else {
                        this.hospital.info = this.hospital.info && this.hospital.info.replace(/ src/ig, ' data-emergence="hidden" data-src');
                    }
                    this.hospital.href = 'tel:' + this.hospital.tel;
                    this.share.title = this.hospital['name'];
                    this.share.thumbImage = (this.hospital.share && this.hospital.share['thumbImage']);
                    this.share.desc = this.hospital['address'];
                    this.share.url = window.location.origin + window.location.pathname + '?hospital_uuid=' + this.hospitalUuid + '&user_uuid=' + this.userUuid + '&target_type=' + this.share.target_type + '&one_way=' + this.userUuid;
                    if (!this.inApp) {
                        let firstReportParam = {
                            hospital_uuid: this.share.hospital_uuid,
                        };
                        this.userUuid && this.getRootUserInfo(firstReportParam).then(res => {
                            // 微信分享初始化
                            CommonJS.initWX(this.share);
                            // 浏览上报
                            CommonJS.readReport(this.share);
                            // 顶部消息提醒
                            this.$root.getAgentMsg();
                        });
                    }
                } else if (res && res.code === 1000) {
                    window.location.href = window.baseUrl + '/error/notfound';
                }
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
                CommonJS.lazyLoadImg();
            }, err => {
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
                window.location.href = window.baseUrl + '/error/404';
            })
        },
        getAgentInfo(data) {
            this.bottomAgentInfo = data;
            this.$forceUpdate();
        },
        goQQMap(item) {
            let region = this.hospital.city;
            ((this.hospital.city === '市辖区') || (this.hospital.city === '市轄區')) && (region = this.hospital.province);
            window.location.href = 'https://apis.map.qq.com/uri/v1/search?keyword=' + tranSim.simplized(item) + '&region=' + tranSim.simplized(region) + '&referer=PSRBZ-LREKQ-4EV56-GZBHY-6LL5T-CVFJN';
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hospital-inquiry {
    width: 100%;
    padding-bottom: .54rem;
}

.hospital-box {
    background-color: #F6F6F6;
    padding-bottom: .1rem;
}

.hospital-inner {
    padding: 0 .12rem;
    background-color: #fff;
}

.hospital-info-top {
    width: 100%;
    padding: .12rem 0;
    border-bottom: .005rem solid #dddddd;
}

.hospital-info-top .title {
    display: block;
    max-width: 2.88rem;
    font-size: .23rem;
    color: #2A2A2A;
    letter-spacing: 0;
    line-height: .33rem;
    font-weight: bold;
}

.hospital-info-top .type {
    width: .36rem;
    height: .18rem;
    border-radius: .09rem;
    text-align: center;
    font-size: .1rem;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: .18rem;
    background-color: #FF4722;
    position: absolute;
    right: 0;
    top: .16rem;
    font-weight: bold;
}

.hospital-info-top .gray {
    background-color: #F2F2F2;
    color: #666666;
}

.hospital-province {
    font-size: .13rem;
    color: #999999;
    letter-spacing: 0;
    line-height: .19rem;
    margin-top: .08rem;
}

.hospital-info-bottom {
    padding: .18rem 0 0 0;
}

.hospital-info-bottom .row {
    width: 100%;
    font-size: .15rem;
    color: #2A2A2A;
    letter-spacing: 0;
    line-height: .2rem;
    padding-bottom: .16rem;
}

.hospital-info-bottom .row .left {
    display: inline-block;
    vertical-align: top;
}

.hospital-info-bottom .row .center {
    display: inline-block;
    vertical-align: top;
    max-width: calc(100% - .86rem);
}

.hospital-info-bottom .row .right {
    position: absolute;
    right: 0;
    top: 0;
    color: #3364E4;
    margin-left: .12rem;
    cursor: pointer;
}

.hospital-info-bottom .row .tel-block {
    display: inline-block;
    min-width: 51%;
    margin-bottom: .04rem;
}

.hospital-info-bottom .row .tel-icon {
    position: absolute;
    right: -.30rem;
    top: 0rem;
    cursor: pointer;
    color: #3364E4;
}

.hospital-info-bottom .row .address-icon {
    position: absolute;
    right: -.30rem;
    top: 0rem;
    color: #3364E4;
    font-size: .18rem;
    cursor: pointer;
}

.hospital-content-title {
    font-size: .16rem;
    color: #333333;
    letter-spacing: 0;
    line-height: .2rem;
    padding-left: .12rem;
    font-weight: bold;
    margin: .16rem 0 .12rem 0;
}

.hospital-content-title:before {
    content: '';
    position: absolute;
    left: 0;
    top: .02rem;
    height: .16rem;
    width: .04rem;
    background-color: #3364E4;
}

.department-list {
    width: 100%;
    min-height: .5rem;
    padding: .04rem 0;
}

.department-block {
    float: left;
    padding: .08rem .16rem;
    background-color: #F2F2F2;
    border-radius: .16rem;
    margin: 0 .12rem .12rem 0;
    font-size: .13rem;
    color: #666666;
    letter-spacing: 0;
    text-align: center;
    line-height: .16rem;
}

.hospital-content {
    width: 100%;
    padding-bottom: .16rem;
    min-height: 4rem;
}

.hospital-image {
    width: 100%;
    min-height: 1rem;
    border-radius: .08rem;
    margin-bottom: .12rem;
}

.empty-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-center {
    width: 1.2rem;
    text-align: center;
}

.empty-center img {
    display: inline-block;
    width: 1rem;
}

.empty-center span {
    display: inline-block;
    font-size: .15rem;
    color: #CCCCCC;
    margin-top: .16rem;
}

.disclaimer-box {
    width: 100%;
    font-size: .14rem;
    color: #ccc;
    text-align: left;
    line-height: .17rem;
    background-color: #F6F6F6;
    padding: .12rem;
}
</style>
