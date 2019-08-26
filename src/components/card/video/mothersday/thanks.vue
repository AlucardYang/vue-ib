<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template animated fadeIn fast delay-1s">
            <img class="card-bottom-flower animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/mothersday/videothanks/bottom-flower.png">
            <img class="card-right-flower animated fadeInRight slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/mothersday/videothanks/right-flower.png">
            <img class="card-mothers-day-en animated fadeInDown slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/videothanks/mothers-day-en.png">
            <img class="card-date animated fadeInDown slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/videothanks/date.png">
            <img class="card-mothers-day animated fadeInDown slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/videothanks/mothers-day.png">
            <div class="card-main-content animated fadeIn slower delay-2s">
                <img class="card-happy animated fadeIn slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/videothanks/happy.png">
                <div class="video-happy-box animated fadeIn slower delay-1s">
                    <div class="head-image-box animated fadeIn slower delay-2s">
                        <img v-if="$parent.agentInfo.avatar" class="head-image" :src="$parent.agentInfo.avatar" @click="$parent.goAgentPage">
                        <i v-if="!$parent.agentInfo.avatar" class="iconfont head-image" @click="$parent.goAgentPage">&#xe685;</i>
                    </div>
                    <div class="from-wish animated fadeIn slower delay-2s">
                        <span>{{$parent.this_from}}</span>
                        <span class="from-user-name com-nowrap">{{$parent.agentInfo.nickname}}</span>
                        <span>{{$parent.festival_wish}}</span>
                    </div>
                </div>
                <div class="video-image animated fadeIn slower delay-3s">
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
    name: 'MothersDayThanks',
    data() {
        return {};
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = 'https://static.iberhk.com/v2/web/images/card/mothersday/videothanks/shareimg.png';
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
    background-image: url('https://static.iberhk.com/v2/web/images/card/mothersday/videothanks/bg.png');
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
    border: .02rem solid rgb(255, 255, 255);
    color: #DDDDDD;
    line-height: .45rem;
    font-size: .45rem;
    cursor: pointer;
}

.from-wish {
    width: 100%;
    display: block;
    text-align: center;
    font-size: .15rem;
    line-height: .32rem;
    color: rgb(151, 151, 151);
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
    color: #FFFFFF;
}

.from-user-name {
    font-size: .15rem;
    line-height: .32rem;
    color: #FFFFFF;
    font-weight: bold;
    max-width: 1.4rem;
}

.video-image {
    position: absolute;
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - .48rem);
    height: auto;
    background-color: #FFF6FA;
    left: 50%;
    top: 30%;
    transform: translateX(-50%) translateY(-50%);
    border: .05rem solid #FFFFFF;
    border-radius: 0rem;
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
    right: 4%;
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

.card-bottom-flower {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
}

.card-right-flower {
    position: absolute;
    width: 29%;
    right: 0;
    top: 0;
}

.card-mothers-day-en {
    position: absolute;
    width: 68%;
    left: 6%;
    top: 7%;
}

.card-date {
    position: absolute;
    width: 31%;
    left: 6%;
    top: 14.5%;
}

.card-mothers-day {
    position: absolute;
    width: 26%;
    left: 39.5%;
    top: 14.1%;
}

.card-happy {
    position: absolute;
    width: 67%;
    left: 16.5%;
    bottom: 24%;
}
</style>