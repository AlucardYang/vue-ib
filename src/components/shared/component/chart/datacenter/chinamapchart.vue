<template>
    <div v-show="data.length > 0" class="chart animated faster" :class="{'fadeIn': showChart}">
        <div class="chart-title">
            <span class="chart-title-span" @click="showTip = true">{{title}}</span>
            <i v-if="titleTip" class="iconfont tip-icon" @click="showTip = true">&#xe6be;</i>
            <div v-show="titleTip && showTip" class="tip-box">{{titleTip}}</div>
        </div>
        <div class="chart-bottom">
            <div class="map-outer">
                <div :id="refId" class="chart-content" :style="{width: chartWidth, height: chartHeight}" data-emergence="hidden"></div>
            </div>
            <ul class="map-list clearfix">
                <li class="map-list-block" v-for="(item, index) in data" :key="index" @click="goFriend(item)">
                    <div class="top" :style="{'color': index === 0 ? '#2187F8' : '#2A2A2A'}">{{item.title}}</div>
                    <div class="bottom" :style="{'color': index === 0 ? '#2187F8' : '#2A2A2A', 'font-weight': index === 0 ? 'bold' : 'normal'}">{{item.count}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import chinaJS from '@/components/shared/component/chart/datacenter/china.js';
import CommonJS from '@/components/shared/service/common.js';

import selectInfo from '@/components/shared/component/chart/datacenter/selectinfo.js';

export default {
    name: "DataCenterChinaMapChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "dataCenterChinaMapChart";
            }
        },
        title: {
            type: String,
            default: function() {
                return '';
            }
        },
        data: {
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
                return true;
            }
        },
        titleTip: {
            type: String,
            default: function() {
                return '';
            }
        },
        chartWidth: {
            type: String,
            default: "3.75rem"
        },
        chartHeight: {
            type: String,
            default: "3.16rem"
        }
    },
    data() {
        return {
            showChart: false,
            chart: null,
            option: {},
            seriesData: JSON.parse(JSON.stringify(chinaJS.provinces(this.lang))),
            colors: ['#032164', '#072E83', '#163E97', '#2250B8', '#2D5FD0', '#3C71E8', '#5CA2FF', '#97C4FF', '#CCE2FF'],
            selectInfo: JSON.parse(JSON.stringify(selectInfo)),
            showTip: false
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
    beforeCreate() {
        CommonJS.loadStyle('https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css');
    },
    created() {
        chinaJS.registerChinaMap(this.lang);
    },
    mounted() {
        this.setChart(this.data);
    },
    methods: {
        showAnimate(state) {
            this.showChart = state;
        },
        setChart(data) {
            this.hideTipFn();
            this.asyncData(data);
            this.chart = echarts.init(document.getElementById(this.refId));
            // 绘制图表
            this.option = {
                tooltip: {
                    formatter: function(param) {
                        return param.name && (param.name + '：' + param.value);
                    }, //提示标签格式
                    backgroundColor: "#92BCFF", //提示标签背景颜色
                    padding: 4,
                    textStyle: {
                        fontSize: 10,
                        color: "#fff"
                    } //提示标签字体颜色
                },
                series: [{
                    type: 'map',
                    mapType: 'china',
                    label: {
                        normal: {
                            show: false, //显示省份标签
                            align: 'center',
                            textStyle: {
                                color: "#c71585"
                            } //省份标签字体颜色
                        },
                        emphasis: { //对应的鼠标悬浮效果
                            show: false,
                            textStyle: {
                                color: "#800080"
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: .5, //区域边框宽度
                            borderColor: '#92BCFF', //区域边框颜色
                            areaColor: "#E8F2FF", //区域颜色
                        },
                        emphasis: {
                            borderWidth: .5,
                            borderColor: '#92BCFF',
                            areaColor: "#E8F2FF",
                        }
                    },
                    data: this.seriesData
                }],
            };
            this.chart.setOption(this.option);
        },
        asyncData(value) {
            value.forEach((item, index) => {
                this.seriesData.forEach((item1, index1) => {
                    if (item.title === item1.name && (item.count > 0)) {
                        item1.value = item.count;
                        item1.selected = true;
                        item1.itemStyle = {
                            normal: {
                                borderWidth: .5,
                                borderColor: this.colors[index],
                                areaColor: this.colors[index],
                            },
                            emphasis: {
                                borderWidth: .5,
                                borderColor: this.colors[index],
                                areaColor: this.colors[index],
                            }
                        }
                    }
                });
            });
        },
        goFriend(item) {
            if (this.clickAble && item.title && item.province_code) {
                this.selectInfo['location'] = item.province_code;
                this.selectInfo['locationText'] = item.title + '-不限';
                this.selectInfo[this.selectType] = [
                    { 'name': item.title, 'value': item.province_code },
                    { 'name': '不限', 'value': '-1' }
                ];
                this.appFn.goFriend(this.selectInfo);
            }
        },
        hideTipFn() {
            const _this = this;
            document.querySelector('.com-scroll-y').onclick = function(event) {
                if ((event.target.className.indexOf('tip-icon') === -1) && (event.target.className.indexOf('tip-box') === -1) && (event.target.className.indexOf('chart-title-span') === -1)) {
                    _this.showTip = false;
                }
            };
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
    width: 100%;
    min-height: 4.44rem;
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
    min-height: 3.96rem;
    padding: .32rem 0 0 0;
}

.map-outer {
    width: 3.27rem;
    height: 2.76rem;
    border-radius: .08rem;
    background-color: #EEF8FF;
    border-radius: .06rem;
    overflow: hidden;
    margin: 0 auto;
}

.chart-content {
    background-color: #EEF8FF;
    border-radius: .06rem;
    position: absolute;
    left: -.23rem;
    top: -.2rem;
}

.map-list {
    width: 100%;
    padding: .12rem 0;
}

.map-list-block {
    width: 25%;
    height: .66rem;
    padding: 0 .13rem;
    float: left;
    cursor: pointer;
}

.map-list-block .top {
    width: 100%;
    height: .38rem;
    font-size: .13rem;
    color: #2A2A2A;
    text-align: center;
    line-height: .16rem;
    padding-bottom: .04rem;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.map-list-block .bottom {
    width: 100%;
    height: .32rem;
    font-size: .14rem;
    color: #2A2A2A;
    text-align: center;
    line-height: .17rem;
    padding-top: .04rem;
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
    top: .42rem;
    left: 24%;
    width: 2.2rem;
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
    left: 15%;
    content: '';
    border: .1rem solid transparent;
    border-left-width: .07rem;
    border-right-width: .07rem;
    border-bottom: .1rem solid rgba(100, 106, 121, .9);
    z-index: 2;
}
</style>
