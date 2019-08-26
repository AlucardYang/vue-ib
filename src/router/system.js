// 系统消息
const System = r => require.ensure([], () => r(require('@/components/system/system.vue')), 'System');
const MessageDetail = r => require.ensure([], () => r(require('@/components/system/messagedetail.vue')), 'MessageDetail');

export default {
  path: '/system',
  name: 'system',
  component: System,
  meta: {
      zh_tw_title: '系統',
      zh_cn_title: '系统'
  },
  children: [{
      path: 'message-detail',
      name: 'messagedetail',
      component: MessageDetail,
      meta: {
          zh_tw_title: '系統消息',
          zh_cn_title: '系统消息'
      }
  }]
}