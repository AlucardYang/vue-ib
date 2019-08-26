const radar = r => require.ensure([], () => r(require('@/components/agent/radar.vue')), 'agent_radar');
const index = r => require.ensure([], () => r(require('@/components/agent/radar/index.vue')), 'agent_radar_index');
const analysis = r => require.ensure([], () => r(require('@/components/agent/radar/analysis_one.vue')), 'agent_radar_analysis');


export default {
  path: '/radar',
  component: radar,
  children: [{
      path: "",
      redirect: "index"
    },
    {
      path: "index", 
      name: "agent_radar_index",
      component: index,
      meta: {
        index: 0
      }
    }, 
    {
      path: "analysis", 
      name: "agent_radar_analysis",
      component: analysis,
      meta: {
        index: 1
      }
    }
  ]
}