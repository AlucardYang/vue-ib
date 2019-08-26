<!--
  <com-agent-avatar :params="comAARData"></com-agent-avatar>
  import comAgentAvatar from "@/components/component/com_agent_avatar.vue";

  comAARData: {
    layer: 0, 
    name: "comAARData",
    id: "",
    qr_url: ""
  },

  components: {
    comAgentAvatar
  },

  beforeRouteLeave (to, from, next) {
    if (this.comAARData.layer > 0) {
      this.comAARData.layer -= 1;
      next(false); 
      return ;
    }   
    next(true);
  }, 
-->

<template>
  <transition name="fade">
    <dl v-if="show" @click="close" class="com-mask-frame com-flex">
      <dt class="aux-mask e-bubble" style="opacity:1;"></dt>
      <dd class="com-blastpicker" :class="{comBlast: slide}">
        <img :src="params.url" alt="">
      </dd>   
    </dl>  
  </transition>
</template>
  
  
<script>
  export default {
    name: '',
    props: {
      params: {
        type: Object,
        default: {}
      }
    },
    data: function() {
      return {
        show: false,
        slide: false
      }
    },
    methods: {
      //关闭
      close: function() {
        this.slide = false;
        window.setTimeout(()=> {
          this.show = false;
          this.$parent[this.params.name].layer = 0;
        }, 50);
      },
      //打开
      open: function() {
        this.show = true;
        window.setTimeout(()=> {  
          this.slide = true; 
          this.$parent[this.params.name].layer = 1;
        }, 50);
      }
    },
    created () {
      if (this.params.layer == 1) {
        this.open();
      } else { 
        this.close();
      }
    },
    watch: {
      "params.layer": function(val, oldVal) {
        if (val == 1) {
          this.open();
        } else { 
          this.close();
        }
      }  
    }
  }
</script>
<style scoped>
  dd {
    width: 100%;
  }
  img {
    width: 100%;
  }
</style>