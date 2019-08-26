<template>
    <div id="friendData">
        <div class="friends-data-inner com-scroll-y" v-if="loadedScript && isLoaded">
            <value-friend-pie-chart :data="friendData.worth"></value-friend-pie-chart>
            <data-center-horizontal-bar-chart :title="'好友性别'" :data="friendData.gender" :select-type="'selectSex'"></data-center-horizontal-bar-chart>
            <data-center-from-circle-chart :title="this.simply ? '好友来源' : '好友來源'" :data="friendData.from_type" :select-type="'selectCome'"></data-center-from-circle-chart>
            <data-center-oval-chart :title="this.simply ? '年龄阶段' : '年齡階段'" :data="friendData.age" :select-type="'selectAge'"></data-center-oval-chart>
            <data-center-vertical-bar-chart :title="this.simply ? '家庭成员' : '家庭成員'" :data="friendData.family" :select-type="'selectFamilyList'"></data-center-vertical-bar-chart>
            <data-center-horizontal-bar-chart :title="this.simply ? '个人月收入（HK$）' : '個人月收入（HK$）'" :data="friendData.salary" :select-type="'selectIncome'"></data-center-horizontal-bar-chart>
            <data-center-china-map-chart ref="dataCenterChinaMapChart" :title="this.simply ? '好友地区分布' : '好友地區分佈'" :data="friendData.location" :select-type="'selectAddress'"></data-center-china-map-chart>
            <data-center-horizontal-bar-chart :title="this.simply ? '行业占比' : '行業佔比'" :data="friendData.industry" :select-type="'selectProfession'"></data-center-horizontal-bar-chart>
            <data-center-vertical-bar-chart :title="simply ? '业务状态' : '業務狀態'" :data="friendData.business_status" :select-type="'selectJobStateList'"></data-center-vertical-bar-chart>
            <data-center-compare-bar-chart :title="simply ? '行动计划' : '行動計畫'" :data="friendData.todo" :select-type="'selectFellow'"></data-center-compare-bar-chart>
            <data-center-compare-bar-chart :title="simply ? '互动情况' : '互動情況'" :data="friendData.interaction" :select-type="'selectInteraction'"></data-center-compare-bar-chart>
            <data-center-compare-bar-chart :title="simply ? '转发来源' : '轉發來源'" :data="friendData.source_type" :select-type="'selectSource'"></data-center-compare-bar-chart>
        </div>
    </div>
</template>

<script>
// 是否显示当前可是范围插件
const emergence = require("emergence.js");

import CommonJS from '@/components/shared/service/common.js';

import ValueFriendPieChart from "@/components/shared/component/chart/datacenter/valuefriendpiechart.vue";
import DataCenterCompareBarChart from "@/components/shared/component/chart/datacenter/comparebarchart.vue";
import DataCenterFromCircleChart from "@/components/shared/component/chart/datacenter/fromcirclechart.vue";
import DataCenterOvalChart from "@/components/shared/component/chart/datacenter/ovalchart.vue";
import DataCenterVerticalBarChart from "@/components/shared/component/chart/datacenter/verticalbarchart.vue";
import DataCenterFlowerPieChart from "@/components/shared/component/chart/datacenter/flowerpiechart.vue";
import DataCenterChinaMapChart from "@/components/shared/component/chart/datacenter/chinamapchart.vue";
import DataCenterHorizontalBarChart from "@/components/shared/component/chart/datacenter/horizontalbarchart.vue";

