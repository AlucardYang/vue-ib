<template>
    <div id="mediaDetail">
        <div class="article com-scroll-y" :style="{'padding-bottom': inApp ? '.6rem' : '.2rem'}">
            <div class="article-detail">
                <div class="article-title">{{detail.title}}</div>
                <div class="article-from com-nowrap">
                    <span>{{detail.published}}</span>&nbsp;&nbsp;&nbsp;
                    <span :title="detail.source">{{detail.source}}</span>
                </div>
                <div class="detail-content richText" v-html="detail.content"></div>
                <div class="detail-copyright">
                    <div class="detail-copyright-title">{{simply ? '@版权归作者所有' : '@版權歸作者所有'}}</div>
                    <div class="detail-copyright-content">{{simply ? cn_disclaimer_des : tw_disclaimer_des}}</div>
                </div>
            </div>
            <consultant-card :user-uuid="userUuid" :target-uuid="mediaCoverageUuid" :from-type="'17'"></consultant-card>
        </div>
        <share-btn :share="share"></share-btn>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import ShareBtn from "@/components/shared/component/card/sharebtn.vue";

export default {
    name: 'MediaDetail',
    data() {
        return {
            mediaCoverageUuid: this['urlParams'] ? this.urlParams['media_coverage_uuid'] : (this.$route.query['media_coverage_uuid'] ? this.$route.query['media_coverage_uuid'] : ''),
            cn_disclaimer_des: '免责声明：本资讯来自公开网络，iBer不保证讯息的完整性和准确性；也不代表iBer的观点和立场。如有疑问，请发邮件至邮箱：Service@iBer.HK',
            tw_disclaimer_des: '免責聲明：本資訊來自公開網絡，iBer不保證訊息的完整性和準確性；也不代表iBer的觀點和立場。如有疑問，請發郵件至郵箱：Service@iBer.HK',
            detail: {},
            agentInfo: {},
            share: {},
        }
    },
    components: {
        ConsultantCard,
        ShareBtn
    },
    created() {
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: true, // 分享上报，不上报可不传
            media_coverage_uuid: this.mediaCoverageUuid,
            target_type: 17,
            user_uuid: this.userUuid,
            router: window.location.pathname,
            url: window.location.origin + window.location.pathname + '?media_coverage_uuid=' + this.mediaCoverageUuid + '&user_uuid=' + this.userUuid
        };
        if (!this.inApp) {
            let firstReportParam = {
                media_coverage_uuid: this.mediaCoverageUuid,
            };
            this.userUuid && this.getRootUserInfo(firstReportParam).then(res => {
                // 浏览上报
                CommonJS.readReport(this.share);
                // 顶部消息提醒
                this.$root.getAgentMsg();
            });
        }
        this.getMediaInfo();
    },
    mounted() {

    },
    methods: {
        getMediaInfo() {
            this.$http.get('/media/detail', {
                media_coverage_uuid: this.mediaCoverageUuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.detail = res.data;
                    if (/\<video/ig.test(this.detail.content)) {
                        this.detail.content = this.detail.content && this.detail.content.replace(/\<img src/ig, '<img data-emergence="hidden" data-src');
                        // 有视频时异步加载video-js.min.css和video.min.js
                        CommonJS.loadStyle('https://static.iberhk.com/res/css/video-js.min.css');
                        CommonJS.loadScript('https://static.iberhk.com/res/js/video.min.js', () => {});
                    } else {
                        this.detail.content = this.detail.content && this.detail.content.replace(/ src/ig, ' data-emergence="hidden" data-src');
                    }
                    this.share.title = this.detail['title'];
                    this.share.thumbImage = this.detail['img'];
                    this.share.desc = this.detail['abstract'];
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    CommonJS.lazyLoadImg();
                } else if (res && res.code === 1000) {
                    window.location.href = window.baseUrl + '/error/notfound';
                }
            }, err => {
                window.location.href = window.baseUrl + '/error/404';
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.article {
    /* background-color: #F6F6F6; */
}

.article-detail {
    padding: 0.085rem 0.16rem;
    background-color: #fff;
    min-height: 100%;
}

.article-title {
    font-weight: bold;
    font-size: 0.23rem;
    color: #2a2a2a;
    letter-spacing: 0;
    line-height: 0.33rem;
    margin-bottom: 0.16rem;
    white-space: pre-wrap;
}

.article-from {
    font-size: 0.14rem;
    color: #999999;
    letter-spacing: 0;
    line-height: 0.17rem;
    margin-bottom: 0.2rem;
}

.detail-content {
    margin-top: 0.32rem;
}

.detail-copyright {
    margin-top: 0.32rem;
}

.detail-copyright-title {
    font-size: 0.14rem;
    color: #666666;
    letter-spacing: 0;
    line-height: 0.17rem;
}

.detail-copyright-content {
    font-size: 0.14rem;
    color: #999999;
    letter-spacing: 0;
    line-height: 0.22rem;
    margin-top: 0.08rem;
}
</style>
