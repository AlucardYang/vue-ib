<template>
    <div class="card-video" :style="{'padding': (!inApp || (preview === '0')) ? '0' : '.14rem', 'opacity': loadResource ? 1 : 0}">
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
import BirthdayBlueTv from '@/components/card/video/birthday/bluetv.vue';
import BirthdayFlowerFilm from '@/components/card/video/birthday/flowerfilm.vue';
import BirthdayPinkBear from '@/components/card/video/birthday/pinkbear.vue';
import BirthdayPinkWreath from '@/components/card/video/birthday/pinkwreath.vue';
// 圣诞
import ChristmasBlueElk from '@/components/card/video/christmas/blueelk.vue';
import ChristmasGreenSanta from '@/components/card/video/christmas/greensanta.vue';
import ChristmasLight from '@/components/card/video/christmas/light.vue';
// 元旦
import NewYearPlum from '@/components/card/video/newyear/plum.vue';
// 春节
import SpringFestivalSendMoney from '@/components/card/video/springfestival/sendmoney.vue';
import SpringFestivalPigYear from '@/components/card/video/springfestival/pigyear.vue';
import SpringFestivalNewSpring from '@/components/card/video/springfestival/newspring.vue';
import SpringFestivalLightBox from '@/components/card/video/springfestival/lightbox.vue';
import SpringFestivalIberTimi from '@/components/card/video/springfestival/ibertimi.vue';
// 元宵
import LanternFestivalTangYuan from '@/components/card/video/lanternfestival/tangyuan.vue';
// 劳动节
import LaborDayLamor from '@/components/card/video/laborday/lamor.vue';
// 母亲节
import MothersDayThanks from '@/components/card/video/mothersday/thanks.vue';
// 端午节
import DragonBoatBoat from '@/components/card/video/dragonboat/boat.vue';
import DragonBoatDragon from '@/components/card/video/dragonboat/dragon.vue';

