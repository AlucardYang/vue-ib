<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-wave" src="https://static.iberhk.com/v2/web/images/card/birthday/textpinkwave/wave.png">
            <img class="card-top-flower animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textpinkwave/topflower.png">
            <img class="card-left-flower animated fadeInLeft slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/birthday/textpinkwave/leftflower.png">
            <img class="card-right-flower animated fadeInRight slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/birthday/textpinkwave/rightflower.png">
            <img class="card-bottom-flower animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textpinkwave/bottomflower.png">
            <div class="head-image-box animated fadeIn slower delay-3s">
                <img v-if="$parent.agentInfo.avatar" class="head-image" :src="$parent.agentInfo.avatar" @click="$parent.goAgentPage">
                <i v-if="!$parent.agentInfo.avatar" class="iconfont head-image" @click="$parent.goAgentPage">&#xe685;</i>
            </div>
            <div class="from-wish animated fadeIn slower delay-3s">
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
        </div>
    </section>
</template>

<script>
export default {
    name: 'BirthdayPinkWave',
    data() {
        return {
            showThankBtn: false,
            cardTextOpacity: 0,
            cardTextSpanHeight: 'auto',
            timer: null
        };
    },
    components: {},
    created() {
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/birthday/textpinkwave/shareimg.png');
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
                    }, 4500);
                }
            });
        },
    }
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.card-template-box {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.card-template {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('https://static.iberhk.com/v2/web/images/card/birthday/textpinkwave/bg.png');
}

.head-image-box {
    position: absolute;
    top: 25%;
    left: 6%;
    width: 88%;
    height: .5rem;
    text-align: center;
    min-height: 0.5rem;
}

.head-image {
    position: absolute;
    top: 50%;
    left: calc(50% - .24rem);
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    width: 0.46rem;
    height: 0.46rem;
    border-radius: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: inline-block;
    box-sizing: border-box;
    border: .02rem solid #fff;
    color: #DDDDDD;
    line-height: .42rem;
    font-size: .42rem;
    cursor: pointer;
}

.from-wish {
    position: absolute;
    top: calc(25% + .54rem);
    left: 3%;
    width: 96%;
    display: block;
    text-align: center;
    font-size: .15rem;
    line-height: .16rem;
    color: rgb(151, 151, 151);
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
    color: #125B59;
}

.from-user-name {
    font-size: .15rem;
    line-height: .28rem;
    color: #125B59;
    font-weight: bold;
    max-width: 2rem;
}

.card-text {
    position: absolute;
    box-sizing: border-box;
    line-height: .21rem;
    width: 2.88rem;
    top: 42%;
    left: calc(50% - 1.44rem);
    color: #125B59;
    letter-spacing: 0;
    font-size: 0.15rem;
    height: 36%;
    font-weight: bold;
}

.card-text-content {
    width: 100%;
    height: 100%;
    overflow: auto;
    line-height: .23rem;
    white-space: pre-wrap;
}

.card-text-content::-webkit-scrollbar {
    display: none;
}

.card-text-span {
    display: block;
    width: 100%;
    overflow: hidden;
}

.text-tip {
    position: absolute;
    width: 2.2rem;
    height: .84rem;
    line-height: .84rem;
    text-align: center;
    color: #333;
    font-size: .12rem;
    border: 1px dashed #fff;
    border-radius: 8px;
    left: calc(50% - 1.1rem);
    bottom: calc(50% - .42rem);
}

.dear-user {
    font-weight: bold;
    margin-bottom: .03rem;
}

.card-wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.card-top-flower {
    position: absolute;
    width: 100%;
    top: -.14rem;
    left: 0;
}

.card-left-flower {
    position: absolute;
    width: 13%;
    top: 25%;
    left: -.14rem;
}

.card-right-flower {
    position: absolute;
    width: 12%;
    bottom: 30%;
    right: -.14rem;
}

.card-bottom-flower {
    position: absolute;
    width: 100%;
    bottom: -.05rem;
    left: 0;
}
</style>