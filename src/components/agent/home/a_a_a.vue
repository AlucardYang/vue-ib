<template>
  <div class="com-frame iber-agent-aaa" style="padding-bottom:.64rem;">
    <div class="com-frame com-bgrs bg">
      <div>
        <mt-swipe class="page" :auto="0" :show-indicators="false" :defaultIndex="0" @change="handleChange">
          <mt-swipe-item :style="{'padding-top': inApp ? '.35rem': '.15rem'}">
            <dl class="com-flexv theme info">
              <div v-if="!inApp" @click="thumbsUpHandle" class="thumbs-up">
                <i v-if="!thumbsState" class="iconfont like-icon e-bubble">&#xe798;</i>
                <i v-if="thumbsState" class="iconfont like-icon e-bubble">&#xe797;</i>
              </div>
              <dt>
                <div v-if="plug.valueValid(agent.baseInfo.avatar)" class="com-mgrl">
                  <img @click="openAvatar" :src="agent.baseInfo.avatarLimit" class="e-bubble avatar" alt="">
                  <img v-if="agent.baseInfo.realname_verified == '1'" @click="openAuth(1)" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_vip.svg" alt="">
                  <img v-if="agent.baseInfo.realname_verified == '0'" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_user.svg" alt="">
                </div>
                <h3 class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.nickname)">{{agent.baseInfo.nickname}}</h3>
                <p class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.position)">{{agent.baseInfo.position}}</p>
                <em v-if="mdrt.state == '1'" class="iber-agent-mdrt" style="background-color:#D81717;color:#fff;">
                  <i v-if="mdrt.level == 1" class="iconfont">&#xe726;</i><!--MDRT-->
                  <i v-if="mdrt.level == 2" class="iconfont">&#xe724;</i><!--COT-->
                  <i v-if="mdrt.level == 3" class="iconfont">&#xe725;</i><!--TOT-->
                  <i v-if="mdrt.level == 4" class="iconfont">&#xe600;</i><!--QUalifying & Life Member-->
                </em>
              </dt>
              <dd class="com-scroll aux-bar">
                <ul class="aux">
                  <li v-if="plug.valueValid(agent.baseInfo.company) || plug.valueValid(agent.baseInfo.company_en)" class="com-disx">
                    <em class="com-flex"><i class="iconfont">&#xe715;</i></em>
                    <div class="com-flexv">
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
              </dd>
              <div class="shadow">
                <div>
                  <footer @click="consultAgent"><i class="iconfont">&#xe6cc;</i><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></footer>
                </div>
              </div>
            </dl>
          </mt-swipe-item>
          <mt-swipe-item v-if="plug.valueValid(agent.baseInfo.signature)">
            <dl class="com-flexv theme autograph">
              <dt class="com-bgrs cm">
                <h3><label v-if="simply">个性签名</label><label v-else>個性簽名</label></h3>
                <p class="cm">INDIVIDUALITY SIGNATURE</p>
              </dt>
              <dd class="com-scroll aux-bar">
                <div>
                  <i class="iconfont left">&#xe6f2;</i>
                  <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
                  <i class="iconfont right">&#xe6f3;</i>
                </div>
              </dd>
              <div class="shadow">
                <div>
                  <footer @click="consultAgent"><i class="iconfont">&#xe6cc;</i><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></footer>
                </div>
              </div>
            </dl>
          </mt-swipe-item>
          <mt-swipe-item v-if="plug.valueValid(agent.baseInfo.abstract)">
            <dl class="com-flexv theme profile">
              <dt class="com-bgrs cm">
                <h3><label v-if="simply">个人简介</label><label v-else>個人簡介</label></h3>
                <p class="cm">PERSONAL PROFILE</p>
              </dt>
              <dd class="com-scroll aux-bar">
                <div>
                  <i class="iconfont left">&#xe6f2;</i>
                  <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></div>
                  <i class="iconfont right">&#xe6f3;</i>
                </div>
              </dd>
              <div class="shadow">
                <div>
                  <footer @click="consultAgent"><i class="iconfont">&#xe6cc;</i><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></footer>
                </div>
              </div>
            </dl>            
          </mt-swipe-item>
          <mt-swipe-item v-if="agent.workExperience.length > 0">
            <dl class="com-flexv theme experience">
              <dt class="com-bgrs cm">
                <h3><label v-if="simply">从业经验</label><label v-else>從業經驗</label></h3>
                <p class="cm">EXPERIENCE</p>
              </dt>
              <dd class="com-scroll aux-bar">
                <ul>
                  <li v-for="(dx, index) in agent.workExperience">
                    <h3 class="com-wrap com-p-title">{{dx.company_name}}</h3>
                    <p class="com-wrap">{{dx.start_at}} ~ {{dx.end_at}}<em class="line">|</em>{{dx.position}}</p>
                    <div class="com-wrap content" v-html="plug.prohibitFilter(dx.job_content)"></div>
                  </li>
                </ul>
              </dd>
              <div class="shadow">
                <div>
                  <footer @click="consultAgent"><i class="iconfont">&#xe6cc;</i><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></footer>
                </div>
              </div>
            </dl>            
          </mt-swipe-item>
          <mt-swipe-item v-if="agent.honors.length > 0">
            <dl class="com-flexv theme honor">
              <dt class="com-bgrs cm">
                <h3><label v-if="simply">个人荣誉</label><label v-else>個人榮譽</label></h3>
                <p class="cm">PERSONAL HONOR</p>
              </dt>
              <dd class="com-scroll aux-bar">
                <ul class="aux">
                  <li class="com-disx" v-for="(dx, index) in agent.honors">
                    <span>{{dx.honor_date}}</span>
                    <div>
                      <h3 class="com-wrap com-p-title">{{dx.name}}</h3>
                      <div class="com-wrap" v-html="plug.prohibitFilter(dx.situation)"></div>
                    </div>
                  </li>
                </ul> 
              </dd>
              <div class="shadow">
                <div>
                  <footer @click="consultAgent"><i class="iconfont">&#xe6cc;</i><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></footer>
                </div>
              </div>
            </dl>            
          </mt-swipe-item>
          <mt-swipe-item v-if="agent.photos.length > 0">
            <dl class="com-flexv theme album">
              <dt class="com-bgrs cm">
                <h3><label v-if="simply">个人相簿</label><label v-else>個人相簿</label></h3>
                <p class="cm">PERSONAL PHOTO ALBUM</p>
              </dt>
              <dd class="com-scroll aux-bar" v-load-scroll="loadMore">
                <!--width:2.9rem-->
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
                </div>
                <com-more-load v-if='more.state'></com-more-load>
              </dd>
              <div class="shadow">
                <div>
                  <footer @click="consultAgent"><i class="iconfont">&#xe6cc;</i><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></footer>
                </div>
              </div>
            </dl>            
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </div>


    <img v-if="gestureLeft && slideCount > 1" class="agent-gesture-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_h_gesture_left.png" alt="">
    <div class="remark">
      <label v-if="simply">{{plug.simplyAgentBottomTxt}}</label>
      <label v-else>{{plug.agentBottomTxt}}</label>
    </div> 
    <div v-if="false" class="com-screen aux-fix com-flex com-praise-agent">
      <i class="iconfont aux-effect">&#xe798;</i>
    </div>
    <!--底部卡片-->
    <com-agent-avatar :params="comAARData"></com-agent-avatar>
    <com-agent-album :params="comAAMData"></com-agent-album>
    <com-agent-auth :params="comAAHData"></com-agent-auth>
  </div>
</template>


<script src="./index.js"></script> 
<style src="./css/agent.css"></style> 
<style scoped src="./css/a_a_a.css"></style>