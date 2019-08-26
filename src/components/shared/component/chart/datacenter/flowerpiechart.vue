<template>
    <div v-show="seriesData.length > 0" class="chart">
        <div class="chart-title">{{title}}</div>
        <div class="chart-bottom" :id="refId" :style="{width: chartWidth, height: chartHeight}"></div>
        <div v-if="otherLegend.length > 0 && showOther" class="legend-style">
            <span class="circle" :style="{'background-color': colors[seriesData.length - 1]}"></span>
            <span>{{simply ? '其他类型包括：' : '其他類型包括：'}}{{otherLegend.join('，')}}</span>
        </div>
    </div>
</template>

<script>
import selectInfo from '@/components/shared/component/chart/datacenter/selectinfo.js';

export default {
    name: "DataCenterFlowerPieChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "dataCenterFlowerPieChart";
            }
        },
        title: {
            type: String,
            default: function() {
                return '';
            }
        },
        // 图表中显示数值
        showNum: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        data: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 其他类型图例
        otherLegend: {
            type: Array,
            default: function() {
                return [];
            }
        },
        selectType: {
            type: String,
            default: function() {
                return '';
            }
        },
        clickAble: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        chartWidth: {
            type: String,
            default: "3.51rem"
        },
        chartHeight: {
            type: String,
            default: "2.94rem"
        }
    },
    data() {
        return {
            chart: null,
            option: {},
            seriesData: [],
            friendData: [],
            colors: ['#5793F3', '#47C853', '#FFC200', '#FF544B', '#FF49A6', '#5A51DE'],
            showOther: false,
            selectInfo: JSON.parse(JSON.stringify(selectInfo))
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
            const _this = this;
            this.chart = echarts.init(document.getElementById(this.refId));
            // 绘制图表
            this.option = {
                // calculable: true,
                series: [{
                    name: "面积模式",
                    type: "pie",
                    hoverAnimation: false,
                    radius: [10, 56],
                    center: ["50%", "50%"],
                    // roseType: "area",
                    avoidLabelOverlap: true,
                    labelLine: {
                        show: true,
                        length: 10,
                        length2: 20,
                    },
                    label: {
                        fontSize: 10,
                        lineHeight: 11,
                        formatter: function(param) {
                            return param.name + '\n' + (_this.showNum ? param.value + ' ' : '') + '(' + param.percent.toFixed(1) + '%)';
                        },
                        rich: {
                            b: {
                                fontSize: 11,
                            },
                            d: {
                                fontSize: 11,
                                padding: [2, 0]
                            }
                        }
                    },
                    labelLine: {
                        length: 14,
                        length2: 8
                    },
                    data: this.seriesData
                }]
            };
            this.chart.setOption(this.option);
            this.bindClick();
        },
        asyncData(value) {
            this.seriesData = new Array();
            this.friendData = value;
            // 无数据时显示
            if (value.length === 0) {
                this.seriesData = new Array();
            } else {
                value.forEach((item, index) => {
                    item.title === '其他' && (this.showOther = true);
                    if (item.total !== 0) {
                        let obj = {
                            value: item.count,
                            name: item.title.replace(/HK\$/ig, ''),
                            index: item.index,
                            itemStyle: {
                                color: this.colors[index]
                            }
                        }
                        this.seriesData.push(obj);
                    }
                });
            }
        },
        bindClick() {
            const _this = this;
            this.chart.on('click', function(params) {
                if (_this.clickAble && params.name && (params.data.index !== undefined && (params.data.index !== ''))) {
                    if (_this.selectType === 'selectIncome') {
                        _this.selectInfo[_this.selectType] = (params.data.index !== "" ? params.data.index : "-1");
                        let range = params.name.split('-');
                        if (range.length === 1) {
                            let money = range[0].replace(/\,/ig, '').replace(/少于/ig, '').replace(/少於/ig, '').replace(/以上/ig, '');
                            if (money == 40001 || (money == 40000)) {
                                _this.selectInfo['minIncome'] = money;
                                _this.selectInfo['maxIncome'] = '';
                            } else if (money == 15000) {
                                _this.selectInfo['minIncome'] = '';
                                _this.selectInfo['maxIncome'] = money;
                            }
                        } else if (range.length === 2) {
                            _this.selectInfo['minIncome'] = range[0].replace(/\,/ig, '');
                            _this.selectInfo['maxIncome'] = range[1].replace(/\,/ig, '');
                        }
                    }
                    _this.appFn.goFriend(_this.selectInfo);
                }
            });
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
    width: 100%;
    min-height: 3.42rem;
    background-color: #fff;
    border-radius: .08rem;
    margin-bottom: .12rem;
    box-shadow: 0 4px 16px 8px rgba(51, 100, 228, 0.04);
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

.chart-bottom {
    width: 100%;
    height: 2.94rem;
}

.legend-style {
    width: 100%;
    text-align: center;
    font-size: .12rem;
    color: #999999;
    line-height: .15rem;
    padding-bottom: .32rem;
    margin-top: -.2rem;
}

.legend-style .circle {
    display: inline-block;
    width: .1rem;
    height: .1rem;
    border-radius: .05rem;
    background-color: #D160EB;
}
</style>
