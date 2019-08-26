<!--
  <com-agent-wechat-album :params="comAAMData"></com-agent-wechat-album>
  import comAgentAlbum from "@/components/component/com_agent_album.vue";

  comAAMData: {
    layer: 0, 
    name: "comAAMData",
    imgArray: [],
    index: 0
  },

  components: {
    comAgentAlbum
  },

  beforeRouteLeave (to, from, next) {
    if (this.comAAMData.layer > 0) {
      this.comAAMData.layer -= 1;
      next(false); 
      return ;
    }  
    next(true); 
  },
-->

<template>
  <transition name="fade">
    <dl v-if="show" class="com-mask-frame com-flex priv-agent-album">
      <dd class="com-blastpicker" :class="{comBlast: slide}">
        <div class="mask" @click.stop="close"></div>
        <mt-swipe :auto="0" :show-indicators="isShow" :defaultIndex="params.index">
          <mt-swipe-item v-for="(dx, index) in params.imgArray" :key="index">
            <table><tr><td @click.stop="close">
              <img v-if="plug.qihu" :src="qihuweibo(dx.url)" alt="" />
              <img v-else :src="dx.url" alt="" />
            </td></tr></table>
          </mt-swipe-item>
        </mt-swipe>
      </dd>   
      <p style="position:absolute;width:100%;top:0;left:0;color:#fff;padding:.1rem .15rem;">
        <span class="e-bubble" @click.stop="close">
          <i class="iconfonti close" @click.stop="close" style="margin-right:.05rem;font-size:.14rem;">&#xe7cc;</i>返回
        </span>  
      </p>
    </dl>  
  </transition>
</template>


<script>
  // import Vue from 'vue';
  import { Swipe, SwipeItem } from 'mint-ui';
  // Vue.component(Swipe.name, Swipe);
  // Vue.component(SwipeItem.name, SwipeItem);


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
        slide: false,
        isShow: true
      }
    },
    components: {
      'mt-swipe': Swipe,
      'mt-swipe-item': SwipeItem,
    },
    methods: {
      //关闭
      close: function(e) {
        if (e != undefined && e.target != e.currentTarget) {
          return ;
        }
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

      //兼容360微博相册浏览卡顿BUG
      qihuweibo: function(url) {
        return url + "?x-oss-process=image/resize,w_250"; 
      },

      controlLayer: function(layer) {
        if (layer == 1) {
          if (this.params.imgArray.length < 1) {
            this.isShow = false;
          }
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
  dd {
    width: 100%;
    height: 100%; 
    padding: .5rem .25rem;
  }
  div.mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000;
    opacity: 0.8;
  }
  table {width:100%;height:100%;z-index: 99;}
	table tr>td {padding:0;}
	table img {display:block;width:100%;height:auto;background:#eee;}
</style>