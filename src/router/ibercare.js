// iBerCare
const IberCare = r => require.ensure([], () => r(require('@/components/ibercare/ibercare.vue')), 'IberCare');
const CareProductDetail = r => require.ensure([], () => r(require('@/components/ibercare/productdetail.vue')), 'CareProductDetail');
const CareCompanyProduct = r => require.ensure([], () => r(require('@/components/ibercare/companyproduct.vue')), 'CareCompanyProduct');
const CareCompanyDetail = r => require.ensure([], () => r(require('@/components/ibercare/companydetail.vue')), 'CareCompanyDetail');

// 预约报名
const CareProductReserve = r => require.ensure([], () => r(require('@/components/ibercare/productreserve.vue')), 'CareProductReserve');
const CareOrderReserveInfo = r => require.ensure([], () => r(require('@/components/ibercare/productreserve.vue')), 'CareOrderReserveInfo');

//订单
const iBerCareOrderList = r => require.ensure([], () => r(require('@/components/ibercare/order/list.vue')),
'iBerCareOrderList');
const iBerCareOrderDetail = r => require.ensure([], () => r(require('@/components/ibercare/order/detail.vue')),
'iBerCareOrderDetail');

//支付
const iBerCarePaySelect = r => require.ensure([], () => r(require('@/components/ibercare/pay/select.vue')), 'iBerCarePaySelect');
const iBerCarePayContainer = r => require.ensure([], () => r(require('@/components/ibercare/pay/container.vue')),
'iBerCarePayContainer');
const iBerCarePayStatus = r => require.ensure([], () => r(require('@/components/ibercare/pay/status.vue')), 'iBerCarePayStatus');
const iBerCarePaySuccess = r => require.ensure([], () => r(require('@/components/ibercare/pay/success.vue')), 'iBerCarePaySuccess');
const iBerCarePayFailed = r => require.ensure([], () => r(require('@/components/ibercare/pay/failed.vue')), 'iBerCarePayFailed');


export default {
  path: '/iber-care',
  name: 'IberCare',
  component: IberCare,
  meta: {
    zh_tw_title: '醫療產品',
    zh_cn_title: '医疗产品'
  },
  children: [
    { name: 'iBerCarePaySelect', path: 'pay-select', component: iBerCarePaySelect, meta: { index: 5, from_type: '61' } },
    { name: 'iBerCarePayContainer', path: 'pay-container', component: iBerCarePayContainer, meta: { index: 6, from_type: '61' } },
    { name: 'iBerCarePayStatus', path: 'pay-status', component: iBerCarePayStatus, meta: { index: 7, from_type: '61' } },
    { name: 'iBerCarePaySuccess', path: 'pay-success', component: iBerCarePaySuccess, meta: { index: 8, from_type: '61' } },
    { name: 'iBerCarePayFailed', path: 'pay-failed', component: iBerCarePayFailed, meta: { index: 8, from_type: '61' } },

    { name: 'iBerCareOrderList', path: 'order-list', component: iBerCareOrderList, meta: { index: 2, from_type: '61'} },
    { name: 'iBerCareOrderDetail', path: 'order-detail', component: iBerCareOrderDetail, meta: { index: 3, from_type: '61' } },

    {
      path: 'product-detail',
      name: 'CareProductDetail',
      component: CareProductDetail,
      meta: {
        index: 0,
        zh_tw_title: '醫療產品詳情',
        zh_cn_title: '医疗产品详情',
        from_type: '61',
        greet_type: 'iBerCare_medical_products'
      }
    }, {
      path: 'company-product',
      name: 'CareCompanyProduct',
      component: CareCompanyProduct,
      meta: {
        zh_tw_title: '醫療集團',
        zh_cn_title: '医疗集团',
        from_type: '61',
        greet_type: 'iBerCare_medical_company'
      }
    }, {
      path: 'company-detail',
      name: 'CareCompanyDetail',
      component: CareCompanyDetail,
      meta: {
        zh_tw_title: '醫療集團詳情',
        zh_cn_title: '医疗集团详情',
        from_type: '62',
        greet_type: 'iBerCare_medical_company'
      }
    }, {
      path: 'product-reserve',
      name: 'CareProductReserve',
      component: CareProductReserve,
      meta: {
        index: 1,
        zh_tw_title: '報名預約',
        zh_cn_title: '报名预约',
        from_type: '61',
        greet_type: ''
      }
    }, {
      path: 'order-reserve-info',
      name: 'CareOrderReserveInfo',
      component: CareOrderReserveInfo,
      meta: {
        index: 1,
        zh_tw_title: '重新預約',
        zh_cn_title: '重新预约',
        from_type: '61',
        greet_type: ''
      }
    }]
}