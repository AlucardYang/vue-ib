<template>
  <div class="com-frame iber-agent-aag" @touchstart.stop="startHandle" @touchmove.stop="moveHandle" @touchend="endHandle">
    <div class="com-screen com-bgps bg">
      <div class="com-bgrs com-flex circle">
        <div class="com-bgrs avatar"><img :src="agent.baseInfo.avatarLimit" class="avatar" alt=""></div>
        <img class="cloud-up" src="https://static.iberhk.com/v2/web/images/agent/a_a_g_cloud_up.png" alt="">
        <img class="cloud-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_g_cloud_left.png" alt="">
        <img class="cloud-down" src="https://static.iberhk.com/v2/web/images/agent/a_a_g_cloud_down.png" alt="">
        <img class="firework-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_g_firework_left.png" alt="">
        <img class="firework-right" src="https://static.iberhk.com/v2/web/images/agent/a_a_g_firework_right.png" alt="">
        <img class="flower-left" src="https://static.iberhk.com/v2/web/images/agent/a_a_g_flower_left.png" alt="">
        <img class="flower-right" src="https://static.iberhk.com/v2/web/images/agent/a_a_g_flower_right.png" alt="">

        <div class="com-marlr address">
          <h3 v-if="plug.valueValid(agent.baseInfo.nickname)" class="com-nowrap info">{{agent.baseInfo.nickname}}</h3>
          <p v-if="plug.valueValid(agent.baseInfo.position)" class="com-nowrap info">{{agent.baseInfo.position}}</p>

          <div style="height: .3rem;">
            <em v-if="mdrt.state == '1'" class="iber-agent-mdrt info" style="background-color:#FEF4E6;color:#F73E1F;">
              <i v-if="mdrt.level == 1" class="iconfont">&#xe726;</i><!--MDRT-->
              <i v-if="mdrt.level == 2" class="iconfont">&#xe724;</i><!--COT-->
              <i v-if="mdrt.level == 3" class="iconfont">&#xe725;</i><!--TOT-->
              <i v-if="mdrt.level == 4" class="iconfont">&#xe600;</i><!--QUalifying & Life Member-->
            </em>
          </div>
          
          <h3 class="com-nowrap title-format address" style="font-size:.15rem;padding-top:.05rem;padding-bottom:.05rem;">{{agent.baseInfo.company}}</h3>
          <p class="address" style="font-size:.13rem;">{{agent.baseInfo.company_en}}</p>
        </div>
      </div>
      <img class="lantern left" src="https://static.iberhk.com/v2/web/images/agent/a_a_g_lantern_left.png" alt="">
      <img class="lantern right" src="https://static.iberhk.com/v2/web/images/agent/a_a_g_lantern_right.png" alt="">
      <img class="new_year" src="https://static.iberhk.com/v2/web/images/agent/a_a_g_font.png" alt="">
      
      <p class="iber-gesture-animate"><i @click.stop="slideTop('up')" class="iconfont narrow-up">&#xe635;</i></p>
    </div>
    <div class="com-flexv iber-container" :style="animateTop">
      <dl class="title">
        <dt class="com-bgps"></dt>
        <dd>
          <p>
            <i @click.stop="slideTop('down')" class="iconfont">&#xe631;</i>
          </p>
          <div class="com-flex com-marlr">
            <div class="avatar-farme">
              <img @click="openAvatar" :src="agent.baseInfo.avatar" class="e-bubble avatar" alt="">
              <img v-if="agent.baseInfo.realname_verified == '1'" @click="openAuth(1)" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_vip.svg" alt="">
              <img v-if="agent.baseInfo.realname_verified == '0'" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_user.svg" alt="">
            </div>
            <div class="info">
              <h3 v-if="plug.valueValid(agent.baseInfo.nickname)" class="com-nowrap">{{agent.baseInfo.nickname}}</h3>
              <p v-if="plug.valueValid(agent.baseInfo.position)" class="com-nowrap">{{agent.baseInfo.position}}</p>
            </div>
            <button @click.stop="consultAgent" class="e-bubble" type="button"><label v-if="simply">咨询</label><label v-else>諮詢</label></button>
          </div>
        </dd>
      </dl>
      <div class="com-flexv com-bgps container">
        <div class="nav">
          <mt-navbar class="com-disx" v-model="selected">
            <mt-tab-item id="agent_0"><label v-if="simply">资料</label><label v-else>資料</label></mt-tab-item>
            <mt-tab-item id="agent_1" v-if="agent.workExperience.length > 0 || agent.honors.length > 0">
              <label v-if="simply">经验</label><label v-else>經驗</label>
            </mt-tab-item>
            <mt-tab-item id="agent_2" v-if="agent.photos.length > 0"><label v-if="simply">相簿</label><label v-else>相簿</label></mt-tab-item>
          </mt-navbar>
        </div>
        <div class="aux-scroll aux-bar main" ref="main" @touchstart.stop @touchmove.stop @touchend.stop v-load-scroll="loadMore">
          <mt-tab-container v-model="selected" swipeable> 
            <mt-tab-container-item id="agent_0">
              <!--资料-->
              <dl class="com-bgps aux theme contact">
                <dt>
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_g_titel_contact.png" alt=""><label v-if="simply">联系方式</label><label v-else>聯繫方式</label></h3>
                </dt>
                <dd>
                  <div v-if="plug.valueValid(agent.baseInfo.company) || plug.valueValid(agent.baseInfo.company_en)"
                    style="overflow:hidden;margin-bottom:.2rem;">
                    <h3 class="com-wrap title-format" v-if="plug.valueValid(agent.baseInfo.company)"
                      style="font-size:.15rem;padding-top:.05rem;padding-bottom:.05rem;">{{agent.baseInfo.company}}</h3>
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
                  <div class="autograph" v-if="plug.valueValid(agent.baseInfo.signature)">
                    <i class="iconfont left">&#xe6f2;</i>
                    <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
                    <i class="iconfont right">&#xe6f3;</i>
                  </div>
                </dd>
              </dl> 
              <dl v-if="plug.valueValid(agent.baseInfo.abstract)" class="com-bgps aux theme profile">
                <dt>
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_g_titel_profile.svg" alt=""><label v-if="simply">个人简介</label><label v-else>個人簡介</label></h3>
                </dt>
                <dd class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></dd>
              </dl>
            </mt-tab-container-item>
            <mt-tab-container-item v-if="agent.workExperience.length > 0 || agent.honors.length > 0" id="agent_1">
              <!--经历-->
              <dl class="com-bgps aux theme experience" v-if="agent.workExperience.length > 0">
                <dt>
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_g_titel_experience.svg" alt=""><label v-if="simply">从业经验</label><label v-else>從業經驗</label></h3>
                </dt>
                <dd>
                  <ul>
                    <li class="com-disx" v-for="(dx, index) in agent.workExperience">
                      <div class="line"><p></p></div>
                      <div class="content">
                        <h3 class="com-wrap com-p-title">{{dx.company_name}}</h3>
                        <p class="com-wrap">{{dx.start_at}} ~ {{dx.end_at}}<em class="line">|</em>{{dx.position}}</p>
                        <div class="com-wrap" v-html="plug.prohibitFilter(dx.job_content)"></div>
                      </div>
                    </li>
                  </ul>
                </dd>
              </dl>
              <dl class="com-bgps aux theme honor" v-if="agent.honors.length > 0">
                <dt>
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_g_titel_honor.svg" alt=""><label v-if="simply">个人荣誉</label><label v-else>個人榮譽</label></h3>
                </dt>
                <dd>
                  <ul>
                    <li class="com-disx" v-for="(dx, index) in agent.honors">
                      <div class="line"><p></p></div>
                      <div class="content">
                        <h3 class="com-wrap com-p-title"><span>{{dx.honor_date}}</span>{{dx.name}}</h3>
                        <div>
                          <p class="com-wrap" v-for="(dx, index) in plug.strSplit(dx.situation)"><span>🏅</span>{{dx}}</p>
                        </div>
                      </div>
                    </li>
                  </ul> 
                </dd>
              </dl>
            </mt-tab-container-item>
            <mt-tab-container-item v-if="agent.photos.length > 0" id="agent_2">
              <!--相册-->
              <dl class="com-bgps aux theme album">
                <dt>  
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_g_titel_album.svg" alt=""><label v-if="simply">个人相簿</label><label v-else>個人相簿</label></h3>
                </dt>
                <dd>
                  <div v-for="(dx, index) in agent.photos">
                      <p v-html="plug.prohibitFilter(dx.desc)"></p>
                    <span>{{dx.time}}</span>
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
                  </div> 
                  
                  <com-more-load v-if='more.state'></com-more-load>
                </dd>
              </dl>
            </mt-tab-container-item>
          </mt-tab-container>
          <div class="agent-declare">
            <label v-if="simply">{{plug.simplyAgentBottomTxt}}</label>
            <label v-else>{{plug.agentBottomTxt}}</label>
          </div> 


        </div>
      </div>
    </div>


    <!--底部卡片-->
    <com-agent-avatar :params="comAARData"></com-agent-avatar>
    <com-agent-album :params="comAAMData"></com-agent-album>
    <com-agent-auth :params="comAAHData"></com-agent-auth>
    <like-btn :share="share" :is-like="analyze.approval"></like-btn>
  </div>
</template>


<script src="./js/a_a_g.js"></script>
<style src="./css/agent.css"></style>
<style scoped src="./css/a_a_g.css"></style>