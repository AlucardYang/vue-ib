// 行动
const Dynamic = r => require.ensure([], () => r(require('@/components/dynamic/dynamic.vue')), 'Dynamic');
const DynamicLineChart = r => require.ensure([], () => r(require('@/components/dynamic/linechart.vue')), 'DynamicLineChart');

export default {
  path: '/dynamic',
  name: 'Dynamic',
  component: Dynamic,
  meta: {
    zh_tw_title: '動態',
    zh_cn_title: '动态'
  },
  children: [{
    path: 'line-chart',
    name: 'DynamicLineChart',
    component: DynamicLineChart,
    meta: {
      zh_tw_title: '曲線圖',
      zh_cn_title: '曲线图'
    }
  }]
}