<template>
    <share-btn :share="share">
    </share-btn>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

import ShareBtn from "@/components/shared/component/card/sharebtn.vue";

export default {
    name: "CalculatorShare",
    props: {
        shareTitle: {
            type: String,
            default: function() {
                return '';
            }
        },
        shareDes: {
            type: String,
            default: function() {
                return '';
            }
        },
    },
    data() {
        return {
            share: {
                type: 'news',
                title: this.shareTitle,
                thumbImage: '',
                desc: this.shareDes,
                customTitle: this.shareDes,
                isReport: true, // 分享上报，不上报可不传
                sapp_uuid: this['urlParams'] ? this['urlParams']['sapp_uuid'] : (this.$route.query['sapp_uuid'] ? this.$route.query['sapp_uuid'] : ''),
                target_type: this.$root.fromType,
                user_uuid: this.userUuid,
                router: window.location.pathname,
                url: window.location.origin + window.location.pathname
            },
        };
    },
    components: {
        ShareBtn
    },
    created() {
        this.$http.get(window.shortPath, {}).then(res => {
            if (res && res.code === 0) {
                this.share.title = res.data.share.title;
                this.share.customTitle = res.data.share.title;
                this.share.desc = res.data.share.desc;
                this.share.thumbImage = res.data.share.thumbImage;
                this.share.url = window.location.origin + window.location.pathname + '?sapp_uuid=' + this.share.sapp_uuid + '&user_uuid=' + this.userUuid + '&target_type=' + this.$root.fromType + '&one_way=' + this.userUuid;
                console.log(this.share);
                if (!this.inApp) {
                    let firstReportParam = {
                        sapp_uuid: this.share.sapp_uuid,
                    };
                    this.getRootUserInfo(firstReportParam).then(res => {
                        // 微信分享初始化
                        CommonJS.initWX(this.share);
                        // 浏览上报
                        CommonJS.readReport(this.share);
                        // 顶部消息提醒
                        this.$root.getAgentMsg();
                    });
                }
            }
        }, err => {});
    },
    mounted() {
        if (this.inApp) {
            this.$parent.$el.style.paddingBottom = '.58rem';
        }
    },
    methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.calculator-outer {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.calculator-padding {
    padding-bottom: .58rem;
}
</style>