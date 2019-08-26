<template>
  <router-view></router-view>
</template>


<script>
  //import cmn from './common.js';


  export default {
    name: 'iBerPay',
    data () {
      return {
        name: ''
      }
    },
    created () {
      console.log("iBer Pay");
    },
    watch: {
      '$route': function(to, from, next) { 
        //cmn.run();  
      }  
    }
  }
</script>
<style scoped>

</style>