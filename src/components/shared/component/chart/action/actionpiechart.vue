<template>
    <div v-show="seriesData.length > 0" class="chart">
        <div :id="refId" :style="{width: chartWidth, height: chartHeight}" data-emergence="hidden"></div>
        <ul v-if="cates.length !== 0 && showList" class="list-box">
            <li class="list-row clearfix" v-for="(item, index) in cates" :key="index" :class="{'border-none': index === cates.length - 1}">
                <div class="list-row-left">
                    <div class="list-row-title">
                        <span class="status-circle" :style="{'background-color': item.cate_color}"></span>
                        <span>{{item.cate_name}}({{item.done_num}})</span>
                    </div>
                    <div class="list-row-desc">
                        <span>{{pre_week_action_num}}</span>
                        <span style="margin-left: -.04rem;">{{item.prev_done_num <= 99 ? item.prev_done_num : '99+'}} (</span>
                        <i v-if="item.done_num - item.prev_done_num > 0" class="iconfont tendency-type increase-color">&#xe677;</i>
                        <i v-if="item.done_num - item.prev_done_num === 0" class="iconfont tendency-type tendency-type-flat flat-color">&#xe675;</i>
                        <i v-if="item.done_num - item.prev_done_num < 0" class="iconfont tendency-type decrease-color">&#xe676;</i>
                        <span>{{Math.abs(item.done_num - item.prev_done_num) <= 99 ? Math.abs(item.done_num - item.prev_done_num) : '99+'}})</span>
                    </div>
                </div>
                <div class="list-row-right">
                    <tendency-chart :tendency="item.tendency" :this-num="item.done_num" :pre-num="item.prev_done_num" :color="item.cate_color"></tendency-chart>
                </div>
            </li>
        </ul>
        <div class="border-bottom-dashed"></div>
    </div>
</template>

<script>
// 引入 ECharts 主模块
// const echarts = require("echarts/lib/echarts");
// // 引入线形图
// require("echarts/lib/chart/pie");

import TendencyChart from "@/components/shared/component/chart/action/tendencychart.vue";

export default {
    name: "ActionPieChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "actionPieChart";
            }
        },
        showList: {
            type: Boolean,
            default: function() {
                return true;
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
            default: "3.51rem"
        },
        chartHeight: {
            type: String,
            default: "3.665rem"
        }
    },
    data() {
        return {
            pre_week_action_num: this.simply ? '上星期行动量' : '上星期行動量',
            chart: null,
            option: {},
            seriesData: [],
            labelLine: {
                length: 5,
                length2: 6
            },
            radius: [20, 72],
            cates: []
        };
    },
    components: {
        TendencyChart
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
        showAnimate(state) {
            if (this.chart) {
                !state && this.chart.clear();
                state && this.chart.setOption(this.option);
            }
        },
        setChart(data) {
            this.asyncData(data);
            this.chart = echarts.init(document.getElementById(this.refId));
            if (window.screen.width === 320) {
                this.radius = [14, 56];
            }
            // 绘制图表
            this.option = {
                title: {
                    text: this.simply ? '行动类型分布' : '行動類型分佈',
                    left: "center",
                    top: 32.5
                },
                calculable: true,
                series: [{
                    name: "面积模式",
                    type: "pie",
                    hoverAnimation: false,
                    radius: this.radius,
                    center: ["50%", "60%"],
                    roseType: "area",
                    label: {
                        fontSize: window.screen.height >= 667 ? 12 : 11,
                        formatter: '#{b}({c})'
                    },
                    labelLine: this.labelLine,
                    data: this.seriesData
                }]
            };
            this.chart.setOption(this.option);
        },
        asyncData(value) {
            this.seriesData = new Array();
            this.cates = value;
            let totalCase = 0;
            value.forEach((item, index) => {
                let total = item['done_num'];
                totalCase += total;
            });
            // 无数据时显示
            if (value.length === 0 || totalCase === 0) {
                this.seriesData = new Array();
            } else {
                value.forEach((item, index) => {
                    let total = item['done_num'];
                    if (total !== 0) {
                        let obj = {
                            value: total <= 99 ? total : '99+',
                            name: item['cate_name'],
                            itemStyle: {
                                color: item['cate_color']
                            }
                        }
                        this.seriesData.push(obj);
                    }
                });
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

.tendency-type {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.24rem;
    width: 0.16rem;
    margin-left: -0.1rem;
}

.tendency-type-flat {
    font-size: 0.16rem;
    width: 0.52rem;
    margin-left: -0.46rem;
    vertical-align: bottom;
}

.list-box {
    width: 100%;
    padding: 0 0.15rem 0.4rem 0.15rem;
    margin-top: -0.2rem;
}

.list-row {
    padding: 0.1rem 0;
    border-bottom: 1px solid #eee;
    height: 0.78rem;
    overflow: hidden;
}

.list-row-left {
    width: calc(100% - 1rem);
    float: left;
}

.list-row-title {
    font-size: 0.15rem;
    color: #2a2a2a;
    line-height: 0.18rem;
    margin-top: 0.09rem;
}

.list-row-desc {
    font-size: 0.12rem;
    color: #999999;
    line-height: 0.15rem;
    margin-top: 0.08rem;
}

.list-row-desc span {
    display: inline-block;
}

.status-circle {
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 50%;
    display: inline-block;
}

.font-weight-bold {
    font-weight: bold;
}

.border-none {
    border: none;
}

.list-row-right {
    float: right;
    width: 0.6rem;
    margin: -0.1rem 0.02rem;
}
</style>
