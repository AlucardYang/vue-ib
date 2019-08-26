<template>
    <div class="com-frame" style="padding-bottom:.5rem;" :class="{'com-wxix-frame': (wxixm || fbixm)}">  
      <div class="com-scroll-y aux-bar com-bg">
        <p v-if="simply">尊敬的阁下，根据香港及澳门保护监管部门的相关规定，您所访问的信息需要您申报目前所在地，以便进一步为您提供服务。平台及联系人将严格保护您的私隐信息，请阁下申报您目前所在地区：</p>
        <p v-else>尊敬的閣下，根據香港及澳門保護監管部門的相關規定，您所訪問的信息需要您申報目前所在地，以便進一步為您提供服務。平台及聯絡人將嚴格保護您的私隱信息，請閣下申報您目前所在地區：</p>
        <section v-for="(dx,index) in addrList" :key="index" class="com-disx" @click="selectAddr(index)">
          <div style="flex:1;padding-left:.125rem;">
            <img :src="dx.url" alt="" style="width:.28rem;height:.28rem;display:inline-block;border-radius:100%;top: -.02rem;">
            <span style="font-size:.17rem;color:#2a2a2a;">{{dx.name}}</span>
          </div>
          <div style="width:.46rem;text-align: center;"><span class="mint-checkbox-core" style="top:-2px;" :class="{'com-checkbox-active': dx.active}"></span></div>
        </section>
        <dl class="com-disx" style="margin-top:.3rem;padding-bottom:.25rem;">
          <dt style="width:.3rem;padding-top:.03rem;"><span class="mint-checkbox-core aux-checkbox" :class="{'com-checkbox-active': agree}" @click="agreeProtocal" style="top:-.05rem;"></span></dt>
          <dd style="flex:1;color:#999;font-size:.14rem;text-align: justify;line-height:.2rem;">
            <label v-if="simply">本人申明当前所在地属实，并知晓最终达成的保险签单应在香港/澳门地区当面充分沟通且理解其条款后才能签署，网络信息仅供参考不构成保险公司或保险产品之意见。</label>
            <label v-else>本人申明當前所在地屬實，並知曉最終達成的保險簽單應在香港/澳門地區當面充分溝通且理解其條款後才能簽署，網絡信息僅供參考不構成保險公司或保險產品之意見。</label>
          </dd>
        </dl>
      </div>
  
      <button class="com-btn com-button-action aux-abs-full" :class="{'com-wxix-button': (wxixm || fbixm)}" type="button" @click="enterNextPage">下一步</button> 
  
      <mt-popup v-model="limitArea" popup-transition="popup-fade"> 
        <div class="com-mgrl" style="background:#fff;width:3.25rem;padding:.24rem .22rem;padding-bottom:.22rem;border-radius: .08rem;text-align:center;">
          <p style="color:#333;font-size:.14rem;margin-bottom:.22rem;line-height: .2rem;">
            <label v-if="simply">根据相关监管部门意见，本资料或联系方式暂不支持对中国内地客户开放，敬请谅解。我们将一如既往为香港/澳门地区以及来港澳的内地客户提供最专业的服务。</label>
            <label v-else>根據相關監管部門意見，本資料或聯絡方式暫不支持對中國內地客戶開放，敬請諒解。我們將一如既往為香港/澳門地區以及來港澳的內地客戶提供最專業的服務。</label>
          </p>
          <button type="button" @click="confirmArea" class="com-btn" style="width:2rem;height:.38rem;background: #3364e4;border-radius: .38rem;color:#fff;font-size:.14rem;">
            <label v-if="simply">确定</label><label v-else>確定</label>
          </button>
        </div>
      </mt-popup>
  
    </div>  
  </template>
  
  
  <script>
    // import Vue from 'vue';
    import { Popup } from 'mint-ui';
    // Vue.component(Popup.name, Popup);

    
    export default {
      name: '',
      data () {
        return {
          name: '',
          user_uuid: null,
          answer_uuid: null,
          from_type: null,
          v2_c_user_uuid: null,
          agree: false,
          limitArea: false,

          pageArgs: {},
  
          wxixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,
  
          fbixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/fb.{2,}\//) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120, 
          
          addrList: [
            {
              name: this.simply ? "香港地区" : "香港地區",
              active: false,
              url: "https://static.iberhk.com/v2/web/images/agent/hongkong.png",
              type: 0
            },
            {
              name: this.simply ? "澳门地区" : "澳門地區",
              active: false,
              url: "https://static.iberhk.com/v2/web/images/agent/macao.png",
              type: 1
            },
            {
              name: this.simply ? "中国内地" : "中國內地",
              active: false,
              url: "https://static.iberhk.com/v2/web/images/agent/china.png",
              type: 2
            },
            {
              name: this.simply ? "其他（非中国内地）" : "其他（非中國內地）",
              active: false,
              url: "https://static.iberhk.com/v2/web/images/agent/earth.png",
              type: 3  
            } 
          ]
        }
      },
      components: {
        'mt-popup': Popup,
      },
      methods: {
        confirmArea: function() {
          this.limitArea = false; 
        },
        enterNextPage: function() {
          let addrCount = null;
          this.addrList.forEach((value, index, array)=> {
            if (value.active == true) {
              addrCount = value.type + 1;
            }
          });
          if (addrCount == null) {
            let _toast = this.simply ? "请申报你目前的地址" : "請申報你目前的地址";
            this.$toast(_toast);
            return ;
          }
          if (this.agree != true) {
            let _toast = this.simply ? "请阅读同意意见条款" : "請閱讀同意意見條款";
            this.$toast(_toast);
            return ;   
          } 
  
          if (addrCount == 3) { 
            this.limitArea = true; 
          }  
          
          this.getRootUserInfo().then((auth)=> {
            //auth.c_user_uuid
            this.$http.ajax({
              path: "c-user/area-declaration",
              type: "post",
              language: this['language']['currentLang'],
              data: { 
                user_uuid: this.user_uuid,
                c_user_uuid: auth.c_user_uuid,   
                area: addrCount
              },   
              err: ()=> { 
                let _toast = this.simply ? "网络异常，请检查您的网络设置" : "網絡異常，請檢查您的網絡設置";
                this.$toast(_toast);
              } 
            }).then((res)=> {
              if (this.limitArea) {
                return; 
              }
              //记录有效期
              let date = new Date();
              let time = date.getTime();  
              window.localStorage.setItem("address_term_time", time); 
  
              //获取URL参数
              window.location.href = this.pageArgs.page; 
            }); 
  
          });
  
        },
        selectAddr: function(id) {
          this.addrList.forEach((value, index, array)=> {
            value.active = false;
          });
          this.addrList[id].active = true;
        },
        agreeProtocal: function() {
          this.agree = !this.agree; 
        }
      },
      created () {
        document.title = this.simply ? "地址信息申报" : "地址信息申報";
  
        let query = this.$route.query; 
        if (!plug.valueValid(query) || !plug.valueValid(query.user_uuid) || !plug.valueValid(query.page)) { 
          this.$root.pageLoading.layer = 2;
          return ;
        }  
        this.$root.pageLoading.layer = 1;
        window.setTimeout(()=> {
          this.$root.pageLoading.layer = 0;
        }, 200);
        
        this.pageArgs = query;
        this.user_uuid = query.user_uuid;  

        if (query.stringify) {
          this.pageArgs.page = decodeURIComponent(query.page);
        }
  
        this.getRootUserInfo().then((auth)=> {
          //auth.c_user_uuid
          this.$root.getAgentMsg();
        });
  
        //获取URL参数
        let params = plug.jsonToUrl();
  
        let address_term_time = window.localStorage.getItem("address_term_time");
        if (plug.valueValid(address_term_time)) {
          let date = new Date();
          let term_time = date.getTime() - address_term_time;
          let is_term = term_time / 3600000;
  
          //申报地址有效期处于1小时内 
          if (is_term < 1) {
            window.location.href = this.pageArgs.page; 
          }
        }
  
  
  
      }
    } 
  </script>
  <style scoped>
    div.com-scroll-y {padding: .125rem;padding-bottom:0;}
    div.com-scroll-y>p {color:#666;font-size:.14rem;line-height:.23rem;margin-bottom:.3rem;}
    section {width:3.5rem;height:.6rem;line-height:.6rem;background:#fff;box-shadow: 0 0 2px #ddd;border-radius: .04rem;margin-bottom:.1rem;}
  </style>