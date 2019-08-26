<template>
  <div class="com-frame com-bg com-disy" style="background-color:#000;" :class="{'wx-fb-ix-padb': (wxixm || fbixm)}">

    <div class="com-scroll-y aux-bar" @click="quit" @touchstart="quit" ref="scrollBom" style="flex:1;overflow:hidden;padding-bottom:.3rem;background: #f7f7f9;">
      <section>
        <div @click="goAgentURL" class="com-disx card">
          <div class="com-flex link" style="width:.6rem;">
            <em v-if="plug.valueValid(agent.avatar)" :style="{'background-image': 'url(' + agent.avatar + ')'}"></em>
            <i v-if="!plug.valueValid(agent.avatar)" class="iconfont">&#xe685;</i>
          </div>
          <div style="flex:1;overflow:hidden;padding-right:.15rem;">
            <h3 class="com-nowrap">{{agent.nickname}}</h3>
            <p class="com-nowrap">{{agent.position}}</p>
          </div>
        </div>
        <div class="com-disx homepage" v-if="plug.valueValid(info.iber_info.user_mobile)" @click="call">
          <span class="com-nowrap"><label v-if="simply">联系顾问：</label><label v-else>聯絡顧問：</label>
            {{info.iber_info.user_mobile}}</span>
          <i class="iconfont">&#xe788;</i>
        </div>
      </section>
      <ul>
        <li v-for="(dx,index) in dialogList" v-if="dx.content != ''">
          <p v-if="dx.time != null && dx.content != ''">{{dx.time}}</p>

          <!--Agent-->
          <dl class="dialog agent" v-if="dx.type == 0">
            <dt>
              <!--<img :src="dx.img">-->
              <em @click="goAgentURL" v-if="plug.valueValid(agent.avatar)" :style="{'background-image': 'url(' + agent.avatar + ')'}"></em>
              <i v-if="!plug.valueValid(agent.avatar)" class="iconfont">&#xe685;</i>
            </dt>
            <dd>
              <div>
                <p v-for="(dx,index) in plug.transBrArr(dx.content)" :key="index" class="com-p-html">{{dx}}</p>
                <button v-if="dx.template != undefined && dx.template == 0 && plug.valueValid(comAgentWechatData.id)"
                  type="button" class="com-btn" id="wechatID" @click="copyWechat(dx.params.wechatID)"
                  :data-clipboard-text="dx.params.wechatID"><label v-if="simply">复制WeChat ID</label><label v-else>複製WeChat ID</label></button>
              </div>
            </dd>
          </dl>

          <!--User-->
          <dl class="dialog customer" v-if="dx.type != 0 && dx.content != ''">
            <dd>
              <div>
                <p v-for="(dx,index) in plug.transBrArr(dx.content)" :key="index" class="com-p-html">{{dx}}</p>
              </div>
            </dd>
            <dt>
              <img v-if="userAvatar != null" :src="userAvatar">
              <i v-if="userAvatar == null" class="iconfont">&#xe685;</i>
            </dt>
          </dl>

        </li>
      </ul>
    </div>

    <!--padding-top: .07rem;--><!--共.9rem-->
    <dl class="reply" style="height:auto;">
      <!--padding-bottom: .07rem;-->
      <dt v-if="showWechat">
        <span>我想:</span>
        <!--height: .26rem;-->
        <!-- <button v-if="!consultState" @click="getOAuth" type="button" class="com-btn"><label v-if="simply">及时接收顾问回复</label><label
            v-else>及時接收顧問回復</label></button>
        <button v-if="consultState" @click="getOAuthed" type="button" class="com-btn"><label v-if="simply">及时接收顾问回复<em>已开启</em></label><label
            v-else>及時接收顧問回復 <em>已開啟</em></label></button> -->
        <button v-if="showWechat" type="button" class="com-btn" @click="openWechat" id="copyAgentW"
          :data-clipboard-text="comAgentWechatData.id"><label v-if="simply">获取顾问WeChat</label><label v-else>獲取顧問WeChat</label></button>
      </dt>
      <!--height: .5rem;-->
      <dd>
        <input type="text" class="com-btn aux-btn" ref="msgTag" :placeholder="loadingMsg" v-model="msgContent" value=""
          @keyup.enter="send" @click="compatible">
        <i class="iconfont" v-if="isSend" @click="send">&#xe636;</i>
        <i class="iconfont" v-if="!isSend" style="opacity:.2;">&#xe636;</i>
      </dd>
    </dl>

    <com-agent-wechat :params="comAgentWechatData"></com-agent-wechat>
    <com-oauthed-phone :params="authedData"></com-oauthed-phone>
  </div>
</template>


