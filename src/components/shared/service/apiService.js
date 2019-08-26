import axios from 'axios';

import {
    Toast
} from 'mint-ui';

import FunctionJS from '@/components/shared/service/function.js';

let headers = {};

// headers的app编码格式：encodeURIComponent(FunctionJS.encrypt(JSON.stringify(obj)))
if (FunctionJS.getQueryParams('in_app') === '1' && FunctionJS.getQueryParams('headers')) {
    headers = JSON.parse(FunctionJS.decrypt(decodeURIComponent(FunctionJS.getQueryParams('headers'))));
} else {
    headers = {};
}

// 后台判断为ajax请求
headers['X-Requested-With'] = 'XMLHttpRequest';
window.apiHeaders = headers;

// 各环境域名
const locationHosts = FunctionJS.getApiHosts();


// 请求配置 
// 本地配置测试1环境：https://dev1mp.goodiber.com/v2/api  
// 本地配置测试2环境：https://dev2mp.goodiber.com/v2/api
// 本地配置测试总环境（修复紧急bug）：https://testmp.goodiber.com/v2/api
let baseURL = (locationHosts[location.hostname] ? locationHosts[location.hostname] : 'https://dev1mp.goodiber.com/v2/api');
window.apiBaseURL = baseURL;

// 兼容v2/page开头
if (window.baseHost === 'v2/page') {
    baseURL = window.location.origin + '/v2';
}

axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 15000;

// mock的前缀域名
window.mockUrl = 'https://mockapi.eolinker.com/ZW9V7Yc3553fbf24132495ad14b3c090956d321c8c68490';

axios.interceptors.request.use(config => {
    return config;
}, err => {
    Toast({
        message: '請求超時!'
    });
    return Promise.reject(err);
});

/*
 *@临时注释
 *@暂无法满足业务逻辑
 *@若需启用，先取消全局性，可局部调用，避免影响其他AJAX调用逻辑
 *
axios.interceptors.response.use(data => {
    if (data.status && data.status == 200 && data.data.code !== 1308 && data.data.code !== 0) {
      Toast({message: data.data.msg});
    }
    return data;
}, err => {
  debugger
    if (err.response && (err.response.status == 504 || err.response.status == 404)) {
        Toast({
            message: '無法找到服務器'
        });
    } else if (err.response && (err.response.status == 403)) {
        Toast({
            message: '權限不足，請聯繫管理員'
        });
    } else if (err.response && (err.response.status == 400)) {
        Toast({
            message: '請求無效'
        });
    } else {
        Toast({
            message: '系統繁忙'
        });
    }
    return Promise.reject(err);
});
 *
 **/

// 请求成功后台返回错误信息提示
const msgToast = function (res) {
    if (res.status && res.status == 200 && res.data.code !== 1308 && res.data.code !== 0) {
        // Toast({
        //     message: res.data.msg
        // });
    }
}

//  后台请求错误、或者网络不通提示
const errToast = function (err) {
    let busyTip = (window.simply ? "系统繁忙，请稍后再试" : "系統繁忙，請稍後再試"),
        networkTip = (window.simply ? "网络环境较差，请稍后再试" : "網絡環境較差，請稍後再試"),
        errTip = '';
    if (err.response) {
        let status = err.response.status;
        if (status >= 500) {
            errTip = busyTip;
        } else if (status >= 400) {
            errTip = networkTip;
        }
    } else {
        errTip = networkTip;
    }
    // Toast({
    //     message: errTip
    // });
}

const get = (url, params, inHeaders, baseUrl) => {
    // header默认设置语言
    headers.language = window.lang;
    let newParams = params ? params : {};
    // param默认设置user_uuid
    window.userUuid && (newParams.user_uuid = window.userUuid);
    for (let key in inHeaders) {
        headers[key] = inHeaders[key];
    }
    const promise = new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: (baseUrl ? baseUrl : '') + url,
            params: newParams,
            headers: headers,
        }).then((res) => {
            msgToast(res);
            res && resolve(res.data);
        }).catch((err) => {
            errToast(err);
            err && reject(err);
        });
    });
    promise.catch((error) => {
        console.log(error);
    });
    return promise;
};

const post = (url, params, inHeaders, baseUrl) => {
    // header默认设置语言
    headers.language = window.lang;
    let newParams = params ? params : {};
    // param默认设置user_uuid
    window.userUuid && (newParams.user_uuid = window.userUuid);
    for (let key in inHeaders) {
        headers[key] = inHeaders[key];
    }
    const promise = new Promise((resolve, reject) => {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        axios({
            method: 'post',
            url: (baseUrl ? baseUrl : '') + url,
            data: newParams,
            transformRequest: [function (data) {
                let ret = '';
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                if (ret) {
                  ret = ret.substr(0, ret.length - 1);
                }
                return ret;
            }],
            headers: headers,
        }).then(function (res) {
            msgToast(res);
            res && resolve(res.data);
        }).catch((err) => {
            errToast(err);
            err && reject(err);
        });
    });
    promise.catch((error) => {
        console.log(error);
    });
    return promise;
};

