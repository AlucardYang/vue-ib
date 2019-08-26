<template>
  <div class="com-frame com-flexv iber-train-success">
    <i class="iconfont">&#xe6e8;</i>
    <h3><label v-if="simply">恭喜您，签到成功！</label><label v-else>恭喜您，簽到成功！</label></h3>
    <p v-if="simply">
      <label v-if="simply">友情提示：请提前安排参加培训时间，避免错过本次培训。</label><label v-else>友情提示：請提前安排參加培訓時間，避免錯過本次培訓。</label>
    </p>
  </div>
</template>


<script>
  export default {
    name: '',
    data () {
      return {
        name: ''
      }
    },
    created () {
      document.title = this.simply ? "签到成功" : "簽到成功";
    }
  }
</script>
<style scoped>
  .iber-train-success {padding: 0 .25rem;text-align: center;}
  i {font-size: 1rem;line-height:1rem;color:#09BB07;}
  h3 {line-height: .4rem;margin-top:.3rem;color:#ff5a04;}
  p {font-size: .12rem;color:#999;}
</style>