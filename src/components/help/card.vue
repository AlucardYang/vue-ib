<template>
    <div class="com-scroll-y help-card-content">
        <ul class="help-card clearfix">
            <li v-for="(item, index) in helpCards" :key="index" class="help-card-single" :class="{'margin-right-0': (index + 1) % 3 === 0, 'help-card-scale': item.type_name !== '敬請期待' && (item.type_name !== '敬请期待')}" @click="goHelpList(item)">
                <div class="help-card-single-inner">
                    <img v-if="item.type_name !== '敬請期待' && (item.type_name !== '敬请期待')" :src="item.icon" class="icon-size">
                    <i v-if="item.type_name === '敬請期待' || (item.type_name === '敬请期待')" class="iconfont icon-size gray-color" v-html="item.icon"></i><br>
                    <span :class="{'gray-color': item.type_name === '敬請期待' || (item.type_name === '敬请期待')}">{{item.type_name}}</span>
                </div>
            </li>
        </ul>
        <div class="help-card-bottom">
            <div class="top">
                <span>{{simply ? '如果未能解决您的问题，可拨打客服热线：' : '如果未能解決您的問題，可撥打客服熱線：'}}</span>
                <span class="blue" @click="appFn.phonePicker()">{{phoneNum}}</span>
            </div>
            <div>
                <span>{{simply ? '或者发送邮件至客服邮箱：' : '或者發送郵件至客服郵箱：'}}</span>
                <span class="blue" @click="appFn.emailPicker()">{{emailAdd}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HelpCard",
    data() {
        return {
            helpCards: [],
            icons: {
                '新手必看': '&#xe692;',
                'iBer Care': '&#xe694;',
                'iBer Tranning': '&#xe695;',
                '寫文章/轉載': '&#xe690;',
                '写文章/转载': '&#xe690;',
                'iBer 服務': '&#xe691;',
                'iBer 服务': '&#xe691;',
                'iBer 培訓': '&#xe695;',
                'iBer 培训': '&#xe695;',
                '資料認證': '&#xe68e;',
                '资料认证': '&#xe68e;',
                '功能更新': '&#xe693;',
                '敬請期待': '&#xe68f;',
                '敬请期待': '&#xe68f;',
            },
            phoneNum: '+852 3705 5152',
            emailAdd: 'Service@iBer.HK'
        };
    },
    components: {},
    created() {
        this.$root.blueLoadingParams.show = true;
    },
    mounted() {
        this.getHelpCard();
    },
    methods: {
        getHelpCard() {
            this.$http.post('/question/index').then(res => {
                if (res && res.code === 0) {
                    this.helpCards = res.data;
                    // 最后一个默认是敬请期待
                    // this.helpCards.push({
                    //   type_name: /cn/ig.test(this.lang) ? '敬请期待' : '敬請期待',
                    //   icon: '&#xe68f;'
                    // });
                }
                this.$root.blueLoadingParams.show = false;
            }, err => {
                this.$root.blueLoadingParams.show = false;
            });
        },
        goHelpList(item) {
            if (item.type_name !== '敬請期待' && item.type_name !== '敬请期待') {
                window.location.href = window.baseUrl + '/help/list?user_uuid=' + this.userUuid + '&type_uuid=' + item.uuid + '&type_name=' + item.type_name + '&language=' + this.lang + '&in_app=1';
            }
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.help-card-content {
    width: 100%;
    background-color: #F6F6F6;
    text-align: center;
    letter-spacing: 0;
}

.help-card {
    width: 100%;
    min-height: calc(100% - .56rem);
    padding: .16rem .125rem;
}

.help-card-single {
    position: relative;
    float: left;
    width: 31%;
    height: 1.1rem;
    background: #FFFFFF;
    box-shadow: 0 2px 16px 0 rgba(51, 100, 228, 0.04);
    border-radius: .08rem;
    margin-right: 3.5%;
    margin-bottom: .1rem;
}

.help-card-scale {
    cursor: pointer;
}

.help-card-scale:hover {
    transform: scale(1.04);
}

.margin-right-0 {
    margin-right: 0;
}

.help-card-single-inner {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    color: #2A2A2A;
    font-size: .13rem;
}

.help-card-single-inner span {
    display: inline-block;
    /* white-space: nowrap; */
    word-break: break-all;
    word-wrap: break-word;
}

.icon-size {
    display: inline-block;
    font-size: .25rem;
    margin-bottom: .07rem;
    width: .25rem;
    height: .25rem;
}

.gray-color {
    color: #999999 !important;
}

.feature-update {
    font-size: .21rem;
}

.help-card-bottom {
    width: 100%;
    font-size: .12rem;
    color: #999999;
    line-height: .15rem;
    padding: .08rem 0 .12rem 0;
}

.help-card-bottom .top span {
    display: inline-block;
    margin-bottom: .06rem;
}

.help-card-bottom .blue {
    color: #3852EC;
    cursor: pointer;
}
</style>