<template>
    <div v-show="data.length > 0" :id="refId" class="line-chart">
        <div class="chart-title">{{title}}</div>
        <div class="chart-bottom">
            <ul class="chart-content clearfix">
                <li class="chart-block" v-for="(item, index) in data" :key="index" :style="{'width': (data.length <= 6) ? ((100 / data.length) + '%') : '16.66%'}" @click="goFriend(item)">
                    <div class="chart-block-top-box">
                        <div class="chart-block-top-bg">
                            <div class="chart-block-top" :style="{'height': (item.count / item.total) * 100 + '%', 'background-color': colors[index], 'min-height': item.count > 0 ? '.06rem' : '0'}"></div>
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
    name: "DataCenterOvalChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return 'dataCenterOvalChart';
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
            colors: ['#47C853', '#FFBA01', '#FF4F4F', '#FF49A6', '#D160EB', '#5A51DE'],
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
        goFriend(item) {
            if (this.clickAble && (item['index'] !== undefined && (item['index'] !== ''))) {
                this.selectInfo[this.selectType] = (item['index'] !== "" ? item['index'] : "-1");
                if (this.selectType === 'selectAge') {
                    let ages = (item.title && item.title.split('-'));
                    let num = parseInt(item.title) + "";
                    this.selectInfo['minAge'] = ((ages.length === 2) ? (parseInt(ages[0]) + "") : (num === "30" ? "0" : num));
                    this.selectInfo['maxAge'] = ((ages.length === 2) ? (parseInt(ages[1]) + "") : (num === "30" ? num : "+"));
                }
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
    min-height: 2.12rem;
    padding: .32rem .08rem .16rem .08rem;
}

.chart-content {
    width: 100%;
    height: 100%;
}

.chart-block {
    float: left;
    width: 14%;
    text-align: center;
    cursor: pointer;
    margin-bottom: .16rem;
}

.chart-block-top-box {
    display: inline-block;
    width: .44rem;
    height: 1rem;
    overflow: hidden;
}

.chart-block-top-bg {
    width: .44rem;
    height: 2rem;
    background-color: #F6F6F6;
    border-radius: 50%;
}

.chart-block-top {
    width: .44rem;
    height: 2rem;
    background-color: #47C853;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}

.range-text {
    width: 100%;
    font-size: .13rem;
    color: #2A2A2A;
    letter-spacing: 0;
    line-height: .16rem;
    margin-top: .13rem;
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