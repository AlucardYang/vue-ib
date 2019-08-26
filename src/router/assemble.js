// 行动
const Assemble = r => require.ensure([], () => r(require('@/components/assemble/assemble.vue')), 'Assemble');
const AssembleBook = r => require.ensure([], () => r(require('@/components/assemble/book.vue')), 'AssembleBook');
const AssembleType = r => require.ensure([], () => r(require('@/components/assemble/type.vue')), 'AssembleType');
const AssembleStatus = r => require.ensure([], () => r(require('@/components/assemble/status.vue')), 'AssembleStatus');

export default {
  path: '/assemble',
  name: 'Assemble',
  component: Assemble,
  meta: {
    zh_tw_title: '拼團',
    zh_cn_title: '拼團'
  },
  children: [{
    path: 'book',
    name: 'AssembleBook',
    component: AssembleBook,
    meta: {
      zh_tw_title: 'iBer特惠拼團',
      zh_cn_title: 'iBer特惠拼團'
    }
  }, {
    path: 'type',
    name: 'AssembleType',
    component: AssembleType,
    meta: {
      zh_tw_title: '確認支付',
      zh_cn_title: '確認支付'
    }
  }, {
    path: 'status',
    name: 'AssembleStatus',
    component: AssembleStatus,
    meta: {
      zh_tw_title: 'iBer Payment',
      zh_cn_title: 'iBer Payment'
    }
  }]
}