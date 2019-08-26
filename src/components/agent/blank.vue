<template>
  <div class="com-frame" style="background:#fff;">
  </div>
</template>


<script>
  export default {
    name: '',
    data () {
      return {
        content: this.simply ? "iBer世界，赋予你更强的能量，展现非凡的自己！" : "iBer世界，賦予你更强的能量，展現非凡的自己！"
      }
    },
    methods: {
    },
    mounted: function() { 
      this.$nextTick(() => { 
        
      });
    },
    created () {
      document.title = "iBer";
      console.log(window.baseUrl + "/agent/blank");
    },
    watch: {

    }
  }
</script>
<style scoped>
  i {font-size: 1rem;height:1rem;color:#ffaa33;}
  p {color:#ffaa33;font-size: .16rem;padding-right: .25rem;padding-left:.25rem;text-align: center;}
</style>