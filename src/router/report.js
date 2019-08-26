// 行动报告
const Report = r => require.ensure([], () => r(require('@/components/report/report.vue')), 'Report');
const ActionDaily = r => require.ensure([], () => r(require('@/components/report/action/daily.vue')), 'ActionDaily');
const ActionWeek = r => require.ensure([], () => r(require('@/components/report/action/week.vue')), 'ActionWeek');
const ActionMonth = r => require.ensure([], () => r(require('@/components/report/action/month.vue')), 'ActionMonth');

export default {
  path: '/report',
  name: 'report',
  component: Report,
  meta: {
    zh_tw_title: '行動報告',
    zh_cn_title: '行动报告'
  },
  children: [{
    path: 'action-daily',
    name: 'actiondaily',
    component: ActionDaily,
    meta: {
      zh_tw_title: '日報',
      zh_cn_title: '日报'
    }
  }, {
    path: 'action-week',
    name: 'actionweek',
    component: ActionWeek,
    meta: {
      zh_tw_title: '周報',
      zh_cn_title: '周报'
    }
  }, {
    path: 'action-month',
    name: 'actionmonth',
    component: ActionMonth,
    meta: {
      zh_tw_title: '月報',
      zh_cn_title: '月报'
    }
  }]
}