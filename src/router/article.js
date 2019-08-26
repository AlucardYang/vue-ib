// 资讯
const Article = r => require.ensure([], () => r(require('@/components/article/article.vue')), 'Article');
const ArticleDetail = r => require.ensure([], () => r(require('@/components/article/detail/detail.vue')), 'ArticleDetail');
const ArticleSpecial = r => require.ensure([], () => r(require('@/components/article/special.vue')), 'ArticleSpecial');

export default {
  path: '/article',
  name: 'article',
  component: Article,
  meta: {
    zh_tw_title: '資訊',
    zh_cn_title: '资讯'
  },
  children: [{
    path: 'detail',
    name: 'articledetail',
    component: ArticleDetail,
    meta: {
      index: 0,
      zh_tw_title: '資訊詳情',
      zh_cn_title: '资讯详情',
      from_type: '11',
      greet_type: 'information'
    }
  }, {
    path: 'special',
    name: 'articlespecial',
    component: ArticleSpecial,
    meta: {
      zh_tw_title: '專題頁',
      zh_cn_title: '专题页'
    }
  }]
}