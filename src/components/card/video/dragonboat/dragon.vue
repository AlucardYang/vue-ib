<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template animated fadeIn fast delay-1s">
            <img class="card-left-bamboo animated fadeInLeft slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/dragonboat/videodragon/left-bamboo.png">
            <img class="card-right-bamboo animated fadeInRight slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/dragonboat/videodragon/right-bamboo.png">
            <img class="card-zongzi animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/dragonboat/videodragon/zongzi.png">
            <img class="card-left-bottom-cloud animated fadeInLeft slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/dragonboat/videodragon/left-bottom-cloud.png">
            <img class="card-left-top-cloud animated fadeInLeft slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/dragonboat/videodragon/left-top-cloud.png">
            <img class="card-right-cloud animated fadeInRight slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/dragonboat/videodragon/right-cloud.png">
            <img class="card-dragon animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/dragonboat/videodragon/dragon.png">
            <div class="card-main-content animated fadeIn slower delay-3s">
                <div class="video-image">
                    <img class="card-reel" src="https://static.iberhk.com/v2/web/images/card/dragonboat/videodragon/reel.png">
                    <div class="video-content">
                        <img class="full-content" :style="{'opacity': $parent.videoSrc ? 0 : 1}" src="https://static.iberhk.com/v2/web/images/card/defalutgirl.png">
                        <div class="video-mask" :class="{'video-mask-light': $parent.videoSrc}"></div>
                        <video id="videoPlayer" v-if="$parent.videoSrc" class="video-area video-js vjs-big-play-centered" webkit-playsinline playsinline controlslist="nodownload"><source :src="$parent.videoSrc" type="video/mp4"><source :src="$parent.videoWebmSrc" type="video/webm"></video>
                        <div v-show="!$parent.videoSrc" class="video-tip">{{$parent.no_upload}}</div>
                        <span v-show="!$parent.videoSrc" class="video-max-time">{{$parent.max_video_time}}</span>
                    </div>
                </div>
                <div class="card-from animated fadeIn slower delay-3s">
                    <div class="from-wish">
                        <span class="from-user-name com-nowrap">{{$parent.agentInfo.nickname}}</span>
                    </div>
                    <div class="head-image-box">
                        <img v-if="$parent.agentInfo.avatar" class="head-image" :src="$parent.agentInfo.avatar" @click="$parent.goAgentPage">
                        <i v-if="!$parent.agentInfo.avatar" class="iconfont head-image" @click="$parent.goAgentPage">&#xe685;</i>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: 'DragonBoatDragon',
    data() {
        return {};
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = 'https://static.iberhk.com/v2/web/images/card/dragonboat/videodragon/shareimg.png';
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
    background-image: url('https://static.iberhk.com/v2/web/images/card/dragonboat/videodragon/bg.png');
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
    left: 0;
    height: 64%;
    min-height: 2.5rem;
    position: absolute;
    text-align: center;
    top: 18%;
}

.card-from {
    position: absolute;
    bottom: 23%;
    left: .5rem;
    width: calc(100% - 1rem);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20%;
    z-index: 2;
}

.from-wish {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    font-size: .15rem;
    line-height: .28rem;
    color: #FFFFFF;
    padding-right: .08rem;
    max-width: calc(100% - .46rem);
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .14rem;
    line-height: .28rem;
    font-weight: bold;
    width: 100%;
}

.head-image-box {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
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
    font-size: .41rem;
    cursor: pointer;
    border: .02rem solid #FFFFFF;
}

.video-image {
    position: absolute;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    height: auto;
    left: 50%;
    top: 37%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 0rem;
}

.video-content {
    width: 58%;
    overflow: hidden;
    border-radius: .02rem;
    position: absolute;
    top: 24%;
    left: 21.5%;
    z-index: 4;
    border: .01rem solid #5AC7B0;
    border-radius: .02rem;
}

.video-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    border-radius: .02rem;
    overflow: hidden;
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
    right: 5%;
    bottom: 4%;
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
    bottom: 2%;
    left: 0;
    height: 20%;
}

.card-left-bamboo {
    position: absolute;
    width: 38%;
    left: 0;
    top: 0;
}

.card-right-bamboo {
    position: absolute;
    width: 26%;
    right: 0;
    top: 0;
}

.card-zongzi {
    position: absolute;
    width: 56%;
    left: 22%;
    top: 6%;
}

.card-left-bottom-cloud {
    position: absolute;
    width: 41%;
    left: 0%;
    bottom: 0%;
}

.card-left-top-cloud {
    position: absolute;
    width: 17%;
    left: 0%;
    bottom: 0%;
}

.card-right-cloud {
    position: absolute;
    width: 27%;
    right: 0%;
    bottom: 0%;
}

.card-dragon {
    position: absolute;
    width: 66%;
    left: 17%;
    bottom: 0%;
}

.card-reel {
    width: calc(100% - .36rem);
}
</style>