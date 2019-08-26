<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-lantern animated fadeInLeft slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/textwealthgod/lantern.jpg">
            <img class="card-center-bg animated fadeInDown slower" src="https://static.iberhk.com/v2/web/images/card/springfestival/textwealthgod/centerbg.png">
            <img class="card-firecracker animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/textwealthgod/firecracker.png">
            <img class="card-left-leaf animated fadeInLeft slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/springfestival/textwealthgod/leftleaf.png">
            <img class="card-right-leaf animated fadeInRight slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/springfestival/textwealthgod/rightleaf.png">
            <img class="card-god animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/textwealthgod/god.png">
            <img class="card-lion animated fadeInUp slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/springfestival/textwealthgod/lion.png">
            <div class="card-text" :style="{opacity: cardTextOpacity}">
                <div ref="cardTextContent" class="card-text-content">
                    <span ref="cardTextSpan" class="card-text-span" v-text="$parent.text" :style="{height: cardTextSpanHeight + 'px'}"></span>
                </div>
            </div>
            <div v-if="showThankBtn" class="card-from animated fast" :class="{'fadeInRight': showThankBtn}" :style="{'top': (cardTextSpanHeight >= $refs.cardTextContent.clientHeight) ? '38%' : ('calc(24% + ' + cardTextSpanHeight / 2 + 'px)')}">
                <div class="from-wish">
                    <span class="from-user-name com-nowrap">{{$parent.agentInfo.nickname}}</span>
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
    name: 'SpringFestivalWealthGod',
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
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/springfestival/textwealthgod/shareimg.png');
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
    background-image: url('https://static.iberhk.com/v2/web/images/card/springfestival/textwealthgod/bg.jpg');
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
    left: calc(50% - 1.2rem);
    width: 2.4rem;
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
    color: #FEEAAA;
    padding-right: .08rem;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .15rem;
    line-height: .28rem;
    max-width: 1.89rem;
    font-weight: bold;
}

.head-image-box {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    width: 0.44rem;
    height: 0.44rem;
    border: .02rem solid #FEEAAA;
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
}

.card-text {
    position: absolute;
    box-sizing: border-box;
    line-height: .21rem;
    width: 2.4rem;
    top: 10%;
    left: calc(50% - 1.2rem);
    color: #FEEAAA;
    letter-spacing: 0;
    font-size: 0.15rem;
    height: 30%;
    font-weight: bold;
}

.card-text-content {
    width: 100%;
    height: 100%;
    overflow: auto;
    line-height: .23rem;
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
    border: 1px dashed #fff;
    border-radius: 8px;
    left: calc(50% - 1rem);
    bottom: calc(72% - .42rem);
}

.dear-user {
    font-weight: bold;
    margin-bottom: .03rem;
}

.card-center-bg {
    position: absolute;
    top: 0%;
    left: calc(50% - 1.63rem);
    width: 3.26rem;
}

.card-firecracker {
    position: absolute;
    top: 0;
    left: -.09rem;
    width: calc(100% + .18rem);
}

.card-left-leaf {
    position: absolute;
    width: 20%;
    top: 36%;
    left: -.14rem;
}

.card-right-leaf {
    position: absolute;
    width: 30%;
    top: 39%;
    right: -.14rem;
}

.card-god {
    position: absolute;
    width: calc(100% + .28rem);
    bottom: -.04rem;
    left: -.14rem;
}

.card-lion {
    position: absolute;
    width: 1.06rem;
    bottom: .86rem;
    right: -.04rem;
}

.card-lantern {
    width: 28%;
    position: absolute;
    left: -.1rem;
    bottom: 28%;
}
</style>