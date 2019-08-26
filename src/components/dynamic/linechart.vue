<template>
    <div v-show="loadedScript && isLoaded" id="dynamic">
        <div class="history-total">{{(this.simply ? '历史累计总量：' : '歷史累計總量：') + historyTotal}}</div>
        <img v-show="(xAxis.length === 0) && showDefaultLine" class="default-line" src="https://static.iberhk.com/v2/web/images/dynamic/default.png">
        <span v-show="(xAxis.length === 0) && showDefaultLine" class="no-data-span">{{this.simply ? '暂无动态数据' : '暫無動態數據'}}</span>
        <div v-show="xAxis.length > 0" :id="refId" class="dynamic-line-chart"></div>
        <span v-show="xAxis.length > 0" class="today-span">今日</span>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: 'DynamicLineChart',
    data() {
        return {
            refId: 'dynamicLineChart',
            isLoaded: true,
            loadedScript: false,
            historyTotal: 0,
            xAxis: [],
            yAxis: [],
            showDefaultLine: false
        }
    },
    components: {},
    created() {
        const _this = this;
        // 异步加载echarts.min.js
        CommonJS.loadScript('https://static.iberhk.com/res/js/echarts.min.js', () => {
            _this.loadedScript = true;
            _this.getSevenData();
        });
    },
    mounted() {},
    methods: {
        getSevenData() {
            this.xAxis = [];
            this.yAxis = [];
            this.$http.get('c-user-action-log/get-sev-data').then(res => {
                if (res && res.code === 0) {
                    this.historyTotal = (res.data.count ? res.data.count : 0);
                    res.data.list.forEach((item, index) => {
                        this.xAxis.push(item.date);
                        this.yAxis.push(item.count);
                    });
                    if (this.xAxis.length > 0) {
                        this.setChart();
                        this.reloadData();
                    } else {
                        setTimeout(() => {
                            this.showDefaultLine = true;
                        });
                    }
                }
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
            }, err => {
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
                window.location.href = window.baseUrl + '/error/404';
            })
        },
        setChart() {
            const _this = this;
            this.chart = echarts.init(document.getElementById(this.refId));
            // 绘制图表 
            this.option = {
                grid: {
                    left: "6%",
                    right: "6%",
                    top: "16%",
                    bottom: "18%"
                },
                xAxis: {
                    name: '',
                    type: "category",
                    boundaryGap: false,
                    data: this.xAxis,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        interval: 0,
                        color: '#9DC8FF',
                        fontSize: 10
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#EEEEEE',
                            type: 'solid',
                        }
                    },
                },
                yAxis: {
                    type: "value",
                    splitNumber: 5,
                    splitLine: {
                        lineStyle: {
                            color: '#DDDDDD',
                            type: 'dashed',
                            opacity: 0.5
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                    }
                },
                series: [{
                    name: "动态数",
                    data: this.yAxis,
                    type: "line",
                    smooth: true,
                    itemStyle: {
                        color: '#3364E3'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: '#9DC8FF' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#fff' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    },
                    label: {
                        show: true,
                        fontSize: 13
                    },
                    lineStyle: {
                        color: '#3364E3',
                        width: 2
                    },
                    symbolSize: 6,
                    emphasis: {
                        symbolSize: 6
                    },
                }]
            };
            this.chart.setOption(this.option);
        },
        // 重载数据
        reloadData() {
            const _this = this;
            window.reloadData = function() {
                _this.chart && _this.chart['dispose'] &&  _this.chart.dispose();
                _this.getSevenData();
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dynamic-line-chart {
    width: 3.75rem;
    height: 1.92rem;
}

.history-total {
    font-size: .14rem;
    color: #666666;
    letter-spacing: 0;
    line-height: .17rem;
    padding-left: .12rem;
}

.today-span {
    font-size: .12rem;
    color: #999999;
    letter-spacing: 0;
    line-height: .15rem;
    position: absolute;
    top: 1.84rem;
    right: 3%;
}

.default-line {
    display: block;
    width: calc(100% - .24rem);
    margin: .32rem auto .16rem auto;
}

.no-data-span {
    display: block;
    width: 100%;
    font-size: .12rem;
    color: #CCCCCC;
    letter-spacing: 0;
    text-align: center;
    line-height: .15rem;
    position: absolute;
    top: 1.82rem;
    left: 0;
}
</style>

<style>
.framework-view {
    background-color: #FFFFFF;
}
</style>
