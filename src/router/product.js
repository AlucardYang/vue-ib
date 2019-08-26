// 行动
const Product = r => require.ensure([], () => r(require('@/components/product/product.vue')), 'Product');
const ProductDetail = r => require.ensure([], () => r(require('@/components/product/detail.vue')), 'ProductDetail');
const ProductCompare = r => require.ensure([], () => r(require('@/components/product/compare.vue')), 'ProductCompare');

export default {
  path: '/product',
  name: 'Product',
  component: Product,
  meta: {
    zh_tw_title: '保險',
    zh_cn_title: '保险'
  },
  children: [{
    path: 'detail',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: {
      zh_tw_title: '產品詳情',
      zh_cn_title: '产品详情',
      from_type: '12',
      greet_type: 'insurance_products'
    }
  }, {
    path: 'compare',
    name: 'ProductCompare',
    component: ProductCompare,
    meta: {
      zh_tw_title: '保險產品對比',
      zh_cn_title: '保险产品对比',
      from_type: '16',
      greet_type: 'product_comparison'
    }
  }]
}