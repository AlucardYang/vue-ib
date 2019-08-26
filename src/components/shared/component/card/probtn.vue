<template>
    <div class="pro-btn">
        <div class="inner">
            <img src="https://static.iberhk.com/v2/web/images/common/diamond.png">
            <span>{{suggest}}</span>
            <div class="now-upgrade" @click="goProPage">{{simply ? '立即升级' : '立即升級'}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProBtn",
    props: {
        suggest: {
            type: String,
            default: function() {
                return '';
            }
        },
    },
    data() {
        return {

        };
    },
    components: {},
    created() {},
    watch: {},
    mounted() {},
    methods: {
        goProPage() {
            let pageParam = {
                page_url: "IBerMineModule_IBerAboutIntroducePage",
                is_sapp: false,
                page_type: 1
            };
            this.appFn.goPage(pageParam);
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pro-btn {
    width: 100%;
    min-height: 1.44rem;
    text-align: center;
    position: relative;
}

.pro-btn .inner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    text-align: center;
    height: .66rem;
    line-height: .2rem;
    width: 100%;
}

.pro-btn .inner img {
    display: inline-block;
    vertical-align: middle;
    width: .22rem;
    height: .2rem;
}

.pro-btn .inner span {
    display: inline-block;
    vertical-align: middle;
    font-size: .16rem;
    color: #2A2A2A;
    line-height: .2rem;
}

.now-upgrade {
    display: inline-block;
    width: 1.4rem;
    height: .32rem;
    line-height: .32rem;
    background-image: linear-gradient(-179deg, #4A86F7 0%, #4172FF 97%);
    border-radius: .16rem;
    font-size: .14rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    margin-top: .12rem;
}
</style>