export default {
    name: "CardVideo",
    data() {
        return {
            inIphoneX: window.screen.height >= 812 ? true : false,
            preview: this.$route.query['preview'] ? this.$route.query['preview'] : (this['urlParams'] ? this.urlParams['preview'] : ''),
            card_url: this.$route.query['card_url'] ? this.$route.query['card_url'] : (this['urlParams'] ? this.urlParams['card_url'] : ''),
            cardUuid: this.$route.query['card_uuid'] ? this.$route.query['card_uuid'] : (this['urlParams'] ? this.urlParams['card_uuid'] : ''),
            greetingUuid: this.$route.query['greeting_uuid'] ? this.$route.query['greeting_uuid'] : (this['urlParams'] ? this.urlParams['greeting_uuid'] : ''),
            videoPlayer: null,
            agentInfo: {},
            share: {},
            setting: {
                hide_platform: [], // 默认值：全显示传[] ['timeline', 'wechat', 'facebook', 'whatsapp', 'instagram', 'qq', 'weibo', 'copy', 'more'],
                language: 'null', // 显示语言，默认值：'auto', 可选值：'null', 'auto', 'zh-cn', 'zh-tw'
                auth: 'force', // 微信授权，默认值：'force', 可选值：'null', 'force', 'free'
                card: 'null', // 底部名片，默认值：'full', 可选值：'null', 'full', 'simple', 'hide'
                comment: 'null', // 个人感想，默认值：'show', 可选值: 'null', 'show', 'hide'
                moreShare: 'null'
            },
            this_from: this.simply ? '来自' : '來自',
            send_bless: this.simply ? '送来的祝福' : '送來的祝福',
            no_upload: this.simply ? '未上传' : '未上傳',
            max_video_time: '5:00',
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
            videoSrc: '',
            videoWebmSrc: '',
            showNotFound: false,
            existCardUrl: false,
            loadResource: false
        };
    },
    components: {
        ErrorNotFound,

        BirthdayBlueTv,
        BirthdayFlowerFilm,
        BirthdayPinkBear,
        BirthdayPinkWreath,

        ChristmasBlueElk,
        ChristmasGreenSanta,
        ChristmasLight,

        NewYearPlum,

        SpringFestivalSendMoney,
        SpringFestivalPigYear,
        SpringFestivalNewSpring,
        SpringFestivalLightBox,
        SpringFestivalIberTimi,

        LanternFestivalTangYuan,

        LaborDayLamor,

        MothersDayThanks,

        DragonBoatBoat,
        DragonBoatDragon,
    },
    beforeCreate() {
        CommonJS.loadStyle('https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css');
        CommonJS.loadStyle('https://static.iberhk.com/res/css/video-js.min.css');
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
        // this.videoSrc = 'https://static.iberhk.com/agent-article/video/2018/2/8/1533202043000.mp4';
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
        if (!this.inApp) {
            let firstReportParam = {
                greeting_uuid: this.greetingUuid,
            };
            this.getRootUserInfo(firstReportParam).then(res1 => {
                // 浏览上报
                CommonJS.readReport(this.share);
            });
        }
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
        initCard() {
            this.setPoster();
            if (this.videoSrc) {
                const _this = this;
                this.videoPlayer = videojs('videoPlayer', {
                    controls: true,
                    autoplay: false,
                    preload: 'auto',
                    playsinline: true,
                    'webkit-playsinline': true
                }, function() {
                    // this.on('playing', function() {
                        // if (_this.$root.isAndroid && _this.$root.isWeiXin) {
                            // this.requestFullscreen();
                        // }
                    // });
                });
            }
        },
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
                })
            }
        },
        // 获取贺卡信息
        getCardInfo() {
            const promise = new Promise((resolve, reject) => {
                if (this.greetingUuid) {
                    this.$http.get('/greeting-card/video', {
                        card_uuid: this.cardUuid,
                        greeting_uuid: this.greetingUuid
                    }).then(res => {
                        if (res && res.code === 0) {
                            this.videoSrc = res.data['video'];
                            // this.videoSrc = '';
                            this.videoWebmSrc = this.videoSrc.substr(0, this.videoSrc.lastIndexOf('.')) + '.webm';
                            this.share.title = res.data.share['title'];
                            this.share.thumbImage = res.data.share['thumbImage'];
                            this.share.desc = res.data.share['desc'];
                            // 微信分享初始化
                            CommonJS.initWX(this.share);
                            resolve(this.videoSrc);
                        } else if (res && res.code === 1001) {
                            window.location.href = window.baseUrl + '/error/notfound';
                        } else {
                            resolve();
                            Toast({
                                message: '獲取用戶視頻：' + res.msg
                            });
                        }
                        // this.$root.blueLoadingParams.show = false;
                    }, err => {
                        this.$root.blueLoadingParams.show = false;
                    })
                } else {
                    resolve();
                    this.$root.blueLoadingParams.show = false;
                }
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
        setPoster() {
            // 设置视频背景图
            var videoPlayer = document.getElementById('videoPlayer');
            if (videoPlayer) {
                let videoPosterUrl = this.videoSrc + '?x-oss-process=video/snapshot,t_100,f_png,w_' + videoPlayer['videoWidth'] + ',h_' + videoPlayer['videoHeight'] + ',m_fast';
                // videoPlayer.poster = videoPosterUrl;
                videoPlayer.poster = 'https://static.iberhk.com/v2/web/images/card/poster-gif0.9.gif';
                document.querySelector('.video-mask').style.backgroundImage = 'url(' + videoPosterUrl + ')';
                // document.querySelector('.video-mask').style.transform = 'rotate(90deg) scale(1.8)';
            }
        },
        wxInitCard() {
            if (CommonJS.isWeiXin) {
                const _this = this;
                setTimeout(() => {
                    _this.initCard();
                }, 2000);
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
.card-video {
    width: 100%;
    height: 100%;
}
</style>