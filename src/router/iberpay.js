/*
 *@iBer Pay
 */
const iber_pay = r => require.ensure([], () => r(require('@/components/iber_pay/index.vue')), 'iber_pay');
const iber_pay_login = r => require.ensure([], () => r(require('@/components/iber_pay/login.vue')), 'iber_pay_login');
const iber_pay_perfect = r => require.ensure([], () => r(require('@/components/iber_pay/perfect.vue')), 'iber_pay_perfect');
const iber_pay_qrcode = r => require.ensure([], () => r(require('@/components/iber_pay/qrcode.vue')), 'iber_pay_qrcode');
const iber_pay_info = r => require.ensure([], () => r(require('@/components/iber_pay/info.vue')), 'iber_pay_info');
const iber_pay_type = r => require.ensure([], () => r(require('@/components/iber_pay/type.vue')), 'iber_pay_type');
const iber_pay_transact = r => require.ensure([], () => r(require('@/components/iber_pay/transact.vue')), 'iber_pay_transact');
const iber_pay_status = r => require.ensure([], () => r(require('@/components/iber_pay/status.vue')), 'iber_pay_status');
const iber_pay_success = r => require.ensure([], () => r(require('@/components/iber_pay/success.vue')), 'iber_pay_success');
const iber_pay_failure = r => require.ensure([], () => r(require('@/components/iber_pay/failure.vue')), 'iber_pay_failure');

export default {
  path: '/pay',
  component: iber_pay,
  children: [{
      path: '',
      redirect: 'login'
    },
    {
      path: 'login',
      name: 'iber_pay_login',
      component: iber_pay_login,
      meta: {
        index: 0
      }
    },
    {
      path: 'perfect',
      name: 'iber_pay_perfect',
      component: iber_pay_perfect,
      meta: {
        index: 1
      }
    },
    {
      path: 'qrcode',
      name: 'iber_pay_qrcode',
      component: iber_pay_qrcode,
      meta: {
        index: 2
      }
    },
    {
      path: 'info',
      name: 'iber_pay_info',
      component: iber_pay_info,
      meta: {
        index: 2
      }
    },
    {
      path: 'type',
      name: 'iber_pay_type',
      component: iber_pay_type,
      meta: {
        index: 3
      }
    },
    {
      path: 'transact',
      name: 'iber_pay_transact',
      component: iber_pay_transact,
      meta: {
        index: 4
      }
    },
    {
      path: 'status',
      name: 'iber_pay_status',
      component: iber_pay_status,
      meta: {
        index: 4
      }
    },
    {
      path: 'success',
      name: 'iber_pay_success',
      component: iber_pay_success,
      meta: {
        index: 5
      }
    },
    {
      path: 'failure',
      name: 'iber_pay_failure',
      component: iber_pay_failure,
      meta: { 
        index: 5
      }
    }
  ]
}