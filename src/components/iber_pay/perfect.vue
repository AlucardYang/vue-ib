<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar" style="padding-bottom:.3rem;padding-top:.2rem;">
      <dl class="select">
        <dt><span>*</span>服務顧問</dt>
        <dd class="active" @click="selectItem(0)">
          <input type="text" class="com-btn aux-btn" v-model="selectValue[0].value" placeholder="請選擇" value="" readonly>
          <i class="iconfont">&#xe77d;</i>
        </dd>
      </dl>
      <dl class="select">
        <dt><span>*</span>套餐</dt>
        <dd class="active" @click="selectItem(1)">
          <input type="text" class="com-btn aux-btn" v-model="selectValue[1].value" placeholder="請選擇" value="" readonly>
          <i class="iconfont">&#xe77d;</i>
        </dd>
      </dl>
      <dl class="select">
        <dt><span>*</span>客戶來源</dt>
        <dd class="active" @click="selectItem(2)">
          <input type="text" class="com-btn aux-btn" v-model="selectValue[2].value" placeholder="請選擇" value="" readonly>
          <i class="iconfont">&#xe77d;</i> 
        </dd>
      </dl>
      <dl class="select">
        <dt>用戶公司</dt>
        <dd class="active" @click="selectItem(3)">
          <input type="text" class="com-btn aux-btn" v-model="selectValue[3].value" placeholder="請選擇" value="" readonly>
          <i class="iconfont">&#xe77d;</i>
        </dd>
        <input v-if="otherCompany" @click.stop type="text" v-model="otherCompanyVal" class="com-btn aux-btn" style="margin-top:.1rem;" placeholder="請填寫公司名稱" value=""> 
      </dl>
      <dl class="select" style="margin-bottom:.4rem;">
        <dt>用戶團隊</dt>
        <dd>
          <input type="text" onblur="this.blur();" class="com-btn aux-btn" v-model.trim="selectValue[4].value" placeholder="多級團隊用逗號分隔" value=""> 
        </dd>
      </dl>
      <button class="com-btn com-button-action aux-margin" type="button" @click="confirmLink">生成支付鏈接</button>
    </div> 

    <mt-popup v-model="selectVisible" position="bottom">
      <mt-picker :slots="selectList" :itemHeight="50" @change="onValuesChange" :showToolbar="true" class="select-frame" valueKey="label">
        <div style="width:.54rem;"><span @click="cancel">取消</span></div>
        <div style="flex:1;font-size:.17rem;color:#2a2a2a;">{{titleInfo}}</div>
        <div style="width:.54rem;"><span @click="confirm">確定</span></div>  
      </mt-picker> 
    </mt-popup>  

    <mt-popup v-model="linkVisible" popup-transition="popup-fade">
      <section class="com-flex">
        <h3>請選擇支付鏈接</h3>
        <p @click="payLink"><i class="iconfont">&#xe681;</i>Pay Link</p>  
        <p @click="payQrcode"><i class="iconfont">&#xe7ad;</i>Pay QR Code</p>
        <button type="button" class="com-btn" @click="cancelLink">取消</button>
      </section>
    </mt-popup>
  </div> 
</template>


