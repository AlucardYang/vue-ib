<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-yellow animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/textsquare/yellow.png">
            <img class="card-happy animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/springfestival/textsquare/happy.png">
            <img class="card-2019 animated fadeInUp slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/springfestival/textsquare/2019.png">
            <img class="card-pig animated fadeInUp slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/springfestival/textsquare/pig.png">
            <div class="card-text" :style="{opacity: cardTextOpacity}">
                <div ref="cardTextContent" class="card-text-content">
                    <span ref="cardTextSpan" class="card-text-span" v-text="$parent.text" :style="{height: cardTextSpanHeight + 'px'}"></span>
                </div>
            </div>
            <div v-if="showThankBtn" class="card-from animated fast" :class="{'fadeInRight': showThankBtn}" :style="{'top': (cardTextSpanHeight >= $refs.cardTextContent.clientHeight) ? '26%' : ('calc(14% + ' + cardTextSpanHeight / 2 + 'px)')}">
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
    name: 'SpringFestivalSquare',
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
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/springfestival/textsquare/shareimg.png');
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
    background-color: #DD0000;
}

.card-from {
    position: absolute;
    bottom: 25%;
    left: calc(50% - 1.5rem);
    width: 3rem;
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
    color: #2F0000;
    padding-right: .08rem;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .15rem;
    line-height: .28rem;
    max-width: 2.4rem;
    font-weight: bold;
}

.head-image-box {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    width: 0.44rem;
    height: 0.44rem;
    border: .02rem solid #fff;
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
    line-height: .41rem;
    font-size: .41rem;
    cursor: pointer;
}

.card-text {
    position: absolute;
    box-sizing: border-box;
    line-height: .21rem;
    width: 3.0rem;
    top: 4%;
    left: calc(50% - 1.5rem);
    color: #2F0000;
    letter-spacing: 0;
    font-size: 0.15rem;
    height: 22%;
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
    width: 2.2rem;
    height: .84rem;
    line-height: .84rem;
    text-align: center;
    color: #333;
    font-size: .12rem;
    border: 1px dashed #333;
    border-radius: 8px;
    left: calc(50% - 1.1rem);
    bottom: calc(78% - .42rem);
}

.dear-user {
    font-weight: bold;
    margin-bottom: .03rem;
}

.card-yellow {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
}

.card-bow {
    position: absolute;
    bottom: 0;
    left: 0%;
    width: 100%;
    height: 55%;
}

.card-happy {
    position: absolute;
    width: 1.66rem;
    top: 2.7rem;
    left: calc(50% - .83rem);
}

.card-2019 {
    position: absolute;
    width: 2.36rem;
    top: calc(16% + 3.44rem);
    left: calc(50% - 1.18rem);
}

.card-pig {
    position: absolute;
    width: 2.36rem;
    top: calc(23% + 3.44rem);
    left: calc(50% - 1.18rem);
}
</style>