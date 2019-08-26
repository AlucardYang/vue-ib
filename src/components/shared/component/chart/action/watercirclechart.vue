<template>
    <div class="chart">
        <i class="iconfont action-month-tip" @click="appFn.commonFn('monthTopTip')">&#xe679;</i>
        <mt-popup v-model="showTip" popup-transition="popup-fade">
            <div class="tip-box">
                <div class="top-desc">{{action_num_score_tip}}</div>
                <div class="bottom-btn" @click="showTip = false">我知道了</div>
            </div>
        </mt-popup>
        <div :id="refId" class="water-circle-chart" :style="{width: chartWidth, height: chartHeight}"></div>
        <div class="top-circle">
            <div class="top-circle-text">
                <span class="num">{{percentage}}</span>
                <span class="title">{{action_num_score_title}}</span>
            </div>
        </div>
        <div class="front-score">
            <span>{{presentMonth}}月得分：{{prevPercentage}}分</span>
        </div>
        <div class="compare-result">
            <i class="iconfont praise-icon">&#xe66e;</i>
            <span>你比</span>
            <span class="red">{{percentage}}%</span>
            <span>{{member_hardwork}}</span>
        </div>
        <div class="border-bottom-dashed"></div>
    </div>
</template>

<script>
//   import Vue from 'vue';
  import { Popup } from 'mint-ui';
//   Vue.component(Popup.name, Popup);

import CommonJS from '@/components/shared/service/common.js';

export default {
    name: "WaterCircleChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "waterCircleChart";
            }
        },
        percentage: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        prevPercentage: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        date: {
            type: String,
            default: function() {
                return '2018-01';
            }
        },
        presentMonth: {
            type: Number,
            default: function() {
                return 1;
            }
        },
        chartWidth: {
            type: String,
            default: "2rem"
        },
        chartHeight: {
            type: String,
            default: "2rem"
        }
    },
    data() {
        return {
            member_hardwork: this.simply ? '的iBer会员更勤奋！' : '的iBer會員更勤奮！',
            action_num_score_tip: this.simply ? '行动量排名得分为每月行动行动量在平台所有用户的排名得分' : '行動量排名得分為每月行動行動量在平台所有用戶的排名得分',
            action_num_score_title: this.simply ? '行动量平台得分' : '行動量平台得分',
            chart: new Object(),
            showTip: false,
            option: {},
        };
    },
    components: {
        'mt-popup': Popup,
    },
    watch: {
        percentage: {
            handler: function(value, oldvalue) {
                this.chart && this.chart['dispose'] && this.chart.dispose();
                this.setChart();
            }
        }
    },
    created() {},
    mounted() {
        const _this = this;
        _this.setChart();
    },
    methods: {
        showAnimate(state) {
            !state && this.chart.clear();
            state && this.chart.setOption(this.option);
        },
        setChart() {
            // 异步加载echarts-liquidfill.min.js
            CommonJS.loadScript('https://static.iberhk.com/res/js/echarts-liquidfill.min.js', () => {
                this.chart = echarts.init(document.getElementById(this.refId));
                // 绘制图表
                this.option = {
                    series: [{
                        type: "liquidFill",
                        radius: "90%",
                        color: ["rgba(112,178,255,.54)", "rgba(112,178,255,.75)"],
                        data: [Number(this.percentage) * 0.01, Number(this.percentage) * 0.01],
                        label: {
                            show: false
                        },
                        outline: {
                            show: true,
                            borderDistance: 0,
                            itemStyle: {
                                color: "none",
                                borderColor: "#F6F6F6",
                                borderWidth: 20,
                                shadowBlur: 0
                            }
                        },
                        backgroundStyle: {
                            color: "#FFFFFF"
                        },
                        itemStyle: {
                            opacity: 1,
                            shadowBlur: 0,
                            shadowColor: "rgba(0, 0, 0, 0.3)"
                        }
                    }]
                };
                this.chart.setOption(this.option);
            });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
    width: 100%;
    height: 3.61rem;
    background-color: #fff;
    border-radius: 0.2rem;
    border-bottom: 0.02rem solid transparent;
    position: relative;
}

.chart:before,
.chart:after {
    content: "";
    position: absolute;
    top: -0.1rem;
    left: -0.1rem;
    width: 0.2rem;
    height: 0.2rem;
    background-color: #3364e4;
    border-radius: 50%;
    z-index: 10;
}

.chart:after {
    left: auto;
    right: -0.1rem;
}

.action-month-tip {
    font-size: 0.2rem;
    color: #999999;
    position: absolute;
    top: 0.225rem;
    right: 0.24rem;
    cursor: pointer;
}

.tip-box {
    width: 3.27rem;
    height: 1.42rem;
    background: #ffffff;
    border-radius: 0.08rem;
    left: calc(50% - 1.635rem);
}

.top-desc {
    padding: 0.24rem;
    font-size: 0.17rem;
    color: #2a2a2a;
    line-height: 0.23rem;
    text-align: center;
}

.bottom-btn {
    width: 100%;
    height: 0.48rem;
    background: #f6f6f6;
    border-radius: 0 0 0.08rem 0.08rem;
    font-size: 0.17rem;
    color: #3364e4;
    letter-spacing: 0;
    line-height: 0.48rem;
    text-align: center;
    cursor: pointer;
}

.water-circle-chart {
    position: absolute;
    top: 0.32rem;
    left: calc(50% - 1rem);
    border-radius: 50%;
    /* box-shadow: 5px 5px 5px #999 inset; */
}

.top-circle-text {
    text-align: center;
    position: absolute;
    top: 0.9rem;
    left: 50%;
    transform: translateX(-50%);
}

.top-circle-text .num {
    display: block;
    font-size: 0.4rem;
    color: #2a2a2a;
    line-height: 0.48rem;
    font-weight: bold;
}

.top-circle-text .title {
    display: block;
    font-size: 0.15rem;
    color: #2a2a2a;
    text-align: center;
    line-height: 0.18rem;
    font-weight: 700;
}

.front-score {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0.84rem;
    font-size: 0.16rem;
    color: #2a2a2a;
    line-height: 0.2rem;
}

.front-score span {
    display: inline-block;
    margin-left: -0.04rem;
    vertical-align: middle;
}

.compare-result {
    height: 0.26rem;
    width: 2.2rem;
    border-radius: 0.12rem;
    line-height: 0.24rem;
    padding-left: 0.07rem;
    border: .005rem solid #cccccc;
    font-size: 0.14rem;
    color: #999999;
    position: absolute;
    bottom: 0.34rem;
    left: calc(50% - 1.1rem);
    letter-spacing: 0;
    text-align: center;
}

.praise-icon {
    font-size: 0.14rem;
    color: #3782ff;
}

.compare-result .red {
    display: inline-block;
    color: #2a2a2a;
    margin: 0 -0.04rem;
    font-weight: bold;
}

.tendency-type {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.3rem;
    width: 0.23rem;
    margin-left: -0.14rem;
}

.tendency-type-flat {
    font-size: 0.3rem;
    width: 1.02rem;
    margin-left: -0.86rem;
}
</style>
