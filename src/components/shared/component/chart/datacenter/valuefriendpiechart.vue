<template>
    <div v-show="seriesData.length > 0" class="chart">
        <div :id="refId" :style="{width: chartWidth, height: chartHeight}"></div>
        <ul class="chart-bottom">
            <li class="chart-bottom-block" v-for="(item, index) in data" :key="index" :style="{color: index === 0 ? colors[0] : '#666666'}" @click="goFriend(item.value)">
                <div>
                    <span>{{item.title}}</span>
                    <i v-show="index === 0" class="iconfont tip-icon" @click="showTip = true">&#xe6be;</i>
                    <div v-show="index === 0 && showTip" class="tip-box">{{valueFriendTip}}</div>
                </div>
                <div class="num">{{((item.count / item.total) * 100).toFixed(1)}}%</div>
            </li>
        </ul>
    </div>
</template>

<script>
import selectInfo from '@/components/shared/component/chart/datacenter/selectinfo.js';

export default {
    name: "ValueFriendPieChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "valueFriendPieChart";
            }
        },
        data: {
            type: Array,
            default: function() {
                return [12, 20];
            }
        },
        chartWidth: {
            type: String,
            default: "3.51rem"
        },
        chartHeight: {
            type: String,
            default: "1.6rem"
        }
    },
    data() {
        return {
            showTip: false,
            valueFriendTip: this.simply ? '平台根据好友动态，资料等多维度算法评估好友是否达到重点价值好友' : '平台根據好友動態，資料等多維度算法評估好友是否達到重點價值好友',
            chart: null,
            option: {},
            seriesData: [],
            cates: [],
            colors: ['#FF3436', '#EEEEEE'],
            selectInfo: JSON.parse(JSON.stringify(selectInfo)),
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
        hideTipFn() {
            const _this = this;
            setTimeout(() => {
                document.querySelector('.com-scroll-y').onclick = function(event) {
                    if ((event.target.className.indexOf('tip-icon') === -1) && (event.target.className.indexOf('tip-box') === -1)) {
                        _this.showTip = false;
                    }
                };
            });
        },
        showAnimate(state) {
            if (this.chart) {
                !state && this.chart.clear();
                state && this.chart.setOption(this.option);
            }
        },
        setChart(data) {
            this.hideTipFn();
            this.asyncData(data);
            this.chart = echarts.init(document.getElementById(this.refId));
            // 绘制图表
            this.option = {
                title: {
                    text: '',
                    left: "center",
                    top: 32.5
                },
                calculable: true,
                series: [{
                    name: "面积模式",
                    type: "pie",
                    selectedMode: 'single',
                    selectedOffset: 6,
                    hoverAnimation: true,
                    radius: [0, 50],
                    center: ["50%", "50%"],
                    label: {
                        show: false,
                        fontSize: 10
                    },
                    labelLine: {
                        show: false
                    },
                    data: this.seriesData
                }]
            };
            this.chart.setOption(this.option);
        },
        asyncData(value) {
            this.seriesData = [];
            value.forEach((item, index) => {
                let obj = {
                    name: item.title,
                    value: item.count,
                    total: item.total,
                    itemStyle: {
                        color: this.colors[index]
                    },
                    emphasis: {
                        itemStyle: {
                            color: this.colors[index]
                        },
                    }
                };
                index === 0 && (obj.selected = true);
                index === 0 && (obj.tip = this.valueFriendTip);
                this.seriesData.push(obj);
            });
        },
        goFriend(value) {
            if ((value !== undefined) && (value !== '')) {
                this.selectInfo['selectWorth'] = value;
                this.appFn.goFriend(this.selectInfo);
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
    width: 100%;
    min-height: 1rem;
    background-color: #fff;
    border-radius: .08rem;
    margin-bottom: .12rem;
    box-shadow: 0 4px 16px 8px rgba(51, 100, 228, 0.04);
    padding: .2rem 0 .3rem 0;
}

.chart-bottom {
    width: 100%;
    height: .5rem;
}

.chart-bottom-block {
    float: left;
    width: 50%;
    text-align: center;
    font-weight: bold;
    font-size: .14rem;
    color: #666666;
    line-height: .17rem;
    height: .48rem;
    cursor: pointer;
}

.chart-bottom-block .num {
    font-weight: bold;
    font-size: .2rem;
    letter-spacing: 0;
    line-height: .24rem;
    margin-top: .04rem;
}

.tip-icon {
    display: inline-block;
    font-size: .13rem;
    line-height: .14rem;
    color: #DEDEDE;
    border-radius: .12rem;
    cursor: pointer;
}

.tip-box {
    position: absolute;
    top: .26rem;
    left: 0;
    width: 2.2rem;
    height: .52rem;
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
    right: .95rem;
    content: '';
    border: .1rem solid transparent;
    border-left-width: .07rem;
    border-right-width: .07rem;
    border-bottom: .1rem solid rgba(100, 106, 121, .9);
    z-index: 2;
}
</style>
