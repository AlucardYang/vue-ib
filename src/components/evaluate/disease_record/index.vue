<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar com-bg aux-pdm">
      <header style="padding:.12rem;">
        <div class="iber-card">
          <div class="com-disx">
            <div class="info">
              <div class="com-disx">
                <img :src="record.avatar" @click="openDetail" alt>
                <div>
                  <h3 class="com-nowrap">{{record.nickname}}</h3>
                  <p class="com-wrap" v-if="plug.valueValid(record.mobile)">
                    <label v-if="simply">授权手机</label>
                    <label v-else>授權手機</label>: {{record.mobile}}
                  </p>
                </div> 
              </div>
            </div>
            <div class="action" v-if="record.custom_status == 1 || record.custom_status == 2">
              <button v-if="record.custom_status == 1" type="button" class="com-btn follow" @click="follow">
                <i class="iconfont">&#xe6a7;</i><label v-if="simply">关注</label><label v-else>關注</label>
              </button>
              <button v-if="record.custom_status == 2" type="button" class="com-btn folowed">
                <i class="iconfont">&#xe6b5;</i><label v-if="simply">已关注</label><label v-else>已關注</label>
              </button>
            </div>
          </div>
          <p class="com-nowrap com-disx show">
            <span>
              {{record.create_at}}
              <label v-if="simply">完成评测</label>
              <label v-else>完成評測</label>
            </span>
            <em @click="enterPage('result')">
              <label v-if="simply">查看结果</label>
              <label v-else>查看結果</label>
              <i class="iconfont">&#xe6a5;</i>
            </em>
          </p>
          <p class="note" v-if="plug.valueValid(msgID)" @click="consultRecord">
            <i class="iconfont">&#xe650;</i>
            <label v-if="simply">有咨询记录</label>
            <label v-else>有諮詢紀錄</label>
          </p>
        </div>
      </header>
      <ul>
        <li v-for="(dx, index) in dialogList" :key="index">
          <!--@agent-->
          <dl v-if="dx.type == 0" class="dialog agent">
            <dt>
              <img src="https://static.iberhk.com/v2/web/images/evaluate/robit.png">
            </dt>
            <dd>
              <div>
                <span>{{dx.content}}</span>
              </div>
            </dd>
          </dl>

          <!--@customer-->
          <dl v-if="dx.type == 1" class="dialog customer">
            <dd>
              <div>
                <span>{{dx.content}}</span>
              </div>
            </dd>
            <dt>
              <img :src="record.avatar">
            </dt>
          </dl>
        </li>
      </ul>

      <!--評測结束 @模板-->
      <dl class="dialog agent" v-if="state">
        <dt>
          <img src="https://static.iberhk.com/v2/web/images/evaluate/robit.png">
        </dt>
        <dd class="result">
          <div>
            <div>
              <h3>{{plug.sm(simply, '智能疾病評測結果')}}</h3>
              <p>{{plug.sm(simply, 'TiMi已經思考完畢了~為你寫了一份個人疾病評測報告噢！')}}</p>
            </div>
            <p @click="enterPage('detail')">{{plug.sm(simply, '查看詳情')}}</p>
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>


<script>
import cmn from "@/components/evaluate/common.js";


