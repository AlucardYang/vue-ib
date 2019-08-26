<template>
    <div v-show="data.length > 0" :id="refId" class="line-chart">
        <div class="chart-title">{{title}}</div>
        <div class="chart-bottom">
            <ul class="chart-content clearfix">
                <li class="chart-block" v-for="(item, index) in data" :key="index" :style="{'width': (data.length <= 6) ? ((100 / data.length) + '%') : '16.66%'}" @click="goFriend(item.index)">
                    <div class="chart-block-top-box">
                        <div class="chart-block-top-bg">
                            <div class="chart-block-top" :style="{'height': (item.count / item.total) * 100 + '%', 'background-color': colors[index], 'min-height': item.count > 0 ? '.04rem' : 0}"></div>
                        </div>
                    </div>
                    <div class="range-text">{{item.title}}</div>
                    <div class="range-value">{{((item.count / item.total) * 100).toFixed(1)}}%</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import selectInfo from '@/components/shared/component/chart/datacenter/selectinfo.js';

export default {
    name: "DataCenterVerticalBarChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return 'dataCenterVerticalBarChart';
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
    },
    data() {
        return {
            chart: new Object(),
            option: {},
            showChart: true,
            colors: ['#FF49A6', '#FF4F4F', '#2187F8', '#47C853'],
            selectInfo: JSON.parse(JSON.stringify(selectInfo))
        };
    },
    mounted() {},
    created() {},
    watch: {
        data: {
            handler: function(value, oldvalue) {}
        }
    },
    methods: {
        goFriend(index) {
            if (this.clickAble && (index !== undefined && (index !== ''))) {
                this.selectInfo[this.selectType] = [(index !== "" ? index : "-1")];
                this.appFn.goFriend(this.selectInfo);
            }
        },
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

.chart-bottom {
    width: 100%;
    min-height: 2.58rem;
    padding: .32rem .12rem .16rem .12rem;
}

.chart-content {
    width: 100%;
    height: 100%;
}

.chart-block {
    float: left;
    width: 25%;
    text-align: center;
    cursor: pointer;
    margin-bottom: .16rem;
}

.chart-block-top-box {
    display: inline-block;
    width: .24rem;
    height: 1.5rem;
}

.chart-block-top-bg {
    width: .24rem;
    height: 1.5rem;
    background-color: #F6F6F6;
    border-radius: .12rem .12rem 0 0;
}

.chart-block-top {
    width: 100%;
    height: 2rem;
    background-color: #47C853;
    border-radius: .12rem .12rem 0 0;
    position: absolute;
    bottom: 0;
    left: 0;
}

.range-text {
    width: 100%;
    font-size: .13rem;
    color: #2A2A2A;
    letter-spacing: 0;
    line-height: .16rem;
    margin-top: .03rem;
}

.range-value {
    width: 100%;
    font-size: .11rem;
    color: #2A2A2A;
    letter-spacing: 0;
    text-align: center;
    line-height: .16rem;
    margin-top: .02rem;
}
</style>