<script>
  import cmn from './common.js';
  // import Vue from 'vue';
  import { Popup, Picker } from 'mint-ui';
  // Vue.component(Popup.name, Popup);
  // Vue.component(Picker.name, Picker);

  export default {
    name: "",
    data () {
      return {
        authority: {
          layer: 0  
        },
        titleInfo: "",
        otherCompany: false, 
        otherCompanyVal: "",
        url: null,
        pay_id: null,
        linkVisible: false,
        indexItem: null,
        selectVisible: false,
        defaultValue: [  //默认数据
          {value: "", id: ""},
          {value: "", id: ""},
          {value: "", id: ""},
          {value: "", id: ""},
          {value: "", id: ""}
        ],
        itemList: [  //预加载数据
          [],
          [],
          [], 
          []
        ],  
        selectValue: [  //Input数据
          {value: "", id: ""},
          {value: "", id: ""},
          {value: "", id: ""},
          {value: "", id: ""},
          {value: "", id: ""}
        ],
        selectList: []  //当前picker数据 
      }
    },
    components: {
      'mt-popup': Popup,
      'mt-picker': Picker,
    },
    methods: {
      payLink: function() {
        this.authority.layer = 0;
        window.location.href = baseUrl + "/pay/info?pay_id=" + this.pay_id + "&t=" + Date.now();
      },
      payQrcode: function() {
        this.authority.layer = 0;
        let url = "https://cli.im/api/qrcode/code?text=" + encodeURIComponent(this.url) + "&mhid=4UeRCw3uzMwhMHcqLNFSO6I";

        window.location.href = baseUrl + "/pay/qrcode?qr_url=" + encodeURIComponent(url) + "&url=" + encodeURIComponent(this.url) + "&t=" + Date.now(); 
      },
      cancelLink: function() {
        this.linkVisible = false;
      },
      confirmLink: function() {
        if (this.selectValue[0].id == "") {
          this.$toast("請選擇服務顧問");
          return ;
        }
        if (this.selectValue[1].id == "") {
          this.$toast("請選擇套餐");
          return ;
        }
        if (this.selectValue[2].id == "") {
          this.$toast("請選擇客戶來源");
          return ;
        }

        //發起POST生成支付鏈接
        if (this.otherCompany == true) {
          this.selectValue[3].id = "";
          this.selectValue[3].value = this.otherCompanyVal;
        }
        this.$http.ajax({
          path: "payment/center/generate-code",
          type: "post",
          data: { 
            advisor_uuid: this.selectValue[0].id,
            package_uuid: this.selectValue[1].id, 
            source_uuid: this.selectValue[2].id,
            company_uuid: this.selectValue[3].id, 
            company_name: this.selectValue[3].value, 
            team: this.selectValue[4].value
          },
          authority: (res)=> {
            window.location.href = baseUrl + "/pay/login?t=" + Date.now();
          }  
        }).then((res)=> {
          //业务模型  
          this.pay_id = res.data.pay_id; 
          this.url = window.baseUrl + "/pay/info?pay_id=" + this.pay_id; 
          this.linkVisible = true; 
          this.authority.layer = 1;
        }); 
      },
      cancel: function() {
        this.selectVisible = false;
      }, 
      confirm: function() { 
        this.selectVisible = false;   
        this.selectValue[this.indexItem].value = this.defaultValue[this.indexItem].value;
        this.selectValue[this.indexItem].id = this.defaultValue[this.indexItem].id;
        if (this.defaultValue[this.indexItem].id == "null") {
          this.otherCompany = true; 
        } else {
          this.otherCompany = false; 
        }
      },
      selectItem: function(index) {
        let titleArray = ["請選擇服務顧問", "請選擇套餐", "請選擇客戶來源", "請選擇用戶公司"];
        this.titleInfo = titleArray[index];  
        let val = this.selectValue[index].value;
        let id = this.selectValue[index].id;
        let initItem = 0;
        if (id != "") { 
          this.itemList[index].forEach((value, index, array)=> {
            if (value.id == id) {
              initItem = index;  
            }
          });
        }
        this.selectList = [{  
          flex: 1,
          defaultIndex: initItem,  
          values: this.itemList[index] 
        }];  
        this.indexItem = index; 
        this.selectVisible = true; 
        this.defaultValue[this.indexItem].value = this.itemList[index][this.selectList[0].defaultIndex].label; 
        this.defaultValue[this.indexItem].id = this.itemList[index][this.selectList[0].defaultIndex].id; 
      },
      onValuesChange: function(picker, values) {
        if (values[0] != undefined) {    
          this.defaultValue[this.indexItem].value = values[0].label; 
          this.defaultValue[this.indexItem].id = values[0].id;
        }    
      }  
    },
    beforeRouteLeave (to, from, next) {
      if (this.authority.layer > 0) {
        this.authority.layer -= 1;
        next(false); 
        return ;
      }  
      next(true);
    },
    created () {
      document.title = "支付配置"; 

      this.$http.ajax({
        path: "payment/center/setting",
        type: "get", 
        data: {},
        authority: (res)=> {
          window.location.href = baseUrl + "/pay/login?t=" + Date.now();
        } 
      }).then((res)=> {
        //业务模型    
        res.data.advisor_list.forEach((value, index, array) => {
          let json = {label: value.username, id: value.uuid};
          this.itemList[0].push(json); 
        });
        res.data.package_list.forEach((value, index, array) => {
          let json = {label: value.name, id: value.uuid};
          this.itemList[1].push(json);
        });  
        res.data.source_list.forEach((value, index, array) => {
          let json = {label: value.name, id: value.uuid};
          this.itemList[2].push(json); 
        });  
        res.data.company_list.forEach((value, index, array) => {
          let json = {label: value.name, id: value.uuid};
          this.itemList[3].push(json); 
        }); 
        let _json = {label: "其他", id: "null"};  
        this.itemList[3].push(_json); 
        
        window.setTimeout(() => { cmn.run(); }, 1000);
      });
    },
    watch: {
      "authority.layer": function(val, oldVal) {
        if (val < 1) { 
          this.linkVisible = false;
        }
      }
    }
  }
