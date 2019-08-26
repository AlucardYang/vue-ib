import CommonJS from '@/components/shared/service/common.js';

import ArticleComment from "@/components/shared/component/card/articlecomment.vue";
import ConsultantCard from "@/components/shared/component/card/consultant.vue";
import ShareBtn from "@/components/shared/component/card/sharebtn.vue";
import LikeBtn from "@/components/shared/component/card/likebtn.vue";
import ProBtn from "@/components/shared/component/card/probtn.vue";
import comAgentAvatar from "@/components/component/com_agent_avatar.vue";
import ShareData from "@/components/shared/component/card/sharedata.vue";

export default {
    name: 'ArticleDetail',
    data() {
        return {
            articleUuid: this.$route.query['article_uuid'] ? this.$route.query['article_uuid'] : (this['urlParams'] ? this.urlParams['article_uuid'] : ''),
            moreShare: this.$route.query['moreShare'] ? this.$route.query['moreShare'] : (this['urlParams'] ? this.urlParams['moreShare'] : ''),
            consult_url: this.$route.query['consult_url'],
            isAllLoaded: false,
            isDetailLoaded: false,
            isDetailOtherLoaded: false,
            detail: {
                title: '',
                tags: []
            },
            bottomAgentInfo: {},
            share: {},
            friends: [{
                name: 'Michael',
                avatar: ''
            }, {
                name: 'Gregrea',
                avatar: ''
            }, {
                name: 'Connor',
                avatar: ''
            }, {
                name: 'Doris',
                avatar: ''
            }],
            analyze: {
                relations: [], // 资讯关联保险产品
                wechat_share_time: '',
                facebook_share_time: '',
                approval: 0, // 点赞状态
                share_time: [], // 推荐分享时间
                share_list: [], // 分享列表
                card: {},
                focus: [], // 主题特点
                focus_article: [], // 推荐文章
                interested_clients: [] // 可能感兴趣的圈子好友
            },
            isPro: 1,
            showLikeBtn: false,
            shareSetting: {
                hide_platform: [],
                language: 'auto',
                auth: 'force',
                card: 'full',
                comment: 'show',
                moreShare: 'show'
            },
            comAARData: {
                layer: 0,
                name: "comAARData",
                id: "",
                url: ""
            },
            declare_article_product: 0,
            showArticleRelatedProduct: true,
            showArticleSmartAlert: true,
            edit_impression: this.simply ? '编辑感想' : '編輯感想',
            write_impression: this.simply ? '发表感想' : '發表感想',
            contact: this.simply ? '咨询' : '諮詢',
            card_message_tip: this.simply ? '点评将会与分享的资讯一同展示' : '點評將會與分享的資訊一同展示',
            copy_right: this.simply ? '@版权归作者所有' : '@版權歸作者所有',
            disclaimer_des: this.simply ? '免责声明：本资讯来自公开网络，iBer不保证讯息的完整性和准确性；也不代表iBer的观点和立场。（注：财经频道所刊的所有文章，相关内容属作者个人意见，并不代表iBer立场，您需为自己的任何交易行为负责。）如有疑问，请发邮件至邮箱：Service@iBer.HK。' : '免責聲明：本資訊来自公開網絡，iBer不保證訊息的完整性和準確性；也不代表iBer的觀點和立場。（注：財經頻道所刊的所有文章，相關內容屬作者個人意見，並不代表iBer立場，您需為自己的任何交易行為負責。）如有疑問，請發郵件至郵箱：Service@iBer.HK。',
            article_list_title: this.simply ? '顾问分享' : '顧問分享',
            article_list_tip: this.simply ? '经过iBer认证的专业保险理财顾问' : '經過iBer認證的專業保險理財顧問',
            insight_des: this.simply ? 'AI雷达发现，此资讯适合的分享场景如下' : 'AI雷達發現，此資訊適合的分享場景如下',
            only_you_can_see: this.simply ? '（此分析仅您可见）' : '（此分析僅您可見）',
            theme_feature: this.simply ? '主题特点' : '主題特點',
            interest_friends: this.simply ? '可能感兴趣的圈子好友' : '可能感興趣的圈子好友',
            social_media: this.simply ? '社交媒体分享' : '社交媒體分享',
            wechat_friends: this.simply ? '适合于' : '適合于',
            recommended_article: this.simply ? '推荐文章' : '推薦文章',
            visitors_number: this.simply ? '浏览人数' : '瀏覽人數',
            forwarding_number: this.simply ? '客户转发数' : '客戶轉發數',
            reading_time: this.simply ? '平均阅读时长' : '平均閱讀時長',
            mintues_unit: this.simply ? '分钟' : '分鐘',
            share_time_text1: this.simply ? '适合在' : '適合在',
            share_time_text2: this.simply ? '分享' : '分享',
            share_time_text3: this.simply ? '提升' : '提升',
            share_time_text4: this.simply ? '的浏览量' : '的流覽量',
        }
    },
    components: {
        ArticleComment,
        ConsultantCard,
        ShareBtn,
        LikeBtn,
        ProBtn,
        comAgentAvatar,
        ShareData
    },
    created() {
        this.$root.blueLoadingParams.show = true;
        this.share = {
            type: 'news',
            title: '',
            thumbImage: '',
            desc: '',
            isReport: true, // 分享上报，不上报可不传
            article_uuid: this.articleUuid,
            target_type: 11,
            user_uuid: this.userUuid,
            c_user_uuid: '',
            router: window.location.pathname,
            url: ''
        };
        // 获取公共用户信息
        this.getUserInfoFn();
        // 获取资讯信息
        this.getArticleInfo();
        // 获取OSS地址申报配置
        this.getSystemSetting();
        // 刷新资讯相关分析数据接口
        this.reloadArticleInfoOther();
        // 跳转医疗产品详情页
        this.goIberCareDetail();
        // 2.2.6版本才把资讯关联保险产品打开
        inApp && window.apiHeaders['version'] && (this.showArticleRelatedProduct = CommonJS.compareVersion(window.apiHeaders['version'], '2.2.6'));
        // 2.3.1版本才把智能提醒打开
        inApp && window.apiHeaders['version'] && (this.showArticleSmartAlert = CommonJS.compareVersion(window.apiHeaders['version'], '2.3.1'));
    },
    mounted() {

    },
    methods: {
        // 获取公共用户信息
        getUserInfoFn() {
            if (!this.inApp) {
                let firstReportParam = {
                    article_uuid: this.articleUuid,
                };
                this.userUuid && this.getRootUserInfo(firstReportParam).finally(() => {
                    // 获取文章更多信息
                    this.getAiAnalyzeInfo();
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    // 浏览上报
                    CommonJS.readReport(this.share);
                    // 顶部消息提醒
                    this.$root.getAgentMsg();
                });
            } else {
                // 获取文章更多信息
                this.getAiAnalyzeInfo();
                // app内agent浏览上报
                CommonJS.readReport(this.share, true);
                // 提供给app更新评论
                this.updateComment();
            }
        },
        // 获取OSS地址申报配置
        getSystemSetting() {
            if (!this.inApp) {
                this.$http.get('/system/system-setting', {}).then(res => {
                    if (res && res.code === 0) {
                        // OSS配置打开时有保险产品需要填地址申报否则直接显示资讯详情
                        this.declare_article_product = res.data['declare_article_product'];
                        res.data['declare_article_product'] && this.getHasRelationTarget();
                    } else {
                        this.isAllLoaded = true;
                        this.$root.blueLoadingParams.show = false;
                    }
                }, err => { });
            }
        },
        // 获取关联关系
        getHasRelationTarget() {
            this.$http.get('/user/has-relation-target', {
                source_uuid: this.articleUuid,
                source_type: 11,
                target_type: 12
            }).then(res => {
                if (res && res.code === 0) {
                    if (res.data.length > 0) {
                        // 小程序内不需要地址申报
                        if (window.__wxjs_environment == "miniprogram" || (window.platform === 7) || /wechatdevtools/.test(navigator.userAgent.toLowerCase())) {

                        } else {
                            // 地址申报
                            this.userUuid && plug.autoDeclare({
                                object: this, //Vue对象或子对象，注意作用域
                                app: this.inApp,
                                user_uuid: this.userUuid //agent ID
                            });
                        }
                        setTimeout(() => {
                            this.isAllLoaded = true;
                            this.$root.blueLoadingParams.show = false;
                            CommonJS.lazyLoadImg();
                        }, 100);
                    } else {
                        this.isAllLoaded = true;
                        this.$root.blueLoadingParams.show = false;
                        CommonJS.lazyLoadImg();
                    }
                }
            }, err => {
                this.isAllLoaded = true;
                this.$root.blueLoadingParams.show = false;
            });
        },
        // 资讯详情接口
        getArticleInfo() {
            this.$http.get('/article/detail', {
                article_uuid: this.articleUuid
            }).then(res => {
                if (res && res.code === 0) {
                    this.detail = res.data;
                    // 设置分享信息
                    this.share.title = this.detail.share['title'];
                    this.share.thumbImage = this.detail.share['thumbImage'];
                    this.share.desc = this.detail.share['desc'];
                    this.share.url = window.location.origin + window.location.pathname + '?article_uuid=' + this.articleUuid + '&user_uuid=' + this.userUuid + '&target_type=' + this.share.target_type + '&one_way=' + this.userUuid;
                    // 微信分享初始化
                    CommonJS.initWX(this.share);
                    // 图片懒加载
                    if (/\<video/ig.test(this.detail.content) || /\<iframe/ig.test(this.detail.content)) {
                        this.detail.content = this.detail.content && this.detail.content.replace(/\<img src/ig, '<img data-emergence="hidden" data-src');
                        // 有视频时异步加载video-js.min.css和video.min.js
                        CommonJS.loadStyle('https://static.iberhk.com/res/css/video-js.min.css');
                        CommonJS.loadScript('https://static.iberhk.com/res/js/video.min.js', () => { });
                    } else {
                        this.detail.content = this.detail.content && this.detail.content.replace(/ src/ig, ' data-emergence="hidden" data-src');
                    }
                    // 处理标签
                    if (this.detail.tags) {
                        let tags = this.detail && this.detail.tags && this.detail.tags.split(',');
                        // 去除空白标签
                        this.detail.tags = [];
                        tags.forEach((item, index) => {
                            item && this.detail.tags.push(item);
                        });
                    }
                    // 小程序内隐藏点赞
                    (window.platform !== 7) && (this.showLikeBtn = true);
                    // 初始化完给小程序发postMesssage传递分享信息
                    const _this = this;
                    (window.__wxjs_environment == "miniprogram" || (window.platform === 7) || /wechatdevtools/.test(navigator.userAgent.toLowerCase())) && wx.ready(function () {
                        wx.miniProgram.postMessage({
                            data: {
                                title: _this.share['title'],
                                desc: _this.share['desc'],
                                path: '/pages/article/detail?article_uuid=' + _this.articleUuid + '&scene=' + _this.userUuid + '&one_way=' + _this.$route.query['one_way'] + ',' + _this.rootUserInfo['c_user_uuid'],
                                imageUrl: _this.share.thumbImage
                            }
                        });
                    });
                } else if (res && res.code === 1000) {
                    window.location.href = window.baseUrl + '/error/notfound';
                }
                this.bindPreViewImage();
                CommonJS.lazyLoadImg();
            }, err => {
                // window.location.href = window.baseUrl + '/error/404';
            }).finally(() => {
                if (this.inApp) {
                    this.isAllLoaded = true
                    this.$root.blueLoadingParams.show = false;
                }
                this.isDetailLoaded = true;
            });
        },
        // 资讯相关分析数据接口
        getAiAnalyzeInfo() {
            this.$http.get('/article/get-article-info-other', {
                article_uuid: this.articleUuid,
                c_user_uuid: this.rootUserInfo['c_user_uuid'],
                platform: window.platform
            }).then(res => {
                this.isPro = (res.extra && res.extra.is_pro);
                if (res && res.code === 0) {
                    this.analyze = res.data;
                    this.analyze.share_list = this.analyze.share_list && this.analyze.share_list.slice(0, 3);
                    this.analyze.card.messageHtml = this.analyze.card['message'] && this.analyze.card.message.replace(/\n/ig, '<br>');
                    this.$forceUpdate();
                }
                this.isDetailOtherLoaded = true;
            }, err => {
                this.isDetailOtherLoaded = true;
            });
        },
        // 刷新资讯相关分析数据接口
        reloadArticleInfoOther() {
            const _this = this;
            window.reloadArticleInfoOther = function () {
                _this.getAiAnalyzeInfo();
            }
        },
        // app内跳转发表感想和h5跳转咨询顾问
        openAppWritePage() {
            if (this.inApp) {
                this.appFn.commonFn('writePage', {
                    message: this.analyze['card'] && this.analyze['card']['message'] ? this.analyze['card']['message'] : '',
                    article_uuid: this.articleUuid
                });
            } else {
                plug.authAddress({
                    object: this, //Vue对象或子对象，注意作用域
                    user_uuid: this.userUuid,
                    answer_uuid: this.articleUuid,
                    from_type: this.$root.fromType
                });
            }
        },
        goArticleDetail(article_uuid, in_app) {
            // 小程序内跳转
            const _this = this;
            if (window.__wxjs_environment == "miniprogram" || (window.platform === 7) || /wechatdevtools/.test(navigator.userAgent.toLowerCase())) {
                wx.miniProgram.navigateTo({
                    url: '/pages/article/detail?article_uuid=' + article_uuid + '&scene=' + _this.userUuid
                });
            } else {
                window.location.href = window.baseUrl + '/article/detail?article_uuid=' + article_uuid + '&user_uuid=' + this.userUuid + '&in_app=' + in_app + '&auth=' + window.auth + '&card=' + this.card + '&moreShare=' + this.moreShare;
            }
        },
        goAppArticleDetail(article_uuid) {
            this.appFn.commonFn('openArticle', {
                article_uuid: article_uuid
            });
        },
        getAgentInfo(data) {
            this.bottomAgentInfo = data;
            this.$forceUpdate();
        },
        goAgentPage() {
            !this.inApp && plug.addrDeclare({
                object: this, // Vue对象或子对象，注意作用域
                app: this.inApp,
                page: this.bottomAgentInfo.home_page_url, // 申报地址成功后跳转URL
                user_uuid: this.userUuid // agent ID
            });
        },
        // 提供给app更新评论
        updateComment() {
            const _this = this;
            window.reloadData = function () {
                _this.getAiAnalyzeInfo();
            }
        },
        // 绑定点击图片预览图片
        bindPreViewImage() {
            const _this = this;
            setTimeout(() => {
                const imgs = document.querySelectorAll('.richText img');
                for (let i = 0; i < imgs.length; i++) {
                    let imgsParent = imgs[i].parentNode;
                    let imgsParentParent = imgsParent.parentNode;
                    if (((imgsParent.localName !== 'a') && !imgsParent.href) && ((imgsParentParent.localName !== 'a') && !imgsParentParent.href)) {
                        imgs[i].onclick = function (event) {
                            _this.openAvatar(event.currentTarget.src);
                        }
                    }
                }
            }, 500);
        },
        // 预览图片
        openAvatar(url) {
            if (this.inApp) {
                plug.getAgentAlbum(url, 0);
                return;
            }
            if (plug.wx.platform) {
                plug.wxAlbum(url, 0);
                return;
            }
            this.comAARData.url = url;
            this.comAARData.layer = 1;
        },
        // 跳转动态
        goDynamic(type) {
            this.appFn.goPage(this.analyze[type]);
        },
        // 跳转圈子用户详情
        goFriendDetail(c_user_uuid) {
            let param = {
                is_sapp: false,
                sapp_uuid: '',
                page_type: 1,
                page_h5_title: '',
                page_url: "IBerRingModule_ProfilePage",
                page_params: {
                    c_user_uuid: c_user_uuid,
                }
            };
            this.appFn.goPage(param);
        },
        // 跳转医疗产品详情页
        goIberCareDetail() {
            const _this = this;
            window.goIberCareDetail = function (url, goodsId) {
                if (_this.inApp) {
                    if (goodsId) {
                        let pageParam = {};
                        // 2.4.0 版本iBer Care需更换新版本路径
                        if (CommonJS.compareVersion(window.apiHeaders['version'], '2.4.0')) {
                            pageParam = {
                                is_sapp: false,
                                sapp_uuid: '',
                                page_type: 1,
                                page_h5_title: '',
                                page_url: 'IBerCareModule_ProductDetailPage',
                                page_params: {
                                    care_product_uuid: goodsId, // 产品id
                                }
                            };
                        } else {
                            pageParam = {
                                is_sapp: false,
                                sapp_uuid: '',
                                page_type: 1,
                                page_h5_title: '',
                                page_url: 'iBerCareProductDetailPage',
                                page_params: {
                                    id: goodsId, // 产品id
                                }
                            };
                        }
                        _this.appFn.goPage(pageParam);
                    }
                } else {
                    url && (window.location.href = url + '?goodsId=' + goodsId + '&iberId=' + _this.userUuid);
                }
            }
        },
        // 资讯关联保险产品
        goRelateProduct() {
            if (this.isPro) {
                if (this.declare_article_product === 1) {
                    this.appFn.commonFn('showAlert', {
                        article_uuid: this.articleUuid
                    });
                } else {
                    let pageParam = {
                        is_sapp: false,// 是否是sapp
                        sapp_uuid: '',// sapp的uuid
                        page_type: 1,// 1:原生，2:h5
                        page_h5_title: '',// h5页面的标题
                        page_url: 'IBerSappModule_ProductSelectRelationPage',// page链接
                        page_params: {
                            source_uuid: this.articleUuid
                        },// page参数
                    };
                    this.appFn.goPage(pageParam);
                }
            } else {
                this.appFn.commonFn('userOverdue');
            }
        },
        // 跳转保险产品详情
        goProductDetail(item) {
            if (inApp) {
                let pageParam = {
                    is_sapp: false,// 是否是sapp
                    sapp_uuid: '',// sapp的uuid
                    page_type: 1,// 1:原生，2:h5
                    page_h5_title: '',// h5页面的标题
                    page_url: 'IBerSappModule_ProductDetailPage',// page链接
                    page_params: {
                        url: window.baseUrl + '/product/detail?product_uuid=' + item.uuid,
                        uuid: item.uuid
                    }, // page参数
                };
                this.appFn.goPage(pageParam);
            } else {
                let report = JSON.parse(JSON.stringify(this.share));
                report.is_ref = 1;
                window.$http.post('/behavior/view', report).finally(() => {
                    window.location.href = window.baseUrl + '/product/detail?product_uuid=' + item.uuid + '&user_uuid=' + this.userUuid + '&in_app=' + (this.inApp ? 1 : 0) + '&auth=' + window.auth + '&card=' + this.card + '&language=' + this.lang + (this.consult_url ? ('&consult_url=' + encodeURIComponent(this.consult_url)) : '');
                });;

            }
        },
        // 取消关联保险产品
        cancelRelateProduct() {
            if (this.isPro) {
                this.appFn.commonFn('cancelRelation', {
                    source_uuid: this.articleUuid,
                    target_uuid: this.analyze.relations[0].content[0].uuid,
                    article_uuid: this.articleUuid
                });
            } else {
                this.appFn.commonFn('userOverdue');
            }
        },
        // 智能提醒
        smartAlert() {
            if (this.analyze.todo_info['todo_uuid']) {
                this.appFn.commonFn('changeSmartAlert', {
                    article_uuid: this.articleUuid,
                    todo_uuid: this.analyze.todo_info['todo_uuid'],
                    remain_date: this.analyze.todo_info['remain_date']
                });
            } else {
                this.appFn.commonFn('smartAlert', {
                    article_uuid: this.articleUuid
                });
            }
        }
    }
}