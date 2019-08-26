import axios from 'axios';
import bs from './bs.js';
import FunctionJS from '@/components/shared/service/function.js';

import {
    Toast
} from 'mint-ui';

// wechat用户信息
// 返回用户信息结构： 
// {
//     "c_user_uuid": "6d523bee5cf4189e4710c1234aa07e969",
//     "avatar": "http://thirdwx.qlogo.cn/VrghZRxG",
//     "openid": "oKporoYbICGTnNiXvLcGWGG9kJg",
//     "unionid": "odPiHOr8kHVB4BWYQMUooSnPspNk",
//     "nickname": "aaaa",
//     "sex": 1,
//     "language": "zh_CN",
//     "city": "深圳",
//     "province": "广东",
//     "country": "中国",
//     "privilege": []
// }

export default {
    config: {
        app_id: '',
        scope: 'snsapi_userinfo',
        isWeiXin: /micromessenger/.test(navigator.userAgent.toLowerCase()),
        isWeiXinTools: /wechatdevtools/.test(navigator.userAgent.toLowerCase()),
        url: '',
        userKey: 'IBER_WX_USER_INFO-' + window.userUuid,
        userInfo: JSON.parse(localStorage.getItem('IBER_WX_USER_INFO-' + window.userUuid)),
        isLoaded: true
    },
    init() {
        const _this = this;
        // 多个测试环境共用一个公众号
        const environments = FunctionJS.getEnvironments();
        if (environments[location.hostname] === 'test') {
            this.closeWindow();
            // 初始化时给code设置时间戳
            let link = this.setWechatAuthCodeTime();
            // 测试公众号绑定的域名是：https://testmp.goodiber.com
            window.location.href = 'https://testmp.goodiber.com/v2/api/wechat/oauth?url=' + encodeURIComponent(link);
        } else {
            axios({
                method: 'get',
                url: '/c-user/get-wechat-outh-param',
                params: {},
            }).then((res) => {
                if (res.data && res.data.code === 0) {
                    _this.config.app_id = res.data['data']['app-id'];
                    _this.config.scope = res.data['data']['scope'];
                    // 初始化时给code设置时间戳
                    let link = _this.setWechatAuthCodeTime();
                    // 微信跳转链接
                    _this.config.url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + _this.config.app_id + '&redirect_uri=' + encodeURIComponent(link) + '&response_type=code&scope=' + _this.config.scope + '&state=123#wechat_redirect';
                    this.closeWindow();
                    window.location.href = _this.config.url;
                }
            });
        }
    },
    // 初始化时给code设置时间戳
    setWechatAuthCodeTime() {
        // 初始化时给code设置时间戳
        localStorage.setItem('wechat_auth_code_time', new Date().getTime());
        // 当前的链接去除code和state
        let link = window.location.href;
        let codeReg = new RegExp((/&code=/.test(link) ? '&code=' : 'code=') + this.getQueryString('code'), 'ig');
        let stateReg = new RegExp((/&state=/.test(link) ? '&state=' : 'state=') + this.getQueryString('state'), 'ig');
        link = link.replace(codeReg, '').replace(stateReg, '');
        if (link.charAt(link.length - 1) === '?') {
            link = link.replace(/\?/, '');
        }
        console.log(link);
        return link;
    },
    // 5秒未授权自动关闭微信
    closeWindow() {
        const _this = this;
        setTimeout(() => {
            if (!_this.config.userInfo || !_this.config.userInfo['data'] || !(_this.config.userInfo['data'] && _this.config.userInfo['data']['openid'])) {
                Toast({
                    message: '未授權將關閉頁面'
                });
                setTimeout(() => {
                    const wx = require('weixin-js-sdk');
                    wx.closeWindow();
                }, 2000);
            }
        }, 5000);
    },
    getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    getUser(code, firstReportParam) {
        const promise = new Promise((resolve, reject) => {
            let params = {
                code: code,
                // -1旧数据 1:微信, 2:facebook, 3:qq, 4:tw, 5:whatsApp, 6:weibo, 7:小程序, 8:浏览器
                platform: window.platform,
                user_uuid: window.userUuid,
                source_id: window.fromType,
                one_way: window.one_way,
                mark: window.markUuid,
                target_type: window.fromType,
                router: window.location.pathname,
            };
            for (let key in firstReportParam) {
                params[key] = firstReportParam[key];
            }
            axios({
                method: 'get',
                url: '/c-user/get-wechat-oauth-user',
                params: params,
            }).then((res) => {
                let curTime = new Date().getTime();
                if (res.data && res.data.code === 0) {
                    localStorage.setItem(this.config.userKey, JSON.stringify({
                        data: res.data.data,
                        time: curTime
                    }));
                    resolve(res.data.data);
                } else {
                    Toast({
                        message: res.data.msg || '获取微信用户信息失败'
                    });
                }
            });
        });
        promise.catch((error) => {
            console.log(error);
        });
        return promise;
    },
    getUserInfo(firstReportParam) {
        this.config.userKey = 'IBER_WX_USER_INFO-' + window.userUuid;
        this.config.userInfo = JSON.parse(localStorage.getItem(this.config.userKey));
        const promise = new Promise((resolve, reject) => {
            if (this.config.isWeiXin || this.config.isWeiXinTools) {
                if (window.__wxjs_environment == "miniprogram" || (window.platform === 7)) {
                    // 小程序内嵌套H5页面传回用户信息
                    let curTime = new Date().getTime();
                    let userInfo = JSON.parse(decodeURIComponent(this.getQueryString('user_info')));
                    console.log(userInfo);
                    localStorage.setItem(this.config.userKey, JSON.stringify({
                        data: userInfo,
                        time: curTime
                    }));
                    resolve(userInfo);
                } else {
                    console.log('微信内');
                    if (window.auth !== 'force') {
                        if (this.config.userInfo && this.config.userInfo['data'] && this.config.userInfo['data']['openid']) {
                            console.log('之前授过权');
                            resolve(JSON.parse(localStorage.getItem(this.config.userKey))['data']);
                            // 显示微信右上角按钮
                            window.wx.showOptionMenu();
                        } else {
                            console.log('之前未过权');
                            // 获取普通浏览器用户信息
                            bs.getUserInfo(firstReportParam, true).then(res => {
                                resolve(res);
                                // 显示微信右上角按钮
                                window.wx.showOptionMenu();
                            });
                        }
                    } else {
                        // 微信存的用户信息有效期是3天
                        if (!this.config.userInfo || !this.config.userInfo['time'] || (new Date().getTime() - this.config.userInfo['time'] - (1000 * 60 * 60 * 24 * 3) > 0)) {
                            if (this.config.isLoaded) {
                                if (this.getQueryString('code')) {
                                    this.config.isLoaded = false;
                                    console.log('调取获取用户信息接口');
                                    // code与当前存的不同时判断请求获取code的时间
                                    let wechat_auth_code = localStorage.getItem('wechat_auth_code');
                                    let wechat_auth_code_time = localStorage.getItem('wechat_auth_code_time');
                                    if ((this.getQueryString('code') !== wechat_auth_code) && (new Date().getTime() - wechat_auth_code_time <= 1000 * 30)) {
                                        // code存入缓存中
                                        localStorage.setItem('wechat_auth_code', this.getQueryString('code'));
                                        this.getUser(this.getQueryString('code'), firstReportParam).then(res => {
                                            this.config.isLoaded = true;
                                            resolve(JSON.parse(localStorage.getItem(this.config.userKey))['data']);
                                            // 显示微信右上角按钮
                                            window.wx.showOptionMenu();
                                        });
                                    } else {
                                        console.log('您还未授权，先授权');
                                        this.init();
                                    }
                                } else {
                                    console.log('您还未授权，先授权');
                                    this.init();
                                }
                            }
                        } else {
                            console.log('您已经授过权了');
                            resolve(JSON.parse(localStorage.getItem(this.config.userKey))['data']);
                            // 显示微信右上角按钮
                            window.wx.showOptionMenu();
                        }
                    }
                }
            }
        });
        promise.catch((error) => {
            console.log(error);
        });
        return promise;
    }
};