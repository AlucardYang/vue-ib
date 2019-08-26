<template>
    <div id="calculator">
        <div class="top-main-content">
            <img class="top-main-bg" :src="bannerSrc">
            <div class="rich-age-box">
                <span class="rich-age-text">{{title1}}</span><br>
                <span class="rich-age">{{monthInvest}}</span><br>
                <span class="rich-age-text" style="margin-top: .14rem;">{{title2}}</span><br>
                <span class="rich-age">{{allInvest}}</span>
            </div>
        </div>
        <section class="com-scroll-y">
            <div class="calculator-content" :class="{'calculator-content-height': !inApp && agentInfo.nickname}">
                <div v-if="showCalcContent" class="bottom-main-content" :class="{loose: inIphoneX}">
                    <div class="bottom-main-tip" :class="{loose: inIphoneX}">{{top_tip}}</div>
                    <div class="row-block" :class="{loose: inIphoneX}">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title1}}</span>
                            <div class="input-box-right max">
                                <input id="moneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="money" name="money" :min="moneyMin" :max="moneyMax" :step="moneyStep" :placeholder="moneyPlaceholder" :style="{'top': moneyInputTop, 'z-index': 1, right: '.1rem'}"
                                    @input="inputChange('money')" @blur="inputChange('money', 'blur')">
                                <div class="input-box-right-input" @click="inputFocus()" style="right: .1rem">{{moneyString}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="money" :min="moneyMin" :max="moneyMax" :interval="moneyStep" :tooltip="false" @callback="rangeChange('money')"></vue-slider>
                            <span v-for="(item, index) in moneyValues" class="owner-grid-text" :style="{left: parseInt(item) / 10 * 0.5 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in moneyValues" class="irs-grid-pol" :style="{left: 100 / 4 * index + '%'}"></span>
                            <span v-for="(item, index) in moneyValues" class="irs-grid-pol small" :class="{'display-none': index === 4}" :style="{left: 100 / 4 * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <div class="row-block" :class="{loose: inIphoneX}">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title2}}</span>
                            <div class="input-box-right max">
                                <input id="yearInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="year" name="year" :min="yearMin" :max="yearMax" :step="yearStep" :placeholder="yearMin + '-' + yearMax" @input="inputChange('year')" @blur="inputChange('year', 'blur')">
                                <span class="input-box-right-unit">年</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="year" :min="yearMin" :max="yearMax" :interval="yearStep" :tooltip="false" @callback="rangeChange('year')"></vue-slider>
                            <span v-for="(item, index) in yearValues" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 3.33 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in yearValues" class="irs-grid-pol" :style="{left: 100 / 6 * index + '%'}"></span>
                            <span v-for="(item, index) in yearValues" class="irs-grid-pol small" :class="{'display-none': index === 6}" :style="{left: 100 / 6 * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <div class="row-block" :class="{loose: inIphoneX}">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title3}}</span>
                            <div class="input-box-right">
                                <input id="rateInput" class="input-box-right-input" type="number" v-model="rate" name="rate" :min="rateMin" :max="rateMax" :step="rateStep" :placeholder="rateMin + '-' + rateMax" @input="inputChange('rate')" @blur="inputChange('rate', 'blur')" @keydown="preventNotNumber($event)"
                                    style="right: .14rem">
                                <span class="input-box-right-unit">%</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="rate" :min="rateMin" :max="rateMax" :interval="rateStep" :tooltip="false" @callback="rangeChange('rate')"></vue-slider>
                            <span v-for="(item, index) in rateValues" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 5 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in rateValues" class="irs-grid-pol" :style="{left: 100 / rateGridNum * index + '%'}"></span>
                            <span v-for="(item, index) in rateValues" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / rateGridNum * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :top-tip="bottom_tip" :target-uuid="'calculator'" :from-type="'29'" @getAgentInfo="getAgentInfo"></consultant-card>
            <div class="disclaimer-box">{{disclaimer_text}}</div>
        </section>
        <calculator-share ref="calculatorShare" :share-title="this.share_title" :share-des="this.share_des"></calculator-share>
    </div>
</template>

<script>
import vueSlider from 'vue-slider-component';

import {
    Toast
} from 'mint-ui';

import calculatorJS from './calculator.js';

import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import CalculatorShare from "@/components/calculator/share.vue";

export default {
    name: 'MonthInvest',
    data() {
        return {
            inIphoneX: calculatorJS.iphoneXLayout(),
            bannerSrc: 'https://static.iberhk.com/v2/web/images/calculator/monthinvestbanner.png',
            showCalcContent: false,
            money: 5000000,
            moneyString: '5,000,000',
            moneyMin: 0,
            moneyMax: 20000000,
            moneyStep: 100000,
            moneyGridNum: 4,
            moneyValues: ['0', '500', '1000', '1500', '2000'],
            moneyInputTop: '-10000rem',
            moneyPlaceholder: '0-20,000,000',
            moneyTips: {
                empty: '金额不可為空',
                get: this.simply ? '金额不可大于2000万' : '金额不可大於2000萬',
                let: '金额不可小於0'
            },
            year: 30,
            yearMin: 0,
            yearMax: 30,
            yearStep: 1,
            yearGridNum: 6,
            yearValues: ['0', '5年', '10年', '15年', '20年', '25年', '30年'],
            yearTips: {
                empty: '年期不可為空',
                get: this.simply ? '年期不可大于30年' : '年期不可大於30年',
                let: '年期不可小於0'
            },
            rate: 5,
            rateMin: 0,
            rateMax: 20,
            rateStep: 0.1,
            rateGridNum: 4,
            rateValues: ['0', '5%', '10%', '15%', '20%'],
            rateTips: {
                empty: '回報率不可為空',
                get: this.simply ? '回报率不可大于20%' : '回報率不可大於20%',
                let: '回報率不可小於0'
            },
            monthInvest: '$5,983',
            allInvest: '$1,156,887',
            agentInfo: {},
            title1: this.simply ? '所需每月投资：' : '所需每月投資：',
            title2: this.simply ? '所需整付投资：' : '所需整付投資：',
            money_unit: this.simply ? '万' : '萬',
            top_tip: this.simply ? '拖动按钮计算所需的每月投资/整付投资' : '拖動按鈕計算所需的每月投資/整付投資',
            bottom_tip: this.simply ? '咨询财富顾问，让您离财富目标更近' : '諮詢財富顧問，讓您離財富目標更近',
            disclaimer_text: this.simply ? '免责声明：以上内容仅供参考' : '免責聲明：以上內容僅供參考',
            left_title1: this.simply ? '目标金额：' : '目標金額：',
            left_title2: this.simply ? '投资年期：' : '投資年期：',
            left_title3: this.simply ? '每年回报率：' : '每年回報率：',
            share_title: this.simply ? '月供投资计算器' : '月供投資計算器',
            share_des: this.simply ? '算算月供多少才能达到投资目标？' : '算算月供多少才能達到投資目標？',
            wrong_format_tip: this.simply ? '请输入正确的数字格式' : '請輸入正確的數字格式',
        };
    },
    components: {
        vueSlider,
        ConsultantCard,
        CalculatorShare
    },
    beforeCreate() {
        // window.title = (/cn/ig.test(this.language.currentLang) ? '月供投资计算器' : '月供投資計算器');
    },
    created() {},
    mounted() {
        this.$refs.calculatorShare.share.thumbImage = 'https://static.iberhk.com/v2/calculator/monthinvestbrief.png';
        // 渲染过快导致滑动组件不能点击滑动，需设些延时渲染
        const _this = this;
        setTimeout(() => {
            _this.showCalcContent = true;
        }, 500);
    },
    methods: {
        rangeChange(type) {
            this.calcReault();
            if (type === 'money') {
                this['moneyString'] = calculatorJS.formatMoney(this[type], 0, '');
            }
        },
        inputChange(type, handle) {
            var input = document.getElementById(type + 'Input');
            if (this[type] > this[type + 'Max']) {
                this[type] = this[type + 'Max'];
                Toast({
                    message: this[type + 'Tips']['get']
                });
            } else if (this[type] < this[type + 'Min']) {
                this[type] = this[type + 'Min'];
                Toast({
                    message: this[type + 'Tips']['let']
                });
            } else if (!this[type]) {
                handle && /money/ig.test(type) && (this['moneyString'] = 0);
                handle && (this[type] = this[type + 'Min']);
                !input.validity.valid && (this[type] = input['_value']);
            } else if (
                this[type] <= this[type + 'Max'] &&
                this[type] >= this[type + 'Min']
            ) {
                // 首位是0
                if (String(this[type])[0] === '0' && String(this[type]).length > 1) {
                    this[type] = parseFloat(this[type]);
                    Toast({
                        message: this.wrong_format_tip
                    });
                }
                handle && /rate/ig.test(type) && (this[type] = parseFloat(this[type]));
                if (type === 'year' || type === 'money') {
                    this[type] = parseFloat(this[type]);
                    type === 'money' && (this['moneyString'] = calculatorJS.formatMoney(parseInt(this[type]), 0, ''));
                }
            }
            if (handle) {
                this['moneyInputTop'] = '-10000rem';
            }
            this.calcReault();
        },
        inputFocus() {
            this['moneyInputTop'] = '.04rem';
            document.getElementById('moneyInput').focus();
        },
        calcReault() {
            let monthInvestMoney = 0,
                allInvestMoney = 0;
            if (this.money && this.money >= this.moneyMin && this.money <= this.moneyMax && this.year && this.year >= this.yearMin && this.year <= this.yearMax &&
                (this.rate === 0 || (this.rate && this.rate >= this.rateMin && this.rate <= this.rateMax))) {
                let n = 1 + this.rate / 12 * 0.01;
                let N = 1 + this.rate * 0.01;
                if (n > 1) {
                    monthInvestMoney = this.money / (n * (Math.pow(n, 12 * this.year) - 1) / (this.rate / 12 * 0.01));
                    allInvestMoney = this.money / Math.pow(N, this.year);
                } else {
                    monthInvestMoney = this.money / (12 * this.year);
                    allInvestMoney = this.money;
                }
            } else {
                monthInvestMoney = this.money;
                allInvestMoney = this.money;
            }
            this.monthInvest = calculatorJS.formatMoney(Math.round(monthInvestMoney), 0);
            this.allInvest = calculatorJS.formatMoney(Math.round(allInvestMoney), 0);
        },
        preventNotNumber(event) {
            calculatorJS.preventNotNumber(event);
        },
        getAgentInfo(data) {
            this.agentInfo = data;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./calculator.css">

</style>

<style scoped>
.calculator-content {
    padding-top: 1.6rem;
}

.calculator-content-height {
    min-height: calc(100% - 1.2rem);
}

.top-main-content {
    height: 1.6rem;
    background-image: linear-gradient(90deg, #4E7FFF 0%, #469FFF 100%);
}

.rich-age-box {
    left: .3rem;
    width: 2.1rem;
    text-align: left;
}

.rich-age-box .rich-age {
    font-size: .24rem;
    margin-top: .04rem;
    line-height: .29rem;
}

.rich-age-text {
    font-size: .15rem;
    color: #FFFFFF;
    line-height: .18rem;
}
</style>
