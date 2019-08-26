import vueSlider from 'vue-slider-component';

import {
    Toast
} from 'mint-ui';

import CommonJS from '@/components/shared/service/common.js';
import calculatorJS from '../calculator.js';

import SelectPicker from "@/components/shared/component/popup/selectpicker.vue";
import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import DatePicker from "@/components/shared/component/popup/datepicker.vue";
import CalculatorShare from "@/components/calculator/share.vue";

export default {
    name: 'PremiumLevy',
    data() {
        return {
            bannerSrc: 'https://static.iberhk.com/v2/web/images/calculator/premiumlevybanner.png',
            showCalcContent: false,
            // 供款年期
            supplyYear: {
                value: 15,
                min: 0,
                max: 100,
                step: 1,
                gridNum: 5,
                values: ['0', '20年', '40年', '60年', '80年', '100年'],
                tips: {
                    empty: '供款年期不可為空',
                    get: this.simply ? '供款年期不可大于100年' : '供款年期不可大於100年',
                    let: '供款年期不可小於0'
                }
            },
            // 年度保費
            premiumMoney: {
                value: 10000,
                string: '10,000',
                min: 0,
                max: 10000000,
                step: 5000,
                gridNum: 5,
                values: ['0', '200', '400', '600', '800', '1000'],
                inputTop: '-10000rem',
                placeholder: '0-10,000,000',
                tips: {
                    empty: '年度保費不可為空',
                    get: this.simply ? '年度保费不可大于1000万' : '年度保費不可大於1000萬',
                    let: '年度保費不可小於0'
                }
            },
            showType: this.simply ? '人寿保险' : '人壽保險',
            types: [this.simply ? '人寿保险' : '人壽保險', this.simply ? '一般保险' : '一般保險'],
            selectedDate: new Date('2012-02-20'),
            moneyUnit: '$',
            levyYears: 0,
            premiumLevy: 72.50,
            levyDatas: [],
            agentInfo: {},
            title1: this.simply ? '您需要缴交：' : '您需要繳交：',
            go_levy_detail: this.simply ? '查看征费明细' : '查看徵費明細',
            levy_from_date: this.simply ? '保单周年日为2018年1月1日' : '保單週年日為2018年1月1日',
            levy_to_end: this.simply ? '或之后才需缴交' : '或之後才需繳交',
            money_unit: this.simply ? '万' : '萬',
            bottom_tip: this.simply ? '咨询财富顾问，让您得到更安心的保障' : '諮詢財富顧問，讓您得到更安心的保障',
            disclaimer_text: this.simply ? '免责声明：以上内容仅供参考' : '免責聲明：以上內容僅供參考',
            left_title1: this.simply ? '保单类型：' : '保單類型：',
            left_title2: this.simply ? '保单日期：' : '保單日期：',
            left_title3: this.simply ? '供款年期：' : '供款年期：',
            left_title4: this.simply ? '年度保费：(港币)' : '年度保費：(港幣)',
            share_title: this.simply ? '保费征费计算器' : '保費徵費計算器',
            share_des: this.simply ? '你的保单每年要缴多少保费征费？' : '你的保單每年要繳多少保費徵費？',
            wrong_format_tip: this.simply ? '请输入正确的数字格式' : '請輸入正確的數字格式',
            please_select_type: this.simply ? '请选择保单类型' : '請選擇保單類型',
            please_select_date: this.simply ? '请选择保单日期' : '請選擇保單日期',
            inflation_rate_tip: this.simply ? 'Tip：2018上半年内地通胀率约2.0%；香港通胀率约1.9%;全球通胀率约3.5%' : 'Tip：2018上半年內地通脹率約2.0%；香港通脹率約1.9%;全球通脹率約3.5%',
            fitst_stage: this.simply ? '首阶段' : '首階段',
            second_stage: this.simply ? '第二阶段' : '第二階段',
            third_stage: this.simply ? '第三阶段' : '第三階段',
            fourth_stage: this.simply ? '第四阶段' : '第四階段',
        };
    },
    components: {
        vueSlider,
        ConsultantCard,
        DatePicker,
        SelectPicker,
        CalculatorShare
    },
    beforeCreate() {
        // window.title = (/cn/ig.test(this.language.currentLang) ? '保费征费计算器' : '保費徵費計算器');
    },
    created() {},
    mounted() {
        this.$refs.calculatorShare.share.thumbImage = 'https://static.iberhk.com/v2/calculator/premiumlevybrief.png';
        // 渲染过快导致滑动组件不能点击滑动，需设些延时渲染
        const _this = this;
        setTimeout(() => {
            _this.showCalcContent = true;
        }, 500);
        this.calcReault();
    },
    methods: {
        showTypes() {
            this.$refs.typePicker.open();
        },
        updateTypes(event) {
            this.showType = event;
            this.calcReault();
        },
        showDateFn() {
            this.$refs.datePicker.open();
        },
        updateDate(date) {
            this.selectedDate = date;
            this.calcReault();
        },
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
            let scrollTop = {
                premiumMoney: 500
            };
            this[type]['inputTop'] = '.04rem';
            document.getElementById(type + 'Input').focus();
            document.getElementById('calculatorSection').scrollTop = scrollTop[type];
        },
        createDetailRow(title, from, to, date, rate, max, generalMax, isBold, connect) {
            let stage = {
                title: title,
                from: from,
                to: to,
                date: date,
                rate: rate,
                // levy: 0,
                max: max,
                isBold: isBold,
                connect: connect
            };
            (this.showType === this.type2) && (stage.max = generalMax);
            stage.levy = Math.floor(this.premiumMoney.value * stage.rate) * 0.01;
            stage.levy > stage.max && (stage.levy = stage.max);
            this.levyDatas.push(stage);
        },
        calcReault() {
            this.levyDatas = [];
            let year = this.selectedDate.getFullYear();
            let month = this.selectedDate.getMonth() + 1;
            let day = this.selectedDate.getDate();
            if (year <= 2018) {
                this.levyYears = year + this.supplyYear.value - 2018;
            } else {
                this.levyYears = this.supplyYear.value;
            }
            (this.levyYears < 0 || !this.supplyYear.value) && (this.levyYears = 0);
            month = (String(month).length === 1 && "0") + month;
            day = (String(day).length === 1 && "0") + day;
            if (year <= 2018) {
                if (this.levyYears > 0) {
                    this.createDetailRow(this.fitst_stage, '2018-01-01', '2019-03-31', 2018 + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2018, parseInt(month)) : day), 0.04, 40, 2000, true, '到');
                }
                if (this.levyYears > 1) {
                    if (month < 4) {
                        this.createDetailRow('', '', '', '2019-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2019, parseInt(month)) : day), 0.04, 40, 2000, true);
                    } else {
                        this.createDetailRow(this.second_stage, '2019-04-01', '2020-03-31', '2019-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2019, parseInt(month)) : day), 0.06, 60, 3000, false, '到');
                    }
                }
                if (this.levyYears > 2) {
                    if (month < 4) {
                        this.createDetailRow(this.second_stage, '2019-04-01', '2020-03-31', '2020-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2020, parseInt(month)) : day), 0.06, 60, 3000, false, '到');
                    } else {
                        this.createDetailRow(this.third_stage, '2020-04-01', '2021-03-31', '2020-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2020, parseInt(month)) : day), 0.085, 85, 4250, true, '到');
                    }
                }
                if (this.levyYears > 3) {
                    if (month < 4) {
                        this.createDetailRow(this.third_stage, '2020-04-01', '2021-03-31', '2021-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2021, parseInt(month)) : day), 0.085, 85, 4250, true, '到');
                    } else {
                        this.createDetailRow(this.fourth_stage, '2021-04-01', '', '2021-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2021, parseInt(month)) : day), 0.1, 100, 5000, false, '起');
                    }
                }
                if (this.levyYears > 4) {
                    for (let i = 0; i < this.levyYears - 4; i++) {
                        if (month < 4) {
                            this.createDetailRow(i === 0 ? this.fourth_stage : '', i === 0 ? '2021-04-01' : '', '', 2022 + i + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2022 + i, parseInt(month)) : day), 0.1, 100, 5000, false, i === 0 ? '起' : '');
                        } else {
                            this.createDetailRow('', '', '', 2022 + i + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2022 + i, parseInt(month)) : day), 0.1, 100, 5000, false, '');
                        }
                    }
                }
            } else {
                if (year === 2019) {
                    if (this.levyYears > 0) {
                        if (month < 4) {
                            this.createDetailRow(this.fitst_stage, '2018-01-01', '2019-03-31', '2019-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2019, parseInt(month)) : day), 0.04, 40, 2000, true, '到');
                        } else {
                            this.createDetailRow(this.second_stage, '2019-04-01', '2020-03-31', '2019-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2019, parseInt(month)) : day), 0.06, 60, 3000, true, '到');
                        }
                    }
                    if (this.levyYears > 1) {
                        if (month < 4) {
                            this.createDetailRow(this.second_stage, '2019-04-01', '2020-03-31', '2020-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2020, parseInt(month)) : day), 0.06, 60, 3000, false, '到');
                        } else {
                            this.createDetailRow(this.third_stage, '2020-04-01', '2021-03-31', '2020-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2020, parseInt(month)) : day), 0.085, 85, 4250, false, '到');
                        }
                    }
                    if (this.levyYears > 2) {
                        if (month < 4) {
                            this.createDetailRow(this.third_stage, '2020-04-01', '2021-03-31', '2021-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2021, parseInt(month)) : day), 0.085, 85, 4250, true, '到');
                        } else {
                            this.createDetailRow(this.fourth_stage, '2021-04-01', '', '2021-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2021, parseInt(month)) : day), 0.1, 100, 5000, true, '起');
                        }
                    }
                    if (this.levyYears > 3) {
                        for (let i = 0; i < this.levyYears - 3; i++) {
                            if (month < 4) {
                                this.createDetailRow(i === 0 ? this.fourth_stage : '', i === 0 ? '2021-04-01' : '', '', 2022 + i + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2022 + i, parseInt(month)) : day), 0.1, 100, 5000, false, i === 0 ? '起' : '');
                            } else {
                                this.createDetailRow('', '', '', 2022 + i + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2022 + i, parseInt(month)) : day), 0.1, 100, 5000, false, '');
                            }
                        }
                    }
                } else if (year === 2020) {
                    if (this.levyYears > 0) {
                        if (month < 4) {
                            this.createDetailRow(this.second_stage, '2019-04-01', '2020-03-31', '2020-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2020, parseInt(month)) : day), 0.06, 60, 3000, true, '到');
                        } else {
                            this.createDetailRow(this.third_stage, '2020-04-01', '2021-03-31', '2020-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2020, parseInt(month)) : day), 0.085, 85, 4250, true, '到');
                        }
                    }
                    if (this.levyYears > 1) {
                        if (month < 4) {
                            this.createDetailRow(this.third_stage, '2020-04-01', '2021-03-31', '2021-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2021, parseInt(month)) : day), 0.085, 85, 4250, false, '到');
                        } else {
                            this.createDetailRow(this.fourth_stage, '2021-04-01', '', '2021-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2021, parseInt(month)) : day), 0.1, 100, 5000, false, '起');
                        }
                    }
                    if (this.levyYears > 2) {
                        for (let i = 0; i < this.levyYears - 2; i++) {
                            if (month < 4) {
                                this.createDetailRow(i === 0 ? this.fourth_stage : '', i === 0 ? '2021-04-01' : '', '', 2022 + i + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2022 + i, parseInt(month)) : day), 0.1, 100, 5000, true, i === 0 ? '起' : '');
                            } else {
                                this.createDetailRow('', '', '', 2022 + i + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2022 + i, parseInt(month)) : day), 0.1, 100, 5000, true, '');
                            }
                        }
                    }
                } else if (year === 2021) {
                    if (this.levyYears > 0) {
                        if (month < 4) {
                            this.createDetailRow(this.third_stage, '2020-04-01', '2021-03-31', '2021-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2021, parseInt(month)) : day), 0.085, 85, 4250, true, '到');
                        } else {
                            this.createDetailRow(this.fourth_stage, '2021-04-01', '', '2021-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2021, parseInt(month)) : day), 0.1, 100, 5000, true, '起');
                        }
                    }
                    if (this.levyYears > 1) {
                        for (let i = 0; i < this.levyYears - 1; i++) {
                            if (month < 4) {
                                this.createDetailRow(i === 0 ? this.fourth_stage : '', i === 0 ? '2021-04-01' : '', '', 2022 + i + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2022 + i, parseInt(month)) : day), 0.1, 100, 5000, false, i === 0 ? '起' : '');
                            } else {
                                this.createDetailRow('', '', '', 2022 + i + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2022 + i, parseInt(month)) : day), 0.1, 100, 5000, true, '');
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < this.levyYears; i++) {
                        if (month < 4) {
                            this.createDetailRow(i === 0 ? this.fourth_stage : '', i === 0 ? '2021-04-01' : '', '', 2022 + i + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2022 + i, parseInt(month)) : day), 0.1, 100, 5000, true, i === 0 ? '起' : '');
                        } else {
                            this.createDetailRow('', '', '', 2022 + i + '-' + month + '-' + (day === 29 ? CommonJS.getDaysInMonth(2022 + i, parseInt(month)) : day), 0.1, 100, 5000, true, '');
                        }
                    }
                }
            }
            this.premiumLevy = 0;
            this.levyDatas.forEach((item, index) => {
                this.premiumLevy += item.levy;
            });
            sessionStorage.setItem('levyYears', this.levyYears);
            sessionStorage.setItem('premiumLevy', this.premiumLevy);
            sessionStorage.setItem('levyDatas', JSON.stringify(this.levyDatas));
        },
        preventNotNumber(event) {
            calculatorJS.preventNotNumber(event);
        },
        goLevyDetail() {
            window.location.href = window.baseUrl + '/calculator/levy-detail?language=' + this.language['currentLang'];
        },
        getAgentInfo(data) {
            this.agentInfo = data;
        }
    }
};