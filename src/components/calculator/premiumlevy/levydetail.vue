<template>
  <div id="calculator" class="com-scroll-y">
      <div class="levy-detail">
        <div class="levy-detail-title">{{require_pay}}{{levyYears}}年共{{premiumLevy | formatMoney}}</div>
        <ul class="levy-detail-table">
          <li class="levy-detail-row clearfix">
            <div class="levy-detail-cell title"></div>
            <div class="levy-detail-cell range"></div>
            <div class="levy-detail-cell date">{{warranty_year}}</div>
            <div class="levy-detail-cell rate">{{premium_rate}}</div>
            <div class="levy-detail-cell levy">{{need_pay}}<br>{{levy_money}}<br>{{hong_kong_dollar}}</div>
            <div class="levy-detail-cell max">最高保<br>{{levy_money}}<br>{{hong_kong_dollar}}</div>
          </li>
          <li class="levy-detail-row clearfix" v-for="(item, index) in levyDatas" :key="index" :class="{'blod': item.isBold}">
            <div class="levy-detail-cell title">{{item.title}}</div>
            <div class="levy-detail-cell range"><em>{{item.from}}<br>{{item.connect}}<br>{{item.to}}</em></div>
            <div class="levy-detail-cell date">{{item.date}}</div>
            <div class="levy-detail-cell rate">{{item.rate}}%</div>
            <div class="levy-detail-cell levy">{{item.levy | formatMoney(2)}}</div>
            <div class="levy-detail-cell max">{{item.max | formatMoney(0)}}</div>
          </li>
        </ul>
      </div>
      <div class="disclaimer-box">{{disclaimer_text}}</div>
  </div>
</template>

<script>
  export default {
    name: 'LevyDetail',
    data() {
      return {
        levyYears: sessionStorage.getItem('levyYears'),
        premiumLevy: sessionStorage.getItem('premiumLevy'),
        levyDatas: JSON.parse(sessionStorage.getItem('levyDatas')),
        disclaimer_text: this.simply ? '免责声明：以上内容仅供参考' : '免責聲明：以上內容僅供參考',
        require_pay: this.simply ? '您需要缴交：' : '您需要繳交：',
        warranty_year: this.simply ? '保单周年' : '保單週年',
        premium_rate: this.simply ? '征费率' : '徵費率',
        need_pay: this.simply ? '应缴保' : '應繳保',
        levy_money: this.simply ? '费征费' : '費徵費',
        hong_kong_dollar: this.simply ? '（港币）' : '（港幣）',
      };
    },
    mounted() {
    },
    methods: {
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../calculator.css">
  
</style>

<style scoped>
  .levy-detail {
    width: 100%;
    padding: .1rem;
    min-height: calc(100% - .4rem);
  }
  
  .levy-detail-title {
    font-size: .2rem;
    color: #2A2A2A;
    line-height: .24rem;
    padding-top: .1rem;
    margin-bottom: .12rem;
    font-weight: bold;
  }
  
  .levy-detail-table {
    width: 100%;
    font-size: .1rem;
    color: #2A2A2A;
    line-height: .12rem;
    box-sizing: border-box;
    border-bottom: 1px solid #91B0FF;
    border-left: 1px solid #91B0FF;
  }
  
  .levy-detail-row {
    box-sizing: border-box;
    width: 100%;
    height: .6rem;
    border-right: 1px solid #91B0FF;
    background-color: #F6FBFF;
    overflow: hidden;
    position: relative;
  }
  
  .levy-detail-row.blod {
    background-color: #DCEEFF;
  }
  
  .levy-detail-cell {
    box-sizing: border-box;
    position: absolute;
    border-top: 1px solid #91B0FF;
    border-right: 1px solid #91B0FF;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    height: .73rem;
    text-align: center;
    line-height: .15rem;
    transform: scale(.84, .84);
    left: -.06rem;
    top: -.057rem;
  }

  .levy-detail-cell.title {
    width: .62rem;
  }
  
  .levy-detail-cell.range {
    left: .44rem;
    width: .8rem;
  }
  
  .levy-detail-cell.range em {
    cursor: initial;
  }
  
  .levy-detail-cell.date {
    left: 1.09rem;
    width: .84rem;
  }
  
  .levy-detail-cell.rate {
    left: 1.82rem;
    width: .6rem;
  }
  
  .levy-detail-cell.levy {
    left: 2.31rem;
    width: .68rem;
  }
  
  .levy-detail-cell.max {
    left: 2.87rem;
    width: .73rem;
  }
</style>
