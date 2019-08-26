import vueSlider from 'vue-slider-component';

import {
    Toast
} from 'mint-ui';

import calculatorJS from '../calculator.js';

import SelectPicker from "@/components/shared/component/popup/selectpicker.vue";
import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import CalculatorShare from "@/components/calculator/share.vue";

export default {
    name: 'Education',
    data() {
        return {
            bannerSrc: 'https://static.iberhk.com/v2/web/images/calculator/educationbanner.png',
            showCalcContent: false,
            timeoutIndex: null,
            // 入学年期
            universityYear: {
                value: 4,
                min: 0,
                max: 10,
                step: 1,
                gridNum: 5,
                values: ['0', '2年', '4年', '6年', '8年', '10年'],
                tips: {
                    empty: '入學年期不可為空',
                    get: this.simply ? '年期不可大于10年' : '年期不可大於10年',
                    let: '入學年期不可小於0'
                }
            },
            // 现时费用
            chargeMoney: {
                value: 492176,
                string: '492,176',
                min: 0,
                max: 10000000,
                step: 1000,
                gridNum: 5,
                values: ['0', '200', '400', '600', '800', '1000'],
                inputTop: '-10000rem',
                placeholder: '0-10,000,000',
                tips: {
                    empty: '費用不可為空',
                    get: this.simply ? '现时费用不可大于1000万' : '現時費用不可大於1000萬',
                    let: '費用不可小於0'
                }
            },
            // 子女年齡
            nowAge: {
                value: 0,
                min: 0,
                max: 20,
                step: 1,
                gridNum: 4,
                values: ['0', '5', '10', '15', '20'],
                tips: {
                    empty: '年齡不可為空',
                    get: this.simply ? '年龄不可大于20岁' : '年齡不可大於20歲',
                    let: '年齡不可小於0'
                }
            },
            // 距離進入大學
            toEntryYear: {
                value: 18,
                min: 0,
                max: 25,
                step: 1,
                gridNum: 5,
                values: ['0', '5年', '10年', '15年', '20年', '25年'],
                tips: {
                    empty: '距離進入大學不可為空',
                    get: this.simply ? '距离进入大学不可大于25年' : '距離進入大學不可大於25年',
                    let: '距離進入大學不可小於0'
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
            // 每年回報率
            returnRate: {
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
            // 現有教育儲備
            assetsMoney: {
                value: 25000,
                string: '25,000',
                min: 0,
                max: 1000000,
                step: 1000,
                gridNum: 5,
                values: ['0', '20', '40', '60', '80', '100'],
                inputTop: '-10000rem',
                placeholder: '0-1,000,000',
                tips: {
                    empty: '結存不可為空',
                    get: this.simply ? '现有教育储备不可大于20万' : '現有教育儲備不可大於20萬',
                    let: '結存不可小於0'
                }
            },
            showCountry: '香港',
            showUniversity: {country: '香港', university: this.simply ? '任何一所大学' : '任何一所大學', charge: 492176, years: 4},
            countrys: [],
            universitys: [],
            realUniversitys: [],
            requiredReserve: '$876,362',
            owedReserves: '$816,196',
            monthReserves: '$2,328',
            agentInfo: {},
            title1: this.simply ? '所需储备金：' : '所需儲備金：',
            title2: this.simply ? '尚欠储备金：' : '尚欠儲備金：',
            title3: this.simply ? '每月储蓄金：' : '每月儲蓄金：',
            age_unit: this.simply ? '岁' : '歲',
            money_unit: this.simply ? '万' : '萬',
            bottom_tip: this.simply ? '咨询财富顾问，提早规划，让您的子女教育先准备' : '諮詢財富顧問，提早規劃，讓您的子女教育先準備',
            disclaimer_text: this.simply ? '免责声明：以上内容仅供参考' : '免責聲明：以上內容僅供參考',
            top_title: this.simply ? '选择学校' : '選擇學校',
            left_title1: this.simply ? '入学年期：' : '入學年期：',
            left_title2: this.simply ? '现时费用：' : '現時費用：',
            left_title3: this.simply ? '子女年龄：' : '子女年齡：',
            left_title4: this.simply ? '距离进入大学：' : '距離進入大學：',
            left_title5: this.simply ? '每年通胀率：' : '每年通脹率：',
            left_title6: this.simply ? '每年回报率：' : '每年回報率：',
            left_title7: this.simply ? '现有教育储备：' : '現有教育儲備：',
            share_title: this.simply ? '教育基金' : '教育基金',
            share_des: this.simply ? '想让宝宝上心仪高校？算算教育金够不够' : '想讓寶寶上心儀高校？算算教育金夠不夠',
            wrong_format_tip: this.simply ? '请输入正确的数字格式' : '請輸入正確的數字格式',
            placeholder_tip1: this.simply ? '请输入入学年期' : '請輸入入學年期',
            placeholder_tip2: this.simply ? '请输入现时费用' : '請輸入現時費用',
            country1: '香港',
            country2: this.simply ? '澳大利亚' : '澳大利亞',
            country3: this.simply ? '澳门' : '澳門',
            country4: this.simply ? '纽西兰（新西兰）' : '紐西蘭（新西蘭）',
            country5: this.simply ? '美国' : '美國',
            country6: '加拿大',
            country7: this.simply ? '英国' : '英國',
            HongKong_university: this.simply ? '任何一所大学' : '任何一所大學',
            please_select_area: this.simply ? '请选择地区' : '請選擇地區',
            please_select_university: this.simply ? '请选择学校' : '請選擇學校',
            inflation_rate_tip: this.simply ? 'Tip：2018上半年内地通胀率约2.0%；香港通胀率约1.9%;全球通胀率约3.5%' : 'Tip：2018上半年內地通脹率約2.0%；香港通脹率約1.9%;全球通脹率約3.5%',
        };
    },
    components: {
        vueSlider,
        ConsultantCard,
        SelectPicker,
        CalculatorShare
    },
    beforeCreate(){
        // window.title = (/cn/ig.test(this.language.currentLang) ? '教育基金计算器' : '教育基金計算器');
    },
    created() {
        this.countrys = ['其他', this.country1, this.country2, this.country3, this.country4, this.country5, this.country6, this.country7],
        this.universitys = [
            // 其他
            {country: '其他', university: '其他', charge: '', years: ''},
            // 香港
            {country: this.country1, university: this.HongKong_university, charge: 492176, years: 4},
            // 澳大利亚
            {country: this.country2, university: 'Macquarie University', charge: 1355748, years: 4},
            {country: this.country2, university: 'Monash University', charge: 1423052, years: 4},
            {country: this.country2, university: 'The University of Melbourne', charge: 1485124, years: 4},
            {country: this.country2, university: 'The University of Queensland', charge: 1423052, years: 4},
            {country: this.country2, university: 'The University of Sydney', charge: 1795484, years: 4},
            {country: this.country2, university: 'The University of Sydney', charge: 1795484, years: 4},
            // 澳门
            {country: this.country3, university: 'Macao Polytechnic Institute', charge: 399232, years: 4},
            {country: this.country3, university: 'Macau University of Science and Technology', charge: 603900, years: 4},
            {country: this.country3, university: 'University of Macau', charge: 399912, years: 4},
            // 纽西兰（新西兰）
            {country: this.country4, university: 'The University of Auckland', charge: 1141460, years: 4},
            {country: this.country4, university: 'Victoria University of Wellington', charge: 955932, years: 4},
            // 美国
            {country: this.country5, university: 'Brown University', charge: 2001842, years: 4},
            {country: this.country5, university: 'California Institute of Technology', charge: 1815608, years: 4},
            {country: this.country5, university: 'Columbia University', charge: 2001824, years: 4},
            {country: this.country5, university: 'Cornell University', charge: 1939752, years: 4},
            {country: this.country5, university: 'Duke University', charge: 1939752, years: 4},
            {country: this.country5, university: 'Harvard University', charge: 1939752, years: 4},
            {country: this.country5, university: 'Massachusetts Institute of Technology', charge: 2001824, years: 4},
            {country: this.country5, university: 'New York University', charge: 20011824, years: 4},
            {country: this.country5, university: 'Princeton University', charge: 1877680, years: 4},
            {country: this.country5, university: 'Stanford University', charge: 1877680, years: 4},
            {country: this.country5, university: 'University of California, Berkeley', charge: 1691464, years: 4},
            {country: this.country5, university: 'University of California, Los Angeles', charge: 1753536, years: 4},
            {country: this.country5, university: 'University of Chicago', charge: 1939752, years: 4},
            {country: this.country5, university: 'University of Michigan', charge: 1877680, years: 4},
            {country: this.country5, university: 'University of North Carolina, Chapel Hill', charge: 1381108, years: 4},
            {country: this.country5, university: 'University of Pennsylvania', charge: 2063896, years: 4},
            {country: this.country5, university: 'University of Texas at Austin', charge: 2203560, years: 4},
            {country: this.country5, university: 'University of Wisconsin-Madison', charge: 1443176, years: 4},
            {country: this.country5, university: 'Washington University in St. Louis', charge: 2093380, years: 4},
            {country: this.country5, university: 'Yale University', charge: 2001824, years: 4},
            // 加拿大
            {country: this.country6, university: 'The University of Adelaide', charge: 1373568, years: 4},
            {country: this.country6, university: 'McGill University', charge: 840112, years: 4},
            {country: this.country6, university: 'McMaster University', charge: 1068892, years: 4},
            {country: this.country6, university: 'Simon Fraser University', charge: 921280, years: 4},
            {country: this.country6, university: 'University of British Columbia', charge: 1150472, years: 4},
            {country: this.country6, university: 'University of Manitoba', charge: 827916, years: 4},
            {country: this.country6, university: 'University of Toronto', charge: 1398760, years: 4},
            {country: this.country6, university: 'University of Waterloo', charge: 1358784, years: 4},
            {country: this.country6, university: 'York University', charge: 916648, years: 4},
            // 英国
            {country: this.country7, university: 'Imperial College London', charge: 1173405, years: 3},
            {country: this.country7, university: "King's College London", charge: 1015446, years: 3},
            {country: this.country7, university: 'London School of Economics and Political Science', charge: 909840, years: 3},
            {country: this.country7, university: 'The University of Manchester', charge: 966249, years: 3},
            {country: this.country7, university: 'The University of Sheffield', charge: 1012803, years: 3},
            {country: this.country7, university: 'The University of Warwick', charge: 966249, years: 3},
            {country: this.country7, university: 'University of Cambridge', charge: 1012803, years: 3},
            {country: this.country7, university: 'University of Edinburgh', charge: 919695, years: 3},
            {country: this.country7, university: 'University of Glasgow', charge: 426249, years: 3},
            {country: this.country7, university: 'University of Oxford', charge: 119909, years: 3},
        ];
    },
    mounted() {
        this.$refs.calculatorShare.share.thumbImage = 'https://static.iberhk.com/v2/calculator/educationbrief.png';
        this.resetUniversitys();
        // 渲染过快导致滑动组件不能点击滑动，需设些延时渲染
        const _this = this;
        setTimeout(()=>{
            _this.showCalcContent = true;
        }, 500);
    },
    methods: {
        resetUniversitys (){
            this.realUniversitys = [];
            this.universitys.forEach((item, index) => {
                if(item.country === this.showCountry){
                    this.realUniversitys.push(item); 
                }
            });
            this.showUniversity = this.realUniversitys[0];
        },
        showCountrys(){
            this.$refs.countryPicker.open();
        },
        updateCountrys (event){
            this.showCountry = event;
            this.resetUniversitys();
            this.universityYear.value = this.showUniversity.years;
            this.chargeMoney.value = this.showUniversity.charge;
            this.chargeMoney.inputTop = '.04rem';
            this.calcReault();
        },
        showUniversitys(){
            this.$refs.universityPicker.open();
        },
        updateUniversitys (event){
            this.showUniversity = event;
            this.universityYear.value = this.showUniversity.years;
            this.chargeMoney.value = this.showUniversity.charge;
            this.calcReault();
        },
        resetEntryYear(type){
            if (type === 'nowAge') {
                if (this.nowAge.value <= 17) {
                    this.toEntryYear.value = 18 - this.nowAge.value;
                } else if (this.nowAge.value > 17) {
                    this.toEntryYear.value = 0;
                }
            }
        },
        resetSelect(type){
            if(type === 'universityYear' || type === 'chargeMoney'){
                this.showCountry = '其他';
                this.showUniversity = {country: '其他', university: '其他', charge: '', years: ''};
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
                if (String(this[type]['value'])[0] === '0' && String(this[type]['value']).length > 1) {
                    this[type]['value'] = parseFloat(this[type]['value'])
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
                chargeMoney: 255,
                assetsMoney: 940
            };
            this[type]['inputTop'] = '.04rem';
            document.getElementById('calculatorSection').scrollTop = scrollTop[type];

        },
        calcReault(type) {
            clearTimeout(this.timeoutIndex);
            this.timeoutIndex = setTimeout(() => {
                this.resetSelect(type);
                this.resetEntryYear(type);
                let require = 0,
                    owed = 0,
                    monthMoney = 0;
                if (this.universityYear.value && this.chargeMoney.value && this.toEntryYear.value && (this.assetsMoney.value === 0 || this.assetsMoney.value) && (this.inflationRate.value === 0 || this.inflationRate.value) && (this.returnRate.value === 0 || this.returnRate.value)) {
                    // 入學每年費用
                    let yearCharge = this.chargeMoney.value / this.universityYear.value,
                        // 所需储备实际汇率
                        inflationRate = 1 + this.inflationRate.value * 0.01,    
                        // 教育結餘实际汇率
                        yearRate = 1 + this.returnRate.value * 0.01,
                        // 每月储蓄实际汇率
                        monthRate = 1 + this.returnRate.value * 0.01 / 12;
                    if (inflationRate === 1) {
                        require = this.chargeMoney.value;
                    } else {
                        require = yearCharge * (Math.pow(inflationRate, this.toEntryYear.value + this.universityYear.value) - Math.pow(inflationRate, this.toEntryYear.value)) / (this.inflationRate.value * 0.01);
                    }
                    if (yearRate === 1){
                        owed = require - this.assetsMoney.value;
                    } else {
                        owed = require - this.assetsMoney.value * Math.pow(yearRate, this.toEntryYear.value);
                    }
                    (owed < 0) && (owed = 0);
                    if (monthRate === 1) {
                        monthMoney = owed / (12 * this.toEntryYear.value);
                    } else {
                        monthMoney = owed / (monthRate * (Math.pow(monthRate, 12 * this.toEntryYear.value) - 1) / (this.returnRate.value * 0.01 / 12));
                    }
                } else {
                    require = 0;
                    owed = 0;
                    monthMoney = 0;
                }
                // 所需儲備金
                this.requiredReserve = calculatorJS.formatMoney(Math.round(require), 0);
                this.owedReserves = calculatorJS.formatMoney(Math.round(owed), 0);
                this.monthReserves = calculatorJS.formatMoney(Math.round(monthMoney), 0);
            }, 800);
        },
        preventNotNumber(event) {
            calculatorJS.preventNotNumber(event);
        },
        getAgentInfo(data) {
            this.agentInfo = data;
        }
    }
};