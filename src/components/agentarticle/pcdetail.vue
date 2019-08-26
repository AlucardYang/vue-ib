<template>
    <div v-show="isLoaded" id="agentArticle">
        <div class="article com-scroll-y">
            <div v-if="detail.reason" class="article-no-pass">
                <h3 class="no-pass-title warn">{{no_pass_reason}}</h3>
                <div class="no-pass-content warn">{{detail.reason}}</div>
                <h3 class="no-pass-title" style="margin-top: .16rem">{{no_pass_proposal}}</h3>
                <div class="no-pass-content">{{detail.proposal}}</div>
            </div>
            <div class="article-detail" :style="{'min-height': isHasImg ? 'calc(100% + .02rem)' : 'auto'}">
                <div class="transparent-mask" :style="transparentMask"></div>
                <div v-if="detail.title" class="article-title">{{detail.title}}</div>
                <div v-else class="article-title" style="color: #BBBBBB">{{simply ? '暂无标题' : '暫無標題'}}</div>
                <div class="article-from com-nowrap">
                    <span>{{detail.published_at}}</span>&nbsp;&nbsp;&nbsp;
                    <span>{{detail.source}}</span>
                </div>
                <!-- <div class="article-abstract">{{detail.abstract}}</div> -->
                <article-comment :agent-info="bottomAgentInfo" :message="analyzeInfo.comment" :target-uuid="agentArticleUuid"></article-comment>
                <div v-if="detail.content" class="detail-content richText" v-html="detail.content"></div>
                <div v-else class="detail-content detail-content-empty">{{simply ? '暂无正文' : '暫無正文'}}</div>
                <div class="detail-copyright">
                    <div class="detail-copyright-title">{{copy_right}}</div>
                    <div class="detail-copyright-content">{{disclaimer_des}}</div>
                </div>
            </div>
            <!-- 浏览分享数据统计 -->
            <share-data :analyze="analyzeInfo.analyze"></share-data>
            <!-- 数据统计为0时显示底部灰底 -->
            <div v-if="inApp && detail.readed == 0" class="background-gray-bar"></div>
            <consultant-card :user-uuid="userUuid" :target-uuid="agentArticleUuid" :from-type="'14'" :share-from="true" @getAgentInfo="getAgentInfo"></consultant-card>
            <!-- 顾问分享文章列表 -->
            <ul v-if="!inApp && (analyzeInfo.share_list && analyzeInfo.share_list.length > 0) && (moreShare !== 'hide')" class="article-list">
                <li class="share-from-tip-box">
                    <div class="top">
                        <span style="color: #ddd">————</span>
                        <span>&nbsp;更多分享&nbsp;</span>
                        <span style="color: #ddd">————</span>
                    </div>
                </li>
                <li class="article-block" v-for="(item, index) in analyzeInfo.share_list" :key="index">
                    <div class="article-block-left">
                        <div class="article-block-title">
                            <span>{{item.title}}</span>
                        </div>
                        <div class="article-block-bottom com-nowrap">
                            <span>{{item.published_at}}</span>&nbsp;&nbsp;
                            <span>{{item.source}}</span>
                        </div>
                    </div>
                    <img class="article-block-img" :src="item.img">
                </li>
            </ul>
            <div class="box-interval"></div>
        </div>
        <div class="box-interval"></div>
        <share-btn :share="share" :style-type="'agentArticle'" :setting="shareSetting" :comment="analyzeInfo.comment"></share-btn>
        <like-btn :share="share" :is-like="analyzeInfo.approval"></like-btn>
        <com-agent-avatar :params="comAARData"></com-agent-avatar>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

import ArticleComment from "@/components/shared/component/card/articlecomment.vue";
import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import ShareBtn from "@/components/shared/component/card/sharebtn.vue";
import LikeBtn from "@/components/shared/component/card/likebtn.vue";
import comAgentAvatar from "@/components/component/com_agent_avatar.vue";
import ShareData from "@/components/shared/component/card/sharedata.vue";

