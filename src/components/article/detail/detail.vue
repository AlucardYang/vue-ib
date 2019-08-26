<template>
    <div v-show="isAllLoaded" id="article">
        <div class="article com-scroll-y" :style="{'height': inApp ? 'calc(100% - 0.48rem)' : '100%', 'padding-bottom': inApp ? '0' : '.4rem'}">
            <div class="article-detail">
                <div v-show="isDetailLoaded" class="article-title">{{detail.title}}</div>
                <div v-show="isDetailLoaded" class="article-from com-nowrap">
                    <span>{{detail.published_at}}</span>&nbsp;&nbsp;&nbsp;
                    <span>{{detail.source}}</span>
                </div>
    
                <article-comment :agent-info="bottomAgentInfo" :message="analyze.card.message" :target-string="'article_uuid'" :target-uuid="articleUuid"></article-comment>

                <div v-show="isDetailLoaded" class="detail-content richText" v-html="detail.content"></div>
                <!-- 标签 -->
                <ul v-show="isDetailLoaded" v-if="!inApp" class="tags-ul clearfix">
                    <li class="theme-feature-block" v-for="(item, index) in detail.tags" :key="index">{{item}}</li>
                </ul>
                <!-- 资讯关联保险产品 -->
                <div v-if="inApp && isDetailOtherLoaded && analyze.relations && analyze.relations.length === 0 && showArticleRelatedProduct" class="relate-product-box" @click="goRelateProduct">
                    <div class="relate-product-title">{{simply ? '相关保险产品' : '相關保險產品'}}</div>
                    <div class="relate-product-desc">{{simply ? '关联后在分享的资讯详情中可见' : '關聯后在分享的資訊詳情中可見'}}</div>
                    <div class="go-relate">{{simply ? '去关联' : '去關聯'}}</div>
                </div>
                <div v-if="analyze.relations && analyze.relations.length > 0" class="relate-product-box" style="padding-bottom: .04rem;">
                    <div class="relate-product-title">{{simply ? '相关保险产品' : '相關保險產品'}}</div>
                    <i v-if="inApp" class="iconfonti relate-product-close" @click="cancelRelateProduct()">&#xe7c8;</i>
                    <ul class="relate-product-list" v-for="(item, index) in analyze.relations" key="index">
                        <li class="relate-product-block" v-for="(item1, index1) in item.content">
                            <img :src="item1.thumbnail" class="list-img" @click="goProductDetail(item1)">
                            <div class="list-content" @click="goProductDetail(item1)">
                                <div class="list-title">
                                    <span class="list-title-span">{{item1.name}}</span>
                                </div>
                                <div class="list-desc">{{item1.abstract}}</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 版权 -->
                <div class="detail-copyright-title">{{copy_right}}</div>
                <div v-if="inApp" class="detail-copyright" style="padding: .04rem 0 0 0;">
                    <div class="detail-copyright-content">{{disclaimer_des}}</div>
                </div>
            </div>
            <div class="article-list-top-background"></div>
            <div v-if="inApp && isDetailOtherLoaded" class="AI-insight">
                <div class="AI-insight-box">
                    <img class="AI-insight-avatar" src="https://static.iberhk.com/v2/web/images/common/robot2.png" alt="">
                    <div class="AI-insight-title">AI 智 能 分 析</div>
                    <div class="AI-insight-desc">{{insight_des}}</div>
                    <div class="AI-insight-desc-2">{{only_you_can_see}}</div>
                    <!-- 主题特点 -->
                    <div v-if="analyze.focus.length > 0" class="theme-feature-title">{{theme_feature}}</div>
                    <ul v-if="analyze.focus.length > 0" class="theme-feature-ul clearfix">
                        <li class="theme-feature-block" v-for="(item, index) in analyze.focus" :key="index">{{item}}</li>
                    </ul>
                    <!-- 可能感兴趣的圈子好友 -->
                    <div v-if="analyze.interested_clients && (analyze.interested_clients.length > 0) && isPro" class="theme-feature-title">{{interest_friends}}</div>
                    <ul v-if="analyze.interested_clients && (analyze.interested_clients.length > 0) && isPro" class="interest-friends clearfix">
                        <li class="interest-friends-block" v-for="(item, index) in analyze.interested_clients" :key="index" @click="goFriendDetail(item.c_user_uuid)">
                            <img class="interest-friends-avatar" :src="item.avatar">
                            <div class="interest-friends-name com-nowrap">{{item.name}}</div>
                        </li>
                        <!-- <li class="interest-friends-more">
                            <i class="iconfont interest-friends-more-icon">&#xe60e;</i>
                        </li> -->
                    </ul>
                    <!-- 社交媒体分享 -->
                    <div v-if="analyze.share_time.length > 0 && isPro" class="theme-feature-title">
                        <span>{{social_media}}</span>
                        <div v-if="showArticleSmartAlert" class="social-media-smart-alert" @click="smartAlert()" :style="{'color': (analyze.todo_info && analyze.todo_info['todo_uuid']) ? '#999999' : '#3364E4'}">
                            <i class="iconfonti">&#xe661;</i>
                            <span v-if="analyze.todo_info['todo_uuid']">{{simply ? '修改提醒时间' : '修改提醒時間'}}</span>
                            <span v-if="!analyze.todo_info['todo_uuid']">智能提醒</span>
                        </div>
                    </div>
                    <ul v-if="analyze.share_time.length > 0 && isPro">
                        <li class="social-media-share" v-for="(item, index) in analyze.share_time" :key="index">
                            <span>{{share_time_text1}}</span>
                            <span class="time-tip">{{item.time}}</span>
                            <span>{{share_time_text2}}</span><!--
                            --><span v-if="item.promote != 0">，{{share_time_text3}}</span>
                            <span v-if="item.promote != 0" class="time-tip">{{item.promote}}</span>
                            <span v-if="item.promote != 0">{{share_time_text4}}</span>
                        </li>
                    </ul>
                    <!-- 推荐文章 -->
                    <div v-if="analyze.focus_article.length > 0 && isPro" class="theme-feature-title">{{recommended_article}}</div>
                    <ul v-if="analyze.focus_article.length > 0 && isPro" class="recommend-article">
                        <li class="recommend-article-li com-nowrap" v-for="(item, index) in analyze.focus_article" :key="index" @click="goAppArticleDetail(item.uuid)">
                            <span>•</span>
                            <span class="recommend-article-title">{{item.title}}</span>
                        </li>
                    </ul>
                    <pro-btn v-if="!isPro" :suggest="simply ? '升级iBer Pro查看更多分析' : '升級iBer Pro查看更多分析'"></pro-btn>
                </div>
                <share-data :analyze="analyze" style="padding: .12rem 0 0 0;"></share-data>
            </div>
            <consultant-card :user-uuid="userUuid" :target-uuid="articleUuid" :from-type="'11'" :share-from="true" @getAgentInfo="getAgentInfo"></consultant-card>
            <!-- 顾问分享文章列表 -->
            <ul v-if="!inApp && (analyze.share_list.length > 0) && (moreShare !== 'hide')" class="article-list">
                <li class="share-from-tip-box">
                    <div class="top">
                        <span style="color: #ddd">————</span>
                        <span>&nbsp;更多分享&nbsp;</span>
                        <span style="color: #ddd">————</span>
                    </div>
                </li>
                <li class="article-block" v-for="(item, index) in analyze.share_list" :key="index" @click="goArticleDetail(item.uuid, 0)">
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
            <div v-if="!inApp" class="detail-copyright">
                <div class="detail-copyright-content">{{disclaimer_des}}</div>
            </div>
            <div class="placeholder-blank"></div>
        </div>
        <share-btn :share="share" :setting="shareSetting"></share-btn>
        <like-btn v-show="showLikeBtn" :share="share" :is-like="analyze.approval"></like-btn>
        <com-agent-avatar :params="comAARData"></com-agent-avatar>
    </div>
</template>

<script src="./detail.js">

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./detail.css">

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
