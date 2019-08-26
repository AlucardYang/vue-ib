<template>
    <div class="com-scroll-y action-content" :style="{'opacity': (isLoaded && loadedScript) ? 1 : 0}">
        <div class="white-background">
            <div class="top-card">
                <div v-if="agentInfo.avatar" class="head-image-avatar" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar">&#xe685;</i>
                <div class="right">
                    <div class="name com-nowrap" :style="{'line-height': selectDate ? '.28rem' : '.56rem', 'height': selectDate ? '.28rem' : '.56rem'}">{{agentInfo.name}}</div>
                    <div v-show="selectDate" class="date" @click="appFn.commonFn('weekPicker')">
                        <span>{{date.begin}}至{{date.end}}</span>
                        <span class="iconfont arrow-down">&#xe774;</span>
                    </div>
                </div>
                <div class="border-bottom-dashed"></div>
            </div>
            <div class="bottom-content" v-show="!isEmpty">
                <gear-circle-chart v-if="loadedScript" ref="gearCircleChart" :percentage="actionData.percentage" :prev-done-num="actionData.prev_done_num" :done-num="actionData.done_num"></gear-circle-chart>
                <stack-bar-chart v-if="loadedScript && showContent" ref="stackBarChart" :data="actionData.everyday"></stack-bar-chart>
                <action-pie-chart v-if="loadedScript" ref="actionPieChart" :data="actionData.cate"></action-pie-chart>
                <share-pie-chart v-if="loadedScript" ref="sharePieChart" :actionType="'week'"  :actionTypeKey="'星期'" :showTendency="true" :data="actionData.share_stat" :other="actionData.other" :is-pro="isPro" :current-user-pro="actionData.is_pro"></share-pie-chart>
                <suggest-card v-if="userUuid === currentUserUuid" :data="actionData.suggest"></suggest-card>
            </div>
        </div>
        <div class="bottom-tip" v-if="!isEmpty">{{no_more}}</div>
        <empty-page v-if="isEmpty"></empty-page>
    </div>
</template>

<script>
// 是否显示当前可是范围插件
const emergence = require("emergence.js");

import {
    Toast
} from 'mint-ui';

import CommonJS from '@/components/shared/service/common.js';

import GearCircleChart from "@/components/shared/component/chart/action/gearcirclechart.vue";
import StackBarChart from "@/components/shared/component/chart/action/stackbarchart.vue";
import ActionPieChart from "@/components/shared/component/chart/action/actionpiechart.vue";
import SharePieChart from "@/components/shared/component/chart/action/sharepiechart.vue";
import SuggestCard from "@/components/report/action/suggestcard.vue";
import EmptyPage from "@/components/report/action/empty.vue";

