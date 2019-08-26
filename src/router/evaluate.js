/*
 *@评测系统
 */
const evaluate = r => require.ensure([], () => r(require('@/components/evaluate/index.vue')), 'evaluate');
const evaluate_risk_dialog = r => require.ensure([], () => r(require('@/components/evaluate/risk_dialog/index.vue')), 'evaluate_risk_dialog');
const evaluate_risk_report = r => require.ensure([], () => r(require('@/components/evaluate/risk_report/index.vue')), 'evaluate_risk_report');
const evaluate_risk_record = r => require.ensure([], () => r(require('@/components/evaluate/risk_record/index.vue')), 'evaluate_risk_record');
const risk_report_app = r => require.ensure([], () => r(require('@/components/evaluate/risk_report_app/index.vue')), 'risk_report_app');
const evaluate_disease_dialog = r => require.ensure([], () => r(require('@/components/evaluate/disease_dialog/index.vue')), 'evaluate_disease_dialog');
const evaluate_disease_report = r => require.ensure([], () => r(require('@/components/evaluate/disease_report/index.vue')), 'evaluate_disease_report');
const evaluate_disease_record = r => require.ensure([], () => r(require('@/components/evaluate/disease_record/index.vue')), 'evaluate_disease_record');
const disease_report_app = r => require.ensure([], () => r(require('@/components/evaluate/disease_report_app/index.vue')), 'disease_report_app');
const evaluate_result = r => require.ensure([], () => r(require('@/components/evaluate/result/index.vue')), 'evaluate_result');

export default {
  path: '/evaluate',
  component: evaluate,
  children: [{
      path: '',
      redirect: 'risk-dialog'
    },
    {
      path: 'risk-dialog',
      name: 'evaluate_risk_dialog',
      component: evaluate_risk_dialog,
      meta: {
        index: 0,
        from_type: '91'
      }
    },
    {
      path: 'risk-report',
      name: 'evaluate_risk_report',
      component: evaluate_risk_report,
      meta: {
        index: 1,
        from_type: '91'
      }
    },
    {
      path: 'risk-record',
      name: 'evaluate_risk_record',
      component: evaluate_risk_record,
      meta: {
        index: 0
      }
    },
    {
      path: 'risk-app',
      name: 'risk_report_app',
      component: risk_report_app,
      meta: {
        index: 0
      }
    },
    {
      path: 'disease-dialog',
      name: 'evaluate_disease_dialog',
      component: evaluate_disease_dialog,
      meta: {
        index: 0,
        from_type: '92'
      }
    },
    {
      path: 'disease-report',
      name: 'evaluate_disease_report',
      component: evaluate_disease_report,
      meta: {
        index: 1,
        from_type: '92'
      }
    },
    {
      path: 'disease-record',
      name: 'evaluate_disease_record',
      component: evaluate_disease_record,
      meta: {
        index: 0
      }
    },
    {
      path: 'disease-app',
      name: 'disease_report_app',
      component: disease_report_app,
      meta: {
        index: 0
      }
    }, 
    {
      path: 'result',
      name: 'evaluate_result',
      component: evaluate_result,
      meta: {
        index: 2
      }
    },
  ]
}