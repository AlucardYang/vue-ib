<template>
    <div class="card-text" :style="{'padding': (!inApp || (preview === '0')) ? '0' : '.14rem', 'opacity': loadResource ? 1 : 0}">
        <!-- 预加载头像 -->
        <img v-if="existCardUrl" style="display: none" :src="agentInfo.avatar">
        <!-- 动态加载路由 -->
        <component :is="card_url"></component>
    </div>
</template>

<script>
import {
    Toast
} from 'mint-ui';

import CommonJS from '@/components/shared/service/common.js';

import ErrorNotFound from '@/components/error/notfound.vue';
// 生日
import BirthdayAroundFlower from '@/components/card/text/birthday/aroundflower.vue';
import BirthdayBalloonCake from '@/components/card/text/birthday/ballooncake.vue';
import BirthdayLeafFlower from '@/components/card/text/birthday/leafflower.vue';
import BirthdayOrangeCake from '@/components/card/text/birthday/orangecake.vue';
import BirthdayPinkBird from '@/components/card/text/birthday/pinkbird.vue';
import BirthdayPinkPig from '@/components/card/text/birthday/pinkpig.vue';
import BirthdayPinkWave from '@/components/card/text/birthday/pinkwave.vue';
import BirthdayPurple from '@/components/card/text/birthday/purple.vue';
import BirthdayRedBow from '@/components/card/text/birthday/redbow.vue';
import BirthdayStar from '@/components/card/text/birthday/star.vue';
// 圣诞
import ChristmasBlueSanta from '@/components/card/text/christmas/bluesanta.vue';
import ChristmasFatMan from '@/components/card/text/christmas/fatman.vue';
import ChristmasNight from '@/components/card/text/christmas/night.vue';
import ChristmasRedSanta from '@/components/card/text/christmas/redsanta.vue';
// 元旦
import NewYearLantern from '@/components/card/text/newyear/lantern.vue';
import NewYearRed from '@/components/card/text/newyear/red.vue';
import NewYearSnow from '@/components/card/text/newyear/snow.vue';
// 春节
import SpringFestivalSquare from '@/components/card/text/springfestival/square.vue';
import SpringFestivalWealthGod from '@/components/card/text/springfestival/wealthgod.vue';
import SpringFestivalHappyPig from '@/components/card/text/springfestival/happypig.vue';
// 元宵
import LanternFestivalReunion from '@/components/card/text/lanternfestival/reunion.vue';
// 劳动节
import LaborDayGlory from '@/components/card/text/laborday/glory.vue';
// 母亲节
import MothersDayYoung from '@/components/card/text/mothersday/young.vue';
// 端午节
import DragonBoatZongZi from '@/components/card/text/dragonboat/zongzi.vue';
import DragonBoatRiver from '@/components/card/text/dragonboat/river.vue';

