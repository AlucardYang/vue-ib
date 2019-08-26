// 医院查询
const Hospital = r => require.ensure([], () => r(require('@/components/hospital/hospital.vue')), 'Hospital');
const HospitalDetail = r => require.ensure([], () => r(require('@/components/hospital/detail.vue')), 'HospitalDetail');

export default {
  path: '/hospital',
  name: 'Hospital',
  component: Hospital,
  meta: {
    zh_tw_title: '醫院查詢',
    zh_cn_title: '医院查询'
  },
  children: [{
    path: 'detail',
    name: 'HospitalDetail',
    component: HospitalDetail,
    meta: {
      zh_tw_title: '醫院詳情',
      zh_cn_title: '医院详情',
      from_type: '23'
    }
  }]
}