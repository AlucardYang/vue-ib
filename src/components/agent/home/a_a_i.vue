<template>
  <div class="com-frame iber-agent-aai" @touchstart="startHandle" @touchmove="moveHandle" @touchend="endHandle">
    <div class="com-flexv com-screen banner">
      <div>
        <img @click.stop="openAvatar" :src="agent.baseInfo.avatarLimit" class="e-bubble avatar" alt="">
        <img v-if="agent.baseInfo.realname_verified == '1'" @click="openAuth(1)" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_vip.svg" alt="">
        <img v-if="agent.baseInfo.realname_verified == '0'" class="e-bubble auth" src="https://static.iberhk.com/v2/web/images/common/auth_user.svg" alt="">
      </div>
      <img src="https://static.iberhk.com/v2/web/images/agent/a_a_i_bg_bottom.png" alt="">
    </div> 
    <div class="com-flexv iber-container" :style="animateTop">
      <div class="title">
        <p class="iber-gesture-animate"> 
          <i @click.stop="slideTop('up')" v-if="anarrowUp" class="iconfont up">&#xe71c;</i>
          <i @click.stop="slideTop('down')" v-if="!anarrowUp" class="iconfont down">&#xe71b;</i>
        </p> 
        <div class="com-flex com-marlr">
          <div class="info">
            <h3 v-if="plug.valueValid(agent.baseInfo.nickname)" class="com-nowrap">{{agent.baseInfo.nickname}}</h3>
            <p v-if="plug.valueValid(agent.baseInfo.position)" class="com-nowrap">{{agent.baseInfo.position}}</p>

            <em v-if="mdrt.state == '1'" class="iber-agent-mdrt" style="background-color:#538CEE;color:#fff;">
              <i v-if="mdrt.level == 1" class="iconfont">&#xe726;</i><!--MDRT-->
              <i v-if="mdrt.level == 2" class="iconfont">&#xe724;</i><!--COT-->
              <i v-if="mdrt.level == 3" class="iconfont">&#xe725;</i><!--TOT-->
              <i v-if="mdrt.level == 4" class="iconfont">&#xe600;</i><!--QUalifying & Life Member-->
            </em>
          </div>
          <div class="act">
            <button @click.stop="consultAgent" @touchstart.stop @touchmove.stop @touchend.stop type="button"><i class="iconfont">&#xe6cc;</i></button>
            <like-btn :share="share" :is-like="analyze.approval" temp="a-a-i"></like-btn>
          </div>
        </div>
      </div>
      <div class="com-flexv content">
        <div class="nav">
          <mt-navbar class="com-disx" v-model="selected">
            <mt-tab-item id="agent_0"><label v-if="simply">简介</label><label v-else>簡介</label></mt-tab-item> 
            <mt-tab-item id="agent_1" v-if="agent.workExperience.length > 0 || agent.honors.length > 0">
              <label v-if="simply">经验</label><label v-else>經驗</label>
            </mt-tab-item>
            <mt-tab-item id="agent_2" v-if="agent.photos.length > 0"><label v-if="simply">相簿</label><label v-else>相簿</label></mt-tab-item>
          </mt-navbar>
        </div>
        <div class="aux-scroll aux-bar main" ref="main" v-load-scroll="loadMore" @touchstart.stop @touchmove.stop @touchend.stop>



          <mt-tab-container style="background-color: #2C1E49;" v-model="selected" swipeable> 
            <mt-tab-container-item id="agent_0">
              <!--资料-->
              <dl class="aux theme contact">
                <dt>
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_i_titel_info.svg" alt=""><label v-if="simply">个人信息</label><label v-else>個人信息</label></h3>
                </dt>
                <dd>
                  <div v-if="plug.valueValid(agent.baseInfo.company) || plug.valueValid(agent.baseInfo.company_en)"
                    style="overflow:hidden;padding-bottom:.1rem;border-bottom: 1px solid rgba(255, 255, 255, .12);">
                    <h3 class="com-wrap title-format" v-if="plug.valueValid(agent.baseInfo.company)"
                      style="font-size:.15rem;padding-top:.05rem;padding-bottom:.05rem;color:#fff;">{{agent.baseInfo.company}}</h3>
                    <p v-if="plug.valueValid(agent.baseInfo.company_en)" class="com-wrap"
                      style="font-size:.12rem;line-height: .16rem;color: rgba(255, 255, 255, .5)">{{agent.baseInfo.company_en}}</p>
                  </div>
                  <ul class="aux">
                    <li v-if="plug.valueValid(agent.baseInfo.mobile1) || plug.valueValid(agent.baseInfo.mobile2)" class="com-disx">
                      <div class="com-flex">
                        <em class="icon"><i class="iconfont">&#xe716;</i></em>
                      </div>
                      <p class="com-wrap">
                        <span v-if="plug.valueValid(agent.baseInfo.mobile1)">+{{agent.baseInfo.mobile1_pre}}
                          {{agent.baseInfo.mobile1}}</span><br
                          v-if="plug.valueValid(agent.baseInfo.mobile1) && plug.valueValid(agent.baseInfo.mobile2)">
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
                      <div class="com-flex aux-top" style="padding-top:.17rem;">
                        <em class="icon"><i class="iconfont">&#xe713;</i></em>
                      </div>
                      <p class="com-wrap">{{agent.baseInfo.location}}</p>
                    </li>
                  </ul>
                </dd>
              </dl>
              <dl class="aux theme autograph" v-if="plug.valueValid(agent.baseInfo.signature)">
                <dt>
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_i_titel_autograph.svg" alt=""><label v-if="simply">个性签名</label><label v-else>個性簽名</label></h3>
                </dt>
                <dd>
                  <div>
                    <i class="iconfont left">&#xe6f2;</i>
                    <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
                    <i class="iconfont right">&#xe6f3;</i>
                  </div>
                </dd>
              </dl>
              <dl class="aux theme autograph" v-if="plug.valueValid(agent.baseInfo.abstract)">
                <dt>
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_i_titel_profile.svg" alt=""><label v-if="simply">个人简介</label><label v-else>個人簡介</label></h3>
                </dt>
                <dd> 
                  <div>
                    <i class="iconfont left">&#xe6f2;</i>
                    <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></div>
                    <i class="iconfont right">&#xe6f3;</i>
                  </div>
                </dd>
              </dl>
              <div class="iber-agent-declare" style="background-color:#2C1E49;color:rgba(255, 255, 255, .5);">
                <label v-if="simply">{{plug.simplyAgentBottomTxt}}</label>
                <label v-else>{{plug.agentBottomTxt}}</label>
              </div> 
            </mt-tab-container-item>
            <mt-tab-container-item v-if="agent.workExperience.length > 0 || agent.honors.length > 0" id="agent_1" style="padding-bottom:.25rem;">
              <!--经历-->
              <dl class="aux theme experience" v-if="agent.workExperience.length > 0">
                <dt>
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_i_titel_experience.svg" alt=""><label v-if="simply">从业经验</label><label v-else>從業經驗</label></h3>
                </dt>
                <dd>
                  <ul class="aux">
                    <li v-for="(dx, index) in agent.workExperience">
                      <p>{{dx.start_at}} ~ {{dx.end_at}}</p>
                      <h3 class="com-wrap com-p-title">{{dx.company_name}}</h3>
                      <div class="com-wrap" v-html="plug.prohibitFilter(dx.job_content)"></div>
                    </li>
                  </ul>
                </dd>
              </dl>
              <!--个人荣誉-->
              <dl class="aux theme honor" v-if="agent.honors.length > 0">
                <dt>
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_i_titel_honor.svg" alt=""><label v-if="simply">个人荣誉</label><label v-else>個人榮譽</label></h3>
                </dt>
                <dd>
                  <ul class="aux">
                    <li class="com-disx" v-for="(dx, index) in agent.honors" :key="index">
                      <em class="com-flex">{{dx.honor_date}}</em>
                      <div>
                        <img src="https://static.iberhk.com/v2/web/images/agent/a_a_i_honor_reward.svg" alt="">
                        <h3>{{dx.name}}</h3>
                        <p class="com-wrap" v-for="(idx, c_index) in plug.strSplit(dx.situation)" :key="c_index">{{idx}}</p>
                      </div>
                    </li>
                  </ul> 
                </dd>
              </dl>
            </mt-tab-container-item>
            <mt-tab-container-item v-if="agent.photos.length > 0" id="agent_2" style="padding-bottom:.25rem;">
              <!--相册-->
              <dl class="aux theme album">
                <dt>  
                  <h3><img src="https://static.iberhk.com/v2/web/images/agent/a_a_i_titel_album.svg" alt=""><label v-if="simply">个人相簿</label><label v-else>個人相簿</label></h3>
                </dt>
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
                  </div>
                  
                  <com-more-load v-if='more.state'></com-more-load>
                </dd>
              </dl>
            </mt-tab-container-item>
          </mt-tab-container>



        </div>
      </div>  
    </div>


    <!--底部卡片-->
    <com-agent-avatar :params="comAARData"></com-agent-avatar>
    <com-agent-album :params="comAAMData"></com-agent-album>
    <com-agent-auth :params="comAAHData"></com-agent-auth>
  </div>
</template>


<script src="./js/a_a_i.js"></script>
<style src="./css/agent.css"></style>
<style scoped src="./css/a_a_i.css"></style>