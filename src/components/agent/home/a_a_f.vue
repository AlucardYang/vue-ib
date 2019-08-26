<template>
  <div class="com-frame iber-agent-aaf" style="padding-bottom:.5rem;" :class="{'aux-wxix-frame': wxixm}">
    <div class="com-scroll-y aux-bar aux-pdm" @scroll="scrollHandle" v-load-scroll="loadMore" :scroll-distance="calcBottom(1.5)">
      <div class="banner">
        <img src="https://static.iberhk.com/v2/web/images/agent/a_a_f_theme.png" alt="">
      </div>
      <div class="com-marlt">
          <dl class="theme info" style="overflow:visible;">
              <dt class="com-bgrs">
                <div class="avatar-auth">
                  <img @click="openAvatar" :src="agent.baseInfo.avatarLimit" class="e-bubble avatar" alt="">
                  <img v-if="agent.baseInfo.realname_verified == '1'" @click="openAuth(1)" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_vip.svg" alt="">
                  <img v-if="agent.baseInfo.realname_verified == '0'" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_user.svg" alt="">
                </div>
                <h3 class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.nickname)">{{agent.baseInfo.nickname}}</h3>
                <p class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.position)">{{agent.baseInfo.position}}</p>
      
                <em v-if="mdrt.state == '1'" class="iber-agent-mdrt" style="background-color:#fff;color:#2a2a2a;">
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
              <dt class="com-bgrs mark"><i class="iconfont">&#xe709;</i><label v-if="simply">个性签名</label><label v-else>個性簽名</label></dt>
              <dd>
                <div>
                  <i class="iconfont left">&#xe6f2;</i>
                  <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
                  <i class="iconfont right">&#xe6f3;</i>
                </div>
              </dd>
            </dl>
            <dl class="theme profile" v-if="plug.valueValid(agent.baseInfo.abstract)"> 
              <dt class="com-bgrs mark"><i class="iconfont">&#xe70e;</i><label v-if="simply">个人简介</label><label v-else>個人簡介</label></dt>
              <dd class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></dd>
            </dl>
            <dl class="theme experience" v-if="agent.workExperience.length > 0">
              <dt class="com-bgrs mark"><i class="iconfont">&#xe708;</i><label v-if="simply">从业经验</label><label v-else>從業經驗</label></dt>
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
              <dt class="com-bgrs mark"><i class="iconfont">&#xe70d;</i><label v-if="simply">个人荣誉</label><label v-else>個人榮譽</label></dt>
              <dd>
                <ul class="aux">
                  <li v-for="(dx, index) in agent.honors">
                    <h3 class="com-wrap com-p-title"><span>{{dx.honor_date}}</span>  🏆{{dx.name}}</h3>
                    <p class="com-wrap" v-for="(idx, c_index) in plug.strSplit(dx.situation)" :key="c_index">- {{idx}}</p>
                  </li>
                </ul>
              </dd> 
            </dl>
            <dl class="theme album" v-if="agent.photos.length > 0" style="background:transparent;">
              <dt class="com-bgrs mark"><i class="iconfont">&#xe70c;</i><label v-if="simply">个人相簿</label><label v-else>個人相簿</label></dt>
              <dd>
                <div v-for="(dx, index) in agent.photos">
                    <p v-html="plug.prohibitFilter(dx.desc)"></p>
                  <div class="avatar"> 
                    <!--1张-->
                    <ul class="com-mgrl aux one" v-if="dx.photo_list.length == 1">
                      <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-bg">
                          <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                              <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
      
                              <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                            </div>
                      </li>
                    </ul>
                    <!--2张-->
                    <ul class="com-mgrl aux three" v-if="dx.photo_list.length == 2">
                      <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-bg">
                          <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                              <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
      
                              <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                            </div>
                      </li>
                    </ul>
                    <!--3张-->
                    <ul class="com-mgrl aux three" v-if="dx.photo_list.length == 3">
                      <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-bg">
                          <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                              <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
      
                              <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                            </div>
                      </li>
                    </ul>
                    <!--4张-->
                    <ul class="com-mgrl aux four" v-if="dx.photo_list.length == 4">
                      <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-bg">
                          <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                              <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
      
                              <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                            </div>
                      </li>
                    </ul>
                    <!--5张-->  
                    <ul class="com-mgrl aux three" v-if="dx.photo_list.length == 5">
                      <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-bg" :class="'cl' + c_index">
                          <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                              <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
      
                              <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                            </div>
                      </li>
                    </ul>
                    <!--大于等于6张-->
                    <ul class="com-mgrl aux three" v-if="dx.photo_list.length > 5">
                      <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-bg">
                          <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                              <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
      
                              <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                            </div>
                      </li>
                    </ul>   
                  </div>
                  <span>{{dx.time}}</span>
                  <div v-if="agent.photos.length > 1 && index != agent.photos.length - 1" class="agent-album-handle">
                    <img class="left" src="https://static.iberhk.com/v2/web/images/agent/a_a_f_handle.svg" alt="">
                    <img class="right" src="https://static.iberhk.com/v2/web/images/agent/a_a_f_handle.svg" alt="">
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
 
    </div> 


    <div class="iber-consult" :style="{'padding-bottom': wxixm ? '.4rem':'0'}">
      <button class="com-btn com-button-action" type="button" @click="consultAgent">
        <label v-if="simply">立即咨询</label>
        <label v-else>立即諮詢</label> 
      </button>  
    </div>
    <!--底部卡片-->
    <img v-if="scroll.state" @click="backTop" class="com-back-top" :src="$root.back_top" style="bottom:.5rem;" alt="">
    <com-agent-avatar :params="comAARData"></com-agent-avatar>
    <com-agent-album :params="comAAMData"></com-agent-album>
    <com-agent-auth :params="comAAHData"></com-agent-auth>
    <like-btn :share="share" :is-like="analyze.approval" temp="a-a-f"></like-btn>
  </div>
</template>


<script src="./js/a_a_f.js"></script>
<style scoped src="./css/agent.css"></style>
<style scoped src="./css/a_a_f.css"></style>