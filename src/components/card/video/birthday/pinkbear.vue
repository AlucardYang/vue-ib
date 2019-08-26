<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-bear animated fadeInUp slower" src="https://static.iberhk.com/v2/web/images/card/birthday/videopinkbear/bear.png">
            <div class="head-image-box animated fadeIn slower delay-1s">
                <img v-if="$parent.agentInfo.avatar" class="head-image" :src="$parent.agentInfo.avatar" @click="$parent.goAgentPage">
                <i v-if="!$parent.agentInfo.avatar" class="iconfont head-image" @click="$parent.goAgentPage">&#xe685;</i>
            </div>
            <div class="from-wish animated fadeIn slower delay-1s">
                <span>{{$parent.this_from}}</span>
                <span class="from-user-name com-nowrap">{{$parent.agentInfo.nickname}}</span>
                <span>{{$parent.festival_wish}}</span>
            </div>
            <div class="card-main-content">
                <div class="video-happy-box animated fadeIn slower delay-2s">
                    <img class="video-happy" src="https://static.iberhk.com/v2/web/images/card/birthday/videopinkbear/happy.png">
                </div>
                <div class="video-image animated fadeIn slower delay-2s">
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
    name: 'BirthdayPinkBear',
    data() {
        return {};
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/birthday/videopinkbear/shareimg.png');
        // 异步加载video.min.js
        const _this = this;
        CommonJS.loadScript('https://static.iberhk.com/res/js/video.min.js', () => {
            _this.$parent.getCardInfo().then(res => {
                setTimeout(() => {
                    _this.$parent.initCard();
                    // 设置视频两边花瓣
                    let img1 = document.createElement('img');
                    img1.src = 'https://static.iberhk.com/v2/web/images/card/birthday/videopinkbear/leftflower.png';
                    img1.className = 'card-left-flower animated fadeInLeft fast delay-1s';
                    var img2 = document.createElement('img');
                    img2.src = 'https://static.iberhk.com/v2/web/images/card/birthday/videopinkbear/rightflower.png';
                    img2.className = 'card-right-flower animated fadeInRight fast delay-1s';
                    if (_this.$parent.videoSrc) {
                        document.querySelector('.video-js').appendChild(img1);
                        document.querySelector('.video-js').appendChild(img2);
                        _this.$parent.videoPlayer.on(_this.$parent.videoPlayer, 'fullscreenchange', function() {
                            let display = (_this.$parent.videoPlayer.isFullscreen() ? 'none' : 'block');
                            document.querySelector('.card-left-flower').style.display = display;
                            document.querySelector('.card-right-flower').style.display = display;
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
    background-image: url('https://static.iberhk.com/v2/web/images/card/birthday/videopinkbear/bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.card-main-content {
    width: 100%;
    height: 61%;
    min-height: 3.1rem;
    position: absolute;
    text-align: center;
    top: 15%;
}

.head-image-box {
    position: relative;
    width: 100%;
    height: 12%;
    text-align: center;
    min-height: 0.5rem;
}

.head-image {
    position: absolute;
    top: 56%;
    left: calc(50% - .24rem);
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    width: 0.48rem;
    height: 0.48rem;
    border-radius: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: inline-block;
    box-sizing: border-box;
    border: .01rem solid rgb(255, 255, 255);
    color: #DDDDDD;
    line-height: .45rem;
    font-size: .45rem;
    cursor: pointer;
}

.from-wish {
    width: 100%;
    display: block;
    text-align: center;
    font-size: .14rem;
    line-height: .14rem;
    color: rgb(151, 151, 151);
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
    color: #F079AC;
}

.from-user-name {
    font-size: .14rem;
    line-height: .14rem;
    color: #000;
    font-weight: bold;
    max-width: 1.4rem;
    /* margin: 0 .04rem; */
}

.video-image {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 3.2rem;
    padding: .08rem;
    border-radius: .06rem;
    background-color: #FFF6FA;
}

.video-content {
    position: relative;
    width: 100%;
    border-radius: .06rem;
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

.card-left-flower {
    position: absolute;
    top: -11%;
    left: -7.5%;
    height: 115%;
    z-index: 4;
}

.card-right-flower {
    position: absolute;
    top: -11%;
    right: -7.5%;
    height: 115%;
    z-index: 4;
}

.video-happy-box {
    position: relative;
    width: 100%;
    height: 31%;
    min-height: .76rem;
}

.video-happy {
    position: absolute;
    top: 50%;
    left: calc(50% - 1.03rem);
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    display: inline-block;
    vertical-align: middle;
    width: 2.06rem;
}

.card-bear {
    position: absolute;
    bottom: 0;
    left: calc(50% - 1.61rem);
    width: 3.22rem;
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
