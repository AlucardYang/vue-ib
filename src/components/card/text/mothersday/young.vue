<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-letter animated fadeIn slower" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/letter.png">
            <img class="card-mom animated fadeInUp slow delay-1s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/mom.png">
            <img class="card-bottom-cloud3 animated fadeInUp slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/bottom-cloud3.png">
            <img class="card-bottom-cloud2 animated fadeInUp slow delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/bottom-cloud2.png">
            <img class="card-bottom-cloud1 animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/bottom-cloud1.png">
            <img class="card-left-top-leaf animated fadeInLeft slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/left-top-leaf.png">
            <img class="card-left-leaf animated fadeInLeft slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/left-leaf.png">
            <img class="card-right-leaf animated fadeInRight slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/right-leaf.png">
            <img class="card-happy animated fadeInRight slow delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/happy.png">
            <img class="card-top-wish animated fadeInRight slow delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/top-wish.png">
            <img class="card-butterfly animated fadeInRight slow delay-2s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/butterfly.png">
            <img class="card-left-top-cloud animated fadeInLeft slower delay-3s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/left-top-cloud.png">
            <img class="card-left-bottom-cloud animated fadeInLeft slower delay-3s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/left-bottom-cloud.png">
            <img class="card-right-top-cloud animated fadeInRight slower delay-3s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/right-top-cloud.png">
            <img class="card-right-bottom-cloud animated fadeInRight slower delay-3s" src="https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/right-bottom-cloud.png">
            <div class="card-text" :style="{opacity: cardTextOpacity}">
                <div ref="cardTextContent" class="card-text-content">
                    <span ref="cardTextSpan" class="card-text-span" v-text="$parent.text" :style="{height: cardTextSpanHeight + 'px'}"></span>
                </div>
            </div>
            <div v-if="showThankBtn" class="card-from animated fast" :class="{'fadeInRight': showThankBtn}" :style="{'top': (cardTextSpanHeight >= $refs.cardTextContent.clientHeight) ? '45%' : ('calc(34% + ' + cardTextSpanHeight / 2 + 'px)')}">
                <div class="from-wish">
                    <span class="from-user-name com-nowrap" :style="{'max-width': inApp ? '1.9rem' : '2.2rem'}">{{$parent.agentInfo.nickname}}</span>
                </div>
                <div class="head-image-box">
                    <img v-if="$parent.agentInfo.avatar" class="head-image" :src="$parent.agentInfo.avatar" @click="$parent.goAgentPage">
                    <i v-if="!$parent.agentInfo.avatar" class="iconfont head-image" @click="$parent.goAgentPage">&#xe685;</i>
                </div>
            </div>
            <div v-if="!$parent.text" class="text-tip animated fadeIn slower delay-3s">{{$parent.write_wish}}</div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'MothersDayYoung',
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
        // this.$parent.share.thumbImage = 'https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/shareimg.png';
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
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url('https://static.iberhk.com/v2/web/images/card/mothersday/textyoung/bg.png');
}

.card-template {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.card-from {
    position: absolute;
    bottom: 25%;
    left: .5rem;
    width: calc(100% - 1rem);
    color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 12%;
    z-index: 2;
}

.from-wish {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    font-size: .15rem;
    line-height: .28rem;
    color: #E84875;
    padding-right: .08rem;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .14rem;
    line-height: .28rem;
    max-width: 2.05rem;
    font-weight: bold;
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

.card-text {
    position: absolute;
    box-sizing: border-box;
    line-height: .21rem;
    width: calc(100% - 1rem);
    top: 22%;
    left: .5rem;
    color: #E84875;
    letter-spacing: 0;
    font-size: 0.15rem;
    height: 24%;
    font-weight: bold;
}

.card-text-content {
    width: 100%;
    height: 100%;
    overflow: auto;
    line-height: .24rem;
    white-space: pre-wrap;
    display: flex;
    align-items: center;
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
    width: 2rem;
    height: .84rem;
    line-height: .84rem;
    text-align: center;
    color: #333;
    font-size: .12rem;
    border: 1px dashed #333;
    border-radius: 8px;
    left: calc(50% - 1rem);
    bottom: calc(62% - .42rem);
}

.dear-user {
    font-weight: bold;
    margin-bottom: .03rem;
}

.card-letter {
    width: calc(100% - .28rem);
    height: calc(100% - .55rem);
    position: absolute;
    left: .14rem;
    bottom: 0;
}

.card-mom {
    width: 55%;
    position: absolute;
    left: 22.5%;
    bottom: 4%;
}

.card-bottom-cloud1 {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
}

.card-bottom-cloud2 {
    width: 60%;
    position: absolute;
    right: 0;
    bottom: 0;
}

.card-bottom-cloud3 {
    width: 93%;
    position: absolute;
    right: 0;
    bottom: 0;
}

.card-left-top-leaf {
    width: 52%;
    position: absolute;
    left: 0;
    top: 0;
}

.card-left-leaf {
    width: 47%;
    position: absolute;
    left: 0;
    bottom: 0;
}

.card-right-leaf {
    width: 47%;
    position: absolute;
    right: 0;
    bottom: 0;
}

.card-happy {
    width: 47%;
    position: absolute;
    right: 2%;
    top: 4%;
}

.card-top-wish {
    width: 44%;
    position: absolute;
    left: 28%;
    top: .54rem;
}

.card-butterfly {
    width: 29%;
    position: absolute;
    right: 0%;
    top: 7%;
}

.card-left-top-cloud {
    width: 8%;
    position: absolute;
    left: 0%;
    top: 33%;
}

.card-left-bottom-cloud {
    width: 19%;
    position: absolute;
    left: 0%;
    bottom: 25%;
}

.card-right-top-cloud {
    width: 9%;
    position: absolute;
    right: 0%;
    top: 25%;
}

.card-right-bottom-cloud {
    width: 14%;
    position: absolute;
    right: 4%;
    bottom: 31%;
}
</style>