export default {
    name: 'AgentArticleDetail',
    data() {
        return {
            agentArticleUuid: this['urlParams'] ? this.urlParams['agent_article_uuid'] : (this.$route.query['agent_article_uuid'] ? this.$route.query['agent_article_uuid'] : '4fea2255ca2ecc8dd9817c33bfbabf31'),
            moreShare: this['urlParams'] ? this.urlParams['moreShare'] : (this.$route.query['moreShare'] ? this.$route.query['moreShare'] : ''),
            isLoaded: false,
            isHasImg: false,
            detail: {
                title: '',
                share_list: [],
                user_info: {},
                content: ''
            },
            analyzeInfo: {
                comment: '',
                analyze: {}
            },
            bottomAgentInfo: {},
            share: {},
            shareSetting: {
                hide_platform: [],
                language: 'null',
                auth: 'force',
                card: 'full',
                comment: 'show',
                moreShare: 'show'
            },
            comAARData: {
                layer: 0,
                name: "comAARData",
                id: "",
                url: ""
            },
            transparentMask: {},
            htmlFontSize: this.$route.query['font_size'],
            edit_impression: this.simply ? '编辑感想' : '編輯感想',
            write_impression: this.simply ? '发表感想' : '發表感想',
            contact: this.simply ? '咨询' : '諮詢',
            no_pass_reason: this.simply ? '未通过原因：' : '未通過原因：',
            no_pass_proposal: this.simply ? '修改建议：' : '修改建議：',
            copy_right: this.simply ? '@版权归作者所有' : '@版權歸作者所有',
            disclaimer_des: this.simply ? '免责声明：本资讯集自公开网络，iBer不保证讯息的完整性和准确性；也不代表iBer的观点和立场。如有疑问，请发邮件至邮箱：Service@iBer.HK' : '免責聲明：本資訊集自公開網絡，iBer不保證訊息的完整性和準確性；也不代表iBer的觀點和立場。如有疑問，請發郵件至郵箱：Service@iBer.HK',
            visitors_number: this.simply ? '浏览人数' : '瀏覽人數',
            forwarding_number: this.simply ? '客户转发数' : '客戶轉發數',
            reading_time: this.simply ? '平均阅读时长' : '平均閱讀時長',
            mintues_unit: this.simply ? '分钟' : '分鐘',
        }
    },
    components: {
        ArticleComment,
        ConsultantCard,
        ShareBtn,
        LikeBtn,
        comAgentAvatar,
        ShareData
    },
    beforeCreate() {},
    created() {
        document.documentElement.style.fontSize = this.htmlFontSize ? this.htmlFontSize : '73px';

        this.$root.blueLoadingParams.show = true;
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: true, // 分享上报，不上报可不传
            agent_article_uuid: this.agentArticleUuid,
            target_type: 14,
            user_uuid: this.userUuid,
            c_user_uuid: '',
            router: window.location.pathname
        };
        // 获取公共用户信息
        this.getUserInfoFn();
        // 获取文章详情
        this.getAgentArticleInfo();
    },
    mounted() {

    },
    methods: {
        // 获取公共用户信息
        getUserInfoFn() {
            if (!this.inApp) {
                let firstReportParam = {
                    agent_article_uuid: this.agentArticleUuid,
                };
                this.getRootUserInfo(firstReportParam).then(res => {
                    // 获取点赞状态
                    this.getApproval();
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    // 浏览上报
                    CommonJS.readReport(this.share);
                    // 顶部消息提醒
                    this.$root.getAgentMsg();
                });
            } else {
                // 获取额外信息
                this.getApproval();
                // 提供给app更新详情和评论
                this.updateComment();
            }
        },
        // 获取文章详情
        getAgentArticleInfo() {
            this.$root.blueLoadingParams.show = true;
            let params = {
                agent_article_uuid: this.agentArticleUuid
            };
            !this.inApp && (params.c_user_uuid = this.rootUserInfo['c_user_uuid']);
            this.$http.get('/agent-article/detail', params).then(res => {
                if (res && res.code === 0) {
                    // 在h5审核不通过直接跳转不存在页面
                    if (res.data && res.data.reason && !this.inApp) {
                        // window.location.href = window.baseUrl + '/error/notfound';
                        // return;
                    }
                    this.detail = res.data;
                    // 优化转载文章未上传完服务器问题
                    if (this.detail.async_status) {
                        this.createMetaReferrer();
                    }
                    // 设置分享信息
                    this.share.title = this.detail.share['title'];
                    this.share.thumbImage = this.detail.share['thumbImage'];
                    this.share.desc = this.detail.share['desc'];
                    this.share.url = window.location.origin + window.location.pathname + '?agent_article_uuid=' + this.agentArticleUuid + '&user_uuid=' + this.userUuid + '&target_type=' + this.share.target_type + '&one_way=' + this.userUuid;
                    // 内容是否包含图片
                    this.isHasImg = /\<img/ig.test(this.detail.content);
                } else if (res && res.code === 1001) {
                    window.location.href = window.baseUrl + '/error/notfound?font_size=73px&language=' + this.lang;
                }
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
                setTimeout(() => {
                    this.transparentMask = {
                        height: (document.querySelector('.article-detail').clientHeight + document.querySelector('.consultant-card-box').clientHeight + document.querySelector('.article-list').clientHeight + 54) + 'px'
                    };
                }, 1000);
            }, err => {
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
                // window.location.href = window.baseUrl + '/error/404';
                setTimeout(() => {
                    this.transparentMask = {
                        height: (document.querySelector('.article-detail').clientHeight + document.querySelector('.consultant-card-box').clientHeight + document.querySelector('.article-list').clientHeight + 54) + 'px'
                    };
                }, 1000);
            });
        },
        // 获取点赞状态
        getApproval() {
            let params = {
                agent_article_uuid: this.agentArticleUuid
            };
            !this.inApp && (params.c_user_uuid = this.rootUserInfo['c_user_uuid']);
            this.$http.post('/agent-article/get-approval', params).then(res => {
                this.analyzeInfo = res.data;
                // 底部统计数据
                this.analyzeInfo.analyze = {
                    view: res.data.readed,
                    view_link: res.data.view_link,
                    share: res.data.share_num,
                    share_link: res.data.share_link,
                    view_time: res.data.duration
                };
            });
        },
        // 增加<meta name="referrer" content="never">阻止防盗链，优化转载文章未上传完服务器问题
        createMetaReferrer() {
            const oMeta = document.createElement('meta');
            oMeta.name = 'referrer';
            oMeta.content = 'never';
            document.getElementsByTagName('head')[0].appendChild(oMeta);
        },
        // app内跳转发表感想和h5跳转咨询顾问
        openAppWritePage() {
            if (this.inApp) {
                this.appFn.commonFn('writePage', {
                    message: this.analyzeInfo['comment'] && this.analyzeInfo.comment
                });
            } else {
                plug.authAddress({
                    object: this, //Vue对象或子对象，注意作用域
                    user_uuid: this.userUuid,
                    answer_uuid: this.agentArticleUuid,
                    from_type: this.$root.fromType
                });
            }
        },
        getAgentInfo(data) {
            this.bottomAgentInfo = data;
            this.$forceUpdate();
        },
        goAgentPage() {
            !this.inApp && plug.addrDeclare({
                object: this, //Vue对象或子对象，注意作用域
                app: this.inApp,
                page: this.bottomAgentInfo.home_page_url, //申报地址成功后跳转URL
                user_uuid: this.userUuid //agent ID
            });
        },
        goArticleDetail(agent_article_uuid, in_app) {
            // 小程序内跳转
            window.location.href = window.baseUrl + '/agent-article/detail?agent_article_uuid=' + agent_article_uuid + '&user_uuid=' + this.userUuid + '&in_app=' + in_app + '&auth=' + window.auth + '&card=' + this.card + '&moreShare=' + this.moreShare;
        },
        // 提供给app更新评论
        updateComment() {
            const _this = this;
            window.reloadData = function() {
                _this.getAgentArticleInfo();
            }
        },
        // 跳转动态
        goDynamic(type) {
            this.appFn.goPage(this.detail[type]);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.article {
    /* background-color: #F6F6F6; */
    padding-bottom: .54rem;
}

.article-no-pass {
    background-color: #FFFFFF;
    border-radius: .08rem;
    margin: .1rem .12rem;
    padding: .12rem;
    color: #2A2A2A;
}

.article-no-pass h3 {
    font-weight: normal;
    font-size: .15rem;
    line-height: .18rem;
}

.article-no-pass .warn {
    color: #FF0D0D;
}

.no-pass-content {
    font-size: .13rem;
    color: #2A2A2A;
    line-height: .18rem;
    margin-top: .06rem;
}

.article-detail {
    padding: .085rem .16rem;
    background-color: #fff;
    min-height: calc(100% + .02rem);
    position: relative;
}

.article-title {
    font-family: PingFangSC-Medium;
    font-size: .23rem;
    color: #2A2A2A;
    letter-spacing: 0;
    line-height: .33rem;
    margin-bottom: .16rem;
    word-break: break-word;
    white-space: pre-wrap;
}

.article-from {
    font-size: .14rem;
    color: #999999;
    letter-spacing: 0;
    line-height: .17rem;
    margin-bottom: .16rem;
}

.article-abstract {
    font-size: .15rem;
    color: #2A2A2A;
    letter-spacing: 0;
    line-height: .2rem;
    margin-bottom: .32rem;
}

.counselor-info {
    width: 100%;
    min-height: .7rem;
    background: #FFFFFF;
    /* border: 1px solid #E3E3E3; */
    box-shadow: 3px 3px 14px 0 rgba(212, 212, 212, 0.85);
    border-radius: .08rem;
    padding: .12rem;
    position: relative;
}

.counselor-info-avatar {
    display: inline-block;
    vertical-align: middle;
    width: .46rem;
    height: .46rem;
    border-radius: 50%;
    font-size: .46rem;
    line-height: .46rem;
    color: #ddd;
    background-size: 100%;
    background-position: center center;
    cursor: pointer;
}

.counselor-info-avatar .a-href {
    display: inline-block;
    width: .46rem;
    height: .4rem;
}

.counselor-info-btn {
    float: right;
    width: .88rem;
    height: .34rem;
    background-color: #3069FF;
    border-radius: .17rem;
    margin-top: .065rem;
    font-size: .14rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    line-height: .34rem;
    border: none;
    cursor: pointer;
}

.counselor-info-name {
    width: calc(100% - 1.72rem);
    max-height: .46rem;
    word-break: break-all;
    position: absolute;
    top: .13rem;
    left: .68rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.counselor-info-name .english {
    width: 100%;
    font-size: .16rem;
    color: #2A2A2A;
    line-height: .23rem;
    font-weight: bold;
}

.counselor-info-name-span {
    position: absolute;
    right: .05rem;
    bottom: 0;
    font-weight: bold;
    display: inline-block;
    padding: 0 .11rem 0 .02rem;
    background-color: #FFFFFF;
}

.counselor-info-name .chinese {
    width: 100%;
    font-size: .14rem;
    color: #999999;
    line-height: .17rem;
    margin-top: .04rem;
}

.counselor-remark {
    width: calc(100% - .58rem);
    font-size: .14rem;
    color: #999999;
    margin-left: .58rem;
}

.detail-content {
    margin-top: .32rem;
}

.detail-copyright {
    margin-top: .32rem;
}

.detail-copyright-title {
    font-size: .14rem;
    color: #666666;
    letter-spacing: 0;
    line-height: .17rem;
}

.detail-copyright-content {
    font-size: .14rem;
    color: #999999;
    letter-spacing: 0;
    line-height: .22rem;
    margin-top: .08rem;
}

.total-statistics {
    width: 100%;
    padding: .1rem .12rem;
    background-color: #F6F6F6;
    box-sizing: border-box;
    height: 1rem;
    text-align: center;
}

.total-statistics-box {
    border-radius: .08rem;
    padding: .16rem .04rem;
    background-color: #ffffff;
}

.total-statistics-block {
    display: inline-block;
    width: 33.3%;
    text-align: center;
}

.total-statistics-top {
    color: #3364E4;
}

.total-statistics-top .num {
    display: inline-block;
    vertical-align: middle;
    font-size: .2rem;
    line-height: .2rem;
    font-weight: bold;
    max-width: calc(100% - .26rem);
}

.total-statistics-top .unit {
    display: inline-block;
    vertical-align: middle;
    font-size: .12rem;
    line-height: .15rem;
    margin-left: -.04rem;
}

.total-statistics-bottom {
    width: 100%;
    font-size: .13rem;
    color: #666666;
    line-height: .16rem;
    margin-top: .06rem;
}

.background-gray-bar {
    height: .1rem;
    width: 100%;
    background-color: #F6F6F6;
}

.article-list {
    width: 100%;
    padding: 0 .12rem;
    background-color: #fff;
    padding-top: .16rem;
}

.share-from-tip-box {
    width: 100%;
    text-align: center;
    font-size: .13rem;
    color: #999999;
    line-height: .16rem;
    padding-bottom: .04rem;
}

.article-block {
    width: 100%;
    height: 1.07rem;
    padding: .16rem 0;
    border-bottom: .005rem solid #eeeeee;
}

.article-block-left {
    position: relative;
    float: left;
    width: calc(100% - 1.32rem);
    height: 100%;
    margin-right: .12rem;
}

.article-block-title {
    font-size: .16rem;
    color: #2A2A2A;
    line-height: .22rem;
    height: .44rem;
    position: relative;
    /* cursor: pointer; */
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.article-block-title span {
    display: block;
}

.article-block-title .after {
    display: inline-block;
    position: absolute;
    bottom: 0;
    right: .03rem;
    padding: 0 .02rem;
    background-color: #fff;
}

.article-block-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: .12rem;
    color: #999999;
    line-height: .2rem;
    width: 100%;
}

.article-block-img {
    float: left;
    width: 1.2rem;
    height: .75rem;
    border-radius: .04rem;
    background-color: #eee;
}

.box-interval {
    width: 100%;
    height: 1px;
}

.detail-content-empty {
    font-size: .17rem;
    color: #BBBBBB;
    line-height: .29rem;
    margin-bottom: .72rem;
}

.transparent-mask {
    width: 100%;
    height: .64rem;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
}
</style>

<style>
.video-js .vjs-big-play-button {
    top: 50% !important;
    left: 50% !important;
    transform: translateX(-50%) translateY(-50%) !important;
}

.vjs-big-play-centered .vjs-big-play-button {
    margin-top: auto !important;
    margin-left: auto !important;
}

*,
body,
html {
    position: initial;
}
</style>
