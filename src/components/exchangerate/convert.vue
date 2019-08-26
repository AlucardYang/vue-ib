<template>
    <div id="currencyExchange" class="currency-exchange" @click="focusElement($event)">
        <div class="currency-exchange-inner">
            <ul class="currency-exchange-box">
                <li class="row">
                    <div class="left">
                        <div class="img-box">
                            <img src="https://static.iberhk.com/v2/web/images/application/national-flag.png" class="img" :style="{'top': nationalFlagPostion[currency.key]}">
                        </div>
                        <span>{{currency.key}}</span>
                    </div>
                    <div class="right">
                        <input id="currencyInput" class="input" type="number" v-model="currency.value" @input="inputChange('currency')" @blur="blurChange('currency')" @keydown="preventNotNumber($event)" :style="{'top': isDisable ? '-120000rem' : 0}">
                        <div class="input gray" :style="{'top': isDisable ? 0 : '-120000rem'}" @click="inputFocus('currency')">{{currency.showValue | formatMoney(4, '')}}</div>
                        <span>{{currency.name}}</span>
                    </div>
                </li>
                <li v-show="hasUSD == 1" class="row">
                    <div class="left">
                        <div class="img-box">
                            <img src="https://static.iberhk.com/v2/web/images/application/national-flag.png" class="img" :style="{'top': nationalFlagPostion[USD.key]}">
                        </div>
                        <span>{{USD.key}}</span>
                    </div>
                    <div class="right">
                        <input id="USDInput" class="input" type="number" v-model="USD.value" @input="inputChange('USD')" @blur="blurChange('USD')" @keydown="preventNotNumber($event)" :style="{'top': isDisable ? '-120000rem' : 0}">
                        <div class="input gray" :style="{'top': isDisable ? 0 : '-120000rem'}" @click="inputFocus('USD')">{{USD.showValue | formatMoney(4, '')}}</div>
                        <span>{{USD.name}}</span>
                    </div>
                </li>
                <li v-show="currency.key !== 'RMB'" class="row" :style="{'border-bottom': currency.key === 'HKD' ? 'none' : '1px solid #DDDDDD'}">
                    <div class="left">
                        <div class="img-box">
                            <img src="https://static.iberhk.com/v2/web/images/application/national-flag.png" class="img" :style="{'top': nationalFlagPostion[RMB.key]}">
                        </div>
                        <span>{{RMB.key}}</span>
                    </div>
                    <div class="right">
                        <input id="RMBInput" class="input" type="number" v-model="RMB.value" @input="inputChange('RMB')" @blur="blurChange('RMB')" @keydown="preventNotNumber($event)" :style="{'top': isDisable ? '-120000rem' : 0}">
                        <div class="input gray" :style="{'top': isDisable ? 0 : '-120000rem'}" @click="inputFocus('RMB')">{{RMB.showValue | formatMoney(4, '')}}</div>
                        <span>{{RMB.name}}</span>
                    </div>
                </li>
                <li v-show="currency.key !== 'HKD'" class="row" style="border-bottom: none;">
                    <div class="left">
                        <div class="img-box">
                            <img src="https://static.iberhk.com/v2/web/images/application/national-flag.png" class="img" :style="{'top': nationalFlagPostion[HKD.key]}">
                        </div>
                        <span>{{HKD.key}}</span>
                    </div>
                    <div class="right">
                        <input id="HKDInput" class="input" type="number" v-model="HKD.value" @input="inputChange('HKD')" @blur="blurChange('HKD')" @keydown="preventNotNumber($event)" :style="{'top': isDisable ? '-120000rem' : 0}">
                        <div class="input gray" :style="{'top': isDisable ? 0 : '-120000rem'}" @click="inputFocus('HKD')">{{HKD.showValue | formatMoney(4, '')}}</div>
                        <span>{{HKD.name}}</span>
                    </div>
                </li>
            </ul>
            <div class="disclaimer-box">
                <div v-if="updateAt" class="top">{{simply ? '更新时间：' : '更新時間：'}}{{updateAt}}</div>
                <div class="bottom">
                    <span>{{simply ? '免责声明：' : '免責聲明：'}}</span>
                    <span class="disclaimer">{{disclaimer}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Toast
} from 'mint-ui';

import CommonJS from '@/components/shared/service/common.js';
import calculatorJS from '../calculator/calculator.js';

