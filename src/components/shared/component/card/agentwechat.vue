<template>
    <div v-if="params.show" class="agent-wechat">
        <div class="com-mask-frame com-flex com-wechat-id">
            <div class="aux-mask" @click="close"></div>
            <div class="popup-qrcode-box" :class="{comBlast: params.slide}">
                <i @click="close" class="iconfonti close-icon">&#xe628;</i>
                <header class="popup-qrcode-title">
                    <span v-if="params.qrcode_type === 1">{{simply ? '顾问微信' : '顧問WeChat'}}</span>
                    <span v-if="params.qrcode_type === 2">{{simply ? '顾问Facebook' : '顧問Facebook'}}</span>
                    <span v-if="params.qrcode_type === 3">{{simply ? '顾问个人主页' : '顧問個人主頁'}}</span>
                </header>
                <div class="popup-qrcode-desc">
                    <span v-if="params.qrcode_type === 1">{{simply ? '添加微信好友咨询更多讯息' : '添加WeChat好友諮詢更多訊息'}}</span>
                    <span v-if="params.qrcode_type === 2">{{simply ? '添加Facebook好友咨询更多讯息' : '添加Facebook好友諮詢更多訊息'}}</span>
                    <span v-if="params.qrcode_type === 3">{{simply ? '了解顾问更多专业讯息' : '了解顧問更多專業訊息'}}</span>
                </div>
                <div v-if="params.qrcode" class="popup-qrcode-img-box" :style="{'color': params.qrcode_type === 1 ? '#07C160' : '#4152AF'}">
                    <i class="iconfonti popup-qrcode-top-left">&#xe7d3;</i>
                    <i class="iconfonti popup-qrcode-top-right">&#xe7d3;</i>
                    <i class="iconfonti popup-qrcode-bottom-left">&#xe7d3;</i>
                    <i class="iconfonti popup-qrcode-bottom-right">&#xe7d3;</i>
                    <img id="button_qrcode" class="popup-qrcode-img" :src="params.qrcode">
                </div>
                <p class="press-qrcode" v-if="params.qrcode && plug.wx.platform && !$root.isMiniProgram && (params.qrcode_type !== 3)">{{simply ? '微信内长按识别二维码' : 'WeChat內長按識別二維碼'}}</p>
                <p class="press-qrcode" v-if="params.qrcode && (!plug.wx.platform || $root.isMiniProgram) && (params.qrcode_type !== 3)">{{simply ? '长按保存二维码添加好友' : '長按保存二維碼添加好友'}}</p>
                <p class="press-qrcode" v-if="params.qrcode && plug.wx.platform && !$root.isMiniProgram && (params.qrcode_type === 3)">{{simply ? '长按识别进入个人主页' : '長按識別進入個人主頁'}}</p>
                <p class="press-qrcode" v-if="params.qrcode && (!plug.wx.platform || $root.isMiniProgram) && (params.qrcode_type === 3)">{{simply ? '长按保存顾问个人主页二维码' : '長按保存顧問個人主頁二維碼'}}</p>
                <aside class="wechat-num" v-if="params.wechat_num && (params.qrcode_type === 1)">
                    <span>WeChat: </span>
                    <span>{{params.wechat_num}}</span>
                    <span id="button_copyid" class="copy-text" @click="copyWechatID" :data-clipboard-text="params.wechat_num">{{simply ? '复制' : '複製'}}</span>
                </aside>
            </div>
        </div>
    </div>
</template>

<script>
import Clipboard from "clipboard";

export default {
    name: "AgentWechat",
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
    data: function() {
        return {
            show: false,
            slide: false,
            // 长按定时器 
            timeOutEvent: 0
        };
    },
    components: {

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
    methods: {
        //关闭
        close() {
            this.params.slide = false;
            window.setTimeout(() => {
                this.params.show = false;
            }, 100);
        },
        //打开
        open() {
            this.params.show = true;
            window.setTimeout(() => {
                this.params.slide = true;
            }, 100);
        },
        // 复制微信号
        copyWechatID() {
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
    },
};
</script>

<style scoped>
.agent-wechat {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.popup-qrcode-box {
    position: relative;
    width: 2.64rem;
    min-height: .32rem;
    background: #FFFFFF;
    border-radius: .12rem;
    padding: .24rem;
    transform: scale(0);
    transition: all 100ms;
    text-align: center;
    margin-bottom: .42rem;
}

.comBlast {
    visibility: visible;
    transform: scale(1);
}

.popup-qrcode-box.in-facebook {
    padding: .38rem .24rem .5rem .24rem;
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

.phone-entry {
    width: 100%;
    font-size: .14rem;
    color: #3364E4;
    text-align: center;
    line-height: .18rem;
    margin-top: .2rem;
    cursor: pointer;
}
</style>