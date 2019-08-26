<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-snowflake animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/christmas/videoblueelk/snowflake.png">
            <img class="video-christmas animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/christmas/videoblueelk/christmas.png">
            <div class="card-main-content" :style="{'bottom': $parent.inIphoneX ? '0%' : '-.6rem'}">
                <div class="card-from animated fadeInUp slower delay-3s">
                    <div class="head-image-box">
                        <img v-if="$parent.agentInfo.avatar" class="head-image" :src="$parent.agentInfo.avatar" @click="$parent.goAgentPage">
                        <i v-if="!$parent.agentInfo.avatar" class="iconfont head-image" @click="$parent.goAgentPage">&#xe685;</i>
                    </div>
                    <div class="from-wish">
                        <span>{{$parent.this_from}}</span>
                        <span class="from-user-name com-nowrap">{{$parent.agentInfo.nickname}}</span>
                        <span>{{$parent.festival_wish}}</span>
                    </div>
                </div>
                <img class="card-elk animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/christmas/videoblueelk/elk.png" :style="{'bottom': height600 ? '10%' : '14%'}">
                <img class="card-bottomanimal animated fadeInUp slow delay-2s" src="https://static.iberhk.com/v2/web/images/card/christmas/videoblueelk/bottomanimal.png">
                <div class="video-image animated fadeInUp slower delay-2s">
                    <img class="card-left-tree animated fadeInLeft slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/christmas/videoblueelk/lefttree.png">
                    <img class="card-right-tree animated fadeInRight slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/christmas/videoblueelk/righttree.png">
                    <div class="video-content">
                        <img class="full-content" :style="{'opacity': $parent.videoSrc ? 0 : 1}" src="https://static.iberhk.com/v2/web/images/card/defalutgirl.png">
                        <div class="video-mask" :class="{'video-mask-light': $parent.videoSrc}"></div>
                        <video id="videoPlayer" v-if="$parent.videoSrc" class="video-area video-js vjs-big-play-centered" webkit-playsinline playsinline controlslist="nodownload"><source :src="$parent.videoSrc" type="video/mp4"><source :src="$parent.videoWebmSrc" type="video/webm"></video>
                        <div v-show="!$parent.videoSrc" class="video-tip">{{$parent.no_upload}}</div>
                        <span v-show="!$parent.videoSrc" class="video-max-time">{{$parent.max_video_time}}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: 'ChristmasBlueElk',
    data() {
        return {
            height600: window.screen.height <= 600 ? true : false,
        };
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/christmas/videoblueelk/shareimg.png');
        // 异步加载video.min.js
        const _this = this;
        CommonJS.loadScript('https://static.iberhk.com/res/js/video.min.js', () => {
            _this.$parent.getCardInfo().then(res => {
                setTimeout(() => {
                    _this.$parent.initCard();
                }, 100);
            });
        });
    },
    mounted() {},
    destroyed() {},
    methods: {}
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style src="@/components/card/resetvideo.css">

</style>

<style>
.video-js .vjs-control-bar {
    width: 90%;
    left: 5%;
}

.video-js .vjs-control {
    width: 16%;
}

.video-js .vjs-time-control {
    padding-left: 0;
    padding-right: 0;
}
</style>

<style scoped>
.full-content {
    width: 100%;
}

.card-template-box {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('https://static.iberhk.com/v2/web/images/card/christmas/videoblueelk/bg.png');
}

.card-template {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    overflow: hidden;
}

.card-main-content {
    width: 100%;
    height: 76%;
    min-height: 4.65rem;
    position: absolute;
    text-align: center;
}

.card-from {
    position: absolute;
    left: calc(50% - 1.3rem);
    bottom: calc(21% + 1.4rem);
    width: 2.6rem;
    text-align: center;
    color: #fff;
    height: 12%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
}

.from-wish {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    font-size: .14rem;
    line-height: .28rem;
    color: #2A2A2A;
    padding-left: .06rem;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .14rem;
    line-height: .28rem;
    max-width: 1rem;
    font-weight: bold;
}

.head-image-box {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    background-color: rgb(255, 255, 255);
    border: .01rem solid #fff;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
}

.head-image {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: #DDDDDD;
    line-height: .37rem;
    font-size: .37rem;
    cursor: pointer;
}

.video-image {
    position: absolute;
    bottom: 22%;
    left: calc(50% - 1.25rem);
    width: 2.5rem;
    border-radius: .06rem;
    background-color: #FFF6FA;
}

.video-content {
    position: relative;
    width: 100%;
    border-radius: .06rem;
    overflow: hidden;
}

.video-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
}

.video-tip {
    position: absolute;
    width: .6rem;
    height: .32rem;
    line-height: .16rem;
    text-align: center;
    color: #fff;
    font-size: .16rem;
    border: 1px solid #FFFFFF;
    border-radius: .04rem;
    top: calc(50% - .16rem);
    left: calc(50% - .3rem);
    box-sizing: border-box;
    padding: .07rem 0;
    bottom: 2.1rem;
    z-index: 2;
}

.video-max-time {
    position: absolute;
    display: block;
    font-size: .12rem;
    color: #FFFFFF;
    font-weight: bold;
    right: 3%;
    bottom: 1%;
    z-index: 2;
}

.thank-reply-button {
    display: inline-block;
    vertical-align: middle;
    border-radius: .29rem;
    width: 1.8rem;
    height: 0.36rem;
    color: rgb(223, 61, 110);
    border: .01rem solid rgb(225, 87, 132);
    font-size: 0.16rem;
    line-height: 0.36rem;
    background-color: rgb(255, 255, 255);
    text-align: center;
    margin: 4% 0 0;
    animation: toLarge 3s infinite;
}

@keyframes toLarge {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

.card-text-div {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
}

.card-left-tree {
    position: absolute;
    top: -13%;
    left: -29%;
    height: 124%;
    z-index: 4;
}

.card-right-tree {
    position: absolute;
    top: -13%;
    right: -34%;
    height: 140%;
    z-index: 4;
}

.video-happy-box {
    position: relative;
    width: 100%;
    height: 28%;
    min-height: .76rem;
}

.card-snowflake {
    position: absolute;
    left: 0;
    top: -.07rem;
    width: 100%;
}

.card-elk {
    position: absolute;
    left: 0;
    bottom: 14%;
    width: 100%;
}

.card-bottomanimal {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
}

.video-christmas {
    position: absolute;
    top: 8%;
    left: 24%;
    transform: translateY(-50%);
    width: 52%;
    z-index: 10;
}

.video-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    top: 0;
    left: 0;
    background-image: linear-gradient(to bottom, #000 0%, #999 20%, #999 80%, #000 100%);
    opacity: .5;
}

.video-mask-light {
    background-color: rgba(0, 0, 0, .2);
}
</style>
