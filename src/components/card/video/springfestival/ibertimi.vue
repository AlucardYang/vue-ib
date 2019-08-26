<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template animated fadeIn fast delay-1s">
            <img class="card-bag-bottom animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/bagbottom.png">
            <img class="card-card animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/card.png">
            <img class="card-cloud-bottom animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/cloudbottom.png">
            <img class="card-bag-top animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/bagtop.png">
            <img class="card-happy animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/happy.png">
            <img class="card-blessing animated fadeIn slower delay-3s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/blessing.png" :style="{'bottom': inApp ? '1.28rem' : '1.44rem'}">
            <img class="card-robot animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/robot.png">
            <img class="card-cloud-top animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/cloudtop.png">
            <img class="card-left-top-grain animated fadeInLeft slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/lefttopgrain.png">
            <img class="card-left-bottom-grain animated fadeInLeft slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/leftbottomgrain.png">
            <img class="card-right-bottom-grain animated fadeInRight slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/videoibertimi/rightbottomgrain.png">
            <div class="card-main-content animated fadeIn slower delay-2s">
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
                <div class="video-image animated fadeIn slower delay-2s">
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
    name: 'SpringFestivalIberTimi',
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
    background-size: 100% 100%;
    background-repeat: no-repeat;
    overflow: hidden;
    background-color: #E3190A;
}

.card-main-content {
    width: 100%;
    left: 0;
    height: 50%;
    min-height: 2.5rem;
    position: absolute;
    text-align: center;
    top: 14%;
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
    max-width: 1.26rem;
    font-weight: bold;
}

.head-image-box {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    background-color: rgb(255, 255, 255);
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
    line-height: .4rem;
    font-size: .4rem;
    cursor: pointer;
}

.video-image {
    position: absolute;
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - .88rem);
    height: auto;
    background-color: #FFF6FA;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    border: .03rem solid #e21508;
    border-radius: .04rem;
}

.video-content {
    width: 100%;
    overflow: hidden;
    border-radius: .02rem;
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
    top: 74%;
    left: 0;
    height: 20%;
}

.card-bag-bottom {
    position: absolute;
    width: calc(100% - .22rem);
    bottom: 17%;
    left: .11rem;
}

.card-card {
    position: absolute;
    width: calc(100% - .44rem);
    height: calc(100% - 1.54rem);
    bottom: 1.3rem;
    left: .22rem;
}

.card-cloud-bottom {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: -0.02rem;
}

.card-bag-top {
    position: absolute;
    width: calc(100% - .22rem);
    bottom: 0;
    left: .11rem;
}

.card-happy {
    position: absolute;
    width: 2.16rem;
    top: 8%;
    left: calc(50% - 1.08rem);
}

.card-blessing {
    position: absolute;
    width: .78rem;
    bottom: 1.44rem;
    left: calc(50% - .39rem);
}

.card-robot {
    position: absolute;
    width: 1.16rem;
    bottom: 0rem;
    left: calc(50% - .58rem);
}

.card-cloud-top {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: -0.02rem;
}

.card-left-top-grain {
    width: 1.15rem;
    position: absolute;
    left: 0;
    top: 10%;
}

.card-left-bottom-grain {
    width: .7rem;
    position: absolute;
    left: 0;
    bottom: 17%;
}

.card-right-bottom-grain {
    width: .68rem;
    position: absolute;
    right: 0;
    bottom: 23%;
}
</style>