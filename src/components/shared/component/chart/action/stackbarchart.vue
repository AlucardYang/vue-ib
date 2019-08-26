<template>
    <div class="chart">
        <div :id="refId" :style="{width: chartWidth, height: chartHeight}" data-emergence="hidden"></div>
        <div v-if="legends.length > 0" class="legend-box clearfix">
            <div class="legend-block" v-for="(item, index) in legends" :key="index">
                <span class="legend-circle" :style="{'background-color': item.color}"></span>
                <span>{{item.name}}</span>
            </div>
        </div>
        <div class="border-bottom-dashed"></div>
    </div>
</template>

<script>

export default {
    name: "StackBarChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "stackBarChart";
            }
        },
        data: {
            type: Array,
            default: function() {
                return [];
            }
        },
        chartWidth: {
            type: String,
            default: "100%"
        },
        chartHeight: {
            type: String,
            default: "2.7rem"
        }
    },
    data() {
        return {
            chart: null,
            option: {},
            legends: [],
            seriesData: [{
                name: "",
                type: "bar",
                silent: true,
                barWidth: "50%",
                barGap: "-100%",
                z: 1,
                itemStyle: {
                    color: "#F6F6F6",
                    barBorderRadius: 1
                },
                data: [20, 20, 20, 20, 20, 20, 20]
            }]
        };
    },
    components: {},
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
                    text: this.simply ? '每日行动类型' : '每日行動類型',
                    left: "center",
                    top: 32.5
                },
                grid: {
                    left: "10%",
                    right: "4%",
                    top: "40%",
                    bottom: "8%"
                },
                tooltip: {},
                xAxis: {
                    type: "category",
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: "#2A2A2A",
                        fontSize: 11,
                        interval: 0
                    },
                    data: [
                        "星期一",
                        "星期二",
                        "星期三",
                        "星期四",
                        "星期五",
                        "星期六",
                        "星期日"
                    ]
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        fontSize: 10,
                        color: "#999999"
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: this.seriesData
            };
            this.chart.setOption(this.option);
        },
        asyncData(value) {
            let dayTotal = [0, 0, 0, 0, 0, 0, 0];
            if (value.length > 0) {
                let sum = 0;
                value.forEach((item, index) => {
                    for (let i = 0; i < 7; i++) {
                        dayTotal[i] += item.done_num[i];
                    }
                });
                let max = Math.max(...dayTotal);
                if (max > 0) {
                    max = Math.ceil(max / 10) * 10;
                    this.seriesData[0].data = [max, max, max, max, max, max, max];
                } else {
                    this.seriesData[0].data = [1, 1, 1, 1, 1, 1, 1];
                }
                value.forEach((item, index) => {
                    let obj = {
                        name: "",
                        type: "bar",
                        stack: "总量",
                        barWidth: "50%",
                        z: 2,
                        itemStyle: {
                            color: item.cate_color,
                            barBorderRadius: 1
                        },
                        data: item.done_num
                    };
                    let legend = {
                        name: item.cate_name,
                        color: item.cate_color
                    };
                    this.legends.push(legend);
                    this.seriesData.push(obj);
                });
            } else {
                this.legends = [];
                this.seriesData[0].data = [1, 1, 1, 1, 1, 1, 1];
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
    width: 100%;
    min-height: 3.2rem;
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

.legend-box {
    width: 100%;
    margin-top: 0.48rem;
    padding: 0 .2rem;
}

.legend-block {
    float: left;
    font-size: .11rem;
    color: #2a2a2a;
    line-height: .14rem;
    margin: 0 .2rem .11rem 0;
}

.legend-circle {
    display: inline-block;
    width: 0.08rem;
    height: 0.08rem;
    border-radius: 50%;
}

.margin-right-0 {
    margin-right: 0;
}
</style>
