<template>
    <div v-if="data.length > 0" class="suggest-card">
        <div class="border-bottom-dashed"></div>
        <img class="robot-img" src="https://static.iberhk.com/v2/web/images/common/robot1.png">
        <div class="suggest-card-title">TiMi教你提升引流效率</div>
        <div class="suggest-card-desc">{{simply ? '共享报告时这部分是隐藏的噢' : '共享報告時這部分是隱藏的噢'}}</div>
        <div class="suggest-list">
            <div class="suggest-list-row" v-for="(item, index) in data" :key="index">
                <div class="left">{{item.content}}</div>
                <button class="right" @click="goAppPage(item)">{{item.button}}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SuggestCard",
    props: {
        data: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data() {
        return {};
    },
    components: {},
    mounted() {},
    methods: {
        goAppPage(item) {
            let pageParam = JSON.parse(JSON.stringify(item));
            delete pageParam.button;
            delete pageParam.content;
            this.appFn.goPage(pageParam);
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.suggest-card {
    width: 100%;
    min-height: 1rem;
    background-color: #fff;
    border-radius: 0.08rem;
    position: relative;
    padding: 0.2rem 0.1rem 0 0.1rem;
    text-align: center;
}

.suggest-card:before,
.suggest-card:after {
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

.suggest-card:after {
    left: auto;
    right: -0.1rem;
}

.robot-img {
    width: 1.1rem;
    position: absolute;
    left: calc(50% - .55rem);
    top: .37rem;
}

.suggest-card-title {
    font-size: 0.18rem;
    color: #2a2a2a;
    text-align: center;
    line-height: 0.22rem;
    margin-top: 1rem;
    font-weight: bold;
}

.suggest-card-desc {
    font-size: 0.13rem;
    color: #999999;
    text-align: center;
    line-height: 0.16rem;
    margin-top: 0.04rem;
}

.suggest-list {
    width: 100%;
    margin-top: 0.3rem;
}

.suggest-list-row {
    position: relative;
    padding: 0.1rem 0;
    border-bottom: 0.01rem solid #eee;
    height: 0.7rem;
}

.suggest-list-row .left {
    width: calc(100% - .76rem);
    font-size: 0.14rem;
    line-height: 0.19rem;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    text-align: left;
    letter-spacing: 0;
    color: #2a2a2a;
}

.suggest-list-row .right {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0.66rem;
    height: 0.28rem;
    background-color: #3852ee;
    border: none;
    border-radius: 0.08rem;
    line-height: 0.16rem;
    background: #3464e6;
    border-radius: 28px;
    font-size: 0.13rem;
    color: #ffffff;
}

.border-bottom-dashed {
    top: 0;
}
</style>