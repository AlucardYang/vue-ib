// 行动
const Action = r => require.ensure([], () => r(require('@/components/action/action.vue')), 'Action');
const ShareCode = r => require.ensure([], () => r(require('@/components/action/sharecode.vue')), 'ShareCode');

export default {
  path: '/action',
  name: 'action',
  component: Action,
  meta: {
    zh_tw_title: '行動',
    zh_cn_title: '行动'
  },
  children: [{
    path: 'share-code',
    name: 'sharecode',
    component: ShareCode,
    meta: {
      zh_tw_title: '共享碼',
      zh_cn_title: '共享码'
    }
  }]
}