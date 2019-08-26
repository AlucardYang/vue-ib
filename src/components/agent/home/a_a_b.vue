<template>
  <div class="com-frame priv-agent-a-a-b">
    <div class="com-frame com-bgrs bg">
      <mt-swipe :auto="0" :show-indicators="false" :defaultIndex="0" @change="handleChange">
        <mt-swipe-item>
          <div class="mt-swipe-item"> 
            <img class="dress up-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_upl.png" alt="">
            <img class="dress down" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_bottom.png" alt="">
            <div class="consult" @click="consultAgent"><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></div>
            <div class="remark">
              <label v-if="simply">{{plug.simplyAgentBottomTxt}}</label>
              <label v-else>{{plug.agentBottomTxt}}</label>
            </div> 
            <dl class="com-flexv theme info" style="padding-top:.7rem;">
              <dd class="com-scroll aux-bar">
                <div class="com-mgrl com-bgrs avatar">
                  <img @click="openAvatar" :src="agent.baseInfo.avatarLimit" class="e-bubble avatar" alt="">
                  <img class="flower" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_avatar.png" alt="">

                  <img v-if="agent.baseInfo.realname_verified == '1'" @click="openAuth(1)" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_vip.svg" alt="">
                  <img v-if="agent.baseInfo.realname_verified == '0'" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_user.svg" alt="">
                </div> 
                <h3 class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.nickname)">{{agent.baseInfo.nickname}}</h3>
                <p class="com-nowrap" v-if="plug.valueValid(agent.baseInfo.position)">{{agent.baseInfo.position}}</p>

                <em v-if="mdrt.state == '1'" class="iber-agent-mdrt" style="background-color:#3FC85A;color:#fff;">
                  <i v-if="mdrt.level == 1" class="iconfont">&#xe726;</i><!--MDRT-->
                  <i v-if="mdrt.level == 2" class="iconfont">&#xe724;</i><!--COT-->
                  <i v-if="mdrt.level == 3" class="iconfont">&#xe725;</i><!--TOT-->
                  <i v-if="mdrt.level == 4" class="iconfont">&#xe600;</i><!--QUalifying & Life Member-->
                </em>
              </dd>
              <dt>
                <h3 class="com-wrap title-format" v-if="plug.valueValid(agent.baseInfo.company)" style="font-size:.15rem;">{{agent.baseInfo.company}}</h3>
                <p v-if="plug.valueValid(agent.baseInfo.company_en)" class="com-wrap" style="font-size:.13rem;line-height: .16rem;">{{agent.baseInfo.company_en}}</p>
              </dt> 
            </dl>
          </div>
        </mt-swipe-item>
        <mt-swipe-item v-if="plug.valueValid(agent.baseInfo.signature)">
          <div class="mt-swipe-item">
            <img class="dress up-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_upl.png" alt="">
            <img class="dress down" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_bottom.png" alt="">
            <div class="consult" @click="consultAgent"><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></div>
            <dl class="com-flexv com-bgrs theme autograph">
              <dt>
                <img v-if="plug.qihu" @click.stop="openAvatar" :src="agent.baseInfo.avatarLimit" class="avatar" alt="">
                <img v-else @click.stop="openAvatar" :src="agent.baseInfo.avatar" class="avatar" alt="">
              </dt>
              <dd class="com-scroll aux-bar">
                <div class="com-wrap content" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
              </dd>
            </dl> 
          </div>
        </mt-swipe-item>
        <mt-swipe-item v-if="plug.valueValid(agent.baseInfo.abstract)">
          <div class="mt-swipe-item">
            <img class="dress up-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_upl.png" alt="">
            <img class="dress down" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_bottom.png" alt="">
            <div class="consult" @click="consultAgent"><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></div>
            <dl class="com-flexv theme cm profile">
              <dt><h3><label v-if="simply">个人简介</label><label v-else>個人簡介</label></h3></dt>
              <dd class="com-scroll aux-bar">
                <div>
                  <div class="com-wrap content" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></div>
                </div>
              </dd>
            </dl>
          </div>
        </mt-swipe-item>
        <mt-swipe-item v-if="agent.workExperience.length > 0">
          <div class="mt-swipe-item">
            <img class="dress up-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_upl.png" alt="">
            <img class="dress down" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_bottom.png" alt="">
            <div class="consult" @click="consultAgent"><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></div>
            <dl class="com-flexv theme cm experience">
              <dt><h3><label v-if="simply">从业经验</label><label v-else>從業經驗</label></h3></dt>
              <dd class="com-scroll aux-bar">
                <ul class="aux">
                  <li v-for="(dx, index) in agent.workExperience">
                    <h3 class="com-wrap com-p-title"><i class="iconfont">&#xe705;</i>{{dx.company_name}}</h3>
                    <p class="com-wrap"><span>{{dx.start_at}} ~ {{dx.end_at}}</span>{{dx.position}}</p>
                    <div class="line">
                      <div class="com-wrap" v-html="plug.prohibitFilter(dx.job_content)"></div>
                    </div>
                  </li> 
                </ul>
              </dd>
            </dl>
          </div>
        </mt-swipe-item>
        <mt-swipe-item v-if="agent.honors.length > 0">
          <div class="mt-swipe-item">
            <img class="dress up-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_upl.png" alt="">
            <img class="dress down" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_bottom.png" alt="">
            <div class="consult" @click="consultAgent"><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></div>
            <dl class="com-flexv theme cm honor">
              <dt><h3><label v-if="simply">我的荣誉</label><label v-else>我的榮譽</label></h3></dt>
              <dd class="com-scroll aux-bar">
                <ul class="aux">
                  <li class="com-disx" v-for="(dx, index) in agent.honors">
                    <span>{{dx.honor_date}}</span>
                    <div>
                      <h3 class="com-wrap com-p-title">{{dx.name}}</h3>
                      <div>
                        <p class="com-wrap" v-for="(dx, index) in plug.strSplit(dx.situation)">🏅 {{dx}}</p>
                      </div>
                    </div>
                  </li>
                </ul> 
              </dd>
            </dl>
          </div>
        </mt-swipe-item>
        <mt-swipe-item v-if="agent.photos.length > 0">
          <div class="mt-swipe-item">
            <img class="dress up-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_upl.png" alt="">
            <img class="dress down" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_bottom.png" alt="">
            <div class="consult" @click="consultAgent"><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></div>
            <dl class="com-flexv theme cm album">
              <dt><h3><label v-if="simply">个人相簿</label><label v-else>我的相簿</label></h3></dt>
              <dd class="com-scroll aux-bar" v-load-scroll="loadMore">
                <ul>
                  <li v-for="(dx, index) in agent.photos">
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
                      <ul class="com-mgrl aux two" v-if="dx.photo_list.length == 2">
                        <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-bg"  :class="'cl' + c_index">


                        <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                          <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
        
                          <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                        </div>


                        </li>
                      </ul>
                      <!--3张-->
                      <ul class="com-mgrl aux three" v-if="dx.photo_list.length == 3">
                        <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-bg"  :class="'cl' + c_index">


                          <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                            <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
          
                            <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                          </div>


                        </li>
                      </ul>
                      <!--4张-->
                      <ul class="com-mgrl aux four" v-if="dx.photo_list.length == 4">
                        <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-bg"  :class="'cl' + c_index">


                          <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                            <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
          
                            <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                          </div>


                        </li>
                      </ul>
                      <!--5张-->  
                      <ul class="com-mgrl aux five" v-if="dx.photo_list.length == 5">
                        <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-bg"  :class="'cl' + c_index">


                          <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                            <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
          
                            <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                          </div>


                        </li>
                      </ul>
                      <!--大于等于6张-->
                      <ul class="aux" v-if="dx.photo_list.length > 5">
                        <li v-for="(idx, c_index) in dx.photo_list" class="iber-album-container">
                          <div>


                            <div class="iber-album-show" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                              <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
            
                              <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
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
            </dl>
          </div>
        </mt-swipe-item>
        <mt-swipe-item v-if="plug.valueValid(agent.baseInfo.qrcode_content)">
          <div class="mt-swipe-item">
            <img class="dress up-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_upl.png" alt="">
            <img class="dress down" src="https://static.iberhk.com/v2/web/images/agent/a_a_b_floor_bottom.png" alt="">
            <div class="consult" @click="consultAgent"><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></div>
            <dl class="com-flexv theme cm contact">
              <dt><h3><label v-if="simply">联系方式</label><label v-else>聯繫方式</label></h3></dt>
              <dd class="com-scroll aux-bar">
                <div v-if="plug.valueValid(agent.baseInfo.wx_qrcode_content)" class="com-flex com-mgrl qr">
                  <img :src="agent.baseInfo.wx_qrcode_content" alt="">
                </div>
                <p v-if="plug.valueValid(agent.baseInfo.wx_qrcode_content)"><label v-if="simply">长按识别二维码</label><label v-else>長按識別二維碼</label></p>
                <ul class="aux"> 
                  <li v-if="plug.valueValid(agent.baseInfo.mobile1) || plug.valueValid(agent.baseInfo.mobile2)" class="com-disx">
                    <div class="com-flex">
                      <em class="icon"><i class="iconfont">&#xe716;</i></em>
                    </div>
                    <p class="com-wrap">
                      <span v-if="plug.valueValid(agent.baseInfo.mobile1)">+{{agent.baseInfo.mobile1_pre}} {{agent.baseInfo.mobile1}}</span><br>    
                      <span v-if="plug.valueValid(agent.baseInfo.mobile2)">+{{agent.baseInfo.mobile2_pre}} {{agent.baseInfo.mobile2}}</span>
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
          </div> 
        </mt-swipe-item>
      </mt-swipe>
    </div>

    
    <img v-if="gestureLeft && slideCount > 1" class="agent-gesture-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_h_gesture_left.png" alt="">
    <!--底部卡片-->
    <com-agent-avatar :params="comAARData"></com-agent-avatar>
    <com-agent-album :params="comAAMData"></com-agent-album>
    <com-agent-auth :params="comAAHData"></com-agent-auth>
    <like-btn :share="share" :is-like="analyze.approval" temp="a-a-b"></like-btn>
  </div>
</template>


<script src="./index.js"></script>
<style scoped src="./css/agent.css"></style>
<style scoped src="./css/a_a_b.css"></style>