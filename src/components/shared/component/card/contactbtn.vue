<!-- 悬浮立即咨询按钮 -->
<template>
    <div v-if="!inApp" class="contact-btn active-hover" @click="goConsultAgent">
        <i class="iconfont">&#xe6cc;</i>
        <span>{{simply ? '立即咨询' : '立即諮詢'}}</span>
    </div>
</template>

<script>
export default {
    name: "ContactBtn",
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
        // 页面滚动高度
        scrollTop: {
            type: null,
            default: function() {
                return null;
            }
        },
    },
    data() {
        return {};
    },
    components: {},
    watch: {
        scrollTop: {
            handler: function(value, oldvalue) {
                // 修改滑到底部隐藏
                let contactBtn = document.querySelector('.contact-btn');
                let comScrollY = document.querySelector('.com-scroll-y');
                let consultant = document.querySelector('.consultant-card-box');
                if ((window.card === 'full') && !inApp && comScrollY && contactBtn) {
                    contactBtn.style.opacity = ((comScrollY.scrollTop <= comScrollY.scrollHeight - comScrollY.clientHeight - 200) ? 1 : 0);
                    contactBtn.style.transform = ((comScrollY.scrollTop <= comScrollY.scrollHeight - comScrollY.clientHeight - 200) ? 'translateX(0)' : 'translateX(1.24rem)');
                }
            }
        }
    },
    mounted() {},
    methods: {
        goConsultAgent() {
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
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.contact-btn {
    position: absolute;
    bottom: .44rem;
    right: .16rem;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    width: 1.08rem;
    height: .36rem;
    line-height: .35rem;
    border-radius: .18rem;
    color: #FFFFFF;
    font-size: .15rem;
    box-shadow: 0 0.03rem 0.2rem 0 rgba(0, 0, 0, 0.20);
    background-color: rgba(0, 0, 0, .64);
    transition: all 300ms;
    z-index: 100;
}
</style>
