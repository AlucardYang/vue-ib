// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { Toast } from 'mint-ui';
import plugin from "@/plugin.js";
//组件
import '@/assets/library/component.js';
// 公用过滤器
import '@/components/shared/filters.js';
// 封装ajax调用方法
import {
    get,
    post,
    put,
    deleteApi,
    ajax
} from '@/components/shared/service/apiService.js';

// C端用户调用逻辑
import wx from '@/components/shared/service/wx.js';
import bs from '@/components/shared/service/bs.js';
import fb from '@/components/shared/service/fb.js';
// 调用app公共方法
import appFnService from '@/components/shared/service/appFnService.js';
// 调用的公共方法
import FunctionJS from '@/components/shared/service/function.js';

/**
 * 全局参数定义
 */
// 全局增加http请求
window.$http = Vue.prototype.$http = {
    get: get,
    post: post,
    put: put,
    delete: deleteApi,

    ajax: ajax
}
// 全局的中间提示
Vue.$toast = Vue.prototype.$toast = Toast;
//公共函数
window.plug = Vue.prototype.plug = plugin;
// 关闭生产提示
Vue.config.productionTip = false;
// app公共方法
Vue.prototype.appFn = appFnService;
// 生成语言相关对象 勿删！
Vue.prototype.language = {};
window.lang = Vue.prototype.lang = 'zh-tw';
window.simply = Vue.prototype.simply = false;
// 生成agent的uuid 勿删！
window.userUuid = Vue.prototype.userUuid = (FunctionJS.getQueryParams('user_uuid') ? FunctionJS.getQueryParams('user_uuid') : '');
// 生成判断是否在app内 勿删！
window.inApp = Vue.prototype.inApp = (FunctionJS.getQueryParams('in_app') === '1');
// 生成判断是否有感想 勿删！
Vue.prototype.showComment = (FunctionJS.getQueryParams('comment') !== 'hide');
// agent卡片配置
window.card = Vue.prototype.card = FunctionJS.getQueryParams('card') ? FunctionJS.getQueryParams('card') : 'full';
// 微信授权参数 勿删！
window.auth = FunctionJS.getQueryParams('auth') ? FunctionJS.getQueryParams('auth') : 'force';
// 生成来源字段
window.fromType = Vue.prototype.fromType = '11';

// 根据不同平台获取对应的用户信息
window.rootUserInfo = Vue.prototype.rootUserInfo = {};
// ****** 获取用户信息页面内只能调用一遍，调用多次不能正常返回，请注意！！！！ ***** //
Vue.prototype.getRootUserInfo = function (firstReportParam) {
    const promise = new Promise((resolve, reject) => {
        if (window.__wxjs_environment == "miniprogram" || (window.platform === 7)) {
            // 小程序内嵌套H5页面传回用户信息，由路径中直接获取
            window.rootUserInfo = Vue.prototype.rootUserInfo = JSON.parse(decodeURIComponent(FunctionJS.getQueryParams('user_info')));
            resolve(window.rootUserInfo);
            return;
        }

        if (FunctionJS.getCookie('c_user_uuid_info')) {
            // php已设置登录态时
            window.rootUserInfo = Vue.prototype.rootUserInfo = JSON.parse(FunctionJS.getCookie('c_user_uuid_info'));
            resolve(window.rootUserInfo);
        } else {
            // 获取weChat用户信息
            wx.getUserInfo(firstReportParam).then(res => {
                console.log('用户平台：' + 'wx');
                //console.log(res);
                window.rootUserInfo = Vue.prototype.rootUserInfo = res ? res : {};
                resolve(res);
            });
            // 获取facebook用户信息
            fb.getUserInfo(firstReportParam).then(res => {
                console.log('用户平台：' + 'fb');
                //console.log(res);
                window.rootUserInfo = Vue.prototype.rootUserInfo = res ? res : {};
                resolve(res);
            });
            // 获取普通浏览器用户信息
            bs.getUserInfo(firstReportParam).then(res => {
                console.log('用户平台：' + 'bs');
                //console.log(res);
                window.rootUserInfo = Vue.prototype.rootUserInfo = res ? res : {};
                resolve(res);
            }, err => {
                reject(err);
            });
        }
    });
    promise.catch((error) => {
        console.log(error);
    });
    return promise;
}

// 生成短链接的路由表 
const shortRoutes = {};
// 生成短链接的路由标题
const routeMetas = {};
router.options.routes.forEach((route, index) => {
    shortRoutes[route['path']] = route['component'];
    routeMetas[route['path']] = route['meta'];
    if (route['children']) {
        route['children'].forEach((childRoute, index1) => {
            shortRoutes[route['path'] + '/' + childRoute['path']] = childRoute['component'];
            routeMetas[route['path'] + '/' + childRoute['path']] = childRoute['meta'];
        });
    }
});

