<template>
    <div v-if="data.length > 0" :id="refId" class="line-chart">
        <div class="chart-title">{{title}}</div>
        <div class="chart-bottom">
            <ul class="chart-content">
                <li class="chart-block" v-for="(item, index) in data" :key="index" @click="goFriend(item)">
                    <div class="range-title">{{item.title}}&nbsp;&nbsp;({{((item.count / item.total) * 100).toFixed(1)}}%)</div>
                    <div class="chart-block-bar-box">
                        <div class="chart-block-bar-bg">
                            <div class="chart-block-bar" :style="{'width': (item.count / item.total) * 100 + '%', 'background-color': colors[index % 10], 'min-width': item.count > 0 ? '.06rem' : '0'}"></div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import selectInfo from '@/components/shared/component/chart/datacenter/selectinfo.js';

export default {
    name: "DataCenterHorizontalBarChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return 'dataCenterHorizontalBarChart';
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
            colors: ['#2DBCF9', '#FF49A6', '#2187F8', '#FFBA01', '#47C853', '#FF7F29', '#555CD9', '#FF4F4F', '#04BBC2', '#C874DB'],
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
            if (this.clickAble && (item.index !== undefined && (item.index !== ''))) {
                this.selectInfo[this.selectType] = (item.index !== "" ? item.index : "-1");
                if (this.selectType === 'selectIncome') {
                    if (item.title) {
                        let range = item.title.split('-');
                        if (range.length === 1) {
                            let money = range[0].replace(/\,/ig, '').replace(/少于/ig, '').replace(/少於/ig, '').replace(/以上/ig, '').replace(/HK\$/ig, '');
                            if (money == 40001 || (money == 40000)) {
                                this.selectInfo['minIncome'] = money;
                                this.selectInfo['maxIncome'] = '';
                            } else if (money == 15000) {
                                this.selectInfo['minIncome'] = '';
                                this.selectInfo['maxIncome'] = money;
                            }
                        } else if (range.length === 2) {
                            this.selectInfo['minIncome'] = range[0].replace(/\,/ig, '').replace(/HK\$/ig, '');
                            this.selectInfo['maxIncome'] = range[1].replace(/\,/ig, '').replace(/HK\$/ig, '');
                        }
                    }
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
    min-height: 1.2rem;
    padding: .2rem .24rem;
}

.chart-content {
    width: 100%;
    height: 100%;
}

.chart-block {
    width: 100%;
    cursor: pointer;
}

.chart-block-bar-box {
    width: 100%;
    height: .44rem;
    padding: .12rem 0;
}

.chart-block-bar-bg {
    width: 100%;
    height: .18rem;
    background-color: #F6F6F6;
    border-radius: .09rem;
    overflow: hidden;
}

.chart-block-bar {
    width: 100%;
    height: .18rem;
    background-color: #47C853;
    border-radius: .09rem;
    position: absolute;
    top: 0;
    left: 0;
}

.range-title {
    width: 100%;
    font-size: .14rem;
    color: #2A2A2A;
    letter-spacing: 0;
    line-height: .17rem;
    margin-top: .12rem;
}
</style>