<!--
  <com-templet :params="comTdata"></com-templet>
  import comTemplet from "@/components/component/com_templet.vue";

  data() {
    return {
      comTdata: {
        layer: 0,
        name: "comTdata"
      }
    }
  },
  components: {
    comTemplet
  },
  beforeRouteLeave (to, from, next) {
    if (this.comTdata.layer > 0) {
      this.comTdata.layer -= 1;
      next(false); 
      return ;
    }  
    next(true); 
  }
-->


<template>
  <transition name="fade">
    <dl v-if="show" class="com-mask-frame com-flex">
      <dt class="aux-mask" @click="close"></dt>
      <dd class="com-blastpicker" :class="{comBlast: slide}" style="overflow:visible;">
      </dd>
    </dl>
  </transition>
</template>
  
<script>
  export default {
    name: "",
    props: {
      params: {
        type: Object,
        default: {}
      }
    },
    data () {
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
      },

      controlLayer: function(layer) {
        if (layer == 1) {
          this.open(); 
          return ;
        }
        this.close();
      }
    },
    created () {
      this.controlLayer(this.params.layer);
    },
    watch: {
      "params.layer": function(val, oldVal) {
        this.controlLayer(val);
      }
    }
  }
</script>

<style scoped>
  
</style>