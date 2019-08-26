<!--
  <com-agent-wechat-contact :params="comAWCData"></com-agent-wechat-contact>
  import comAgentWechatContact from "@/components/component/com_agent_wechat_contact.vue";

  comAWCData: {
    layer: 0,  
    name: "comAWCData",
    name_en: "",
    name_zn: "",
    id: "",  
    qr_url: ""
  },

  components: {
    comAgentWechatContact
  },

  beforeRouteLeave (to, from, next) {
    if (this.componentData.layer > 0) {
      this.componentData.layer -= 1;
      next(false); 
      return ;
    }  
    next(true);
  },
-->
<template>
    <transition name="fade">
      <dl v-if="show" class="com-mask-frame com-flex com-wechat-id">
        <dt class="aux-mask" @click="close"></dt>
        <dd class="com-blastpicker wechat" v-if="!type" :class="{comBlast: slide}" style="overflow:visible;">
          <header v-if="simply">健康顾问</header>
          <header v-else>健康顧問</header>
          <div class="qr-show">
            <img :src="params.qr_url" alt="">
          </div>
          <p v-if="simply" class="long">长按添加微信好友</p>
          <p v-else class="long">長按添加微信好友</p>
          <h2>{{params.name_en}}</h2>
          <h3>{{params.name_zn}}</h3>
          <button v-if="simply" id="privWechatID" @click="copyWechatID" class="com-btn" :data-clipboard-text="params.id">点击复制WeChat ID</button> 
          <button v-else id="privWechatID" @click="copyWechatID" class="com-btn"
            :data-clipboard-text="params.id">點擊複製WeChat ID</button>
          <button v-if="simply" @click="contact" class="com-btn aux-btn">请健康顾问联系我</button>
          <button v-else @click="contact" class="com-btn aux-btn">請健康顧問聯絡我</button>
          <i class="iconfont" style="position:absolute;width:1.2rem;font-size:.28rem;line-height:.28rem;bottom: -.48rem;left:50%;margin-left:-.6rem;color:#fff;" @click="close">&#xe686;</i>
        </dd> 
        <dd class="com-blastpicker contact" v-if="type" :class="{comBlast: slide}" style="overflow:visible;">
          <header v-if="!simply">
            <h2>健康顧問</h2>
            <p>您的私隱將嚴格保密</p>
          </header>
          <header v-if="simply">
            <h2>健康顾问</h2>
            <p>您的私隐将严格保密</p>
          </header>
          <i @click="close" style="position:absolute;top:.08rem;right:.1rem;color:#fff;font-size:.1rem;" class="iconfont">&#xe67b;</i>
          <p v-if="!simply" class="com-disx standard"><label for="">稱呼：</label><input type="text" class="com-btn aux-btn standard" value="" placeholder="請輸入稱呼"></p>
          <p v-if="!simply" class="com-disx standard"><label for="">區號：</label><input type="text" class="com-btn aux-btn standard" v-model="valueList[0].value" value="" @click="pickerHandle(0)" placeholder="請選擇區號" readonly></p>
          <p v-if="!simply" class="com-disx standard"><label for="">電話：</label><input type="text" class="com-btn aux-btn standard" value="" placeholder="請輸入您的電話"></p>

          <p v-if="simply" class="com-disx standard"><label for="">称呼：</label><input type="text" class="com-btn aux-btn standard" value="" placeholder="请输入称呼"></p>
          <p v-if="simply" class="com-disx standard"><label for="">区号：</label><input type="text" class="com-btn aux-btn standard" v-model="valueList[0].value" value="" @click="pickerHandle(0)" placeholder="请选择区号" readonly></p>
          <p v-if="simply" class="com-disx standard"><label for="">电话：</label><input type="text" class="com-btn aux-btn standard" value="" placeholder="请输入您的电话"></p>

          <div class="com-disx">
            <label for="">留言：</label>
            <textarea></textarea>
          </div>
          <button v-if="!simply" class="com-btn aux-btn com-mgrl" @click="submitHandle">確定</button>
          <button v-if="simply" class="com-btn aux-btn com-mgrl" @click="submitHandle">确定</button>

          <p v-if="!simply" class="switch" @click="switchType">添加健康顧問微信</p>
          <p v-if="simply" class="switch" @click="switchType">添加健康顾问微信</p>
          <i class="iconfont" style="position:absolute;width:1.2rem;font-size:.28rem;line-height:.28rem;bottom: -.48rem;left:50%;margin-left:-.6rem;color:#fff;" @click="close">&#xe686;</i> 
        </dd>  


        <mt-popup v-model="pickerVState" position="bottom">
          <mt-picker :slots="pickerSlots" :itemHeight="50" :showToolbar="true" class="select-frame" @change="onValuesChange" valueKey="value">
            <div style="width:.54rem;"><span @click="cancel">取消</span></div>
            <div v-if="!simply" style="flex:1;font-size:.17rem;color:#2a2a2a;">請選擇區號</div>
            <div v-if="!simply" style="width:.54rem;"><span @click="confirm">確定</span></div>  

            <div v-if="simply" style="flex:1;font-size:.17rem;color:#2a2a2a;">请选择区号</div>
            <div v-if="simply" style="width:.54rem;"><span @click="confirm">确定</span></div>  
          </mt-picker>
        </mt-popup>
      </dl>  
    </transition>
  </template>
  
  
  <script>
    // import Vue from 'vue';
    import { Popup, Picker } from 'mint-ui';
    // Vue.component(Popup.name, Popup);
    // Vue.component(Picker.name, Picker);

    import Clipboard from "clipboard";
  
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
          type: false,
          submitData: {
            name: "",
            content: ""
          },
          pickerVState: false,
          valueList: [
            {value: "", id: ""}
          ],
          remarkList: [
            {value: "", id: ""}
          ],  
          pickerSlots: [],
          itemList: [  //预加载数据
            [
              {value:'+852', id: 0},
              {value:'+853', id: 1},
              {value:'+86', id: 2},
              {value:'+1', id: 3}
            ]
          ]
        }
      },
      components: {
        'mt-popup': Popup,
        'mt-picker': Picker,
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
          }, 50);
        },
        copyWechatID: function() {
          const clipboard = new Clipboard("#privWechatID");
          clipboard.on("success", (e)=> {
            let _toast = this.simply ? "已复制到粘贴板" : "已複製到粘貼板";
            this.$toast(_toast);
            clipboard.destroy();  
          }); 
          clipboard.on("error", (e)=> {
            let _toast = this.simply ? "复制失败，请重新复制" : "複製失敗，請重新複製";
            this.$toast(_toast);
            clipboard.destroy();
          }); 
        },
        contact: function() {
          this.type = true; 
        },
        switchType: function() {
          this.type = false;
        },
        pickerHandle: function(id) {      
          let _val = this.valueList[id].value;
          let _id = this.valueList[id].id;
          let initItem = 0; 
          if (id != "") {    
            this.itemList[id].forEach((value, index, array)=> {
              if (value.id == _id) { 
                initItem = index;      
              } 
            }); 
          }
          this.selectList = [{  
            flex: 1,
            defaultIndex: initItem,   
            values: this.itemList[id] 
          }];

          this.pickerSlots = [{   
            flex: 1,
            defaultIndex: 0,  
            values: this.itemList[id] 
          }]; 
          this.indexItem = id; 
          this.pickerVState = true;
          this.remarkList[this.indexItem].value = this.itemList[id][this.selectList[0].defaultIndex].label; 
          this.remarkList[this.indexItem].id = this.itemList[id][this.selectList[0].defaultIndex].id; 
        }, 
        onValuesChange: function(picker, values) {
          if (values[0] != undefined) {  
            this.remarkList[this.indexItem].value = values[0].value; 
            this.remarkList[this.indexItem].id = values[0].id;
          } 
        }, 
        cancel: function() {
          this.pickerVState = false;
        }, 
        confirm: function() { 
          if (this.remarkList[this.indexItem].value == undefined) {
            let _toast = this.simply ? "请选择区号" : "請選擇區號";
            this.$toast(_toast);
            return ;
          }
          this.pickerVState = false; 
          this.valueList[this.indexItem].value = this.remarkList[this.indexItem].value;
          this.valueList[this.indexItem].id = this.remarkList[this.indexItem].id;
        },
        submitHandle: function() {
          if (this.submitData.name == "") {
            let _toast = this.simply ? "请填写称呼" : "請填寫稱呼";
            this.$toast(_toast);
            return ; 
          } 
          if (this.valueList[0].value == "") {
            let _toast = this.simply ? "请选择区号" : "請選擇區號";
            this.$toast(_toast);
            return ;
          }
          if (this.submitData.phone == "") {
            let _toast = this.simply ? "请填写手机号" : "請填寫手機號";
            this.$toast(_toast);
            return ; 
          } 
          if ((this.valueList[0].id == "0" || this.valueList[0].id == "1") && this.submitData.phone.length != 8) {
            let _toast = this.simply ? "请填写正确的手机号码" : "請填寫正確的手機號碼";
            this.$toast(_toast);
            return false;    
          }   
          if (this.valueList[0].id == "2" && !(/^1[234578]\d{9}$/g.test(this.submitData.phone))) {
            let _toast = this.simply ? "请填写正确的手机号码" : "請填寫正確的手機號碼";
            this.$toast(_toast);
            return false;   
          }  
          if (this.valueList[0].id == "3" && this.submitData.phone.length != 10) {
            let _toast = this.simply ? "请填写正确的手机号码" : "請填寫正確的手機號碼";
            this.$toast(_toast);
            return false;    
          } 
          if (this.submitData.content == "") {
            let _toast = this.simply ? "请填写留言" : "請填寫留言";
            this.$toast(_toast);
            return ; 
          } 

          //提交

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
    dl>dd {
      width:3.26rem;
      background:#fff;
      border-radius: .16rem;
      text-align: center;
    }
    dd.wechat header {
      height: 1.55rem;
      padding-top: .32rem;
      font-size: .24rem;
      color: #fff;
      text-align: center;
      background: url('https://static.iberhk.com/v2/web/images/common/banner.png') no-repeat;
      background-size: cover;
      border-top-right-radius: .16rem;
      border-top-left-radius: .16rem;
    }
    dd.wechat div.qr-show {
      width: 1.6rem;
      height: 1.6rem;
      border-radius: .1rem;
      -webkit-border-radius: .1rem;
      margin: -.8rem auto 0;
      padding: .05rem;
      background: #fff;
    }
    dd.wechat div.qr-show img {
      width: 100%;
      height: 100%; 
    }
    dd.wechat p.long { 
      font-size: .12rem;
      color: #979797;
      margin: .13rem auto;
    }
    dd.wechat h2 {
      font-size: .20rem;
      color: #333;
      margin: 0;
      height: .24rem;
      line-height: .24rem;
      margin-bottom: .05rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    dd.wechat h3 { 
      font-size: .18rem;
      color: #333;
      margin: 0;
    }
    dd.wechat button {
      margin-top: 0.16rem;
      color: #3364e4;
      font-size: .16rem;
      margin-bottom: .25rem;
    }

    dd.contact {
      padding-bottom: .25rem;
    }
    dd.contact header {
      height: .92rem;
      padding-top: .16rem;
      padding-bottom: .16rem;
      color: #fff;
      text-align: center;
      background: url(https://static.iberhk.com/v2/web/images/common/banner.png) no-repeat;
      background-size: cover;
    }
    dd.contact header h2 {
      padding-top: .08rem;
      font-size: .24rem;
    }
    dd.contact header p {
      font-size: .12rem;
      height: .2rem;
      margin-top: .1rem;
    }
    dd.contact p.standard {
      color: #333;
      font-size: .16rem;
      margin: .15rem 0;
      height: .3rem;
      line-height: .3rem;
      padding-right: .35rem;
    }
    dd.contact p.standard label {
      width: .86rem;
      text-align: right;
    }
    dd.contact p.standard input.standard {
      flex: 1;
      height: .3rem;
      padding-left: .04rem;
      border-bottom: 1px solid #dedfe0;
      font-size: .14rem;
      font-weight: lighter;
    }
    input::-webkit-input-placeholder {
      color: #BEBEBE;
    }
    dd.contact>div {
      padding-right: .35rem;
      font-size: .16rem;
    }
    dd.contact>div label {
      width: .86rem;
      text-align: right;
    }
    dd.contact>div textarea {
      flex: 1;
      padding: .04rem;
      border: 1px solid #dedfe0;
      height: .8rem;
    }
    dd.contact button {
      display: block;
      height: .4rem;
      font-size: .16rem;
      background: #3364e4;
      color: #fff;
      width: 2rem;
      border-radius: .1rem;
      -webkit-border-radius: .1rem;
      margin-top: .4rem;
    }
    dd.contact button:active {
      background: #0050B3;
    }
    dd.contact p.switch {
      margin-top: .1rem;
      font-size: .16rem;
      color: #3364e4;
      text-align: center;
    }
    
  </style>