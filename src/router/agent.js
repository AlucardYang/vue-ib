/*
 *@Agent
 */
const blank = r => require.ensure([], () => r(require('@/components/agent/blank.vue')), 'blank');
const agent = r => require.ensure([], () => r(require('@/components/agent/index.vue')), 'agent');
const agent_address = r => require.ensure([], () => r(require('@/components/agent/address.vue')), 'agent_address');
const agent_consult = r => require.ensure([], () => r(require('@/components/agent/consult/index.vue')), 'agent_consult');

const pro_consult = r => require.ensure([], () => r(require('@/components/agent/proconsult/index.vue')), 'pro_consult');

export default {
  path: '/agent',
  component: agent,
  children: [{
      path: '',
      redirect: 'address'
    },
    {
      path: 'blank',
      name: 'blank',
      component: blank,
      meta: {
        index: 99
      }
    },
    {
      path: 'address',
      name: 'agent_address',
      component: agent_address,
      meta: {
        index: 4
      }
    },
    {
      path: 'consult',
      name: 'agent_consult',
      component: agent_consult,
      meta: {
        index: 5
      }
    },

    {
      path: 'proconsult',
      name: 'pro_consult',
      component: pro_consult,
      meta: {
        index: 5
      }
    }
    
  ]
}