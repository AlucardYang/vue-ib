<template>
    <div v-if="data.length > 0" class="chart">
        <div class="chart-title">{{action_rank}}</div>
        <ul class="bar-chart-content" :id="refId" data-emergence="hidden">
            <li v-if="data.length > 0" class="bar-chart-block" v-for="(item, index) in data" :key="index" v-show="item.done_num > 0">
                <div class="bar-chart-block-title">{{item.cate_name}} (<span style="font-weight:bold">{{item.done_num}}</span>)</div>
                <div class="bar-progress-bg">
                    <div class="bar-progress animated slow" :class="{'slideInLeft': showChart}" :style="{'background-color': item.cate_color, width: item.done_num / total * 100 + '%'}"></div>
                    <div class="bar-progress-total animated slower" :class="{'color-fff': item.done_num / total > 0.56, 'fadeIn': showChart}"></div>
                </div>
                <div class="bar-progress-desc">
                    <span>{{presentMonth}}{{month_action_num}}{{item.prev_done_num <= 99 ? item.prev_done_num : '99+'}} (</span>
                    <i v-if="item.done_num - item.prev_done_num > 0" class="iconfont tendency-type increase-color">&#xe677;</i>
                    <i v-if="item.done_num - item.prev_done_num === 0" class="iconfont tendency-type tendency-type-flat flat-color">&#xe675;</i>
                    <i v-if="item.done_num - item.prev_done_num < 0" class="iconfont tendency-type decrease-color">&#xe676;</i>
                    <span>{{Math.abs(item.done_num - item.prev_done_num) <= 99 ? Math.abs(item.done_num - item.prev_done_num) : '99+'}})</span>
                </div>
            </li>
            <li v-if="data.length === 0" class="no-data">無數據</li>
        </ul>
        <div class="border-bottom-dashed"></div>
    </div>
</template>

<script>
export default {
    name: "RankBarChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "rankBarChart";
            }
        },
        data: {
            type: Array,
            default: function() {
                return [];
            }
        },
        presentMonth: {
            type: Number,
            default: function() {
                return 1;
            }
        }
    },
    data() {
        return {
            action_rank: this.simply ? '行动量类型排行' : '行動量類型排行',
            month_action_num: this.simply ? '月行动量' : '月行動量',
            showChart: false,
            total: 0
        };
    },
    components: {},
    watch: {
        data: {
            handler: function(value, oldvalue) {
                this.getSum(value);
            }
        }
    },
    mounted: function() {
        this.getSum(this.data);
    },
    methods: {
        showAnimate(state) {
            this.showChart = state;
        },
        getSum(arr) {
            let sum = 0;
            arr.forEach((item, index) => {
                sum += item.done_num;
            });
            this.total = sum;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
    width: 100%;
    min-height: 2.2rem;
    background-color: #fff;
    border-radius: 0.2rem;
    border-bottom: 0.02rem solid transparent;
    padding-top: 0.33rem;
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

.chart-title {
    width: 100%;
    font-size: 0.18rem;
    color: #2a2a2a;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.22rem;
    font-weight: bold;
}

.bar-chart-content {
    margin-top: 0.38rem;
    width: 100%;
    padding: 0.24rem 0.24rem 0.08rem 0.24rem;
}

.bar-chart-block {
    width: 100%;
    margin-bottom: 0.26rem;
}

.bar-chart-block-title {
    font-size: 0.15rem;
    color: #2a2a2a;
    letter-spacing: 0;
    line-height: 0.18rem;
}

.bar-progress-bg {
    width: 100%;
    height: 0.18rem;
    border-radius: 0.09rem;
    background: #f6f6f6;
    margin-top: 0.06rem;
    position: relative;
    overflow: hidden;
}

.bar-progress {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0.18rem;
    border-radius: 0.09rem;
    background: #f6f6f6;
}

.bar-progress-total {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-size: 0.12rem;
    color: #2a2a2a;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.18rem;
}

.color-fff {
    color: #ffffff;
}

.bar-progress-desc {
    width: 100%;
    font-size: 0.12rem;
    color: #999999;
    line-height: 0.14rem;
    margin-top: 0.07rem;
}

.tendency-type {
    display: inline-block;
    vertical-align: bottom;
    font-size: 0.22rem;
    width: 0.16rem;
    margin-left: -0.09rem;
}

.tendency-type-flat {
    font-size: 0.2rem;
    width: 0.66rem;
    margin-left: -0.57rem;
}

.no-data {
    height: 2rem;
    line-height: 2rem;
    text-align: center;
}
</style>
