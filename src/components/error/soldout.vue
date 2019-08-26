<template>
    <div class="error-content">
        <!-- 后退按钮 -->
        <div v-if="inApp && showBack" class="back-icon-box" :style="{'top': '.' + navbar_height + 6 + 'rem'}" @click="goBack()">
            <i ref="backIcon" class="iconfonti back-icon">&#xe7e8;</i>
        </div>
        <div class="error-404">
            <img class="sold-out-img" src="https://static.iberhk.com/ueditor/image/20190731/1564572105932171.png">
            <span class="error-404-text">{{errorTip}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "ErrorNotFound",
    data() {
        return {
            showBack: this.$route.query['show_back'] === '1',
            back_fn: this.$route.query['back_fn'] ? this.$route.query['back_fn'] : 'goBack',
            navbar_height: this.$route.query['navbar_height'] ? parseInt(this.$route.query['navbar_height']) : 0,
            errorTip: this.$route.query['tip'] ? this.$route.query['tip'] : (this.simply ? '很抱歉，页面已不在' : '很抱歉，頁面已不在'),
        };
    },
    beforeCreate() {},
    mounted() {
        this.$root.blueLoadingParams.show = false;
    },
    methods: {
        // app内后退
        goBack() {
            this.appFn.commonFn(this.back_fn);
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.error-404 {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.error-404-img {
    font-size: .8rem;
    line-height: .8rem;
    color: #dddddd;
}

.error-404-text {
    display: block;
    color: #dddddd;
    margin-top: -1.1rem;
}

.back-icon-box {
    position: absolute;
    left: .16rem;
    top: .06rem;
    width: .32rem;
    height: .32rem;
    line-height: .32rem;
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .5);
    padding-left: .01rem;
    z-index: 101;
}

.back-icon-box .back-icon {
    color: rgba(255, 255, 255, 1);
    font-size: .22rem;
    transition: all 200ms;
    cursor: pointer;
}

.sold-out-img {
    width: 2.8rem;
}
</style>
