<!--
  <com-templet-hswipe :params="comTHdata"></com-templet-hswipe>
  import comTempletHswipe from "@/components/component/com_templet_hswipe.vue";

  data: function() {
    return {
      comTHdata: {
        object: this,
        name: "comTHdata",
        type: "a-a-n",
        agent: {}
      }
    }
  },
  components: {
    comTempletHswipe
  }
-->


<template>
  <div class="teml-frame" :class="params.type" ref="frame" @touchstart.stop="startHandle" @touchmove.stop="moveHandle" @touchend.stop="endHandle">
    <div>
      <ul :style="moveAnimate" ref="point">
        <div v-if="params.baseInfo"></div>
        <li @click.stop="consultAgent" v-if="plug.valueValid(params.agent.baseInfo.mobile1) || plug.valueValid(params.agent.baseInfo.mobile2)">
          <span v-if="params.type == 'a-a-n'" class="com-flex"><i class="iconfonti" style="font-size:.32rem;line-height:.32rem;">&#xe7d1;</i></span>
          <i v-if="params.type == 'a-a-m'" class="iconfonti">&#xe6ed;</i>
          <label v-if="simply">联系顾问</label><label v-if="!simply">聯絡顧問</label></li>
        <li class="e-bubble" @click.stop="agentQr" v-if="plug.valueValid(params.agent.baseInfo.wechat_num)">
          <span v-if="params.type == 'a-a-n'" class="com-flex"><i class="iconfonti" style="font-size:.32rem;line-height:.32rem;">&#xe7cf;</i></span>
          <i v-if="params.type == 'a-a-m'" class="iconfonti">&#xe6f3;</i>
          <label>添加微信</label>
        </li>
        <li v-if="plug.valueValid(params.agent.baseInfo.email)">
          <button type="button" class="com-btn" ref="email" @click.stop="copyID('email', params.agent.baseInfo.email)" :data-clipboard-text="params.agent.baseInfo.email">
            <span v-if="params.type == 'a-a-n'" class="com-flex"><i class="iconfonti" style="font-size:.32rem;line-height:.32rem;">&#xe7d0;</i></span>
            <i v-if="params.type == 'a-a-m'" class="iconfonti">&#xe6ef;</i>
            <label v-if="simply">发送邮件</label><label v-if="!simply">發送郵件</label>
          </button> 
        </li> 
        <li v-if="plug.valueValid(params.agent.baseInfo.facebook_num)">
          <button type="button" class="com-btn" ref="facebook" @click.stop="copyID('facebook', params.agent.baseInfo.facebook_num)" :data-clipboard-text="params.agent.baseInfo.facebook_num">
            <span v-if="params.type == 'a-a-n'" class="com-flex"><i class="iconfonti" style="font-size:.32rem;line-height:.32rem;">&#xe7d5;</i></span>
            <i v-if="params.type == 'a-a-m'" class="iconfonti">&#xe6f1;</i>
            <label>Facebook</label>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
  import Clipboard from "clipboard";

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
        name: '',
        pos: {
          default: 0,
          value: 0,
          screenW: 0,
          width: 0,
          startX: 0,
          moveX: 0,
          moveEndX: 0,
          differX: 0
        },
        moveAnimate: {transform: "translateX(" + 0 + "rem)","-webkit-transform": "translateX(" + 0 + "rem)"}
      }
    },
    created () {
      this.moveAnimate = {transform: "translateX(" + this.pos.value + "rem)","-webkit-transform": "translateX(" + this.pos.value + "rem)"};
    },
    methods: {
      copyID: function(id, account) {
        if (!plug.valueValid(account)) {
          let _toast = this.simply ? "ID不存在或无效" : "ID不存在或無效";
          this.$toast(_toast);
          return ; 
        }
        let alt1 = id == "email" ? "邮箱地址复制成功" : "Facebook复制成功";
        let alt2 = id == "email" ? "郵箱地址複製成功" : "Facebook複製成功"; 

        const clipboard = new Clipboard(this.$refs[id]);
        clipboard.on("success", (e)=> {
          let _toast = this.simply ? alt1 : alt2;
          this.$toast(_toast);
          clipboard.destroy();  
        }); 
        clipboard.on("error", (e)=> {
          let _toast = this.simply ? "复制失败，请重新复制" : "複製失敗，請重新複製";
          this.$toast(_toast);
          clipboard.destroy();
        }); 
      },
      agentQr: function() {
        let self = this.params.object;
        plug.openAgentQrcode({
          object: self,
          qrcode_type: 1,
          wechat_num: self.agent.baseInfo.wechat_num,
          qrcode: self.agent.baseInfo.wx_qrcode_content
        });
      },
      consultAgent: function() {
        let mphone = this.params.agent.baseInfo.mobile1 || this.params.agent.baseInfo.mobile2;
        window.open('tel:' + mphone); 
        return ;
        if (this.params.type == "a-a-m") {
          this.$parent.$parent.$parent.consultAgent();
          return ;
        }
        if (this.params.type == "a-a-n") {
          this.$parent.consultAgent();
        }
      },
      startHandle: function(e) {
        //阻止冒泡事件
        this.pos.startX = e.touches[0].pageX;
        this.pos.moveX = 0;
        this.pos.screenW = this.$refs.frame.getBoundingClientRect().width / this.fontSize.replace("px", "");
        this.pos.with = this.$refs.point.getBoundingClientRect().width / this.fontSize.replace("px", "");
      },
      moveHandle: function(e) {
        //阻止冒泡事件
        this.pos.moveEndX = e.touches[0].pageX;
        //Y轴偏移位置
        this.pos.moveX = this.pos.moveEndX - this.pos.startX;
        //将px转换为rem
        let remx = this.pos.moveX / this.fontSize.replace("px", "");

        //及时更新位置
        this.pos.differX = this.pos.value + remx;

        this.moveAnimate = {transform: "translateX(" + this.pos.differX + "rem)","-webkit-transform": "translateX(" + this.pos.differX + "rem)"}; 

      },
      endHandle: function(e) {
        //阻止冒泡事件
        if (this.pos.moveEndX == 0) {
          return ;
        }
        let gesture = this.pos.moveEndX - this.pos.startX;

        //右移
        if (gesture > 0 && this.pos.differX > 0) {
          this.pos.differX = 0;

          this.moveAnimate = {
            transform: "translateX(" + this.pos.differX + "rem)", 
            "-webkit-transform": "translateX(" + this.pos.differX + "rem)",
            "transition-duration": "300ms", 
            "-webkit-transition-duration": "300ms"
          } 
        } 
        //左移
        if (gesture < 0) {
          let leftW = this.pos.with - this.pos.screenW;
          if (leftW > 0) {
            if (this.pos.differX < -leftW) {
              this.pos.differX = -leftW;
            }
          } else {
            this.pos.differX = 0;
          }

          this.moveAnimate = {
            transform: "translateX(" + this.pos.differX + "rem)", 
            "-webkit-transform": "translateX(" + this.pos.differX + "rem)",
            "transition-duration": "300ms", 
            "-webkit-transition-duration": "300ms" 
          } 
        }


        //重置
        this.pos.value = this.pos.differX;
        this.pos.moveEndX = 0;
        this.pos.differX = 0;

      }


    }
  }
