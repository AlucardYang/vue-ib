// 文章
const AgentArticle = r => require.ensure([], () => r(require('@/components/agentarticle/agentarticle.vue')), 'AgentArticle');
const AgentArticleDetail = r => require.ensure([], () => r(require('@/components/agentarticle/detail.vue')), 'AgentArticleDetail');
const AgentArticlePcDetail = r => require.ensure([], () => r(require('@/components/agentarticle/pcdetail.vue')), 'AgentArticlePcDetail');

export default {
  path: '/agent-article',
  name: 'agentarticle',
  component: AgentArticle,
  meta: {
      zh_tw_title: '文章',
      zh_cn_title: '文章'
  },
  children: [{
      path: 'detail',
      name: 'agentarticledetail',
      component: AgentArticleDetail,
      meta: {
          zh_tw_title: '文章詳情',
          zh_cn_title: '文章详情',
          from_type: '14',
          greet_type: 'the_article'
      }
  }, {
    path: 'pc-detail',
    name: 'AgentArticlePcDetail',
    component: AgentArticlePcDetail,
    meta: {
        zh_tw_title: '文章詳情',
        zh_cn_title: '文章详情',
        from_type: '14',
        greet_type: 'the_article'
    }
}, {
    path: 'detail-test',
    name: 'agentarticledetailtest',
    component: AgentArticleDetail,
    meta: {
        zh_tw_title: '文章詳情',
        zh_cn_title: '文章详情',
        from_type: '14',
        greet_type: 'the_article'
    }
}]
}