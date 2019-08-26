/*
 *@iBer Train
 */
const train = r => require.ensure([], () => r(require('@/components/training/frame.vue')), 'train');
const train_signIn = r => require.ensure([], () => r(require('@/components/training/sign_in.vue')), 'train_signIn');
const train_success = r => require.ensure([], () => r(require('@/components/training/success.vue')), 'train_success');
const train_rule = r => require.ensure([], () => r(require('@/components/training/rule.vue')), 'train_rule');

export default {
  path: '/training',
  component: train,
  children: [{
      path: "",
      redirect: "sign-in"
    },
    {
      path: "sign-in",
      name: "train_signIn",
      component: train_signIn,
      meta: {
        index: 0
      }
    },
    {
      path: "success",
      name: "train_success",
      component: train_success,
      meta: {
        index: 1
      }
    },
    {
      path: "rule",
      name: "train_rule",
      component: train_rule,
      meta: {
        index: 0
      }
    }
  ]
}