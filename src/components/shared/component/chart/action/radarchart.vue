<template>
    <div class="chart">
        <div v-show="showTip" class="popup-date-picker-content animated" :class="{'fadeIn': showTip, 'fadeOut': !showTip}">
            <div class="popup-date-picker-bg" @click="close"></div>
            <div class="tip-box">
                <div class="top-desc">
                    {{month_performance_des}}
                </div>
                <ul class="ability-list">
                    <li class="ability-list-row" v-for="(item, index) in abilitys" :key="index" :class="{'margin-bottom-0': index === abilitys.length - 1}">
                        <div class="title">{{item.title}}</div>
                        <div class="desc">{{item.desc}}</div>
                    </li>
                </ul>
                <div class="bottom-btn" @click="close">我知道了</div>
            </div>
        </div>
        <div class="border-bottom-dashed"></div>
        <div class="chart-title">
            <span>{{month_performance}}</span>
            <i class="iconfont guide-icon" @click="appFn.commonFn('monthBottomTip')">&#xe679;</i>
        </div>
        <div :id="refId" :style="{width: chartWidth, 'min-height': chartHeight}" data-emergence="hidden"></div>
        <div class="bottom-text">
            {{data.msg1}}<br> {{data.msg2}}
        </div>
    </div>
</template>

