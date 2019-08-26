<template>
    <div id="friendPortrait">
        <div class="friend-portrait-inner com-scroll-y">
            <div class="friend-portrait-content">
                <div class="friend-portrait-title" @click="showTipFn">
                    <span class="friend-portrait-text">{{simply ? '什么是用户画像？' : '什麼是用戶畫像？'}}</span>
                    <i class="iconfont tip-icon">&#xe6be;</i>
                    <div v-show="showTip" class="tip-box">{{portraitTip}}</div>
                </div>
                <div id="friendsWordCloud" class="friends-word-cloud"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Toast
} from 'mint-ui';

import CommonJS from '@/components/shared/service/common.js';
import FriendTags from './friendtags.js';

export default {
    name: 'DataCenterFriendPortrait',
    data() {
        return {
            isLoaded: true,
            showTip: false,
            portraitTip: this.simply ? '好友画像是根据已关注总好友数据字段比例越大，特征显示越明显。' : '好友畫像是根據已關注總好友數據字段比例越大，特征显示越明显。',
            tagsArr: this.simply ? FriendTags.cn : FriendTags.tw,
            color: {
                12: '#DDDDDD',
                16: '#47C853',
                20: '#FFBA01',
                24: '#FF4F4F',
                28: '#D160EB',
                32: '#5A51DE',
                36: '#2187F8',
            },
            colors: ['#47C853', '#FFBA01', '#FF4F4F', '#D160EB', '#5A51DE', '#2187F8'],
            colorIndex: -1,
            newTags: [],
            loadedScript: false
        }
    },
    components: {},
    created() {
        this.$root.blueLoadingParams.show = true;
        const _this = this;
        // 异步加载js2wordcloud.min.js 生成用户标签
        CommonJS.loadScript('https://static.iberhk.com/res/js/js2wordcloud.min.js', () => {
            _this.loadedScript = true;
            _this.getFriendPortrait();
        });
    },
    mounted() {
        document.addEventListener('touchstart', this.hideTipFn);
        document.addEventListener('click', this.hideTipFn);
    },
    methods: {
        hideTipFn(event) {
            const _this = this;
            if ((event.target.className.indexOf('tip-icon') === -1) && (event.target.className.indexOf('tip-box') === -1) && (event.target.className.indexOf('friend-portrait-text') === -1)) {
                _this.showTip = false;
            }
        },
        showTipFn() {
            this.showTip = true;
        },
        transportNum(num) {
            if (num < 10) {
                return 16;
            } else if (num >= 10 && num < 30) {
                return 20;
            } else if (num >= 30 && num < 50) {
                return 24;
            } else if (num >= 50 && num < 70) {
                return 28;
            } else if (num >= 70 && num < 90) {
                return 32;
            } else if (num >= 90 && num <= 100) {
                return 36;
            }
        },
        getFriendPortrait() {
            this.$http.get('/data-center/friend-portrait').then(res => {
                if (res && res.code === 0) {
                    this.newTags = [];
                    res.data.friend_portrait.forEach((item, index) => {
                        let num = parseInt((item.count / item.total) * 100);
                        this.newTags.push([item.title, this.transportNum(num), item.count]);
                    });
                    for (var key in this.tagsArr) {
                        this.newTags.push([key, this.tagsArr[key], 0]);
                    }
                    this.createWordCloud();
                }
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
            }, err => {
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
                window.location.href = window.baseUrl + '/error/404';
            })
        },
        createWordCloud() {
            // 文档地址：https://github.com/timdream/wordcloud2.js/blob/gh-pages/API.md 
            // 新增加特性： https://www.npmjs.com/package/js2wordcloud
            // 图形生成器：https://wordcloud2-js.timdream.org/shape-generator.html
            const _this = this;
            setTimeout(() => {
                var wc = new Js2WordCloud(document.getElementById('friendsWordCloud'));
                wc.setOption({
                    tooltip: {
                        show: false, // 默认：false
                        backgroundColor: 'rgba(0, 0, 0, 0.701961)',
                        formatter: function(item) {
                            if (item[1] > 12) {
                                document.querySelector('.__wc_tooltip__').style.backgroundColor = 'rgba(0, 0, 0, 0.701961)';
                                return item[0] + '：' + item[2];
                            } else {
                                document.querySelector('.__wc_tooltip__').style.backgroundColor = 'transparent';
                                return '';
                            }
                        }
                    },
                    list: _this.newTags,
                    gridSize: 6,
                    fontSizeFactor: 0.1,
                    maxFontSize: 36,
                    minFontSize: 12,
                    rotationSteps: 30,
                    rotateRatio: 0.5,
                    ellipticity: 1,
                    wait: 10,
                    abortThreshold: 2000,
                    color(word, weight, fontSize, distance, theta) {
                        if (weight == 12) {
                            return '#DDDDDD';
                        } else {
                            if (_this.colorIndex >= 6) {
                                _this.colorIndex = -1;
                            }
                            _this.colorIndex += 1;
                            return _this.colors[_this.colorIndex];
                        }
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    imageShape: 'https://static.iberhk.com/v2/web/images/data-center/man.png',
                    click(item, dimension, event) {
                        _this.showTip = false;
                        if (item.length > 0 && (item[1] > 12)) {
                            Toast({
                                message: item[0] + '：' + item[2] + '人'
                            });
                        }
                    }
                });
            });
        }
    }
}
</script>

<style>
.friend-portrait-span {
    display: inline-block;
    padding: .5rem;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.friend-portrait-inner {
    width: 100%;
    height: 100%;
    background-color: #F6F6F6;
    padding: .12rem;
}

.friend-portrait-content {
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    box-shadow: 0 8px 16px 0 rgba(51, 100, 228, 0.08);
    border-radius: .08rem;
    padding: .12rem;
}

.friend-portrait-title {
    font-size: .14rem;
    color: #999;
    text-align: center;
    line-height: .17rem;
    text-align: left;
    cursor: pointer;
}

.tip-icon {
    display: inline-block;
    font-size: .15rem;
    line-height: .14rem;
    color: #DEDEDE;
    border-radius: .12rem;
    cursor: pointer;
}

.tip-box {
    position: absolute;
    top: .28rem;
    right: .3rem;
    width: 2.2rem;
    height: .52rem;
    padding: .08rem;
    border-radius: .04rem;
    background-color: rgba(100, 106, 121, .9);
    color: #fff;
    z-index: 1;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.50);
    font-size: .12rem;
    color: #FFFFFF;
    line-height: .17rem;
    text-align: left;
}

.tip-box:before {
    position: absolute;
    top: -.19rem;
    left: .43rem;
    content: '';
    border: .1rem solid transparent;
    border-left-width: .07rem;
    border-right-width: .07rem;
    border-bottom: .1rem solid rgba(100, 106, 121, .9);
    z-index: 1;
}

.friends-word-cloud {
    position: absolute;
    top: 54%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 2.76rem;
    height: 4.74rem;
    background-image: url('https://static.iberhk.com/v2/web/images/data-center/manbg.png');
    background-size: 100%;
}
</style>
