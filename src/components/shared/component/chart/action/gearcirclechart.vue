<template>
    <div class="chart">
        <div class="background-cirlce"></div>
        <div :id="refId" class="gear-circle-chart" :style="{width: chartWidth, height: chartHeight}"></div>
        <div class="top-circle">
            <div class="top-circle-text">
                <span class="num">{{doneNum}}</span>
                <span class="title">{{action_num_title}}</span>
            </div>
        </div>
        <div class="front-score">
            <span>{{pre_week_done}}{{prevDoneNum}} (</span>
            <i v-if="doneNum - prevDoneNum > 0" class="iconfont tendency-type increase-color">&#xe677;</i>
            <i v-if="doneNum - prevDoneNum === 0" class="iconfont tendency-type tendency-type-flat flat-color">&#xe675;</i>
            <i v-if="doneNum - prevDoneNum < 0" class="iconfont tendency-type decrease-color">&#xe676;</i>
            <span>{{Math.abs(doneNum - prevDoneNum)}}</span>
            <span>）</span>
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
export default {
    name: "GearCircleChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "gearCircleChart";
            }
        },
        percentage: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        prevDoneNum: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        doneNum: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        chartWidth: {
            type: String,
            default: "1.9rem"
        },
        chartHeight: {
            type: String,
            default: "1.9rem"
        }
    },
    data() {
        return {
            action_num_title: this.simply ? '周行动量' : '週行動量',
            pre_week_done: '上星期完成量',
            member_hardwork: this.simply ? '的iBer会员更勤奋！' : '的iBer會員更勤奮！',
            chart: new Object(),
            option: {}
        };
    },
    components: {},
    watch: {},
    mounted() {
        this.setChart();
    },
    methods: {
        showAnimate(state) {
            !state && this.chart.clear();
            state && this.chart.setOption(this.option);
        },
        setChart() {
            this.chart = echarts.init(document.getElementById(this.refId));
            // 绘制图表
            this.option = {
                backgroundColor: "transparent",
                series: [{
                    type: "gauge",
                    name: "周行动量",
                    radius: "100%",
                    startAngle: "0",
                    endAngle: "-359.99",
                    splitNumber: "60",
                    pointer: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        show: false
                    },
                    data: [{
                        value: 0,
                        name: ""
                    }],
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: [
                                [
                                    1,
                                    new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                                            offset: 0,
                                            color: "#339BE4"
                                        },
                                        {
                                            offset: 0.98,
                                            color: "#4177FF"
                                        }
                                    ])
                                ]
                            ],
                            width: 14,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        length: 14,
                        lineStyle: {
                            color: "rgba(255,255,255,1)",
                            width: 1,
                            type: "solid",
                            opacity: 0.5
                        }
                    },
                    axisLabel: {
                        show: false
                    }
                }]
            };
            this.chart.setOption(this.option);
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

.background-cirlce {
    position: absolute;
    top: 0.31rem;
    left: calc(50% - 1rem);
    width: 2rem;
    height: 2rem;
    border-radius: 100%;
    background-image: linear-gradient(135deg, #339be4 0%, #4177ff 98%);
    animation: rotate 10s infinite linear;
}

.gear-circle-chart {
    position: absolute;
    top: 0.36rem;
    left: calc(50% - 0.95rem);
    animation: rotate 10s infinite linear;
}

.top-circle {
    position: absolute;
    top: 0.56rem;
    left: calc(50% - 0.75rem);
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 100%;
    background-color: #fff;
    text-align: center;
}

.top-circle-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
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
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(180deg);
    }
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
    border: 1px solid #98999a;
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
