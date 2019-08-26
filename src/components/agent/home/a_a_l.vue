<template>
  <div class="com-frame iber-agent-aal">
    <div class="com-flexv com-screen com-bgrs banner">
      <div v-loading class="com-flexv avator" :src="agent.baseInfo.avatar" :style="{'background-image': avator_url}"></div>
      <div :style="setHieght"></div>
    </div> 
    <div class="com-screen" @touchstart="startHandle" @touchmove="moveHandle" @touchend="endHandle">
      <div class="com-flexv iber-container" :style="animateTop">
        <div v-if="anarrowUp" class="title" :style="appConsult">
          <h3 v-if="plug.valueValid(agent.baseInfo.nickname)" class="com-nowrap">{{agent.baseInfo.nickname}}</h3>
          <p v-if="plug.valueValid(agent.baseInfo.position)" class="com-nowrap position">{{agent.baseInfo.position}}</p>
          <button v-if="!inApp" @click.stop="consultAgent" @touchstart.stop @touchmove.stop @touchend.stop type="button" class="com-btn"><i class="iconfonti">&#xe717;</i><label v-if="simply">立即咨询</label><label v-else>立即諮詢</label></button>
          <p class="com-flex iber-gesture-animate down"><i class="iconfonti">&#xe703;</i></p>
        </div>
        <div v-if="!anarrowUp" class="title down-show">
          <p class="com-flex iber-gesture-animate up"><i class="iconfonti">&#xe702;</i></p>
          <ul class="aux com-disx">
            <li class="avator">
              <img class="avator" :src="agent.baseInfo.avatar" alt="">
              <img v-if="agent.baseInfo.realname_verified == '1'" @click="showName" class="auto" src="https://static.iberhk.com/v2/web/images/agent/aal_auth.png" alt="">
            </li>
            <li class="content">
              <h3 class="com-nowrap">{{agent.baseInfo.nickname}}</h3>
              <p class="com-nowrap">{{agent.baseInfo.position}}</p>
            </li>
            <li v-if="mdrt.state == '1'" class="com-flexv mdrt">
              <i class="iconfonti" @click="showMdrt">&#xe710;</i>
              <em></em>
            </li>
          </ul>
        </div>
        <div class="com-flexv content" @touchstart.stop @touchmove.stop @touchend.stop>
          <div class="nav">
            <mt-navbar class="com-disx" v-model="selected">
              <mt-tab-item id="agent_0"><label v-if="simply">简介</label><label v-else>簡介</label></mt-tab-item>
              <mt-tab-item id="agent_1" v-if="agent.workExperience.length > 0"><label v-if="simply">经验</label><label v-else>經驗</label></mt-tab-item>
              <mt-tab-item id="agent_2" v-if="agent.honors.length > 0"><label v-if="simply">荣誉</label><label v-else>榮譽</label></mt-tab-item>
              <mt-tab-item id="agent_3" v-if="agent.photos.length > 0"><label v-if="simply">相簿</label><label v-else>相簿</label></mt-tab-item>
            </mt-navbar>
          </div>
          <div class="aux-scroll aux-bar main" v-load-scroll="loadMore" ref="main" @touchstart.stop @touchmove.stop @touchend.stop>

            <mt-tab-container v-model="selected" swipeable> 
              <mt-tab-container-item id="agent_0">
                <!--资料-->
                <div class="info">
                  <div v-if="plug.valueValid(agent.baseInfo.signature)" class="autograph">
                    <i class="iconfont left">&#xe6f2;</i>
                    <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
                    <i class="iconfont right">&#xe6f3;</i>
                  </div>
                  <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.company) || plug.valueValid(agent.baseInfo.company_en)"><span><i class="iconfonti">&#xe726;</i></span><span class="com-wrap">{{agent.baseInfo.company || agent.baseInfo.company_en}}</span></p>
                  <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.mobile1) || plug.valueValid(agent.baseInfo.mobile2)"><span class="com-flexv"><i class="iconfonti">&#xe723;</i></span><span class="com-wrap"><label v-if="plug.valueValid(agent.baseInfo.mobile1)">+{{agent.baseInfo.mobile1_pre}} {{agent.baseInfo.mobile1}}</label><br v-if="plug.valueValid(agent.baseInfo.mobile2)"><label v-if="plug.valueValid(agent.baseInfo.mobile2)">+{{agent.baseInfo.mobile2_pre}} {{agent.baseInfo.mobile2}}</label></span></p>
                  <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.wechat_num)"><span><i class="iconfonti">&#xe725;</i></span><span class="com-wrap">{{agent.baseInfo.wechat_num}}</span></p>
                  <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.facebook_num)"><span><i class="iconfonti">&#xe72a;</i></span><span class="com-wrap">{{agent.baseInfo.facebook_num}}</span></p>
                  <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.email)"><span><i class="iconfonti">&#xe72b;</i></span><span class="com-wrap">{{agent.baseInfo.email}}</span></p>
                  <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.location)"><span><i class="iconfonti">&#xe721;</i></span><span class="com-wrap">{{agent.baseInfo.location}}</span></p>
                  <div v-if="plug.valueValid(agent.baseInfo.abstract)" class="com-wrap com-bgrs abstract" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></div>
                </div>
                <div class="agent-declare">{{plug.agentDeclare(simply)}}</div>  
              </mt-tab-container-item>
              <mt-tab-container-item v-if="agent.workExperience.length > 0" id="agent_1">
                <!--经历-->
                <div class="experience">
                  <ul v-if="agent.workExperience.length > 0">
                    <li v-for="(dx, index) in agent.workExperience">
                      <p class="com-wrap">{{dx.start_at}} ~ {{dx.end_at}}</p>
                      <div>
                        <h3 class="com-wrap">{{dx.company_name}}</h3>
                        <p class="com-wrap">{{dx.position}}</p>
                        <div class="com-wrap" v-html="plug.prohibitFilter(dx.job_content)"></div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="agent-declare">{{plug.agentDeclare(simply)}}</div> 
              </mt-tab-container-item>
              <mt-tab-container-item v-if="agent.honors.length > 0" id="agent_2">
                <!--荣誉-->
                <div class="honor">
                  <div class="com-disx" v-for="(dx, index) in agent.honors">
                    <span class="com-flexv">{{dx.honor_date}}</span>
                    <div>
                      <h3 class="com-wrap">{{dx.name}}</h3>
                      <p class="com-wrap" v-for="(idx, c_index) in plug.strSplit(dx.situation)" :key="c_index">{{idx}}</p>
                    </div>
                  </div>
                </div>
                <div class="agent-declare">{{plug.agentDeclare(simply)}}</div>  
              </mt-tab-container-item>
              <mt-tab-container-item v-if="agent.photos.length > 0" id="agent_3">
                <!--相册-->
                <div class="album">
                  <div v-for="(dx, index) in agent.photos">
                    <p class="com-wrap desc" v-html="plug.prohibitFilter(dx.desc)"></p>
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
                    <span class="time">{{dx.time}}</span>
                  </div>

                  <com-more-load v-if='more.state'></com-more-load>
                </div>
                <div class="agent-declare">{{plug.agentDeclare(simply)}}</div> 
              </mt-tab-container-item>
            </mt-tab-container>



          </div>
        </div>
      </div>    
    </div>


    <div v-if="!anarrowUp && !inApp" class="out-approval" @click="approval">
      <i v-if="!praise.state" class="iconfonti">&#xe718;</i>
      <i v-if="praise.state" class="iconfonti">&#xe719;</i>
    </div>
    <div v-if="!anarrowUp && !inApp" class="ysun-btn-handle out-consult" @click="consultAgent"><i class="iconfonti">&#xe717;</i></div>
    
    <!--底部卡片-->
    
    <com-templet-name :params="comTNdata"></com-templet-name>
    <com-templet-mdrt :params="comTMDRTdata"></com-templet-mdrt>
    <com-agent-avatar :params="comAARData"></com-agent-avatar>
    <com-agent-album :params="comAAMData"></com-agent-album>
  </div>
</template>


<script src="./js/a_a_l.js"></script>
<style src="./css/agent.css"></style>
<style scoped src="./css/a_a_l.css"></style>