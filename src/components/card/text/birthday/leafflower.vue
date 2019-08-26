<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-frame" src="https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/frame.png">
            <img class="card-left-top-leaf animated fadeInLeft slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/lefttopleaf.png">
            <img class="card-right-top-leaf animated fadeInRight slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/righttopleaf.png">
            <img class="card-left-center-leaf animated fadeInLeft slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/leftcenterleaf.png">
            <img class="card-right-flower animated fadeInRight slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/rightflower.png">
            <img class="card-gift animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/gift.png">
            <img class="card-balloon animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/balloon.png">
            <img class="card-left-bottom-leaf animated fadeInLeft slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/leftbottomleaf.png">
            <img class="card-right-bottom-leaf animated fadeInRight slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/rightbottomleaf.png">
            <img class="card-bird animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/bird.png">
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
    name: 'BirthdayLeafFlower',
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
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/shareimg.png');
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
    background-image: url('https://static.iberhk.com/v2/web/images/card/birthday/textleafflower/bg.png');
}

.head-image-box {
    position: absolute;
    top: 21%;
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
    border: .02rem solid #A3BB64;
    color: #DDDDDD;
    line-height: .42rem;
    font-size: .42rem;
    cursor: pointer;
}

.from-wish {
    position: absolute;
    top: calc(21% + .54rem);
    left: 6%;
    width: 88%;
    display: block;
    text-align: center;
    font-size: .15rem;
    line-height: .16rem;
    color: rgb(151, 151, 151);
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
    color: #506B3D;
}

.from-user-name {
    font-size: .15rem;
    line-height: .28rem;
    color: #000;
    font-weight: bold;
    max-width: 1.73rem;
}

.card-text {
    position: absolute;
    box-sizing: border-box;
    line-height: .21rem;
    width: 2.88rem;
    top: 38%;
    left: calc(50% - 1.44rem);
    color: #506B3D;
    letter-spacing: 0;
    font-size: 0.15rem;
    height: 31%;
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

.card-frame {
    position: absolute;
    top: .2rem;
    left: .2rem;
    width: calc(100% - .4rem);
    height: calc(100% - .5rem);
}

.card-left-top-leaf {
    position: absolute;
    width: 47%;
    top: 0;
    left: 0;
}

.card-right-top-leaf {
    position: absolute;
    width: 53%;
    top: 0;
    right: 0;
}

.card-left-center-leaf {
    position: absolute;
    width: 7%;
    bottom: 40%;
    left: 0;
}

.card-right-flower {
    position: absolute;
    width: 32%;
    top: 11%;
    right: 0;
}

.card-left-bottom-leaf {
    position: absolute;
    width: 66%;
    bottom: 0%;
    left: 0;
}

.card-right-bottom-leaf {
    position: absolute;
    width: 46%;
    bottom: 0%;
    right: 0;
}

.card-gift {
    position: absolute;
    width: 50%;
    bottom: 4%;
    left: 10%;
}

.card-balloon {
    position: absolute;
    width: 24%;
    bottom: 6%;
    right: 4%;
}

.card-bird {
    position: absolute;
    width: 50%;
    bottom: -1.4%;
    left: 20%;
}
</style>