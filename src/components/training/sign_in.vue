<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-pdm">
      <h3 class="com-bgrs"><label v-if="simply">培训签到</label><label v-else>培訓簽到</label></h3>
      <ul class="com-mgrl">
        <li class="com-disx com-wrap standard">
          <span><label v-if="simply">课程名称</label><label v-else>課程名稱</label></span>
          <p>{{courseInfo.course.title}}</p>
        </li>
        <li class="com-disx com-wrap standard">
          <span><label v-if="simply">培训地点</label><label v-else>培訓地點</label></span>
          <p>{{courseInfo.course.address}}</p>
        </li>
        <li class="com-disx com-wrap standard">
          <span><label v-if="simply">培训时间</label><label v-else>培訓時間</label></span>
          <p>{{courseInfo.s_time}}</p>
        </li>
        <li class="phone com-disx">
          <span><label v-if="simply">iBer账号</label><label v-else>iBer賬號</label></span>
          <input v-if="simply" class="com-btn aux-btn" type="number" v-model="mphone" value="" placeholder="请输入您在iBer的注册手机号">
          <input v-else class="com-btn aux-btn" type="number" v-model="mphone" value="" placeholder="請輸入您在iBer的註冊手機號"> 
        </li>
        <li class="code com-disx">
          <span><label v-if="simply">验证码</label><label v-else>驗證碼</label></span>
          <p>
            <input v-if="simply" class="com-btn aux-btn" type="number" v-model="verify_code" value="" placeholder="验证码">
            <input v-else class="com-btn aux-btn" type="number" v-model="verify_code" value="" placeholder="驗證碼">
            <em v-if="code_state" @click="getCode" style="color:#faA617;"><label v-if="simply">获取验证码</label><label v-else>獲取驗證碼</label></em>
            <em v-if="!code_state">{{second}}s</em>
          </p>
        </li>  
      </ul>
      <mt-button type="primary" class="com-mgrl" @click="signIn" style="height:.4rem;font-size:.16rem;width:1rem;margin-top:.2rem;margin-bottom:.3rem;">
        <label v-if="simply">签 到</label>
        <label v-else>簽 到</label>
      </mt-button>
      <dl class="aux com-mgrl">
        <dt><label v-if="simply">培训课堂规则</label><label v-else>培訓課堂規則</label>：</dt>
        <dd v-if="simply">
          <p class="com-wrap">1、iBer Training仅限iBer会员参加</p>
          <p class="com-wrap">2、请准时参加，迟到15分钟，视为自动放弃该课程</p>
          <p class="com-wrap">3、安排好时间，如行程有变可提前2小时取消报名</p>
          <p class="com-wrap">4、请遵守纪律，严禁录像及接听电话以维持课程质数</p>
        </dd>
        <dd v-else>
          <p class="com-wrap">1、iBer Training 僅限 iBer 會員參加</p>
          <p class="com-wrap">2、請準時參加，遲到15分鐘，視為自動放棄該課程</p>
          <p class="com-wrap">3、安排好時間，如行程有變可提前2小時取消報名</p>
          <p class="com-wrap">4、請遵守紀律，嚴禁錄影及接聽電話以維持課程質數</p>
        </dd>
      </dl>
    </div>


  </div>
</template>


