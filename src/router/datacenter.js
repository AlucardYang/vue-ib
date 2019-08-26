// 数据中心
const DataCenter = r => require.ensure([], () => r(require('@/components/datacenter/datacenter.vue')), 'DataCenter');
const DataCenterFriendTrend = r => require.ensure([], () => r(require('@/components/datacenter/friendtrend.vue')), 'DataCenterFriendTrend');
const DataCenterFriendData = r => require.ensure([], () => r(require('@/components/datacenter/frienddata.vue')), 'DataCenterFriendData');
const DataCenterFriendPortrait = r => require.ensure([], () => r(require('@/components/datacenter/friendportrait.vue')), 'DataCenterFriendPortrait');
const DataCenterViewDistribution = r => require.ensure([], () => r(require('@/components/datacenter/viewdistribution.vue')), 'DataCenterViewDistribution');
const DataCenterViewTrend = r => require.ensure([], () => r(require('@/components/datacenter/viewtrend.vue')), 'DataCenterViewTrend');
const DataCenterTransferTrend = r => require.ensure([], () => r(require('@/components/datacenter/transfertrend.vue')), 'DataCenterTransferTrend');
const DataCenterTodoData = r => require.ensure([], () => r(require('@/components/datacenter/tododata.vue')), 'DataCenterTodoData');

export default {
  path: '/data-center',
  name: 'DataCenter',
  component: DataCenter,
  meta: {
    zh_tw_title: ' 數據中心',
    zh_cn_title: '数据中心'
  },
  children: [{
    path: 'friend-trend',
    name: 'DataCenterFriendTrend',
    component: DataCenterFriendTrend,
    meta: {
      zh_tw_title: '圈子好友數據統計',
      zh_cn_title: '圈子好友数据统计'
    }
  }, {
    path: 'friend-data',
    name: 'DataCenterFriendData',
    component: DataCenterFriendData,
    meta: {
      zh_tw_title: '圈子好友數據統計',
      zh_cn_title: '圈子好友数据统计'
    }
  }, {
    path: 'friend-portrait',
    name: 'DataCenterFriendPortrait',
    component: DataCenterFriendPortrait,
    meta: {
      zh_tw_title: '圈子好友數據統計',
      zh_cn_title: '圈子好友数据统计'
    }
  }, {
    path: 'view-distribution',
    name: 'DataCenterViewDistribution',
    component: DataCenterViewDistribution,
    meta: {
      zh_tw_title: '分享瀏覽數據統計',
      zh_cn_title: '分享浏览数据统计'
    }
  }, {
    path: 'view-trend',
    name: 'DataCenterViewTrend',
    component: DataCenterViewTrend,
    meta: {
      zh_tw_title: '分享瀏覽數據統計',
      zh_cn_title: '分享浏览数据统计'
    }
  }, {
    path: 'transfer-trend',
    name: 'DataCenterTransferTrend',
    component: DataCenterTransferTrend,
    meta: {
      zh_tw_title: '分享瀏覽數據統計',
      zh_cn_title: '分享浏览数据统计'
    }
  }, {
    path: 'todo-data',
    name: 'DataCenterTodoData',
    component: DataCenterTodoData,
    meta: {
      zh_tw_title: '行動量數據統計',
      zh_cn_title: '行动量数据统计'
    }
  }]
}