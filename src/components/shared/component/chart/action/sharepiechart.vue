<template>
    <div class="chart">
        <div v-show="isPro" :id="refId" :style="{width: chartWidth, height: chartHeight}" data-emergence="hidden"></div>
        <div v-if="!isPro" class="chart-title">{{share_data_title + " (" + actionTypeKey + "新增)"}}</div>
        <pro-btn v-if="!isPro" :suggest="simply ? '升级iBer Pro查看APP分享数据统计' : '升級iBer Pro查看APP分享數據統計'"></pro-btn>
        <!-- 无数据提示 -->
        <div v-if="shareStatLists.length === 0 && isPro" class="nodata-content">
            <div class="nodata-box">
                <img class="error-404-img" src="https://static.iberhk.com/v2/web/images/action/no-chart-data.png">
                <span v-if="currentUserPro" class="error-404-text">{{simply ? '无APP分享数据统计' : '無APP分享數據統計'}}</span>
                <span v-if="!currentUserPro" class="error-404-text">{{simply ? '此iBer用户不是Pro用户，暂时不支持查看' : '此iBer用戶不是Pro用戶，暫時不支持查看'}}</span>
            </div>
        </div>
        <ul v-if="shareStatLists.length > 0 && isPro" class="list-box">
            <li class="list-row clearfix" v-for="(item, index) in shareStatLists" :key="index">
                <div class="list-row-title">
                    <span class="status-circle" :style="{'background-color': innerData[index]['itemStyle']['color']}"></span>
                    <span>{{innerData[index]['cate']}}</span>
                    <div class="other" v-if="innerData[index]['cate'] === '其他' && (other.length > 0)">
                        <span>(</span>
                        <span class="other-string com-nowrap">{{other.join('，')}}</span>
                        <span>)</span>
                    </div>
                </div>
                <div class="list-row-block">
                    <span class="left">{{browse_num_title}}</span>
                    <span>{{item.browse <= 99 ? item.browse : '99+'}}次</span>
                    <div v-if="showTendency" class="tendency-box">
                        <span>{{actionType === 'week' ? '上' : presentMonth}}{{actionTypeKey}}新增{{item.prev_browse <= 99 ? item.prev_browse : '99+'}} (</span>
                        <i v-if="item.browse - item.prev_browse > 0" class="iconfont tendency-type increase-color">&#xe677;</i>
                        <i v-if="item.browse - item.prev_browse === 0" class="iconfont tendency-type tendency-type-flat flat-color">&#xe675;</i>
                        <i v-if="item.browse - item.prev_browse < 0" class="iconfont tendency-type decrease-color">&#xe676;</i>
                        <span>{{Math.abs(item.browse - item.prev_browse) <= 99 ? Math.abs(item.browse - item.prev_browse) : '99+'}}</span>
                        <span>)</span>
                    </div>
                </div>
                <div class="list-row-block" style="margin-right: 0;">
                    <span class="left">新好友</span>
                    <span>{{item.new_moments <= 99 ? item.new_moments : '99+'}}{{new_circle_unit}}</span>
                    <div v-if="showTendency" class="tendency-box">
                        <span>{{actionType === 'week' ? '上' : presentMonth}}{{actionTypeKey}}新增{{item.prev_new_moments}} (</span>
                        <i v-if="item.new_moments - item.prev_new_moments > 0" class="iconfont tendency-type increase-color">&#xe677;</i>
                        <i v-if="item.new_moments - item.prev_new_moments === 0" class="iconfont tendency-type tendency-type-flat flat-color">&#xe675;</i>
                        <i v-if="item.new_moments - item.prev_new_moments < 0" class="iconfont tendency-type decrease-color">&#xe676;</i>
                        <span>{{Math.abs(item.new_moments - item.prev_new_moments)}}</span>
                        <span>)</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import ProBtn from "@/components/shared/component/card/probtn.vue";

const showfalse = {
    show: false
};
const showtrue = {
    show: true
};