</script>
<style scoped>
  div.teml-frame {overflow:hidden;width:100%;height:100%;}
  div.teml-frame>div {width:10rem;height:100%;}
  ul {display:inline-block; height: 100%;padding: 0 .08rem;position: absolute;top:0;}
  ul>li {float: left;margin-right: .08rem;margin-left: .08rem;padding-right: .15rem;padding-left: .15rem;}
  ul>li i {top:1px;line-height:.2rem;font-size: .2rem;}
  ul>li button {padding:0;font-weight:300;font-size: .16rem;color: #333;}

  /*--a-a-m--*/
  div.a-a-m {padding-top: .1rem;padding-bottom: .1rem;}
  div.a-a-m ul>li {height: .5rem;line-height: .5rem;border-radius: .08rem;box-shadow: 0 .02rem .1rem rgba(32, 32, 32, .1);font-size: .16rem;color: #333;}
  div.a-a-m ul>li i {margin-right:.05rem;}

  /*--a-a-n--*/
  div.a-a-n ul>li {display: -webkit-flex;display: flex;flex-direction: column;justify-content: center;align-items: center;}
  div.a-a-n ul>li {height:100%;border-radius:.12rem;background-color: #272734;text-align:center;color:#fff;padding-right:.24rem;padding-left:.24rem;}
  div.a-a-n ul>li span {height:.32rem;}
  div.a-a-n ul>li label {display:block;height:.2rem;line-height:.2rem;font-size: .13rem;}
  div.a-a-n ul>li button {width:100%;height:100%;color: #fff;}
</style>