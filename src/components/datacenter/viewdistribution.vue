<template>
    <div id="viewDistribution">
        <div v-if="loadedScript && isLoaded" class="view-distribution-inner com-scroll-y">
            <ul class="date-select-box">
                <li v-for="(item, index) in dateArr" :key="index" :class="{'current': dateDefault === item}" @click="updateDate(item)">{{item}}</li>
            </ul>
            <div class="top-blue-bg"></div>
            <data-center-flower-pie-chart :title="this.simply ? '浏览来源' : '瀏覽來源'" :data="viewData.view_source" :show-num="true"></data-center-flower-pie-chart>
            <data-center-line-chart ref="dataCenterLineChart" :type="selectType" :type-num="3" :is-hour="true" :unit="'次'" :best-time="viewData.view_top_time" :title="simply ? '浏览时间段分布' : '瀏覽時間段分佈'" :y-data2="viewData.view_time"></data-center-line-chart>
            <data-center-china-map-chart ref="dataCenterChinaMapChart" :title="this.simply ? '浏览地区分布' : '瀏覽地區分佈'" :data="viewData.view_area" :click-able="false" :title-tip="areaTip"></data-center-china-map-chart>
        </div>
    </div>
</template>

<script>
// 是否显示当前可是范围插件
const emergence = require("emergence.js");

import CommonJS from '@/components/shared/service/common.js';

import DataCenterFlowerPieChart from "@/components/shared/component/chart/datacenter/flowerpiechart.vue";
import DataCenterLineChart from "@/components/shared/component/chart/datacenter/linechart.vue";
import DataCenterChinaMapChart from "@/components/shared/component/chart/datacenter/chinamapchart.vue";

export default {
    name: 'DataCenterViewDistribution',
    data() {
        return {
            selectType: '30d',
            loadedScript: false,
            isLoaded: false,
            viewData: {},
            dateArr: ['最近30日', this.simply ? '最近12个月' : '最近12個月'],
            dateDefault: '最近30日',
            areaTip: this.simply ? '根据浏览者浏览时所在的省份、直辖市、港澳台，读不到的或国外的为其他。' : '根據瀏覽者瀏覽時所在的省份、直轄市、港澳台，讀不到的或國外的為其他。'
        }
    },
    components: {
        DataCenterFlowerPieChart,
        DataCenterLineChart,
        DataCenterChinaMapChart,
    },
    created() {
        const _this = this;
        // 异步加载echarts.min.js
        CommonJS.loadScript('https://static.iberhk.com/res/js/echarts.min.js', () => {
            _this.loadedScript = true;
        });
    },
    mounted() {
        this.getViewDistribution();
    },
    methods: {
        // Echart复现动画
        reappearAnimate() {
            const _this = this;
            setTimeout(() => {
                emergence.init({
                    container: document.querySelector(".com-scroll-y"), // 滚动或者滑动事件的主体对象
                    callback: function(element, state) {
                        const refs = _this.$refs;
                        const attr = element.getAttribute("data-emergence");
                        if (attr === "visible") {
                            refs[element.id].showAnimate(true);
                        } else if (attr === "hidden") {
                            refs[element.id].showAnimate(false);
                        }
                    }
                });
            });
        },
        getViewDistribution() {
            this.$root.blueLoadingParams.show = true;
            this.$http.get('/data-center/view-distribution', {
                type: this.selectType
            }).then(res => {
                if (res && res.code === 0) {
                    this.viewData = res.data;
                }
                this.isLoaded = true;
                this.reappearAnimate();
                this.$root.blueLoadingParams.show = false;
            }, err => {
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
                window.location.href = window.baseUrl + '/error/404';
            })
        },
        updateDate(event) {
            if (this.dateDefault !== event) {
                this.dateDefault = event;
                this.selectType = ((this.dateDefault === this.dateArr[0]) ? '30d' : '12m');
                this.getViewDistribution();
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.view-distribution-inner {
    width: 100%;
    min-height: 100%;
    background-color: #F6F6F6;
    padding: 0 .12rem 0 .12rem;
}

.top-blue-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: .9rem;
    background-color: #3364E3;
}

.date-select-box {
    width: 100%;
    height: .42rem;
    line-height: .42rem;
    text-align: center;
    font-size: .13rem;
    color: rgba(255, 255, 255, .8);
    z-index: 1;
}

.date-select-box li {
    width: 50%;
    float: left;
    height: .42rem;
    line-height: .42rem;
    cursor: pointer;
}

.date-select-box li.current {
    color: #ffffff;
    font-weight: bold;
}
</style>
