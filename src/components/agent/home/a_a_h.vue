<template>
  <div class="com-frame iber-agent-aah">
    <div class="com-frame">
      <mt-swipe class="slide" :auto="0" :show-indicators="false" :defaultIndex="0" @change="handleChange">
        <mt-swipe-item class="com-bgrs slide-info">
          <div class="iber-header">
            <img src="https://static.iberhk.com/v2/web/images/agent/a_a_h_header_info.png" alt="">
          </div>
          <dl class="com-flexv theme info">
            <dt style="padding-bottom: .1rem;">
              <like-btn :share="share" :is-like="analyze.approval" temp="a-a-h"></like-btn>
              <div class="com-mgrl avatar">
                <img @click="openAvatar" :src="agent.baseInfo.avatarLimit" class="e-bubble avatar" alt="">
                <img v-if="agent.baseInfo.realname_verified == '1'" @click="openAuth(1)" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_vip.svg" alt="">
                <img v-if="agent.baseInfo.realname_verified == '0'" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_user.svg" alt="">
              </div>
              <h3 class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.nickname)">{{agent.baseInfo.nickname}}</h3>
              <p class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.position)">{{agent.baseInfo.position}}</p>    
              
              <em v-if="mdrt.state == '1'" class="iber-agent-mdrt" style="background-color:#ECE5F3;color:#863DC6;">
                <i v-if="mdrt.level == 1" class="iconfont">&#xe726;</i><!--MDRT-->
                <i v-if="mdrt.level == 2" class="iconfont">&#xe724;</i><!--COT-->
                <i v-if="mdrt.level == 3" class="iconfont">&#xe725;</i><!--TOT-->
                <i v-if="mdrt.level == 4" class="iconfont">&#xe600;</i><!--QUalifying & Life Member-->
              </em> 
            </dt>
            <dd class="com-scroll aux-bar">
              <ul class="aux">
                <li v-if="plug.valueValid(agent.baseInfo.company) || plug.valueValid(agent.baseInfo.company_en)" class="com-disx" :style="{'padding-top': plug.android ? '.05rem' : ''}">
                  <em class="com-flex"><i class="iconfont">&#xe715;</i></em>
                  <div class="com-flexv" :style="{'padding-top': plug.android ? '.05rem' : ''}">
                    <h5 class="com-wrap title-format" v-if="plug.valueValid(agent.baseInfo.company)">{{agent.baseInfo.company}}</h5>
                    <p v-if="plug.valueValid(agent.baseInfo.company_en)" class="com-wrap" style="line-height:.18rem;font-size:.11rem;text-align:left;width: 100%;">{{agent.baseInfo.company_en}}</p>
                  </div>
                </li>
                <li v-if="plug.valueValid(agent.baseInfo.mobile1) || plug.valueValid(agent.baseInfo.mobile2)" class="com-disx">
                  <em class="com-flex"><i class="iconfont">&#xe716;</i></em>
                  <div class="com-flexv">
                    <p class="com-wrap">
                      <span v-if="plug.valueValid(agent.baseInfo.mobile1)">+{{agent.baseInfo.mobile1_pre}} {{agent.baseInfo.mobile1}}</span><br>   
                      <span v-if="plug.valueValid(agent.baseInfo.mobile2)">+{{agent.baseInfo.mobile2_pre}} {{agent.baseInfo.mobile2}}</span>
                    </p>
                  </div>
                </li>
                <li v-if="plug.valueValid(agent.baseInfo.wechat_num)" class="com-disx">
                  <em class="com-flex"><i class="iconfont">&#xe717;</i></em>
                  <div class="com-flexv">
                    <p class="com-wrap">{{agent.baseInfo.wechat_num}}</p>
                  </div>
                </li>
                <li v-if="plug.valueValid(agent.baseInfo.facebook_num)" class="com-disx">
                  <em class="com-flex"><i class="iconfont">&#xe712;</i></em>
                  <div class="com-flexv">
                    <p class="com-wrap">{{agent.baseInfo.facebook_num}}</p>
                  </div>
                </li>
                <li v-if="plug.valueValid(agent.baseInfo.email)" class="com-disx">
                  <em class="com-flex"><i class="iconfont">&#xe714;</i></em>
                  <div class="com-flexv">
                    <p class="com-wrap">{{agent.baseInfo.email}}</p>
                  </div>
                </li>
                <li v-if="plug.valueValid(agent.baseInfo.location)" class="com-disx">
                  <em class="com-flex aux-top"><i class="iconfont">&#xe713;</i></em>
                  <div class="com-flexv">
                    <p class="com-wrap">{{agent.baseInfo.location}}</p>
                  </div> 
                </li> 
              </ul>
              <div class="remark">
                <label v-if="simply">{{plug.simplyAgentBottomTxt}}</label>
                <label v-else>{{plug.agentBottomTxt}}</label>
              </div> 
            </dd>
            <footer @click="consultAgent">
              <i class="iconfont">&#xe6cc;</i>
              <label v-if="simply">立即咨询</label>
              <label v-else>立即諮詢</label> 
            </footer>
          </dl>
        </mt-swipe-item>
        <mt-swipe-item class="com-bgrs slide-autograph" v-if="plug.valueValid(agent.baseInfo.signature)">
          <div class="iber-header">
            <img src="https://static.iberhk.com/v2/web/images/agent/a_a_h_header_autograph.png" alt="">
          </div>
          <dl class="com-flexv theme autograph">
            <dt class="mark" style="margin-top: .2rem;"><label v-if="simply">个性签名</label><label v-else>個性簽名</label></dt>
            <dd class="com-scroll aux-bar">
              <div>
                <i class="iconfont left">&#xe6f2;</i>
                <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
                <i class="iconfont right">&#xe6f3;</i>
              </div>
            </dd>
            <footer @click="consultAgent">
              <i class="iconfont">&#xe6cc;</i>
              <label v-if="simply">立即咨询</label>
              <label v-else>立即諮詢</label> 
            </footer>
          </dl>
        </mt-swipe-item>
        <mt-swipe-item class="com-bgrs slide-profile" v-if="plug.valueValid(agent.baseInfo.abstract)">
          <div class="iber-header">
            <img src="https://static.iberhk.com/v2/web/images/agent/a_a_h_header_profile.png" alt="">
          </div>
          <dl class="com-flexv theme profile">
            <dt class="mark"><label v-if="simply">个人简介</label><label v-else>個人簡介</label></dt>
            <dd class="com-scroll aux-bar">
              <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></div>
            </dd>
            <footer @click="consultAgent">
                <i class="iconfont">&#xe6cc;</i>
              <label v-if="simply">立即咨询</label>
              <label v-else>立即諮詢</label> 
            </footer>
          </dl>
        </mt-swipe-item>
        <mt-swipe-item class="com-bgrs slide-experience" v-if="agent.workExperience.length > 0">
          <div class="iber-header">
            <img src="https://static.iberhk.com/v2/web/images/agent/a_a_h_header_experience.png" alt="">
          </div>
          <dl class="com-flexv theme experience">
            <dt class="mark"><label v-if="simply">从业经验</label><label v-else>從業經驗</label></dt>
            <dd class="com-scroll aux-bar">
              <ul class="aux">
                <li v-for="(dx, index) in agent.workExperience">
                  <h3 class="com-wrap com-p-title">{{dx.company_name}}</h3>
                  <p class="com-wrap">{{dx.start_at}} ~ {{dx.end_at}}<em class="line">|</em>{{dx.position}}</p>
                  <div class="com-wrap content" v-html="plug.prohibitFilter(dx.job_content)"></div>
                </li>
              </ul>
            </dd>
            <footer @click="consultAgent">
                <i class="iconfont">&#xe6cc;</i>
              <label v-if="simply">立即咨询</label>
              <label v-else>立即諮詢</label> 
            </footer>
          </dl>
        </mt-swipe-item>
        <mt-swipe-item class="com-bgrs slide-honor" v-if="agent.honors.length > 0">
          <div class="iber-header">
            <img src="https://static.iberhk.com/v2/web/images/agent/a_a_h_header_honor.png" alt="">
          </div>
          <dl class="com-flexv theme honor">
            <dt class="mark"><label v-if="simply">个人荣誉</label><label v-else>個人榮譽</label></dt>
            <dd class="com-scroll aux-bar">
              <ul class="aux">
                <li class="com-disx" v-for="(dx, index) in agent.honors">
                  <span class="com-flex">{{dx.honor_date}}</span>
                  <div>
                    <h3 class="com-wrap com-p-title">{{dx.name}}</h3>
                    <p class="com-wrap" v-for="(idx, c_index) in plug.strSplit(dx.situation)" :key="c_index">🏅 {{idx}}</p>
                  </div>                
                </li>
              </ul>
            </dd>
            <footer @click="consultAgent">
                <i class="iconfont">&#xe6cc;</i>
              <label v-if="simply">立即咨询</label>
              <label v-else>立即諮詢</label> 
            </footer>
          </dl> 
        </mt-swipe-item>
        <mt-swipe-item class="com-bgrs slide-album" v-if="agent.photos.length > 0">
          <div class="iber-header">
            <img src="https://static.iberhk.com/v2/web/images/agent/a_a_h_header_album.png" alt="">
          </div>
          <dl class="com-flexv theme album">
            <dt class="mark"><label v-if="simply">个人相簿</label><label v-else>個人相簿</label></dt>
            <dd class="com-scroll aux-bar" v-load-scroll="loadMore">
              <ul class="aux">
                <li v-for="(dx, index) in agent.photos">
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
                </li>
              </ul>

              <com-more-load v-if='more.state'></com-more-load>
            </dd>
            <footer @click="consultAgent">
                <i class="iconfont">&#xe6cc;</i>
              <label v-if="simply">立即咨询</label>
              <label v-else>立即諮詢</label> 
            </footer>
          </dl> 
        </mt-swipe-item>
      </mt-swipe>
    </div>


    <img v-if="gestureLeft && slideCount > 1" class="agent-gesture-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_h_gesture_left.png" alt="">
    <!--底部卡片-->
    <com-agent-avatar :params="comAARData"></com-agent-avatar>
    <com-agent-album :params="comAAMData"></com-agent-album>
    <com-agent-auth :params="comAAHData"></com-agent-auth>
  </div>
</template>


<script src="./js/a_a_h.js"></script>
<style src="./css/agent.css"></style>
<style scoped src="./css/a_a_h.css"></style>