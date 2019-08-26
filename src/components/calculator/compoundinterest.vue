<template>
    <div id="calculator">
        <ul class="calc-tab-nav">
            <li :class="{current: type === 'final'}" @click="changeType('final')">
                <span>{{tab1}}</span>
            </li>
            <li :class="{current: type === 'capital'}" @click="changeType('capital')">
                <span>{{tab2}}</span>
            </li>
        </ul>
        <div class="top-main-content">
            <img class="top-main-bg" v-show="type === 'final'" :src="finalBannerSrc">
            <img class="top-main-bg" v-show="type === 'capital'" :src="capitalBannerSrc">
            <div class="rich-age-box" :class="{'capital': type === 'capital', 'left-margin': (type === 'final') && (moneyTitle.length >= 13)}" :style="{left: richAgeBoxLeft}">
                <span class="rich-age-text">{{type === 'final' ? tab1 : tab2}}</span><br>
                <span class="rich-age">{{moneyTitle}}</span>
            </div>
        </div>
        <section class="com-scroll-y">
            <div class="calculator-content" :class="{'calculator-content-height': !inApp && agentInfo.nickname, 'calculator-content-inapp': inApp}">
                <div v-if="showCalcContent" class="bottom-main-content" :class="{loose: inIphoneX}">
                    <div class="bottom-main-tip" :class="{loose: inIphoneX}">{{top_tip}}{{type === 'final' ? tab1 : tab2}}</div>
                    <div class="row-block" :class="{loose: inIphoneX}">
                        <div class="input-box">
                            <span class="input-box-left">{{type === 'final' ? tab2 : tab1}}：</span>
                            <div class="input-box-right" :class="{'max': type === 'final'}">
                                <input id="moneyInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="money" name="money" :min="moneyMin" :max="moneyMax" :step="moneyStep" :style="{top: moneyInputTop, 'z-index': 1, right: '.1rem'}" :placeholder="moneyPlaceholder"
                                    @input="inputChange('money')" @blur="inputChange('money', 'blur')">
                                <div class="input-box-right-input" @click="inputFocus()" style="right: .1rem">{{moneyString}}</div>
                                <span class="input-box-right-unit">$</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="money" :min="moneyMin" :max="moneyMax" :interval="moneyStep" :tooltip="false" @callback="rangeChange('money')"></vue-slider>
                            <span v-for="(item, index) in moneyValues" class="owner-grid-text" :style="{left: parseInt(item) * 0.1 + 0.4 + '%'}">{{item + ((index === 0)?'':money_unit)}}</span>
                            <span v-for="(item, index) in moneyValues" class="irs-grid-pol" :style="{left: 100 / 5 * index + '%'}"></span>
                            <span v-for="(item, index) in moneyValues" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / 5 * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <div class="row-block" :class="{loose: inIphoneX}">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title2}}</span>
                            <div class="input-box-right">
                                <input id="rateInput" class="input-box-right-input" type="number" v-model="rate" name="rate" :min="rateMin" :max="rateMax" :step="rateStep" :placeholder="rateMin + '-' + rateMax" @input="inputChange('rate')" @blur="inputChange('rate', 'blur')" @keydown="preventNotNumber($event)"
                                    style="right: .14rem">
                                <span class="input-box-right-unit">%</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="rate" :min="rateMin" :max="rateMax" :interval="rateStep" :tooltip="false" @callback="rangeChange('rate')"></vue-slider>
                            <span v-for="(item, index) in rateValues" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 3.33 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in rateValues" class="irs-grid-pol" :style="{left: 100 / 6 * index + '%'}"></span>
                            <span v-for="(item, index) in rateValues" class="irs-grid-pol small" :class="{'display-none': index === 6}" :style="{left: 100 / 6 * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                    <div class="row-block" :class="{loose: inIphoneX}">
                        <div class="input-box">
                            <span class="input-box-left">{{left_title3}}</span>
                            <div class="input-box-right">
                                <input id="yearInput" class="input-box-right-input" type="number" pattern="[0-9]*" v-model="year" name="year" :min="yearMin" :max="yearMax" :step="yearStep" :placeholder="yearMin + '-' + yearMax" @input="inputChange('year')" @blur="inputChange('year', 'blur')">
                                <span class="input-box-right-unit">年</span>
                            </div>
                        </div>
                        <div class="drag-progress-box">
                            <vue-slider v-model="year" :min="yearMin" :max="yearMax" :interval="yearStep" :tooltip="false" @callback="rangeChange('year')"></vue-slider>
                            <span v-for="(item, index) in yearValues" class="owner-grid-text" v-text="item" :style="{left: parseInt(item) * 1 + 0.4 + '%'}"></span>
                            <span v-for="(item, index) in yearValues" class="irs-grid-pol" :style="{left: 100 / 5 * index + '%'}"></span>
                            <span v-for="(item, index) in yearValues" class="irs-grid-pol small" :class="{'display-none': index === 5}" :style="{left: 100 / 5 * (index + 0.5) + '%'}"></span>
                        </div>
                    </div>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :top-tip="bottom_tip" :target-uuid="'calculator'" :from-type="'23'" @getAgentInfo="getAgentInfo"></consultant-card>
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
import touchMove from '../shared/service/touchmove.js';

