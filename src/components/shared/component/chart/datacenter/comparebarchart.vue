<template>
    <div v-show="data.length > 0" :id="refId" class="compare-card">
        <div class="chart-title">{{title}}</div>
        <div class="compare-card-bottom">
            <ul class="compare-bar">
                <li v-for="(item, index) in data" :key="index" :style="{'width': (item.count / item.total) * 100 + '%', 'min-width': item.count > 0 ? '.06rem' : '0',  'max-width': item.count < item.total ? 'calc(100% - .06rem)' : '100%'}" @click="goFriend(item.index)">
                    <div class="compare-bar-block" :class="{'left': index === 0, 'right': index === 1}" :style="{'background-color': item.color}"></div>
                </li>
            </ul>
            <ul class="compare-bottom">
                <li class="compare-bottom-block" v-for="(item, index) in data" :key="index" @click="goFriend(item.index)">
                    <div class="compare-bar-text" :style="{'text-align': index === 0 ? 'left' : 'right', 'left': index === 0 ? 0 : 'auto'}">
                        <span v-if="index === 1">({{((item.count / item.total) * 100).toFixed(1)}}%)</span>
                        <span>{{item.title}}</span>
                        <span v-if="index === 0">({{((item.count / item.total) * 100).toFixed(1)}}%)</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import selectInfo from '@/components/shared/component/chart/datacenter/selectinfo.js';

export default {
    name: "DataCenterCompareBarChart",
    props: {
        refId: {
            type: String,
            default: function() {
                return 'dataCenterCompareBarChart';
            }
        },
        data: {
            type: Array,
            default: function() {
                // { title: '男性好友', count: 12, total: 20, color: '#fff' }
                return [];
            }
        },
        title: {
            type: String,
            default: function() {
                return '';
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
            selectInfo: JSON.parse(JSON.stringify(selectInfo))
        };
    },
    components: {},
    watch: {
        data: {
            handler: function(value, oldvalue) {}
        }
    },
    mounted() {},
    methods: {
        goFriend(index) {
            if (this.clickAble && (index !== undefined && (index !== ''))) {
                this.selectInfo[this.selectType] = (index !== "" ? index : "-1");
                this.appFn.goFriend(this.selectInfo);
            }
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.compare-card {
    width: 100%;
    height: 1.6rem;
    background-color: #fff;
    border-radius: .08rem;
    margin-bottom: .12rem;
    box-shadow: 0 4px 16px 8px rgba(51, 100, 228, 0.04);
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

.compare-card-bottom {
    width: 100%;
    height: 1.1rem;
    padding: .32rem .24rem;
}

.compare-bar {
    width: 100%;
    height: .18rem;
    overflow: hidden;
    border-radius: .09rem;
    cursor: pointer;
}

.compare-bar li {
    float: left;
    height: .46rem;
}

.compare-bar-block {
    width: 100%;
    height: .18rem;
}

.compare-bar-block.left {
    border-radius: .09rem 0 0 .09rem;
}

.compare-bar-block.right {
    border-radius: 0 .09rem .09rem 0;
}

.compare-bar-text {
    font-size: .13rem;
    color: #2A2A2A;
    line-height: .16rem;
}

.compare-bottom {
    height: .16rem;
    width: 100%;
    margin-top: .12rem;
    cursor: pointer;
}

.compare-bottom-block {
    width: 50%;
    float: left;
}
</style>
