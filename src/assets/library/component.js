import Vue from 'vue';


/*
 *@组件
 *---------------------------------------------------------------------
 *---------------------------------------------------------------------
 *---------------------------------------------------------------------
 *---------------------------------------------------------------------
 *---------------------------------------------------------------------
 **/
/*
 *@名称：页面加载框
  <com-page-loading :params="pageLoading"></com-page-loading>
  pageLoading: {
    layer: 0, //0: 关闭  1: 加载  2: 错误
    info: ""
  }
  intercept: (msg)=> {
    if (plug.valueValid(msg)) { 
      this.$root.pageLoading.info = msg;
    }  
    this.$root.pageLoading.layer = 2;
  } 
 **/
Vue.component('com-page-loading', {
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
    <!--页面加载中-->
    <div v-if="show" class="com-screen com-page-loading">
      <div v-if="params.layer == 1" class="com-flexv com-screen page">
        <com-spinner type="bounce"></com-spinner>
        <p>{{info}}</p>
      </div>
      <!--错误页-->
      <div v-if="params.layer == 2" class="com-flexv com-screen error">
        <!--<i class="iconfonti">&#xe601;</i>-->
        <img :src="img_src" alt="">
        <div>
          <p v-if="info != ''">{{info}}</p>
          <p v-if="info == ''">{{plug.sm(simply, '加载失败')}}</p>
          <p v-if="info == ''">{{plug.sm(simply, '请检查网络后重试')}}</p>
          <button v-if="button" type="button" @click="flush" class="com-btn">{{plug.sm(simply, '重新加載')}}</button>
        </div>
      </div>
    </div>
  </transition>
  `,
  data: function() {
    return {
      show: false,
      img_src: "https://static.iberhk.com/v2/common/reqres_error.png",
      info: "",
      button: true
    } 
  }, 
  created: function() {
    this.controlVisual(this.params.layer);
  },
  watch: {
    "params.layer": function(val) {
      this.controlVisual(val);
    } 
  },
  methods: { 
    open: function() { 
      this.show = true;  
    },
    close: function() {
      this.show = false; 
      this.$root.pageLoading.layer = 0;
    },
    controlVisual: function(val) {
      if (val == 0) {
        this.close();
        return ;
      }
      if (val == 1) {
        this.info = plug.sm(this.simply, '頁面正在加載中');
      }
      if (val == 2) {
        this.info = "";
      }
      if (this.params.src) {
        this.img_src = this.params.src;
      }
      if (typeof this.params.button != 'undefined') {
        this.button = this.params.button;
      }
      if (this.params.info) {
        this.info = this.params.info;
      }
      this.open();
    },
    flush: function() {
      if (this.params.callback) {
        this.params.callback(this);
        return ;
      }
      window.location.reload();
    }
  }
});


/*
 *@名称：加载数据框
  <com-loading :params="loading"></com-loading>
 **/
Vue.component('com-loading', {
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
    <dl v-if="show" class="com-mask-layer com-flex cmt-loading">
      <dt class="trans" @touchmove.prevent.stop></dt>
      <dd class="com-flexv" :class="{'cmt-show': slide}">
        <com-spinner></com-spinner>
        <p>{{info}}</p>
      </dd>
    </dl>
  </transition>
  `,
  data: function() {
    return {
      show: false,
      slide: false,
      info: this.simply ? "加载数据中" : "加載數據中"
    } 
  }, 
  created: function() {
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
      window.setTimeout(()=> {
        this.slide = true;
      }, 50);
    },
    close: function() {
      this.slide = false;
      window.setTimeout(()=> {
        this.show = false;
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
 *@名称：业务操作框
  <com-progress :params="progress"></com-progress>
  this.$root.progress = {layer: 0, info: ""};
 **/
Vue.component('com-progress', {
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
    <dl v-if="show" class="com-mask-layer com-flex cmt-progress">
      <dt class="trans"></dt>
      <dd class="com-flex" :class="{'cmt-show': slide}">
        <com-spinner></com-spinner>
        <em>{{info}}</em>
      </dd>
    </dl>
  </transition>
  `, 
  data: function() {
    return {
      show: false,
      slide: false,
      info: this.simply ? "数据提交中" : "數據提交中"
    } 
  }, 
  created: function() {
    this.comVisual(this.params.layer);
  },
  watch: {    
    'params.layer': function(val) {
      this.comVisual(val);
    }
  },
  methods: {
    open: function(info) {
      if (plug.valueValid(info)) {
        this.info = info;
      }
      this.show = true;
      window.setTimeout(()=> {
        this.slide = true;
      }, 50);
    },
    close: function() {
      this.slide = false;
      window.setTimeout(()=> {
        this.show = false;
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
 *@名称：加载动画
  <com-spinner></com-spinner>
 **/
Vue.component('com-spinner', {
  props: {
    type: {
      type: String,
      default: ()=> {
        return "default" 
      }
    }
  },
  template: `
    <div class="com-spinner" :class="type">
      <!--<com-spinner></com-spinner>-->
      <div v-if="type == 'default'" class="default"></div>
      <!--<com-spinner type='bounce'></com-spinner>-->
      <div v-if="type == 'bounce'" class="bounce bounce-inner"></div>
      <div v-if="type == 'bounce'" class="bounce bounce-outer"></div>
      <!--<com-spinner type="triple"></com-spinner>-->
      <ul v-if="type == 'triple'" class="aux com-disx triple">
        <li class="left"></li>
        <li class="center"></li>
        <li class="right"></li>
      </ul>
      <!--<com-spinner type='circle'></com-spinner>-->
      <ul v-if="type == 'circle'" class="aux circle">
        <li class="li-01"></li>
        <li class="li-02"></li>
        <li class="li-03"></li>
        <li class="li-04"></li>
        <li class="li-05"></li>
        <li class="li-06"></li>
        <li class="li-07"></li>
        <li class="li-08"></li>
        <li class="li-09"></li>
        <li class="li-10"></li>
        <li class="li-11"></li>
        <li class="li-12"></li>
        <li class="li-13"></li>
      </ul>
    </div>
  `,
  data: function() {
    return {
      show: false
    } 
  }, 
  created: function() {},
  watch: {},
  methods: {}
});


/*
 *@名称：加载更多
  <com-more-load></com-more-load>
 **/
Vue.component("com-more-load", {
  template: `
    <div class='com-flex com-load-more'>
      <com-spinner type='triple'></com-spinner>
    </div>
  `
});


/*
 *@名称：加载到底
  <com-more-end :simply='simply'></com-more-end>
 **/
Vue.component("com-more-end", {
  props: {
    simply: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  template: `
    <div class='com-flex com-more-end'>
      --  <label v-if="simply">我是有底线的啦</label><label v-else>我是有底線的啦</label>  --
    </div>
  `
});










/*
 *@指令
 *---------------------------------------------------------------------
 *---------------------------------------------------------------------
 *---------------------------------------------------------------------
 *---------------------------------------------------------------------
 *---------------------------------------------------------------------
 **/

 
 /*
 *@图片懒加载
 *@语法
 <ysun v-loading src=''></ysun>
 **/
Vue.directive("loading", {
  inserted: function(el) {
    let parent = el.parentNode;

    let attr = null;
    if (window.getComputedStyle) {
      attr = window.getComputedStyle(el, null);
    } else {
      attr = el.currentStyle;
    }
    
    let css = {
      position: "absolute",
      top: attr['top'] == "auto" ? "0" : el.offsetTop + "px",
      right: attr.right == "auto" ? "0" : attr['right'],
      bottom: attr.bottom == "auto" ? "0" : attr['bottom'],
      left: attr.left == "auto" ? "0" : el.offsetLeft + "px",
      width: attr['width'],
      height: attr['height'], 
      'border-radius': attr['border-radius'],
      'box-shadow': attr['box-shadow']
    }
    let string = "";
    for (let i in css) {
      string += ";" + i + ":" + css[i];
    }

    let div = document.createElement("div");
    div.setAttribute("style", string);
    div.setAttribute("class", "com-flexv com-el-load");

    let load = document.createElement("div");
    let tiny = el.getAttribute("vtiny");
    if (typeof tiny != 'undefined') {
      load.setAttribute("class", "com-spinner-snake aux-tiny");
    } else {
      load.setAttribute("class", "com-spinner-snake");
    }
    div.appendChild(load); 

    let state = document.createElement("div");
    state.setAttribute("style", ";display:none;");
    state.setAttribute("class", "com-flexv com-spinner-failed");
    state.innerHTML = `<i class="iconfonti">&#xe600;</i>`;
    div.appendChild(state);

    parent.appendChild(div);

    //业务逻辑
    let loadFailed = function() {
      load.setAttribute("style", ";display:none;");
      state.setAttribute("style", ";");
    };  

    let imgObj = null;
    let img = new Image();
    img.onload = function() {
      div.remove();  
    }
    img.onerror = function() {
      loadFailed(); 
    }

    let count = 1;
    let interval = window.setInterval(()=> {
      count++;
      imgObj = el.getAttribute("src");
      if (imgObj) {
        img.src = imgObj;
        window.clearInterval(interval);
        return ;
      }
      //取整
      let inter = count / 5;
      if (count % 5 == 0) {
        if (inter > 15) {   
          window.clearInterval(interval); 
          loadFailed(); 
        }
      }
    }, 200);
  }
});


/*
 *@名称: 无限滚动
  <ysun v-load-scroll="loadMore" :scroll-distance="calcBottom(1.32)"></ysun>
  calcBottom(value) {
    return value * this.font_size;
  }
 **/
Vue.directive("load-scroll", {
  inserted(el, binding) {
    let bottom = 10; 
    let bottomState = false;
    
    let distance = el.getAttribute('scroll-distance');
    if (distance != null) {
      bottom = distance;
    }

    el.addEventListener("scroll", (e)=> {
      let h = el.clientHeight;

      let sh = e.target.scrollHeight;
      let top = e.target.scrollTop;
      let d = sh - h; 
        
      //距离底部距离10px时触发事件
      if (top > d - bottom) {
        //阻止执行多次加载
        if (bottomState) { 
          return ;
        }
        bottomState = true;
         
        if (binding.expression) { 
          binding.value();
        } 
        return ;
      } 
      bottomState = false;
    });
  } 
}); 