export default {
    name: "SharePieChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return "sharePieChart";
            }
        },
        isPro: {
            type: null,
            default: function() {
                return 0;
            }
        },
        currentUserPro: {
            type: null,
            default: function() {
                return 0;
            }
        },
        showList: {
            type: Boolean,
            default: function() {
                return true;
            }
        },
        showTendency: {
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
        other: {
            type: Array,
            default: function() {
                return [];
            }
        },
        actionType: {
            type: String,
            default: function() {
                return 'daily';
            }
        },
        actionTypeKey: {
            type: String,
            default: function() {
                return '日';
            }
        },
        presentMonth: {
            type: Number,
            default: function() {
                return 1;
            }
        },
        chartWidth: {
            type: String,
            default: "3.47rem"
        },
        chartHeight: {
            type: String,
            default: "3.665rem"
        }
    },
    data() {
        return {
            share_data_title: this.simply ? 'APP分享数据统计' : 'APP分享數據統計',
            browse_num_title: this.simply ? '浏览数' : '瀏覽數',
            new_circle_unit: this.simply ? '个' : '個',
            chart: null,
            option: {},
            shareStatLists: [],
            showSpan: '',
            innerColors: ['#FFC200', '#F7913E', '#FF5959', '#8378EA', '#11D2E3'],
            outerColors: ['#FFD349', '#FFC200', '#FFA65D', '#F7913E', '#FF7070', '#FF5959', '#9488FF', '#8378EA', '#11D2E3', '#0FBECE'],
            innerData: [],
            outerData: [],
            startClick: true
        };
    },
    components: {
        ProBtn
    },
    watch: {
        data: {
            handler: function(value, oldvalue) {
                if (this.isPro) {
                    this.chart && this.chart['dispose'] && this.chart.dispose();
                    this.setChart(value);
                    this.bindClick();
                }
            }
        },
    },
    created() {},
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
            if (this.isPro) {
                this.asyncData(data);
                this.chart = echarts.init(document.getElementById(this.refId));
                // 绘制图表
                this.option = {
                    title: {
                        text: this.share_data_title + " (" + (this.actionType === 'week' ? (this.simply ? '周' : '週') : this.actionTypeKey)  + "新增)",
                        left: "center",
                        top: 32.5
                    },
                    series: [{
                            name: "分享類型",
                            type: "pie",
                            startAngle: 0,
                            selectedMode: "single",
                            // hoverAnimation: false,
                            center: ["50%", "60%"],
                            radius: [0, window.screen.height === 568 ? "25%" : "29%"],
                            avoidLabelOverlap: false,
                            startAngle: 90,
                            label: {
                                show: false,
                                position: "inner",
                                fontSize: 10,
                                align: 'center'
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: this.innerData
                        },
                        {
                            name: "分享數",
                            type: "pie",
                            minAngle: 1,
                            hoverAnimation: false,
                            avoidLabelOverlap: false,
                            startAngle: 90,
                            center: ["50%", "60%"],
                            radius: window.screen.height === 568 ? ["32%", "43%"] : ["37%", "49%"],
                            labelLine: {
                                length: 8,
                                length2: 18,
                            },
                            label: {
                                align: 'center',
                                color: "#2A2A2A",
                                fontSize: 10,
                                lineHeight: 12,
                                borderRadius: 4,
                                // formatter: "{per|{d}%}\n{b|{b}}",
                                formatter: function(param) {
                                    return ((param.data.value / param.data.total) * 100).toFixed(1) + '%' + '\n' + param.name;
                                },
                                rich: {
                                    b: {
                                        color: "#2A2A2A",
                                        fontSize: 10,
                                        lineHeight: 10
                                    },
                                    per: {
                                        color: "#2A2A2A",
                                        fontSize: 14,
                                        lineHeight: 14,
                                        align: 'center'
                                    }
                                }
                            },
                            data: this.outerData
                        }
                    ]
                };
                this.chart.setOption(this.option);
                this.bindClick();
            }
        },
        bindClick() {
            const _this = this;
            this.chart.on('click', function(params) {
                if (_this.startClick) {
                    _this.startClick = false;
                    _this.outerData.forEach((item, index) => {
                        if (params.data.cate === item.cate) {
                            item.label = item.emphasis.label = {
                                show: true
                            };
                            item.labelLine = item.emphasis.labelLine = {
                                show: true,
                                length: (item['name'] === '新好友') ? 30 : 8,
                                length2: (item['name'] === '新好友') ? 4 : 18,
                            };
                        } else {
                            item.label = item.emphasis.label = {
                                show: false
                            };
                            item.labelLine = item.emphasis.labelLine = {
                                show: false,
                                length: (item['name'] === '新好友') ? 30 : 8,
                                length2: (item['name'] === '新好友') ? 4 : 18,
                            };
                        }
                    });
                    _this.innerData.forEach((item, index) => {
                        if (params.data.cate === item.cate) {
                            item.selected = true;
                        } else {
                            item.selected = false;
                        }
                    });
                    _this.chart.setOption(_this.option);
                    _this.startClick = true;
                }
            });
        },
        asyncData(value) {
            this.innerData = [];
            this.outerData = [];
            this.shareStatLists = value;
            // this.shareStatLists = [{
            //         "name": "资讯1",
            //         "type": "4",
            //         "browse": 8,
            //         "prev_browse": 8,
            //         "new_browse": 1,
            //         "new_moments": 0,
            //         "prev_new_moments": 0,
            //         "old_browse": 7,
            //     },
            //     {
            //         "name": "资讯",
            //         "type": "1",
            //         "browse": 7,
            //         "prev_browse": 7,
            //         "new_browse": 2,
            //         "new_moments": 0,
            //         "prev_new_moments": 0,
            //         "old_browse": 5,
            //     },
            //     {
            //         "name": "个人主页",
            //         "type": "8",
            //         "browse": 6,
            //         "prev_browse": 4,
            //         "new_browse": 3,
            //         "new_moments": 0,
            //         "prev_new_moments": 0,
            //         "old_browse": 3,
            //     },
            //     {
            //         "name": "保险产品",
            //         "type": "2",
            //         "browse": 3,
            //         "prev_browse": 9,
            //         "new_browse": 1,
            //         "new_moments": 0,
            //         "prev_new_moments": 0,
            //         "old_browse": 2,
            //     },
            //     {
            //         "name": "其他",
            //         "type": "5",
            //         "browse": 2,
            //         "prev_browse": 19,
            //         "new_browse": 1,
            //         "new_moments": 0,
            //         "prev_new_moments": 0,
            //         "old_browse": 1,
            //     }
            // ];
            this.shareStatLists.forEach((item, index) => {
                let innerObj = {
                    value: item['new_browse'] + item['old_browse'],
                    name: item['name'],
                    cate: item['name'],
                    itemStyle: {
                        color: this.innerColors[index]
                    },
                    selected: ((this.shareStatLists.length !== 1) && (index === 0)) ? true : false
                };
                (this.shareStatLists.length === 1) && (innerObj.label = {
                    padding: [0, 0, 60, 0]
                });
                this.innerData.push(innerObj);
                let outerObj1 = {
                    value: item['old_browse'],
                    name: '已存在好友',
                    cate: item['name'],
                    total: item['browse'],
                    label: {
                        show: index === 0
                    },
                    labelLine: {
                        show: index === 0
                    },
                    emphasis: {
                        label: {
                            show: index === 0
                        },
                        labelLine: {
                            show: index === 0
                        },
                    },
                    itemStyle: {
                        color: this.outerColors[2 * index]
                    },
                };
                this.outerData.push(outerObj1);
                let outerObj2 = JSON.parse(JSON.stringify(outerObj1));
                outerObj2.value = item['new_browse'];
                outerObj2.name = '新好友';
                outerObj2.labelLine.length = 30;
                outerObj2.labelLine.length2 = 4;
                outerObj2.itemStyle.color = this.outerColors[2 * index + 1];
                this.outerData.push(outerObj2);
            });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chart {
    width: 100%;
    height: auto;
    background-color: #fff;
    border-radius: 0.2rem;
    border-bottom: 0.02rem solid transparent;
}

.chart-title {
    width: 100%;
    font-size: 0.18rem;
    color: #2a2a2a;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.22rem;
    font-weight: bold;
    padding-top: .33rem;
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

.tendency-icon {
    font-size: 0.1rem;
    display: inline-block;
}

.tendency-icon.increase {
    transform: rotate(90deg);
}

.tendency-icon.decrease {
    transform: rotate(-90deg);
}

.flat-icon {
    font-size: 0.2rem;
    font-weight: bold;
    line-height: 0.1rem;
}

.list-box {
    width: 100%;
    padding: 0 0.12rem .1rem 0.12rem;
}

.list-row {
    margin-bottom: .24rem;
}

.list-row-title {
    widows: 100%;
    font-size: 0.16rem;
    color: #2a2a2a;
    line-height: 0.2rem;
    font-weight: 700;
}

.list-row-title span {
    display: inline-block;
    vertical-align: middle;
}

.list-row-title .other {
    display: inline-block;
    font-size: .13rem;
    color: #aaa;
    font-weight: normal;
}

.list-row-title .other-string {
    display: inline-block;
    max-width: 2.3rem;
}

.status-circle {
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 50%;
    display: inline-block;
}

.list-row-block {
    position: relative;
    float: left;
    width: calc(50% - 0.06rem);
    line-height: 0.14rem;
    background: #f6f6f6;
    border-radius: 0.04rem;
    font-size: 0.14rem;
    color: #2a2a2a;
    margin: .1rem .12rem 0 0;
    padding: .12rem;
    text-align: right;
}

.list-row-block .left {
    position: absolute;
    left: .12rem;
}

.tendency-box {
    font-size: .12rem;
    color: #999999;
    text-align: left;
    line-height: .15rem;
    margin-top: .1rem;
}

.tendency-box span {
    display: inline-block;
    margin-left: -0.04rem;
    vertical-align: middle;
}

.tendency-type {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.2rem;
    width: 0.16rem;
    margin-left: -0.1rem;
}

.tendency-type-flat {
    margin-left: -.58rem;
    width: 0.68rem;
}

.nodata-content {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
}

.nodata-box {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.nodata-box img {
    width: 1.02rem;
}

.nodata-box span {
    margin-top: .16rem;
    font-size: .13rem;
    color: #B6B6B6;
    letter-spacing: 0;
    line-height: .16rem;
}
</style>
