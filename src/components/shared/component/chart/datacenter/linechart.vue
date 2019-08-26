<template>
    <div v-show="xSeriesData.length > 0" class="line-chart animated faster" :class="{'fadeIn': showChart}">
        <div class="chart-title">{{title}}</div>
        <ul class="chart-tab clearfix">
            <li v-if="tabs.length === 2" class="chart-tab-block" v-for="(item, index) in tabs" :key="index" :class="{'current': selectType === item.type}" @click="changeType(item.type)">{{item.title}}</li>
        </ul>
        <div v-if="showTotal.show" class="show-title-box">{{showTotal.title}}{{showTotal.num}}</div>
        <div :id="refId" class="chart" :style="{width: chartWidth, height: chartHeight}" data-emergence="hidden"></div>
        <span v-show="type === '30d' && !isHour" class="day-from" :style="{'color': (this.selectType === 1) ? '#9DC8FF' : ((this.selectType === 2) ? '#FFBABA' : '#A5E4AE')}">{{xSeriesData[0]}}</span>
        <span v-show="type === '30d' && !isHour" class="day-to" :style="{'color': (this.selectType === 1) ? '#9DC8FF' : ((this.selectType === 2) ? '#FFBABA' : '#A5E4AE')}">{{xSeriesData[29]}}</span>
        <ul v-show="isHour" class="hour-x-series" :style="{'color': (this.selectType === 1) ? '#9DC8FF' : ((this.selectType === 2) ? '#FFBABA' : '#A5E4AE')}">
            <li class="hour-x" v-for="(item, index) in hourXSeries" :key="index" :style="{'left': 'calc(' + 16.8 * index + '%' + ' - 0.1rem)'}">{{item}}</li>
            <li class="hour-x" :style="{'left': 'auto', 'right': '-.15rem'}">23:00</li>
        </ul>
        <div v-if="bestTimes.length > 0" class="best-time-box">
            <span>{{simply ? '最佳发布时间：' : '最佳發佈時間：'}}</span>
            <span v-for="(item, index) in bestTimes" :key="index">{{item}}&nbsp;&nbsp;</span>
        </div>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

