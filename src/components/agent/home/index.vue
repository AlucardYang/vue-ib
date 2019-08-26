<template>
  <div class="com-frame" style="padding-bottom:.5rem;" :class="{'com-wxix-frame': wxixm}">
    <div class="com-scroll-y aux-bar com-marlt agent-index" @scroll="scrollHandle" style="padding-bottom:.7rem;" v-load-scroll="loadMore" :scroll-distance="calcBottom(1.5)"> 
      <img class="banner" src="https://static.iberhk.com/v2/web/images/agent/banner.png" alt="">
      <dl class="theme info" style="overflow:visible;">
        <dt> 
          <div class="avatar" v-if="plug.valueValid(agent.baseInfo.avatar)">
            <img v-if="plug.valueValid(agent.baseInfo.avatar)" @click.stop="openAvatar" :src="agent.baseInfo.avatarLimit" class="e-bubble avatar" alt="">
            <img v-if="agent.baseInfo.realname_verified == '1'" @click="openAuth(1)" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_vip.svg" alt="">
            <img v-if="agent.baseInfo.realname_verified == '0'" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_user.svg" alt="">
          </div>
          <h3 class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.nickname)">{{agent.baseInfo.nickname}}</h3>
          <p class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.position)">{{agent.baseInfo.position}}</p>
          <em v-if="mdrt.state == '1'" class="iber-agent-mdrt" style="background-color:#538CEE;color:#fff;">
            <i v-if="mdrt.level == 1" class="iconfont">&#xe726;</i><!--MDRT-->
            <i v-if="mdrt.level == 2" class="iconfont">&#xe724;</i><!--COT-->
            <i v-if="mdrt.level == 3" class="iconfont">&#xe725;</i><!--TOT-->
            <i v-if="mdrt.level == 4" class="iconfont">&#xe600;</i><!--QUalifying & Life Member-->
          </em>
        </dt>
        <dd class="mark">
          <div v-if="plug.valueValid(agent.baseInfo.company) || plug.valueValid(agent.baseInfo.company_en)"
            style="overflow:hidden;margin-bottom:.2rem;">
            <h3 class="com-wrap title-format" v-if="plug.valueValid(agent.baseInfo.company)" style="font-size:.15rem;">
              {{agent.baseInfo.company}}</h3>
            <p v-if="plug.valueValid(agent.baseInfo.company_en)" class="com-wrap" style="font-size:.13rem;line-height: .16rem;">
              {{agent.baseInfo.company_en}}</p>
          </div>
          <ul class="aux">
            <li v-if="plug.valueValid(agent.baseInfo.mobile1) || plug.valueValid(agent.baseInfo.mobile2)" class="com-disx">
              <div class="com-flex">
                <em class="icon"><i class="iconfont">&#xe716;</i></em>
              </div>
              <p class="com-wrap">
                <span v-if="plug.valueValid(agent.baseInfo.mobile1)">+{{agent.baseInfo.mobile1_pre}}
                  {{agent.baseInfo.mobile1}}</span><br>
                <span v-if="plug.valueValid(agent.baseInfo.mobile2)">+{{agent.baseInfo.mobile2_pre}}
                  {{agent.baseInfo.mobile2}}</span>
              </p>
            </li>
            <li class="com-disx" v-if="plug.valueValid(agent.baseInfo.wechat_num)">
              <div class="com-flex">
                <em class="icon"><i class="iconfont">&#xe717;</i></em>
              </div>
              <p class="com-wrap">{{agent.baseInfo.wechat_num}}</p>
            </li>
            <li class="com-disx" v-if="plug.valueValid(agent.baseInfo.facebook_num)">
              <div class="com-flex">
                <em class="icon"><i class="iconfont">&#xe712;</i></em>
              </div>
              <p class="com-wrap">{{agent.baseInfo.facebook_num}}</p>
            </li>
            <li class="com-disx" v-if="plug.valueValid(agent.baseInfo.email)">
              <div class="com-flex">
                <em class="icon"><i class="iconfont">&#xe714;</i></em>
              </div>
              <p class="com-wrap">{{agent.baseInfo.email}}</p>
            </li>
            <li class="com-disx" v-if="plug.valueValid(agent.baseInfo.location)">
              <div class="com-flex aux-top">
                <em class="icon"><i class="iconfont">&#xe713;</i></em>
              </div>
              <p class="com-wrap">{{agent.baseInfo.location}}</p>
            </li>
          </ul>
        </dd>
      </dl>
      <dl class="theme autograph" v-if="plug.valueValid(agent.baseInfo.signature)">
        <dt class="mark"><i class="iconfont">&#xe709;</i><label v-if="simply">个性签名</label><label v-else>個性簽名</label></dt>
        <dd>
          <div>
            <i class="iconfont left">&#xe6f2;</i>
            <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
            <i class="iconfont right">&#xe6f3;</i>
          </div>
        </dd>
      </dl>
      <dl class="theme profile" v-if="plug.valueValid(agent.baseInfo.abstract)"> 
        <dt class="mark"><i class="iconfont">&#xe70e;</i><label v-if="simply">个人简介</label><label v-else>個人簡介</label></dt>
        <dd class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></dd>
      </dl>
      <dl class="theme experience" v-if="agent.workExperience.length > 0">
        <dt class="mark"><i class="iconfont">&#xe708;</i><label v-if="simply">从业经验</label><label v-else>從業經驗</label></dt>
        <dd>
          <ul class="aux">
            <li v-for="(dx, index) in agent.workExperience">
              <h3 class="com-wrap com-p-title">{{dx.company_name}}</h3>
              <p class="com-wrap">{{dx.start_at}} ~ {{dx.end_at}}<em class="line">|</em>{{dx.position}}</p>
              <div class="com-wrap" v-html="plug.prohibitFilter(dx.job_content)"></div>
            </li>
          </ul>
        </dd>
      </dl>
      <dl class="theme honor" v-if="agent.honors.length > 0">
        <dt class="mark"><i class="iconfont">&#xe70d;</i><label v-if="simply">个人荣誉</label><label v-else>個人榮譽</label></dt>
        <dd>
          <ul class="aux">
            <li v-for="(dx, index) in agent.honors">
              <h3 class="com-wrap com-p-title"><span>{{dx.honor_date}}</span>{{dx.name}}</h3>
              <p class="com-wrap" v-for="(idx, c_index) in plug.strSplit(dx.situation)" :key="c_index">- {{idx}}</p>
            </li>
          </ul>
        </dd> 
      </dl>
      <dl class="theme album" v-if="agent.photos.length > 0" style="background:transparent;">
        <dt class="mark"><i class="iconfont">&#xe70c;</i><label v-if="simply">个人相簿</label><label v-else>個人相簿</label></dt>
        <dd>
          <div v-for="(dx, index) in agent.photos">
            <p v-html="plug.prohibitFilter(dx.desc)"></p>
            <div class="iber-album-frame"> 
              <ul class="aux">
                <li v-if="dx.photo_list.length > 0" v-for="(idx, c_index) in dx.photo_list" class="iber-album-container">
                  <div>


                    <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                      <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>

                      <div v-if="idx.state" class="iber-album-bg my-radius" :style="{backgroundImage: 'url(' + idx.src + ')','background-position': 'center', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                    </div>

                    
                  </div>
                </li>
              </ul>
            </div>
            <span>{{dx.time}}</span>
            <div v-if="agent.photos.length > 1 && index != agent.photos.length - 1" class="agent-album-handle">
              <img class="left" src="https://static.iberhk.com/v2/web/images/agent/handle.svg" alt="">
              <img class="right" src="https://static.iberhk.com/v2/web/images/agent/handle.svg" alt="">
            </div>
          </div> 

          <com-more-load v-if='more.state'></com-more-load>
        </dd>
      </dl>
      <div class="remark">
        <label v-if="simply">{{plug.simplyAgentBottomTxt}}</label>
        <label v-else>{{plug.agentBottomTxt}}</label>
      </div> 
    </div>

    <button class="com-btn com-button-action aux-abs-full e-bubble" style="background:#fff;color:#3364e4;" :class="{'com-wxix-button': wxixm}" type="button" @click="consultAgent">
      <label class="e-bubble" v-if="simply">立即咨询</label>
      <label class="e-bubble" v-else>立即諮詢</label> 
    </button>  

    <!--底部卡片-->
    <img v-if="scroll.state && !inApp" @click="backTop" class="com-back-top" src="https://static.iberhk.com/v2/web/images/agent/back_top.png" style="bottom:1rem;" alt="">
    <img v-if="scroll.state && inApp" @click="backTop" class="com-back-top" src="https://static.iberhk.com/v2/web/images/agent/back_top.png" style="bottom:.5rem;" alt="">
    <com-agent-avatar :params="comAARData"></com-agent-avatar>
    <com-agent-album :params="comAAMData"></com-agent-album>
    <com-agent-auth :params="comAAHData"></com-agent-auth>
    <like-btn :share="share" :is-like="analyze.approval" :style="{bottom: wxixm ? '1.1rem' : '.7rem'}"></like-btn>
  </div>
</template>


<script src="./index.js"></script>
<style scoped src="./css/agent.css"></style>
<style scoped src="./css/index.css"></style>