<template>
    <div v-show="isLoaded" id="rateInquiry" class="rate-inquiry">
        <div class="currency-rate-head">
            <div class="currency">
                <span>{{simply ? '币种' : '幣種'}}</span>
                <span class="mark">（{{simply ? '单位' : '單位'}}100）</span>
            </div>
            <div class="rmb">
                <span>{{simply ? '人民币' : '人民幣'}}</span>
            </div>
            <div class="hk">
                <span>{{simply ? '港币' : '港幣'}}</span>
            </div>
        </div>
        <div class="currency-rate-list com-scroll-y" :style="{'padding-bottom': inApp ? '.48rem' : 0}">
            <ul v-if="currencys.length > 0" class="currency-rate-body">
                <li class="row" v-for="(item, index) in currencys" :key="index" :style="{'margin-bottom': (index === currencys.length - 1) ? 0 : '.1rem'}" @click="goCurrencyDetail(item.key)">
                    <div class="currency">
                        <div class="img-box">
                            <img src="https://static.iberhk.com/v2/web/images/application/national-flag.png" class="img" :style="{'top': nationalFlagPostion[item.key]}">
                        </div>
                        <span class="en">{{item.key}}</span><br>
                        <span class="cn">{{simply ? item.name_cn : item.name_tw}}</span>
                    </div>
                    <div class="rmb">
                        <span>{{item.cny_money | formatMoney(4, '')}}</span>
                    </div>
                    <div class="hk">
                        <span>{{item.hkd_money | formatMoney(4, '')}}</span>
                    </div>
                    <i class="iconfont go-detail">&#xe6bb;</i>
                </li>
            </ul>
            <div class="disclaimer-box">
                <div v-if="updateAt" class="top">{{simply ? '更新时间：' : '更新時間：'}}{{updateAt}}</div>
                <div class="bottom">
                    <span>{{simply ? '免责声明：' : '免責聲明：'}}</span>
                    <span class="disclaimer">{{disclaimer}}</span>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :target-uuid="'rateInquiry'" :from-type="'11'" :share-from="true" style="background-color: #F6F6F6"></consultant-card>
        </div>
        <share-btn :share="share" :is-pro="isPro"></share-btn>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import ShareBtn from "@/components/shared/component/card/sharebtn.vue";

