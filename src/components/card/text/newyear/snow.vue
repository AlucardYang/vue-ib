<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <img class="card-letter animated fadeIn slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/newyear/textsnow/letter.png">
            <img class="card-text-newyear animated fadeInDown slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/newyear/textsnow/newyear.png">
            <img class="card-big-snow animated fadeIn slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/newyear/textsnow/bigsnow.png">
            <img class="card-small-snow animated fadeIn slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/newyear/textsnow/smallsnow.png">
            <div class="card-text" :style="{opacity: cardTextOpacity}">
                <div ref="cardTextContent" class="card-text-content">
                    <span ref="cardTextSpan" class="card-text-span" v-text="$parent.text" :style="{height: cardTextSpanHeight + 'px'}"></span>
                </div>
            </div>
            <div v-if="showThankBtn" class="card-from animated fast" :class="{'fadeInRight': showThankBtn}" :style="{'top': (cardTextSpanHeight >= $refs.cardTextContent.clientHeight) ? '69%' : ('calc(54% + ' + cardTextSpanHeight / 2 + 'px)')}">
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
    name: 'NewYearSnow',
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
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/newyear/textsnow/shareimg.png');
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
    background-image: url('https://static.iberhk.com/v2/web/images/card/newyear/textsnow/bg.png');
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
    bottom: 29%;
    left: calc(50% - 1.25rem);
    width: 2.5rem;
    color: #00ABA2;
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
    color: #00ABA2;
    padding-right: .08rem;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .15rem;
    line-height: .28rem;
    max-width: 1.9rem;
    font-weight: bold;
}

.head-image-box {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    width: 0.46rem;
    height: 0.46rem;
    border: .02rem solid #00ABA2;
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
    line-height: .42rem;
    font-size: .42rem;
    cursor: pointer;
}

.card-text {
    position: absolute;
    box-sizing: border-box;
    line-height: .21rem;
    width: 2.5rem;
    top: 33%;
    left: calc(50% - 1.25rem);
    color: #00ABA2;
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
    border: 1px dashed #fff;
    border-radius: 8px;
    left: calc(50% - 1.1rem);
    bottom: 40%;
    bottom: calc(50% - .42rem);
}

.dear-user {
    font-weight: bold;
    margin-bottom: .03rem;
}

.card-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}

.card-letter {
    position: absolute;
    width: 92%;
    height: 88%;
    left: 4%;
    top: 2%;
}

.card-text-newyear {
    position: absolute;
    width: 1.5rem;
    top: 20%;
    left: calc(50% - 0.75rem);
}

.card-big-snow {
    position: absolute;
    bottom: 27%;
    right: 3%;
    width: 16%;
}

.card-small-snow {
    position: absolute;
    bottom: 16%;
    left: 2%;
    width: 12%;
}
</style>