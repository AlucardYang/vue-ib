<template>
    <div v-show="isLoaded">
        <div class="com-scroll-y" :class="{'help-detail': inApp}">
            <div class="detail-content richText" v-html="detail.answer"></div>
        </div>
        <share-btn :share="share" :setting="shareSetting"></share-btn>
    </div>
</template>

<script>
import ShareBtn from "@/components/shared/component/card/sharebtn.vue";

import CommonJS from '@/components/shared/service/common.js';

export default {
    name: "HelpDetail",
    data() {
        return {
            question_uuid: this['urlParams'] ? this.urlParams['question_uuid'] : (this.$route.query['question_uuid'] ? this.$route.query['question_uuid'] : ''),
            detail: {},
            share: {},
            shareSetting: {
                hide_platform: [],
                language: 'auto',
                auth: 'force',
                card: 'null',
                comment: 'null',
                moreShare: 'null'
            },
            isLoaded: false
        };
    },
    components: {
        ShareBtn
    },
    created() {
        this.$root.blueLoadingParams.show = true;
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: true, // 分享上报，不上报可不传
            question_uuid: this.question_uuid,
            target_type: this.$root.fromType,
            user_uuid: this.userUuid,
            router: window.location.pathname,
            url: window.location.origin + window.location.pathname + '?question_uuid=' + this.question_uuid + '&user_uuid=' + this.userUuid + '&one_way=' + this.userUuid + '&target_type=' + this.$root.fromType
        };
    },
    mounted() {
        this.getHelpDetail();
    },
    methods: {
        getHelpDetail() {
            this.$http.get('/question/detail', {
                question_uuid: this.question_uuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.detail = res.data;
                    !this.inApp && (document.title = this.detail.question);
                    if (/\<video/ig.test(this.detail.answer) || /\<iframe/ig.test(this.detail.answer)) {
                        // this.detail.answer = this.detail.answer && this.detail.answer.replace(/\<img src/ig, '<img data-emergence="hidden" data-src');
                        // 有视频时异步加载video-js.min.css和video.min.js
                        CommonJS.loadStyle('https://static.iberhk.com/res/css/video-js.min.css');
                        CommonJS.loadScript('https://static.iberhk.com/res/js/video.min.js', () => {});
                    } else {
                        // this.detail.answer = this.detail.answer && this.detail.answer.replace(/ src/ig, ' data-emergence="hidden" data-src');
                    }
                    this.share.title = this.detail.share['title'];
                    this.share.thumbImage = this.detail.share['thumbImage'];
                    this.share.desc = this.detail.share['desc'];
                    if (!this.inApp) {
                        let firstReportParam = {
                            question_uuid: this.share.question_uuid,
                        };
                        this.userUuid && this.getRootUserInfo(firstReportParam).then(res => {
                            // 微信分享初始化
                            CommonJS.initWX(this.share);
                            // 浏览上报
                            CommonJS.readReport(this.share);
                        });
                    }
                }
                this.$root.blueLoadingParams.show = false;
                this.isLoaded = true;
                CommonJS.lazyLoadImg();
            }, err => {
                this.$root.blueLoadingParams.show = false;
                this.isLoaded = true;
            })
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.help-detail {
    padding-bottom: .54rem;
}

.detail-content {
    width: 100%;
    min-height: 100%;
    padding: .16rem .12rem;
}
</style>