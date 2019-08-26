import axios from 'axios';

import {
    Toast
} from 'mint-ui';

// 普通浏览器用户信息
// 返回用户信息结构： 
// {
//     "c_user_uuid": "6d523bee5cf4189e4710c234aa07e969",
//     "cookie_id": "6d523bee5cf4189e4710c234aa07e969",
//     "username": "VrghZRxG",
//     "avatar": null
// }

export default {
    config: {
        isWeiXin: /micromessenger/.test(navigator.userAgent.toLowerCase()),
        isWeiXinTools: /wechatdevtools/.test(navigator.userAgent.toLowerCase()),
        isFb: /fb.{2}\//.test(navigator.userAgent.toLowerCase()),
        userKey: 'IBER_BS_USER_INFO-' + window.userUuid,
        userInfo: JSON.parse(localStorage.getItem('IBER_BS_USER_INFO-' + window.userUuid))
    },
    getUser(firstReportParam) {
        const promise = new Promise((resolve, reject) => {
            let params = {
                // -1旧数据 1:微信, 2:facebook, 3:qq, 4:tw, 5:whatsApp, 6:weibo, 7:小程序, 8:浏览器
                platform: window.platform,
                user_uuid: window.userUuid,
                source_id: window.fromType,
                one_way: window.one_way,
                mark: window.markUuid,
                target_type: window.fromType,
                router: window.location.pathname,
                in_app: window.inApp ? 1 : 0
            };
            for (let key in firstReportParam) {
                params[key] = firstReportParam[key];
            }
            // params = {...params, ...firstReportParam };
            console.log(params);
            axios({
                method: 'get',
                url: '/c-user/get-unknown-user',
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
                        message: res.data.msg || '获取匿名用户信息失败'
                    });
                    reject(res.data);
                }
            });
        });
        promise.catch((error) => {
            console.log(error);
        });
        return promise;
    },
    getUserInfo(firstReportParam, isFree) {
        // isFree为微信走的不强制授权参数
        this.config.userKey = 'IBER_BS_USER_INFO-' + window.userUuid;
        this.config.userInfo = JSON.parse(localStorage.getItem(this.config.userKey));
        const promise = new Promise((resolve, reject) => {
            if ((!this.config.isWeiXin && !this.config.isFb && !this.config.isWeiXinTools) || isFree) {
                // 普通浏览器存的用户信息有效期是1年
                if (!this.config.userInfo || !this.config.userInfo['time'] || (new Date().getTime() - this.config.userInfo['time'] - (1000 * 60 * 60 * 24 * 365) > 0)) {
                    this.getUser(firstReportParam).then(res => {
                        let userData = JSON.parse(localStorage.getItem(this.config.userKey))['data'];
                        resolve(userData);
                    }, err => {
                        reject(err);
                    });
                } else {
                    let userData = JSON.parse(localStorage.getItem(this.config.userKey))['data'];
                    resolve(userData);
                }
            }
        });
        promise.catch((error) => {
            console.log(error);
        });
        return promise;
    }
};