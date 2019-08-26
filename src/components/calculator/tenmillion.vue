<template>
    <div id="calculator">
        <div class="top-main-content">
            <img class="top-main-bg" :src="bannerSrc">
            <div class="rich-age-box">
                <span class="rich-age">{{richAge}}{{age_unit}}</span><br>
                <span class="rich-age-text">{{title}}</span>
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
                                <input id="ageInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="age" name="age" :min="ageMin" :max="ageMax" :step="ageStep" :placeholder="ageMin + '-' + ageMax" @input="inputChange('age')" @blur="inputChange('age', 'blur')">
                                <span class="input-box-right-unit">{{age_unit}}</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="age" :min="ageMin" :max="ageMax" :interval="ageStep" :tooltip="false" @callback="rangeChange('age')"></vue-slider>
                            <span v-for="(item, index) in ageValues" class="owner-grid-text" :style="{left: parseInt(item) * 1.427 + 0.4 + '%'}">{{item + ((index === 0)?'':age_unit)}}</span>
                            <span v-for="(item, index) in ageValues" class="irs-grid-pol" :style="{left: 100 / 7 * index + '%'}"></span>
                            <span v-for="(item, index) in ageValues" class="irs-grid-pol small" :class="{'display-none': index === 7}" :style="{left: 100 / 7 * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <div class="row-block" :class="{loose: inIphoneX}">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title2}}</span>
                            <div class="input-box-right max">
                                <input id="moneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="money" name="money" :min="moneyMin" :max="moneyMax" :step="moneyStep" :placeholder="moneyPlaceholder" :style="{top: moneyInputTop, 'z-index': 1, right: '.1rem'}"
                                    @input="inputChange('money')" @blur="inputChange('money', 'blur')">
                                <div class="input-box-right-input" @click="inputFocus()" style="right: .1rem">{{moneyString}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="money" :min="moneyMin" :max="moneyMax" :interval="moneyStep" :tooltip="false" @callback="rangeChange('money')"></vue-slider>
                            <span v-for="(item, index) in moneyValues" class="owner-grid-text" :style="{left: parseInt(item) * 5 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in moneyValues" class="irs-grid-pol" :style="{left: 100 / moneyGridNum * index + '%'}"></span>
                            <span v-for="(item, index) in moneyValues" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / moneyGridNum * (index + 0.5) + '%'}"></span>
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
            <consultant-card :user-uuid="userUuid" :top-tip="bottom_tip" :target-uuid="'calculator'" :from-type="'21'" @getAgentInfo="getAgentInfo"></consultant-card>
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
    name: 'TenMillion',
    data() {
        return {
            inIphoneX: calculatorJS.iphoneXLayout(),
            bannerSrc: 'https://static.iberhk.com/v2/web/images/calculator/tenmillionbanner.png',
            showCalcContent: false,
            age: 18,
            ageMin: 0,
            ageMax: 70,
            ageStep: 1,
            ageGridNum: 7,
            ageValues: ['0', '10', '20', '30', '40', '50', '60', '70'],
            ageTips: {
                empty: '年齡不可為空',
                get: this.simply ? '年龄不可大于70岁' : '年齡不可大於70歲',
                let: '年齡不可小於0'
            },
            money: 10000,
            moneyString: '10,000',
            moneyMin: 0,
            moneyMax: 200000,
            moneyStep: 1000,
            moneyGridNum: 4,
            moneyValues: ['0', '5', '10', '15', '20'],
            moneyInputTop: '-10000rem',
            moneyPlaceholder: '0-200,000',
            moneyTips: {
                empty: '投資不可為空',
                get: this.simply ? '投资不可大于20万' : '投資不可大於20萬',
                let: '投資不可小於0'
            },
            rate: 10.6,
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
            richAge: 40,
            year: 1,
            agentInfo: {},
            title: this.simply ? '您将成为千万富翁' : '您將成為千萬富翁',
            age_unit: this.simply ? '岁' : '歲',
            money_unit: this.simply ? '万' : '萬',
            top_tip: this.simply ? '拖动按钮查看您几时成为千万富翁' : '拖動按鈕查看您幾時成為千萬富翁',
            bottom_tip: this.simply ? '咨询财富顾问，成就您的千万富翁' : '諮詢財富顧問，成就您的千萬富翁',
            disclaimer_text: this.simply ? '免责声明：以上内容仅供参考' : '免責聲明：以上內容僅供參考',
            left_title1: this.simply ? '现在年龄：' : '現在年齡：',
            left_title2: this.simply ? '每月投资：' : '每月投資：',
            left_title3: this.simply ? '每年回报率：' : '每年回報率：',
            share_title: this.simply ? '千万富翁计算器' : '千萬富翁計算器',
            share_des: this.simply ? '算算你几时能成为千万富翁？' : '算算你幾時能成為千萬富翁？',
            wrong_format_tip: this.simply ? '请输入正确的数字格式' : '請輸入正確的數字格式',
        };
    },
    components: {
        vueSlider,
        ConsultantCard,
        CalculatorShare
    },
    beforeCreate() {
        // window.title = (/cn/ig.test(this.language.currentLang) ? '成为千万富翁' : '成為千萬富翁');
    },
    created() {},
    mounted() {
        this.$refs.calculatorShare.share.thumbImage = 'https://static.iberhk.com/v2/calculator/tenmillionbrief.png';
        // 渲染过快导致滑动组件不能点击滑动，需设些延时渲染
        const _this = this;
        setTimeout(() => {
            _this.showCalcContent = true;
        }, 500);
    },
    methods: {
        rangeChange(type) {
            if (type === 'money') {
                if (this[type] === 0) {
                    Toast({
                        message: this.simply ? '请输入大于0的金额' : '請輸入大於0的金額'
                    });
                    setTimeout(() => {
                        this[type] = 10000;
                        this['moneyString'] = calculatorJS.formatMoney(this[type], 0, '');
                        this.calcReault();
                    }, 1000);
                }
                this['moneyString'] = calculatorJS.formatMoney(this[type], 0, '');
            }
            this.calcReault();
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
                if (this[type] === 0 && (type === 'money')) {
                    Toast({
                        message: this.simply ? '请输入大于0的金额' : '請輸入大於0的金額'
                    });
                    this[type] = 10000;
                    this['moneyString'] = calculatorJS.formatMoney(parseInt(this[type]), 0, '');
                }
            } else if (this[type] <= this[type + 'Max'] && this[type] >= this[type + 'Min']) {
                // 首位是0
                if (String(this[type])[0] === '0' && String(this[type]).length > 1) {
                    this[type] = parseFloat(this[type]);
                    Toast({
                        message: this.wrong_format_tip
                    });
                }
                handle && /rate/ig.test(type) && (this[type] = parseFloat(this[type]));
                if (type === 'age' || type === 'money') {
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
            document.getElementById('frameworkView').scrollTop = 100;
        },
        calcReault() {
            if ((this.age === 0 || (this.age && this.age >= this.ageMin && this.age <= this.ageMax)) && this.money && this.money >= this.moneyMin && this.money <= this.moneyMax && (this.rate === 0 || (this.rate && this.rate >= this.rateMin && this.rate <= this.rateMax))) {
                var n = 1 + this.rate * 0.01;
                if (n > 1 && this.money * 12 * n * (1 - Math.pow(n, this.year)) / (1 - n) <= 10000000) {
                    this.year++;
                    this.calcReault();
                } else if (n === 1) {
                    this.richAge = Math.ceil(this.age + 10000000 / (this.money * 12));
                } else {
                    this.richAge = parseInt(this.age + this.year);
                    this.year = 1;
                }
            } else {
                this.year = 1;
                this.richAge = 0;
            }
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

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style src="./calculator.css">

</style>

<style scoped>
.top-main-content {
    background-image: linear-gradient(90deg, #4E7FFF 0%, #469FFF 100%);
}

.calculator-content-height {
    min-height: calc(100% - 1.2rem);
}
</style>