export default {
    name: 'ExchangeRateList',
    data() {
        return {
            hasUSD: this.$route.query['hasUSD'],
            share: {},
            currencyList: {
                '阿联酋迪拉姆': 'AED',
                '澳大利亚元': 'AUD',
                '澳门元': 'MOP',
                '巴西里亚尔': 'BRL',
                '丹麦克朗': 'DKK',
                '菲律宾比索': 'PHP',
                '韩国元': 'KRW',
                '加拿大元': 'CAD',
                '卢布': 'RUB',
                '林吉特': 'MYR',
                '美元': 'USD',
                '南非兰特': 'ZAR',
                '挪威克朗': 'NOK',
                '欧元': 'EUR',
                '日元': 'JPY',
                '瑞典克朗': 'SEK',
                '瑞士法郎': 'CHF',
                '沙特里亚尔': 'SAR',
                '新台币': 'TWD',
                '泰国铢': 'THB',
                '土耳其里拉': 'TRY',
                '港币': 'HKD',
                '新加坡元': 'SGD',
                '新西兰元': 'NZD',
                '印度卢比': 'INR',
                '印尼卢比': 'IDR',
                '英镑': 'GBP',
                '人民币': 'RMB'
            },
            nationalFlagPostion: {
                'AED': 0,
                'AUD': '-0.32rem',
                'MOP': '-0.64rem',
                'BRL': '-0.96rem',
                'DKK': '-1.28rem',
                'PHP': '-1.60rem',
                'KRW': '-1.92rem',
                'CAD': '-2.24rem',
                'RUB': '-2.56rem',
                'MYR': '-2.88rem',
                'USD': '-3.20rem',
                'ZAR': '-3.52rem',
                'NOK': '-3.84rem',
                'EUR': '-4.16rem',
                'JPY': '-4.48rem',
                'SEK': '-4.80rem',
                'CHF': '-5.12rem',
                'SAR': '-5.44rem',
                'TWD': '-5.76rem',
                'THB': '-6.08rem',
                'TRY': '-6.40rem',
                'HKD': '-6.72rem',
                'SGD': '-7.04rem',
                'NZD': '-7.36rem',
                'INR': '-7.68rem',
                'IDR': '-8.00rem',
                'GBP': '-8.32rem',
                'RMB': '-8.64rem'
            },
            currencys: [],
            isLoaded: false,
            disclaimer: this.simply ? '数据来自中国银行公开的“中行折算价”，仅供参考。交易时以银行柜台成交价为准。' : '數據來自中國銀行公開的“中行折算價”，僅供參考。交易時以銀行櫃檯成交價為準。',
            updateAt: '',
            isPro: 1
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
            title: this.simply ? '汇率查询' : '匯率查詢',
            thumbImage: '',
            desc: this.simply ? '支持多国货币汇率实时查询，与人民币／港币兑换计算。' : '支持多國貨幣匯率實時查詢，與人民幣／港幣兌換計算。',
            isReport: true, // 分享上报，不上报可不传
            sapp_uuid: this['urlParams'] ? this['urlParams']['sapp_uuid'] : (this.$route.query['sapp_uuid'] ? this.$route.query['sapp_uuid'] : ''),
            target_type: this.$root.fromType,
            user_uuid: this.userUuid,
            router: window.location.pathname,
            url: window.location.origin + window.location.pathname
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            this.isLoaded = false;
            this.$http.get('/exchange-rate/list', {}, {
                uuid: this.userUuid
            }).then(res => {
                this.isPro = (res.extra && res.extra.is_pro);
                if (res && res.code === 0) {
                    this.currencys = res.data.list;
                    this.currencys.length > 0 && (this.updateAt = this.currencys[0].update_at);
                    this.share.thumbImage = res.data.share.thumbImage;
                    this.share.url = window.location.origin + window.location.pathname + '?user_uuid=' + this.userUuid + '&target_type=' + this.share.target_type + '&sapp_uuid=' + this.share.sapp_uuid + '&one_way=' + this.userUuid;
                    if (!this.inApp) {
                        let firstReportParam = {
                            sapp_uuid: this.share.sapp_uuid,
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
                }
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
            }, err => {
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
                window.location.href = window.baseUrl + '/error/404';
            })
        },
        goCurrencyDetail(key) {
            window.location.href = window.baseUrl + '/exchange-rate/convert?user_uuid=' + this.userUuid + '&key=' + key + '&in_app=' + (this.inApp ? 1 : 0) + '&language=' + this.lang + (this.hasUSD == 1 ? ('&hasUSD=' + this.hasUSD) : '');
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.currency-rate-list {
    width: 100%;
    padding-bottom: .48rem;
}

.currency-rate-head {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: .48rem;
    line-height: .48rem;
    font-size: .15rem;
    color: #2A2A2A;
    padding: 0 .12rem;
    z-index: 1;
    background-color: #fff;
}

.currency-rate-body {
    background-color: #F6F6F6;
    padding: .12rem;
    padding-top: .6rem;
}

.currency-rate-list .row {
    width: 100%;
    height: .72rem;
    line-height: .72rem;
    background-color: #fff;
    border-radius: .08rem;
    font-size: .15rem;
    color: #2A2A2A;
    margin-bottom: .1rem;
    cursor: pointer;
}

.rate-inquiry .currency {
    float: left;
    width: 1.3rem;
    text-align: left;
    padding-left: .12rem;
    height: .72rem;
    overflow: hidden;
}

.rate-inquiry .currency .mark {
    display: inline-block;
    font-size: .12rem;
    color: #666666;
    margin-left: -.08rem;
}

.rate-inquiry .currency .img-box {
    width: .34rem;
    height: .32rem;
    border-radius: .16rem;
    top: .2rem;
    overflow: hidden;
}

.rate-inquiry .currency .img {
    display: inline-block;
    position: absolute;
    left: .01rem;
    top: 0;
    width: .32rem;
    height: auto;
}

.rate-inquiry .currency .en {
    display: inline-block;
    line-height: .3rem;
    position: absolute;
    left: .52rem;
    top: .11rem;
}

.rate-inquiry .currency .cn {
    display: inline-block;
    font-size: .13rem;
    line-height: .13rem;
    position: absolute;
    left: .52rem;
    top: .4rem;
    word-break: keep-all;
}

.rate-inquiry .rmb {
    float: left;
    width: calc(50% - .83rem);
    text-align: right;
}

.rate-inquiry .hk {
    float: left;
    width: calc(50% - .83rem);
    text-align: right;
}

.currency-rate-list .go-detail {
    display: inline-block;
    position: absolute;
    right: .08rem;
    top: 50%;
    transform: translateY(-50%);
    color: #ddd;
    cursor: pointer;
    font-size: .14rem;
    line-height: .2rem;
}

.disclaimer-box {
    width: 100%;
    font-size: .14rem;
    color: #ccc;
    text-align: left;
    line-height: .17rem;
    background-color: #F6F6F6;
    padding: .04rem .12rem .14rem .12rem;
}

.disclaimer-box .top {
    margin-bottom: .1rem;
}

.disclaimer-box .bottom {
    height: .34rem;
}

.disclaimer-box .bottom .disclaimer {
    position: absolute;
    width: 2.8rem;
    left: .71rem;
    top: 0;
}
</style>
