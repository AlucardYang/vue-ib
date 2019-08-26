<template>
    <div v-show="showPicker" class="popup-date-picker-content">
        <div class="popup-date-picker-bg" @click="close"></div>
        <div id="popupDatePicker" class="popup-date-picker" :style="slideStyle">
            <div class="time-tab">
                <i v-if="times.length > 1" class="iconfonti" :style="{'color': activeIndex === 0 ? '#979797' : '#2A2A2A'}" @click="goSlidePrev">&#xe678;</i>
                <span>{{timeTitle}}</span>
                <i v-if="times.length > 1" class="iconfonti" :style="{'color': activeIndex === (times.length - 1) ? '#979797' : '#2A2A2A'}" @click="goSlideNext">&#xe677;</i>
                <div class="separate-horizontal-line"></div>
            </div>
            <div id="timesSelector" class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item, index) in times">
                        <div class="week-box">
                            <span>日</span>
                            <span>一</span>
                            <span>二</span>
                            <span>三</span>
                            <span>四</span>
                            <span>五</span>
                            <span>六</span>
                            <div class="separate-horizontal-line"></div>
                        </div>
                        <ul class="day-box">
                            <li class="day-block" v-for="(dayItem, num) in item.days" :class="{'unreserved': dayItem.status === 'unreserved', 'reserveable': dayItem.status === 'reserveable', 'selected': selectDate.date === dayItem.date}" @click="selectDay(dayItem)">
                                <span class="num">{{dayItem.day}}</span><br>
                                <span v-if="dayItem.status === 'reserved_full' || (selectDate.date === dayItem.date)" class="text">{{formatReservation(dayItem.status)}}</span>
                                <span v-if="dayItem.status === 'reserveable'" v-show="selectDate.date !== dayItem.date" class="gray-text">{{simply ? '可预约' : '可預約'}}</span>
                                <div v-if="dayItem.weekday != 6" class="separate-vertical-line"></div>
                                <div class="separate-horizontal-line"></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <ul class="time-slot-tab">
                <li class="time-slot-tab-block" :class="{'active': selectedTimeSlot === 'am'}" @click="selectTimeSlotTab('am')">
                    <span>{{simply ? '上午时间段' : '上午時間段'}}</span>
                    <div class="separate-vertical-line"></div>
                </li>
                <li class="time-slot-tab-block" :class="{'active': selectedTimeSlot === 'pm'}" @click="selectTimeSlotTab('pm')">
                    <span>{{simply ? '下午时间段' : '下午時間段'}}</span>
                </li>
            </ul>
            <div id="timesSlotSelector" class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide times-slot-slide">
                        <div v-if="timeSlotAm.length === 0" class="times-slot-slide-tip">{{simply ? '此时段暂无时间安排' : '此時段暫無時間安排'}}</div>
                        <div v-else class="times-slot-block" v-for="(item, index) in timeSlotAm" :class="{'active': selectDate.slot === item}" :style="{'margin-right': (index + 1) % 3 === 0 ? '0' : '0.1rem'}" @click="selectTimeSlot(item)">
                            <span>{{item}}</span>
                            <span v-if="selectDate.slot === item" class="reserve">{{simply ? '预约' : '預約'}}</span>
                        </div>
                    </div>
                    <div class="swiper-slide times-slot-slide">
                        <div v-if="timeSlotPm.length === 0" class="times-slot-slide-tip">{{simply ? '此时段暂无时间安排' : '此時段暫無時間安排'}}</div>
                        <div v-else class="times-slot-block" v-for="(item, index) in timeSlotPm" :class="{'active': selectDate.slot === item}" :style="{'margin-right': (index + 1) % 3 === 0 ? '0' : '0.1rem'}" @click="selectTimeSlot(item)">
                            <span>{{item}}</span>
                            <span v-if="selectDate.slot === item" class="reserve">{{simply ? '预约' : '預約'}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="confirm-btn" :class="{'active': selectDate.date && selectDate.slot}" @click="confirmDateChange">{{simply ? '确认' : '確認'}}</div>
        </div>
    </div>
</template>

<script>
import CommonJS from "@/components/shared/service/common.js";

export default {
    name: "CareDatePicker",
    props: {
        careProductUuid: {
            type: String,
            default: function() {
                return '';
            }
        },
        careOrderUuid: {
            type: String,
            default: function() {
                return '';
            }
        },
        storeUuid: {
            type: String,
            default: function() {
                return '';
            }
        },
        reserveDate: {
            type: Object,
            default: function() {
                return {
                    date: '', // 日期
                    slot: '', // 时间段
                    weekday: '', // 星期几
                    section: '' // 上午或者下午
                }
            }
        },
    },
    data() {
        return {
            showPicker: false,
            slideStyle: {},
            confirmText: this.simply ? '确定' : '確定',
            timeTitle: '',
            timesSwiper: null,
            timesSlotSwiper: null,
            activeIndex: 0,
            times: [],
            timeSlotAm: [],
            timeSlotPm: [],
            selectedTimeSlot: 'am',
            selectDate: {
                date: '', // 日期
                slot: '', // 时间段
                weekday: '', // 星期几
                section: '' // 上午或者下午
            }
        };
    },
    watch: {
        careProductUuid: {
            handler: function(value, oldvalue) {
                // this.getReserveTimes();
            }
        },
        storeUuid: {
            handler: function(value, oldvalue) {
                this.getReserveTimes();
            }
        },
        reserveDate: {
            handler: function(value, oldvalue) {
                this.selectDate = value;
            }
        },
    },
    created() {
        // 加载swiper轮播插件
        CommonJS.loadStyle('https://static.iberhk.com/res/css/swiper.min.css');
    },
    mounted() {},
    methods: {
        open() {
            this.showPicker = true;
            document.querySelector('.care-sign-up-content') && (document.querySelector('.care-sign-up-content').classList.add("overflow-hidden"));
            CommonJS.loadScript('https://static.iberhk.com/res/js/swiper.min.js', () => {
                // 日期选择swiper
                this.createTimesSwiper();
                // 时间段swiper
                this.createTimesSlotSwiper();
                // 从下往上的动效
                this.slideStyle = {
                    transform: 'translateY(0)'
                };
            });
            // setTimeout(() => {
            //     this.selectDate.slot && this.selectTimeSlot(this.selectDate.slot);
            // }, 1000);
        },
        close() {
            this.slideStyle = {
                transform: 'translateY(100%)'
            };
            setTimeout(() => {
                this.showPicker = false;
            }, 300);
            document.querySelector('.care-sign-up-content') && (document.querySelector('.care-sign-up-content').classList.remove("overflow-hidden"));
        },
        // 选中对应日期
        dateAutoSelect() {
            if (this.selectDate.date) {
                this.selectedTimeSlot = (this.selectDate.section === '下午' ? 'pm' : 'am');
                this.times.forEach((item, index) => {
                    if (item.monthNum === this.selectDate.date.split('-')[1]) {
                        this.activeIndex = index;
                        item.days.forEach((checkDate, i) => {
                            if (checkDate.date === this.selectDate.date) {
                                this.getReserveTimesSlot(checkDate);
                            }
                        });
                    }
                });
            }
        },
        // 查询门店可预约时间
        getReserveTimes() {
            if (this.careProductUuid && this.storeUuid) {
                this.$root.blueLoadingParams.show = true;
                this.$http.get('/iber-care/reserve-date-list', {
                    care_product_uuid: this.careProductUuid,
                    care_order_uuid: this.careOrderUuid,
                    care_company_store_uuid: this.storeUuid,
                }).then(res => {
                    if (res && res.code === 0) {
                        this.times = res.data.times;
                        this.formatTimes();
                        this.dateAutoSelect();
                    } else if (res && (res.code === 1000)) {
                        this.$toast(res.msg);
                    }
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                }, err => {
                    window.location.href = window.baseUrl + '/error/404';
                });
            }
        },
        // 查询当天可预约时间段
        getReserveTimesSlot(originItem) {
            // if (!this.selectDate.date || (this.selectDate.date !== originItem.date)) {
            // this.timeSlotAm = [];
            // this.timeSlotPm = [];
            this.$root.blueLoadingParams.show = true;
            this.selectDate.date = originItem.date;
            this.selectDate.weekday = this.transformWeek(originItem.weekday);
            this.$http.get('/iber-care/reserve-time-section', {
                care_product_uuid: this.careProductUuid,
                care_company_store_uuid: this.storeUuid,
                date: this.selectDate.date,
            }).then(res => {
                if (res && res.code === 0) {
                    this.timeSlotAm = res.data.am;
                    this.timeSlotPm = res.data.pm;
                    this.$root.blueLoadingParams.show = false;
                    this.isLoaded = true;
                } else if (res && (res.code === 1000)) {
                    this.$toast(res.msg);
                }
                this.$root.blueLoadingParams.show = false;
                this.isLoaded = true;
            }, err => {
                this.$root.blueLoadingParams.show = false;
                this.isLoaded = true;
            });
            // }
        },
        // 格式化日历
        formatTimes() {
            this.times.length > 0 && (this.timeTitle = this.times[this.activeIndex].text);
            this.times.forEach((item, index) => {
                for (let i = 0; i < parseInt(item.days[0].weekday); i++) {
                    item.days.unshift({
                        weekday: item.days[0].weekday,
                        day: undefined,
                        date: undefined,
                        status: '',
                        month: parseInt(item.monthNum)
                    });
                }
                let lastWeek = parseInt(item.days[item.days.length - 1].weekday);
                if (lastWeek !== 6) {
                    for (let i = lastWeek + 1; i <= 6; i++) {
                        item.days.push({
                            weekday: i,
                            day: undefined,
                            date: undefined,
                            status: '',
                            month: parseInt(item.monthNum)
                        });
                    }
                }
            });
        },
        // 格式化预约状态
        formatReservation(status) {
            let statusText = '';
            switch (status) {
                case 'unreserved':
                    statusText = '';
                    break;
                case 'reserveable':
                    statusText = this.simply ? '预约' : '預約';
                    break;
                case 'reserved_full':
                    statusText = this.simply ? '已约满' : '已約滿';
                    break;
            }
            return statusText;
        },
        // 选择日期
        selectDay(originItem) {
            this.selectDate.slot = '';
            if (originItem.status === 'reserveable') {
                this.getReserveTimesSlot(originItem);
                this.$forceUpdate();
            }
        },
        // 选择日期swiper
        createTimesSwiper() {
            const _this = this;
            setTimeout(() => {
                _this.timesSwiper = new Swiper("#timesSelector", {
                    initialSlide: _this.activeIndex,
                    direction: "horizontal",
                    loop: false,
                    freeMode: false,
                    pagination: {
                        el: null,
                    },
                    on: {
                        init() {

                        },
                        slideChange() {
                            _this.activeIndex = this.activeIndex;
                            _this.timeTitle = _this.times[this.activeIndex].text;
                        },
                        slideNextTransitionEnd() {

                        },
                        slidePrevTransitionStart() {

                        }
                    }
                });
            }, 200);
        },
        // 选择日期swiper
        createTimesSlotSwiper() {
            const _this = this;
            setTimeout(() => {
                _this.timesSlotSwiper = new Swiper("#timesSlotSelector", {
                    initialSlide: _this.selectDate.section === '下午' ? 1 : 0,
                    direction: "horizontal",
                    loop: false,
                    freeMode: false,
                    pagination: {
                        el: null,
                    },
                    on: {
                        init() {

                        },
                        slideChange() {
                            _this.selectedTimeSlot = (this.activeIndex === 0 ? 'am' : 'pm');
                        },
                        slideNextTransitionEnd() {

                        },
                        slidePrevTransitionStart() {

                        }
                    }
                });
            }, 200);
        },
        // 跳转下一月
        goSlideNext() {
            this.timesSwiper.slideNext();
        },
        // 跳转上一月
        goSlidePrev() {
            this.timesSwiper.slidePrev();
        },
        // 选择时间段tab栏
        selectTimeSlotTab(type) {
            this.selectedTimeSlot = type;
            this.timesSlotSwiper.slideTo(type === 'am' ? 0 : 1);
        },
        // 选择时间段
        selectTimeSlot(slot) {
            this.selectDate.slot = slot;
            this.selectDate.section = (this.selectedTimeSlot === 'am' ? '上午' : '下午');
        },
        // 转换星期几
        transformWeek(week) {
            let weekCn = '';
            week = parseInt(week);
            switch (week) {
                case 0:
                    weekCn = '星期日';
                    break;
                case 1:
                    weekCn = '星期一';
                    break;
                case 2:
                    weekCn = '星期二';
                    break;
                case 3:
                    weekCn = '星期三';
                    break;
                case 4:
                    weekCn = '星期四';
                    break;
                case 5:
                    weekCn = '星期五';
                    break;
                case 6:
                    weekCn = '星期六';
            }
            return weekCn;
        },
        // 确认表单
        confirmDateChange() {
            if (this.selectDate.date && this.selectDate.slot) {
                this.$emit('updateSelectDate', this.selectDate);
                this.close();
            }
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.separate-horizontal-line {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background-color: #E8E8E8;
    display: block;
    z-index: 15;
    transform: scaleY(0.5);
}

.separate-vertical-line {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background-color: #E8E8E8;
    display: block;
    z-index: 15;
    transform: scaleX(0.5);
}

.swiper-container {
    width: 100%;
}

.popup-date-picker-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3000;
}

.popup-date-picker-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.popup-date-picker {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    width: 100%;
    min-height: 3rem;
    transition: all 100ms;
    transform: translateY(100%);
}

.time-tab {
    width: 100%;
    height: .4rem;
    line-height: .4rem;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: .14rem;
    color: #2A2A2A;
}

.time-tab i {
    font-size: .1rem;
    cursor: pointer;
}

.week-box {
    width: 100%;
    height: .27rem;
    line-height: .27rem;
    display: flex;
    font-size: .12rem;
    color: #BBBBBB;
}

.week-box span {
    flex: 1;
    text-align: center;
}

.day-box {
    width: 100%;
    overflow: hidden;
}

.day-block {
    float: left;
    width: 14.28%;
    height: .46rem;
    padding: .01rem;
    text-align: center;
}

.day-block .num {
    font-family: PingFangSC-Semibold;
    font-size: .13rem;
    color: #111111;
    line-height: .14rem;
    height: .14rem;
    display: inline-block;
}

.day-block .text {
    font-size: .1rem;
    color: #FF4416;
    line-height: .12rem;
    display: block;
}

.day-block.unreserved {
    background-color: #F2F2F2;
}

.day-block.reserveable {
    cursor: pointer;
}

.day-block.selected {
    cursor: pointer;
    background-color: #3364E4;
}

.day-block.selected .num,
.day-block.selected .text {
    color: #FFFFFF;
}

.time-slot-tab {
    width: 100%;
    margin-bottom: .06rem;
}

.time-slot-tab-block {
    width: 50%;
    float: left;
    font-size: .15rem;
    color: #999999;
    line-height: .18rem;
    margin: .16rem 0;
    text-align: center;
    cursor: pointer;
}

.time-slot-tab-block.active {
    color: #3364E4;
}

.time-slot-tab-block.active:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -.05rem;
    height: 1px;
    width: .32rem;
    background-color: #3364E4;
    display: block;
    z-index: 15;
    transform: translateX(-50%) scaleY(1.5);
}

.times-slot-slide {
    width: 100%;
    padding: 0 .12rem;
    height: 1.02rem;
    overflow-x: hidden;
    overflow-y: auto;
}

.times-slot-slide-tip {
    width: 100%;
    line-height: 1.02rem;
    text-align: center;
    font-size: .14rem;
    color: #666666;
}

.times-slot-block {
    float: left;
    width: calc(33.1% - 6.66px);
    height: .36rem;
    line-height: .36rem;
    border: 1px solid #BBBBBB;
    border-radius: .04rem;
    text-align: center;
    font-size: .14rem;
    color: #666666;
    margin: 0 .1rem .1rem 0;
    cursor: pointer;
}

.times-slot-block.active {
    color: #3364E4;
    border: 1px solid #3364E4;
    line-height: .34rem;
}

.times-slot-block.active .reserve {
    position: absolute;
    right: -.01rem;
    bottom: -.01rem;
    width: .24rem;
    height: .12rem;
    line-height: .12rem;
    text-align: center;
    background-color: #3364E4;
    border-radius: .06rem 0 .04rem 0;
    font-size: .08rem;
    color: #FFFFFF;
}

.confirm-btn {
    width: calc(100% - .32rem);
    height: .38rem;
    line-height: .38rem;
    border-radius: .19rem;
    text-align: center;
    background-color: #DDDDDD;
    font-family: PingFangSC-Medium;
    font-size: .15rem;
    color: #FFFFFF;
    margin: .06rem .16rem .16rem .16rem;
    float: left;
}

.gray-text {
    color: #DDDDDD;
    font-size: .1rem;
    line-height: .12rem;
    display: block;
}

.confirm-btn.active {
    background-color: #3364E4;
}

.fadeInUp {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    animation-name: fadeInUp;
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }
    100% {
        opacity: 1;
        transform: translateZ(0);
    }
}

.fadeInDown {
    animation-duration: 0.3s;
    animation-fill-mode: both;
    animation-name: fadeInDown;
}

@keyframes fadeInDown {
    0% {
        opacity: 1;
        transform: translateZ(0);
    }
    100% {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }
}
</style>

<style>
.overflow-hidden {
    overflow: hidden !important;
}
</style>
