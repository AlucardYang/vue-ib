<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template animated fadeIn fast delay-1s">
            <img class="card-top-wreath animated fadeInDown fast delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/videopinkwreath/topwreath.png">
            <img ref="bottomWreath" class="card-bottom-wreath animated fadeInUp slower" src="https://static.iberhk.com/v2/web/images/card/birthday/videopinkwreath/bottomwteath.png">
            <div class="card-main-content animated fadeIn slower delay-1s">
                <div class="video-happy-box animated fadeIn slower delay-2s">
                    <img class="video-happy" src="https://static.iberhk.com/v2/web/images/card/birthday/videopinkwreath/happy.png">
                </div>
                <img class="card-top-ribbon animated fadeIn fast delay-2s" src="https://static.iberhk.com/v2/web/images/card/birthday/videopinkwreath/ribbon.png">
                <div class="video-image animated fadeIn slower delay-2s">
                    <div class="video-content">
                        <img class="full-content" :style="{'opacity': $parent.videoSrc ? 0 : 1}" src="https://static.iberhk.com/v2/web/images/card/defalutgirl.png">
                        <div class="video-mask" :class="{'video-mask-light': $parent.videoSrc}"></div>
                        <video id="videoPlayer" v-if="$parent.videoSrc" class="video-area video-js vjs-big-play-centered" webkit-playsinline playsinline controlslist="nodownload"><source :src="$parent.videoSrc" type="video/mp4"><source :src="$parent.videoWebmSrc" type="video/webm"></video>
                        <div v-show="!$parent.videoSrc" class="video-tip">{{$parent.no_upload}}</div>
                        <span v-show="!$parent.videoSrc" class="video-max-time">{{$parent.max_video_time}}</span>
                    </div>
                </div>
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
                <img class="card-pink-line animated fadeIn slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/birthday/videopinkwreath/pinkline.png">
            </div>
        </div>
        <img class="card-left-ripple animated fadeIn slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/birthday/videopinkwreath/ripple.png">
        <img class="card-right-ripple animated fadeIn slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/birthday/videopinkwreath/ripple.png">
    </section>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: 'BirthdayPinkWreath',
    data() {
        return {};
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/birthday/videopinkwreath/shareimg.png');
        // 异步加载video.min.js
        const _this = this;
        CommonJS.loadScript('https://static.iberhk.com/res/js/video.min.js', () => {
            _this.$parent.getCardInfo().then(res => {
                // 延时1秒重置底部花圈左边距离，让其居中
                setTimeout(() => {
                    this.$refs.bottomWreath.style.left = 'calc(50% - ' + this.$refs.bottomWreath.clientWidth / 2 + 'px)';
                }, 1000);
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
    background-image: url('https://static.iberhk.com/v2/web/images/card/birthday/videopinkwreath/bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.card-main-content {
    width: 3.12rem;
    left: calc(50% - 1.56rem);
    height: calc(100% - .8rem);
    min-height: 4.65rem;
    position: absolute;
    text-align: center;
    top: .4rem;
    background-image: url('https://static.iberhk.com/v2/web/images/card/birthday/videopinkwreath/frame.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.card-from {
    width: 2.7rem;
    margin-left: .21rem;
    text-align: center;
    color: #fff;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.from-wish {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    font-size: .14rem;
    line-height: .28rem;
    color: #E84875;
    padding-left: .06rem;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .14rem;
    line-height: .28rem;
    max-width: .8rem;
    font-weight: bold;
}

.head-image-box {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    padding: 0.015rem;
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
    line-height: .37rem;
    font-size: .37rem;
    cursor: pointer;
}

.video-image {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 2.58rem;
    background-color: #FFF6FA;
    margin-top: -10%;
}

.video-content {
    position: relative;
    width: 100%;
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

.video-happy-box {
    position: relative;
    width: 100%;
    height: 40%;
    min-height: .76rem;
}

.video-happy {
    position: absolute;
    top: 63%;
    left: calc(50% - 1.5rem);
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    display: inline-block;
    vertical-align: middle;
    width: 2.74rem;
}

.card-top-wreath {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
}

.card-top-ribbon {
    position: absolute;
    top: 3%;
    left: calc(50% - 1.25rem);
    width: 2.5rem;
}

.card-bottom-wreath {
    position: absolute;
    bottom: 0;
    left: 0;
    max-width: 100%;
    z-index: 1;
    height: 28%;
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

.card-pink-line {
    display: block;
    left: calc(50% - 1.36rem);
    width: 2.7rem;
}

.card-left-ripple {
    width: .36rem;
    position: absolute;
    left: .14rem;
    bottom: 35%;
}

.card-right-ripple {
    width: .36rem;
    position: absolute;
    right: .24rem;
    top: 11%;
}
</style>