import axios from 'axios';
import FunctionJS from '@/components/shared/service/function.js';

// facebook用户信息(待测试)
// 返回用户信息结构： 
// {
//     "c_user_uuid": "17e09c37fa237d8ca16b51bbbbce7ce7",
//     "openid": "166516517588291",
//     "username": "aaaa",
//     "avatar": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=166516517588292&height=50&width=50&ext=1541572661&hash=AeTZKrwLssaTtSbX"
// }

export default {
    config: {
        client_id: '',
        state: '',
        response_type: '',
        sdk: '',
        scope: '',
        isFb: /fb.{2}\//.test(navigator.userAgent.toLowerCase()),
        url: '',
        userKey: 'IBER_FB_USER_INFO-' + window.userUuid,
        userInfo: JSON.parse(localStorage.getItem('IBER_FB_USER_INFO-' + window.userUuid))
    },
    init(firstReportParam) {
        const _this = this;
        let back_url = window.location.href + '?user_uuid=' + window.userUuid + '&source_id=' + window.fromType + '&one_way=' + window.one_way + '&mark=' + window.markUuid + '&target_type=' + window.fromType + '&router=' + window.location.pathname;
        for (let key in firstReportParam) {
            back_url = back_url + '&' + key + '=' + firstReportParam[key];
        }
        axios({
            method: 'get',
            url: '/c-user/get-facebook-login-url',
            params: {
                back_url: back_url
            },
        }).then((res) => {
            if (res.data && res.data.code === 0) {
                _this.config.url = res.data.data.url;
                window.location.href = res.data.data.url;
            } else {
                Toast({
                    message: res.data.msg || '获取facebook用户信息失败'
                });
            }
        });
    },
    getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    getUser(code, state) {
        const promise = new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: '/c-user/face-book-oauth-user',
                params: {
                    code: code,
                    state: state,
                    user_uuid: window.userUuid
                },
            }).then((res) => {
                let curTime = new Date().getTime();
                if (res.data && res.data.code === 0) {
                    localStorage.setItem('IBER_FB_USER_INFO', JSON.stringify({
                        data: res.data.data,
                        time: curTime
                    }));
                    resolve(res.data.data);
                } else {
                    Toast({
                        message: res.data.msg
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
        this.config.userKey = 'IBER_FB_USER_INFO-' + window.userUuid;
        this.config.userInfo = JSON.parse(localStorage.getItem(this.config.userKey));
        const promise = new Promise((resolve, reject) => {
            if (this.config.isFb) {
                // facebook存的用户信息有效期是3天
                if (!this.config.userInfo || !this.config.userInfo['time'] || (new Date().getTime() - this.config.userInfo['time'] - (1000 * 60 * 60 * 24 * 3) > 0)) {
                    // if (this.getQueryString('code') && this.getQueryString('state')) {
                    //     this.getUser(this.getQueryString('code'), this.getQueryString('state')).then(res => {
                    //         resolve(JSON.parse(localStorage.getItem('IBER_FB_USER_INFO'))['data']);
                    //     });
                    // } else {
                    //     this.init();
                    // }
                    if (this.getQueryString('c_user_uuid') && FunctionJS.getQueryParams('openid') && FunctionJS.getQueryParams('username') && FunctionJS.getQueryParams('username')) {
                        let curTime = new Date().getTime();
                        localStorage.setItem(this.config.userKey, JSON.stringify({
                            data: {
                                c_user_uuid: FunctionJS.getQueryParams('c_user_uuid'),
                                openid: FunctionJS.getQueryParams('openid'),
                                username: FunctionJS.getQueryParams('username'),
                                avatar: FunctionJS.getQueryParams('avatar')
                            },
                            time: curTime
                        }));
                        resolve(JSON.parse(localStorage.getItem(this.config.userKey))['data']);
                    } else {
                        this.init(firstReportParam);
                    }
                } else {
                    resolve(JSON.parse(localStorage.getItem(this.config.userKey))['data']);
                }
            }
        });
        promise.catch((error) => {
            console.log(error);
        });
        return promise;
    }
};