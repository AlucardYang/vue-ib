<template>
    <div class="help-list-content" :style="{'background-color': showIberCareCard ? '#F6F6F6' : '#FFFFFF'}">
        <div v-if="showIberCareCard" class="iber-care-box">
            <img class="iber-care-card" src="https://static.iberhk.com/v2/web/images/help/iBerCareCard.png">
        </div>
        <div class="com-scroll-y" :class="{'help-list-bottom': showIberCareCard}">
            <ul class="help-list">
                <li class="help-list-row" v-for="(item, index) in helpLists" :key="index" @click="goHelpDetail(item)" :style="{'border-bottom-width': (showIberCareCard && (helpLists.length - 1 === index)) ? 0 : '.005rem'}">
                    <span>{{item.question}}</span>
                    <i class="iconfont arrow-right">&#xe774;</i>
                </li>
            </ul>
        </div>
        <div v-if="showIberCareCard" class="help-card-bottom">
            <div class="top">
                <span>{{simply ? '如果未能解决您的问题，可拨打客服热线：' : '如果未能解決您的問題，可撥打客服熱線：'}}</span>
                <span class="blue" @click="appFn.phonePicker()">{{phoneNum}}</span>
            </div>
            <div>
                <span>{{simply ? '或者发送邮件至客服邮箱：' : '或者發送郵件至客服郵箱：'}}</span>
                <span class="blue" @click="appFn.emailPicker()">{{emailAdd}}</span>
            </div>
        </div>
        <ul v-if="showIberCareCard" class="bottom-btn">
            <li class="left" @click="downloadCard">{{simply ? '下载客户服务卡' : '下載客戶服務卡'}}</li>
            <li class="right" @click="shareCard">{{simply ? '分享客户服务卡' : '分享客戶服務卡'}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "HelpList",
    data() {
        return {
            type_name: this.$router.currentRoute.query['type_name'],
            type_uuid: this.$router.currentRoute.query['type_uuid'],
            helpLists: [],
            showIberCareCard: false,
            phoneNum: '+852 3705 5152',
            emailAdd: 'Service@iBer.HK'
        };
    },
    components: {},
    created() {
        this.$root.blueLoadingParams.show = true;
        // iBer_care_card帮助中心iBerCare卡片上线开关
        if (this.type_name === 'iBer Care' || this.type_name === '医疗预约' || this.type_name === '醫療預約') {
            this.showIberCareCard = true;
        }
    },
    mounted() {
        document.title = this.type_name ? this.type_name : 'iBer';
        this.getHelpList();
    },
    methods: {
        getHelpList() {
            this.$http.post('/question/list', {
                type_uuid: this.type_uuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.helpLists = res.data;
                }
                this.$root.blueLoadingParams.show = false;
            }, err => {
                this.$root.blueLoadingParams.show = false;
            })
        },
        goHelpDetail(item) {
            window.location.href = window.baseUrl + '/help/detail?user_uuid=' + this.userUuid + '&question_uuid=' + item.uuid + '&language=' + this.lang + '&in_app=1';
        },
        // iber care下载客户服务卡
        downloadCard() {
            this.appFn.commonFn('saveImageAlbum', {
                imgUrl: 'https://static.iberhk.com/v2/web/images/help/iBerCareCard.png'
            });
        },
        // iber care分享客户服务卡
        shareCard() {
            this.appFn.commonFn('sharePicker', {
                setting: [],
                share: {
                    type: 'imageUrl',
                    imageUrl: 'https://static.iberhk.com/v2/web/images/help/iBerCareCard.png'
                }
            })
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.help-list-content {
    background-color: #F6F6F6;
}

.help-list-bottom {
    height: calc(100% - 3.82rem);
}

.iber-care-box {
    background-color: #ffffff;
    margin-bottom: .1rem;
    padding: .2rem;
}

.iber-care-card {
    width: 100%;
    border-radius: .16rem;
        box-shadow: 0px 0px 30px #ddd;
}

.help-list {
    background-color: #ffffff;
    width: 100%;
    padding: 0 .12rem 0 .12rem;
}

.help-list-row {
    position: relative;
    font-size: .16rem;
    color: #2A2A2A;
    line-height: .22rem;
    height: .54rem;
    border-bottom: 1px solid #DDDDDD;
    padding-right: .2rem;
    cursor: pointer;
}

.help-list-row span {
    width: calc(100% - .2rem);
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.arrow-right {
    font-size: .16rem;
    color: #DDDDDD;
    position: absolute;
    right: 0;
    top: 0;
    line-height: .54rem;
}

.bottom-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .48rem;
    cursor: pointer;
}

.bottom-btn .left,
.bottom-btn .right {
    position: absolute;
    right: 0;
    top: 0;
    width: 50%;
    height: .48rem;
    line-height: .48rem;
    font-size: .17rem;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    background-color: #FF7417;
}

.bottom-btn .left {
    left: 0;
    background-color: #3364E4;
}

.help-card-bottom {
    position: absolute;
    bottom: .48rem;
    left: 0;
    width: 100%;
    font-size: .12rem;
    color: #999999;
    line-height: .15rem;
    padding: .08rem 0 .12rem 0;
    text-align: center;
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