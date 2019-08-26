<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-left-flower animated fadeInLeft fast delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/videoflowerfilm/leftflower.png">
            <img class="card-right-flower animated fadeInRight fast delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/videoflowerfilm/rightflower.png">
            <img class="card-leaf animated fadeInUp fast delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/videoflowerfilm/leaf.png">
            <div class="card-main-content">
                <div class="head-image-box animated fadeIn slower delay-1s">
                    <img v-if="$parent.agentInfo.avatar" class="head-image" :src="$parent.agentInfo.avatar" @click="$parent.goAgentPage">
                    <i v-if="!$parent.agentInfo.avatar" class="iconfont head-image" @click="$parent.goAgentPage">&#xe685;</i>
                </div>
                <div class="from-wish animated fadeIn slower delay-1s">
                    <span>{{$parent.this_from}}</span>
                    <span class="from-user-name com-nowrap">{{$parent.agentInfo.nickname}}</span>
                    <span>{{$parent.festival_wish}}</span>
                </div>
                <div class="video2-happy-box animated fadeIn slower delay-2s">
                    <img class="video2-happy" src="https://static.iberhk.com/v2/web/images/card/birthday/videoflowerfilm/happy.png">
                </div>
                <div class="video-image animated fadeIn slower delay-2s">
                    <img class="full-content" src="https://static.iberhk.com/v2/web/images/card/birthday/videoflowerfilm/film.png">
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
    name: 'BirthdayFlowerFilm',
    data() {
        return {};
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/birthday/videoflowerfilm/shareimg.png');
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
    position: absolute;
    width: 100%;
    height: 100%;
}

.card-main-content {
    width: 100%;
    height: 70%;
    min-height: 4.65rem;
    position: absolute;
    text-align: center;
    bottom: 10%;
}

.head-image-box {
    position: relative;
    width: 100%;
    height: 13%;
    text-align: center;
    min-height: 0.5rem;
}

.head-image {
    position: absolute;
    top: 50%;
    left: calc(50% - .25rem);
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: inline-block;
    box-sizing: border-box;
    border: .01rem solid rgb(222, 223, 224);
    color: #DDDDDD;
    line-height: .47rem;
    font-size: .47rem;
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
    color: #151515;
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
    width: 90%;
}

.video-content {
    position: absolute;
    width: 90%;
    left: 5%;
    top: 12.5%;
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

.card-left-flower {
    position: absolute;
    top: 0;
    left: 0;
    height: 19%;
}

.card-right-flower {
    position: absolute;
    top: 0;
    right: 0;
    height: 19%;
}

.video2-happy-box {
    position: relative;
    width: 100%;
    height: 28%;
    min-height: .76rem;
}

.video2-happy {
    position: absolute;
    top: 50%;
    left: calc(50% - 1.2rem);
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    display: inline-block;
    vertical-align: middle;
    width: 2.4rem;
}

.card-leaf {
    position: absolute;
    bottom: .1rem;
    left: calc(50% - 1.3rem);
    width: 2.6rem;
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