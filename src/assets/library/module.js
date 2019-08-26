/*
 *@名称：
  <com-ysun v-></com-ysun>
 **/
Vue.directive("", {
  inserted: function(el) {
    console.log(el);
  } 
}); 


/*
 *@名称：
  <com-ysun></com-ysun>
 **/
Vue.component("com-ysun", {
  props: {
    params: {
      type: Object,
      default: ()=> {
        return {} 
      }
    }
  },
  template: `
    <div class="com-"></div>
  `,
  data() {
    return {}
  },
  created() {},
  watch: {},
  methods: {}
});


/*
 *@名称：
  <com-ysun></com-ysun>
 **/
Vue.component('com-ysun', {
  props: {
    params: {
      type: Object,
      default: ()=> {
        return {} 
      }
    }
  },
  template: `
  <transition class="fade">
    <dl v-if="show" class="com-mask-layer cmt-">
      <dt class="aux-mask" @touchmove.prevent.stop></dt>
      <dd></dd>
    </dl>
  </transition>
  `,
  data() {
    return {
      show: false
    } 
  }, 
  created() {
    this.comVisual(this.params.layer);
  },
  watch: {    
    'params.layer': function(val) {
      this.comVisual(val);
    }
  },
  methods: {
    open: function() {
      this.show = true;
    },
    close: function() {
      this.show = false; 
    },    
    comVisual: function(layer) {
      if (layer == 0) {
        this.close();
        return ; 
      } 
      if (plug.valueValid(this.params.info)) {
        this.info = this.params.info;
      }
      this.open();
    }
  }
});


/*
 *@名称：模态框@从中心向四周展开
 <com-blast-></com-blast->
 **/
Vue.component("com-blast-", {
  props: {
    params: {
      type: Object,
      default: ()=> {
        return {} 
      }
    }
  },
  template: `
    <transition name="fade">
      <dl v-if="show" class="com-mask-layer com-flex cmt-">
        <dt class="cmt-mask" @click="close" @touchmove.prevent.stop></dt>
        <dd class="com-blastpicker" :class="{comBlast: slide}">
          <slot></slot>
        </dd>
      </dl>
    </transition>
  `,
  data() {
    return {
      show: false,
      slide: false
    }
  },
  created() {
    this.comVisual(this.params.layer);
  },
  watch: {    
    'params.layer': function(val) {
      this.comVisual(val);
    }
  },
  methods: {
    //关闭
    close: function() {
      this.slide = false;
      window.setTimeout(()=> {
        this.show = false;
      }, 50);
    },
    //打开
    open: function() {
      this.show = true;
      window.setTimeout(()=> {
        this.slide = true;
      }, 50);
    },
    comVisual: function(layer) {
      if (layer == 0) {
        this.close();
        return ; 
      } 
      if (plug.valueValid(this.params.info)) {
        this.info = this.params.info;
      }
      this.open();
    }
  }
});


/*
 *@名称：模态框@从下向上
 <com-slip-></com-slip->
 **/
Vue.component("com-slip-", {
  props: {
    params: {
      type: Object,
      default: ()=> {
        return {} 
      }
    }
  },
  template: `
    <transition name="fade">
      <dl v-if="show" class="com-mask-layer com-disx cmt-">
        <dt class="cmt-mask" @click="close"></dt>
        <dd class="com-slippicker" :class="{comSlip: slide}">
          <slot></slot>
        </dd>
      </dl>
    </transition>
  `,
  data() {
    return {
      show: false,
      slide: false
    }
  },
  created() {
    this.comVisual(this.params.layer);
  },
  watch: {    
    'params.layer': function(val) {
      this.comVisual(val);
    }
  },
  methods: {
    //关闭
    close() {
      this.slide = false;
      window.setTimeout(()=> {
        this.show = false;
      }, 50); 
    },
    //打开
    open() {
      this.show = true;
      window.setTimeout(()=> {
        this.slide = true;
      }, 50);
    },
    comVisual(layer) {
      if (layer == 0) {
        this.close();
        return ; 
      } 
      if (plug.valueValid(this.params.info)) {
        this.info = this.params.info;
      }
      this.open();
    }
  }
});