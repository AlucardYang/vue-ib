<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar com-marlt aux-pdm iber-aac" v-load-scroll="loadMore" :scroll-distance="calcBottom(1.5)">
      <img class="banner" src="https://static.iberhk.com/v2/web/images/agent/a_a_c_bg.png" alt="">
      <dl class="theme info" style="overflow:visible;">
        <dt>
          <img class="buckhorn" src="https://static.iberhk.com/v2/web/images/agent/a_a_c_buckhorn.png" alt="">
          <img class="claus" src="https://static.iberhk.com/v2/web/images/agent/a_a_c_claus.png" alt="">
          <div class="avatar">
            <div>
              <img @click="openAvatar" :src="agent.baseInfo.avatarLimit" class="e-bubble avatar" alt="">
              <img v-if="agent.baseInfo.realname_verified == '1'" @click="openAuth(1)" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_vip.svg" alt="">
              <img v-if="agent.baseInfo.realname_verified == '0'" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_user.svg" alt="">
            </div>
            <h3 class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.nickname)">{{agent.baseInfo.nickname}}</h3>
            <p class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.position)">{{agent.baseInfo.position}}</p>

            <em v-if="mdrt.state == '1'" class="iber-agent-mdrt" style="background-color:#089623;color:#fff;margin-left:.38rem;">
              <i v-if="mdrt.level == 1" class="iconfont">&#xe726;</i><!--MDRT-->
              <i v-if="mdrt.level == 2" class="iconfont">&#xe724;</i><!--COT-->
              <i v-if="mdrt.level == 3" class="iconfont">&#xe725;</i><!--TOT-->
              <i v-if="mdrt.level == 4" class="iconfont">&#xe600;</i><!--QUalifying & Life Member-->
            </em>
          </div>
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
              <div class="com-wrap" v-html="plug.prohibitFilter(dx.situation)"></div>
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

                      <div v-if="idx.state" class="iber-album-bg my-radius" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                    </div>

                  </div>
                </li>
              </ul>
            </div>
            <span>{{dx.time}}</span>
            <div v-if="agent.photos.length > 1 && index != agent.photos.length - 1" class="agent-album-handle">
              <img class="left" src="https://static.iberhk.com/v2/web/images/agent/a_a_c_handle.svg" alt="">
              <img class="right" src="https://static.iberhk.com/v2/web/images/agent/a_a_c_handle.svg" alt="">
            </div>
          </div> 

          <com-more-load v-if='more.state'></com-more-load>
        </dd>
      </dl>
      <div class="remark">
        <label v-if="simply">本页内容仅为个人观点，不代表内容中提及的公司/机构/团体之意见，亦不构成其官方通信</label>
        <label v-else>本頁內容僅為個人觀點，不代表內容中提及的公司/機構/團體之意見，亦不構成其官方通訊</label>
      </div>
    </div>

    <div class="consult" @click="consultAgent" :style="sheepGo" @touchstart.stop="startHandle" @touchmove.stop="moveHandle" @touchend="endHandle"><img src="https://static.iberhk.com/v2/web/images/agent/a_a_c_deer.png" alt="">
      <label v-if="simply">立即咨询</label><label v-else>立即諮詢</label>
    </div>

    <!--底部卡片-->
    <com-agent-avatar :params="comAARData"></com-agent-avatar>
    <com-agent-album :params="comAAMData"></com-agent-album>
    <com-agent-auth :params="comAAHData"></com-agent-auth>
    <like-btn :share="share" :is-like="analyze.approval"></like-btn>
  </div>
</template>


<script src="./js/a_a_c.js"></script>
<style scoped src="./css/agent.css"></style>
<style scoped src="./css/a_a_c.css"></style>