// 错误页面
const Error = r => require.ensure([], () => r(require('@/components/error/error.vue')), 'Error');
const Error404 = r => require.ensure([], () => r(require('@/components/error/404.vue')), 'Error404');
const ErrorNotFound = r => require.ensure([], () => r(require('@/components/error/notfound.vue')), 'ErrorNotFound');
const ErrorSoldOut = r => require.ensure([], () => r(require('@/components/error/soldout.vue')), 'ErrorSoldOut');

export default {
  path: '/error',
  name: 'error',
  component: Error,
  meta: {
    index: 99,
    zh_tw_title: '頁面出錯',
    zh_cn_title: '页面出错'
  },
  children: [{
    path: '404',
    name: '404',
    component: Error404,
    meta: {
      index: 99,
      zh_tw_title: '頁面出錯',
      zh_cn_title: '页面出错'
    }
  }, {
    path: 'notfound',
    name: 'notfound',
    component: ErrorNotFound,
    meta: {
      index: 99,
      zh_tw_title: '訪問失敗',
      zh_cn_title: '访问失败'
    }
  }, {
    path: 'soldout',
    name: 'soldout',
    component: ErrorSoldOut,
    meta: {
      index: 99,
      zh_tw_title: '訪問失敗',
      zh_cn_title: '访问失败'
    }
  }]
}