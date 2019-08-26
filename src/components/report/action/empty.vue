<template>
  <div class="empty-tip">
    <div class="empty-tip-center">
      <img src="https://static.iberhk.com/v2/web/images/action/empty.svg">
      <span>{{simply ? '暂无行动报告' : '暫無行動報告'}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "EmptyPage",
    props: {
  
    },
    data() {
      return {};
    },
    components: {},
    mounted: function() {},
    methods: {
  
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .empty-tip {
    width: 100%;
    height: calc(100% - 1.17rem);
    background-color: #fff;
    border-radius: 0.1rem;
    text-align: center;
    position: relative;
  }
  
  .empty-tip-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  
  .empty-tip-center img {
    display: block;
    width: 1rem;
  }
  
  .empty-tip-center span {
    margin-top: .16rem;
    display: inline-block;
    font-size: .15rem;
    color: #CCCCCC;
    text-align: center;
    line-height: .18rem;
  }
  
  .empty-tip:before,
  .empty-tip:after {
    content: "";
    position: absolute;
    top: -0.1rem;
    left: -0.1rem;
    width: 0.2rem;
    height: 0.2rem;
    background-color: #3364e4;
    border-radius: 50%;
    z-index: 10;
  }
  
  .empty-tip:after {
    left: auto;
    right: -0.1rem;
  }
</style>