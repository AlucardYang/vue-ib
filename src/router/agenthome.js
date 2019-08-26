/*
 *@Agent Home
 */
const agent_home = r => require.ensure([], () => r(require('@/components/agent/home.vue')), 'agent_home');
const agent_home_index = r => require.ensure([], () => r(require('@/components/agent/home/index.vue')), 'agent_home_index');
const agent_home_a_a_a = r => require.ensure([], () => r(require('@/components/agent/home/a_a_a.vue')), 'agent_home_a_a_a');
const agent_home_a_a_b = r => require.ensure([], () => r(require('@/components/agent/home/a_a_b.vue')), 'agent_home_a_a_b');
const agent_home_a_a_c = r => require.ensure([], () => r(require('@/components/agent/home/a_a_c.vue')), 'agent_home_a_a_c');
const agent_home_a_a_d = r => require.ensure([], () => r(require('@/components/agent/home/a_a_d.vue')), 'agent_home_a_a_d');
const agent_home_a_a_e = r => require.ensure([], () => r(require('@/components/agent/home/a_a_e.vue')), 'agent_home_a_a_e');
const agent_home_a_a_f = r => require.ensure([], () => r(require('@/components/agent/home/a_a_f.vue')), 'agent_home_a_a_f');
const agent_home_a_a_g = r => require.ensure([], () => r(require('@/components/agent/home/a_a_g.vue')), 'agent_home_a_a_g');
const agent_home_a_a_h = r => require.ensure([], () => r(require('@/components/agent/home/a_a_h.vue')), 'agent_home_a_a_h');
const agent_home_a_a_i = r => require.ensure([], () => r(require('@/components/agent/home/a_a_i.vue')), 'agent_home_a_a_i');

const agent_home_a_a_j = r => require.ensure([], () => r(require('@/components/agent/home/a_a_j.vue')), 'agent_home_a_a_j');
const agent_home_a_a_k = r => require.ensure([], () => r(require('@/components/agent/home/a_a_k.vue')), 'agent_home_a_a_k');
const agent_home_a_a_l = r => require.ensure([], () => r(require('@/components/agent/home/a_a_l.vue')), 'agent_home_a_a_l');
const agent_home_a_a_m = r => require.ensure([], () => r(require('@/components/agent/home/a_a_m.vue')), 'agent_home_a_a_m');
const agent_home_a_a_n = r => require.ensure([], () => r(require('@/components/agent/home/a_a_n.vue')), 'agent_home_a_a_n');
const agent_home_a_a_o = r => require.ensure([], () => r(require('@/components/agent/home/a_a_o.vue')), 'agent_home_a_a_o');
const agent_home_a_a_p = r => require.ensure([], () => r(require('@/components/agent/home/a_a_p.vue')), 'agent_home_a_a_p');
const agent_home_a_a_q = r => require.ensure([], () => r(require('@/components/agent/home/a_a_q.vue')), 'agent_home_a_a_q');

export default {
  path: '/user',
  component: agent_home,
  children: [
    {path: "", redirect: "index"},
    {path: "index", name: "agent_home_index", component: agent_home_index, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-a", name: "agent_home_a_a_a", component: agent_home_a_a_a, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-b", name: "agent_home_a_a_b", component: agent_home_a_a_b, meta: {from_type: '15', greet_type: 'personal_home_page', greet_type: 'personal_home_page'}},
    {path: "a-a-c", name: "agent_home_a_a_c", component: agent_home_a_a_c, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-d", name: "agent_home_a_a_d", component: agent_home_a_a_d, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-e", name: "agent_home_a_a_e", component: agent_home_a_a_e, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-f", name: "agent_home_a_a_f", component: agent_home_a_a_f, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-g", name: "agent_home_a_a_g", component: agent_home_a_a_g, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-h", name: "agent_home_a_a_h", component: agent_home_a_a_h, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-i", name: "agent_home_a_a_i", component: agent_home_a_a_i, meta: {from_type: '15', greet_type: 'personal_home_page'}},

    {path: "a-a-j", name: "agent_home_a_a_j", component: agent_home_a_a_j, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-k", name: "agent_home_a_a_k", component: agent_home_a_a_k, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-l", name: "agent_home_a_a_l", component: agent_home_a_a_l, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-m", name: "agent_home_a_a_m", component: agent_home_a_a_m, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-n", name: "agent_home_a_a_n", component: agent_home_a_a_n, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-o", name: "agent_home_a_a_o", component: agent_home_a_a_o, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-p", name: "agent_home_a_a_p", component: agent_home_a_a_p, meta: {from_type: '15', greet_type: 'personal_home_page'}},
    {path: "a-a-q", name: "agent_home_a_a_q", component: agent_home_a_a_q, meta: {from_type: '15', greet_type: 'personal_home_page'}}

  ]
}