const put = (url, params, inHeaders, baseUrl) => {
    // header默认设置语言
    headers.language = window.lang;
    let newParams = params ? params : {};
    // param默认设置user_uuid
    window.userUuid && (newParams.user_uuid = window.userUuid);
    for (let key in inHeaders) {
        headers[key] = inHeaders[key];
    }
    const promise = new Promise((resolve, reject) => {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        axios({
            method: 'put',
            url: (baseUrl ? baseUrl : '') + url,
            data: newParams,
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: headers,
        }).then(function (res) {
            msgToast(res);
            res && resolve(res.data);
        }).catch((err) => {
            errToast(err);
            err && reject(err);
        });
    });
    promise.catch((error) => {
        console.log(error);
    });
    return promise;
};

const deleteApi = (url, params, inHeaders, baseUrl) => {
    // header默认设置语言
    headers.language = window.lang;
    let newParams = params ? params : {};
    // param默认设置user_uuid
    window.userUuid && (newParams.user_uuid = window.userUuid);
    for (let key in inHeaders) {
        headers[key] = inHeaders[key];
    }
    const promise = new Promise((resolve, reject) => {
        axios({
            method: 'delete',
            url: (baseUrl ? baseUrl : '') + url,
            params: newParams,
            headers: headers,
        }).then(function (res) {
            msgToast(res);
            res && resolve(res.data);
        }).catch((err) => {
            errToast(err);
            err && reject(err);
        });
    });
    promise.catch((error) => {
        console.log(error);
    });
    return promise;
};

/*
  this.$http.ajax({
    base: "",
    timeout: 15000,
    path: "",
    type: "",
    data: {},
    filter: (res)=> {},
    intercept: (res)=> {},
    error: (err)=> {},
    catch: false
  }).then((res)=> {
    //业务模型
  }).catch((err)=> {
    //
  });
  *@base: [选填] 请求主域名
  *@path: [必填] 请求路径
  *@type: [必填] 请求类型
  *@data: [选填] 请求数据
  *@filter: [选填]] 处理异常返回逻辑
  *@err: 
  *@error: [选填] 处理错误返回逻辑
  *@catch: [选填] 是否自动错误处理逻辑
 **/
const ajax = (args) => {
  //language: this['language']['currentLang']
  headers.language = window.lang;

  //追加header头部信息
  let headInfo = headers;

  if (args.language != undefined) {
    headers['language'] = args.language;
  }
  //优先获取args.data.language值
  if (args.data.language != undefined) {
    headers['language'] = args.data.language;
  }

  if (args.header != undefined) {
    for (let key in args.header) {
      headers[key] = args.header[key];
    }
    headInfo = headers;
  }

  let promise = new Promise((resolve, reject) => {
    let json = {
      method: args.type,
      timeout: 15000,
      url: `${args.base ? args.base : ''}${args.path}`,
      headers: headInfo,
    };
    let reg = /^[0-9]*$/g;
    if (args.timeout != undefined && reg.test(args.timeout)) {
      json.timeout = args.timeout;
    } 
    if (args.type == "get") {
      json.params = args.data || {};
    }
    if (args.type == "post") {
      json.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      json.data = require('qs').stringify(args.data);
    }
    axios(json).then((res) => {
      //重定义业务逻辑
      if (args.filter != undefined) {
        args.filter(res);
        return;
      }
      //重定向iBerPay未登录状态 
      if (res.data.code == 1100 && args.authority != undefined) {
        args.authority();
        return;
      }
      if (res.data.code == 1900) {
        if (args.dealwith != undefined) {
          args.dealwith(res.data.msg, res.data);
          return;
        }
      }
      if (res.data.code != 0) {
        if (args.intercept != undefined) {
          args.intercept(res.data.msg, res.data);
        }
        if (args.toast) {
          Toast({message: res.data.msg});
        }
        return;
      }
      resolve(res.data);
    }).catch((err) => {
      console.log(err);
      if (args.err != undefined) {
        args.err();
        return;
      }
      if (err == undefined) {
        Toast({message: window.simply ? "系统繁忙，请稍后再试" : "系統繁忙，請稍後再試"});
        return;
      }
      let err_info = "";
      err_info = window.simply ? "系统繁忙，请稍后再试" : "系統繁忙，請稍後再試";

      if (args.error != undefined) {
        args.error(err);
        return;
      }
      if (args.catch != true) {
        if (args.intercept != undefined) {
          args.intercept();
        }
        if (args.toast == undefined || args.toast != false) {
          Toast({message: err_info});
        }
        return;
      }
      reject(err);
    });
  });
  promise.catch((error) => {
    console.log(error);
  });
  return promise;
};


export {
    get,
    post,
    put,
    deleteApi,

    ajax
}