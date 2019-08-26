// 计算器
const Calculator = r => require.ensure([], () => r(require('@/components/calculator/calculator.vue')), 'Calculator');
const TenMillion = r => require.ensure([], () => r(require('@/components/calculator/tenmillion.vue')), 'TenMillion');
const CompoundInterest = r => require.ensure([], () => r(require('@/components/calculator/compoundinterest.vue')), 'CompoundInterest');
const Future = r => require.ensure([], () => r(require('@/components/calculator/future.vue')), 'Future');
const Tax = r => require.ensure([], () => r(require('@/components/calculator/tax.vue')), 'Tax');
const MonthInvest = r => require.ensure([], () => r(require('@/components/calculator/monthinvest.vue')), 'MonthInvest');
const LifeInsurance = r => require.ensure([], () => r(require('@/components/calculator/lifeinsurance/lifeinsurance.vue')), 'LifeInsurance');
const Annuity = r => require.ensure([], () => r(require('@/components/calculator/annuity/annuity.vue')), 'Annuity');
const Education = r => require.ensure([], () => r(require('@/components/calculator/education/education.vue')), 'Education');
const PremiumLevy = r => require.ensure([], () => r(require('@/components/calculator/premiumlevy/premiumlevy.vue')), 'PremiumLevy');
const LevyDetail = r => require.ensure([], () => r(require('@/components/calculator/premiumlevy/levydetail.vue')), 'LevyDetail');

export default {
  path: '/calculator',
  name: 'calculator',
  component: Calculator,
  meta: {
    title: '計算器',
    title: '计算器'
  },
  children: [{
    path: 'ten-million',
    name: 'tenmillion',
    component: TenMillion,
    meta: {
      zh_tw_title: '千萬富翁',
      zh_cn_title: '千万富翁',
      from_type: '21',
      greet_type: 'multi_millionaire_calculator'
    }
  }, {
    path: 'compound-interest',
    name: 'compoundinterest',
    component: CompoundInterest,
    meta: {
      zh_tw_title: '複利',
      zh_cn_title: '复利',
      from_type: '21',
      greet_type: 'compound_interest_calculator'
    }
  }, {
    path: 'future',
    name: 'future',
    component: Future,
    meta: {
      zh_tw_title: '未來值',
      zh_cn_title: '未来值',
      from_type: '21',
      greet_type: 'future_calculator'
    }
  }, {
    path: 'tax',
    name: 'tax',
    component: Tax,
    meta: {
      zh_tw_title: '內地個稅計算',
      zh_cn_title: '内地个税计算',
      from_type: '21',
      greet_type: 'mainland_tax_calculator'
    }
  }, {
    path: 'month-invest',
    name: 'monthinvest',
    component: MonthInvest,
    meta: {
      zh_tw_title: '月供投資',
      zh_cn_title: '月供投资',
      from_type: '21',
      greet_type: 'monthly_investment_calculator'
    }
  }, {
    path: 'life-insurance',
    name: 'lifeinsurance',
    component: LifeInsurance,
    meta: {
      zh_tw_title: '人壽保障',
      zh_cn_title: '人寿保障',
      from_type: '21',
      greet_type: 'life_safeguard_calculator'
    }
  }, {
    path: 'annuity',
    name: 'annuity',
    component: Annuity,
    meta: {
      zh_tw_title: '退休基金',
      zh_cn_title: '退休基金',
      from_type: '21',
      greet_type: 'pension_fund_calculator'
    }
  }, {
    path: 'education',
    name: 'education',
    component: Education,
    meta: {
      zh_tw_title: '教育基金',
      zh_cn_title: '教育基金',
      from_type: '21',
      greet_type: 'education_fund_calculator'
    }
  }, {
    path: 'premium-levy',
    name: 'premiumlevy',
    component: PremiumLevy,
    meta: {
      zh_tw_title: '保費徵費',
      zh_cn_title: '保费征费',
      from_type: '21',
      greet_type: 'premium_fees_calculator'
    }
  }, {
    path: 'levy-detail',
    name: 'levydetail',
    component: LevyDetail,
    meta: {
      zh_tw_title: '徵費明细',
      zh_cn_title: '征费明细'
    }
  }]
};