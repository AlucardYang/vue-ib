<template>
    <div v-show="isLoaded">
        <!-- 手机号前缀选择器 -->
        <select-picker ref="prePhonePicker" :data="mobile_pres" :default="userInfo.mobile_pre" :title="please_select_mobile_pre" @updateData="updatePrePhone"></select-picker>
        <div class="com-scroll-y">
            <div class="assemble-book">
                <img class="assemble-bg" src="https://static.iberhk.com/v2/web/images/assemble/bg.png">
                <div v-show="showBubble" class="bubble-box">
                    <div class="bubble-1"></div>
                    <div class="bubble-2"></div>
                    <div class="bubble-3"></div>
                    <div class="bubble-4"></div>
                    <div class="bubble-5"></div>
                    <div class="bubble-6"></div>
                    <div class="bubble-7"></div>
                    <div class="bubble-8"></div>
                </div>
                <div class="assemble-book-banner">
                    <img class="assemble-book-banner-img" :src="countDownInfo.img ? countDownInfo.img : 'https://static.iberhk.com/v2/web/images/assemble/banner.png'">
                </div>
                <div class="assemble-book-count-down-box">
                    <ul class="assemble-book-count-down">
                        <li class="count-down-block" v-text="countDownTimeHour" v-cloak></li>
                        <li class="count-down-interval">:</li>
                        <li class="count-down-block" v-text="countDownTimeMinute" v-cloak></li>
                        <li class="count-down-interval">:</li>
                        <li class="count-down-block" v-text="countDownTimeSecond" v-cloak></li>
                    </ul>
                </div>
                <div class="assemble-book-count-down-text">
                    <span class="line"></span>
                    <span>&nbsp;&nbsp;&nbsp;活動結束倒計時&nbsp;&nbsp;&nbsp;</span>
                    <span class="line"></span>
                </div>
                <div class="assemble-book-price-box">
                    <div class="assemble-book-price">
                        <span>拼團價：</span>
                        <span class="assemble-book-price-bold">{{countDownInfo.assemble_price}}</span>
                        <span>HKD</span>
                    </div>
                    <div class="original-price">原價格：<span class="original-price-money">{{countDownInfo.price}}HKD</span></div>
                </div>
                <div v-show="countDownInfo.users && countDownInfo.users.length > 0">
                    <img class="paid-users-notice" src="https://static.iberhk.com/v2/web/images/assemble/notice.png">
                    <ul ref="paidUsers" v-cloak class="paid-users com-scroll-y">
                        <li class="paid-users-block com-nowrap" v-for="(item, index) in countDownInfo.users" :key="index">
                            <span class="paid-users-text">&nbsp;恭喜&nbsp;{{item.username}}&nbsp;&nbsp;+{{item.mobile_pre}}&nbsp;{{item.mobile}}&nbsp;&nbsp;已經拼團成功啦</span>
                        </li>
                    </ul>
                </div>
                <div class="user-info">
                    <ul v-show="countDownTime !== '00:00:00'" v-cloak class="user-info-quota">
                        <li class="user-info-quota-block">當前已拼團：<span>{{countDownInfo.add_people_num}}</span>人</li>
                        <li class="user-info-quota-block" style="text-align: right;">剩餘名額：<span class="user-info-quota-bold">{{countDownInfo.balance_people_num}}</span>人</li>
                    </ul>
                    <input v-show="countDownTime !== '00:00:00'" v-cloak class="user-info-name input-style" type="text" placeholder="請輸入您的姓名" v-model="userInfo.buyer_name" name="userName">
                    <div v-show="countDownTime !== '00:00:00'" v-cloak class="user-info-mobile">
                        <div class="user-info-pre-mobile input-style" @click="showPrePhone">{{userInfo.mobile_pre}}</div>
                        <input class="user-info-mobile-num input-style" type="number" placeholder="請輸入您的手機號" v-model="userInfo.mobile" pattern="[0-9]*" name="userPhone" style="padding-right: 0.3rem;">
                        <img v-show="userInfo.mobile" v-cloak class="user-info-mobile-num-close" src="https://static.iberhk.com/v2/web/images/assemble/close.png" @click="userInfo.mobile = ''">
                    </div>
                    <div v-show="countDownTime === '00:00:00'" v-cloak class="go-assemble-end">當前已拼團{{countDownInfo.add_people_num ? countDownInfo.add_people_num : 0}}人，剩餘名額{{countDownInfo.balance_people_num ? countDownInfo.balance_people_num : 0}}</div>
                    <div v-show="countDownTime !== '00:00:00'" v-cloak class="go-assemble-book" @click="goAssembleBook">去拼團</div>
                    <div v-show="countDownTime === '00:00:00'" v-cloak class="go-assemble-book gray">拼團已滿額</div>
                </div>
                <div v-show="countDownInfo.introduction" v-cloak class="assemble-book-desc">
                    <div class="assemble-book-desc-title">拼團規則說明：</div>
                    <div v-html="countDownInfo.introductionHtml"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SelectPicker from "@/components/shared/component/popup/selectpicker.vue";
