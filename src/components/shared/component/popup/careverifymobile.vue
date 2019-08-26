/* 
<care-verify-mobile ref="careVerifyMobile" @updateConfirmMobile="updateConfirmMobile"></care-verify-mobile>
import CareVerifyMobile from "@/components/shared/component/popup/careverifymobile.vue";
components: {
    CareVerifyMobile
}

调用：this.$refs.careVerifyMobile.open();
*/

<template>
    <div v-show="showPicker" class="popup-picker-content">
        <!-- 手机号前缀选择器 -->
        <select-picker ref="prePhonePicker" :data="mobile_pres" :default="mobileInfo.area + mobileInfo.mobile_pre" :title="selectMobilePreTip" @updateData="updatePrePhone"></select-picker>
        <div class="popup-picker-bg"></div>
        <div id="popupPicker" class="popup-picker" :style="slideStyle">
            <div class="popup-picker-title">{{simply ? '就诊人手机号码验证' : '就診人手機號碼驗證'}}</div>
            <div class="popup-picker-desc">{{simply ? '我们将为您的隐私进行严格保密' : '我們將為您的私隱進行嚴格保密'}}</div>
            <div class="mobile-box">
                <div class="mobile-box-block">
                    <div class="mobile-pre" @click="showPrePhonePicker">
                        <span>{{mobileInfo.mobile_pre}}</span>
                        <i class="iconfonti mobile-pre-arraw">&#xe669;</i>
                    </div>
                    <input ref="mobileInput" class="mobile-input" type="text" v-model="mobileInfo.mobile" pattern="[0-9]*" name="mobile" maxlength="20" :placeholder="selectMobileTip">
                    <div class="separate-horizontal-line"></div>
                </div>
                <div class="mobile-box-block">
                    <input class="code-input" type="text" v-model="mobileInfo.code" pattern="[0-9]*" name="mobileCode" maxlength="4" :placeholder="selectCodeTip">
                    <div v-if="codeState" class="phone-code" @click="getCode">{{codeAgainState ? (simply ? '重新获取' : '重新獲取') : (simply ? '获取验证码' : '獲取驗證碼')}}</div>
                    <div v-else class="code-second">{{second}}s</div>
                    <div class="separate-horizontal-line"></div>
                </div>
            </div>
            <div class="confirm-btn" @click="confirmChange">{{simply ? '确定' : '確定'}}</div>
        </div>
    </div>
</template>

<script>
import CommonJS from "@/components/shared/service/common.js";

import SelectPicker from "@/components/shared/component/popup/selectpicker.vue";

