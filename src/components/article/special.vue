<template>
    <div class="article-special com-scroll-y">
        <div class="article-special-top-box">
            <img class="article-special-img" :src="special.img" />
            <!-- <i class="iconfont article-special-back">&#xe76a;</i> -->
            <!-- <div class="article-special-right">{{/cn/ig.test(language.currentLang) ? '专题' : '專題'}}</div> -->
            <div class="title-mask-bg"></div>
            <div class="article-special-title com-nowrap">{{special.title}}</div>
        </div>
        <div class="article-special-desc">{{special.brief}}</div>
        <ul class="article-special-list">
            <li class="article-special-block" v-for="(item, index) in specialList" :key="index" :class="{'border-transparent': index === specialList.length - 1}" @click="goArticleDetail(item.uuid)">
                <div class="article-special-block-left">
                    <div class="article-special-block-title">
                        <span>{{item.title}}</span>
                    </div>
                    <div class="article-special-block-bottom com-nowrap">
                        <span>{{item.published_at}}</span>&nbsp;&nbsp;
                        <span>{{item.source}}</span>
                    </div>
                </div>
                <img class="article-special-block-img" :src="item.img">
            </li>
        </ul>
        <div v-if="allLoaded" class="article-bottom-tip-box">
            <div class="top">
                <span style="color: #ddd">————</span>
                <span>&nbsp;到底啦&nbsp;</span>
                <span style="color: #ddd">————</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ArticleSpecial',
    data() {
        return {
            articleTopicUuid: this['urlParams'] ? this.urlParams['article_topic_uuid'] : (this.$route.query['article_topic_uuid'] ? this.$route.query['article_topic_uuid'] : 'cc7a87e8887311e7a6e06c92bf28e3d2'),
            isLoaded: true,
            special: {
                title: '沙加衝突追蹤報道',
                desc: '沙加事件起因是加拿大政府關切沙特阿拉伯「維權人士」被捕從而惹惱沙特政府，目前加沙衝突愈演愈烈。',
            },
            specialList: [],
            allLoaded: false,
            page: 0,
            height: this.$refs.specialTitle
        }
    },
    components: {},
    created() {
        this.getArticleTopicInfo();
        this.getTopicArticleList();
    },
    mounted() {
        const _this = this;
        document.querySelector(".com-scroll-y").onscroll = function(event) {
            const articleSpecialTopBox = document.querySelector(".article-special-top-box").clientHeight;
            const articleSpecialDesc = document.querySelector(".article-special-desc").clientHeight;
            const articleSpecialList = document.querySelector(".article-special-list").clientHeight;
            if ((event.target.scrollTop + event.target.clientHeight) >= (articleSpecialTopBox + articleSpecialDesc + articleSpecialList - 5)) {
                if (!_this.allLoaded) {
                    _this.getTopicArticleList();
                }
            }
        }
    },
    methods: {
        getArticleTopicInfo() {
            this.$http.get('/article/get-article-topic-info', {
                article_topic_uuid: this.articleTopicUuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.special = res.data;
                }
            })
        },
        getTopicArticleList() {
            this.$root.blueLoadingParams.show = true;
            if (this.isLoaded) {
                this.isLoaded = false;
                this.page += 1;
                this.$http.get('/article/get-topic-article-list', {
                    article_topic_uuid: this.articleTopicUuid,
                    page: this.page
                }).then(res => {
                    this.isLoaded = true;
                    if (res && res.code === 0) {
                        if (res.data.length > 0) {
                            this.allLoaded = (res.data.length < 10) ? true : false;
                            this.specialList = this.specialList.concat(res.data);
                        } else {
                            this.allLoaded = true;
                        }
                    } else {
                        this.allLoaded = true;
                    }
                    this.$root.blueLoadingParams.show = false;
                }, err => {
                    this.isLoaded = true;
                    this.allLoaded = true;
                    this.$root.blueLoadingParams.show = false;
                });
            }
        },
        goArticleDetail(article_uuid) {
            // window.location.href = window.baseUrl + '/article/detail?article_uuid=' + article_uuid + '&user_uuid=' + this.userUuid + 　'&in_app=' + (this.inApp ? '1' : '0');
            this.appFn.commonFn('articleDetail', {
                article_uuid: article_uuid
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.article-special {
    width: 100%;
}

.border-transparent {
    border: 1px solid transparent !important;
}

.article-special-top-box {
    width: 100%;
    height: 2.12rem;
    background-color: #fff;
    position: relative;
}

.article-special-img {
    width: 100%;
    height: 100%;
}

.article-special-back {
    position: absolute;
    left: .12rem;
    top: .3rem;
    color: #fff;
}

.article-special-title {
    position: absolute;
    left: .12rem;
    bottom: .08rem;
    font-size: .24rem;
    color: #FFFFFF;
    line-height: .29rem;
    font-weight: bold;
    width: calc(100% - .24rem);
    min-height: .29rem;
}

.article-special-right {
    position: absolute;
    right: 0;
    top: .28rem;
    width: .51rem;
    height: .28rem;
    line-height: .28rem;
    text-align: center;
    background: #3852EC;
    border-radius: .14rem 0 0 .14rem;
    font-size: .13rem;
    color: #FFFFFF;
}

.article-special-desc {
    padding: .16rem .12rem;
    font-size: .14rem;
    color: #999999;
    letter-spacing: 0;
    line-height: .21rem;
}

.article-special-list {
    width: 100%;
    padding: 0 .12rem;
}

.article-special-block {
    width: 100%;
    height: 1.07rem;
    padding: .16rem 0;
    border-bottom: 1px solid #DDDDDD;
}

.article-special-block-left {
    position: relative;
    float: left;
    width: calc(100% - 1.32rem);
    height: 100%;
    margin-right: .12rem;
}

.article-special-block-title {
    font-size: .16rem;
    color: #2A2A2A;
    line-height: .22rem;
    height: .44rem;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.article-special-block-title span {
    display: block;
}

.article-special-block-title .after {
    display: inline-block;
    position: absolute;
    bottom: 0;
    right: .02rem;
    padding: 0 .02rem;
    background-color: #fff;
}

.article-special-block-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: .12rem;
    color: #999999;
    line-height: .15rem;
    width: 100%;
}

.article-special-block-img {
    float: left;
    width: 1.2rem;
    height: .75rem;
    border-radius: .04rem;
    background-color: #eee;
}

.article-bottom-tip-box {
    width: 100%;
    text-align: center;
    font-size: .13rem;
    color: #999999;
    line-height: .16rem;
    padding: .16rem;
    background-color: #fff;
}

.title-mask-bg {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: .8rem;
    background-image: linear-gradient(to top, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, 0) 100%);
}
</style>
