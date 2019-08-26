// 汇率查询
const ExchangeRate = r => require.ensure([], () => r(require('@/components/exchangerate/exchangerate.vue')), 'ExchangeRate');
const ExchangeRateList = r => require.ensure([], () => r(require('@/components/exchangerate/list.vue')), 'ExchangeRateList');
const ExchangeRateConvert = r => require.ensure([], () => r(require('@/components/exchangerate/convert.vue')), 'ExchangeRateConvert');

export default {
  path: '/exchange-rate',
  name: 'ExchangeRate',
  component: ExchangeRate,
  meta: {
    zh_tw_title: '匯率查詢',
    zh_cn_title: '汇率查询',
    from_type: '31',
    greet_type: 'exchange_rate_query'
  },
  children: [{
    path: 'list',
    name: 'ExchangeRateList',
    component: ExchangeRateList,
    meta: {
      zh_tw_title: '匯率查詢',
      zh_cn_title: '汇率查询',
      from_type: '31',
      greet_type: 'exchange_rate_query'
    }
  }, {
    path: 'convert',
    name: 'ExchangeRateConvert',
    component: ExchangeRateConvert,
    meta: {
      zh_tw_title: '貨幣兌換',
      zh_cn_title: '货币兑换',
      from_type: '31',
      greet_type: 'exchange_rate_query'
    }
  }]
}