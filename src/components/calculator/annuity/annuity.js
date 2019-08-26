// import Vue from 'vue';
import { Switch, Toast } from 'mint-ui';
// Vue.component(Switch.name, Switch);

import vueSlider from 'vue-slider-component';

import calculatorJS from '@/components/calculator/calculator.js';

import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import CalculatorShare from "@/components/calculator/share.vue";

export default {
    name: 'Annuity',
    data() {
        return {
            inIphoneX: calculatorJS.iphoneXLayout(),
            bannerSrc: 'https://static.iberhk.com/v2/web/images/calculator/annuitybannner.png',
            showCalcContent: false,
            isIphone5: (screen.height == 568) && (screen.width == 320),
            timeoutIndex: null,
            otherOption: false,
            // 當前年齡
            nowAge: {
                value: 22,
                min: 0,
                max: 70,
                step: 1,
                gridNum: 7,
                values: ['0', '10', '20', '30', '40', '50', '60', '70'],
                tips: {
                    empty: '年齡不可為空',
                    get: this.simply ? '年龄不可大于70岁' : '年齡不可大於70歲',
                    let: '年齡不可小於0'
                }
            },
            // 預期退休年齡
            retiredAge: {
                value: 55,
                min: 0,
                max: 70,
                step: 1,
                gridNum: 7,
                values: ['0', '10', '20', '30', '40', '50', '60', '70'],
                tips: {
                    empty: '年齡不可為空',
                    get: this.simply ? '年龄不可大于70岁' : '年齡不可大於70歲',
                    let: '年齡不可小於0'
                }
            },
            // 退休生活年期
            retiredYear: {
                value: 35,
                min: 0,
                max: 70,
                step: 1,
                gridNum: 7,
                values: ['0', '10年', '20年', '30年', '40年', '50年', '60年', '70年'],
                tips: {
                    empty: '年期不可為空',
                    get: this.simply ? '年期不可大于70年' : '年期不可大於70年',
                    let: '年期不可小於0'
                }
            },
            // 每月退休開支
            monthExpMoney: {
                value: 10000,
                string: '10,000',
                min: 0,
                max: 200000,
                step: 1000,
                gridNum: 4,
                values: ['0', '5', '10', '15', '20'],
                inputTop: '-10000rem',
                placeholder: '0-200,000',
                tips: {
                    empty: '開支不可為空',
                    get: this.simply ? '开支不可大于20万' : '開支不可大於20萬',
                    let: '開支不可小於0'
                }
            },
            // 每年通脹率
            inflationRate: {
                value: 3,
                min: 0,
                max: 20,
                step: 0.1,
                gridNum: 4,
                values: ['0', '5%', '10%', '15%', '20%'],
                tips: {
                    empty: '通脹率不可為空',
                    get: this.simply ? '通胀率不可大于20%' : '通脹率不可大於20%',
                    let: '通脹率不可小於0'
                },
            },
            // 退休前每年回報率
            beforeReturnRate: {
                value: 5,
                min: 0,
                max: 20,
                step: 0.1,
                gridNum: 4,
                values: ['0', '5%', '10%', '15%', '20%'],
                tips: {
                    empty: '回報率不可為空',
                    get: this.simply ? '回报率不可大于20%' : '回報率不可大於20%',
                    let: '回報率不可小於0'
                },
            },
            // 退休後每年回報率
            afterReturnRate: {
                value: 6.5,
                min: 0,
                max: 20,
                step: 0.1,
                gridNum: 4,
                values: ['0', '5%', '10%', '15%', '20%'],
                tips: {
                    empty: '回報率不可為空',
                    get: this.simply ? '回报率不可大于20%' : '回報率不可大於20%',
                    let: '回報率不可小於0'
                },
            },
            // 公積金現時存結
            assetsMPFMoney: {
                value: 75000,
                string: '75,000',
                min: 0,
                max: 200000,
                step: 1000,
                gridNum: 4,
                values: ['0', '5', '10', '15', '20'],
                inputTop: '-10000rem',
                placeholder: '0-200,000',
                tips: {
                    empty: '結存不可為空',
                    get: this.simply ? '结存不可大于20万' : '結存不可大於20萬',
                    let: '結存不可小於0'
                }
            },
            // 公積金每月供款
            monthMPFMoney: {
                value: 1500,
                string: '1,500',
                min: 0,
                max: 200000,
                step: 1000,
                gridNum: 4,
                values: ['0', '5', '10', '15', '20'],
                inputTop: '-10000rem',
                placeholder: '0-200,000',
                tips: {
                    empty: '供款不可為空',
                    get: this.simply ? '供款不可大于20万' : '供款不可大於20萬',
                    let: '供款不可小於0'
                }
            },
            // 公積金每年回報率
            returnMPFRate: {
                value: 4.6,
                min: 0,
                max: 20,
                step: 0.1,
                gridNum: 4,
                values: ['0', '5%', '10%', '15%', '20%'],
                tips: {
                    empty: '回報率不可為空',
                    get: this.simply ? '回报率不可大于20%' : '回報率不可大於20%',
                    let: '回報率不可小於0'
                },
            },
            // 儲蓄和投資現時存結
            assetsSaveMoney: {
                value: 100000,
                string: '100,000',
                min: 0,
                max: 200000,
                step: 1000,
                gridNum: 4,
                values: ['0', '5', '10', '15', '20'],
                inputTop: '-10000rem',
                placeholder: '0-200,000',
                tips: {
                    empty: '結存不可為空',
                    get: this.simply ? '结存不可大于20万' : '結存不可大於20萬',
                    let: '結存不可小於0'
                }
            },
            // 儲蓄和投資每年回報率
            returnSaveRate: {
                value: 6,
                min: 0,
                max: 20,
                step: 0.1,
                gridNum: 4,
                values: ['0', '5%', '10%', '15%', '20%'],
                tips: {
                    empty: '回報率不可為空',
                    get: this.simply ? '回报率不可大于20%' : '回報率不可大於20%',
                    let: '回報率不可小於0'
                },
            },
            requiredReserve: '$6,253,558',
            owedReserves: '$6,253,558',
            monthReserves: '$6,194',
            agentInfo: {},
            title1: this.simply ? '所需储备金：' : '所需儲備金：',
            title2: this.simply ? '尚欠储备金：' : '尚欠儲備金：',
            title3: this.simply ? '每月储蓄金：' : '每月儲蓄金：',
            age_unit: this.simply ? '岁' : '歲',
            money_unit: this.simply ? '万' : '萬',
            money_billion: this.simply ? '亿' : '億',
            top_tip: this.simply ? '拖动按钮查看你的退休所需储备金' : '拖動按鈕查看你的退休所需儲備金',
            bottom_tip: this.simply ? '咨询财富顾问，提前做好退休规划，满足退休目标' : '諮詢財富顧問，提前做好退休規劃，滿足退休目標',
            disclaimer_text: this.simply ? '免责声明：以上内容仅供参考' : '免責聲明：以上內容僅供參考',
            left_title1: this.simply ? '当前年龄：' : '當前年齡：',
            left_title2: this.simply ? '预期退休年龄：' : '預期退休年齡：',
            left_title3: this.simply ? '退休生活年期：' : '退休生活年期：',
            left_title4: this.simply ? '每月退休开支：' : '每月退休開支：',
            left_title5: this.simply ? '每年通胀率：' : '每年通脹率：',
            left_title6: this.simply ? '退休前每年回报率：' : '退休前每年回報率：',
            left_title7: this.simply ? '退休后每年回报率：' : '退休後每年回報率：',
            other_option_title: this.simply ? '其他选项' : '其他選項',
            other_option_des: this.simply ? '如需更加精密的计算，请输入如下项' : '如需更加精密的計算，請輸入如下項',
            your_MPF: this.simply ? '你的强积金／公积金' : '你的強積金／公積金',
            left_title8: this.simply ? '现时存结：' : '現時存結：',
            left_title9: this.simply ? '每月供款：' : '每月供款：',
            left_title10: this.simply ? '每年回报率：' : '每年回報率：',
            your_investment: this.simply ? '你的储蓄和投资' : '你的儲蓄和投資',
            share_title: this.simply ? '退休基金' : '退休基金',
            share_des: this.simply ? '算算你的退休生活成本有多高' : '算算你的退休生活成本有多高',
            wrong_format_tip: this.simply ? '请输入正确的数字格式' : '請輸入正確的數字格式',
            inflation_rate_tip: this.simply ? 'Tip：2018上半年内地通胀率约2.0%；香港通胀率约1.9%;全球通胀率约3.5%' : 'Tip：2018上半年內地通脹率約2.0%；香港通脹率約1.9%;全球通脹率約3.5%',
        };
    },
    components: {
        vueSlider,
        ConsultantCard,
        CalculatorShare,
        'mt-switch': Switch,
    },
    beforeCreate() {
        // window.title = (/cn/ig.test(this.language.currentLang) ? '年金计算器' : '年金計算器');
    },
    created() {},
    mounted() {
        this.$refs.calculatorShare.share.thumbImage = 'https://static.iberhk.com/v2/calculator/annuitybrief.png';
        // 渲染过快导致滑动组件不能点击滑动，需设些延时渲染
        const _this = this;
        setTimeout(() => {
            _this.showCalcContent = true;
        }, 500);

    },
    methods: {
        ageToast(type) {
            if (this.nowAge.value - this.retiredAge.value > 0) {
                if (type === 'nowAge') {
                    this.nowAge.value = this.retiredAge.value;
                    Toast({
                        message: '當前年齡不能大於預期退休年齡'
                    });
                } else if (type === 'retiredAge') {
                    this.retiredAge.value = this.nowAge.value;
                    Toast({
                        message: '預期退休年齡不能小於當前年齡'
                    });
                }
            }
        },
        rangeChange(type) {
            this.calcReault(type);
            if (/money/ig.test(type)) {
                this[type]['string'] = calculatorJS.formatMoney(this[type]['value'], 0, '');
            }
        },
        inputChange(type, handle) {
            var input = document.getElementById(type + 'Input');
            if (this[type]['value'] > this[type]['max']) {
                this[type]['value'] = this[type]['max'];
                Toast({
                    message: this[type]['tips']['get']
                });
            } else if (this[type]['value'] < this[type]['min']) {
                this[type]['value'] = this[type]['min'];
                Toast({
                    message: this[type]['tips']['let']
                });
            } else if (!this[type]['value']) {
                handle && /money/ig.test(type) && (this[type]['string'] = 0);
                handle && (this[type]['value'] = this[type]['min']);
                !input.validity.valid && (this[type]['value'] = input['_value']);
            } else if (
                this[type]['value'] <= this[type]['max'] &&
                this[type]['value'] >= this[type]['min']
            ) {
                // 首位是0
                if (String(this[type])[0] === '0' && String(this[type]['value']).length > 1) {
                    this[type]['value'] = parseFloat(this[type]['value']);
                    Toast({
                        message: this.wrong_format_tip
                    });
                }
                handle && /rate/ig.test(type) && (this[type]['value'] = parseFloat(this[type]['value']));
                if (/age/ig.test(type) || /year/ig.test(type) || /money/ig.test(type)) {
                    this[type]['value'] = parseFloat(this[type]['value']);
                    /money/ig.test(type) && (this[type]['string'] = calculatorJS.formatMoney(parseInt(this[type]['value']), 0, ''));
                }
            }
            if (handle) {
                this[type]['inputTop'] = '-10000rem';
            }
            this.calcReault(type);

        },
        inputFocus(type) {
            document.getElementById(type + 'Input').focus();
            let scrollTop = {
                monthExpMoney: this.isIphone5 ? 320 : 370,
                assetsMPFMoney: this.isIphone5 ? 870 : 990,
                monthMPFMoney: this.isIphone5 ? 970 : 1100,
                assetsSaveMoney: this.isIphone5 ? 1190 : 1350
            };
            this[type]['inputTop'] = '.04rem';
            document.getElementById('calculatorSection').scrollTop = scrollTop[type];

        },
        calcReault(type) {
            clearTimeout(this.timeoutIndex);
            this.timeoutIndex = setTimeout(() => {
                this.ageToast(type);
                let require = 0,
                    owed = 0,
                    MPFTotal = 0,
                    saveTotal = 0,
                    monthMoney = 0;
                if ((this.nowAge.value === 0 || this.nowAge.value) && (this.retiredAge.value === 0 || this.retiredAge.value) && (this.retiredYear.value === 0 || this.retiredYear.value) && (this.retiredYear.value === 0 || this.retiredYear.value) && (this.monthExpMoney.value === 0 || this.monthExpMoney.value) && (this.inflationRate.value === 0 || this.inflationRate.value) && (this.beforeReturnRate.value === 0 || this.beforeReturnRate.value) && (this.afterReturnRate.value === 0 || this.afterReturnRate.value)) {
                    // 工作年限
                    let workYear = this.retiredAge.value - this.nowAge.value,
                        // 退休前每年实际汇率
                        workRate = 1 + this.inflationRate.value * 0.01,
                        // 退休后每年实际汇率
                        requireRate = 1 + (this.inflationRate.value - this.afterReturnRate.value) * 0.01;
                    let yearMoney = 12 * this.monthExpMoney.value * Math.pow(workRate, workYear);
                    if (requireRate === 1) {
                        require = yearMoney * this.retiredYear.value;
                    } else {
                        require = yearMoney * requireRate * (Math.pow(requireRate, this.retiredYear.value) - 1) / ((this.inflationRate.value - this.afterReturnRate.value) * 0.01);
                    }
                    let MPFAndSaveMoney = this.MPFAndSave(workYear);
                    MPFTotal = MPFAndSaveMoney.MPFTotal;
                    saveTotal = MPFAndSaveMoney.saveTotal;
                    // 尚欠儲備金
                    owed = require - MPFTotal - saveTotal;
                    (owed < 0) && (owed = 0);
                    // 每月儲蓄金
                    let monthRate = 1 + this.beforeReturnRate.value * 0.01 / 12;
                    if (workYear === 0) {
                        monthMoney = 0;
                    } else {
                        if (this.beforeReturnRate.value == 0) {
                            monthMoney = owed / (12 * workYear);
                        } else {
                            monthMoney = owed / (monthRate * (Math.pow(monthRate, 12 * workYear) - 1) / (this.beforeReturnRate.value * 0.01 / 12));
                        }
                    }
                } else {
                    require = 0;
                    owed = 0;
                    monthMoney = 0;
                }
                // 所需儲備金
                this.requiredReserve = this.toMoneyBillion(require);
                // 尚欠儲備金
                this.owedReserves = this.toMoneyBillion(owed);
                // 每月儲蓄金
                this.monthReserves = this.toMoneyBillion(monthMoney);
            }, 800);
        },
        MPFAndSave(workYear) {
            // 強積金／公積金结余,儲蓄结余
            let MPFTotal = 0,
                saveTotal = 0;
            // 強積金／公積金实际每月汇率
            let MPFRate = 1 + this.returnMPFRate.value * 0.01 / 12;
            if (this.otherOption && this.assetsMPFMoney.value && this.monthMPFMoney.value && (this.returnMPFRate.value === 0 || this.returnMPFRate.value) && this.assetsSaveMoney.value && (this.returnSaveRate.value === 0 || this.returnSaveRate.value)) {
                // 強積金／公積金结余
                MPFTotal = this.assetsMPFMoney.value * Math.pow(1 + this.returnMPFRate.value * 0.01, workYear) + this.monthMPFMoney.value * (1 - Math.pow(MPFRate, 12 * workYear)) / (1 - MPFRate);
                // 儲蓄結餘
                saveTotal = this.assetsSaveMoney.value * Math.pow(1 + this.returnSaveRate.value * 0.01, workYear);
            } else {
                MPFTotal = 0;
                saveTotal = 0;
            }
            return {
                MPFTotal: MPFTotal,
                saveTotal: saveTotal
            };
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
        }
    }
};