// 当前短链接或者短路径
let shortPath = '';
// 真实路径
let realShortPath = '';



/**
 * 公共方法
 */
// 增加fundebug监控
function initFundebug() {
    const fundebug = require("fundebug-javascript");
    fundebug.apikey = "6a5b6059848c4088da80cf400a29babbd48e5e720988ba05ab933577bace8f49";
    // 记录HTTP请求的body参数
    fundebug.setHttpBody = true;
    // 不需要监控WebSocket连接错误
    fundebug.silentWebsocket = true;
    // 不需要监控资源加载错误
    fundebug.silentResource = true;
    // fundebug过滤 unhandledrejection、Script error、WeixinJSBridge is not defined，还有状态为0的请求的错误报警
    fundebug.filters = [{
        type: /^unhandledrejection$/
    }, {
        message: /Script error/
    }, {
        message: /WeixinJSBridge is not defined/
    }, {
        req: {
            method: /^GET$/
        },
        res: {
            status: /^0$/
        }
    }, {
        req: {
            method: /^POST$/
        },
        res: {
            status: /^0$/
        }
    }];

    function formatComponentName(vm) {
        if (vm.$root === vm) return 'root';
        var name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
        return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');
    }
    Vue.config.errorHandler = function (err, vm, info) {
        var componentName = formatComponentName(vm);
        var propsData = vm.$options && vm.$options.propsData;
        fundebug.notifyError(err, {
            metaData: {
                componentName: componentName,
                propsData: propsData,
                info: info
            }
        });
    };
    // 定义域名环境名称
    const envMap = FunctionJS.getEnvironments();
    // 定义当前环境
    fundebug.releasestage = (envMap[location.hostname] ? envMap[location.hostname] : 'development');
    // 开发环境关掉监控
    fundebug.silentDev = true;
    // 只开放线上环境监控
    fundebug.silent = ((envMap[location.hostname] === 'production') ? false : true);
}

