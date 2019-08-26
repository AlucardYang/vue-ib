// 协议
const Iber = r => require.ensure([], () => r(require('@/components/iber/iber.vue')), 'Iber');
const PrivatePolicy = r => require.ensure([], () => r(require('@/components/iber/privatepolicy.vue')), 'PrivatePolicy');
const PuserPolicy = r => require.ensure([], () => r(require('@/components/iber/puserpolicy.vue')), 'PuserPolicy');

export default {
  path: '/iber',
  name: 'iber',
  component: Iber,
  meta: {
    zh_tw_title: 'iBer',
    zh_cn_title: 'iBer'
  },
  children: [{
    path: 'private-policy',
    name: 'privatepolicy',
    component: PrivatePolicy,
    meta: {
      index: 0,
      zh_tw_title: '私隱協議',
      zh_cn_title: '私隐协议'
    }
  }, {
    path: 'puser-policy',
    name: 'puserpolicy',
    component: PuserPolicy,
    meta: {
      index: 0,
      zh_tw_title: '用戶協議',
      zh_cn_title: '用户协议'
    }
  }]
}