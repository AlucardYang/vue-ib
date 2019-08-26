import CommonJS from '@/components/shared/service/common.js';


export default {
  name: 'iBer Pay公共函数',
  share: {
    title: 'iBer Payment Center',
    thumbImage: "https://static.iberhk.com/v2/web/images/iberpay/iberpay.jpg", 
    desc: '一鍵付款，iBer支付專用通道'
  }, 


  run() {
    //console.log(this.name);

    CommonJS.initWX(this.share);
  },

  end: '结束'
}