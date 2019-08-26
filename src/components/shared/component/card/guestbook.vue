<template>
    <div v-if="params.show" class="guest-book">
        <!-- 手机号前缀选择器 -->
        <select-picker ref="prePhonePicker" :data="mobile_pres" :default="preSelectDefalut" :title="simply ? '请选择区号' : '請選擇區號'" @updateData="updatePrePhone"></select-picker>
        <div class="com-mask-frame com-flex com-wechat-id">
            <div class="aux-mask" @click="close"></div>
            <!-- 微信二维码弹窗 -->
            <div v-show="wechatDialog.show" class="popup-qrcode-box" :class="{comBlast: wechatDialog.slide}">
                <i @click="close" class="iconfonti close-icon">&#xe628;</i>
                <header class="popup-qrcode-title">
                    <span>{{simply ? '顾问微信' : '顧問WeChat'}}</span>
                </header>
                <div class="popup-qrcode-desc">
                    <span>{{simply ? '添加微信好友咨询更多讯息' : '添加WeChat好友諮詢更多訊息'}}</span>
                </div>
                <div v-if="params.wx_qrcode" class="popup-qrcode-img-box">
                    <i class="iconfonti popup-qrcode-top-left">&#xe7d3;</i>
                    <i class="iconfonti popup-qrcode-top-right">&#xe7d3;</i>
                    <i class="iconfonti popup-qrcode-bottom-left">&#xe7d3;</i>
                    <i class="iconfonti popup-qrcode-bottom-right">&#xe7d3;</i>
                    <img id="button_qrcode" class="popup-qrcode-img" :src="params.wx_qrcode" @touchstart="gtouchstart()" @touchmove="gtouchmove()" @touchend="gtouchend()">
                </div>
                <p class="press-qrcode" v-if="params.wx_qrcode && plug.wx.platform && !$root.isMiniProgram">{{simply ? '微信内长按识别二维码' : 'WeChat內長按識別二維碼'}}</p>
                <p class="press-qrcode" v-if="params.wx_qrcode && (!plug.wx.platform || $root.isMiniProgram)">{{simply ? '长按保存二维码添加好友' : '長按保存二維碼添加好友'}}</p>
                <aside class="wechat-num" v-if="params.wechat_num">
                    <span>WeChat: </span>
                    <span>{{params.wechat_num}}</span>
                    <span id="button_copyid" class="copy-text" @click="copyWechatID" :data-clipboard-text="params.wechat_num">{{simply ? '复制' : '複製'}}</span>
                </aside>
                <div id="button_callmeback" class="phone-entry" @click="goGuestBook()">{{simply ? '请顾问联系我' : '請顧問聯絡我'}}</div>
            </div>
            <!-- 留言弹窗 -->
            <div v-show="guestBookDialog.show" class="popup-guest-book-box" :class="{comBlast: guestBookDialog.slide}">
                <i @click="close" class="iconfonti close-icon">&#xe628;</i>
                <div class="guest-book-top">
                    <img src="https://static.iberhk.com/v2/web/images/common/guest-book.png">
                    <span class="title">{{simply ? '留言给顾问' : '留言給顧問'}}</span>
                    <span class="desc">{{simply ? '为了您的权益，您的私隐将严格保密' : '為了您的權益，您的私隱將嚴格保密'}}</span>
                </div>
                <div class="guest-book-bottom">
                    <div class="guest-book-title">我的留言</div>
                    <textarea id="guestBookMessage" class="guest-book-textarea" v-model="message.content" name="guestBookMessage" maxlength="200" :placeholder="simply ? '请输入您想咨询的内容，顾问会尽快联系您' : '請輸入您想諮詢的內容，顧問會盡快联络您'"></textarea>
                    <div class="guest-book-title">{{simply ? '联系手机号' : '联络手機號'}}</div>
                    <div v-if="!existPhone" class="phone-box">
                        <div class="phone-pre" @click="showPrePhone">{{message.mobile_pre}}</div>
                        <input class="guest-book-input" type="text" v-model="message.mobile" pattern="[0-9]*" name="userPhone" maxlength="20" :placeholder="simply ? '请输入您的手机号' : '請輸入您的手機號'">
                    </div>
                    <div v-if="!existPhone" class="phone-box">
                        <input class="guest-book-input code-input" type="text" v-model="message.code" pattern="[0-9]*" name="phoneCode" maxlength="4" :placeholder="simply ? '请输入验证码' : '請輸入驗證碼'">
                        <div v-show="codeState" class="phone-code" @click="getCode">{{codeAgainState ? (simply ? '重新获取' : '重新獲取') : (simply ? '获取验证码' : '獲取驗證碼')}}</div>
                        <div v-show="!codeState" class="code-second">{{second}}s</div>
                    </div>
                    <div v-if="existPhone" class="phone-box old-phone-box">
                        <span>{{message.mobile_pre}} {{message.mobile}}</span>
                        <div class="phone-code change-phone" @click="changePhone">更改</div>
                    </div>
                    <div id="button_callmebackdefine" class="send-button" @click="sendMessage">{{simply ? '发送' : '發送'}}</div>
                    <div v-if="params.wx_qrcode || params.wechat_num" class="phone-entry" @click="goAgentWechat">{{simply ? '添加顾问微信' : '添加顧問WeChat'}}</div>
                </div>
            </div>
            <!-- 发送成功提示弹窗 -->
            <div v-show="successDialog.show" class="success-dialog" :class="{comBlast: successDialog.slide}">
                <i @click="close" class="iconfonti close-icon">&#xe628;</i>
                <i class="iconfonti success-icon">&#xe728;</i>
                <div class="success-title">{{simply ? '发送成功' : '發送成功'}}</div>
                <div class="success-desc">
                    <div>{{simply ? '健康顾问会尽快联系你' : '健康顧問會盡快聯繫你'}}</div>
                    <div v-if="params.wx_qrcode || params.wechat_num">{{simply ? '你也可以添加健康顾问为微信好友' : '你也可以添加健康顧問為WeChat好友'}}</div>
                </div>
                <div id="button_callmebackdefine_WeChatmessage" v-if="params.wx_qrcode || params.wechat_num" class="add-wechat-btn" @click="goAgentWechat('success')">{{simply ? '添加顾问微信' : '添加顧問WeChat'}}</div>
                <div id="button_callmebackdefine_talk" class="go-chat-btn" @click="goConsultAgent">{{simply ? '进入即时聊天' : '進入即時聊天'}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import Clipboard from "clipboard";

import FunctionJS from '@/components/shared/service/function.js';

import SelectPicker from "@/components/shared/component/popup/selectpicker.vue";

export default {
    name: "GuestBook",
    props: {
        params: {
            type: Object,
            default: function() {
                return {
                    show: false,
                    slide: false
                };
            }
        }
    },
    watch: {
        "params.show": function(val, oldVal) {
            if (val) {
                this.open();
            } else {
                this.close();
            }
        }
    },
    components: {
        SelectPicker,
    },
    data: function() {
        return {
            show: false,
            slide: false,
            mobile_pres: ['香港 +852', (this.simply ? '澳门' : '澳門') + ' +853', (this.simply ? '中国大陆' : '中國大陸') + ' +86'],
            preSelectDefalut: '香港 +852',
            message: {
                content: '',
                mobile_pre: '+852',
                mobile: '',
                code: ''
            },
            second: 60,
            codeInterval: null,
            codeState: true,
            existPhone: false,
            codeAgainState: false,
            wechatDialog: {
                show: false,
                slide: false,
            },
            guestBookDialog: {
                show: false,
                slide: false,
            },
            successDialog: {
                show: false,
                slide: false,
            }
        };
    },
    created() {
        // 微信内解决键盘收起问题
        document.addEventListener('focusout', (e) => { //软键盘关闭事件
            if (plug.ios && !plug.iphone5) {
                setTimeout(() => {
                    document.body.scrollTop = document.body.scrollHeight + 1;
                });
            }
        });
    },
    mounted() {

    },
    methods: {
        // 关闭留言弹窗
        close() {
            this.closeWechatDialog();
            this.closeGuestBookDialog();
            this.closeSuccessDialog();
            window.setTimeout(() => {
                this.params.show = false;
            }, 100);
        },
        // 打开留言弹窗
        open() {
            this.message.content = '';
            this.params.show = true;
            if (this.params.wx_qrcode || this.params.wechat_num) {
                this.viewWechat();
                this.openWechatDialog();
            } else {
                this.openGuestBookDialog();
            }
        },
        // 咨询点开微信二维码上报
        viewWechat() {
            console.log(window.shareParam);
            this.$http.post('/behavior/view-wechat', window.shareParam).then(res => {});
        },
        // 打开微信弹窗
        openWechatDialog() {
            window.setTimeout(() => {
                this.wechatDialog.show = true;
                window.setTimeout(() => {
                    this.wechatDialog.slide = true;
                }, 100);
            }, 100);
        },
        // 关闭微信弹窗
        closeWechatDialog() {
            this.wechatDialog.slide = false;
            window.setTimeout(() => {
                this.wechatDialog.show = false;
            }, 100);
        },
        // 打开留言弹窗
        openGuestBookDialog() {
            // 重新打开时可以重新获取验证码
            this.second = 60;
            this.codeState = true;
            this.codeAgainState = false;
            window.clearInterval(this.codeInterval);
            this.message.content = '';
            this.judgeUserPhone();
            window.setTimeout(() => {
                this.guestBookDialog.show = true;
                window.setTimeout(() => {
                    this.guestBookDialog.slide = true;
                }, 100);
            }, 100);
        },
        // 关闭留言弹窗
        closeGuestBookDialog() {
            this.guestBookDialog.slide = false;
            window.setTimeout(() => {
                this.guestBookDialog.show = false;
            }, 100);
        },
        // 打开成功提示弹窗
        openSuccessDialog() {
            window.setTimeout(() => {
                this.successDialog.show = true;
                window.setTimeout(() => {
                    this.successDialog.slide = true;
                }, 100);
            }, 100);
        },
        // 打开成功提示弹窗
        closeSuccessDialog() {
            this.successDialog.slide = false;
            window.setTimeout(() => {
                this.successDialog.show = false;
            }, 100);
        },
        // 展示区号选择器
        showPrePhone() {
            this.$refs.prePhonePicker.open();
        },
        // 更新区号
        updatePrePhone(event) {
            this.preSelectDefalut = event;
            if (/\+852/.test(event)) {
                this.message.mobile_pre = '+852';
            } else if (/\+853/.test(event)) {
                this.message.mobile_pre = '+853';
            } else if (/\+86/.test(event)) {
                this.message.mobile_pre = '+86';
            }

        },
        // 跳转微信二维码
        goAgentWechat(type) {
            if (type === 'success') {
                // 发送留言成功后添加顾问微信埋点
                FunctionJS.youmengTrackEvent('立即咨询弹框', '立即咨询弹框-发送留言成功后添加顾问微信', this.$root.agentCardInfo.nickname + this.$root.agentCardInfo.mobile, '', 'button_callmebackdefine_WeChatmessage');
            }
            this.closeGuestBookDialog();
            this.closeSuccessDialog();
            this.openWechatDialog();
        },
        // 進入即時聊天
        goConsultAgent() {
            let params = {
                user_uuid: this.userUuid,
                answer_uuid: this.$root.agentCardInfo.targetUuid,
                from_type: this.$root.fromType
            }
            console.log(JSON.stringify(params));

            params['object'] = this;
            // 进入即时聊天埋点
            FunctionJS.youmengTrackEvent('立即咨询弹框', '立即咨询弹框-进入即时聊天', this.$root.agentCardInfo.nickname + this.$root.agentCardInfo.mobile, '', 'button_callmebackdefine_talk');
            plug.authAddress(params);
        },
        // 更改手机号
        changePhone() {
            this.existPhone = false;
            this.message.mobile = '';
            this.message.code = '';
        },
        // 判断有无登陆态
        judgeUserPhone() {
            this.getRootUserInfo().then(res => {
                //重置登录态
                if (this.rootUserInfo['c_user_uuid']) {
                    this.$http.post('/c-user/whether-need-auth-mobile', {
                        c_user_uuid: this.rootUserInfo['c_user_uuid']
                    }).then((res) => {
                        if (res && res.code === 0) {
                            if (res.data['mobile']) {
                                this.existPhone = true;
                                this.message.mobile = res.data['mobile'];
                                this.message.mobile_pre = '+' + res.data['mobile_pre'];
                            }
                        }
                    });
                } else {
                    this.existPhone = false;
                }
            });
        },
        // 获取验证码
        getCode() {
            let area = this.message.mobile_pre.split("+");
            // 无区号提示
            if (!area[1]) {
                this.$toast(this.simply ? "请选择区号" : "請選擇區號");
                return;
            }
            // 无手机号码提示
            if (!this.message.mobile) {
                this.$toast(this.simply ? "请填写手机号" : "請填寫手機號");
                return;
            }
            this.$http.post('/c-user/mobile-declaration-validate-code', {
                mobile_pre: area[1],
                mobile: this.message.mobile
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
        // 发送留言板
        sendMessage() {
            // 无留言提示
            if (!this.message.content) {
                this.$toast(this.simply ? "留言不能为空" : "留言不能為空");
                return;
            }
            // 无区号提示
            if (!this.message.mobile_pre.split("+")[1]) {
                this.$toast(this.simply ? "请选择区号" : "請選擇區號");
                return;
            }
            // 无手机号码提示
            if (!this.message.mobile) {
                this.$toast(this.simply ? "请填写手机号" : "請填寫手機號");
                return;
            }
            // 无验证码
            if (!this.existPhone && !this.message.code) {
                this.$toast(this.simply ? "请填写验证码" : "請填寫驗證碼");
                return;
            }
            let param = JSON.parse(JSON.stringify(window.shareParam));
            param.message_content = this.message.content;
            !this.existPhone && (param.mobile = this.message.mobile);
            !this.existPhone && (param.mobile_pre = this.message.mobile_pre.split("+")[1]);
            !this.existPhone && (param.code = this.message.code);
            this.$http.post('/c-user/guestbook', param).then((res) => {
                if (res && res.code === 0) {
                    // 请顾问联络我-发送 埋点
                    FunctionJS.youmengTrackEvent('立即咨询弹框', '立即咨询弹框-请顾问联络我-发送', this.$root.agentCardInfo.nickname + this.$root.agentCardInfo.mobile, '', 'button_callmebackdefine');
                    // 弹出提示弹窗
                    this.closeGuestBookDialog();
                    this.closeWechatDialog();
                    this.openSuccessDialog();
                    // 重置登陆态
                    let curTime = new Date().getTime();
                    let userInfo = res.data;
                    let platformString = 'IBER_BS_USER_INFO-';
                    if (this.isWeiXin && this.isWeiXinTools) {
                        // 微信内静默授权
                        if (window.auth !== 'force') {
                            platformString = 'IBER_BS_USER_INFO-';
                        } else {
                            // 微信内强制授权
                            platformString = 'IBER_WX_USER_INFO-';
                        }
                    } else if (this.isFb) {
                        // facebook内
                        platformString = 'IBER_FB_USER_INFO-';
                    } else {
                        // 普通浏览器内
                        platformString = 'IBER_BS_USER_INFO-';
                    }
                    // 重置缓存
                    localStorage.setItem(platformString + this.userUuid, JSON.stringify({
                        data: userInfo,
                        time: curTime
                    }));
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        // 复制微信号
        copyWechatID() {
            // 复制微信号埋点
            FunctionJS.youmengTrackEvent('立即咨询弹框', '立即咨询弹框-复制WeChat ID', this.$root.agentCardInfo.nickname + this.$root.agentCardInfo.mobile, '', 'button_copyid');

            if (!this.params.wechat_num) {
                this.$toast(this.simply ? "微信ID不存在或无效" : "WeChat ID不存在或無效");
                return;
            }
            const clipboard = new Clipboard("#button_copyid");
            clipboard.on("success", (e) => {
                this.$toast(this.simply ? "已复制微信号，去微信搜索添加" : "已複製WeChat ID，去WeChat搜索添加");
            });
            clipboard.on("error", (e) => {
                this.$toast(this.simply ? "复制失败，请重新复制" : "複製失敗，請重新複製");
                clipboard.destroy();
            });
        },
        // 留言弹窗
        goGuestBook() {
            // 请顾问联络我埋点
            FunctionJS.youmengTrackEvent('立即咨询弹框', '立即咨询弹框-请顾问联络我', this.$root.agentCardInfo.nickname + this.$root.agentCardInfo.mobile, '', 'button_callmeback');

            this.closeWechatDialog();
            this.openGuestBookDialog();
        },
        //开始按   
        gtouchstart() {
            // 这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
            this.timeOutEvent = setTimeout(this.longPress(), 500);
            return false;
        },
        // 手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件   
        gtouchend() {
            clearTimeout(this.timeOutEvent); //清除定时器   
            if (this.timeOutEvent != 0) {
                //这里写要执行的内容（尤如onclick事件）   
                console.log("你这是点击，不是长按");
            }
            return false;
        },
        //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按  
        gtouchmove() {
            clearTimeout(this.timeOutEvent); //清除定时器   
            this.timeOutEvent = 0;
        },
        //真正长按后应该执行的内容   
        longPress() {
            this.timeOutEvent = 0;
            //执行长按要执行的内容，如弹出菜单   
            console.log("长按事件触发发");
            // 长按QR Code埋点
            FunctionJS.youmengTrackEvent('立即咨询弹框', '立即咨询弹框-长按QR Code', this.$root.agentCardInfo.nickname + this.$root.agentCardInfo.mobile, '', 'button_qrcode');
        }
    },
};
</script>

<style scoped>
.guest-book {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.popup-qrcode-box,
.popup-guest-book-box,
.success-dialog {
    position: relative;
    width: 3.28rem;
    min-height: .32rem;
    background: #FFFFFF;
    border-radius: .12rem;
    transform: scale(0);
    transition: all 100ms;
    text-align: center;
    margin-bottom: .42rem;
}

.popup-qrcode-box {
    width: 2.64rem;
    padding: .24rem;
}

.success-dialog {
    width: 2.95rem;
    padding: .32rem 0;
}

.comBlast {
    visibility: visible;
    transform: scale(1);
}

.close-icon {
    position: absolute;
    font-size: 0.26rem;
    line-height: 0.13rem;
    bottom: -.32rem;
    left: 50%;
    transform: translateX(-50%);
    color: #FFFFFF;
    cursor: pointer;
}

.guest-book-top {
    width: 100%;
    height: .8rem;
    border-radius: .12rem .12rem 0 0;
    overflow: hidden;
    position: relative;
}

.guest-book-top img {
    width: 100%;
    height: .8rem;
}

.guest-book-top .title {
    font-size: .22rem;
    color: #FFFFFF;
    line-height: .27rem;
    position: absolute;
    left: 1.16rem;
    top: .175rem;
    font-weight: bold;
}

.guest-book-top .desc {
    font-size: .12rem;
    color: #FFFFFF;
    line-height: .15rem;
    position: absolute;
    left: 1.16rem;
    top: .475rem;
    opacity: 0.7;
}

.guest-book-bottom {
    padding: .16rem .16rem .2rem .16rem;
}

.guest-book-title {
    font-size: .14rem;
    color: #2A2A2A;
    line-height: .17rem;
    margin-bottom: .08rem;
    text-align: left;
    font-weight: bold;
}

textarea::-webkit-input-placeholder {
    color: #CCCCCC;
}

input::-webkit-input-placeholder {
    color: #CCCCCC;
}

.guest-book-textarea {
    background-color: #F6F6F6;
    border-radius: .08rem;
    padding: .08rem .12rem;
    font-size: .15rem;
    color: #2A2A2A;
    line-height: .2rem;
    height: .8rem;
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    margin-bottom: .08rem;
    font-family: PingFangSC-Light, Roboto, HelveticaNeue, Helvetica, Arial, sans-serif;
}

.phone-box {
    background-color: #F6F6F6;
    border-radius: .08rem;
    height: .44rem;
    font-size: .15rem;
    color: #2A2A2A;
    line-height: .44rem;
    margin-bottom: .12rem;
    overflow: hidden;
}

.old-phone-box {
    text-align: left;
    padding-left: .12rem;
    color: #999999;
}

.phone-pre {
    position: relative;
    width: .68rem;
    float: left;
    text-align: left;
    padding-left: .12rem;
    cursor: pointer;
}

.phone-pre:after {
    content: "";
    border: 0.04rem solid transparent;
    border-top: 0.04rem solid #2A2A2A;
    position: absolute;
    top: 0.2rem;
    right: 0.06rem;
}

.guest-book-input {
    float: left;
    width: calc(100% - .78rem);
    height: .22rem;
    line-height: .22rem;
    font-size: .15rem;
    color: #2A2A2A !important;
    border: none;
    outline: none;
    background-color: #F6F6F6 !important;
    padding: 0 .12rem;
    font-family: PingFangSC-Light, Roboto, HelveticaNeue, Helvetica, Arial, sans-serif;
    margin-top: .11rem;
}

.code-input {
    width: calc(100% - .94rem);
}

.phone-code {
    float: right;
    font-size: .14rem;
    color: #3364E4;
    line-height: .44rem;
    width: .94rem;
    cursor: pointer;
}

.change-phone {
    text-align: right;
    padding-right: .12rem;
}

.code-second {
    float: right;
    width: .94rem;
    font-size: .14rem;
    color: #CCCCCC;
    text-align: right;
    line-height: .44rem;
    padding-right: .12rem;
}

.send-button {
    display: inline-block;
    width: 1.8rem;
    height: .4rem;
    line-height: .4rem;
    background: #3364E4;
    box-shadow: 0 .04rem .08rem 0 rgba(51, 100, 228, 0.32);
    border-radius: .2rem;
    font-size: .16rem;
    color: #FFFFFF;
    text-align: center;
    margin-top: .08rem;
    cursor: pointer;
}

.phone-entry {
    width: 100%;
    font-size: .14rem;
    color: #3364E4;
    text-align: center;
    line-height: .18rem;
    margin-top: .2rem;
    cursor: pointer;
}

.success-icon {
    display: inline-block;
    color: #386FFF;
    font-size: .6rem;
    height: .6rem;
    line-height: .6rem;
    margin-bottom: .16rem;
}

.success-title {
    width: 100%;
    font-size: .18rem;
    color: #2A2A2A;
    text-align: center;
    line-height: .22rem;
    font-weight: bold;
    margin-bottom: .08rem;
}

.success-desc {
    font-size: .15rem;
    color: #BBBBBB;
    text-align: center;
    line-height: .18rem;
    margin-bottom: .32rem;
}

.add-wechat-btn {
    display: inline-block;
    width: 1.4rem;
    height: .36rem;
    line-height: .36rem;
    background-color: #3364E4;
    box-shadow: 0 .04rem .08rem 0 rgba(51, 100, 228, 0.32);
    border-radius: .18rem;
    font-size: .14rem;
    color: #FFFFFF;
    text-align: center;
    margin: 0 .4rem .2rem .4rem;
    cursor: pointer;
}

.go-chat-btn {
    display: inline-block;
    width: 1.4rem;
    height: .36rem;
    line-height: .36rem;
    border: .01rem solid #3364E4;
    border-radius: .18rem;
    font-size: .14rem;
    color: #3364E4;
    text-align: center;
    cursor: pointer;
}

.popup-qrcode-title {
    width: 100%;
    font-size: .18rem;
    color: #000000;
    line-height: .22rem;
    text-align: center;
    font-weight: bold;
    margin-bottom: .06rem;
}

.popup-qrcode-desc {
    width: 100%;
    font-size: .13rem;
    color: #999999;
    text-align: center;
    line-height: .16rem;
    margin-bottom: .2rem;
}

.popup-qrcode-img-box {
    display: inline-block;
    width: 1.44rem;
    height: 1.44rem;
    text-align: center;
    padding: .045rem;
    position: relative;
    color: #07C160;
    margin-bottom: .12rem;
}

.popup-qrcode-img-box i {
    display: inline-block;
    width: .14rem;
    font-size: .14rem;
    line-height: .14rem;
    position: absolute;
    top: 0;
    left: 0;
}

.popup-qrcode-top-right {
    transform: rotate(90deg);
    left: auto !important;
    right: 0;
}

.popup-qrcode-bottom-left {
    transform: rotate(-90deg);
    top: auto !important;
    bottom: 0;
}

.popup-qrcode-bottom-right {
    transform: rotate(180deg);
    top: auto !important;
    bottom: 0;
    left: auto !important;
    right: 0;
}

.popup-qrcode-img {
    width: 100%;
    height: 100%;
    display: inline-block;
}

.wechat-icon {
    color: #08CA6A;
    margin-right: 0.05rem;
}

.wechat-num {
    width: 100%;
    font-size: .13rem;
    color: #2A2A2A;
    text-align: center;
    line-height: .16rem;
    margin-top: .21rem;
}

.copy-num-btn {
    width: 100%;
    height: .48rem;
    line-height: .44rem;
    background: #3364E4;
    border-radius: .08rem;
    font-size: .17rem;
    color: #FFFFFF;
    text-align: center;
    outline: none;
    border: 0;
}

.press-qrcode {
    width: 100%;
    font-size: .12rem;
    color: #999999;
    text-align: center;
    line-height: .13rem;
}

.copy-text {
    color: #3B5EDF;
    cursor: pointer;
}
</style>