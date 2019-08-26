import Vue from 'vue';


/* 
 *@名称: Swipe
  <com-swipe index="0" time="2000" auto="true" indicator="true" @change="getSlideCount"></com-swipe>
 **/
Vue.component("com-swipe", {
  template: `
  <div class="com-swipe" @scroll.stop @click.stop @touchstart.stop="startTurn" @touchmove.stop="moveTurn" @touchend.stop="endTurn">
    <div class="com-swipe-wrap">
      <slot></slot>
    </div>
    <p v-if="defaultCount > 1 && indicator == 'true'" class="com-flex cmt-indicator">
      <em v-for="(dx,index) in defaultCount" :class="{active: labelIndex == index}"></em>
    </p>
  </div>
  `, 
  props: {
    index: {type: Number, default: ()=> {return 0}},
    time: {type: Number, default: ()=> {return 0}}, 
    auto: {type: String, default: ()=> {return "true"}},
    indicator: {type: String, default: ()=> {return "true"}},
    vhscroll: {type: String, default: ()=> {return "true"}}  //处理手势垂直滑动时(始点与移动点)，禁止轮播
  },
  data() {
    return {
      stopInterval: null,  //延时对象
      target: null,
      defaultCount: null,
      defaultIndex: null,
      labelIndex: null,
      defaultTime: 2000,
      width: null,  //容器width

      slide: {
        node: null,  //子元素数组
        length: null,  //子元素数量
        loop: null,  //数组上限
        state: false
      },
      turn: {
        prev: null, 
        next: null
      },
      pos: {
        startX: null,
        startY: null,
        moveX: null,
        moveY: null,
        endX: null,
        endY: null,
        distanceX: null,
        distanceY: null,
        stopSlide: false  
      },
    }
  },
  mounted() {
    //解决变量AJAX请求延迟导致帧数为0的情况
    this.$nextTick(()=> {
      window.setTimeout(()=> {
        this.load();
        this.init();
        
        //只有一帧时，不执行轮播
        if (this.defaultCount == 1) {
        return ; 
        }
        this.autoInterval();
      }, 1000); 
    });
  }, 
  created() {
    this.$emit("change", this.defaultIndex);
  },
  watch: {
    defaultIndex(val) {
      this.setIndex(val);
    },
    labelIndex(val) {
      this.$emit("change", val);
    }
  }, 
  methods: {
    startTurn(e) {
      if (this.defaultCount < 2) {
        return ;
      }
      window.clearInterval(this.stopInterval); 
      this.stopSlide = false; 

      this.pos.startX = e.touches[0].pageX;
      this.pos.startY = e.touches[0].pageY;
      this.pos.moveX = 0; 
      this.pos.moveY = 0;
      
      plug.removeClass(this.target.children[this.turn.prev], "animate");
      plug.removeClass(this.target.children[this.defaultIndex], "animate");
      plug.removeClass(this.target.children[this.turn.next], "animate");
    },
    moveTurn(e) {
      if (this.defaultCount < 2) {
        return ;
      }
      if (this.stopSlide && this.vhscroll != "false") {
        return ;
      }
      this.pos.moveX = e.touches[0].pageX;
      this.pos.moveY = e.touches[0].pageY;
      this.pos.distanceX = this.pos.moveX - this.pos.startX;
      this.pos.distanceY = this.pos.moveY - this.pos.startY;

      let tanX = Math.abs(this.pos.distanceX);
      let tanY = Math.abs(this.pos.distanceY);
      let tanXY = tanY/tanX;
      if (tanXY > 1 && this.vhscroll != "false") {
        this.stopSlide = true;
        return ;
      }
      
      //to Right
      if (this.pos.distanceX > 0) {
        this.right();
      } 
      //to Left
      if (this.pos.distanceX < 0) {
        this.left();
      }
    }, 
    endTurn() {  
      if (this.defaultCount < 2) {
        return ;
      }
      plug.addClass(this.target.children[this.turn.prev], "animate");
      plug.addClass(this.target.children[this.defaultIndex], "animate");
      plug.addClass(this.target.children[this.turn.next], "animate");

      if (this.stopSlide && this.vhscroll != "false") {
        this.autoInterval();
        return ;
      } 

      if (this.pos.distanceX == 0) {
        return ;
      }

      //回流-滑动判断标准
      let judge = Math.abs(this.pos.distanceX) - this.width/2;
      
      //滑动 
      if (judge >= 0) {
        //滑动-向右
        if (this.pos.distanceX > 0) {
          plug.setStyle(this.target.children[this.turn.next], "display", "none");
          plug.removeClass(this.target.children[this.turn.next], "animate");
          plug.setStyle(this.target.children[this.turn.next], "transform", "translateX(0)");

          plug.addClass(this.target.children[this.defaultIndex], "animate");
          plug.setStyle(this.target.children[this.defaultIndex], "transform", "translateX(" + this.width + "px)");

          plug.addClass(this.target.children[this.turn.prev], "animate"); 
          plug.setStyle(this.target.children[this.turn.prev], "transform", "translateX(0)");

          //重置序列号
          this.continue(false);
          this.more();

          plug.addClass(this.target.children[this.turn.prev], "animate");
          plug.setStyle(this.target.children[this.turn.prev], "transform", "translateX(-" + this.width + "px )");
          plug.setStyle(this.target.children[this.turn.prev], "display", "block"); 
        } 
        //滑动-向左  
        if (this.pos.distanceX < 0) {
          this.loopSlide();
        }  
      }
      //回流
      else {
        plug.setStyle(this.target.children[this.turn.prev], "transform", "translateX(-" + this.width + "px)");
        plug.setStyle(this.target.children[this.defaultIndex], "transform", "translateX(0)");
        plug.setStyle(this.target.children[this.turn.next], "transform", "translateX(" + this.width + "px)");
      }

      //清除变量
      this.pos.distanceX = null; 
      this.autoInterval();
    }, 
    left() {
      plug.setStyle(this.target.children[this.turn.prev], "transform", "translateX(-" + this.width - this.pos.distanceX + "px)");
      plug.setStyle(this.target.children[this.defaultIndex], "transform", "translateX(" + this.pos.distanceX + "px)");
      plug.setStyle(this.target.children[this.turn.next], "transform", "translateX(" + (this.width + this.pos.distanceX) + "px)");
    }, 
    right() { 
      plug.setStyle(this.target.children[this.turn.prev], "transform", "translateX(-" + (this.width - this.pos.distanceX) + "px)");
      plug.setStyle(this.target.children[this.defaultIndex], "transform", "translateX(" + this.pos.distanceX + "px)");
      plug.setStyle(this.target.children[this.turn.next], "transform", "translateX(" + this.width + this.pos.distanceX + "px)");  
    },
    autoInterval() {
      if (this.auto != "false") {
        this.stopInterval = window.setInterval(()=> {
          this.loopSlide();  
        }, this.defaultTime);  
      }
    },
    loopSlide() { 
      plug.setStyle(this.target.children[this.turn.prev], "display", "none");
      plug.removeClass(this.target.children[this.turn.prev], "animate");
      plug.setStyle(this.target.children[this.turn.prev], "transform", "translateX(0)");
      
      plug.addClass(this.target.children[this.defaultIndex], "animate");
      plug.setStyle(this.target.children[this.defaultIndex], "transform", "translateX(-" + this.width + "px)");

      plug.addClass(this.target.children[this.turn.next], "animate");
      plug.setStyle(this.target.children[this.turn.next], "transform", "translateX(0)");
      
      //重置序列号
      this.continue(true); 
      this.more();   
      
      //延时: 处理只有三帧画面时出现滑动错乱
      window.setTimeout(()=> {
        plug.setStyle(this.target.children[this.turn.next], "transform", "translateX(" + this.width + "px)");
        plug.setStyle(this.target.children[this.turn.next], "display", "block");
        plug.addClass(this.target.children[this.turn.next], "animate");     
      }, 50); 
    },
    continue(state) {
      //递进序列号
      if (state) {
        if (this.defaultIndex == this.slide.loop) {
          this.defaultIndex = 0;
        } else { 
          this.defaultIndex++;
        }
        return ;
      }
      //回流序列号 
      if (this.defaultIndex == 0) {
        this.defaultIndex = this.slide.loop;
      } else { 
        this.defaultIndex--;
      }
    },
    more() {
      //预置上一帧、下一帧
      if (this.defaultIndex == this.slide.loop) {
        this.turn.prev = this.defaultIndex - 1;
        this.turn.next = 0;
      } else if (this.defaultIndex >= 1) {
        this.turn.prev = this.defaultIndex - 1;
        this.turn.next = this.defaultIndex + 1;
      } else { 
        this.turn.prev = this.slide.loop;
        this.turn.next = this.defaultIndex + 1; 
      }
    }, 
    judgeSlide() {
      this.more();
      plug.setStyle(this.target.children[this.turn.prev], "transform", "translateX(-" + this.width + "px)");
      plug.setStyle(this.target.children[this.turn.prev], "display", "block");
      plug.addClass(this.target.children[this.turn.prev], "animate");
       
      plug.setStyle(this.target.children[this.turn.next], "transform", "translateX(" + this.width + "px)");
      plug.setStyle(this.target.children[this.turn.next], "display", "block");
      plug.addClass(this.target.children[this.turn.next], "animate");
    },
    init() {
      plug.setStyle(this.target.children[this.defaultIndex], "display", "block");
      plug.addClass(this.target.children[this.defaultIndex], "animate");

      //只有一帧时，不执行轮播
      if (this.defaultCount == 1) {
        return ;
      }
      this.judgeSlide();
    },
    load() {
      this.target = this.$el.children[0];
      this.width = parseFloat((plug.getStyle(this.$el, "width") || "").replace("px", ""));
      this.defaultCount = this.target.children.length;
      //轮播时间
      if (this.time) {
        this.defaultTime = this.time;
      } else {
        this.defaultTime = 2000;
      }
      //轮播序列号
      if (this.index >= this.defaultCount) {
        this.defaultIndex = this.defaultCount - 1; 
      } else {
        this.defaultIndex = this.index;
      }
      this.setIndex(this.defaultIndex);

      //处理只有2帧情况兼容方案
      if (this.defaultCount == 2) {
        let first = this.target.children[0].cloneNode(true);
        let last = this.target.children[1].cloneNode(true);

        this.target.insertBefore(last, this.target.children[0]);
        this.target.appendChild(first);
      }

      //多帧情况 
      this.slide.node = this.target.children;
      this.slide.length = this.target.children.length;
      this.slide.loop = this.slide.length - 1; 

      if (this.defaultCount == 2) { 
        this.defaultIndex++; 
      }
    },
    setIndex(val) {
      if (this.defaultCount == 2) {
        if (val % 2 == 0) {
          this.labelIndex = 1;
          return ;
        }
        this.labelIndex = 0;
        return ;  
      }
      this.labelIndex = val;
    }
  }
});


/*
*@名称: Swipe Item
  <com-swipe-item></com-swipe-item>
**/ 
Vue.component("com-swipe-item", {
  template: `
  <div class="com-swipe-item">
    <slot></slot>
  </div>
  ` 
}); 