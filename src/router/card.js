// 贺卡
const Card = r => require.ensure([], () => r(require('@/components/card/card.vue')), 'Card');
const CardText = r => require.ensure([], () => r(require('@/components/card/text/text.vue')), 'CardText');
const CardVideo = r => require.ensure([], () => r(require('@/components/card/video/video.vue')), 'CardVideo');

export default {
    path: '/greeting-card',
    name: 'Card',
    component: Card,
    meta: {
        zh_tw_title: '賀卡',
        zh_cn_title: '贺卡'
    },
    children: [{
        path: 'text',
        name: 'CardText',
        component: CardText,
        meta: {
            zh_tw_title: '賀卡',
            zh_cn_title: '贺卡',
            from_type: '51'
        }
    }, {
        path: 'video',
        name: 'CardVideo',
        component: CardVideo,
        meta: {
            zh_tw_title: '賀卡',
            zh_cn_title: '贺卡',
            from_type: '51',
            greet_type: 'greeting_card'
        }
    }]
}