// 行动
const Illness = r => require.ensure([], () => r(require('@/components/illness/illness.vue')), 'Illness');
const IllnessDetail = r => require.ensure([], () => r(require('@/components/illness/detail.vue')), 'IllnessDetail');
const IllnessGetShareList = r => require.ensure([], () => r(require('@/components/illness/getsharelist.vue')), 'IllnessGetShareList');

export default {
  path: '/illness',
  name: 'Illness',
  component: Illness,
  meta: {
    zh_tw_title: '危疾查詢',
    zh_cn_title: '危疾查询'
  },
  children: [{
    path: 'detail',
    name: 'IllnessDetail',
    component: IllnessDetail,
    meta: {
      zh_tw_title: '危疾詳情',
      zh_cn_title: '重疾详情',
      from_type: '13',
      greet_type: 'serious_illness'
    }
  }, {
    path: 'get-share-list',
    name: ' IllnessGetShareList',
    component: IllnessGetShareList,
    meta: {
      zh_tw_title: '關聯保險產品',
      zh_cn_title: '关联保险产品',
      from_type: '13'
    }
  }]
}