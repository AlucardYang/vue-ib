<template>
    <div id="calculator">
        <div class="top-main-content">
            <img class="top-main-bg" :src="bannerSrc">
            <div class="rich-age-box">
                <div class="rich-age-text">{{title1}}</div>
                <div class="rich-age">{{newGetSalary | formatMoney(2, moneyUnit)}}</div>
            </div>
        </div>
        <section class="com-scroll-y">
            <div class="calculator-content" :class="{'calculator-content-height': !inApp && agentInfo.nickname}">
                <div class="bottom-main-content">
                    <div class="tax-input-box">
                        <div class="input-row">
                            <div class="input-row-left">{{left_title1}}</div>
                            <div class="input-row-right">
                                <input type="number" @input="inputChange()" v-model="preTaxSalary" :placeholder="input_tip1" @keydown="preventNotNumber($event, preTaxSalary)">
                                <span class="unit">元</span>
                            </div>
                        </div>
                        <div class="input-row" style="margin-bottom: 0;">
                            <div class="input-row-left">{{left_title2}}</div>
                            <div class="input-row-right">
                                <input type="number" @input="inputChange()" v-model="extraCharges" :placeholder="input_tip1" @keydown="preventNotNumber($event, extraCharges)">
                                <span class="unit">元</span>
                            </div>
                        </div>
                    </div>
                    <div class="total-table">
                        <div class="tr">
                            <div class="td left">{{left_title3}}</div>
                            <div class="td center">{{preTaxSalary | formatMoney(2, moneyUnit)}}</div>
                        </div>
                        <div class="tr">
                            <div class="td left">{{left_title4}}</div>
                            <div class="td center">{{extraCharges | formatMoney(2, moneyUnit)}}</div>
                        </div>
                        <div class="tr table-tr-blod">
                            <div class="td left">{{left_title5}}</div>
                            <div class="blue td center">{{newStartSalary | formatMoney(2, moneyUnit)}}</div>
                        </div>
                        <div class="tr">
                            <div class="td left">{{left_title6}}</div>
                            <div class="td center">{{newRealCharges | formatMoney(2, moneyUnit)}}</div>
                        </div>
                        <div class="tr">
                            <div class="td left">{{left_title7}}</div>
                            <div class="td center">{{newRate*100}}%</div>
                        </div>
                        <div class="tr">
                            <div class="td left">{{left_title8}}</div>
                            <div class="td center">{{newRapidCalc | formatMoney(2, moneyUnit)}}</div>
                        </div>
                        <div class="tr">
                            <div class="td left">{{left_title9}}</div>
                            <div class="td center">{{newTaxCharges | formatMoney(2, moneyUnit)}}</div>
                        </div>
                        <div class="tr table-tr-blod last-tr">
                            <div class="td left">{{left_title10}}</div>
                            <div class="td blue center">{{newGetSalary | formatMoney(2, moneyUnit)}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :top-tip="bottom_tip" :target-uuid="'calculator'" :from-type="'24'" @getAgentInfo="getAgentInfo"></consultant-card>
            <div class="disclaimer-box">{{disclaimer_text}}</div>
        </section>
        <calculator-share ref="calculatorShare" :share-title="this.share_title" :share-des="this.share_des"></calculator-share>
    </div>
</template>

<script>
import {
    Toast
} from 'mint-ui';

import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import CalculatorShare from "@/components/calculator/share.vue";

export default {
    name: 'Tax',
    data() {
        return {
            bannerSrc: 'https://static.iberhk.com/v2/web/images/calculator/taxbanner.png',
            timeoutIndex: null,
            moneyUnit: '¥', // 货币单位
            preTaxSalary: '', // 税前月工资
            extraCharges: '', // 社会保险费
            newStartSalary: 5000, // 新起征点
            nowStartSalary: 3500, // 原起征点
            newRealCharges: 0.0, // 新应纳税额
            nowRealCharges: 0.0, // 原应纳税额
            newRate: 0, // 新适用税率
            nowRate: 0, // 现适用税率
            newRapidCalc: 0.0, // 新速算扣除数
            nowRapidCalc: 0.0, // 原速算扣除数
            newTaxCharges: 0.0, // 新应缴个税
            nowTaxCharges: 0.0, // 原应缴个税
            newGetSalary: 0.0, // 新实发工资
            nowGetSalary: 0.0, // 原实发工资
            newTaxCalcList: [{
                    min: 0,
                    max: 3000,
                    rate: 0.03,
                    deduction: 0
                },
                {
                    min: 3000,
                    max: 12000,
                    rate: 0.1,
                    deduction: 210
                },
                {
                    min: 12000,
                    max: 25000,
                    rate: 0.2,
                    deduction: 1410
                },
                {
                    min: 25000,
                    max: 35000,
                    rate: 0.25,
                    deduction: 2660
                },
                {
                    min: 35000,
                    max: 55000,
                    rate: 0.3,
                    deduction: 4410
                },
                {
                    min: 55000,
                    max: 80000,
                    rate: 0.35,
                    deduction: 7160
                },
                {
                    min: 80000,
                    rate: 0.45,
                    deduction: 15160
                }
            ],
            nowTaxCalcList: [{
                    min: 0,
                    max: 1500,
                    rate: 0.03,
                    deduction: 0
                },
                {
                    min: 1500,
                    max: 4500,
                    rate: 0.1,
                    deduction: 105
                },
                {
                    min: 4500,
                    max: 9000,
                    rate: 0.2,
                    deduction: 555
                },
                {
                    min: 9000,
                    max: 35000,
                    rate: 0.25,
                    deduction: 1005
                },
                {
                    min: 35000,
                    max: 55000,
                    rate: 0.3,
                    deduction: 2755
                },
                {
                    min: 55000,
                    max: 80000,
                    rate: 0.35,
                    deduction: 5505
                },
                {
                    min: 80000,
                    rate: 0.45,
                    deduction: 13505
                }
            ],
            agentInfo: {},
            title1: this.simply ? '新个税月工资：' : '新個稅月工資：',
            bottom_tip: this.simply ? '咨询财富顾问，让您的生活后顾无忧' : '諮詢財富顧問，讓您的生活後顧無憂',
            disclaimer_text: this.simply ? '免责声明：以上内容仅供参考' : '免責聲明：以上內容僅供參考',
            input_tip1: this.simply ? '请输入' : '請輸入',
            left_title1: this.simply ? '税前月工资：' : '稅前月工資：',
            left_title2: this.simply ? '各项社会保险费：' : '各項社會保險費：',
            left_title3: this.simply ? '税前月工资：' : '稅前月工資：',
            left_title4: this.simply ? '社会保险费：' : '社會保險費：',
            left_title5: this.simply ? '起征点：' : '起征點：',
            left_title6: this.simply ? '应纳税额：' : '應納稅額：',
            left_title7: this.simply ? '适用税率：' : '適用稅率：',
            left_title8: this.simply ? '速算扣除数：' : '速算扣除數：',
            left_title9: this.simply ? '应缴个税：' : '應繳個稅：',
            left_title10: this.simply ? '实发工资：' : '實發工資：',
            share_title: this.simply ? '內地个税计算' : '内地個稅計算',
            share_des: this.simply ? '个税改革了，算算到手工资有变化吗？' : '個稅改革了，算算到手工資有變化嗎？',
            wrong_format_tip: this.simply ? '请输入正确的数字格式' : '請輸入正確的數字格式',
            money_tip1: this.simply ? '各项社会保险费应小于税前工资' : '各項社會保險費應小於稅前工資',
        };
    },
    components: {
        ConsultantCard,
        CalculatorShare
    },
    beforeCreate() {
        // window.title = (/cn/ig.test(this.language.currentLang) ? '工资计算器（内地）' : '工資计算器（內地）');
    },
    created() {},
    mounted() {
        this.$refs.calculatorShare.share.thumbImage = 'https://static.iberhk.com/v2/calculator/taxbrief.png';
    },
    methods: {
        inputChange() {
            // 首位是0
            if ((String(this.preTaxSalary)[0] === '0' && String(this.preTaxSalary).length > 1) || (String(this.extraCharges)[0] === '0' && String(this.extraCharges).length > 1)) {
                this.preTaxSalary = parseFloat(this.preTaxSalary);
                this.extraCharges = parseFloat(this.extraCharges);
                Toast({
                    message: this.wrong_format_tip
                });
            }
            clearTimeout(this.timeoutIndex);
            this.timeoutIndex = setTimeout(this.calc, 800);
        },
        calc() {
            const _this = this;
            var mp = String(_this.preTaxSalary).match(/(([1-9]\d*)(\.\d{1,2})?)|(0\.\d{1,2})/);
            _this.preTaxSalary = mp ? mp[0] : '';

            var me = String(_this.extraCharges).match(/(([1-9]\d*)(\.\d{1,2})?)|(0\.\d{1,2})/);
            _this.extraCharges = me ? me[0] : '';
            // 税前月工资最大值为9999999
            if (_this.preTaxSalary - 9999999 > 0) {
                _this.preTaxSalary = 9999999;
            }
            // 各项社会保险费999999
            if (_this.extraCharges - 999999 > 0) {
                _this.extraCharges = 999999;
            }

            if (_this.preTaxSalary - _this.extraCharges < 0) {
                Toast({
                    message: this.money_tip1
                });
            }
            // 应纳税额
            _this.newRealCharges = _this.preTaxSalary - _this.extraCharges - _this.newStartSalary;
            _this.nowRealCharges = _this.preTaxSalary - _this.extraCharges - _this.nowStartSalary;
            // 当前输入税前月工资在哪个范围内
            _this.newTaxCalcList.forEach((value, index) => {
                if ((_this.preTaxSalary > 5000 && (_this.newRealCharges > value['min'] && value['max'] && _this.newRealCharges <= value['max'])) || (!value['max'] && _this.newRealCharges > 80000)) {
                    _this.newRate = value.rate;
                    _this.newRapidCalc = value.deduction;
                    _this.newTaxCharges = _this.newRealCharges * value.rate - value.deduction;
                    _this.newGetSalary = _this.preTaxSalary - _this.extraCharges - _this.newTaxCharges;
                }
            });
            _this.nowTaxCalcList.forEach((value, index) => {
                if ((_this.preTaxSalary > 3500 && (_this.nowRealCharges > value['min'] && value['max'] && _this.nowRealCharges <= value['max'])) || (!value['max'] && _this.nowRealCharges > 80000)) {
                    _this.nowRate = value.rate;
                    _this.nowRapidCalc = value.deduction;
                    _this.nowTaxCharges = _this.nowRealCharges * value.rate - value.deduction;
                    _this.nowGetSalary = _this.preTaxSalary - _this.extraCharges - _this.nowTaxCharges;
                }
            });
            // 应纳税额小于等于起征点时
            if (_this.preTaxSalary - _this.extraCharges <= 5000) {
                _this.newRealCharges = 0;
                _this.newRate = 0;
                _this.newRapidCalc = 0.0;
                _this.newTaxCharges = 0.0;
                _this.newGetSalary = _this.preTaxSalary - _this.extraCharges;
            }
            if (_this.preTaxSalary - _this.extraCharges <= 3500) {
                _this.nowRealCharges = 0;
                _this.nowRate = 0;
                _this.nowRapidCalc = 0.0;
                _this.nowTaxCharges = 0.0;
                _this.nowGetSalary = _this.preTaxSalary - _this.extraCharges;
            }
        },
        preventNotNumber(event, value) {
            var keyValue = event.key;
            //第一个不能输入小数点'.'，不能输入两个小数点。否则将引起number控件把内容转换成''
            if ((String(value).indexOf('.') >= 0 || value.length == 0) && keyValue === '.') {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
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
input::-webkit-input-placeholder {
    color: #dddddd;
    font-size: 0.16rem;
    font-weight: normal;
    line-height: 0.2rem;
    font-family: PingFangSC-Light, Roboto, HelveticaNeue, Helvetica, Arial, sans-serif;
}

input:-moz-placeholder {
    color: #dddddd;
    font-size: 0.16rem;
    font-weight: normal;
    line-height: 0.2rem;
    font-family: PingFangSC-Light, Roboto, HelveticaNeue, Helvetica, Arial, sans-serif;
}

input::-moz-placeholder {
    color: #dddddd;
    font-size: 0.16rem;
    font-weight: normal;
    line-height: 0.2rem;
    font-family: PingFangSC-Light, Roboto, HelveticaNeue, Helvetica, Arial, sans-serif;
}

input:-ms-input-placeholder {
    color: #dddddd;
    font-size: 0.16rem;
    font-weight: normal;
    line-height: 0.2rem;
    font-family: PingFangSC-Light, Roboto, HelveticaNeue, Helvetica, Arial, sans-serif;
}

.calculator-content-height {
    min-height: calc(100% - 1.2rem);
}

.top-main-content {
    background-image: linear-gradient(-90deg, #4E7FFF 0%, #469FFF 100%);
}

.top-main-bg {
    width: 100%;
}

.rich-age-box {
    width: 1.9rem;
    left: 0.3rem;
    text-align: left;
}

.rich-age-box .rich-age {
    font-size: 0.24rem;
    margin-top: 0.03rem;
    line-height: 0.29rem;
}

.rich-age-text {
    font-size: 0.16rem;
    line-height: 0.2rem;
    width: 100%;
}

.rich-age-tip {
    font-size: 0.14rem;
}

.rich-age-text-weight {
    color: #ffc822;
    font-weight: bold;
}

.bottom-main-content {
    padding: 0 0 0.2rem 0;
}

.tax-input-box {
    width: 100%;
    background-color: #fff;
    padding: .16rem;
}

.input-row {
    width: 100%;
    height: 0.4rem;
    position: relative;
    font-size: 0.16rem;
    color: #2A2A2A;
    line-height: 0.2rem;
    padding: 0 0.12rem;
    background-color: #F6F6F6;
    border-radius: .08rem;
    margin-bottom: .1rem;
}

.input-row-left {
    position: absolute;
    left: 0.12rem;
    width: 1.36rem;
    top: 50%;
    transform: translateY(-50%);
}

.input-row-right {
    position: absolute;
    right: 0.12rem;
    width: calc(100% - 1.6rem);
    height: 0.4rem;
}

.input-row-right input {
    width: calc(100% - 0.24rem);
    text-align: right;
    outline: none;
    border: none;
    color: #1097d5;
    font-size: 0.2rem;
    font-weight: bold;
    position: absolute;
    right: 0.18rem;
    top: 50%;
    transform: translateY(-50%);
    padding-right: 0.02rem;
    box-sizing: border-box;
    letter-spacing: 0.01rem;
    font-family: "Tahoma";
    background-color: #F6F6F6;
}

.input-row-right input:focus {
    outline: none;
    border: none;
}

.input-row-right .unit {
    color: #3364E4;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

.total-table-top {
    width: 100%;
    height: 0.1rem;
    background-color: #f6f6f6;
}

.total-table {
    width: 100%;
    min-height: 2.7rem;
    background-color: #fff;
    text-align: right;
    padding: 0 0.28rem;
    box-sizing: border-box;
}

.total-table .th,
.total-table .td {
    box-sizing: border-box;
    float: left;
    overflow: hidden;
}

.total-table .tr {
    height: 0.36rem;
    line-height: 0.36rem;
}

.total-table .td {
    font-size: 0.16rem;
    color: #999999;
    height: 0.36rem;
    /* padding-left: 0.28rem; */
}

.total-table .th,
.table-thead {
    height: 0.54rem;
}

.total-table .left {
    width: 1.3rem;
    text-align: left;
}

.total-table .center {
    width: calc(100% - 1.3rem);
}

.total-table .right {
    width: calc(50% - 0.64rem);
}

.table-title-blod {
    font-size: 0.16rem;
    color: #3364E4;
    font-weight: bold;
}

.table-title-remark {
    font-size: 0.12rem;
    height: 0.15rem;
    color: #999999;
    line-height: 0.15rem;
    margin-right: -0.07rem;
    margin-top: 0.02rem;
}

.table-tr-blod .td {
    font-weight: bold;
    color: #2a2a2a;
}

.table-tr-blod .blue {
    color: #3364E4;
}

.total-table .last-tr {
    height: .52rem;
    line-height: .52rem;
    border-top: .005rem solid #DDDDDD;
    margin-top: .1rem;
}

.total-table .last-tr .center {
    font-size: 0.2rem;
}
</style>