export default {
    name: "DataCenterLineChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return 'dataCenterLineChart';
            }
        },
        // 选择时间范围类型
        type: {
            type: String,
            default: function() {
                return '30d';
            }
        },
        // 传入图表标题
        title: {
            type: String,
            default: function() {
                return '';
            }
        },
        // 传入单位
        unit: {
            type: String,
            default: function() {
                return this.simply ? '个' : '個';
            }
        },
        // 颜色类型 1 蓝色， 2 红色， 3 绿色
        typeNum: {
            type: Number,
            default: function() {
                return 1;
            }
        },
        // 是否显示总数
        showTotal: {
            type: Object,
            default: function() {
                return {
                    show: false,
                    title: '',
                    num: 0
                };
            }
        },
        // 横向是否小时
        bestTime: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 横向是否小时
        isHour: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        // 头部切换栏
        tabs: {
            type: Array,
            default: function() {
                // 1 蓝色， 2 红色， 3 绿色 　{title: '', type: 1}
                return [];
            }
        },
        // 横向数据
        xData: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 第一个对象值
        yData1: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 第二个对象值，单个数据时只传这个
        yData2: {
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
            default: "2.8rem"
        }
    },
    components: {},
    data() {
        return {
            showChart: false,
            chart: new Object(),
            option: {},
            showChart: true,
            selectType: 1,
            xSeriesData: [],
            hourXSeries: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            ySeriesData1: [],
            ySeriesData2: [],
            maxIndex: 0,
            bestTimes: [],
            maxCount: 0
        };
    },
    mounted() {
        this.bestTimes = this.bestTime.sort();
        this.selectType = (this.tabs.length === 0 ? this.typeNum : this.tabs[0].type);
        this.setChart();
    },
    beforeCreate() {
        CommonJS.loadStyle('https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css');
    },
    watch: {
        yData1: {
            handler: function(value, oldvalue) {
                this.ySeriesData1 = value;
                this.chart && this.chart['dispose'] && this.chart.dispose();
                this.setChart();
            }
        },
        yData2: {
            handler: function(value, oldvalue) {
                this.ySeriesData2 = value;
                this.chart && this.chart['dispose'] && this.chart.dispose();
                this.setChart();
            }
        }
    },
    methods: {
        showAnimate(state) {
            this.showChart = state;
        },
        changeType(type) {
            if (type !== this.selectType) {
                this.selectType = type;
                this.chart && this.chart['dispose'] && this.chart.dispose();
                this.setChart();
            }
        },
        setChart() {
            const _this = this;
            this.asyncData();
            this.chart = echarts.init(document.getElementById(this.refId));
            // 绘制图表 
            this.option = {
                grid: {
                    left: _this.maxCount > 999 ? "12%" : "10%",
                    right: "8%",
                    top: "14%",
                    bottom: "10%"
                },
                xAxis: {
                    name: '',
                    type: "category",
                    boundaryGap: false,
                    data: this.xSeriesData,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: this.type !== '30d' && !this.isHour,
                        interval: 0,
                        color: (this.selectType === 1) ? '#9DC8FF' : ((this.selectType === 2) ? '#FFBABA' : '#A5E4AE'),
                        fontSize: 10
                    },
                    axisLine: {
                        lineStyle: {
                            color: (this.selectType === 1) ? '#9DC8FF' : ((this.selectType === 2) ? '#FFBABA' : '#A5E4AE'),
                            width: 1
                        }
                    },
                    axisPointer: {
                        value: this.xSeriesData[this.maxIndex],
                        snap: true,
                        lineStyle: {
                            color: (this.selectType === 1) ? '#548AFA' : ((this.selectType === 2) ? '#FF7373' : '#56DB62'),
                            width: 1,
                            type: 'dashed'
                        },
                        label: {
                            margin: -240,
                            fontSize: 10,
                            formatter: function(params) {
                                let index = _this.xSeriesData.indexOf(_this.isHour ? parseInt(params.value) : params.value);
                                return ((_this.type === '30d' && !_this.isHour) ? echarts.format.formatTime('MM-dd', params.value) : params.value) + (_this.isHour ? (_this.simply ? '时' : '時') : '') + '  ' + ((_this.selectType === 1) ? _this.ySeriesData1[index] : _this.ySeriesData2[index]) + _this.unit;
                            },
                            padding: [3.5, 9],
                            borderRadius: 4,
                            backgroundColor: (this.selectType === 1) ? '#4A7CFF' : ((this.selectType === 2) ? '#FF5959' : '#47C853')
                        },
                        handle: {
                            show: true,
                            size: 0
                        }
                    },
                },
                yAxis: {
                    type: "value",
                    splitNumber: 5,
                    minInterval: 1,
                    max: _this.maxCount < 5 ? 5 : null,
                    splitLine: {
                        lineStyle: {
                            color: (this.selectType === 1) ? '#D3E0FF' : ((this.selectType === 2) ? '#FFD4D4' : '#A5E4AE'),
                            type: 'dashed'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: (this.selectType === 1) ? '#9DC8FF' : ((this.selectType === 2) ? '#FFBABA' : '#A5E4AE'),
                        fontSize: 10,
                        margin: _this.maxCount > 999 ? 4 : 8,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: (this.selectType === 1) ? '#9DC8FF' : ((this.selectType === 2) ? '#FFBABA' : '#A5E4AE')
                        }
                    }
                },
                series: [{
                    name: "好友数",
                    data: (this.selectType === 1) ? this.ySeriesData1 : this.ySeriesData2,
                    type: "line",
                    smooth: false,
                    itemStyle: {
                        color: (this.selectType === 1) ? '#4A7CFF' : ((this.selectType === 2) ? '#FF5959' : '#47C853')
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
                                color: (this.selectType === 1) ? '#9DC8FF' : ((this.selectType === 2) ? '#FFBABA' : '#A5E4AE') // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#fff' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    },
                    lineStyle: {
                        color: (this.selectType === 1) ? '#4A7CFF' : ((this.selectType === 2) ? '#FF5959' : '#47C853'),
                        width: 2
                    },
                    symbolSize: 1,
                    emphasis: {
                        symbolSize: 5
                    },
                }]
            };
            this.chart.setOption(this.option);
        },
        asyncData() {
            this.ySeriesData1 = [];
            this.ySeriesData2 = [];
            if (this.yData1.length > 0) {
                this.xSeriesData = [];
                this.yData1.forEach((item, index) => {
                    this.xSeriesData.push(item.x);
                    this.ySeriesData1.push(item.count);
                });
            }
            if (this.yData2.length > 0) {
                this.xSeriesData = [];
                this.yData2.forEach((item, index) => {
                    this.xSeriesData.push(item.x);
                    this.ySeriesData2.push(item.count);
                });
            }
            let typeString = ('ySeriesData' + ((this.selectType === 1) ? '1' : '2'));
            let max = Math.max.apply(null, this[typeString]);
            this.maxCount = max;
            this.maxIndex = this[typeString].indexOf(max);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.line-chart {
    width: 100%;
    min-height: 1rem;
    background-color: #fff;
    border-radius: .08rem;
    margin-bottom: .12rem;
    box-shadow: 0 4px 16px 8px rgba(51, 100, 228, 0.04);
    padding-bottom: .32rem;
}

.chart {
    width: 100%;
    min-height: 1rem;
}

.chart-title {
    border-bottom: 0.005rem solid #ddd;
    font-weight: bold;
    padding: 0 .12rem;
    height: .48rem;
    font-size: .16rem;
    color: #2A2A2A;
    line-height: .48rem;
}

.chart-tab {
    width: 100%;
    padding: .32rem 0 0 .12rem;
}

.chart-tab-block {
    float: left;
    padding: 0 .12rem;
    line-height: .24rem;
    border-radius: .12rem;
    cursor: pointer;
    margin-right: .06rem;
    font-size: .12rem;
    color: #666666;
    text-align: center;
}

.chart-tab-block:hover,
.chart-tab-block.current {
    background-color: #3364E4;
    color: #fff;
}

.today-last-time {
    position: absolute;
    right: .05rem;
    bottom: .325rem;
    transform: scale(0.8);
    font-size: .1rem;
}

.day-from,
.day-to {
    font-size: 12px;
    position: absolute;
    right: -.03rem;
    bottom: .3rem;
    width: .85rem;
    text-align: center;
    transform: scale(0.8);
}

.day-from {
    left: .05rem;
}

.hour-x-series {
    width: 106.5%;
    position: absolute;
    left: -.06rem;
    bottom: .4rem;
    font-size: 12px;
    line-height: 12px;
    height: 12px;
    transform: scale(0.8);
}

.hour-x-series .hour-x {
    position: absolute;
    left: 0;
    top: 0;
}

.show-title-box {
    position: absolute;
    left: .12rem;
    top: .52rem;
    font-size: .13rem;
    color: #2A2A2A;
}

.best-time-box {
    position: absolute;
    left: 0;
    bottom: .08rem;
    font-size: .13rem;
    color: #2A2A2A;
    width: 100%;
    text-align: center;
}
</style>