// 上报的全局参数
function reportGlobalParam() {
    const ua = navigator.userAgent.toLowerCase();
    // 唯一标识
    window.markUuid = ((window.iBer && window.iBer.mark) ? window.iBer.mark : FunctionJS.guid());
    // 用户链
    window.one_way = FunctionJS.getQueryParams('one_way') ? FunctionJS.getQueryParams('one_way') : window.userUuid;
    // 上报平台
    // -1旧数据 1:微信, 2:facebook, 3:qq, 4:tw, 5:whatsApp, 6:weibo, 7:小程序, 8:浏览器
    window.platform = ((/micromessenger/.test(ua) && !/miniprogram/.test(ua)) ? 1 : (/fb.{2}\//.test(ua) ? 2 : (/ qq/.test(ua) ? 3 : (/twitter/.test(ua) ? 4 : (/whatsapp/.test(ua) ? 5 : (/weibo/.test(ua) ? 6 : (/miniprogram/.test(ua) ? 7 : 8)))))));
    if (window.__wxjs_environment == "miniprogram") {
        window.platform = 7;
    }
}

// 处理短链接，添加动态路由
function dealWithShortUrl() {
    // php存的短链接路由测试
    // window.iBer = {
    //     "shortParams": {
    //         code: 0,
    //         data: {
    //             "route": "/article/detail",
    //             "article_uuid": "4dc8c942d9b911e8929948d53963e249",
    //             "auth": "force",
    //             "card": "full",
    //             "language": "auto",
    //             "one_way": "fd20092d9487516103b9f3978ca6bd5f",
    //             "target_type": "11",
    //             "user_uuid": "fd20092d9487516103b9f3978ca6bd5f"
    //         }
    //     }
    // }
    // 匹配当前短链接或者短路径
    const locationHref = window.location.pathname;
    shortPath = locationHref.replace(/\/v2\/(page\/)?/, '/');
    window.shortPath = shortPath;
    if (window.iBer && window.iBer.shortParams && window.iBer.shortParams.data && window.iBer.shortParams.data.user_uuid) {
        initGobalParam(window.iBer.shortParams);
    } else {
        // 根据当前短链接获取实际参数
        if (shortPath && shortPath !== '/' && !shortRoutes[shortPath]) {
            window.$http.get('/short-url/get-short-url-param', {
                short_url: shortPath.slice(1)
            }).then(res => {
                initGobalParam(res);
            }, err => {
                newVue();
            });
        } else {
            // 上报全局参数
            reportGlobalParam();
            newVue();
        }
    }
}

// 初始化全局参数
function initGobalParam(res) {
    let user_uuid = FunctionJS.getQueryParams('user_uuid');
    let in_app = FunctionJS.getQueryParams('in_app');
    let comment = FunctionJS.getQueryParams('comment');
    let auth = FunctionJS.getQueryParams('auth') ? FunctionJS.getQueryParams('auth') : (res.data['auth'] ? res.data['auth'] : 'force');
    // 获取当前分享的agent的uuid
    window.userUuid = Vue.prototype.userUuid = (user_uuid ? user_uuid : ((res && res.data && res.data['user_uuid']) ? res.data['user_uuid'] : ''));
    // 是否在app内
    window.inApp = Vue.prototype.inApp = (in_app ? in_app === '1' : (res && res.data ? (res.data['in_app'] === '1') : false));
    // 生成判断是否有感想 勿删！
    Vue.prototype.showComment = (comment ? comment !== 'hide' : (res && res.data ? (res.data['comment'] !== 'hide') : true));
    // agent卡片配置
    window.card = Vue.prototype.card = FunctionJS.getQueryParams('card') ? FunctionJS.getQueryParams('card') : (res.data['card'] ? res.data['card'] : 'full');
    // 微信授权参数
    window.auth = Vue.prototype.auth = auth;
    // 上报全局参数
    reportGlobalParam();
    newVue(res);
}

// 匹配对应路由
function getRoutesComponent(routeData) {
    let component = {};
    if (routeData) {
        if (routeData.code === 0) {
            component = shortRoutes[routeData.data['route']] || shortRoutes['/error/404'];
            // 返回的路由参数设为全局
            Vue.prototype.urlParams = routeData.data;
            window.urlParams = routeData.data;
        } else {
            component = shortRoutes['/error/404'];
        }
    } else {
        component = shortRoutes['/error/404'];
    }
    return component;
}

// 匹配对应路由标题
function getMeta(routeData) {
    let meta = {};
    if (routeData && routeData.code === 0) {
        meta = routeMetas[routeData.data['route']];
    }
    return meta;
}

// 生成动态路由
function createDynamicsRoute(routeData, router) {
    if (routeData && !shortRoutes[shortPath]) {
        router.addRoutes([{
            path: shortPath,
            name: 'DynamicPage',
            component: getRoutesComponent(routeData),
            meta: getMeta(routeData)
        }]);
        window.shortPath = realShortPath = (routeData.data && routeData.data.route);
    }
}

// 生成Vue对象
function newVue(routeData) {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        router,
        data: {
            name: "iBer",
            msgAlert: false,
            msgAlertData: {
                user_uuid: null,
                answer_uuid: null,
                from_type: null,
                language: null
            },
            msgNum: 0,

            pageLoading: { layer: 0, info: "" },
            progress: { layer: 0, info: "" },
            loading: { layer: 0, info: "" },

            back_top: "",
            blueLoadingParams: {
                show: false,
                info: ""
            },
            agentCardInfo: {
                show: false,
                slide: false
            },
            // 留言
            guestBook: {
                show: false,
                slide: false
            },
            fromType: '11',

            //启动：this.$root.consauth.layer = 1;
            consauth: {
                user_uuid: null, //String -----顾问代理Agent ID[res.data.user_uuid]
                answer_uuid: null, //String -----评测结果数据字段[res.data.answer_uuid] 
                code: null, //String -----区号[res.data.mobile_pre]
                mphone: null, //String -----手机号码[res.data.mobile]
                name: "consauth",
                layer: 0, //Number   
                language: null,
                mphone_auth: null, //1：已授权，不需要输入手机号    0：未授权，需要输入手机号
                anonymous: null //匿名：0 - 非匿名   1 - 匿名
            },

            // 终端判断
            isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1, // android终端
            isIOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端

            // 判断平台
            isWeiXin: /micromessenger/.test(navigator.userAgent.toLowerCase()), // 微信内
            isWeiXinTools: /wechatdevtools/.test(navigator.userAgent.toLowerCase()), // 微信开发者工具
            isMiniProgram: (window.__wxjs_environment == "miniprogram") && /micromessenger/.test(navigator.userAgent.toLowerCase()), // 微信小程序内
            isFb: /fb.{2}\//.test(navigator.userAgent.toLowerCase()), // facebook内
        },
        components: {
            App
        },
        template: '<App/>',
        beforeCreate() {
            // 生成动态路由
            createDynamicsRoute(routeData, this.$router);
        },
        watch: {
            '$route': function (to, from, next) {
                //初始值
                this.pageLoading.layer = 0;

                // 设置语言对应的title
                this.getLangTitle();

                //获取当前agent消息未读数
                let pathList = ["/consult"];
                let judgePath = false;
                for (let i = 0; i < pathList.length; i++) {
                    if (plug.href.match(pathList[i]) != null) {
                        judgePath = true;
                        break;
                    }
                }
                if (judgePath == true) {
                    this.msgAlert = false;
                }
            }
        },
        created() {
            // 获取当前语言  
            this.getLanguage();
            // app从H5获取参数公共规范方法
            this.appFn.getParamFromH5();

            Vue.prototype.fontSize = document.documentElement.style.fontSize;
            Vue.prototype.font_size = window.font_size;

            //声明返回顶部图片路径
            let hostUrl = "https://static.iberhk.com/v2/web/images/agent/";
            this.back_top = hostUrl + (this.simply ? "back_top.png" : "back_top_trad.png");
        },
        methods: {
            /*
             *@功能：获取当前agent消息未读数
             this.$root.getAgentMsg();  
             *@
             */
            getAgentMsg: function () {
                this.msgAlertData.user_uuid = plug.getAgentID(this.urlParams);
                this.msgAlertData.from_type = this.$root.fromType;
                this.msgAlertData.c_user_uuid = this.rootUserInfo['c_user_uuid'];
                ajax({
                    path: "message/unread-message-count",
                    type: "post",
                    data: {
                        user_uuid: plug.getAgentID(this.urlParams),
                        c_user_uuid: this.rootUserInfo['c_user_uuid']
                    },
                    toast: false
                }).then((res) => {
                    //业务模型
                    //获取当前agent消息未读数

                    //当前路径为“资讯”页面，则隐藏消息框
                    let pathList = ["/consult"];
                    let judgePath = false;
                    for (let i = 0; i < pathList.length; i++) {
                        if (plug.href.match(pathList[i]) != null) {
                            judgePath = true;
                            break;
                        }
                    }

                    if (res.data.count > 0 && judgePath != true) {
                        this.msgNum = res.data.count;
                        //非APP显示消息框
                        if (!this.inApp) {
                            this.msgAlert = true;
                        }
                        if (!plug.valueValid(res.data.from_id)) {
                            this.msgAlertData.answer_uuid = "undefined";
                        } else {
                            this.msgAlertData.answer_uuid = res.data.from_id;
                        }
                    }
                });
            },
            /**
             * 获取当前语言
             */
            getLanguage() {
                const language = {
                    currentLang: 'zh-tw',
                    currentUrl: ''
                };
                // 当前浏览器语言
                let navLang = navigator.language.toLowerCase();
                // 当前路径携带语言参数
                let queryLang = this.$router.currentRoute.query['language'] || FunctionJS.getQueryParams('language');
                queryLang && (queryLang = queryLang.toLowerCase());
                // 如果路径返回带language参数优先，没有返回根据当前浏览器语言设置当前显示语言
                if ((queryLang && /cn/.test(queryLang)) || (!queryLang && /cn/.test(navLang))) {
                    language.currentLang = 'zh-cn';
                } else {
                    language.currentLang = 'zh-tw';
                }
                // 如果短链接返回language参数
                this['urlParams'] && this['urlParams']['language'] && (language.currentLang = this['urlParams']['language']);
                (this['urlParams'] && this['urlParams']['language'] === 'auto') && (language.currentLang = navLang);
                // 优先取路径参数中的值
                queryLang && (language.currentLang = queryLang.toLowerCase());
                queryLang && (queryLang === 'auto') && (language.currentLang = navLang);
                language.currentUrl = realShortPath || shortPath || this.$router.currentRoute.path;
                // 如果设置不是中文简繁体，默认为繁体
                if (!(/cn/ig.test(language.currentLang) || /tw/ig.test(language.currentLang))) {
                    language.currentLang = 'zh-tw';
                }
                Vue.prototype.language = language;
                // 语言简称 'zh-cn'或者'zh-tw'
                window.lang = Vue.prototype.lang = language.currentLang;
                // 是否中文简体
                window.simply = Vue.prototype.simply = /cn/ig.test(language.currentLang);
            },
            /**
             * 设置语言对应的title
             */
            getLangTitle() {
                // 生成来源字段
                if (this.$route.meta['from_type']) {
                    window.fromType = this.$root.fromType = this.$route.meta['from_type'];
                    window.greetType = this.$root.greetType = this.$route.meta['greet_type'] ? this.$route.meta['greet_type'] : null;
                }
                // 生成浏览器title
                if (this.$route.meta['zh_cn_title'] || this.$route.meta['zh_tw_title']) {
                    if (/cn/ig.test(this.language['currentLang'])) {
                        document.title = this.$route.meta['zh_cn_title'];
                    } else {
                        document.title = this.$route.meta['zh_tw_title'];
                    }
                }
            }
        }
    })
}


/**
 * 方法调用
 */
// 引入友盟统计
FunctionJS.youmengStat();
// 初始化微信JSSDK
FunctionJS.initWXJSSDK();
// 增加fundebug监控
initFundebug();
// 先判短路由再生成Vue
dealWithShortUrl();