<template>
    <div class="article com-scroll-y">
        <div class="article-detail">
            <div class="article-title">{{detail.title}}</div>
            <div class="article-from com-nowrap">
                <span>{{detail.push_at}}</span>&nbsp;&nbsp;&nbsp;
            </div>
            <div class="detail-content richText" v-html="detail.content"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MessageDetail',
    data() {
        return {
            message_sys_uuid: this.$route.query['message_sys_uuid'] ? this.$route.query['message_sys_uuid'] : '73eb3fa4052b2bf4ea1af9bbd22457f5',
            user_uuid: this.$route.query['user_uuid'] ? this.$route.query['user_uuid'] : '85f7d1fb690d6da03d0c2cd028390309',
            detail: {}
        }
    },
    components: {},
    created() {},
    mounted() {
        this.iBerPayPage();
        this.getSystemMessage();
    },
    methods: {
        getSystemMessage() {
            this.$http.post('/message/sys-message-detail', {
                message_sys_uuid: this.message_sys_uuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.detail = res.data;
                    // 给app发送消息
                    setTimeout(() => {
                        this.appFn.postNotification('checkSystemMessage');
                        this.detail.content && (this.detail.content = this.detail.content.replace(/href=\"iBerPayPage\"/g, 'onclick="iBerPayPage()"'));
                        console.log(this.detail.content);
                        if (this.detail['link']) {
                            if (this.detail['link'].indexOf('?') === -1) {
                                this.detail['link'] += ('?in_app=' + (this.inApp ? 1 : 0));
                            } else {
                                this.detail['link'] += ('&in_app=' + (this.inApp ? 1 : 0));
                            }
                            window.location.href = this.detail['link'] + '&user_uuid=' + this.userUuid;
                        }
                    }, 200);
                } else if (res && res.code === 1000) {
                    window.location.href = window.baseUrl + '/error/notfound';
                }
            })
        },
        // 跳转app支付页面
        iBerPayPage() {
            const _this = this;
            window.iBerPayPage = function() {
                let pageParam = {
                    is_sapp: false,
                    sapp_uuid: '',
                    page_type: 1,
                    page_h5_title: '',
                    page_url: "IBerHomeModule_IBerPlayPage",
                    page_params: {}
                };
                _this.appFn.goPage(pageParam);
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.article {
    background-color: #F6F6F6;
}

.article-detail {
    padding: .085rem .16rem;
    background-color: #fff;
    min-height: 100%;
}

.article-title {
    font-weight: bold;
    font-size: .23rem;
    color: #2A2A2A;
    letter-spacing: 0;
    line-height: .33rem;
    margin-bottom: .16rem;
    white-space: pre-wrap;
}

.article-from {
    font-size: .14rem;
    color: #999999;
    letter-spacing: 0;
    line-height: .17rem;
    margin-bottom: .2rem;
}

.detail-content {
    margin-top: .32rem;
}
</style>
