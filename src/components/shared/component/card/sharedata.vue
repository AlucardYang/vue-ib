<template>
    <div v-if="inApp && analyze.view" class="total-statistics-box">
        <ul class="total-statistics">
            <li class="total-statistics-block pull-left" @click="goDynamic('view_link')" style="cursor: pointer;">
                <div class="total-statistics-top">
                    <span class="num com-nowrap">{{analyze.view}}</span>
                    <span class="unit">人</span>
                </div>
                <div class="total-statistics-bottom">{{simply ? '浏览人数' : '瀏覽人數'}}</div>
            </li>
            <li class="total-statistics-block pull-left" @click="goDynamic('share_link')" style="cursor: pointer;">
                <div class="total-statistics-top">
                    <span class="num com-nowrap">{{analyze.share}}</span>
                    <span class="unit">次</span>
                </div>
                <div class="total-statistics-bottom">{{simply ? '客户转发数' : '客戶轉發數'}}</div>
            </li>
            <li class="total-statistics-block pull-left">
                <div class="total-statistics-top" style="color: #2A2A2A;">
                    <span class="num com-nowrap">{{analyze.view_time}}</span>
                    <span class="unit">{{simply ? '分钟' : '分鐘'}}</span>
                </div>
                <div class="total-statistics-bottom">{{simply ? '平均阅读时长' : '平均閱讀時長'}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "ShareData",
    props: {
        analyze: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        return {};
    },
    components: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
        // 跳转动态
        goDynamic(type) {
            this.appFn.goPage(this.analyze[type]);
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.total-statistics-box {
    padding: .12rem;
    background-color: #F6F6F6;
}

.total-statistics {
    background: #FFFFFF;
    border-radius: .08rem;
    box-sizing: border-box;
    padding: .16rem .04rem;
    height: .86rem;
    text-align: center;
}

.total-statistics-block {
    display: inline-block;
    width: 33.3%;
    text-align: center;
}

.total-statistics-top {
    color: #3364E4;
}

.total-statistics-top .num {
    display: inline-block;
    vertical-align: middle;
    font-size: .2rem;
    line-height: .2rem;
    font-weight: bold;
    max-width: calc(100% - .26rem);
}

.total-statistics-top .unit {
    display: inline-block;
    vertical-align: middle;
    font-size: .12rem;
    line-height: .15rem;
    margin-left: -.04rem;
}

.total-statistics-bottom {
    width: 100%;
    font-size: .13rem;
    color: #666666;
    line-height: .16rem;
    margin-top: .06rem;
}
</style>
