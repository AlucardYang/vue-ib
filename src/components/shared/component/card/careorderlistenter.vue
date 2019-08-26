<!-- 悬浮立即咨询按钮 -->
<template>
    <div id="goOrderList" v-if="!inApp && showEnter" class="go-order-list" @click="goOrderList()">
        {{simply ? '点击查看我的所有报名预约 >>>' : '點擊查看我的所有報名預約 >>>'}}
    </div>
</template>

<script>
import cmn from "@/components/ibercare/common.js";


export default {
    name: "CareOrderListEnter",
    props: {
        cUserUuid: {
            type: String,
            default: function() {
                return '';
            }
        },
    },
    data() {
        return {
            showEnter: false
        };
    },
    components: {},
    watch: {
        cUserUuid: {
            handler: function(value, oldvalue) {
                // 查询当前用户是不是agent
                console.log(value);
                this.getIsAgent();
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getIsAgent();
        });
    },
    created() {
      console.log("示例");
    },
    methods: {
        getIsAgent() {
            if (window.localStorage.getItem('care_verify_mobile')) {
                this.showEnter = true;
                return;
            }
            if (this.cUserUuid) {
                // 查询当前用户有没有授权过手机号
                this.$http.get('/iber-care/display-order-list', {
                    c_user_uuid: this.cUserUuid
                }).then((res) => {
                    if (res && res.code === 0) {
                        this.showEnter = res.data.display;
                    }
                });
            }
        },
        // 进入订单列表
        goOrderList() {
            //小程序
            if (window.__wxjs_environment == "miniprogram" || window.platform == 7) {
                cmn.miniPagePath({
                    object: this,
                    route: "/pages/frame/list",
                    path: "/iber-care/order-list",
                    title: plug.sm(this.simply, '订单列表'),
                    query: {
                        user_uuid: this.userUuid
                    }
                });
                return;
            }

            // this.$router.push({
            //     path: "/iber-care/order-list",
            //     query: {
            //         user_uuid: this.userUuid
            //     }
            // });

            window.location.href = window.baseUrl + '/iber-care/order-list?user_uuid=' + this.userUuid + '&in_app=' + (this.inApp ? 1 : 0) + '&auth=' + window.auth + '&card=' + this.card + '&language=' + this.lang;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.go-order-list {
    width: 100%;
    height: .32rem;
    line-height: .32rem;
    background-color: #FFECE7;
    font-size: .13rem;
    color: #FF4416;
    text-align: center;
    line-height: .32rem;
    cursor: pointer;
}
</style>
