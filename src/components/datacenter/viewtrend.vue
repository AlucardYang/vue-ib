<template>
    <div id="viewTrend">
        <div v-if="loadedScript && isLoaded" class="view-trend-inner com-scroll-y">
            <ul class="date-select-box">
                <li v-for="(item, index) in dateArr" :key="index" :class="{'current': dateDefault === item}" @click="updateDate(item)">{{item}}</li>
            </ul>
            <div class="top-blue-bg"></div>
            <data-center-line-chart :type="selectType" :tabs="tabs" :unit="'次'" :title="simply ? '浏览增长趋势' : '瀏覽增長趨勢'" :y-data1="viewData.view_trend" :show-total="trendTotal"></data-center-line-chart>
            <data-center-flower-pie-chart :title="this.simply ? '浏览内容类型' : '瀏覽內容類型'" :data="viewData.view_target" :show-num="true" :other-legend="viewData.view_target_others"></data-center-flower-pie-chart>
        </div>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';

import DataCenterLineChart from "@/components/shared/component/chart/datacenter/linechart.vue";
import DataCenterFlowerPieChart from "@/components/shared/component/chart/datacenter/flowerpiechart.vue";

export default {
    name: 'DataCenterViewTrend',
    data() {
        return {
            selectType: '30d',
            loadedScript: false,
            isLoaded: false,
            tabs: [{
                title: '',
                type: 1
            }],
            viewData: {},
            dateArr: ['最近30日', this.simply ? '最近12个月' : '最近12個月'],
            dateDefault: '最近30日',
            trendTotal: {}
        }
    },
    components: {
        DataCenterFlowerPieChart,
        DataCenterLineChart,
    },
    created() {
        const _this = this;
        // 异步加载echarts.min.js
        CommonJS.loadScript('https://static.iberhk.com/res/js/echarts.min.js', () => {
            _this.loadedScript = true;
        });
    },
    mounted() {
        this.getViewTrend();
    },
    methods: {
        getViewTrend() {
            this.$root.blueLoadingParams.show = true;
            this.$http.get('/data-center/view-trend', {
                type: this.selectType
            }).then(res => {
                if (res && res.code === 0) {
                    this.viewData = res.data;
                    this.trendTotal = {
                        show: true,
                        title: this.simply ? '历史浏览总数：' : '歷史瀏覽總數：',
                        num: this.viewData.view_count
                    };
                }
                this.isLoaded = true;
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
                this.getViewTrend();
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.view-trend-inner {
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
