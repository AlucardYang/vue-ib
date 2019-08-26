<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <div class="card-from animated fadeIn slower delay-3s">
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
            <img class="card-text-happy animated bounceIn slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/birthday/textorangecake/happy.png">
            <img class="card-text-cake animated fadeInUp fast delay-1s" src="https://static.iberhk.com/v2/web/images/card/birthday/textorangecake/cake.png">
            <div class="card-text" :style="{opacity: cardTextOpacity}">
                <div ref="cardTextContent" class="card-text-content">
                    <span ref="cardTextSpan" class="card-text-span" v-text="$parent.text" :style="{height: cardTextSpanHeight + 'px'}"></span>
                </div>
            </div>
            <div v-if="!$parent.text" class="text-tip animated fadeIn slower delay-3s">{{$parent.write_wish}}</div>
            <!-- <a class="thank-reply-button" v-if="showThankBtn" href="javascript:void(0);" @click="goConsultAgent">
                        <span>{{simply ? '感谢' : '感謝'}}他/她的祝福</span>
                    </a> -->
        </div>
    </section>
</template>

<script>
export default {
    name: 'BirthdayOrangeCake',
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
        // this.$parent.share.thumbImage = require('https://static.iberhk.com/v2/web/images/card/birthday/textorangecake/shareimg.png');
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
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('https://static.iberhk.com/v2/web/images/card/birthday/textorangecake/bg.png');
}

.card-from {
    position: absolute;
    top: calc(7.2% - .28rem);
    width: 100%;
    text-align: center;
    color: #fff;
    font-weight: bold;
}

.from-wish {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    font-size: .15rem;
    line-height: .28rem;
    color: #570714;
    margin-left: .06rem;
}

.from-wish span {
    display: inline-block;
    vertical-align: middle;
}

.from-user-name {
    font-size: .15rem;
    line-height: .28rem;
    max-width: 1.6rem;
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
    line-height: .44rem;
    font-size: .4rem;
    cursor: pointer;
}

.card-text {
    position: absolute;
    box-sizing: border-box;
    line-height: .2rem;
    width: 80%;
    bottom: 29%;
    left: 10%;
    color: rgb(87, 7, 20);
    font-size: 0.16rem;
    height: 33%;
    font-weight: bold;
}

.card-text-content {
    width: 100%;
    height: calc(100% - .33rem);
    overflow: auto;
    font-weight: bold;
    line-height: .3rem;
    white-space: pre-wrap;
}

.card-text-content::-webkit-scrollbar {
    display: none;
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

.thank-reply-button {
    position: absolute;
    box-sizing: border-box;
    text-align: center;
    display: block;
    padding: 0;
    border: none;
    font-size: 0.16rem;
    font-weight: bold;
    line-height: 0.4rem;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 1.45rem;
    height: 0.4rem;
    bottom: 28%;
    left: calc(50% - 0.72rem);
    color: rgb(87, 7, 20);
    background-image: url('https://static.iberhk.com/v2/web/images/card/birthday/textorangecake/btn.png');
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

.dear-user {
    font-weight: bold;
    margin-bottom: .1rem;
}

.card-text-span {
    display: block;
    width: 100%;
    overflow: hidden;
    margin-top: -.06rem;
}

.card-text-happy {
    position: absolute;
    width: 64%;
    top: calc(14.4% - .26rem);
    left: 18%;
}

.card-text-cake {
    position: absolute;
    bottom: 0;
    left: 24%;
    width: 52%;
}
</style>