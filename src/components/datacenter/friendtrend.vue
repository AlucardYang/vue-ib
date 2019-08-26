<template>
  <div id="friendTrend">
    <div class="friends-trend-inner com-scroll-y">
      <div class="top-blue-bg"></div>
      <total-card v-if="loadedScript && isLoaded" :data="totalData" :bottom-tip="simply ? '只统计已关注的圈子好友' : '只統計已關注的圈子好友'"></total-card>
      <data-center-line-chart v-if="loadedScript && isLoaded" :type="selectType" :title="simply ? '好友增长趋势' : '好友增長趨勢'" :tabs="tabs" :y-data1="friendData.friend_trend" :y-data2="friendData.worth_friend_trend"></data-center-line-chart>
      <div v-show="loadedScript && isLoaded" class="date-select-box" @click="showDate">{{dateDefault}}</div>
      <!-- 日期范围选择器 -->
      <select-picker ref="datePicker" :data="dateArr" :default="dateDefault" :title="simply ? '请选择' : '請選擇'" @updateData="updateDate"></select-picker>
    </div>
  </div>
</template>

<script>
  import CommonJS from '@/components/shared/service/common.js';
  
  import TotalCard from "./totalcard.vue";
  import DataCenterLineChart from "@/components/shared/component/chart/datacenter/linechart.vue";
  import SelectPicker from "@/components/shared/component/popup/selectpicker.vue";
  
  
  export default {
    name: 'DataCenterFriendsTrend',
    data() {
      return {
        selectType: '30d',
        loadedScript: false,
        isLoaded: false,
        friendData: {},
        totalData: [{
          title: this.simply ? '累计价值好友' : '累計價值好友',
          num: 0,
          // worth_friend_link好友价值跳转app开关
          value: 0,
          tip: this.simply ? '平台根据好友动态，资料等多维度算法评估好友是否达到重点价值好友' : '平台根據好友動態，資料等多維度算法評估好友是否達到重點價值好友'
        }, {
          title: this.simply ? '累计好友' : '累計好友',
          num: 0,
          value: -1
        }],
        tabs: [{
          title: '新增好友',
          type: 1
        }, {
          title: this.simply ? '新增价值好友' : '新增價值好友',
          type: 2
        }],
        dateArr: ['最近30日', this.simply ? '最近12个月' : '最近12個月'],
        dateDefault: '最近30日',
      }
    },
    components: {
      TotalCard,
      DataCenterLineChart,
      SelectPicker
    },
    created() {
      this.$root.blueLoadingParams.show = true;
      const _this = this;
      // 异步加载echarts.min.js
      CommonJS.loadScript('https://static.iberhk.com/res/js/echarts.min.js', () => {
        _this.loadedScript = true;
      });
    },
    mounted() {
      this.getFriendTrend();
    },
    methods: {
      getFriendTrend() {
        this.$http.get('/data-center/friend-trend', {
          type: this.selectType
        }).then(res => {
          if (res && res.code === 0) {
            this.friendData = res.data;
            this.totalData[0].num = this.friendData.worth_friend_count;
            this.totalData[1].num = this.friendData.friend_count;
          }
          this.isLoaded = true;
          this.$root.blueLoadingParams.show = false;
        }, err => {
          this.isLoaded = true;
          this.$root.blueLoadingParams.show = false;
          window.location.href = window.baseUrl + '/error/404';
        })
      },
      updateDate(event) {
        this.dateDefault = event;
        this.selectType = ((this.dateDefault === this.dateArr[0]) ? '30d' : '12m');
        this.getFriendTrend();
      },
      showDate() {
        this.$refs.datePicker.open();
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .friends-trend-inner {
    width: 100%;
    min-height: 100%;
    background-color: #F6F6F6;
    padding: .12rem .12rem 0 .12rem;
  }
  
  .top-blue-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: .7rem;
    background-color: #3364E3;
  }
  
  .date-select-box {
    position: absolute;
    right: .3rem;
    top: 2.15rem;
    font-size: .13rem;
    color: #3364E4;
    line-height: .16rem;
    cursor: pointer;
    width: auto;
  }
  
  .date-select-box:after {
    content: '';
    display: inline-block;
    border: 4px solid transparent;
    border-top: 4px solid #3364E4;
    margin-left: .04rem;
  }
</style>