<script src="./index.js"></script>
<style scoped>
  input::-webkit-input-placeholder {
    color: #ccc;
  }

  section {
    width: 3.5rem;
    margin: .1rem auto;
    border: 1px solid #eee;
    border-radius: .08rem;
    background: #fff;
  }

  section>div.card {
    border-bottom: 1px solid #eee;
    padding: .175rem 0;
    padding-left: .16rem;
  }

  section>div:last-child {
    border-bottom: 0;
  }

  section>div.card h3 {
    font-size: .17rem;
    color: #2a2a2a;
  }

  section>div.card p {
    font-size: .14rem;
    color: #ccc;
    line-height: .2rem;
  }

  section div.link {
    padding-right: .14rem;
  }

  section div.link em {
    margin: auto;
    width: .46rem;
    height: .46rem;
    border-radius: 100%;
    background-size: 100%;
    background-position: center center;
    display: inline-block;
  }

  section div.link i {
    margin: auto;
    font-size: .46rem;
    line-height: .46rem;
    color: #999;
  }

  section div.homepage {
    height: .5rem;
    line-height: .5rem;
    padding-left: .16rem;
    padding-right: .125rem;
    color: #999;
  }

  section div.homepage span {
    flex: 1;
  }

  section div.homepage i {
    font-size: .26rem;
    color: #3364e4;
  }

  ul,
  ul>li {
    overflow: hidden;
  }

  ul>li {
    margin-bottom: .2rem;
  }

  ul>li>p {
    text-align: center;
    color: #999;
    font-size: .12rem;
    height: .4rem;
    line-height: .4rem;
  }

  ul>li dl.dialog {
    overflow: hidden;
    display: flex;
  }

  dl.dialog>dt {
    overflow: hidden;
    width: .4rem;
    height: .4rem;
    border-radius: 100%;
  }

  dl.dialog>dt img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }

  dl.dialog>dt em {
    margin: auto;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    background-size: 100%;
    background-position: center center;
    display: inline-block;
  }

  dl.dialog>dt i {
    font-size: .4rem;
    line-height: .4rem;
    color: #ddd;
  }

  dl.dialog>dd {
    flex: 1;
  }

  dl.dialog>dd>div {
    max-width: 100%;
    height: 100%;
    display: inline-block;
    border-radius: .08rem;
    padding: .08rem .1rem;
    line-height: .24rem;
  }

  dl.dialog>dd>div>span.content {
    line-height: .25rem;
    font-size: .15rem;
    word-wrap: break-word;
    word-break: break-all;
  }

  .continue-send {
    position: absolute;
    top: 0;
    left: -.4rem;
    height: .4rem;
    line-height: .4rem;
    display: block;
    color: #f00;
    font-size: .12rem;
    width: .4rem;
    text-align: center;
  }

  dl.dialog.agent>dt {
    margin-left: .12rem;
  }

  dl.dialog.customer>dt {
    margin-right: .12rem;
  }

  dl.dialog.agent>dd {
    padding-right: .64rem;
    padding-left: .12rem;
  }

  dl.dialog.agent>dd>div {
    float: left;
    background: #fff;
    color: #666;
  }

  dl.dialog.customer>dd {
    padding-left: .64rem;
    padding-right: .12rem;
    overflow: hidden;
  }

  dl.dialog.customer>dd>div {
    float: right;
    background: #4b93ff;
    color: #fff;
  }

  dl.dialog.agent>dd::after {
    position: absolute;
    top: .15rem;
    left: -.03rem;
    content: "";
    width: 0;
    height: 0;
    border: .08rem solid transparent;
    border-top-width: .05rem;
    border-bottom-width: .05rem;
    border-right-color: #fff;
  }

  dl.dialog.customer>dd::after {
    position: absolute;
    top: .15rem;
    right: -.03rem;
    content: "";
    width: 0;
    height: 0;
    border: .08rem solid transparent;
    border-top-width: .05rem;
    border-bottom-width: .05rem;
    border-left-color: #4b93ff;
  }

  dl.dialog.agent>dd>div button[type="button"] {
    height: .28rem;
    color: #3364e4;
    font-size: .12rem;
    border-radius: .28rem;
    border: 1px solid #3364e4;
    background: transparent;
    display: block;
    margin: auto;
    margin-top: .1rem;
  }

  dl.dialog.agent>dd>div button[type="button"]:active {
    border: 1px solid #ddd;
    color: #ddd;
  }

  dl.reply {
    width: 100%;
    box-shadow: 0 -1px 1px #ddd;
    padding-top: .07rem;
    background-color: #f2f2f2;
  }

  dl.reply>dt {
    font-size: .12rem;
    padding-left: .12rem;
    color: #999;
    padding-bottom: .07rem;
  }

  dl.reply>dt button {
    color: #999;
    height: .26rem;
    font-size: .12rem;
    background: #fff;
    border: 1px solid #ddd;
    padding: 0 .08rem;
    border-radius: .26rem;
  }

  dl.reply>dt button i {
    margin-right: .05rem;
    font-size: .12rem;
    transform: scale(.8);
    display: inline-block;
  }

  dl.reply>dt button em {
    color: #ccc;
    transform: scale(.8);
  }

  dl.reply>dt button:active {
    color: #3364e4;
    border: 1px solid #3364e4;
  }

  dl.reply>dd {
    height: .5rem;
    padding-left: .12rem;
  }

  dl.reply>dd * {
    float: left;
  }

  dl.reply>dd input {
    width: 3.2rem;
    height: .44rem;
    border-radius: .06rem;
    padding-right: .1rem;
    padding-left: .1rem;
    border: 1px solid #ddd;
    background: #fff;
    font-size: .16rem;
  }

  dl.reply>dd i {
    font-size: .22rem;
    color: #3364e4;
    margin-left: .1rem;
    top: .08rem;
  }
</style>