export default {
    name: "ActionWeek",
    data() {
        return {
            no_more: this.simply ? '没有更多内容了' : '沒有更多內容了',
            currentUserUuid: this.$route.query['current_user_uuid'] ? this.$route.query['current_user_uuid'] : '42b9fb9f0f5cae580388c75bc8821bdb',
            selectDate: (this.$route.query['select_date'] === '1') ? true : false,
            getDate: this.$route.query['date'],
            date: {
                showDatePick: false,
                begin: '',
                end: ''
            },
            actionCase: 2,
            agentInfo: {},
            actionData: {},
            isEmpty: true,
            isLoaded: false,
            loadedScript: false,
            showContent: false,
            isPro: 0
        };
    },
    components: {
        GearCircleChart,
        StackBarChart,
        ActionPieChart,
        SharePieChart,
        SuggestCard,
        EmptyPage
    },
    beforeCreate() {
        CommonJS.loadStyle('https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css');
    },
    created() {
        this.$root.blueLoadingParams.show = true;
        const _this = this;
        // 异步加载echarts.min.js
        CommonJS.loadScript('https://static.iberhk.com/res/js/echarts.min.js', () => {
            _this.loadedScript = true;
        });
        this.getAgentInfo();
        this.getActionData();
    },
    mounted() {
        // this.reappearAnimate();
        const _this = this;
        setTimeout(() => {
            _this.showContent = true;
        }, 500);
    },
    methods: {
        // Echart复现动画
        reappearAnimate() {
            const _this = this;
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
        },
        // 获取agent信息
        getAgentInfo() {
            this.$http.post('/user/essential-info', {
                uid: this.currentUserUuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.agentInfo = res.data;
                }
            });
        },
        // 获取行动报告数据
        getActionData() {
            this.transformDate();
            if (this.date.begin) {
                const params = {
                    case: this.actionCase,
                    time: this.date.begin,
                    language: this.lang
                };
                (this.userUuid !== this.currentUserUuid) && (params.share_uuid = this.currentUserUuid);
                this.$http.post('/todo-report/personal', params).then(res => {
                    this.isPro = (res.extra && res.extra.is_pro);
                    if (res && res.code === 0) {
                        this.actionData = res.data;
                        if (this.actionData.percentage == 0 && (this.actionData.prev_done_num == 0) && (this.actionData.done_num == 0) && (this.actionData.everyday.length == 0) && ((this.actionData.cate && (this.actionData.cate.length == 0)) || !this.actionData.cate) && (this.actionData.share_stat.length == 0)) {
                            this.isEmpty = true;
                        } else {
                            this.isEmpty = false;
                        }
                    } else {
                        this.isEmpty = true;
                    }
                    this.isLoaded = true;
                    this.$root.blueLoadingParams.show = false;
                }, err => {
                    this.isLoaded = true;
                    this.$root.blueLoadingParams.show = false;
                });
            } else {
                this.isEmpty = true;
                this.isLoaded = true;
                this.$root.blueLoadingParams.show = false;
            }
        },
        transformDate() {
            if (this.getDate) {
                this.date.begin = this.getDate.slice(0, 10);
                this.date.end = this.getDate.slice(10);
            }
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.action-content {
    background-color: #3364e4;
    padding: 0.085rem 0.12rem 0 0.12rem;
}

.white-background {
    width: 100%;
    height: auto;
    background-color: #fff;
    border-radius: 0.1rem;
}

.blue-circle-radius {
    width: 0.2rem;
    height: 0.2rem;
    background-color: #3364e4;
    border-radius: 50%;
}

.top-card {
    width: 100%;
    height: 1.05rem;
    padding: 0.255rem 0.24rem;
    position: relative;
    border-bottom: 0.02rem solid transparent;
    border-radius: 0.1rem;
}

.head-image-avatar {
    width: 0.54rem;
    height: 0.54rem;
    border-radius: 50%;
    position: absolute;
    left: 0.24rem;
    top: 0.255rem;
    color: #DDDDDD;
    line-height: .54rem;
    font-size: .54rem;
    background-size: 100%;
    background-position: center center;
}

.top-card .right {
    position: absolute;
    left: 0.9rem;
    top: 0.255rem;
    width: calc(100% - 1rem);
}

.top-card .name {
    font-size: 0.17rem;
    color: #2a2a2a;
    line-height: 0.28rem;
    height: .56rem;
}

.top-card .date {
    font-size: 0.15rem;
    color: #3364e4;
    line-height: 0.24rem;
    cursor: pointer;
}

.top-card .date .arrow-up,
.top-card .date .arrow-down {
    display: inline-block;
    transform: rotate(-90deg);
    font-size: 0.1rem;
    vertical-align: text-bottom;
}

.top-card .date .arrow-down {
    transform: rotate(90deg);
    vertical-align: bottom;
}

.bottom-content {
    width: 100%;
}

.bottom-tip {
    opacity: 0.5;
    font-size: 0.14rem;
    color: #ffffff;
    text-align: center;
    line-height: 0.6rem;
    height: 0.6rem;
}
</style>