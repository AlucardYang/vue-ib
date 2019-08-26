import vueSlider from 'vue-slider-component';

import {
    Toast
} from 'mint-ui';

import calculatorJS from '../calculator.js';

import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import CalculatorShare from "@/components/calculator/share.vue";

export default {
    name: 'LifeInsurance',
    data() {
        return {
            bannerSrc: 'https://static.iberhk.com/v2/web/images/calculator/lifeinsurancebanner.png',
            showCalcContent: false,
            familyMoney: {
                value: 8000,
                string: '8,000',
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
            debtMoney: {
                value: 5000000,
                string: '5,000,000',
                min: 0,
                max: 20000000,
                step: 100000,
                gridNum: 4,
                values: ['0', '500', '1000', '1500', '2000'],
                inputTop: '-10000rem',
                placeholder: '0-20,000,000',
                tips: {
                    empty: '負債不可為空',
                    get: this.simply ? '总负债不可大于2000万' : '總負債不可大於2000萬',
                    let: '負債不可小於0'
                }
            },
            assetsMoney: {
                value: 100000,
                string: '100,000',
                min: 0,
                max: 20000000,
                step: 100000,
                gridNum: 4,
                values: ['0', '500', '1000', '1500', '2000'],
                inputTop: '-10000rem',
                placeholder: '0-20,000,000',
                tips: {
                    empty: '資產不可為空',
                    get: this.simply ? '资产不可大于2000万' : '資產不可大於2000萬',
                    let: '資產不可小於0'
                }
            },
            lifeMoney: {
                value: 100000,
                string: '100,000',
                min: 0,
                max: 20000000,
                step: 100000,
                gridNum: 4,
                values: ['0', '500', '1000', '1500', '2000'],
                inputTop: '-10000rem',
                placeholder: '0-20,000,000',
                tips: {
                    empty: '人壽保險不可為空',
                    get: this.simply ? '人寿保险不可大于2000万' : '人壽保險不可大於2000萬',
                    let: '人壽保險不可小於0'
                }
            },
            supplyYear: {
                value: 20,
                min: 0,
                max: 30,
                step: 1,
                gridNum: 6,
                values: ['0', '5年', '10年', '15年', '20年', '25年', '30年'],
                tips: {
                    empty: '年期不可為空',
                    get: this.simply ? '年期不可大于30年' : '年期不可大於30年',
                    let: '年期不可小於0'
                }
            },
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
            returnRate: {
                value: 3,
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
            requiredReserve: '$6,920,000',
            owedReserves: '$6,720,000',
            agentInfo: {},
            title1: this.simply ? '所需储备金：' : '所需儲備金：',
            title2: this.simply ? '尚欠储备金：' : '尚欠儲備金：',
            money_unit: this.simply ? '万' : '萬',
            top_tip: this.simply ? '拖动按钮计算您所需的保障需要' : '拖動按鈕計算您所需的保障需要',
            bottom_tip: this.simply ? '咨询财富顾问，让您的生活后顾无忧' : '諮詢財富顧問，讓您的生活後顧無憂',
            disclaimer_text: this.simply ? '免责声明：以上内容仅供参考' : '免責聲明：以上內容僅供參考',
            left_title1: this.simply ? '每月家庭开支：' : '每月家庭開支：',
            left_title2: this.simply ? '供养年期：' : '供養年期：',
            left_title3: this.simply ? '总负债：' : '總負債：',
            left_title4: this.simply ? '每年通胀率：' : '每年通脹率：',
            left_title5: this.simply ? '每年回报率：' : '每年回報率：',
            left_title6: this.simply ? '现有资产：' : '現有資產：',
            left_title7: this.simply ? '现有人寿保险：' : '現有人壽保險：',
            share_title: this.simply ? '人寿保障计算器' : '人壽保障計算器',
            share_des: this.simply ? '作为一家之主，你还缺多少家庭储备金呢？' : '作為一家之主，你還缺多少家庭儲備金呢？',
            wrong_format_tip: this.simply ? '请输入正确的数字格式' : '請輸入正確的數字格式',
            inflation_rate_tip: this.simply ? 'Tip：2018上半年内地通胀率约2.0%；香港通胀率约1.9%;全球通胀率约3.5%' : 'Tip：2018上半年內地通脹率約2.0%；香港通脹率約1.9%;全球通脹率約3.5%',
        };
    },
    components: {
        vueSlider,
        ConsultantCard,
        CalculatorShare
    },
    beforeCreate() {
        // window.title = (/cn/ig.test(this.language.currentLang) ? '人寿保障计算器' : '人壽保障計算器');
    },
    created() {},
    mounted() {
        this.$refs.calculatorShare.share.thumbImage = 'https://static.iberhk.com/v2/calculator/lifeinsurancebrief.png';
        // 渲染过快导致滑动组件不能点击滑动，需设些延时渲染
        const _this = this;
        setTimeout(() => {
            _this.showCalcContent = true;
        }, 500);
    },
    methods: {
        rangeChange(type) {
            this.calcReault();
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
                if (String(this[type]['value'])[0] === '0' && String(this[type]['value']).length > 1) {
                    this[type]['value'] = parseFloat(this[type]['value']);
                    Toast({
                        message: this.wrong_format_tip
                    });
                }
                handle && /rate/ig.test(type) && (this[type]['value'] = parseFloat(this[type]['value']));
                if (/year/ig.test(type) || /money/ig.test(type)) {
                    this[type]['value'] = parseFloat(this[type]['value']);
                    /money/ig.test(type) && (this[type]['string'] = calculatorJS.formatMoney(parseInt(this[type]['value']), 0, ''));
                }
            }
            if (handle) {
                this[type]['inputTop'] = '-10000rem';
            }
            this.calcReault();
        },
        inputFocus(type) {
            document.getElementById(type + 'Input').focus();
            let scrollTop = {
                familyMoney: 0,
                debtMoney: 240,
                assetsMoney: 630,
                lifeMoney: 726
            };
            this[type]['inputTop'] = '.04rem';
            document.getElementById('calculatorSection').scrollTop = scrollTop[type];
        },
        calcReault() {
            let require = 0,
                owed = 0;
            if (this.familyMoney.value && this.supplyYear.value && (this.inflationRate.value === 0 || this.inflationRate.value) && (this.returnRate.value === 0 || this.returnRate.value)) {
                let n = 1 + (this.inflationRate.value - this.returnRate.value) * 0.01;
                if (n === 1) {
                    require = this.familyMoney.value * 12 * this.supplyYear.value + this.debtMoney.value;
                } else {
                    require = this.familyMoney.value * 12 * (n * (Math.pow(n, this.supplyYear.value) - 1) / ((this.inflationRate.value - this.returnRate.value) * 0.01)) + this.debtMoney.value;
                }
                owed = require - this.assetsMoney.value - this.lifeMoney.value;
            } else {
                require = this.familyMoney.value + this.debtMoney.value;
                owed = this.familyMoney.value + this.debtMoney.value - this.assetsMoney.value - this.lifeMoney.value;
            }
            (owed < 0) && (owed = 0);
            this.requiredReserve = calculatorJS.formatMoney(Math.round(require), 0);
            this.owedReserves = calculatorJS.formatMoney(Math.round(owed), 0);
        },
        preventNotNumber(event) {
            calculatorJS.preventNotNumber(event);
        },
        getAgentInfo(data) {
            this.agentInfo = data;
        }
    }
};