import { Toast } from "mint-ui";

import commonJS from '@/components/shared/service/common.js';

export default {
    name: "AssembleBook",
    data() {
        return {
            assemble_uuid: this.$route.query['assemble_uuid'] ? this.$route.query['assemble_uuid'] : (this['urlParams'] ? this.urlParams['assemble_uuid'] : ''),
            showBubble: false,
            isLoaded: true,
            paidUsersScorllTop: 0,
            paidUsersInterval: null,
            countDownTime: '00:00:00',
            countDownTimeHour: '00',
            countDownTimeMinute: '00',
            countDownTimeSecond: '00',
            mobile_pres: ['+852', '+853', '+86'],
            please_select_mobile_pre: "請選擇區號",
            userInfo: {
                buyer_name: '',
                mobile_pre: '+852',
                mobile: ''
            },
            pay_data: {},
            countDownInfo: {},
            share: {
                title: 'iBer Pro 限時拼團特惠',
                thumbImage: '',
                desc: '送：會員專屬教學+個人品牌形象提升服務',
                isReport: true, // 分享上报，不上报可不传
            }
        };
    },
    components: {
        SelectPicker
    },
    created() {
        this.isLoaded = false;
        // 微信内解决键盘收起问题
        document.addEventListener('focusout', (e) => { //软键盘关闭事件
            if (plug.ios && !plug.iphone5) {
                setTimeout(() => {
                    document.body.scrollTop = document.body.scrollHeight + 1;
                });
            }
        });
        this.$root.blueLoadingParams.show = true;
        setTimeout(() => {
            this.showBubble = true;
        }, 2000);
    },
    mounted() {
        this.getCountDownInfo();
    },
    destroyed() {
        clearInterval(this.paidUsersInterval);
    },
    methods: {
        getCountDownInfo() {
            const _this = this;
            this.$http.get('/assemble/api/index', {
                assemble_uuid: this.assemble_uuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.countDownInfo = res.data;
                    this.countDownInfo.introductionHtml = this.countDownInfo.introduction.replace(/\n/g, '<br>');
                    if (this.countDownInfo.balance_people_num > 0) {
                        this.countDown(this.countDownInfo.end_at);
                    }
                    // 微信分享初始化
                    this.share.title = this.countDownInfo.share.title;
                    this.share.thumbImage = this.countDownInfo.share.thumbImage;
                    this.share.desc = this.countDownInfo.share.desc;
                    commonJS.initWX(this.share);
                    this.paidUsersInterval = setInterval(() => {
                        _this.paidUsersScorllTop += 1;
                        if (_this.paidUsersScorllTop >= _this.$refs.paidUsers.scrollHeight) {
                            _this.paidUsersScorllTop = 0;
                        } else {
                            _this.$refs.paidUsers.scrollTop = _this.paidUsersScorllTop;
                        }
                    }, 100);
                }
                setTimeout(() => {
                    this.$root.blueLoadingParams.show = false;
                    _this.isLoaded = true;
                }, 1000);
            }, err => {
                this.$root.blueLoadingParams.show = false;
                this.isLoaded = true;
            })
        },
        countDown(endDate) {
            let times = Date.parse(new Date(endDate.replace(/-/g, '/'))) - Date.parse(new Date());
            const _this = this;
            let timer = null;
            timer = setInterval(() => {
                let hour = 0,
                    minute = 0,
                    second = 0; // 时间默认值
                if (times > 0) {
                    hour = Math.floor(times / (60 * 60) / 1000);
                    minute = Math.floor(times / 60 / 1000) - hour * 60;
                    second = Math.floor(times / 1000) - hour * 60 * 60 - minute * 60;
                }
                hour <= 9 && (hour = '0' + hour);
                minute <= 9 && (minute = '0' + minute);
                second <= 9 && (second = '0' + second);
                _this.countDownTime = hour + ':' + minute + ':' + second;
                _this.countDownTimeHour = hour;
                _this.countDownTimeMinute = minute;
                _this.countDownTimeSecond = second;
                times -= 1000;
            }, 1000);
            if (times <= 0) {
                clearInterval(timer);
            }
        },
        showPrePhone() {
            this.$refs.prePhonePicker.open();
        },
        updatePrePhone(event) {
            this.userInfo.mobile_pre = event;
        },
        createOrder() {
            this.$http.post('/assemble/api/create-order', {
                assemble_uuid: this.assemble_uuid,
                user_name: this.userInfo.buyer_name,
                mobile_pre: this.userInfo.mobile_pre.replace("+", ""),
                mobile: this.userInfo.mobile,
            }).then(res => {
                if (res && res.code === 0) {
                    console.log(res.data);
                    this.pay_data.order_id = res.data.order_id;
                    this.pay_data.total = res.data.smoney;
                    this.pay_data.smoney_cny = res.data.smoney_cny;
                    this.pay_data.rate = this.countDownInfo.rate;
                    this.pay_data.assemble_uuid = res.data.assemble_uuid;
                    this.pay_data.order_uuid = res.data.uuid;
                    window.location.href = window.baseUrl + "/assemble/type?pay_data=" + encodeURIComponent(JSON.stringify(this.pay_data)) + '&share=' + encodeURIComponent(JSON.stringify(this.share)) + '&link=' + encodeURIComponent(window.location.href);
                }
            }, err => {

            })
        },
        goAssembleBook() {
            // 倒计时结束阻止付款
            if (this.countDownTime === "00:00:00") {
                return;
            }
            // 姓名为空时，提示用户
            if (!this.userInfo.buyer_name && !this.userInfo.mobile) {
                Toast({
                    message: "請輸入您的姓名和手機號"
                });
                return;
            }
            // 姓名为空时，提示用户
            if (!this.userInfo.buyer_name) {
                Toast({
                    message: "請輸入您的姓名"
                });
                return;
            }
            // 手机号为空时，提示用户
            if (!this.userInfo.mobile) {
                Toast({
                    message: "請輸入您的手機號"
                });
                return;
            }
            if (this.userInfo.mobile && ((/86/g.test(this.userInfo.mobile_pre) && this.userInfo.mobile.length === 11) || ((/852/g.test(this.userInfo.mobile_pre) || /853/g.test(this.userInfo.mobile_pre)) && this.userInfo.mobile.length === 8))) {
                this.createOrder();
            } else {
                Toast({
                    message: "手機號格式有誤，請重新填寫"
                });
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.assemble-book {
    width: 100%;
    min-height: 100%;
    text-align: center;
    padding: 0 .16rem .16rem .16rem;
    background-color: #fff0db;
}

.assemble-bg {
    width: calc(100% + .32rem);
    position: absolute;
    left: -.16rem;
    top: -.18rem;
}

.assemble-book-banner {
    width: calc(100% + .32rem);
    min-height: 1.88rem;
    left: -.16rem;
}

.assemble-book-banner-img {
    width: 100%;
}

.assemble-book-count-down-box {
    width: 100%;
    height: .48rem;
    margin-top: -.18rem;
    position: relative;
}

.assemble-book-count-down {
    width: 100%;
    height: .48rem;
    position: absolute;
    top: 0;
    left: 0;
}

.count-down-block {
    display: inline-block;
    vertical-align: middle;
    width: .84rem;
    height: .5rem;
    line-height: .47rem;
    background-image: url('https://static.iberhk.com/v2/web/images/assemble/time-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    font-size: .3rem;
    font-weight: bold;
    color: #FFFFFF;
}

.count-down-interval {
    display: inline-block;
    vertical-align: middle;
    font-size: .28rem;
    line-height: .48rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    font-weight: bold;
    margin: -.06rem .02rem 0 .02rem;
}

.assemble-book-count-down-text {
    font-size: .12rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: .15rem;
    opacity: 0.72;
    margin: .08rem 0 .1rem 0;
}

.assemble-book-count-down-text span {
    display: inline-block;
    vertical-align: middle;
}

.assemble-book-count-down-text .line {
    width: .6rem;
    height: .01rem;
    background-color: #FFE5BF;
}

.assemble-book-price-box {
    width: 100%;
    height: .76rem;
    padding-top: .175rem;
    margin-bottom: .12rem;
    background-image: url('https://static.iberhk.com/v2/web/images/assemble/price-bg.png');
    background-size: 100%;
    background-repeat: no-repeat;
}

.assemble-book-price {
    width: 100%;
    font-size: 0.15rem;
    color: #ff4f12;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.18rem;
    margin-bottom: .03rem;
    font-weight: bold;
}

.assemble-book-price-bold {
    font-size: .27rem;
    color: #ff4f12;
    font-weight: bold;
}

.original-price {
    width: 100%;
    font-size: .13rem;
    color: #C37100;
    letter-spacing: 0;
    text-align: center;
    line-height: .16rem;
}

.original-price-money {
    text-decoration: line-through;
}

.paid-users {
    width: 100%;
    max-height: 0.38rem;
    margin-bottom: 0.08rem;
}

.paid-users-block {
    width: 100%;
    height: 0.18rem;
    line-height: 0.18rem;
    font-size: 0.12rem;
    color: #b9761c;
    letter-spacing: 0;
    opacity: 0.72;
    text-align: center;
}

.paid-users-notice {
    display: inline-block;
    vertical-align: middle;
    width: 0.18rem;
    height: 0.18rem;
    position: absolute;
    left: .4rem;
    top: 0rem;
}

.paid-users-text {
    display: inline-block;
    vertical-align: middle;
    min-width: 2.43rem;
    text-align: left;
    margin-left: .28rem;
}

.user-info {
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0 8px 12px 0 #ffdcb6;
    border-radius: 0.08rem;
    padding: 0.2rem;
}

.user-info-quota {
    font-size: 0.13rem;
    color: #CC8E2E;
    letter-spacing: 0;
    line-height: 0.2rem;
    height: 0.2rem;
    margin-bottom: .15rem;
}

.user-info-quota-block {
    width: 50%;
    float: left;
    text-align: left;
    line-height: 0.26rem;
    height: 0.2rem;
}

.user-info-quota-bold {
    font-size: .2rem;
    color: #FF440D;
    line-height: .2rem;
    font-weight: bold;
}

.assemble-book .input-style {
    height: 0.4rem;
    line-height: 0.2rem;
    padding: 0.1rem 0.16rem;
    font-size: 0.16rem;
    color: #323232;
    letter-spacing: 0;
    outline: none;
    background-color: #f6f6f6;
    border-radius: 0.06rem;
    border: none;
}

.user-info-name {
    width: 100%;
    margin-bottom: 0.15rem;
}

.user-info-mobile {
    width: 100%;
    height: 0.4rem;
    margin-bottom: 0.2rem;
}

.user-info-pre-mobile {
    float: left;
    width: 0.9rem;
    text-align: left;
    cursor: pointer;
}

.user-info-pre-mobile:after {
    content: "";
    border: 0.06rem solid transparent;
    border-top: 0.06rem solid #323232;
    position: absolute;
    top: 0.17rem;
    right: 0.15rem;
}

.user-info-mobile-num {
    width: calc(100% - 1.08rem);
    float: right;
}

.user-info-mobile-num-close {
    width: .11rem;
    height: .11rem;
    position: absolute;
    top: .14rem;
    right: .12rem;
    cursor: pointer;
}

.mobile-vaild-tip {
    position: absolute;
    bottom: -.22rem;
    right: .2rem;
    font-size: .12rem;
    color: #FF440D;
    letter-spacing: 0;
    line-height: .15rem;
}

.go-assemble-end {
    font-size: .15rem;
    color: #FF440D;
    letter-spacing: 0;
    line-height: .18rem;
    margin-bottom: .2rem;
}

.go-assemble-book {
    cursor: pointer;
    width: 100%;
    height: 0.43rem;
    line-height: 0.43rem;
    background-image: linear-gradient(-270deg, #ff9700 0%, #ffb000 100%);
    border-radius: 0.215rem;
    font-size: 0.16rem;
    color: #ffffff;
    letter-spacing: 0;
    font-weight: bold;
    margin: 0rem 0 0.05rem 0;
    box-shadow: 0 6px 8px 0 #ffdcb6;
}

.go-assemble-book.gray {
    background-image: linear-gradient(-270deg, #999999 0%, #999999 100%);
    box-shadow: 0 0 0 0 transparent;
    margin-bottom: 0;
}

.assemble-book-desc {
    width: 100%;
    text-align: left;
    font-size: 0.14rem;
    color: #e8a13a;
    letter-spacing: 0;
    line-height: 0.19rem;
    margin-top: 0.12rem;
    word-break: break-all;
    word-wrap: break-word;
    padding-bottom: .48rem;
}

.assemble-book-desc-title {
    font-weight: bold;
    margin-bottom: 0.03rem;
    color: #f39c29;
}

.bubble-box {
    width: 100%;
    height: 3rem;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
}

.bubble-1 {
    width: .15rem;
    height: .15rem;
    background-image: url('https://static.iberhk.com/v2/web/images/assemble/bubble1.png');
    background-size: 100%;
    background-repeat: no-repeat;
    animation: bubble-rise 10s infinite linear;
    position: absolute;
    left: 10%;
    top: 26%;
}

.bubble-2 {
    width: .25rem;
    height: .25rem;
    background-image: url('https://static.iberhk.com/v2/web/images/assemble/bubble2.png');
    background-size: 100%;
    background-repeat: no-repeat;
    animation: bubble-rise 12s infinite ease;
    position: absolute;
    left: 0%;
    top: 50%;
}

.bubble-3 {
    width: .20rem;
    height: .20rem;
    background-image: url('https://static.iberhk.com/v2/web/images/assemble/bubble3.png');
    background-size: 100%;
    background-repeat: no-repeat;
    animation: bubble-rise 8s infinite ease-in;
    position: absolute;
    left: 15%;
    top: 40%;
}

.bubble-4 {
    width: .26rem;
    height: .26rem;
    background-image: url('https://static.iberhk.com/v2/web/images/assemble/bubble4.png');
    background-size: 100%;
    background-repeat: no-repeat;
    animation: bubble-rise 9s infinite ease-out;
    position: absolute;
    left: 4%;
    top: 10%;
}

.bubble-5 {
    width: .79rem;
    height: .79rem;
    background-image: url('https://static.iberhk.com/v2/web/images/assemble/bubble5.png');
    background-size: 100%;
    background-repeat: no-repeat;
    animation: bubble-rise 12s infinite ease-in-out;
    position: absolute;
    left: auto;
    right: -11%;
    top: 46%;
}

.bubble-6 {
    width: .25rem;
    height: .25rem;
    background-image: url('https://static.iberhk.com/v2/web/images/assemble/bubble6.png');
    background-size: 100%;
    background-repeat: no-repeat;
    animation: bubble-rise 8s infinite linear;
    position: absolute;
    left: auto;
    right: 2%;
    top: 4%;
}

.bubble-7 {
    width: .17rem;
    height: .17rem;
    background-image: url('https://static.iberhk.com/v2/web/images/assemble/bubble7.png');
    background-size: 100%;
    background-repeat: no-repeat;
    animation: bubble-rise 10s infinite ease-in;
    position: absolute;
    left: auto;
    right: 8%;
    top: 34%;
}

.bubble-8 {
    width: .76rem;
    height: .76rem;
    background-image: url('https://static.iberhk.com/v2/web/images/assemble/bubble8.png');
    background-size: 100%;
    background-repeat: no-repeat;
    animation: bubble-rise 13s infinite linear;
    position: absolute;
    left: auto;
    right: 13%;
    top: 75%;
}

@keyframes bubble-rise {
    0% {
        top: 100%;
        opacity: .3;
    }
    100% {
        top: -30%;
        opacity: 1;
    }
}
</style>


<style>
input::-webkit-inner-spin-button {
    margin-top: 0.065rem;
    display: none;
}

input::-webkit-input-placeholder {
    color: #bbbbbb;
    font-weight: normal;
}

input:-moz-placeholder {
    color: #bbbbbb;
    font-weight: normal;
}

input::-moz-placeholder {
    color: #bbbbbb;
    font-weight: normal;
}

input:-ms-input-placeholder {
    color: #bbbbbb;
    font-weight: normal;
}
</style>
