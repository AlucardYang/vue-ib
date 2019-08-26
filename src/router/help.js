// 帮助中心
const Help = r => require.ensure([], () => r(require('@/components/help/help.vue')), 'Help');
const HelpCard = r => require.ensure([], () => r(require('@/components/help/card.vue')), 'HelpCard');
const HelpList = r => require.ensure([], () => r(require('@/components/help/list.vue')), 'HelpList');
const HelpDetail = r => require.ensure([], () => r(require('@/components/help/detail.vue')), 'HelpDetail');

export default {
  path: '/help',
  name: 'help',
  component: Help,
  meta: {
    zh_tw_title: '幫助中心',
    zh_cn_title: '帮助中心'
  },
  children: [{
    path: 'card',
    name: 'helpcard',
    component: HelpCard,
    meta: {
      zh_tw_title: '幫助中心',
      zh_cn_title: '帮助中心',
      from_type: '18'
    }
  }, {
    path: 'list',
    name: 'helplist',
    component: HelpList,
    meta: {
      zh_tw_title: '新手必看',
      zh_cn_title: '新手必看',
      from_type: '18'
    }
  }, {
    path: 'detail',
    name: 'helpdetail',
    component: HelpDetail,
    meta: {
      zh_tw_title: '幫助詳情',
      zh_cn_title: '帮助详情',
      from_type: '18'
    }
  }]
}