</script>
<style scoped>
  dl.select {padding-right:.12rem;padding-left:.12rem;margin-bottom:.2rem;}
  dl.select>dt {color:#2a2a2a;font-size:.15rem;height:.3rem;line-height:.3rem;}
  dl.select>dt span {color:#f00;}
  dl.select>dd {overflow:hidden;}
  dl.select>dd input {width:100%;height:.5rem;border:1px solid #ddd;border-radius: .08rem;color:#2a2a2a;padding-left:.12rem;padding-left:.12rem;font-size: .16rem;}
  input::-webkit-input-placeholder {color:#ccc;}
  dl.select>dd input:active {border:1px solid #69C0FF;}
  dl.select>dd.active input:active {color:#69C0FF;}
  dl.select>dd i {font-size: .15rem;color:#ddd;position: absolute;right:.12rem;top:0;line-height:.5rem;}
  dl.select>dd.active input:active ~ i {color:#69C0FF;}
  dl.select>dd.active input:active::-webkit-input-placeholder {color:#69C0FF;}

  dl.select>dd ~ input {width:100%;height:.5rem;border:1px solid #ddd;border-radius: .08rem;color:#2a2a2a;padding-left:.12rem;padding-left:.12rem;font-size: .16rem;}
  dl.select>dd ~ input:active {border:1px solid #69C0FF;}
  dl.select>dd.active ~ input:active {color:#69C0FF;}
  dl.select>dd.active ~ input:active::-webkit-input-placeholder {color:#69C0FF;}

  .select-frame {background:#fff;}

  section {margin:auto;width:3.25rem;height:3rem;border-radius:.1rem;background:#fff;flex-direction:column;overflow:hidden;justify-content: center;}
  section h3 {position:absolute;top:0;left:0;width:100%;height:.5rem;line-height:.5rem;border-bottom:1px solid #ddd;font-size:.17rem;text-align: center;color:#2a2a2a;}
  section p {display:block;width:3rem;height:.5rem;line-height:.5rem;border:1px solid #4371e7;border-radius: .1rem;text-align: center;color:#4371e7;font-size:.15rem;}
  section p:nth-of-type(1) {margin-bottom:.2rem;}
  section p i {margin-right: .1rem;}
  section button {position:absolute;bottom:0;left:0;width:100%;height:.5rem;font-size:.17rem;background: #f6f6f6;color:#999;}
  section button:active {background:#f0f0f0;}
</style>