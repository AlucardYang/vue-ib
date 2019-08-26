import Vue from 'vue';
import Router from 'vue-router';

// 测试
const Test = r => require.ensure([], () => r(require('@/components/test/test.vue')), 'test');
// @YSUN主页
const ysun = r => require.ensure([], () => r(require('@/components/ysun/index.vue')), 'ysun');
// @公共address
const address = r => require.ensure([], () => r(require('@/components/address/address.vue')), 'address');
// @iBer Train
import TrainRouter from '@/router/train.js';
// @评测系统
import EvaluateRouter from '@/router/evaluate.js';
// @Agent
import AgentRouter from '@/router/agent.js';
// @Agent Home
import AgentHomeRouter from '@/router/agenthome.js';
// @Agent Radar
import AgentRadarRouter from '@/router/radar.js';
// @iBer Pay
import IberPayRouter from '@/router/iberpay.js';
// 协议
import IberRouter from '@/router/iber.js';
// 系统消息
import SystemRouter from '@/router/system.js';
// 资讯
import ArticleRouter from '@/router/article.js';
// 文章
import AgentArticleRouter from '@/router/agentarticle.js';
// 媒体报导
import MediaRouter from '@/router/media.js';
// 行动报告
import ReportRouter from '@/router/report.js';
// 行动
import ActionRouter from '@/router/action.js';
// 帮助中心
import HelpRouter from '@/router/help.js';
// 医院查询
import HospitalRouter from '@/router/hospital.js';
// 汇率查询
import ExchangeRateRouter from '@/router/exchangerate.js';
// 错误页面
import ErrorRouter from '@/router/error.js';
// 计算器
import CalculatorRouter from '@/router/calculator.js';
// 贺卡 
import CardRouter from '@/router/card.js';
// 数据中心
import DataCenterRouter from '@/router/datacenter.js';
// 动态
import Dynamic from '@/router/dynamic.js';
// 拼团
import Assemble from '@/router/assemble.js';
// 保险产品
import Product from '@/router/product.js';
// 重疾查询
import Illness from '@/router/illness.js';
//积分规则
import activity from '@/router/activity.js';
//iBerCare
import IberCare from '@/router/ibercare.js';

Vue.use(Router);

// 适配工程前缀
window.baseHost = (/\/v2\/page\//ig.test(window.location.href) ? 'v2/page' : (/\/page\//ig.test(window.location.href) ? 'page' : 'v2'));
window.baseUrl = (window.location.origin + '/' + window.baseHost);

const routes = [
  {
    path: '/',
    redirect: '/error/404'
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
    meta: {
      index: -1,
      zh_tw_title: '測試',
      zh_cn_title: '测试'
    }
  },
  {
    path: '/ysun',
    name: 'ysun',
    component: ysun,
    meta: {
      index: -1
    }
  },
  {
    path: '/address',
    name: 'address',
    component: address,
    meta: {
      index: 3
    }
  },
];


// 活动页
routes.push(activity);
// @iBer Train
routes.push(TrainRouter);
//@评测系统
routes.push(EvaluateRouter);
// @Agent
routes.push(AgentRouter);
// @Agent Radar
routes.push(AgentRadarRouter); 
// @Agent Home
routes.push(AgentHomeRouter);
// @iBer Pay
routes.push(IberPayRouter);
// 错误页面
routes.push(ErrorRouter);
// 协议
routes.push(IberRouter);
// 系统消息
routes.push(SystemRouter);
// 资讯
routes.push(ArticleRouter);
// 文章
routes.push(AgentArticleRouter);
// 媒体报导
routes.push(MediaRouter);
// 行动报告
routes.push(ReportRouter);
// 行动
routes.push(ActionRouter);
// 帮助中心
routes.push(HelpRouter);
// 医院查询
routes.push(HospitalRouter);
// 汇率查询
routes.push(ExchangeRateRouter);
// 计算器
routes.push(CalculatorRouter);
// 贺卡
routes.push(CardRouter);
// 数据中心
routes.push(DataCenterRouter);
// 动态
routes.push(Dynamic);
// 拼团
routes.push(Assemble);
// 保险产品
routes.push(Product);
// 重疾查询
routes.push(Illness);
// iBerCare
routes.push(IberCare);

export default new Router({
  mode: 'history',
  base: window.baseHost,
  routes: routes
})