<script>
export default {
    name: "RadarChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "radarChart";
            }
        },
        data: {
            type: Object,
            default: function() {
                return {};
            }
        },
        chartWidth: {
            type: String,
            default: "100%"
        },
        chartHeight: {
            type: String,
            default: "2.4rem"
        }
    },
    data() {
        return {
            month_performance: this.simply ? '月度综合表现' : '月度綜合表現',
            month_performance_des: this.simply ? '月度综合表现是iBer AI根据您在平台的行为评估您的销售能力、招聘能力、拓客能力、规划能力和学习能力等5项能力，仅供参考。' : '月度綜合表現是iBer AI根據您在平台的行為評估您的銷售能力、招聘能力、拓客能力、規劃能力和學習能力等5項能力，僅供參考。',
            chart: null,
            option: {},
            seriesData: [0, 0, 0, 0, 0],
            total: 0,
            showTip: false,
            abilitys: [{
                    title: this.simply ? '销售能力' : '銷售能力',
                    desc: this.simply ? '有创建签单类型、派单类型并标记已完成。' : '有創建簽單類型、派單類型并標紀已完成。'
                },
                {
                    title: '招聘能力',
                    desc: this.simply ? '有创建招募类型并标记已完成。' : '有創建招募類型并標紀已完成。',
                },
                {
                    title: '拓客能力',
                    desc: this.simply ? '有APP分享；有创建了邀约类型、跟进类型并标记已完成。' : '有APP分享；有創建了邀約類型、跟進類型并標紀已完成。'
                },
                {
                    title: this.simply ? '规划能力' : '規劃能力',
                    desc: this.simply ? '有创建proposal类型并标记已完成。' : '有創建proposal類型并標紀已完成。'
                },
                {
                    title: this.simply ? '学习能力' : '學習能力',
                    desc: this.simply ? '有成功报名参加APP培训课程；有创建了培训、开会类型并已完成。' : '有成功報名參加APP培訓課程；有創建了培訓、開會類型并已完成。'
                }
            ]
        };
    },
    watch: {
        data: {
            handler: function(value, oldvalue) {
                this.chart && this.chart['dispose'] && this.chart.dispose();
                this.setChart(value);
            }
        }
    },
    mounted() {
        this.setChart(this.data);
    },
    methods: {
        open() {
            this.showTip = true;
            setTimeout(() => {
                document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'hidden');
            });
        },
        close() {
            this.showTip = false;
            setTimeout(() => {
                document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'auto');
            });
        },
        showAnimate(state) {
            if (this.chart) {
                !state && this.chart.clear();
                state && this.chart.setOption(this.option);
            }
        },
        setChart(data) {
            this.asyncData(data);
            this.chart = echarts.init(document.getElementById(this.refId));
            // 绘制图表
            this.option = {
                title: {
                    text: this.total,
                    x: "center",
                    y: "center",
                    textStyle: {
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: 30
                    }
                },
                grid: {
                    top: "10%"
                },
                radar: {
                    name: {
                        textStyle: {
                            color: "#666",
                            fontSize: 15
                        }
                    },
                    radius: "70%",
                    splitLine: {
                        lineStyle: {
                            color: ["#E0E1E2"]
                        }
                    },
                    splitArea: {
                        areaStyle: {
                            color: ['#FFFFFF', '#EDEEEF']
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: ["#E0E1E2"]
                        }
                    },
                    splitNumber: 4,
                    indicator: [{
                            name: this.simply ? '销售能力' : '銷售能力',
                            max: 20
                        },
                        {
                            name: this.simply ? '学习能力' : '學習能力',
                            max: 20
                        },
                        {
                            name: this.simply ? '规划能力' : '規劃能力',
                            max: 20
                        },
                        {
                            name: '拓客能力',
                            max: 20
                        },
                        {
                            name: '招聘能力',
                            max: 20
                        }
                    ]
                },
                series: [{
                    name: "月度綜合表現",
                    type: "radar",
                    symbolSize: 6,
                    areaStyle: {
                        color: "#8DAAFF"
                    },
                    lineStyle: {
                        color: "#3851F0",
                        width: 1
                    },
                    itemStyle: {
                        color: "#3851F0",
                        borderWidth: 1
                    },
                    data: [{
                        value: this.seriesData
                    }]
                }]
            };
            this.chart.setOption(this.option);
        },
        asyncData(value) {
            if (value) {
                this.seriesData = [value.sells, value.learn, value.plan, value.extension, value.recruitment];
                // 优化雷达图显示
                // this.seriesData.forEach((item, index) => {
                //   if (item === 0 && (index > 0 && (index < 4)) && (value.total !== 0)) {
                //     if (this.seriesData[index - 1] !== 0 && (this.seriesData[index + 1] !== 0)) {
                //       this.seriesData[index] = undefined;
                //     }
                //   } else if (item === 0 && (index === 4) && (value.total !== 0)) {
                //     this.seriesData[index] = undefined;
                //   } else if (value.total === 0) {
                //     this.seriesData[index] = undefined;
                //   }
                // });
                this.total = value.total;
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
    width: 100%;
    height: auto;
    background-color: #fff;
    border-radius: 0.2rem;
    border-bottom: 0.02rem solid transparent;
    padding: .325rem 0 .34rem 0;
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

.chart-title {
    width: 100%;
    text-align: center;
    font-size: 0.18rem;
    margin-bottom: 0.4rem;
}

.guide-icon {
    color: #CCCCCC;
    font-size: .18rem;
    cursor: pointer;
}

.bottom-text {
    text-align: center;
    font-size: .14rem;
    line-height: .20rem;
    color: #ccc;
    margin-top: .2rem;
}

.tip-box {
    position: absolute;
    width: 3.3rem;
    background: #ffffff;
    border-radius: 0.08rem;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    text-align: left;
}

.top-desc {
    padding: 0.12rem;
    font-size: 0.15rem;
    color: #2a2a2a;
    line-height: 0.25rem;
    border-bottom: 1px solid #dddddd;
}

.ability-list {
    width: 100%;
    /* height: 3.76rem; */
    padding: 0.12rem;
}

.ability-list-row {
    width: 100%;
    margin-bottom: 0.2rem;
}

.margin-bottom-0 {
    margin-bottom: 0;
}

.ability-list-row .title {
    font-size: 0.15rem;
    color: #2a2a2a;
    line-height: 0.18rem;
}

.ability-list-row .desc {
    font-size: 0.14rem;
    color: #999999;
    line-height: 0.17rem;
    margin-top: 0.06rem;
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

.border-bottom-dashed {
    top: 0;
}

.popup-date-picker-content {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3000;
}

.popup-date-picker-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}
</style>
