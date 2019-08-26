<template>
    <section id="appCardTemplate" class="card-template-box" :style="{'background-image': 'url(' + backgroundImageUrl + ')', 'position': inApp ? 'absolute' : 'relative'}">
        <div class="card-template">
            <img class="card-text-postcard animated fadeInLeft slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textpinkpig/postcard.png">
            <img class="card-text-pig animated fadeInRight slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textpinkpig/pig.png">
            <img class="card-text-cake animated fadeIn slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/birthday/textpinkpig/cake.png">
            <div class="head-image-box animated fadeIn slower delay-1s">
                <img v-if="$parent.agentInfo.avatar" class="head-image" :src="$parent.agentInfo.avatar" @click="$parent.goAgentPage">
                <i v-if="!$parent.agentInfo.avatar" class="iconfont head-image" @click="$parent.goAgentPage">&#xe685;</i>
            </div>
            <div class="from-wish animated fadeIn slower delay-2s">
                <span>{{$parent.this_from}}</span>
                <span class="from-user-name com-nowrap">{{$parent.agentInfo.nickname}}</span>
                <span>{{$parent.festival_wish}}</span>
            </div>
            <div class="card-text" :style="{opacity: cardTextOpacity}">
                <div ref="cardTextContent" class="card-text-content">
                    <span ref="cardTextSpan" class="card-text-span" v-text="$parent.text" :style="{height: cardTextSpanHeight + 'px'}"></span>
                </div>
            </div>
            <div v-if="!$parent.text" class="text-tip animated fadeIn slower delay-3s">{{$parent.write_wish}}</div>
            <!-- <a class="thank-reply-button" v-if="showThankBtn" href="javascript:void(0);" @click="goConsultAgent">
                    <span>{{simply ? '感谢' : '感謝'}}他/她</span><br>
                    <span>的祝福</span>
                </a> -->
        </div>
    </section>
</template>

<script>
export default {
    name: 'BirthdayPinkPig',
    data() {
        return {
            showThankBtn: false,
            cardTextOpacity: 0,
            cardTextSpanHeight: 'auto',
            timer: null,
            backgroundImageUrl: this.inApp ? 'https://static.iberhk.com/v2/web/images/card/birthday/textpinkpig/whitebg.png' : 'https://static.iberhk.com/v2/web/images/card/birthday/textpinkpig/bg.png'
        };
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/birthday/textpinkpig/shareimg.png');
    },
    mounted() {
        this.$parent.getGreetingText().then(res => {
            this.initCard();
        });
    },
    destroyed() {
        clearInterval(this.timer);
    },
    methods: {
        initCard() {
            const _this = this;
            setTimeout(() => {
                if (_this.$parent.text) {
                    let height = _this.$refs.cardTextSpan.clientHeight;
                    _this.cardTextSpanHeight = 0;
                    setTimeout(() => {
                        _this.cardTextOpacity = 1;
                        _this.timer = setInterval(() => {
                            _this.cardTextSpanHeight += _this.$parent.textSpeed;
                            _this.$refs.cardTextContent.scrollTop = _this.cardTextSpanHeight;
                            if (_this.cardTextSpanHeight > height) {
                                console.log('stopScroll');
                                clearInterval(_this.timer);
                                setTimeout(() => {
                                    _this.showThankBtn = true;
                                    _this.$refs.cardTextContent.style.display = (_this.cardTextSpanHeight >= _this.$refs.cardTextContent.clientHeight) ? 'block' : 'flex';
                                    _this.$refs.cardTextContent.scrollTop = _this.cardTextSpanHeight;
                                }, 1000);
                            }
                        }, 1);
                    }, 4000);
                }
            });
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-template-box {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('https://static.iberhk.com/v2/web/images/card/birthday/textpinkpig/bg.png');
    top: 0;
    left: 0;
}

.card-template {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.head-image-box {
    box-sizing: border-box;
    position: absolute;
    border-radius: 50%;
    top: 11%;
    left: calc(50% - 0.23rem);
    border: 1px solid #dedfe0;
    width: 0.46rem;
    height: 0.46rem;
}

.head-image {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: #DDDDDD;
    line-height: .46rem;
    font-size: .46rem;
    cursor: pointer;
}

.card-text {
    position: absolute;
    box-sizing: border-box;
    font-size: 0.15rem;
    line-height: 0.2rem;
    width: 64%;
    top: 58%;
    left: 18%;
    color: #333;
    height: 15.9%;
    font-weight: bold;
}

.text-tip {
    position: absolute;
    width: 2.2rem;
    height: 0.84rem;
    line-height: 0.84rem;
    text-align: center;
    color: #333;
    font-size: 0.12rem;
    border: 1px dashed #dadbe6;
    border-radius: 8px;
    left: calc(50% - 1.1rem);
    bottom: calc(40% - .42rem);
}

.card-from {
    position: absolute;
    bottom: 2.2rem;
    width: 100%;
    text-align: center;
    color: #fff;
}

.from-wish {
    width: 100%;
    display: block;
    text-align: center;
    position: absolute;
    font-size: 0.15rem;
    line-height: 0.28rem;
    top: 19%;
    left: 0;
    color: #979797;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: 0.15rem;
    line-height: 0.28rem;
    color: #666;
    font-weight: bold;
    max-width: 1.73rem;
}

.thank-reply-button {
    position: absolute;
    box-sizing: border-box;
    display: block;
    padding: 0.19rem 0.04rem 0 0rem;
    border: none;
    font-size: 0.1rem;
    line-height: 0.14rem;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 0.9rem;
    height: 0.75rem;
    bottom: 9.5%;
    left: calc(50% - 0.34rem);
    color: #fff;
    text-align: center;
    font-weight: bold;
    background-image: url("https://static.iberhk.com/v2/web/images/card/birthday/textpinkpig/heart.png");
    animation: heartBeat 1.5s infinite;
}

@keyframes heartBeat {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

.card-text-span {
    display: block;
    width: 100%;
    overflow: hidden;
}

.card-text-content {
    width: 100%;
    height: 100%;
    overflow: auto;
    white-space: pre-wrap;
}

.card-text-content::-webkit-scrollbar {
    display: none;
}

.card-text-cake {
    position: absolute;
    top: 25%;
    left: 25%;
    width: 50%;
}

.card-text-postcard {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 38%;
}

.card-text-pig {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 32%;
}

.position-relative {
    position: relative;
}
</style>