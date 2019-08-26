<template>
    <div class="consultant-card-box">
        <div class="share-from-tip-box">
            <div v-if="shareFrom" class="top"><span style="color: #ddd">————</span><span>&nbsp;分享自&nbsp;</span><span style="color: #ddd">————</span></div>
            <div v-if="shareHealth" class="top"><span style="color: #ddd">————</span><span>&nbsp;{{simply ? '健康顾问' : '健康顧問'}}&nbsp;</span><span style="color: #ddd">————</span></div>
        </div>
    
    
        <!-- 默认个人主页 -->
        <div class="consultant-card">
            <div class="consultant-card-top">
                <div class="head-image">
                    <a id="button_avatar" class="head-image-a" @click="goAgentPage('avatar')">
                        <div v-if="agentInfo.avatar" class="head-image-avatar" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                        <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar">&#xe685;</i>
                    </a>
                    <i class="iconfont head-image-vip" :class="{'gray': agentInfo.realname_verified === '0'}">&#xe6ca;</i>
                </div>
                <div class="name-number-box">
                    <span ref="agentNameSpan">{{agentInfo.nickname}}</span>
                </div>
                <div class="contact-btn" @click="goConsultAgent">{{simply ? '咨询' : '諮詢'}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Toast
} from 'mint-ui';

import CommonJS from '@/components/shared/service/common.js';

export default {
    name: "SimpleConsultantCard",
    props: {
        userUuid: {
            type: String,
            default: function() {
                return '';
            }
        },
        // 来源的uuid，咨询顾问用
        targetUuid: {
            type: String,
            default: function() {
                return '';
            }
        },
        // 显示分享至
        shareFrom: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        // 显示健康顾问
        shareHealth: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        // 分享类型，咨询顾问需用到
        fromType: {
            type: String,
            default: function() {
                return '11';
            }
        },
    },
    data() {
        return {
            agentInfo: {
                avatar: '',
                nickname: '',
                realname_verified: '0',
                signature: '',
                wechat_num: '',
                wx_qrcode: ''
            },
        };
    },
    components: {

    },
    watch: {
        userUuid: {
            handler: function(value, oldvalue) {
                this.getAgentInfo();
            }
        }
    },
    mounted() {
        this.getAgentInfo();
    },
    methods: {
        getAgentInfo() {
            if (this.userUuid) {
                this.$http.get('/user/get-agent-card', {
                    user_uuid: this.userUuid
                }).then(res => {
                    if (res && res.code === 0) {
                        this.agentInfo = res.data;
                        window.agentInfo = res.data;
                    }
                })
            }
        },
        // 联系顾问
        goConsultAgent() {
            // 点击咨询顾问埋点统计
            CommonJS.youmengTrackEvent('底部名片', '底部名片-立即咨询', this.agentInfo.nickname + this.agentInfo.mobile, '', 'button_askrightnow');

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
        },
        // 跳转顾问个人主页
        goAgentPage(type) {
            const _this = this;
            if (window.__wxjs_environment == "miniprogram" || (window.platform === 7) || /wechatdevtools/.test(navigator.userAgent.toLowerCase())) {
                const wxSdk = require('weixin-js-sdk');
                setTimeout(() => {
                    wxSdk.miniProgram.switchTab({
                        url: '/pages/broker/broker?scene=' + _this.userUuid
                    });
                }, 500);
            } else {
                // 点击个人主页埋点统计
                if (type === 'avatar') {
                    CommonJS.youmengTrackEvent('底部名片', '底部名片-头像', this.agentInfo.nickname + this.agentInfo.mobile, '', 'button_avatar');
                } else {
                    CommonJS.youmengTrackEvent('底部名片', '底部名片-顾问主页', this.agentInfo.nickname + this.agentInfo.mobile, '', 'button_personhomepage');
                }
                // 进入个人主页
                !this.inApp && plug.addrDeclare({
                    object: this, //Vue对象或子对象，注意作用域
                    app: this.inApp,
                    page: /page./ig.test(window.location.host) ? this.agentInfo.home_page_url + '&is_share=1' : this.agentInfo.home_page_url, //申报地址成功后跳转URL
                    user_uuid: this.userUuid //agent ID
                });
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.consultant-card-box {
    box-sizing: border-box;
    width: 100%;
    padding: 0.16rem 0.12rem;
    min-height: 1.28rem;
    background-color: #fff;
}

.top-tip {
    color: #CCCCCC;
    font-size: 0.15rem;
    line-height: 0.18rem;
    margin-bottom: .14rem;
}

.consultant-card {
    position: relative;
    width: 100%;
    min-height: 0.8rem;
    background: #FFFFFF;
    box-shadow: 0 2px 18px 0 rgba(0, 0, 0, 0.10);
    border-radius: .08rem;
    padding: 0.17rem 0.16rem;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: 0 0;
}

.consultant-card-top {
    position: relative;
    height: .48rem;
    z-index: 2;
}

.head-image {
    position: relative;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    height: 0.48rem;
    width: 0.48rem;
    border-radius: 50%;
    background: #fff;
}

.head-image-a {
    display: inline-block;
    height: 0.48rem;
    width: 0.48rem;
    cursor: pointer;
}

.head-image-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: 100%;
    background-position: center center;
    font-size: .6rem;
    color: #DDDDDD;
    line-height: 0.6rem;
}

.head-image-vip {
    position: absolute;
    right: -0.03rem;
    bottom: -.04rem;
    color: #FF2700;
    line-height: 0.13rem;
    font-size: .12rem;
    z-index: 3;
    border: .01rem solid #fff;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: #FFFFFF;
    text-align: center;
}

.head-image-vip.gray {
    color: #DDDDDD;
}

.name-number-box {
    font-family: PingFangSC-Semibold;
    width: calc(100% - 1.36rem);
    height: .4rem;
    font-size: .13rem;
    color: #2A2A2A;
    line-height: .2rem;
    font-weight: bold;
    word-break: break-all;
    position: absolute;
    top: .04rem;
    left: .58rem;
}

.name-number-box span {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    max-height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.share-from-tip-box {
    width: 100%;
    text-align: center;
    font-size: .13rem;
    color: #999999;
    line-height: .16rem;
    padding: 0 0 .2rem 0;
}

.contact-btn {
    width: .68rem;
    height: .28rem;
    font-family: PingFangSC-Medium;
    font-size: .14rem;
    color: #FFFFFF;
    line-height: .28rem;
    text-align: center;
    border-radius: .14rem;
    background-color: #3364E4;
    position: absolute;
    right: 0;
    top: .1rem;
    cursor: pointer;
}
</style>
