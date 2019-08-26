<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <div class="card-from animated fadeIn slower delay-2s">
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
            <img class="card-text-happy animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textballooncake/happy.png">
            <img class="card-right-balloon animated fadeInRight slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textballooncake/rightballoon.png">
            <img class="card-bottom-balloon animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textballooncake/bottomballoon.png">
            <img class="card-text-cake animated fadeInUp slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textballooncake/cake.png">
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
    name: 'BirthdayBalloonCake',
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
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/birthday/textballooncake/shareimg.png');
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
    background-color: #FFF7F7;
    overflow: hidden;
}

.card-from {
    width: 100%;
    color: #fff;
    display: flex;
    justify-content: left;
    align-items: center;
    padding-left: .14rem;
    height: 12%;
    z-index: 2;
}

.from-wish {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    font-size: .15rem;
    line-height: .28rem;
    color: #963B5B;
    padding-left: .08rem;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .15rem;
    line-height: .28rem;
    max-width: 1.56rem;
    font-weight: bold;
}

.head-image-box {
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    padding: 0.015rem;
    background-color: rgb(255, 255, 255);
    width: 0.46rem;
    height: 0.46rem;
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
    line-height: .43rem;
    font-size: .43rem;
    cursor: pointer;
}

.card-text {
    position: absolute;
    box-sizing: border-box;
    line-height: .21rem;
    width: calc(100% - 1.2rem);
    top: 35.5%;
    left: .14rem;
    color: #963B5B;
    letter-spacing: 0;
    font-size: 0.15rem;
    height: 26%;
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

.card-text-happy {
    position: absolute;
    width: 100%;
    top: -.14rem;
    left: 0;
}

.card-text-cake {
    position: absolute;
    bottom: -.14rem;
    left: -.14rem;
    width: 50%;
}

.card-right-balloon {
    position: absolute;
    top: 30%;
    right: 0;
    width: .94rem;
}

.card-bottom-balloon {
    position: absolute;
    bottom: -.04rem;
    right: .16rem;
    width: 42%;
}
</style>