export default {
  name: "",
  data() {
    return {
      user_uuid: null,
      c_user_uuid: null,
      answer_uuid: null,
      msgID: null,

      record: {},

      state: false,
      defaultList: [],
      dialogList: []
    };
  },
  methods: {
    //进入圈子详情
    openDetail: function() {
      if (this.record.is_guest == 0) {
        let _toast = this.simply ? "无法查看匿名用户详情" : "無法查看匿名用戶詳情";
        this.$toast(_toast);
        return ;
      }
      
      if (!plug.valueValid(this.c_user_uuid)) {
        let _toast = this.simply ? "当前页面参数异常" : "當前頁面參數異常";
        this.$toast(_toast);
        return;
      }
      postMessage(JSON.stringify({
        type: "pushNativePage",
        data: {
          is_sapp: false,
          sapp_uuid: '',
          page_type: 1,
          page_h5_title: '',
          page_url: "IBerRingModule_ProfilePage",
          page_params: {
            c_user_uuid: this.c_user_uuid,
          }
        }
      }),'*');
    },
    //关注
    follow: function() {
      this.$http.ajax({
        path: "/user/customer-status",
        type: "post",
        data: {
          user_uuid: this.user_uuid,
          c_user_uuid: this.c_user_uuid
        }
      }).then((res)=> {
        //业务模型 
        this.record.custom_status = 2;
        
        postMessage(JSON.stringify({
          type: 'postNotification',
          data: {
            not_key: 'businessWithupdateForFollow',
            not_content: ''
          }
        }),'*');

        let _toast = this.simply ? "关注成功" : "關註成功";
        this.$toast(_toast);
      });
    },
    consultRecord: function() {
      if (!plug.valueValid(this.user_uuid)) {
        let _toast = this.simply ? "当前页面参数异常" : "當前頁面參數異常";
        this.$toast(_toast);
        return;
      }
      let pageParam = {
        page_url: "IBerHomeModule_IBerHomeCustomMessagePage",
        page_params: {
          userid: this.c_user_uuid
        },
        is_sapp: false,
        page_type: 1
      };
      this.appFn.goPage(pageParam);
    },
    enterPage: function(type) {
      if (!plug.valueValid(this.user_uuid) || !plug.valueValid(this.answer_uuid)) {
        let _toast = this.simply ? "当前页面参数异常" : "當前頁面參數異常";
        this.$toast(_toast);
        return;
      }
      if (type == 'result') {
        cmn.czcEv('bdj_jibingchakanjieguo', '查看结果');
      }
      if (type == 'detail') {
        cmn.czcEv('bdj_jibingchakanxiangqing', '查看详情');
      }
      this.$router.push({
        path: "/evaluate/disease-app",
        query: {
          agent_uuid: this.user_uuid,
          answer_uuid: this.answer_uuid
        }
      });
    }
  },
  created() {
    document.title = this.simply ? "危疾评测记录" : "危疾評測紀錄";

    let query = this.$route.query;
    if (!plug.valueValid(query) || !plug.valueValid(query.answer_uuid)) {
      let _toast = this.simply ? "当前页面参数异常" : "當前頁面參數異常";
      this.$toast(_toast);
      return;
    }
    this.answer_uuid = this.$route.query.answer_uuid;

    this.$http
      .ajax({
        path: "evaluate/result-preview",
        type: "get",
        language: this["language"]["currentLang"],
        data: {
          answer_uuid: this.answer_uuid
        }
      })
      .then(res => {
        //业务模型
        this.user_uuid = res.data.user_uuid;
        this.c_user_uuid = res.data.cuser_uuid;
        this.msgID = res.data.message_id;

        this.record = res.data;

        this.defaultList = res.data.answers;

        this.defaultList.forEach((value, index, array) => {
          let agent = {
            type: 0,
            content: value.title
          };

          let content = "";
          let ctn = value.content;
          if (plug.valueValid(ctn)) {
            if (ctn.constructor == Array) {
              ctn.forEach((_value, _index, _array) => {
                content += "、" + _value;
              });
              content = content.replace(/^\、/i, "");
            } else {
              content = ctn;
            }
            let customer = {
              type: 1,
              content: content,
              avatar: res.data.avatar
            };
            this.dialogList.push(agent);
            this.dialogList.push(customer);
          }
        });

        if (this.dialogList.length > 0) {
          this.state = true;
        }
      });
  }
};
</script>


<style scoped src="../evaluate.css"></style>
<style scoped>
ul,
ul > li {
  overflow: hidden;
}
dl.dialog {
  overflow: hidden;
  display: flex;
  margin-top: 0.18rem;
}
dl.dialog > dt {
  overflow: hidden;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 100%;
}
dl.dialog > dt img {
  width: 100%;
  height: 100%;
  border-radius: 100%;
}
dl.dialog > dt i {
  font-size: 0.4rem;
  line-height: 0.4rem;
  color: #ddd;
}
dl.agent > dt {
  margin-right: 0.12rem;
  margin-left: 0.12rem;
}
dl.customer > dt {
  margin-right: 0.12rem;
  margin-left: 0.12rem;
}
dl.dialog > dd {
  flex: 1;
}
dl.dialog > dd > div {
  max-width: 100%;
  height: 100%;
  display: inline-block;
  border-radius: 0.08rem;
  padding: 0.08rem 0.1rem;
  line-height: 0.24rem;
}
dl.dialog > dd > div > span {
  line-height: 0.25rem;
  font-size: 0.15rem;
  word-wrap: break-word;
  word-break: break-all;
}
dl.agent > dd {
  padding-right: 0.64rem;
}
dl.agent > dd > div {
  float: left;
  background: #fff;
  color: #666;
}
dl.customer > dd {
  padding-left: 0.64rem;
}
dl.customer > dd > div {
  float: right;
  background: #4b93ff;
  color: #fff;
}
dl.agent > dd::after {
  position: absolute;
  top: 0.15rem;
  left: -0.15rem;
  content: "";
  width: 0;
  height: 0;
  border: 0.08rem solid transparent;
  border-top-width: 0.05rem;
  border-bottom-width: 0.05rem;
  border-right-color: #fff;
}
dl.customer > dd::after {
  position: absolute;
  top: 0.15rem;
  right: -0.15rem;
  content: "";
  width: 0;
  height: 0;
  border: 0.08rem solid transparent;
  border-top-width: 0.05rem;
  border-bottom-width: 0.05rem;
  border-left-color: #4b93ff;
}
dl.agent > dd.result::after {
  opacity: 0;
}

dl.agent > dd.result > div {
  display: block;
  width: 100%;
  padding: 0;
}
dl.agent > dd.result > div div {
  overflow: hidden;
  padding: 0.05rem 0.1rem 0.1rem 0.1rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url(https://static.iberhk.com/v2/web/images/evaluate/evaluate_result.png);
  border-top-right-radius: 0.08rem;
  border-top-left-radius: 0.08rem;
}
dl.agent > dd.result > div div h3 {
  line-height: 0.3rem;
  text-align: center;
  color: #fff;
  font-size: 0.16rem;
}
dl.agent > dd.result > div div p {
  font-size: 0.13rem;
  color: #fff;
}
dl.agent > dd.result > div > p {
  height: 0.4rem;
  line-height: 0.4rem;
  text-align: center;
  color: #4b93ff;
}
</style>