<template>
    <div class="total-card-box">
        <ul class="top-data-box">
            <li class="data-block" v-for="(item, index) in data" :key="index" :style="{'width': data.length === 3 ? '33%' : '50%'}">
                <div class="num" :style="{'padding-right': index === 0 ? '.18rem' : 0}" @click="goFriend(item.value)">{{item.num}}</div>
                <div class="text">
                    <span @click="goFriend(item.value)">{{item.title}}</span>
                    <i v-if="item.tip" class="iconfont tip-icon" @click="showTip = true">&#xe6be;</i>
                    <div :id="'tipBox' + index" v-show="item.tip && showTip" class="tip-box">{{item.tip}}</div>
                </div>
            </li>
        </ul>
        <div v-if="bottomTip" class="bottom-tip">{{bottomTip}}</div>
    </div>
</template>

<script>
import selectInfo from '@/components/shared/component/chart/datacenter/selectinfo.js';

export default {
    name: "DataCenterTotalCard",
    props: {
        data: {
            type: Array,
            default: function() {
                return []; // {title: '', num: '', tip: ''} tip有值会显示提示
            }
        },
        bottomTip: {
            type: String,
            default: function() {
                return '';
            }
        },
    },
    data() {
        return {
            showTip: false,
            selectInfo: JSON.parse(JSON.stringify(selectInfo)),
        };
    },
    components: {},
    watch: {
        data: {
            handler: function(value, oldvalue) {}
        }
    },
    mounted() {
        this.hideTipFn();
    },
    methods: {
        hideTipFn() {
            const _this = this;
            document.querySelector('.com-scroll-y').onclick = function(event) {
                if ((event.target.className.indexOf('tip-icon') === -1) && (event.target.className.indexOf('tip-box') === -1)) {
                    _this.showTip = false;
                }
            };
        },
        goFriend(value) {
            if ((value !== undefined) && (value !== '')) {
                this.selectInfo['selectWorth'] = value;
                this.appFn.goFriend(this.selectInfo);
            }
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.total-card-box {
    width: 100%;
    min-height: .81rem;
    background-color: #fff;
    border-radius: .08rem;
    padding: .16rem 0 .1rem 0;
    margin-bottom: .12rem;
    background: #FFFFFF;
    box-shadow: 0 8px 16px 0 rgba(51, 100, 228, 0.08);
}

.top-data-box {
    width: 100%;
    height: .54rem;
    text-align: center;
}

.data-block {
    float: left;
    width: 33%;
    height: .54rem;
}

.data-block .num {
    font-weight: bold;
    font-size: .24rem;
    color: #3364e4;
    text-align: center;
    line-height: .29rem;
    cursor: pointer;
}

.data-block .text {
    font-size: .13rem;
    color: #666666;
    text-align: center;
    line-height: .16rem;
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
    top: .3rem;
    left: 44%;
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
    left: 21%;
    content: '';
    border: .1rem solid transparent;
    border-left-width: .07rem;
    border-right-width: .07rem;
    border-bottom: .1rem solid rgba(100, 106, 121, .9);
    z-index: 2;
}

.bottom-tip {
    width: 100%;
    font-size: .12rem;
    color: #CCCCCC;
    text-align: right;
    line-height: .15rem;
    margin-top: .13rem;
    padding: 0 .16rem;
}
</style>
