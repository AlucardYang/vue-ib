<template>
    <div v-show="data.length > 0" :id="refId" class="circle-chart">
        <div class="chart-title">{{title}}</div>
        <ul class="chart-bottom clearfix">
            <li class="chart-bottom-block" v-for="(item, index) in data" :key="index" :style="{'width': (data.length <= 4) ? ((100 / data.length) + '%') : '25%'}" @click="goFriend(item.index)">
                <div class="chart">
                    <div class="bottom-circle">
                        <div class="center-circle left" :style="{'background-color': colors[index], 'transform': 'rotate(' + ((item.percentage > 50) ? 180 : (item.percentage / 100 * 360)) + 'deg)'}"></div>
                        <div v-show="item.percentage > 50" class="center-circle right" :style="{'background-color': colors[index], 'transform': 'rotate(' + ((item.percentage - 50) / 100 * 360) + 'deg)'}"></div>
                        <div v-show="item.percentage <= 50" class="mask-left"></div>
                        <div v-show="item.percentage > 0" class="little-cicle" :style="{'background-color': colors[index]}"></div>
                        <div v-show="item.percentage > 0" class="little-cicle-bar" :style="{'transform': 'rotate(' + (item.percentage / 100 * 360) + 'deg)'}">
                            <div class="little-cicle" :style="{'background-color': colors[index]}"></div>
                        </div>
                    </div>
                    <div class="top-circle">
                        <div class="total">
                            <span class="num">{{item.percentage}}</span>
                            <span class="unit">%</span>
                        </div>
                    </div>
                    <div class="outer-circle"></div>
                </div>
                <div class="title">{{item.title}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import selectInfo from '@/components/shared/component/chart/datacenter/selectinfo.js';

export default {
    name: "DataCenterFromCircleChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return 'dataCenterFromCircleChart';
            }
        },
        data: {
            type: Array,
            default: function() {
                return [];
            }
        },
        title: {
            type: String,
            default: function() {
                return '';
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
    },
    data() {
        return {
            colors: ['#47C853', '#FF4F4F', '#555CD9', '#D160EB'], // 固定颜色值
            selectInfo: JSON.parse(JSON.stringify(selectInfo))
        };
    },
    watch: {
        data: {
            handler: function(value, oldvalue) {
                this.asyncData();
            }
        }
    },
    mounted() {
        this.asyncData();
    },
    methods: {
        asyncData() {
            this.data.forEach((item, index) => {
                item.percentage = ((item.count / item.total) * 100).toFixed(1);
            });
            this.$forceUpdate();
        },
        goFriend(index) {
            if (this.clickAble && (index !== undefined && (index !== ''))) {
                this.selectInfo[this.selectType] = (index !== "" ? index : "-1");
                this.appFn.goFriend(this.selectInfo);
            }
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.circle-chart {
    width: 100%;
    min-height: 2.06rem;
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
    min-height: 1.56rem;
    padding: .16rem .08rem;
}

.chart-bottom-block {
    float: left;
    width: 25%;
    height: 1.24rem;
    cursor: pointer;
}

.chart-bottom-block .chart {
    position: absolute;
    left: calc(50% - .9rem);
    top: -.42rem;
    width: 1.8rem;
    padding: 0.1rem;
    height: 1.8rem;
    transform: scale(0.44);
}

.chart-bottom-block .title {
    width: 100%;
    text-align: center;
    font-size: .13rem;
    color: #2A2A2A;
    letter-spacing: 0;
    line-height: .16rem;
    position: absolute;
    left: 50%;
    bottom: .14rem;
    transform: translateX(-50%);
}

.little-cicle-bar {
    position: absolute;
    top: 0;
    left: calc(50% - 0.075rem);
    width: 0.15rem;
    height: 100%;
    z-index: 4;
}

.little-cicle {
    position: absolute;
    top: 0.25%;
    left: calc(50% - 0.075rem);
    width: 0.15rem;
    height: 0.15rem;
    border-radius: 50%;
    z-index: 4;
}

.little-cicle-bar .little-cicle {
    top: 0.6%;
    left: 0;
}

.bottom-circle {
    position: absolute;
    left: calc(50% - .8rem);
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background-color: #f5f6f7;
}

.center-circle,
.mask-left {
    position: absolute;
    width: 99%;
    height: 99%;
    top: 0.5%;
    left: 0.5%;
    border-radius: 50%;
    background-color: #2f76ff;
    z-index: 1;
    clip: rect(0, 0.8rem, 1.6rem, 0);
}

.mask-left {
    background-color: #f5f6f7;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    clip: rect(0, 0.82rem, 1.6rem, 0);
    z-index: 2;
}

.center-circle.right {
    clip: rect(0, 1.6rem, 1.6rem, 0.8rem);
}

.top-circle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    text-align: center;
    z-index: 10;
    background-color: #fff;
}

.circle-chart .total {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #000;
}

.circle-chart .total span {
    display: inline-block;
    vertical-align: top;
}

.circle-chart .total .num {
    font-size: 0.36rem;
    line-height: 0.36rem;
    font-weight: bold;
    padding-left: .1rem;
}

.circle-chart .total .unit {
    font-size: 0.16rem;
    line-height: 0.16rem;
    margin-left: -0.02rem;
}

.circle-chart .total .desc {
    width: 100%;
    font-size: 0.14rem;
    line-height: 0.14rem;
}

.outer-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 1.7rem;
    height: 1.7rem;
    border: 0.066rem solid #fff;
    border-radius: 50%;
    background-color: transparent;
    z-index: 9;
}
</style>
