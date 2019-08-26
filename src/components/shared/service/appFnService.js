// 调用app公共方法
export default {
  // 公用调用方法，type:类型 data:数据
  commonFn(type, data) {
    let params = {
      type: type,
      data: data ? data : {}
    };
    setTimeout(() => {
      window.postMessage(JSON.stringify(params), '*');
    });
    console.log(params);
  },
  // 公用通知调用方法，data:数据
  postNotification(key, data) {
    let params = {
      type: 'postNotification',
      data: {
        not_key: key,
        not_content: data ? data : ''
      }
    };
    setTimeout(() => {
      window.postMessage(JSON.stringify(params), '*');
    });
    console.log(params);
  },
  // 打开app打电话功能，num: 传电话号码(例如：+852 3705 5152)
  phonePicker(num) {
    let params = {
      type: 'phonePicker',
      data: num ? num : '+852 3705 5152'
    };
    setTimeout(() => {
      window.postMessage(JSON.stringify(params), '*');
    });
    console.log(params);
  },
  // 打开app发送邮件功能，email: 传邮箱(例如：Service@iBer.HK)
  emailPicker(email) {
    let params = {
      type: 'emailPicker',
      data: email ? email : 'Service@iBer.HK'
    };
    setTimeout(() => {
      window.postMessage(JSON.stringify(params), '*');
    });
    console.log(params);
  },
  // 下载打开附件功能
  openFile(fileUrl) {
    let params = {
      type: 'openFile',
      data: {
        fileUrl: fileUrl
      }
    };
    setTimeout(() => {
      window.postMessage(JSON.stringify(params), '*');
    });
    console.log(params);
  },
  // 跳转外部浏览器查看
  openBrowser(linkUrl) {
    let params = {
      type: 'linkUrl',
      data: {
        linkUrl: linkUrl
      }
    };
    setTimeout(() => {
      window.postMessage(JSON.stringify(params), '*');
    });
    console.log(params);
  },
  // 公用分享调用方法，data:数据
  shareFn(share, setting) {
    let defaultShare = (share ? share : {
      type: 'news', // 'news'(分享带链接), 'imageUrl'(只分享图片)
      title: '', // 分享标题
      url: '', // 分享路径，传给app的路径
      desc: '', // 分享描述
      thumbImage: '', // 缩略图链接
      imageUrl: '', // type 為 news 可以傳空
    });
    let defaultSetting = (setting ? setting : {
      hide_platform: [], // 默认值：全显示传[] ['timeline', 'wechat', 'facebook', 'whatsapp', 'instagram', 'qq', 'weibo', 'copy', 'more'],
      language: 'auto', // 显示语言，默认值：'auto', 可选值：'null', 'auto', 'zh-cn', 'zh-tw'
      auth: 'force', // 微信授权，默认值：'force', 可选值：'null', 'force', 'free'
      card: 'full', // 底部名片，默认值：'full', 可选值：'null', 'full', 'simple', 'hide'
      comment: 'null', // 个人感想，默认值：'show', 可选值: 'null', 'show', 'hide'
      moreShare: 'null' // 更多分享，默认值：'null', 可选值: 'null', 'show', 'hide'
    });
    console.log("type: " + window.greetType);
    let params = {
      type: 'sharePicker',
      data: {
        type: window.greetType,
        share: defaultShare,
        setting: defaultSetting
      }
    };
    setTimeout(() => {
      window.postMessage(JSON.stringify(params), '*');
    });
    console.log(params);
  },
  // app从H5获取分享数据
  getShareFromH5(share, setting) {
    const _this = this;
    window.getShareFromH5 = function () {
      _this.shareFn(share, setting);
    }
  },
  // 打开app预览图片功能, data: 传入对象
  previewPhoto(data) {
    let defaultData = {
      imgs: [], // 图片url数组
      select: 0, // 初始选中下标，0开始
      enableSave: false // 是否允许下载图片
    };
    let params = {
      type: 'previewPhoto',
      data: data ? data : defaultData
    };
    setTimeout(() => {
      window.postMessage(JSON.stringify(params), '*');
    });
    console.log(params);
  },
  // 跳转app圈子页面，selectInfo: 对应过滤参数(数据字段参考src/components/shared/component/chart/datacenter/selectinfo.js文件)
  goFriend(selectInfo) {
    let params = {
      type: 'pushNativePage',
      data: {
        page_url: 'IBerRingModule_MyRingPage',
        page_params: {
          selectInfo: selectInfo
        },
        is_sapp: false,
        page_type: 1
      },
    };
    setTimeout(() => {
      window.postMessage(JSON.stringify(params), '*');
    });
    console.log(params);
  },
  /*  跳转app页面公共方法，pageParam: 路由参数
  pageParam = {
    is_sapp,// 是否是sapp
    sapp_uuid,// sapp的uuid
    page_type,// 1:原生，2:h5
    page_h5_title,// h5页面的标题
    page_url,// page链接，必传
    page_params,// page参数，必传  
  } 
  */
  goPage(pageParam) {
    let params = {
      type: 'pushNativePage',
      data: pageParam,
    };
    setTimeout(() => {
      window.postMessage(JSON.stringify(params), '*');
    });
    console.log(params);
  },
  // 跳转pro升级页面
  goProPage() {
    let pageParam = {
      page_url: "IBerMineModule_IBerAboutIntroducePage",
      is_sapp: false,
      page_type: 1
    };
    this.goPage(pageParam);
  },
  // app从H5获取参数公共规范方法
  getParamFromH5(type, param) {
    const _this = this;
    window.getParamFromH5 = function () {
      _this.commonFn(type, param);
    }
  },
  // 软键盘是否显示
  keyboard(callback) {
    window.onmessage = function (event) {
      // alert('进入window.onmessage');
      try {
        let data = (event.data && JSON.parse(event.data));
        console.log(data);
        callback(data);
      } catch (e) {
        console.log(e);
        return false;
      }
    };
    // document.addEventListener('message', function (event) {
    //   alert('进入message');
    //   try {
    //     let data = (event.data && JSON.parse(event.data));
    //     console.log(data);
    //     callback(data);
    //   } catch (e) {
    //     console.log(e);
    //     return false;
    //   }
    // });
  }
}