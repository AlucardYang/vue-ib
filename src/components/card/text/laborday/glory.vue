<template>
    <section id="appCardTemplate" class="card-template-box">
        <div class="card-template">
            <div class="bg-box-outer">
                <div class="bg-box-inner">
                    <img class="card-people animated fadeIn slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/laborday/textglory/people.png">
                </div>
            </div>
            <img class="card-page" src="https://static.iberhk.com/v2/web/images/card/laborday/textglory/page.png">
            <img class="card-labor animated fadeInDown slower delay-1s" src="https://static.iberhk.com/v2/web/images/card/laborday/textglory/labor.png">
            <img class="card-happy animated fadeInDown slower delay-2s" src="https://static.iberhk.com/v2/web/images/card/laborday/textglory/happy.png">
            <div class="card-text" :style="{opacity: cardTextOpacity}">
                <div ref="cardTextContent" class="card-text-content">
                    <span ref="cardTextSpan" class="card-text-span" v-text="$parent.text" :style="{height: cardTextSpanHeight + 'px'}"></span>
                </div>
            </div>
            <div v-if="showThankBtn" class="card-from animated fast" :class="{'fadeInRight': showThankBtn}" :style="{'top': (cardTextSpanHeight >= $refs.cardTextContent.clientHeight) ? '71%' : ('calc(61% + ' + cardTextSpanHeight / 2 + 'px)')}">
                <div class="from-wish">
                    <span class="from-user-name com-nowrap" :style="{'max-width': inApp ? '2.05rem' : '2.3rem'}">{{$parent.agentInfo.nickname}}</span>
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
    name: 'LaborDayGlory',
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
        // this.$parent.share.thumbImage = 'https://static.iberhk.com/v2/web/images/card/laborday/textglory/shareimg.png';
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
    background-image: url('https://static.iberhk.com/v2/web/images/card/laborday/textglory/bg.png');
    font-family: 'STSong', PingFangSC-Light, Roboto, HelveticaNeue, Helvetica, Arial, sans-serif; 
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
    left: .45rem;
    width: calc(100% - .9rem);
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
    color: #681914;
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
}

.card-text {
    position: absolute;
    box-sizing: border-box;
    line-height: .21rem;
    width: calc(100% - .87rem);
    top: 54%;
    left: .435rem;
    color: #681914;
    letter-spacing: 0;
    font-size: 0.14rem;
    height: 18%;
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
    border: 1px dashed #333;
    border-radius: 8px;
    left: calc(50% - 1rem);
    bottom: calc(35% - .42rem);
}

.dear-user {
    font-weight: bold;
    margin-bottom: .03rem;
}

.bg-box-outer {
    position: absolute;
    width: calc(100% - .2rem);
    height: calc(100% - .2rem);
    top: .1rem;
    left: .1rem;
    background-color: #FCE6C2;
    border: .03rem solid #7D0000;
    box-sizing: border-box;
}

.bg-box-inner {
    position: absolute;
    width: calc(100% - .2rem);
    height: calc(100% - .2rem);
    top: .1rem;
    left: .1rem;
    border: .005rem solid #7D0000;
    box-sizing: border-box;
}

.card-people {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
}

.card-page {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.card-labor {
    position: absolute;
    width: calc(100% - .87rem);
    top: 6%;
    left: .435rem;
}

.card-happy {
    position: absolute;
    width: calc(100% - .87rem);
    top: 43%;
    left: .435rem;
}
</style>