export default {
    name: "CareVerifyMobile",
    props: {
      value: Boolean,
        title: {
            type: String,
            default: function() {
                return '';
            }
        },
    },
    data() {
        return {
            showPicker: false,
            slideStyle: {},
            mobile_pres: [(this.simply ? '中国' : '中國') + '+86', '香港+852', (this.simply ? '澳门' : '澳門') + '+853'],
            mobileInfo: {
                mobile_pre: '+86',
                mobile: '',
                area: this.simply ? '中国' : '中國',
                code: '',
            },
            second: 60,
            codeState: true,
            codeAgainState: false,
            selectMobileTip: this.simply ? '请输入手机号' : '請輸入手機號',
            selectMobilePreTip: this.simply ? '请选择区号' : '請選擇區號',
            selectCodeTip: this.simply ? '输入验证码' : '輸入驗證碼',
        };
    },
    created() {
    },
    watch: {
        show: {
            handler: function(value, oldvalue) {

            }
        }
    },
    components: {
        SelectPicker
    },
    mounted() {

    },
    methods: {
        open() {
            // 验证本地缓存手机验证码
            if (localStorage.getItem('care_verify_mobile') && localStorage.getItem('care_verify_mobile_pre') && localStorage.getItem('care_verify_code')) {
                this.$http.post('iber-care/verify-sms-code', {
                    mobile: localStorage.getItem('care_verify_mobile'),
                    mobile_pre: localStorage.getItem('care_verify_mobile_pre'),
                    code: localStorage.getItem('care_verify_code'),
                }).then((res) => {
                    if (res && res.code === 0) {
                        setTimeout(() => {
                            this.$emit('updateConfirmMobile', {
                                mobile: localStorage.getItem('care_verify_mobile'),
                                mobile_pre: localStorage.getItem('care_verify_mobile_pre'),
                                code: localStorage.getItem('care_verify_code')
                            });
                        }, 300);
                    } else {
                        this.showPicker = true;
                        setTimeout(() => {
                            this.slideStyle = {
                                transform: 'scale(1)'
                            };
                        }, 30);
                        document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'hidden');
                    }
                });
            } else {
                this.showPicker = true;
                setTimeout(() => {
                    this.slideStyle = {
                        transform: 'scale(1)'
                    };
                }, 30);
                document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'hidden');
            }
        },
        close() {
            this.slideStyle = {
                transform: 'scale(0)'
            };
            setTimeout(() => {
                this.showPicker = false;
            }, 300);
            document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'auto');
        },
        // 展示区号选择器
        showPrePhonePicker() {
            this.$refs.prePhonePicker.open();
        },
        // 更新区号
        updatePrePhone(event) {
            // this.preSelectDefalut = event;
            if (/\+852/.test(event)) {
                this.mobileInfo.mobile_pre = '+852';
                this.mobileInfo.area = '香港';
            } else if (/\+853/.test(event)) {
                this.mobileInfo.mobile_pre = '+853';
                this.mobileInfo.area = this.simply ? '澳门' : '澳門';
            } else if (/\+86/.test(event)) {
                this.mobileInfo.mobile_pre = '+86';
                this.mobileInfo.area = this.simply ? '中国' : '中國';
            }
        },
        // 获取验证码
        getCode() {
            let area = this.mobileInfo.mobile_pre.split("+");
            // 无区号提示
            if (!area[1]) {
                this.$toast(this.simply ? "请选择区号" : "請選擇區號");
                return;
            }
            // 无手机号码提示
            if (!this.mobileInfo.mobile) {
                this.$toast(this.simply ? "请输入手机号" : "請輸入手機號");
                return;
            }
            this.$http.post('/iber-care/care-sms-code', {
                mobile_pre: this.mobileInfo.mobile_pre.replace(/\+/, ''),
                mobile: this.mobileInfo.mobile,
                type: 'IBERCARE_AUTH_CODE'
            }).then((res) => {
                if (res && res.code === 0) {
                    //业务模型 
                    this.$toast(this.simply ? "验证码已发送" : "驗證碼已發送");
                    this.codeState = false;
                    let time = 60;
                    this.codeInterval = window.setInterval(() => {
                        if (time == 0) {
                            this.second = 60;
                            this.codeState = true;
                            this.codeAgainState = true;
                            window.clearInterval(this.codeInterval);
                            return;
                        }
                        time--;
                        this.second = time;
                    }, 1000);
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        // 确认方法
        confirmChange() {
            if (!this.mobileInfo.code) {
                this.$toast(plug.sm(this.simply, "请输入验证码"));
                return;
            }

            if (this.mobileInfo.code.length != 4) {
                this.$toast(plug.sm(this.simply, "验证码格式错误"));
                return;
            }

            // 验证手机验证码
            this.$http.post('iber-care/verify-sms-code', {
                mobile: this.mobileInfo.mobile,
                mobile_pre: this.mobileInfo.mobile_pre.replace(/\+/, ''),
                code: this.mobileInfo.code,
            }).then((res) => {
                if (res && res.code === 0) {
                    localStorage.setItem('care_verify_mobile', this.mobileInfo.mobile);
                    localStorage.setItem('care_verify_mobile_pre', this.mobileInfo.mobile_pre.replace(/\+/, ''));
                    localStorage.setItem('care_verify_code', this.mobileInfo.code);
                    this.close();
                    setTimeout(() => {
                        this.$emit('updateConfirmMobile', {
                            mobile: this.mobileInfo.mobile,
                            mobile_pre: this.mobileInfo.mobile_pre.replace(/\+/, ''),
                            code: this.mobileInfo.code
                        });
                    }, 300);
                } else {
                    this.$toast(res.msg);
                }
            });
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.popup-picker-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-picker-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.popup-picker {
    background-color: #fff;
    width: calc(100% - .48rem);
    min-height: 1.85rem;
    border-radius: .08rem;
    transition: all 300ms;
    transform: scale(1);
    padding: .24rem;
}

input {
    outline: none;
    border: none;
}

input::-webkit-input-placeholder {
    font-size: .17rem;
    color: #BBBBBB;
}

input:-moz-placeholder {
    font-size: .17rem;
    color: #BBBBBB;
}

input::-moz-placeholder {
    font-size: .17rem;
    color: #BBBBBB;
}

input:-ms-input-placeholder {
    font-size: .17rem;
    color: #BBBBBB;
}

input:-internal-autofill-selected {
    background-color: rgb(255, 255, 255) !important;
}

.popup-picker-title {
    font-family: PingFangSC-Medium;
    font-size: .18rem;
    color: #2A2A2A;
    text-align: center;
    line-height: .22rem;
}

.popup-picker-desc {
    font-family: PingFangSC-Medium;
    font-size: .14rem;
    color: #999999;
    text-align: center;
    line-height: .2rem;
    margin-top: .06rem;
}

.mobile-box {
    margin-top: .12rem;
    width: 100%;
}

.mobile-box-block {
    width: 100%;
    height: .46rem;
    line-height: .46rem;
    font-size: .17rem;
    overflow: hidden;
    margin-top: .12rem;
}

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

.mobile-pre {
    float: left;
    height: .46rem;
    cursor: pointer;
}

.mobile-pre-arraw {
    font-size: .1rem;
}

.mobile-input {
    float: left;
    width: calc(100% - .8rem);
    height: .28rem;
    line-height: .28rem;
    font-size: .17rem;
    margin-top: .09rem;
    padding: 0 .12rem;
}

.code-input {
    float: left;
    width: calc(100% - .94rem);
    height: .28rem;
    line-height: .28rem;
    font-size: .17rem;
    margin-top: .09rem;
}

.phone-code {
    float: right;
    color: #999999;
    line-height: .28rem;
    width: .84rem;
    cursor: pointer;
    text-align: center;
    background: #3364E4;
    border-radius: .14rem;
    font-size: .12rem;
    color: #FFFFFF;
    margin-top: .09rem;
}

.code-second {
    float: right;
    width: .94rem;
    font-size: .17rem;
    color: #CCCCCC;
    text-align: right;
    line-height: .46rem;
}

.confirm-btn {
    width: 100%;
    background: #3364E4;
    height: .4rem;
    line-height: .4rem;
    border-radius: .2rem;
    font-size: .15rem;
    color: #FFFFFF;
    text-align: center;
    margin-top: .24rem;
}
</style>