import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import CalculatorShare from "@/components/calculator/share.vue";

export default {
    name: 'CompoundInterest',
    data() {
        return {
            inIphoneX: calculatorJS.iphoneXLayout(),
            finalBannerSrc: 'https://static.iberhk.com/v2/web/images/calculator/finalbanner.png',
            capitalBannerSrc: 'https://static.iberhk.com/v2/web/images/calculator/capitalbanner.png',
            showCalcContent: false,
            richAgeBoxLeft: '1.8rem',
            type: 'final',
            money: 10000000,
            moneyString: '10,000,000',
            moneyMin: 0,
            moneyMax: 10000000,
            moneyStep: 100,
            moneyGridNum: 5,
            moneyValues: ['0', '200', '400', '600', '800', '1000'],
            moneyInputTop: '-10000rem',
            moneyPlaceholder: '0-10,000,000',
            moneyTips: {
                empty: '本金不可為空',
                get: this.simply ? '本金不可大于1000万' : '本金不可大於1000萬',
                let: '本金不可小於0'
            },
            rate: 18,
            rateMin: 0,
            rateMax: 30,
            rateStep: 1,
            rateGridNum: 6,
            rateValues: ['0', '5%', '10%', '15%', '20%', '25%', '30%'],
            rateTips: {
                empty: '年利率比不可為空',
                get: this.simply ? '年利率比不可大于30%' : '年利率比不可大於30%',
                let: '年利率比不可小於0'
            },
            year: 5,
            yearMin: 0,
            yearMax: 100,
            yearStep: 1,
            yearGridNum: 5,
            yearValues: ['0', '20年', '40年', '60年', '80年', '100年'],
            yearTips: {
                empty: '存入年限不可為空',
                get: this.simply ? '存入年限不可大于100年' : '存入年限不可大於100年',
                let: '存入年限不可小於0'
            },
            moneyTitle: '$22,877,578',
            agentInfo: {},
            tab1: this.simply ? '复利终值' : '複利終值',
            tab2: '本金',
            money_unit: this.simply ? '万' : '萬',
            money_billion: this.simply ? '亿' : '億',
            top_tip: this.simply ? '拖动按钮查看你' : '拖動按鈕查看你的',
            bottom_tip: this.simply ? '咨询财富顾问，让您的财富稳步增长' : '諮詢財富顧問，讓您的財富穩步增長',
            disclaimer_text: this.simply ? '免责声明：以上内容仅供参考' : '免責聲明：以上內容僅供參考',
            left_title2: this.simply ? '年利率比：' : '年利率比：',
            left_title3: this.simply ? '存入年限：' : '存入年限：',
            share_title: this.simply ? '复利计算器' : '複利計算器',
            share_des: this.simply ? '复利魔力：你的财富将放大几倍？' : '複利魔力：你的財富將放大幾倍？',
            wrong_format_tip: this.simply ? '请输入正确的数字格式' : '請輸入正確的數字格式',
            money_tip2: this.simply ? '复利终值不可大于1000万' : '複利終值不可大於1000萬',
        };
    },
    components: {
        vueSlider,
        ConsultantCard,
        CalculatorShare
    },
    beforeCreate() {
        // window.title = (/cn/ig.test(this.language.currentLang) ? '复利计算' : '複利計算');
    },
    created() {},
    mounted() {
        this.$refs.calculatorShare.share.thumbImage = 'https://static.iberhk.com/v2/calculator/finalbrief.png';
        // 渲染过快导致滑动组件不能点击滑动，需设些延时渲染
        const _this = this;
        setTimeout(() => {
            _this.showCalcContent = true;
        }, 500);
        touchMove.listenTouchDirection(document, false, null, function(event) {
            if (event.target.className !== 'vue-slider-dot vue-slider-dot-dragging') {
                _this.type = 'final';
                _this.richAgeBoxLeft = '1.8rem';
                _this.calcReault();
            }
        }, null, function(event) {
            if (event.target.className !== 'vue-slider-dot vue-slider-dot-dragging') {
                _this.type = 'capital';
                _this.richAgeBoxLeft = '0.24rem';
                _this.calcReault();
            }
        });
    },
    methods: {
        changeType(type) {
            this.type = type;
            this.moneyTitle = (type === 'final' ? '$22,877,577' : '$4,371,092');
            this.money = 10000000;
            this.moneyString = '10,000,000';
            this.rate = 18;
            this.year = 5;
            this.richAgeBoxLeft = (type === 'final' ? '1.8rem' : '0.24rem');
            this.calcReault();
        },
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
                if (type === 'money' && this['type'] === 'capital') {
                    Toast({
                        message: this.money_tip2
                    });
                } else {
                    Toast({
                        message: this[type + 'Tips']['get']
                    });
                }
            } else if (this[type] < this[type + 'Min']) {
                this[type] = this[type + 'Min'];
                !handle && layer.msg(this[type + 'Tips']['let']);
                if (type === 'money' && this['type'] === 'capital') {
                    Toast({
                        message: '複利終值不可小於0'
                    });
                } else {
                    Toast({
                        message: this[type + 'Tips']['let']
                    });
                }
            } else if (!this[type]) {
                handle && (this[type] = this[type + 'Min']);
                handle && /money/ig.test(type) && (this['moneyString'] = 0);
                !input.validity.valid && (this[type] = input['_value']);
            } else if (this[type] <= this[type + 'Max'] && this[type] >= this[type + 'Min']) {
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
            this.calcReault(type);
        },
        inputFocus() {
            this['moneyInputTop'] = '.04rem';
            document.getElementById('moneyInput').focus();
        },
        calcReault() {
            if (this.money && this.money >= this.moneyMin && this.money <= this.moneyMax && (this.rate === 0 || (this.rate && this.rate >= this.rateMin && this.rate <= this.rateMax)) && this.year && this.year >= this.yearMin && this.year <= this.yearMax) {
                if (this.type === 'final') {
                    let money = this.money * Math.pow(1 + this.rate * 0.01, this.year);
                    this.moneyTitle = this.toMoneyBillion(money);
                    // this.resetMoney();
                } else {
                    let money = this.money / Math.pow(1 + this.rate * 0.01, this.year);
                    if (money < 1) {
                        let moneyFix = parseFloat(parseFloat(money).toFixed(9));
                        this.moneyTitle = calculatorJS.formatMoney(moneyFix, 9);
                    } else {
                        this.moneyTitle = calculatorJS.formatMoney(Math.round(money), 0);
                    }
                }
            } else {
                this.moneyTitle = '$0';
            }
        },
        resetMoney() {
            let titleArr = this.moneyTitle.split(',');
            if (titleArr.length > 4) {
                titleArr.splice(4, 0, '\n');
            }
            this.moneyTitle = titleArr.join(',').replace(/\n,/, '\n');
        },
        toMoneyBillion(money) {
            if (money > 999999999999) {
                money = (money / 1000000000000).toFixed(2);
                return calculatorJS.formatMoney(money, 2) + this.money_unit + this.money_billion;
            } else if (money > 99999999) {
                money = (money / 100000000).toFixed(2);
                return calculatorJS.formatMoney(money, 2) + this.money_billion;
            } else {
                return calculatorJS.formatMoney(Math.round(money), 0);
            }
        },
        preventNotNumber(event) {
            calculatorJS.preventNotNumber(event);
        },
        getAgentInfo(data) {
            this.agentInfo = data;
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./calculator.css">

</style>

<style scoped>
.calculator-content {
    padding-top: 1.8rem;
}

.calculator-content-inapp {
    min-height: calc(100% - .2rem);
}

.calculator-content-height {
    min-height: calc(100% - .9rem);
}

.top-main-content {
    top: .4rem;
}

.calc-tab-nav {
    box-sizing: border-box;
    width: 100%;
    background-color: #3364e4;
    height: 0.4rem;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 6;
}

.calc-tab-nav li {
    box-sizing: border-box;
    font-size: 0.15rem;
    float: left;
    width: 50%;
    height: 0.4rem;
    line-height: 0.4rem;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
}

.calc-tab-nav li.current span {
    border-bottom: 0.01rem solid #fff;
    font-weight: bold;
}

.calc-tab-nav li span {
    display: inline-block;
    box-sizing: border-box;
    height: 0.4rem;
    border-bottom: 0.01rem solid transparent;
}

.top-main-content {
    background-image: linear-gradient(90deg, #4E7FFF 0%, #469FFF 100%);
}

.rich-age-box {
    width: 2rem;
    left: 1.8rem;
    text-align: left;
}

.rich-age {
    font-size: 0.22rem;
    margin-top: .02rem;
}

.rich-age-text {
    font-size: 0.15rem;
    width: 100%;
}

.left-margin {
    left: 1.64rem !important;
}
</style>