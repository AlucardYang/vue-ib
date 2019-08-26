<!--
  <com-templet-name :params="comTNdata"></com-templet-name>
  import comTempletName from "@/components/component/com_templet_name.vue";

  data() {
    return {
      comTNdata: {
        layer: 0,
        name: "comTNdata"
      }
    }
  },
  components: {
    comTempletName
  },
  beforeRouteLeave (to, from, next) {
    if (this.comTNdata.layer > 0) {
      this.comTNdata.layer -= 1;
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
        <div>
          <img src="https://static.iberhk.com/v2/web/images/agent/a_a_l_avator.png" alt="">
          <em><i class="iconfonti">&#xe6f5;</i></em>
        </div>
        <h3><label v-if="simply">实名认证已通过</label><label v-if="!simply">實名認證已通過</label></h3>
        <p><label v-if="simply">身份信息经iBer认证真实有效</label><label v-if="!simply">身份信息經iBer認證真實有效</label></p>
        <i class="iconfont com-mask-close" @click="close">&#xe686;</i>
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
  dd {padding:.32rem;width: 2.63rem;border-radius: .1rem;box-shadow: 0 .02rem .2rem 0 rgba(0, 0, 0, .2);text-align: center;background-color: #fff;}
  dd>h3 {margin-bottom: .06rem;height: .21rem;line-height: .21rem;}
  dd>p {line-height: .16rem;font-size: .13rem;color: #3a3a3a;}
  
  dd>div {width: .85rem;height:.8rem;margin: auto;margin-bottom:.32rem;}
  dd>div img {width: 100%;height:100%;}
  dd>div em {position: absolute;right: .03rem;bottom: 0;padding:.01rem;width:.22rem;height:.22rem;border-radius: 100%;background-color:#fff;}
  dd>div i {line-height: .12rem;font-size: .2rem;color: #3364e4;}
</style>