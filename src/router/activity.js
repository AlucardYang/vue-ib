const activity = r => require.ensure([], () => r(require('@/components/activity/frame.vue')), 'activity');
const pointRule = r => require.ensure([], () => r(require('@/components/activity/point_rule.vue')), 'pointRule');
const goodsDetail = r => require.ensure([], () => r(require('@/components/activity/goods_detail.vue')), 'goodsDetail');

export default {
  path: '/activity',
  name: 'activity',
  component: activity,
  children: [
    {
      path: 'point_rule',
      name: 'pointRule',
      component: pointRule,
      meta: {
        index: 0
      }
    },
    { 
      path: 'goods_detail',
      name: 'goodsDetail',
      component: goodsDetail,
      meta: {
        index: 0
      }
    }
  ]
}