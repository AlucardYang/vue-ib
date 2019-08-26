<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template animated fadeIn fast delay-1s">
            <img class="card-lantern animated fadeInLeft slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/lantern.png">
            <img class="video-2019 animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/2019.png">
            <img class="card-decoration animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/decoration.png">
            <img class="card-money animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/money.png">
            <div class="video-happy-box animated fadeInDown slower delay-1s">
                <div class="card-from animated fadeIn slower delay-2s">
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
            </div>
            <div class="card-main-content animated fadeIn slower delay-2s">
                <img class="video-grain" src="https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/grain.png">
                <div class="video-image animated fadeIn slower delay-2s">
                    <img class="video-left-border" src="https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/leftborder.png">
                    <img class="video-top-border" src="https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/topborder.png">
                    <img class="video-right-border" src="https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/rightborder.png">
                    <img class="video-bottom-border" src="https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/bottomborder.png">
                    <div class="video-content">
                        <img class="full-content" :style="{'opacity': $parent.videoSrc ? 0 : 1}" src="https://static.iberhk.com/v2/web/images/card/springfestivaldefalut.png">
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
    name: 'SpringFestivalNewSpring',
    data() {
        return {};
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/shareimg.png');
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
.video-js .vjs-time-control {
    padding-left: 0;
    padding-right: 0;
}

.video-js .vjs-control-bar {
    width: 84%;
    left: 8%;
    bottom: 2%;
}

.video-js .vjs-control {
    width: 16%;
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
}

.card-template {
    width: 100%;
    height: 100%;
    background-image: url('https://static.iberhk.com/v2/web/images/card/springfestival/videonewspring/bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    overflow: hidden;
}

.card-main-content {
    width: 100%;
    left: 0;
    height: 50%;
    min-height: 2.5rem;
    position: absolute;
    text-align: center;
    top: 26%;
}

.card-from {
    width: 100%;
    text-align: center;
    color: #fff;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 .2rem;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}

.from-wish {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    font-size: .14rem;
    line-height: .28rem;
    color: #FEEAAA;
    padding-left: .06rem;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .14rem;
    line-height: .28rem;
    max-width: 1.3rem;
    font-weight: bold;
}

.head-image-box {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    background-color: rgb(255, 255, 255);
    width: 0.44rem;
    height: 0.44rem;
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
    line-height: .4rem;
    font-size: .4rem;
    border: .02rem solid #fff;
    cursor: pointer;
}

.video-image {
    position: absolute;
    display: inline-block;
    vertical-align: middle;
    width: 3.28rem;
    height: 1.85rem;
    background-color: #FFF6FA;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
}

.video-content {
    position: absolute;
    width: 94%;
    overflow: hidden;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
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
    right: 7%;
    bottom: 9%;
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

.video-happy-box {
    position: absolute;
    width: 100%;
    min-height: .76rem;
    top: 20%;
    left: 0;
    height: 20%;
}

.video-2019 {
    position: absolute;
    top: -.2rem;
    right: 5%;
    width: 51%;
}

.card-lantern {
    position: absolute;
    top: -.14rem;
    left: -.14rem;
    width: 74%;
}

.card-money {
    position: absolute;
    bottom: -.14rem;
    left: -.14rem;
    width: calc(100% + .28rem);
    z-index: 2;
}

.video-grain {
    width: 80%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    opacity: .2;
}

.card-decoration {
    position: absolute;
    left: -.14rem;
    bottom: 26%;
    width: 16%;
}

.video-left-border,
.video-right-border {
    position: absolute;
    right: 0;
    top: 0;
    width: 12.815%;
    z-index: 7;
}

.video-left-border {
    left: 0;
}

.video-top-border,
.video-bottom-border {
    position: absolute;
    left: 12.8%;
    bottom: -1.2%;
    width: 74.5%;
    z-index: 8;
}

.video-top-border {
    top: 0;
}
</style>