export default {
    name: "CardText",
    data() {
        return {
            inIphoneX: window.screen.height >= 812 ? true : false,
            preview: this.$route.query['preview'] ? this.$route.query['preview'] : (this['urlParams'] ? this.urlParams['preview'] : ''),
            card_url: this.$route.query['card_url'] ? this.$route.query['card_url'] : (this['urlParams'] ? this.urlParams['card_url'] : ''),
            cardUuid: this.$route.query['card_uuid'] ? this.$route.query['card_uuid'] : (this['urlParams'] ? this.urlParams['card_uuid'] : ''),
            greetingUuid: this.$route.query['greeting_uuid'] ? this.$route.query['greeting_uuid'] : (this['urlParams'] ? this.urlParams['greeting_uuid'] : ''),
            agentInfo: {},
            share: {},
            setting: {
                hide_platform: [], // 默认值：全显示传[] ['timeline', 'wechat', 'facebook', 'whatsapp', 'instagram', 'qq', 'weibo', 'copy', 'more'],
                language: 'null', // 显示语言，默认值：'auto', 可选值：'null', 'auto', 'zh-cn', 'zh-tw'
                auth: 'force', // 微信授权，默认值：'force', 可选值：'null', 'force', 'free'
                card: 'null', // 底部名片，默认值：'full', 可选值：'null', 'full', 'simple', 'hide'
                comment: 'null', // 个人感想，默认值：'show', 可选值: 'null', 'show', 'hide',
                moreShare: 'null'
            },
            this_from: this.simply ? '来自' : '來自',
            send_bless: this.simply ? '送来的祝福' : '送來的祝福',
            write_wish: this.simply ? '快来写下您对她/他的祝福吧！' : '快來寫下您對她/他的祝福吧！',
            festival: {
                'birthday': '生日',
                'christmas': this.simply ? '圣诞' : '聖誕',
                'new-year': '元旦',
                'spring-festival': this.simply ? '春节' : '春節',
                'lantern-festival': '元宵',
                'labor-day': this.simply ? '劳动节' : '勞動節',
                'mothers-day': this.simply ? '母亲节' : '母親節',
                'dragon-boat': this.simply ? '端午节' : '端午節',
            },
            festival_wish: '的生日祝福',
            text: '',
            showNotFound: false,
            textSpeed: 0.1,
            existCardUrl: false,
            loadResource: false
        };
    },
    components: {
        ErrorNotFound,

        BirthdayAroundFlower,
        BirthdayBalloonCake,
        BirthdayLeafFlower,
        BirthdayOrangeCake,
        BirthdayPinkBird,
        BirthdayPinkPig,
        BirthdayPinkWave,
        BirthdayPurple,
        BirthdayRedBow,
        BirthdayStar,

        ChristmasFatMan,
        ChristmasBlueSanta,
        ChristmasNight,
        ChristmasRedSanta,

        NewYearLantern,
        NewYearRed,
        NewYearSnow,

        SpringFestivalSquare,
        SpringFestivalWealthGod,
        SpringFestivalHappyPig,

        LanternFestivalReunion,

        LaborDayGlory,

        MothersDayYoung,

        DragonBoatZongZi,
        DragonBoatRiver,
    },
    beforeCreate() {
        CommonJS.loadStyle('https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css');
    },
    created() {
        this.$root.blueLoadingParams.show = true;
        let components = this.$vnode.componentOptions.Ctor.options.components;
        for (let key in components) {
            if (this.card_url.replace(/\-/ig, '') === (components[key]['name'] && components[key]['name'].toLowerCase())) {
                this.existCardUrl = true;
            }
        }
        // 无对应路径显示找不到提示
        !this.existCardUrl && (this.card_url = 'ErrorNotFound');
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: this.simply ? '快快打开这份心意吧～' : '快快打開這份心意吧～',
            isReport: true, // 分享上报，不上报可不传
            greeting_uuid: this.greetingUuid,
            target_type: 51,
            user_uuid: this.userUuid,
            router: window.location.pathname,
            url: window.location.origin + window.location.pathname + '?user_uuid=' + this.userUuid + '&card_uuid=' + this.cardUuid + '&greeting_uuid=' + this.greetingUuid + '&card_url=' + this.card_url + '&target_type=51' + '&one_way=' + this.userUuid
        };
        // 页面显示来自XXXX的XX祝福
        for (let key in this.festival) {
            if (this.card_url.indexOf(key) !== -1) {
                this.festival_wish = ('的' + this.festival[key] + '祝福');
            }
        }
        this.getShareInfo();
        this.getAgentInfo();
    },
    mounted() {
        setTimeout(() => {
            this.loadResource = true;
            this.$root.blueLoadingParams.show = false;
        }, 2000);
    },
    methods: {
        // 获取agent信息
        getAgentInfo() {
            if (this.userUuid) {
                this.$http.post('/user/essential-info', {
                    uid: this.userUuid
                }).then(res => {
                    if (res && res.code === 0) {
                        this.agentInfo = res.data;
                        this.agentInfo.nickname = this.agentInfo.name;
                        // this.share.title = this.agentInfo.name + this.send_bless;
                        document.title = this.agentInfo.name + this.send_bless;
                    } else {
                        Toast({
                            message: '獲取agent信息：' + res.msg
                        });
                    }
                }, err => {});
            }
        },
        // 获取祝福语
        getGreetingText() {
            const promise = new Promise((resolve, reject) => {
                if (!this.inApp) {
                    let firstReportParam = {
                        greeting_uuid: this.greetingUuid,
                    };
                    this.getRootUserInfo(firstReportParam).then(res1 => {
                        // 浏览上报
                        CommonJS.readReport(this.share);
                        this.getCardInfo().then(res => {
                            resolve(res);
                        });
                    });
                } else {
                    if (this.greetingUuid) {
                        this.getCardInfo().then(res => {
                            resolve(res);
                        });
                    } else {
                        this.getFirstGreeting().then(res => {
                            resolve(res);
                        });
                    }

                }
            });
            promise.catch((error) => {
                console.log(error);
            });
            return promise;
        },
        // 获取第一条祝福语
        getFirstGreeting() {
            const promise = new Promise((resolve, reject) => {
                this.$http.get('/greeting-card/first', {
                    card_uuid: this.cardUuid
                }).then(res => {
                    if (res && res.code === 0) {
                        this.share.desc = res.data['attachment'];
                        // 微信分享初始化
                        CommonJS.initWX(this.share);
                        res.data['attachment'] && (this.text = (this.rootUserInfo.username ? (' ' + this.rootUserInfo.username + '：\n') : '') + '      ' + res.data['attachment']);
                        resolve(this.text);
                    } else if (res && res.code === 1001) {
                        window.location.href = window.baseUrl + '/error/notfound';
                    } else {
                        resolve();
                        Toast({
                            message: '獲取第一條祝福語：' + res.msg
                        });
                    }
                    // this.$root.blueLoadingParams.show = false;
                }, err => {
                    this.$root.blueLoadingParams.show = false;
                });
            });
            promise.catch((error) => {
                console.log(error);
            });
            return promise;
        },
        // 获取贺卡信息
        getCardInfo() {
            const promise = new Promise((resolve, reject) => {
                this.$http.get('/greeting-card/text', {
                    card_uuid: this.cardUuid,
                    greeting_uuid: this.greetingUuid
                }).then(res => {
                    if (res && res.code === 0) {
                        // this.share.desc = res.data['attachment'];
                        res.data['attachment'] && (this.text = (this.rootUserInfo.username ? (' ' + this.rootUserInfo.username + '：\n') : '') + '      ' + res.data['attachment']);
                        // this.text = '';
                        // this.text = '親愛的Grace，今天是你的生日，在此給你我特別的祝福。';
                        // this.text = '親愛的Grace，今天是你的生日，在此給你我特別的祝福，願它每分每秒都帶給你健康、好運和幸福。希望這是你度過的最美好的生日！祝福你永遠健康快樂！親愛的安妮兒，今天是你的生日，在此給你我特別的祝福，願它每分每秒都帶給你健康、好運和幸福。希望這是你度過的最美好的生日！祝福你永遠健康快樂！希望這是你度過的最美好的生日！祝福你永遠健康快樂！';
                        this.share.title = res.data.share['title'];
                        this.share.thumbImage = res.data.share['thumbImage'];
                        this.share.desc = res.data.share['desc'];
                        // 微信分享初始化
                        CommonJS.initWX(this.share);
                        resolve(this.text);
                    } else if (res && res.code === 1001) {
                        window.location.href = window.baseUrl + '/error/notfound';
                    } else {
                        resolve();
                        Toast({
                            message: '獲取用戶祝福語：' + res.msg
                        });
                    }
                    // this.$root.blueLoadingParams.show = false;
                }, err => {
                    this.$root.blueLoadingParams.show = false;
                });
            });
            promise.catch((error) => {
                console.log(error);
            });
            return promise;
        },
        // 提供给app获取分享信息
        getShareInfo() {
            const _this = this;
            window.getShareInfo = function() {
                _this.appFn.shareFn(_this.share, _this.setting);
            }
        },
        goConsultAgent() {
            plug.authAddress({
                object: this, //Vue对象或子对象，注意作用域
                user_uuid: this.userUuid,
                answer_uuid: this.greetingUuid,
                from_type: this.$root.fromType
            });
        },
        goAgentPage() {
            if (this.agentInfo.home_url) {
                plug.addrDeclare({
                    object: this, //Vue对象或子对象，注意作用域
                    app: this.inApp,
                    page: this.agentInfo.home_url, //申报地址成功后跳转URL
                    user_uuid: this.userUuid //agent ID
                });
            }
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-text {
    width: 100%;
    height: 100%;
}
</style>
