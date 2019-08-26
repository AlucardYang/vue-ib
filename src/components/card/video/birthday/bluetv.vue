<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-video-happy-bg animated fadeIn slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/videobluetv/happybg.png">
            <img class="card-video-happy animated bounceIn slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/videobluetv/happy.png">
            <div class="card-main-content">
                <img class="card-video-blue-ng animated fadeIn slower" src="https://static.iberhk.com/v2/web/images/card/birthday/videobluetv/bluebg.png">
                <div class="head-from-box animated fadeIn slower delay-2s">
                    <div class="head-from-center">
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
                <div class="card-tv-image animated slideInUp slower delay-1s" :style="{'opacity': imageOpacity}">
                    <img class="full-content" src="https://static.iberhk.com/v2/web/images/card/birthday/videobluetv/tv.png">
                    <div class="video-content">
                        <img class="full-content" :style="{'opacity': $parent.videoSrc ? 0 : 1}" src="https://static.iberhk.com/v2/web/images/card/defalutgirl.png">
                        <div class="video-mask" :class="{'video-mask-light': $parent.videoSrc}"></div>
                        <video id="videoPlayer" v-if="$parent.videoSrc" class="video-area video-js vjs-big-play-centered" webkit-playsinline playsinline controlslist="nodownload"><source :src="$parent.videoSrc" type="video/mp4"><source :src="$parent.videoWebmSrc" type="video/webm"></video>
                        <div v-show="!$parent.videoSrc" class="video-tip">{{$parent.no_upload}}</div>
                        <span v-show="!$parent.videoSrc" class="video-max-time">{{$parent.max_video_time}}</span>
                    </div>
                    <!-- <a v-if="$parent.videoSrc" class="thank-reply-button" href="javascript:void(0);" @click="goConsultAgent"><span>{{simply ? '感谢' : '感謝'}}他/她的祝福</span></a> -->
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: 'BirthdayBlueTv',
    data() {
        return {
            imageOpacity: 0
        };
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/birthday/videobluetv/shareimg.png');
        // 异步加载video.min.js
        const _this = this;
        CommonJS.loadScript('https://static.iberhk.com/res/js/video.min.js', () => {
            _this.$parent.getCardInfo().then(res => {
                setTimeout(() => {
                    _this.$parent.initCard();
                    _this.imageOpacity = 1;
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

.card-tv-image {
    position: absolute;
    width: calc(100% - 0.09rem);
    top: 38%;
    left: 0.02rem;
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
    height: 78%;
    min-height: 4rem;
    position: absolute;
    text-align: center;
    bottom: 0;
}

.head-from-box {
    position: absolute;
    top: 19%;
    width: 100%;
    height: 19%;
    min-height: calc(2% + .64rem);
}

.head-from-center {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
}

.head-image-box {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    width: .5rem;
    height: .5rem;
    border-radius: 50%;
    border: 0.03rem solid #fff;
    padding: 0.03rem;
    background-color: rgb(253, 218, 29);
}

.head-image {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: #DDDDDD;
    line-height: .38rem;
    font-size: .38rem;
    cursor: pointer;
}

.from-wish {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    text-align: center;
    font-size: .14rem;
    line-height: .14rem;
    color: #333;
    margin-top: 2%;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .14rem;
    line-height: .14rem;
    color: #000;
    font-weight: bold;
    max-width: 1.4rem;
    /* margin: 0 .04rem; */
}

.video-content {
    position: absolute;
    box-sizing: border-box;
    width: 74%;
    left: 8.93%;
    top: 14.12%;
    z-index: 1;
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
    z-index: 2;
}

.video-max-time {
    position: absolute;
    right: 4%;
    bottom: 2%;
    display: block;
    font-size: .12rem;
    color: #FFFFFF;
    font-weight: bold;
    z-index: 2;
}

.thank-reply-button {
    position: absolute;
    width: 1.5rem;
    text-align: center;
    bottom: .23rem;
    left: calc(50% - 0.75rem);
    height: 0.26rem;
    color: rgb(51, 51, 51);
    border: .01rem solid rgb(0, 0, 0);
    font-size: 0.16rem;
    line-height: 0.22rem;
    background-color: rgb(239, 181, 15);
    border-radius: 0.29rem;
    /* box-shadow: 0 0 0.07rem #333; */
    animation: toMove 2s infinite ease-in-out;
}

@keyframes toMove {
    0% {
        transform: scale(1);
        /* box-shadow: 0 0 0.07rem #333; */
    }
    50% {
        transform: scale(1.03);
        /* box-shadow: 0 0 0.15rem #666; */
    }
    100% {
        transform: scale(1);
        /* box-shadow: 0 0 0.07rem #333; */
    }
}

.card-text-div {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
}

.card-video-happy {
    position: absolute;
    width: 78%;
    top: 1%;
    left: 11%;
    z-index: 1;
}

.card-video-happy-bg {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}

.card-video-blue-ng {
    width: 100%;
    height: 100%;
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