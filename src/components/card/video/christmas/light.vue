<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-snow animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/christmas/videolight/snow.png">
            <img class="video-christmas animated fadeInDown slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/christmas/videolight/christmas.png">
            <div class="card-main-content animated fadeInUp slower delay-1s">
                <div class="card-from animated fadeInDown slower delay-2s">
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
                <div class="video-image" :style="{'margin-top': $parent.inIphoneX ? '0' : '-.47rem'}">
                    <img class="card-light-top" src="https://static.iberhk.com/v2/web/images/card/christmas/videolight/lighttop.png">
                    <img class="card-light-bottom" src="https://static.iberhk.com/v2/web/images/card/christmas/videolight/lightbottom.png">
                    <div class="video-content">
                        <img class="full-content" :style="{'opacity': $parent.videoSrc ? 0 : 1}" src="https://static.iberhk.com/v2/web/images/card/defalutgirl.png">
                        <div class="video-mask" :class="{'video-mask-light': $parent.videoSrc}"></div>
                        <video id="videoPlayer" v-if="$parent.videoSrc" class="video-area video-js vjs-big-play-centered" webkit-playsinline playsinline controlslist="nodownload"><source :src="$parent.videoSrc" type="video/mp4"><source :src="$parent.videoWebmSrc" type="video/webm"></video>
                        <div v-show="!$parent.videoSrc" class="video-tip">{{$parent.no_upload}}</div>
                        <span v-show="!$parent.videoSrc" class="video-max-time">{{$parent.max_video_time}}</span>
                    </div>
                </div>
            </div>
            <img class="card-santa animated fadeInUp slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/christmas/videolight/santa.png">
        </div>
    </section>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: 'ChristmasLight',
    data() {
        return {};
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/christmas/videolight/shareimg.png');
        // 异步加载video.min.js
        const _this = this;
        CommonJS.loadScript('https://static.iberhk.com/res/js/video.min.js', () => {
            _this.$parent.getCardInfo().then(res => {
                setTimeout(() => {
                    _this.$parent.initCard();
                    // 设置左右两边灯光
                    let img1 = document.createElement('img');
                    img1.src = 'https://static.iberhk.com/v2/web/images/card/christmas/videolight/lightleft.png';
                    img1.className = 'card-light-left';
                    var img2 = document.createElement('img');
                    img2.src = 'https://static.iberhk.com/v2/web/images/card/christmas/videolight/lightright.png';
                    img2.className = 'card-light-right';
                    if (_this.$parent.videoSrc) {
                        document.querySelector('.video-js').appendChild(img1);
                        document.querySelector('.video-js').appendChild(img2);
                        _this.$parent.videoPlayer.on(_this.$parent.videoPlayer, 'fullscreenchange', function() {
                            let display = (_this.$parent.videoSrc && _this.$parent.videoPlayer.isFullscreen() ? 'none' : 'block');
                            document.querySelector('.card-light-left').style.display = display;
                            document.querySelector('.card-light-right').style.display = display;
                        });
                    } else {
                        document.querySelector('.video-content').appendChild(img1);
                        document.querySelector('.video-content').appendChild(img2);
                    }
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
    width: 90%;
    left: 5%;
    bottom: 3%;
    border-radius: 0 0 .2rem .2rem;
}

.video-js .vjs-control {
    width: 16%;
}

.video-js .vjs-tech {
    border-radius: .3rem;
}

.vjs-poster {
    border-radius: .3rem;
}
</style>

<style>
.full-content {
    width: 100%;
    border-radius: .3rem;
}

.card-template-box {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('https://static.iberhk.com/v2/web/images/card/christmas/videolight/bg.png');
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
    height: 54%;
    min-height: 2.8rem;
    max-height: 3.6rem;
    position: absolute;
    text-align: center;
    top: 24%;
}

.card-from {
    width: 100%;
    text-align: center;
    color: #fff;
    height: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    padding: 0 .4rem;
}

.from-wish {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    font-size: .14rem;
    line-height: .28rem;
    color: #fff;
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
    left: calc(50% - 1.78rem);
    width: 3.56rem;
    height: 2.34rem;
    margin-top: -.47rem;
}

.video-content {
    position: absolute;
    left: 12%;
    top: 17%;
    width: 75%;
    border-radius: .2rem;
}

.video-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    border-radius: .3rem;
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
    bottom: 2%;
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

.card-left-hand {
    position: absolute;
    top: 18%;
    left: -5%;
    height: 28%;
    z-index: 4;
}

.card-top-hand {
    position: absolute;
    top: -6%;
    right: 13%;
    width: 14%;
    z-index: 4;
}

.video-happy-box {
    position: relative;
    width: 100%;
    height: 28%;
    min-height: .76rem;
}

.card-snow {
    position: absolute;
    left: 4%;
    top: -.03rem;
    width: 92%;
}

.card-light-left,
.card-light-right {
    position: absolute;
    right: -17%;
    top: -26.4%;
    width: 28.1%;
    z-index: 7;
}

.card-light-left {
    left: -16%;
    width: 28.1%;
}

.card-light-top,
.card-light-bottom {
    position: absolute;
    left: 20.926%;
    bottom: 0%;
    width: 58.152%;
    height: 23.3%;
    z-index: 7;
}

.card-light-top {
    top: 0%;
    height: 21.8%;
}

.card-santa {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
}

.video-christmas {
    position: absolute;
    top: 4%;
    left: 13%;
    width: 74%;
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
    border-radius: .3rem;
}

.video-mask-light {
    background-color: rgba(0, 0, 0, .2);
}
</style>