export default {
    name: 'ExchangeRateConvert',
    data() {
        return {
            isDisable: true,
            hasUSD: this.$route.query['hasUSD'],
            refreshTime: 1000 * 60 * 1, // 1分钟
            cnyRate: 1,
            hkdRate: 1,
            usdRate: 1,
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
            getTip: this.simply ? '最多可输入千万单位' : '最多可輸入千萬單位',
            disclaimer: this.simply ? '数据来自中国银行公开的“中行折算价”，仅供参考。交易时以银行柜台成交价为准。' : '數據來自中國銀行公開的“中行折算價”，僅供參考。交易時以銀行櫃檯成交價為準。',
            currency: {
                name: '',
                key: this['urlParams'] ? this.urlParams['key'] : (this.$route.query['key'] ? this.$route.query['key'] : 'RMB'),
                value: 100,
                showValue: 100,
            },
            RMB: {
                name: this.simply ? '人民币' : '人民幣',
                key: 'RMB',
                value: 0,
                showValue: 0,
            },
            HKD: {
                name: this.simply ? '港币' : '港幣',
                key: 'HKD',
                value: 0,
                showValue: 0,
            },
            USD: {
                name: this.simply ? '美金' : '美金',
                key: 'USD',
                value: 0,
                showValue: 0,
            },
            updateAt: '',
        }
    },
    components: {},
    created() {
        this.$root.blueLoadingParams.show = true;
        this.share = {
            type: 'news',
            title: this.simply ? '汇率查询' : '匯率查詢',
            thumbImage: '',
            desc: this.simply ? '支持多国货币汇率实时查询，与人民币／港币兑换计算。' : '支持多國貨幣匯率實時查詢，與人民幣／港幣兌換計算。',
            target_type: 31,
            user_uuid: this.userUuid,
            c_user_uuid: '',
            router: window.location.pathname
        };
        this.currency.showValue = this.currency.value = Number(this.currency.value.toFixed(4));
        this.RMB.showValue = this.RMB.value = Number(this.RMB.value.toFixed(4));
        this.HKD.showValue = this.HKD.value = Number(this.HKD.value.toFixed(4));
        this.USD.showValue = this.USD.value = Number(this.USD.value.toFixed(4));
    },
    mounted() {
        this.getConvert();
        const _this = this;
        setInterval(() => {
            _this.getConvert();
        }, this.refreshTime);
    },
    methods: {
        getConvert() {
            this.$http.get('/exchange-rate/convert', {
                key: this.currency.key
            }).then(res => {
                if (res && res.code === 0) {
                    let data = res.data;
                    this.updateAt = data.update_at;
                    this.currency.name = this.simply ? data.name_cn : data.name_tw;
                    this.cnyRate = Number(data.cny_money) / 100;
                    this.hkdRate = Number(data.hkd_money) / 100;
                    this.calcReault('currency');
                    this.getUSDConvert();
                    this.share.url = window.location.origin + window.location.pathname.replace(/convert/ig, 'list') + '?user_uuid=' + this.userUuid + '&key=' + this.currency.key + '&target_type=' + this.share.target_type + '&one_way=' + this.userUuid;
                    if (!this.inApp) {
                        this.userUuid && this.getRootUserInfo().then(res => {
                            // 微信分享初始化
                            CommonJS.initWX(this.share);
                            // 顶部消息提醒
                            this.$root.getAgentMsg();
                        });
                    }
                }
                this.$root.blueLoadingParams.show = false;
            }, err => {
                this.$root.blueLoadingParams.show = false;
                window.location.href = window.baseUrl + '/error/404';
            })
        },
        getUSDConvert() {
            if (this.hasUSD) {
                this.$http.get('/exchange-rate/convert', {
                    key: 'USD'
                }).then(res => {
                    if (res && res.code === 0) {
                        this.usdRate = this.cnyRate / (Number(res.data.cny_money) / 100);
                        this.calcReault('currency');
                    }
                }, err => {})
            }
        },
        inputChange(type) {
            if (this[type]['value'] - 99999999.9999 > 0) {
                this[type]['value'] = 99999999.9999;
                Toast({
                    message: this.getTip
                });
            }
            if (this[type]['value']) {
                let strs = String(this[type]['value']).split('.');
                if (strs.length === 2 && strs[1].length >= 4) {
                    this[type]['value'] = parseFloat(String(this[type]['value']).match(/^\d+(?:\.\d{0,4})?/));
                }
            }
            this.calcReault(type);
        },
        blurChange(type) {
            setTimeout(() => {
                this.isDisable = true;
                this[type]['focus'] = false;
                if (this[type]['value'] || (this[type]['value'] == 0)) {
                    this[type]['showValue'] = this[type]['value'] = Number(this[type]['value']).toFixed(4);
                    this.calcReault(type, 'blur');
                }
            }, 30);
        },
        inputFocus(type) {
            this.isDisable = false;
            document.getElementById(type + 'Input').focus();
            this[type]['focus'] = true;
            this.currency.value = undefined;
            this.RMB.value = undefined;
            this.HKD.value = undefined;
            this.USD.value = undefined;
        },
        calcReault(type, handle) {
            if (type === 'currency' && this.currency.value) {
                this.RMB.showValue = this.RMB.value = (this.currency.value * this.cnyRate).toFixed(4);
                this.HKD.showValue = this.HKD.value = (this.currency.value * this.hkdRate).toFixed(4);
                this.USD.showValue = this.USD.value = (this.currency.value * this.usdRate).toFixed(4);
            } else if (type === 'RMB' && this.RMB.value) {
                this.currency.showValue = this.currency.value = (this.RMB.value / this.cnyRate).toFixed(4);
                this.HKD.showValue = this.HKD.value = (this.currency.value * this.hkdRate).toFixed(4);
                this.USD.showValue = this.USD.value = (this.currency.value * this.usdRate).toFixed(4);
            } else if (type === 'HKD' && this.HKD.value) {
                this.currency.showValue = this.currency.value = (this.HKD.value / this.hkdRate).toFixed(4);
                this.RMB.showValue = this.RMB.value = (this.currency.value * this.cnyRate).toFixed(4);
                this.USD.showValue = this.USD.value = (this.currency.value * this.usdRate).toFixed(4);
            } else if (type === 'USD' && this.USD.value) {
                this.currency.showValue = this.currency.value = (this.USD.value / this.usdRate).toFixed(4);
                this.RMB.showValue = this.RMB.value = (this.currency.value * this.cnyRate).toFixed(4);
                this.HKD.showValue = this.HKD.value = (this.currency.value * this.hkdRate).toFixed(4);
            } else if (handle === 'blur' && !this.currency.value) {
                this.currency.showValue = this.currency.value = 0.0000;
            } else if (handle === 'blur' && !this.RMB.value) {
                this.RMB.showValue = this.RMB.value = 0.0000;
            } else if (handle === 'blur' && !this.HKD.value) {
                this.HKD.showValue = this.HKD.value = 0.0000;
            } else if (handle === 'blur' && !this.USD.value) {
                this.USD.showValue = this.USD.value = 0.0000;
            }
        },
        preventNotNumber(event) {
            calculatorJS.preventNotNumber(event);
        },
        focusElement(event) {
            setTimeout(() => {
                if ((event.target.id === 'currencyInput') || (event.target.id === 'RMBInput') || (event.target.id === 'HKDInput') || (event.target.id === 'USDInput')) {
                    this.inputFocus(event.target.id.replace(/Input/, ''));
                }
            }, 150);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* 修改mint toast提示 */

.mint-toast.is-placemiddle {
    transform: translate(-50%, -120%);
}
</style>

<style scoped>
.currency-exchange {
    width: 100%;
    min-height: 100%;
}

.currency-exchange-inner {
    width: 100%;
    min-height: 100%;
    background-color: #F6F6F6;
    padding: .12rem;
}

.currency-exchange-box {
    background-color: #FFFFFF;
    border-radius: .08rem;
    padding: 0 .12rem;
}

.currency-exchange-box .row {
    width: 100%;
    height: .9rem;
    border-bottom: 1px solid #DDDDDD;
}

.currency-exchange-box .left {
    max-width: .4rem;
    text-align: center;
    position: absolute;
    top: 56%;
    left: 0;
    transform: translateY(-50%);
    overflow: hidden;
}

.currency-exchange-box .left .img-box {
    width: .32rem;
    height: .32rem;
    border-radius: .16rem;
    box-sizing: border-box;
    overflow: hidden;
}

.currency-exchange-box .left .img {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    width: .32rem;
    height: auto;
}

.currency-exchange-box .left span {
    display: inline-block;
    font-size: .12rem;
    color: #2A2A2A;
    line-height: .15rem;
}

.currency-exchange-box .right {
    width: calc(100% - .5rem);
    text-align: right;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    height: .58rem;
}

.currency-exchange-box .right .input {
    font-family: PingFangSC-Light, Roboto, HelveticaNeue, Helvetica, Arial, sans-serif;
    width: 100%;
    border: none;
    outline: none;
    height: .36rem;
    line-height: .36rem;
    font-size: .28rem;
    color: #2A2A2A;
    text-align: right;
    padding: 0 .01rem;
    font-weight: bold;
    position: absolute;
    top: 0;
    right: 0;
    background-color: #fff;
}

.currency-exchange-box .right .input.gray {
    color: #CCCCCC;
}

.currency-exchange-box .right span {
    font-size: .12rem;
    color: #CCCCCC;
    line-height: .15rem;
    position: absolute;
    bottom: 0;
    right: 0;
}

input::-webkit-inner-spin-button {
    margin-top: .065rem;
    display: none;
}

.disclaimer-box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: .14rem;
    color: #ccc;
    text-align: left;
    line-height: .17rem;
    background-color: #F6F6F6;
    padding: .04rem .12rem .16rem .12rem;
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