<script>
  // import Vue from 'vue';
  import { Button } from 'mint-ui';
  // Vue.component(Button.name, Button);

  export default {
    name: '',
    data () {
      return {    
        courseInfo: {
          course: {}
        },

        course_uuid: null,
        mphone: "",
        verify_code: "",

        second: 60,
        code_state: true
      }
    },
    components: {
        'mt-button': Button,
    },
    methods: {
      getCode: function() {
        if (!plug.judgePhone(this.mphone)) {
          let _toast = this.simply ? "请填写手机号" : "請填寫手機號";
          this.$toast(_toast);
          return ; 
        }

        this.$http.ajax({
          path: "training/send",
          type: "post",
          data: {
            mobile: this.mphone
          }
        }).then((res)=> {
          //业务模型 
          let _toast = this.simply ? "验证码已发送" : "驗證碼已發送";
          this.$toast(_toast);

          this.code_state = false;
          let time = 60;
          let interval = window.setInterval(()=> {
            if (time == 0) {
              this.second = 60; 
              this.code_state = true;
              window.clearInterval(interval);
              return ;
            }
            time--;
            this.second = time;
          }, 1000); 
        });
      },
      signIn: function() {
        if (!plug.judgePhone(this.mphone)) {
          let _toast = this.simply ? "请填写手机号" : "請填寫手機號";
          this.$toast(_toast);
          return ; 
        }

        if (plug.filterSpace(this.verify_code).length != 4) {
          let _toast = this.simply ? "请输入验证码" : "請輸入驗證碼";
          this.$toast(_toast);
          return ;
        }

        this.$root.progress = {
          layer: 1, 
          info: this.simply ? "签到确认中" : "簽到確認中"
        };  

        this.$http.ajax({
          path: "training/checkin",
          type: "post",
          data: {
            uuid: this.course_uuid,
            mobile: this.mphone,
            code: this.verify_code
          },
          intercept: (res)=> {
            this.$root.progress.layer = 0;
          }
        }).then((res)=> {
          //业务模型
          window.setTimeout(()=> {  
            this.$root.progress.layer = 0;
            this.$router.push({
              path: "training/success",
              query: {
                data: JSON.stringify(res.data)
              } 
            });
          }, 1000);   
        });

      }
    },
    created () {
      document.title = this.simply ? "培训签到" : "培訓簽到";
      this.$root.pageLoading.layer = 1;

      if (this.$route.query == undefined || this.$route.query.uuid == undefined) {
        this.course_uuid = this.urlParams.uuid; 
      } else {
        this.course_uuid = this.$route.query.uuid;
      }

      this.$http.ajax({
        path: "training/check-course",
        type: "get",
        data: {
          uuid: this.course_uuid
        },
        intercept: (msg)=> {
          this.$root.pageLoading.info = msg;
          this.$root.pageLoading.layer = 2; 
        }
      }).then((res)=> { 
        //业务模型
        this.courseInfo = res.data; 

        window.setTimeout(()=> {  
          this.$root.pageLoading.layer = 0;
        }, 200);   
      });

    }
  }
</script>
<style scoped>
  .com-scroll-y {background-image: url(https://static.iberhk.com/v2/web/images/common/activity-bg.png);}
  h3 {height: 1rem;line-height: 1rem;text-align: center;font-size: .24rem;color: #fff;background-image: url(https://static.iberhk.com/v2/web/images/common/banner.png);}
  ul {overflow: hidden;width: 3.45rem;box-shadow: 0 0 0.05rem #ddd;border-radius: .1rem;padding: .1rem;margin-top: .2rem;background: #fff;}
  ul>li {overflow:hidden;padding-top:.1rem;padding-bottom:.1rem;line-height:.24rem;}
  ul>li>span {width:1rem;text-align: right;font-size: .16rem;font-weight: 800;color: #2d7bff;padding-right:.1rem;}
  ul>li>p {flex: 1;display:block;font-size: .14rem;}
  ul>li input {border:1px solid #f7f7f9;height:.4rem;font-size: .14rem;}
  ul>li.phone>span {line-height: .4rem;} 
  ul>li.phone input {flex: 1;}
  ul>li.code>span {line-height: .4rem;}
  ul>li.code>p {padding-right: 1rem;}
  ul>li.code>p em {position: absolute;right:0;top:0;line-height:.4rem;}
  ul>li.code input {width:100%;}

  dl {width:3.45rem;}
  dl>dt {color: #2d7bff;}
  dl>dd {color: #666;}

  input::-webkit-input-placeholder {color:#ccc;}
</style>