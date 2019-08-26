 <template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar" style="padding-bottom:.3rem;padding-top:.2rem;">
      <dl class="select">
        <dt><span>*</span>姓名</dt>
        <dd>
          <input type="text" class="com-btn aux-btn" v-model.trim="selectValue[2].value" placeholder="填寫姓名" value="">
        </dd>
      </dl>
      <dl class="select">
        <dt><span>*</span>手機號<em style="color:#999;font-size:.13rem;margin-left:.1rem;">將作為登錄賬號，請準確填寫</em></dt>
        <dd class="com-disx phone">
          <div class="active" style="width:1.1rem;" @click="selectItem(0)">
            <input type="text" class="com-btn aux-btn" v-model="selectValue[0].value" placeholder="選擇區號" value="" readonly>
            <i class="iconfont">&#xe77d;</i>
          </div> 
          <div style="flex:1;padding-left:.12rem;">
            <input type="text" class="com-btn aux-btn" @keypress="filterSpace(selectValue[3].value)" @keyup="filterSpace(selectValue[3].value)" v-model.trim="selectValue[3].value" placeholder="填寫手機號" value="">
          </div>
        </dd>
      </dl>
      <dl class="select">
        <dt>單價</dt>
        <dd style="background:#f6f6f6;padding:.12rem;border-radius:.08rem;color:#2a2a2a;font-size:.16rem;">
          <p v-if="offValue == 0">港幣 {{payInfo.price_hk}}</p>
          <p style="text-decoration:line-through;" v-if="offValue > 0">港幣 {{payInfo.price_hk}}</p>
          <p v-if="offValue > 0">港幣 {{payInfo.discounted_price_hk}} ({{offValue}}% Off)</p>
        </dd>
      </dl>
      <dl class="select"> 
        <dt>數量</dt>
        <dd class="active"  @click="selectItem(1)">
          <input type="text" class="com-btn aux-btn" v-model="selectValue[1].value" placeholder="請選擇" value="0" readonly>
          <i class="iconfont">&#xe77d;</i>
        </dd>
      </dl>
      <dl class="select">
        <dt>服務顧問</dt>
        <dd>
          <input style="background:#f6f6f6;border:0;" type="text" class="com-btn aux-btn" v-model="selectValue[4].value" placeholder="" value="" readonly>
        </dd>
      </dl>
      <ul class="com-disx" style="padding-right:.12rem;padding-left:.12rem;margin-bottom:.2rem;">
        <li style="width:1rem;height:.6rem;color:#2a2a2a;font-size:.15rem;">總金額</li>
        <li style="flex:1;height:.6rem;text-align:right;">
          <h3 style="color:#ff0d0d;font-size:.24rem;height:.35rem;line-height:.35rem;">港幣 {{totalPrice}}</h3>
          <p style="font-size:.16rem;color:#999;text-decoration:line-through;" v-if="offValue > 0 && defaultPrice > 0">原價港幣 {{defaultPrice}}</p>
        </li>
      </ul>
      <button class="com-btn com-button-action aux-margin" type="button" @click="goPay">生成支付</button>

      <p style="text-align:center;padding-right:.3rem;padding-left:.3rem;margin-top:.4rem;margin-bottom:.15rem;color:#999;font-size: .12rem;">支付通道由經安全認證的第三方提供，iBer不會存儲閣下信用卡敏感信息，並遵守香港相關私隱條例。</p>
      <p style="text-align:center;color:#999;font-size: .12rem;">@iBer FinTech Limited</p>
    </div>

    <mt-popup v-model="selectVisible" position="bottom">
      <mt-picker :slots="selectList" :itemHeight="50" @change="onValuesChange" :showToolbar="true" class="select-frame" valueKey="label">
        <div style="width:.54rem;"><span @click="cancel">取消</span></div>
        <div style="flex:1;font-size:.17rem;color:#2a2a2a;">{{titleInfo}}</div>
        <div style="width:.54rem;"><span @click="confirm">確定</span></div>  
      </mt-picker> 
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
    name: '',
    data () {
      return {
        titleInfo: "",
        pay_id: null,
        hasDiscount: true,
        hasDiscountMeal: false,
        offValue: null,
        hasMeal: true,
        offMeal: null,
        payInfo: {
          price_hk: 0,
          discounted_price_hk: 0,
          offline_price_hk: 0
        },
        rate: null,
        originPrice: null,
        preferPrice: null,
        totalPrice: 0,
        defaultPrice: 0,
        indexItem: null,
        selectVisible: false,
        defaultValue: [
          {value: "", id: ''},
          {value: "", id: ''},
          {value: "", id: ''},
          {value: "", id: ''},
          {value: "", id: ''}
        ],
        selectValue: [
          {value: "", id: ''},
          {value: "", id: ''},
          {value: "", id: ''},
          {value: "", id: ''},
          {value: "", id: ''}
        ],
        itemList: [
          [
            {label:'+852', id: 0},
            {label:'+853', id: 1},
            {label:'+86', id: 2},
            {label:'+1', id: 3}
          ],
          []
        ], 
        selectList: [] 
      }
    },
    components: {
      'mt-popup': Popup,
      'mt-picker': Picker,
    },
    methods: {
      filterSpace: function(val) {
        let back = "";
        val.split('').forEach((value, index, array)=> {
          if (value != ' ') {
            back += value;
          }
        }); 
        this.selectValue[3].value = back;
      },
      goPay: function() {
        if (this.selectValue[2].value == "") {
          this.$toast("請填寫姓名");
          return ;
        }
        if (this.selectValue[0].value == "") {
          this.$toast("請選擇區號"); 
          return ;
        }
        if (this.selectValue[3].value == "") {
          this.$toast("請填寫手機號");
          return ;
        }
        if ((this.selectValue[0].id == "0" || this.selectValue[0].id == "1") && this.selectValue[3].value.length != 8) {
          this.$toast("請填寫正確的手機號碼");  
          return false;  
        }
        if (this.selectValue[0].id == "2" && !(/^1[234578]\d{9}$/g.test(this.selectValue[3].value))) {
          this.$toast("請填寫正確的手機號碼");
          return false;   
        }
        if (this.selectValue[0].id == "3" && this.selectValue[3].value.length != 10) {
          this.$toast("請填寫正確的手機號碼");
          return false;    
        }  
        if (this.selectValue[1].value == "") {
          this.$toast("請選擇數量");
          return ;
        } 
        let payJSON = {
          pay_id: this.pay_id,
          buyer_name: this.selectValue[2].value,
          mobile_pre: this.selectValue[0].value,
          mobile: this.selectValue[3].value,
          quantity: this.selectValue[1].value,
          rate: this.rate,
          total: this.totalPrice
        };
        this.$root.progress.layer = 1;
        this.$root.progress.info = "正在生成中";
        
        window.setTimeout(()=> {
          this.$root.progress.layer = 0;
          window.location.href = baseUrl + "/pay/type?pay_data=" + JSON.stringify(payJSON) + "&t=" + Date.now();
        }, 1000);
      },
      cancel: function() {
        this.selectVisible = false;
      }, 
      confirm: function() { 
        this.selectVisible = false;  
        this.selectValue[this.indexItem].value = this.defaultValue[this.indexItem].value;
        this.selectValue[this.indexItem].id = this.defaultValue[this.indexItem].id;
      },
      selectItem: function(index) {
        let titleArray = ["請選擇區號", "請選擇數量"];
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
    created () {
      document.title = "iBer Payment Center"; 
      this.pay_id = this.$route.query.pay_id;

      //数量
      for (let i = 0; i< 100; i++) {
        let json = {label: (i + 1), id: i};
        this.itemList[1].push(json);
      }

      this.$http.ajax({
        path: "payment/code/info",
        type: "get",
        data: {
          pay_id: this.pay_id
        },
        authority: (res)=> {
          window.location.href = baseUrl + "/pay/login?t=" + Date.now();     
        } 
      }).then((res)=> { 
        //折扣
        this.offValue = parseInt((res.data.price_hk - res.data.discounted_price_hk) / res.data.price_hk * 100);
        
        this.rate = res.data.rate;
        Number.prototype.milscale = function() { 
          return this.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        };  
        this.payInfo = {
          price_hk: res.data.price_hk.milscale(),
          discounted_price_hk: res.data.discounted_price_hk.milscale()
        };
        this.originPrice = res.data.price_hk;
        this.preferPrice = res.data.discounted_price_hk;
         
        this.selectValue[4].value = res.data.advisor_name + " (" + res.data.advisor_mobile_pre + ") " + res.data.advisor_mobile;

        window.setTimeout(() => { cmn.run(); }, 1000);
      });
    },
    watch: {
      selectValue: {
        handler: function(val, oldVal) {
          if (val[1].value != "") {
            Number.prototype.milscale = function() { 
              return this.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            };
            this.totalPrice = (this.preferPrice * parseInt(val[1].value)).milscale();
            this.defaultPrice = (this.originPrice * parseInt(val[1].value)).milscale();
          }
        },
        deep: true
      }
    }
  }
</script>
<style scoped>
  dl.select {padding-right:.12rem;padding-left:.12rem;margin-bottom:.2rem;}
  dl.select>dt {color:#2a2a2a;font-size:.15rem;height:.3rem;line-height:.3rem;}
  dl.select>dt span {color:#f00;}
  dl.select>dd {overflow:hidden;}
  dl.select>dd input {width:100%;height:.5rem;border:1px solid #ddd;border-radius: .08rem;color:#2a2a2a;padding-right:.12rem;padding-left:.12rem;font-size: .16rem;}
  input::-webkit-input-placeholder {color:#ccc;}
  dl.select>dd input:active {border:1px solid #69C0FF;}
  dl.select .active input:active {color:#69C0FF;}
  dl.select>dd i {font-size: .15rem;color:#ddd;position: absolute;right:.12rem;top:0;line-height:.5rem;}
  dl.select .active input:active ~ i {color:#69C0FF;}
  dl.select .active input:active::-webkit-input-placeholder {color:#69C0FF;}
  .select-frame {background:#fff;}

  dl.select>dd.phone div {height:.5rem;}
  ul {overflow:hidden;}
  ul>li {overflow:hidden;}
</style>