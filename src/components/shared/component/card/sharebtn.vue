<template>
    <div v-show="!keyState" v-if="inApp" class="shared-now-box" :style="{'z-index': plug.android && model == 'evaluate' ? '9999' : ''}">
        <div v-if="styleType === 'normal'" class="shared-now-only-btn" @click="openAppPicker('sharePicker')">
            <span>立即分享</span>
        </div>
        <ul v-if="styleType === 'agentArticle'" class="shared-now-operating">
            <li v-if="!showSetting" @click="openAppPicker('writePage')">
                <i class="iconfont">&#xe6db;</i>
                <span>{{simply ? '写感想' : '寫感想'}}</span>
            </li>
            <li v-if="showSetting" @click="openAppPicker('shareSetting')">
                <i class="iconfonti">&#xe6f6;</i>
                <span>{{simply ? '设置' : '設定'}}</span>
            </li>
            <li @click="openAppPicker('editPage')">
                <i class="iconfont">&#xe786;</i>
                <span>{{simply ? '编辑' : '編輯'}}</span>
            </li>
            <li @click="openAppPicker('deletePicker')">
                <i class="iconfont">&#xe791;</i>
                <span>刪除</span>
            </li>
            <li class="share-btn" @click="openAppPicker('sharePicker')">立即分享</li>
        </ul>
    </div>
</template>

<script>
import CommonJS from '@/components/shared/service/common.js';
import cmn from "@/components/evaluate/common.js";

export default {
    name: "ShareBtn",
    props: {
        model: {
            type: String,
            default: ""
        },
        // 分享样式类型，通用样式：normal，文章：agentArticle
        styleType: {
            type: String,
            default: function() {
                return "normal";
            }
        },
        // 分享信息
        share: {
            type: Object,
            default: function() {
                return {
                    type: "news", // 'news'(分享带链接), 'imageUrl'(只分享图片)
                    title: "", // 分享标题
                    url: "", // 分享路径，传给app的路径
                    desc: "", // 分享描述
                    thumbImage: "", // 缩略图链接
                    imageUrl: "" // type 為 news 可以傳空
                };
            }
        },
        // 配置
        setting: {
            type: Object,
            default: function() {
                return {
                    hide_platform: [], // 默认值：全显示传[] ['timeline', 'wechat', 'facebook', 'whatsapp', 'instagram', 'qq', 'weibo', 'copy', 'more'],
                    language: "auto", // 显示语言，默认值：'auto', 可选值：'null', 'auto', 'zh-cn', 'zh-tw'
                    auth: "force", // 微信授权，默认值：'force', 可选值：'null', 'force', 'free'
                    card: "full", // 底部名片，默认值：'full', 可选值：'null', 'full', 'simple', 'hide'
                    comment: "null", // 个人感想，默认值：'show', 可选值: 'null', 'show', 'hide'
                    moreShare: "null" // 更多分享，默认值：'null', 可选值: 'null', 'show', 'hide'
                };
            }
        },
        // 传递评论
        comment: {
            type: String,
            default: function() {
                return "";
            }
        },
        // 是否付费用户
        isPro: {
            type: null,
            default: function() {
                return 1;
            }
        }
    },
    data() {
        return {
            agentInfo: {},
            keyState: false,
            inAndroid: /android/ig.test(window.navigator.userAgent.toLowerCase()),
            showSetting: CommonJS.compareVersion(window.apiHeaders['version'], '2.3.3'),
        };
    },
    components: {},
    watch: {
        share: {
            handler: function(value, oldvalue) {}
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        openAppPicker(type) {
          if (this.share.page_name == 'risk') {
            cmn.czcEv('bdj_fengxianlijifenxiang', '立即分享');
          }
          if (this.share.page_name == 'disease') {
            cmn.czcEv('bdj_jibinglijifenxiang', '立即分享');
          }  

            let data = {};
            window.agentInfo && !window.agentInfo['nickname'] && (this.setting.card = 'null');
            if (type === "sharePicker") {
                if (this.isPro) {
                    this.appFn.shareFn(this.share, this.setting);
                } else {
                    let pageParam = {
                        page_url: "IBerMineModule_IBerAboutIntroducePage",
                        is_sapp: false,
                        page_type: 1
                    };
                    this.appFn.goPage(pageParam);
                }
            } else {
                data = {};
                this.comment && (data.message = this.comment);
                this.appFn.commonFn(type, data);
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.shared-now-box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}

.shared-now-only-btn {
    width: 100%;
    height: 0.48rem;
    line-height: 0.48rem;
    text-align: center;
    color: #fff;
    font-size: 0.17rem;
    background-color: #3364e4;
    cursor: pointer;
    font-weight: bold;
}

.shared-now-operating {
    width: 100%;
    height: 0.54rem;
    background-color: #fff;
    padding: 0.06rem 0.14rem;
}

.shared-now-operating li {
    text-align: center;
    float: left;
    color: #666;
    margin-right: 0.26rem;
    cursor: pointer;
}

.shared-now-operating li i {
    font-size: 0.2rem;
    display: block;
}

.shared-now-operating li span {
    display: block;
    font-size: 0.12rem;
    line-height: 0.15rem;
}

.shared-now-operating .share-btn {
    float: right;
    width: 1.74rem;
    height: 0.38rem;
    line-height: 0.38rem;
    color: #fff;
    font-size: 0.14rem;
    background-color: #3364e4;
    border-radius: 0.19rem;
    margin: 0.02rem 0 0 0;
    font-weight: bold;
}

.card-shared-now {
    width: 100%;
    height: 0.48rem;
}

.card-shared-now .btn {
    width: 50%;
    float: left;
    height: 0.48rem;
    line-height: 0.48rem;
    background-color: #3364e4;
    text-align: center;
    color: #fff;
    font-size: 0.17rem;
    font-weight: bold;
}

.card-shared-now .edit {
    background-color: #fff;
    color: #999999;
}
</style>
