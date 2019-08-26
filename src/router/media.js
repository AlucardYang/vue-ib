// 媒体报导
const Media = r => require.ensure([], () => r(require('@/components/media/media.vue')), 'Media');
const MediaDetail = r => require.ensure([], () => r(require('@/components/media/detail.vue')), 'MediaDetail');

export default {
  path: '/media',
  name: 'media',
  component: Media,
  meta: {
    zh_tw_title: '媒體報導',
    zh_cn_title: '媒体报导',
    from_type: '17',
    greet_type: 'media_reports'
  },
  children: [{
      path: 'detail',
      name: 'mediadetail',
      component: MediaDetail,
      meta: {
        zh_tw_title: '媒體報導',
        zh_cn_title: '媒体报导',
        from_type: '17',
        greet_type: 'media_reports'
      }
  }]
}