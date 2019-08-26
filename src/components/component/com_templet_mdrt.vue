<!--
  <com-templet-mdrt :params="comTMDRTdata"></com-templet-mdrt>
  import comTempletMdrt from "@/components/component/com_templet_mdrt.vue";

  data() {
    return {
      comTMDRTdata: {
        layer: 0,
        name: "comTMDRTdata"
      }
    }
  },
  components: {
    comTempletMdrt
  },
  beforeRouteLeave (to, from, next) {
    if (this.comTMDRTdata.layer > 0) {
      this.comTMDRTdata.layer -= 1;
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
      <dd class="com-blastpicker com-bgrs" :class="{comBlast: slide}" style="overflow:visible;">
        <i v-if="params.level == 1" class="iconfonti">&#xe71a;</i><!--MDRT-->
        <i v-if="params.level == 2" class="iconfonti">&#xe720;</i><!--COT-->
        <i v-if="params.level == 3" class="iconfonti">&#xe71e;</i><!--TOT-->
        <i v-if="params.level == 4" class="iconfonti">&#xe71b;</i><!--QUalifying & Life Member-->
        <h3>MDRT<label v-if="simply">认证</label><label v-if="!simply">認證</label></h3>
        <div>
          <label v-if="simply">MDRT（Million Dollar Round Table）百万圆桌，寿险理财专业人士的最高组织，其会员均是世界一流的寿险与金融服务专业人士，具有出色的专业知识、严谨的道德操守、优秀的客户服务。</label>
          <label v-if="!simply">MDRT（Million Dollar Round Table）百萬圓桌，壽險理財專業人士的最高組織，其會員均是世界一流的壽險與金融服務專業人士，具有出色的專業知識、嚴謹的道德操守、優秀的客戶服務。</label>
        </div>
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
  dd {padding: .28rem;padding-top: .36rem;width: 2.62rem;text-align: center;border-radius: .04rem;}
  dd>i:first-child {line-height: .8rem;font-size: .8rem;}
  dd h3 {margin-top: .5rem;margin-bottom: .14rem;height: .16rem;line-height: .16rem;font-size: .17rem;}
  dd div {line-height: .2rem;text-align: left;font-size: .12rem;}

  dd>i:first-child {color:#111;}
  dd {background-image:url(https://static.iberhk.com/v2/web/images/agent/a_a_l_mdrt.png);}
  dd h3 {color: #111;}
  dd div {color: #666;}
</style>