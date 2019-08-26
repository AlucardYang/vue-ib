<template>
    <div v-show="userUuid && agentInfo.nickname && showComment" ref="counselorInfo" class="counselor-info">
        <div v-if="agentInfo.avatar" class="counselor-info-avatar" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}">
            <a id="top_avatar" class="a-href" @click="goAgentPage"></a>
        </div>
        <a id="top_avatar" v-if="!agentInfo.avatar" @click="goAgentPage"><i class="iconfont counselor-info-avatar">&#xe685;</i></a>
        <i v-if="template != 'a-a-n'" class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
        <i v-if="template == 'a-a-n' && agentInfo.realname_verified === '0'" class="iconfont head-image-vip gray">&#xe6ca;</i>
        <img v-if="template == 'a-a-n' && agentInfo.realname_verified === '1'" class="head-image-vip" style="width:.12rem;border:0;padding:0;" src="https://static.iberhk.com/v2/home/a-a-n_vip.png" alt="">

        <div class="counselor-info-name" :style="{'width': inApp || ((!inApp && (agentInfo.card !== 'hide') && (agentInfo.card !== 'simple') && (agentInfo.share_show_business_card != 0))) ? 'calc(100% - 1.73rem)' : 'calc(100% - .9rem)'}">
            <div ref="counselorInfoName" class="english">{{agentInfo.nickname}}</div>
        </div>
        <div v-if="inApp" id="top_ask" class="counselor-info-btn" @click="openAppWritePage">{{message ? edit_impression : write_impression}}</div>
        <div v-if="!inApp && (agentInfo.card !== 'hide') && (agentInfo.card !== 'simple') && (agentInfo.share_show_business_card != 0)" id="top_ask" class="counselor-info-btn" @click="openAppWritePage">{{contact}}</div>
        <div v-if="message" class="message-title">{{message_title}}</div>
        <div v-if="message" class="counselor-remark">
            <div v-for="(item, index) in messageHtml">{{item}}</div>
        </div>
        <div v-if="inApp && !message" class="counselor-remark empty">{{card_message_tip}}</div>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: "ArticleComment",
    props: {
        agentInfo: {
            type: Object,
            default: function() {
                return {};
            }
        },
        // 评论
        message: {
            type: String,
            default: function() {
                return '';
            }
        },
        // 来源名称字段
        targetString: {
            type: String,
            default: function() {
                return '';
            }
        },
        // 来源uuid
        targetUuid: {
            type: String,
            default: function() {
                return '';
            }
        },
    },
    data() {
        return {
            edit_impression: this.simply ? '编辑' : '編輯',
            write_impression: this.simply ? '写感想' : '寫感想',
            contact: this.simply ? '咨询' : '諮詢',
            message_title: this.simply ? '个人感想' : '個人感想',
            card_message_tip: this.simply ? '感想将会与分享的资讯一同展示' : '感想將會​​與分享的資訊一同展示',
            messageHtml: '',
            template: 'index',
        };
    },
    components: {},
    watch: {
        agentInfo: {
            handler: function(value, oldvalue) {
                this.template = (value.template && value.template.replace(/\/user\//ig, ''));
                const _this = this;
                _this.$refs.counselorInfo && (_this.$refs.counselorInfo.className = 'counselor-info ' + this.template + " " + value.skin_identity);
                setTimeout(() => {
                    if (_this.$refs.counselorInfoName) {
                        _this.$refs.counselorInfoName.style.lineHeight = (_this.$refs.counselorInfoName.offsetHeight <= 22 ? '.44rem' : '.22rem');
                    }
                }, 300);
            }
        },
        message: {
            handler: function(value, oldvalue) {
                this.messageHtml = value && value.split('\n');
            }
        }
    },
    mounted() {},
    methods: {
        goAgentPage() {
            const _this = this;
            if (window.__wxjs_environment == "miniprogram" || (window.platform === 7) || /wechatdevtools/.test(navigator.userAgent.toLowerCase())) {
                const wxSdk = require('weixin-js-sdk');
                setTimeout(() => {
                    wxSdk.miniProgram.switchTab({
                        url: '/pages/broker/broker?scene=' + _this.userUuid
                    });
                }, 500);
            } else {
                // 点击头像进入个人主页埋点统计
                CommonJS.youmengTrackEvent('资讯／文章感想框', '资讯／文章感想框-头像', this.agentInfo.nickname + this.agentInfo.mobile, '', 'top_avatar');
                !this.inApp && plug.addrDeclare({
                    object: this, //Vue对象或子对象，注意作用域
                    app: this.inApp,
                    page: /page./ig.test(window.location.host) ? this.agentInfo.home_page_url + '&is_share=1' : this.agentInfo.home_page_url, //申报地址成功后跳转URL
                    user_uuid: this.userUuid //agent ID
                });
            }
        },
        // app内跳转发表感想和h5跳转咨询顾问
        openAppWritePage() {
            if (this.inApp) {
                let params = {};
                params.message = this.message;
                this.targetString && (params[this.targetString] = this.targetUuid);
                this.appFn.commonFn('writePage', params);
            } else {
                // 点击咨询埋点统计
                CommonJS.youmengTrackEvent('资讯／文章感想框', '资讯／文章感想框-咨询', this.agentInfo.nickname + this.agentInfo.mobile, '', 'top_ask');

                // 小程序环境
                if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
                    plug.authAddress({
                        object: this, //Vue对象或子对象，注意作用域
                        user_uuid: this.userUuid,
                        answer_uuid: this.targetUuid,
                        from_type: this.$root.fromType
                    });
                } else {
                    // 打开留言流程弹窗
                    plug.openGuestBook({
                        object: this,
                        wx_qrcode: window.agentInfo.wx_qrcode,
                        wechat_num: window.agentInfo.wechat_num
                    });
                }
            }
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.counselor-info {
    width: 100%;
    min-height: .7rem;
    background: #FFFFFF;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.13);
    border-radius: .12rem;
    padding: .16rem;
    position: relative;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center center;
}

.counselor-info.index {
    background-position: center .16rem;
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/index/bg.png');
}

.counselor-info.a-a-a {
    background-position: -.06rem -.06rem;
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-a/bg.png');
}

.counselor-info.a-a-b {
    background-size: calc(100% - .4rem);
    background-position: .2rem .2rem;
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-b/flower.png');
}

.counselor-info.a-a-d {
    background-repeat: repeat-y;
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-d/bg.png');
}

.counselor-info.a-a-e {
    background-position: center top;
    background-size: 58%;
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-e/bg.png');
}

.counselor-info.a-a-f {
    background-position: top center;
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-f/bg.png');
}

.counselor-info.a-a-g {
    background-repeat: repeat-y;
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-g/bg.png');
}

.counselor-info.a-a-i {
    background-size: 74%;
    background-position: top right;
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-i/bg.png');
}

.counselor-info-avatar {
    display: inline-block;
    vertical-align: middle;
    width: .48rem;
    height: .48rem;
    border-radius: 50%;
    font-size: .48rem;
    line-height: .48rem;
    color: #ddd;
    background-size: 100%;
    background-position: center center;
    cursor: pointer;
}

.counselor-info-avatar .a-href {
    display: inline-block;
    width: .48rem;
    height: .42rem;
}

.head-image-vip {
    position: absolute;
    left: .52rem;
    top: .52rem;
    color: #FF2700;
    line-height: 0.12rem;
    font-size: .12rem;
    z-index: 3;
    padding: .01rem;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: #FFFFFF;
    text-align: center;
}

.counselor-info-btn {
    position: absolute;
    right: .16rem;
    top: .26rem;
    width: .68rem;
    height: .28rem;
    line-height: .28rem;
    border-radius: .17rem;
    font-size: .14rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    border: none;
    cursor: pointer;
    background-image: linear-gradient(-180deg, #5494F0 0%, #2D5CD8 100%);
    box-shadow: 0 8px 10px 0 rgba(73, 132, 232, 0.20);
}

.counselor-info.a-a-a .counselor-info-btn {
    background-image: linear-gradient(-180deg, #545454 0%, #2A2A2A 100%);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.10);
}

.counselor-info.a-a-b .counselor-info-btn {
    background-image: linear-gradient(90deg, #63E185 0%, #34C04D 100%);
    box-shadow: 0 4px 10px 0 rgba(9, 94, 22, 0.16);
}

.counselor-info.a-a-c .counselor-info-btn {
    background-image: linear-gradient(-180deg, #EC2329 0%, #D50F12 100%);
    box-shadow: 0 4px 10px 0 rgba(150, 79, 28, 0.19);
}

.counselor-info.a-a-d .counselor-info-btn {
    background-image: linear-gradient(-180deg, #E53B3E 2%, #E20C0F 98%);
    box-shadow: 0 4px 10px 0 rgba(150, 79, 28, 0.19);
}

.counselor-info.a-a-e .counselor-info-btn {
    background-image: linear-gradient(-180deg, #D58D29 0%, #BD5A13 100%);
    box-shadow: 0 4px 10px 0 rgba(150, 79, 28, 0.19);
}

.counselor-info.a-a-f .counselor-info-btn {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-f/left-btn.png');
    background-size: 100% 100%;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.10);
}

.counselor-info.a-a-g .counselor-info-btn {
    background-image: linear-gradient(-179deg, #F45907 0%, #E53803 100%);
    box-shadow: 0 4px 10px 0 rgba(150, 79, 28, 0.19);
}

.counselor-info.a-a-h .counselor-info-btn {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-h/left-btn.png');
    background-size: 100% 100%;
    box-shadow: 0 4px 10px 0 rgba(122, 56, 179, 0.20);
}

.counselor-info.a-a-i .counselor-info-btn {
    background-image: linear-gradient(-179deg, #5D3E9D 0%, #3D2967 100%);
    box-shadow: 0 4px 10px 0 rgba(97, 67, 160, 0.20);
}
.counselor-info.a-a-n .counselor-info-btn {
  background-image: linear-gradient(101deg, #FD8F61 0%, #F84B62 56%, #74398A 100%);
  box-shadow: 0 .08rem .16rem 0 #FFCBCD;
}

.counselor-info-name {
    width: calc(100% - 1.73rem);
    position: absolute;
    top: .18rem;
    left: .74rem;
    height: .44rem;
    display: flex;
    align-items: center;
}

.counselor-info-name .english {
    width: 100%;
    max-height: .44rem;
    word-break: break-all;
    font-size: .16rem;
    color: #2A2A2A;
    line-height: .22rem;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.counselor-info-name-span {
    position: absolute;
    right: .06rem;
    bottom: 0;
    font-weight: bold;
    display: inline-block;
    padding: 0 .11rem 0 .02rem;
    background-color: #FFFFFF;
    font-weight: bold;
}

.counselor-info.index .counselor-info-name-span {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/index/bg.png');
    background-size: 3.47rem auto;
    background-position: center center;
}

.counselor-info.a-a-d .counselor-info-name-span {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-d/bg.png');
    background-size: 3.47rem auto;
}

.counselor-info.a-a-g .counselor-info-name-span {
    background-image: url('https://static.iberhk.com/v2/web/images/agent/agent-card/a-a-g/bg.png');
    background-size: 3.47rem auto;
}

.counselor-info.a-a-j .counselor-info-btn {
    background-color: #3364E4;
    background-image: none;
    box-shadow: 0 8px 20px 0 rgba(51, 100, 228, 0.29);
}

.counselor-info.a-a-k .counselor-info-btn {
    background-image: linear-gradient(-179deg, #30aaf7 0%, #0e89d6 100%);
    box-shadow: 0 8px 20px 0 rgba(7, 126, 173, 0.41);
}

.counselor-info.a-a-l .counselor-info-btn {
    background-color: #FF7842;
    background-image: none;
    box-shadow: 0 8px 20px 0 rgba(255, 120, 66, 0.36);
}

.counselor-info.a-a-m .counselor-info-btn {
    background-color: #3364E4;
    background-image: none;
    box-shadow: 0 8px 20px 0 rgba(51, 100, 228, 0.29);
}

div.counselor-info.a-a-j.orange i.head-image-vip {
    color: #ff7842;
}

div.counselor-info.a-a-j.green i.head-image-vip {
    color: #0FCA42;
}

div.counselor-info.a-a-j.yellow i.head-image-vip {
    color: #FFCB27;
}

div.counselor-info.a-a-j.red i.head-image-vip {
    color: #F92C2C;
}

div.counselor-info.a-a-j.cyan i.head-image-vip {
    color: #09BFDB;
}

div.counselor-info.a-a-j.pink i.head-image-vip {
    color: #FF2196;
}

div.counselor-info.a-a-j.blue i.head-image-vip {
    color: #3364e4;
}

div.counselor-info.a-a-j.orange div.counselor-info-btn {
    background-color: #ff7842;
}

div.counselor-info.a-a-j.green div.counselor-info-btn {
    background-color: #0FCA42;
}

div.counselor-info.a-a-j.yellow div.counselor-info-btn {
    background-color: #FFCB27;
}

div.counselor-info.a-a-j.red div.counselor-info-btn {
    background-color: #F92C2C;
}

div.counselor-info.a-a-j.cyan div.counselor-info-btn {
    background-color: #09BFDB;
}

div.counselor-info.a-a-j.pink div.counselor-info-btn {
    background-color: #FF2196;
}

div.counselor-info.a-a-j.blue div.counselor-info-btn {
    background-color: #3364e4;
}

div.counselor-info.a-a-k i.head-image-vip {
    color: #0E89D6;
}

div.counselor-info.a-a-k div.counselor-info-btn {
    background-image: linear-gradient(135deg, #30AAF7 0%, #0E89D6 100%);
    box-shadow: 0 .08rem .24rem 0 rgba(7, 126, 173, 0.41);
}

div.counselor-info.a-a-l i.head-image-vip {
    color: #ff4722;
}

div.counselor-info.a-a-l div.counselor-info-btn {
    background-color: #ff4722;
}

div.counselor-info.a-a-m i.head-image-vip {
    color: #111;
}

div.counselor-info.a-a-m div.counselor-info-btn {
    background-color: #111;
}

.counselor-info-name .chinese {
    width: 100%;
    font-size: .14rem;
    color: #999999;
    line-height: .17rem;
    margin-top: .04rem;
}

.message-title {
    font-size: .15rem;
    color: #2A2A2A;
    line-height: .18rem;
    margin-top: .16rem;
    font-weight: bold;
}

.counselor-remark {
    width: 100%;
    font-size: .14rem;
    line-height: .19rem;
    color: #666666;
    margin-top: .11rem;
}

.counselor-remark.empty {
    color: #999999;
    margin-top: .16rem;
    text-align: center;
}

.head-image-vip.gray {
    color: #ddd !important;
}

</style>
