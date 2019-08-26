<template>
    <div class="com-scroll-y action-content" :style="{'opacity': (isLoaded && loadedScript) ? 1 : 0}">
        <div class="white-background">
            <div class="top-card">
                <div v-if="agentInfo.avatar" class="head-image-avatar" :style="{'background-image': 'url(' + agentInfo.avatar + ')'}"></div>
                <i v-if="!agentInfo.avatar" class="iconfont head-image-avatar">&#xe685;</i>
                <div class="right">
                    <div class="name com-nowrap" :style="{'line-height': selectDate ? '.28rem' : '.56rem', 'height': selectDate ? '.28rem' : '.56rem'}">{{agentInfo.name}}</div>
                    <div v-show="selectDate" class="date" @click="appFn.commonFn('dayPicker')">
                        <span>{{date.value}}&nbsp;{{date.weekValue}}</span>
                        <span class="iconfont arrow-down">&#xe774;</span>
                    </div>
                </div>
                <div class="border-bottom-dashed"></div>
            </div>
            <div class="bottom-content" v-show="!isEmpty">
                <div class="total-card">
                    <div class="total-card-title">{{total_title}}</div>
                    <div class="num-box">
                        <div class="num-box-block">
                            <span class="top">{{actionData.done_num}}</span>
                            <span class="bottom">已完成</span>
                        </div>
                        <div class="center-line"></div>
                        <div class="num-box-block right">
                            <span class="top">{{actionData.undo_num}}</span>
                            <span class="bottom">未完成</span>
                        </div>
                    </div>
                    <div class="total-card-bottom">
                        <div class="total-card-bottom-center">
                            <span>{{to_this_week}} {{actionData.week_done_num}}</span>
                            <span style="margin-top: .12rem;">{{to_this_month}} {{actionData.month_done_num}}</span>
                        </div>
                    </div>
                    <div class="border-bottom-dashed"></div>
                </div>
                <action-pie-chart v-if="loadedScript" ref="actionPieChart" :show-list="false" :data="actionData.cate"></action-pie-chart>
                <share-pie-chart v-if="loadedScript" ref="sharePieChart" :actionType="'daily'" :actionTypeKey="'日'" :data="actionData.share_stat" :other="actionData.other" :is-pro="isPro" :current-user-pro="actionData.is_pro"></share-pie-chart>
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

import ActionPieChart from "@/components/shared/component/chart/action/actionpiechart.vue";
import SharePieChart from "@/components/shared/component/chart/action/sharepiechart.vue";
import SuggestCard from "@/components/report/action/suggestcard.vue";
import EmptyPage from "@/components/report/action/empty.vue";

export default {
    name: "ActionDaily",
    data() {
        return {
            total_title: this.simply ? '行动完成情况' : '行動完成情況',
            to_this_week: this.simply ? '截止本周行动量' : '截止本週行動量',
            to_this_month: this.simply ? '截止本月行动量' : '截止本月行動量',
            no_more: this.simply ? '没有更多内容了' : '沒有更多內容了',
            currentUserUuid: this.$route.query['current_user_uuid'] ? this.$route.query['current_user_uuid'] : '42b9fb9f0f5cae580388c75bc8821bdb',
            selectDate: (this.$route.query['select_date'] === '1') ? true : false,
            getDate: this.$route.query['date'],
            date: {
                showDatePick: false,
                value: '',
                weekValue: ''
            },
            actionCase: 1,
            agentInfo: {},
            actionData: {},
            isEmpty: true,
            isLoaded: false,
            loadedScript: false,
            isPro: 0
        };
    },
    components: {
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
            if (this.date.value) {
                const params = {
                    case: this.actionCase,
                    time: this.date.value,
                    language: this.lang
                };
                (this.userUuid !== this.currentUserUuid) && (params.share_uuid = this.currentUserUuid);
                this.$http.post('/todo-report/personal', params).then(res => {
                    this.isPro = (res.extra && res.extra.is_pro);
                    if (res && res.code === 0) {
                        this.actionData = res.data;
                        if (this.actionData.done_num == 0 && (this.actionData.undo_num == 0) && (this.actionData.week_done_num == 0) && (this.actionData.month_done_num == 0) && (this.actionData.cate.length == 0) && (this.actionData.share_stat.length == 0)) {
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
            const weekObj = {
                Mon: '星期一',
                Tue: '星期二',
                Wed: '星期三',
                Thu: '星期四',
                Fri: '星期五',
                Sat: '星期六',
                Sun: '星期日'
            }
            if (this.getDate) {
                this.date.value = this.getDate.slice(0, 10);
                this.date.weekValue = weekObj[this.getDate.slice(10)];
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
    height: .28rem;
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

.total-card {
    width: 100%;
    height: 3rem;
    border-bottom: 0.02rem solid transparent;
    z-index: 1;
    padding: 0.325rem 0.12rem 0 0.12rem;
    border-radius: 0.1rem;
}

.total-card:before,
.total-card:after {
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

.total-card:after {
    left: auto;
    right: -0.1rem;
}

.total-card-title {
    width: 100%;
    font-size: 0.18rem;
    color: #2a2a2a;
    letter-spacing: 0;
    text-align: center;
    line-height: 0.22rem;
    font-weight: bold;
}

.num-box {
    width: 100%;
    height: 0.65rem;
    position: relative;
    margin-top: 0.48rem;
    text-align: center;
}

.num-box-block {
    width: 50%;
    position: absolute;
    top: 0;
    left: 0;
}

.num-box-block.right {
    left: 50%;
}

.num-box-block .top,
.num-box-block .bottom {
    display: block;
    width: 100%;
    font-size: 0.4rem;
    color: #2a2a2a;
    line-height: 0.48rem;
    font-weight: bold;
}

.num-box-block .bottom {
    font-size: 0.14rem;
    color: #999999;
    line-height: 0.17rem;
    font-weight: normal;
}

.num-box-block.right .top {
    color: #cccccc;
}

.center-line {
    display: inline-block;
    width: 0;
    border-right: 0.01rem solid #dddddd;
    height: 0.5rem;
    margin-top: 0.1rem;
}

.total-card-bottom {
    width: 100%;
    height: 1.08rem;
    font-size: 0.16rem;
    color: #2a2a2a;
    line-height: 0.2rem;
    text-align: center;
    border-top: 0.01rem solid #dddddd;
    margin-top: 0.24rem;
    padding: 0.24rem 0;
    position: relative;
}

.total-card-bottom-center {
    display: inline-block;
    width: auto;
    text-align: left;
}

.total-card-bottom span {
    display: block;
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