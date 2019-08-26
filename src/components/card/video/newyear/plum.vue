<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-border animated fadeIn slower" src="https://static.iberhk.com/v2/web/images/card/newyear/videoplum/border.png">
            <img class="card-top-plum animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/newyear/videoplum/topplum.png">
            <div class="card-main-content animated fadeInUp slower delay-1s">
                <img class="video-newyear animated fadeInDown slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/newyear/videoplum/newyear.png">
                <div class="video-image">
                    <img class="card-top-decoration animated fadeIn slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/newyear/videoplum/topdecoration.png">
                    <img class="card-left-window" src="https://static.iberhk.com/v2/web/images/card/newyear/videoplum/leftwindow.png">
                    <img class="card-top-window" src="https://static.iberhk.com/v2/web/images/card/newyear/videoplum/topwindow.png">
                    <img class="card-right-window" src="https://static.iberhk.com/v2/web/images/card/newyear/videoplum/rightwindow.png">
                    <img class="card-bottom-window" src="https://static.iberhk.com/v2/web/images/card/newyear/videoplum/bottomwindow.png">
                    <div class="video-content">
                        <img class="full-content" :style="{'opacity': $parent.videoSrc ? 0 : 1}" src="https://static.iberhk.com/v2/web/images/card/defalutgirl.png">
                        <div class="video-mask" :class="{'video-mask-light': $parent.videoSrc}"></div>
                        <video id="videoPlayer" v-if="$parent.videoSrc" class="video-area video-js vjs-big-play-centered" webkit-playsinline playsinline controlslist="nodownload"><source :src="$parent.videoSrc" type="video/mp4"><source :src="$parent.videoWebmSrc" type="video/webm"></video>
                        <div v-show="!$parent.videoSrc" class="video-tip">{{$parent.no_upload}}</div>
                        <span v-show="!$parent.videoSrc" class="video-max-time">{{$parent.max_video_time}}</span>
                    </div>
                </div>
                <div class="card-from animated fadeInUp slower delay-2s">
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
            <img class="card-bottom-decoration animated fadeInUp slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/newyear/videoplum/bottomdecoration.png">
            <img class="card-bottom-plum animated fadeInUp slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/newyear/videoplum/bottomplum.png">
        </div>
    </section>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: 'NewYearPlum',
    data() {
        return {};
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/newyear/videoplum/shareimg.png');
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
    width: 64%;
    left: 18%;
}

.video-js .vjs-control {
    width: 15%;
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
    background-image: url('https://static.iberhk.com/v2/web/images/card/newyear/videoplum/bg.png');
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
    height: 66%;
    position: absolute;
    text-align: center;
    top: 18%;
}

.card-from {
    position: absolute;
    left: calc(50% - 1.5rem);
    top: 87%;
    width: 3rem;
    text-align: center;
    color: #923F1A;
    height: 12%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 8;
}

.from-wish {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    font-size: .14rem;
    line-height: .28rem;
    color: #923F1A;
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
    border: .02rem solid #F2223E;
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
    top: 33%;
    left: calc(50% - 1.58rem);
    width: 3.16rem;
    height: 1.84rem;
}

.video-content {
    position: absolute;
    width: 98%;
    top: 2.5%;
    left: 1%;
    overflow: hidden;
}

.video-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
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

.card-border {
    position: absolute;
    top: 2%;
    left: 2%;
    width: 96%;
    height: 96%;
}

.card-top-decoration {
    position: absolute;
    width: 18%;
    top: -16%;
    right: 0%;
    z-index: 7;
}

.card-bottom-decoration {
    position: absolute;
    bottom: .35rem;
    left: 32%;
    width: 17%;
    z-index: 7;
}

.video-happy-box {
    position: relative;
    width: 100%;
    height: 28%;
    min-height: .76rem;
}

.card-top-plum {
    position: absolute;
    left: 0;
    top: 0rem;
    width: 100%;
}

.card-santa {
    position: absolute;
    left: 8%;
    bottom: 14%;
    width: 84%;
}

.card-bottom-plum {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
}

.video-newyear {
    position: absolute;
    top: 0%;
    left: 20%;
    transform: translateY(-50%);
    width: 60%;
}

.card-window {
    width: 100%;
    z-index: 7;
}

.card-left-window,
.card-right-window {
    position: absolute;
    right: 0;
    top: 0;
    width: 19%;
    z-index: 7;
}

.card-left-window {
    left: 0;
}

.card-top-window {
    position: absolute;
    top: 0;
    left: 19%;
    width: 62%;
    z-index: 7;
}

.card-bottom-window {
    position: absolute;
    bottom: 0;
    left: 19%;
    width: 62%;
    z-index: 7;
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