export default {
    name: 'DataCenterFriendsData',
    data() {
        return {
            loadedScript: false,
            isLoaded: false,
            friendData: {}
        }
    },
    components: {
        ValueFriendPieChart,
        DataCenterFromCircleChart,
        DataCenterOvalChart,
        DataCenterCompareBarChart,
        DataCenterVerticalBarChart,
        DataCenterFlowerPieChart,
        DataCenterChinaMapChart,
        DataCenterHorizontalBarChart
    },
    created() {
        this.$root.blueLoadingParams.show = true;
        const _this = this;
        // 异步加载echarts.min.js
        CommonJS.loadScript('https://static.iberhk.com/res/js/echarts.min.js', () => {
            _this.loadedScript = true;
        });
    },
    mounted() {
        this.getFriendData();
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
        getFriendData() {
            this.$http.get('/data-center/friend-data').then(res => {
                if (res && res.code === 0) {
                    this.friendData = res.data;
                    // this.friendData.worth = [{
                    //   title: '重点价值好友',
                    //   count: 75,
                    //   total: 100
                    // }, {
                    //   title: '非重点价值好友',
                    //   count: 25,
                    //   total: 100
                    // }];
                    // this.friendData.gender = [{
                    //   title: '男性好友',
                    //   count: 25,
                    //   total: 100
                    // }, {
                    //   title: '女性好友',
                    //   count: 75,
                    //   total: 100
                    // }];
                    // this.friendData.from_type = [{
                    //   title: 'WeChat',
                    //   count: 70,
                    //   total: 100
                    // }, {
                    //   title: '手动导入',
                    //   count: 16,
                    //   total: 100
                    // }, {
                    //   title: 'FaceBook',
                    //   count: 7,
                    //   total: 100
                    // }, {
                    //   title: '其他',
                    //   count: 0.1,
                    //   total: 100,
                    // }];
                    // this.friendData.age = [{
                    //     title: '30以下',
                    //     count: 30,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '31-40',
                    //     count: 10,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '41-50',
                    //     count: 20,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '51-60',
                    //     count: 50,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '61-65',
                    //     count: 80,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '65以上',
                    //     count: 100,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '65以上',
                    //     count: 0.1,
                    //     total: 100
                    //   }
                    // ];
                    // this.friendData.family = [{
                    //     title: '有配偶',
                    //     count: 30,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '有长者',
                    //     count: 10,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '有子女',
                    //     count: 20,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '有宠物',
                    //     count: 50,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '有宠物',
                    //     count: 50,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '有宠物',
                    //     count: 50,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '有宠物',
                    //     count: 0.1,
                    //     total: 100
                    //   }
                    // ];
                    // this.friendData.industry = [{
                    //     title: '互聯網',
                    //     count: 0.1,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '金融業',
                    //     count: 10,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '教育業',
                    //     count: 20,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '其他',
                    //     count: 50,
                    //     total: 100
                    //   }
                    // ];
                    // this.friendData.salary = [{
                    //     title: '少於HK$15,000',
                    //     count: 10,
                    //     total: 100
                    // }, {
                    //     title: 'HK$15,001-20,000',
                    //     count: 20,
                    //     total: 100
                    // }, {
                    //     title: 'HK$20,001-30,000',
                    //     count: 30,
                    //     total: 100
                    // }, {
                    //     title: 'HK$30,001-40,000',
                    //     count: 20,
                    //     total: 100
                    // }, {
                    //     title: 'HK$40,001以上',
                    //     count: 20,
                    //     total: 100
                    // }];
                    // this.friendData.location = [{
                    //     title: '广东省',
                    //     count: 10,
                    //     total: 100
                    // }, {
                    //     title: '香港特别行政区',
                    //     count: 20,
                    //     total: 100
                    // }];
                    // this.friendData.business_status = [{
                    //     title: '有咨询',
                    //     count: 20,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '有评测',
                    //     count: 30,
                    //     total: 100
                    //   },
                    //   {
                    //     title: '医疗预约',
                    //     count: 50,
                    //     total: 100
                    //   }
                    // ];
                    // this.friendData.todo = [{
                    //   title: '有',
                    //   count: 46,
                    //   total: 100
                    // }, {
                    //   title: '無',
                    //   count: 54,
                    //   total: 100
                    // }];
                    // this.friendData.interaction = [{
                    //   title: '有',
                    //   count: 1198,
                    //   total: 1200
                    // }, {
                    //   title: '無',
                    //   count: 2,
                    //   total: 1200
                    // }];
                    // this.friendData.source_type = [{
                    //   title: '有',
                    //   count: 20,
                    //   total: 100
                    // }, {
                    //   title: '無',
                    //   count: 80,
                    //   total: 100
                    // }];
                    this.friendData.gender.length === 2 && (this.friendData.gender[0]['color'] = '#2187F8');
                    this.friendData.gender.length === 2 && (this.friendData.gender[1]['color'] = '#FF49A6');
                    this.friendData.todo.length === 2 && (this.friendData.todo[0]['color'] = '#2187F8');
                    this.friendData.todo.length === 2 && (this.friendData.todo[1]['color'] = '#AFCEFF');
                    this.friendData.interaction.length === 2 && (this.friendData.interaction[0]['color'] = '#47C853');
                    this.friendData.interaction.length === 2 && (this.friendData.interaction[1]['color'] = '#9DE5A4');
                    this.friendData.source_type.length === 2 && (this.friendData.source_type[0]['color'] = '#FFBA01');
                    this.friendData.source_type.length === 2 && (this.friendData.source_type[1]['color'] = '#FFD76D');
                }
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
                this.reappearAnimate();
            }, err => {
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
                window.location.href = window.baseUrl + '/error/404';
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.friends-data-inner {
    width: 100%;
    min-height: 100%;
    background-color: #F6F6F6;
    padding: .12rem .12rem 0 .12rem;
}
</style>
