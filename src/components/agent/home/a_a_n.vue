<template>
  <div class="com-frame a-a-n">
    <div ref="scroll" class="com-scroll-y aux-bar aux-pdm" v-load-scroll="loadMore" :scroll-distance="calcBottom(1.5)" @scroll="scrollHandle" style="background-color: #1d1d27;">
      <dl class="aux theme info">
        <dt>
          <img v-loading :src="agent.baseInfo.avatar" alt="">
          <img style="z-index:2;" src="https://static.iberhk.com/v2/home/a_a_n_avator_bg.png" alt="">
          <div v-if="mdrt.state == '1'" class="com-flex icon" @click="showMdrt">
            <img src="https://static.iberhk.com/v2/home/a_a_n_mdrt.png" alt="">
            <em></em>
          </div>
          <h3 class="com-wrap" style="padding-right:.2rem;padding-left:.2rem;">
            <span v-for="(dx,index) in nick.list" :key="index">{{dx}}<br v-if='index < nick.list.length - 1'></span>
            <em v-if="agent.baseInfo.realname_verified == '1'" @click="showName">
              <i class="iconfonti">&#xe7d2;</i>
              <label v-if="simply">已实名</label><label v-else>已實名</label>
            </em>
          </h3>
        </dt>
        <dd>
          <p v-if="plug.valueValid(agent.baseInfo.company) || plug.valueValid(agent.baseInfo.company_en)" class="com-nowrap com-marlr company">{{agent.baseInfo.company || agent.baseInfo.company_en}}</p>
          <p class="com-nowrap com-marlr company">{{agent.baseInfo.position}}</p>
          <div class="label">
            <com-templet-hswipe v-if="plug.objectValue(comTHdata.agent)" :params="comTHdata"></com-templet-hswipe>
          </div>
        </dd> 
      </dl>
      <div v-if="plug.valueValid(agent.baseInfo.signature)" class="com-marlr iber-frame">
        <div class="com-wrap signature" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
      </div>
      <div ref="column" class="list">
        <ul class="com-flex aux">
          <li v-for="dx in list" v-if="dx.show" @click="changeList" :data-id="dx.id" class="com-flex" :class="{active: dx.active}"><span>{{dx.text}}</span></li>
        </ul>
      </div>

      <div class="com-marlr container">
        <dl ref="profile" class="aux theme profile" v-if="plug.valueValid(agent.baseInfo.abstract)">
          <dt><h3><label v-if="simply">个人简介</label><label v-else>個人簡介</label></h3></dt>
          <dd class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></dd>
        </dl>
        <dl ref="experience" class="aux theme experience" v-if="agent.workExperience.length > 0">
          <dt><h3><label v-if="simply">个人履历</label><label v-else>個人履历</label></h3></dt>
          <dd>
            <ul v-if="agent.workExperience.length > 0">
              <li v-for="(dx, index) in agent.workExperience">
                <h3 class="com-wrap">{{dx.company_name}}</h3>
                <p class="com-wrap">{{dx.start_at}} ~ {{dx.end_at}} <span>|</span> {{dx.position}}</p>
                <div class="com-wrap" v-html="plug.prohibitFilter(dx.job_content)"></div>
              </li>
            </ul>
          </dd>
        </dl>
        <dl ref="honor" class="aux theme honor" v-if="agent.honors.length > 0">
          <dt><h3><label v-if="simply">个人荣誉</label><label v-else>個人榮譽</label></h3></dt>
          <dd>
            <ul class="aux">
              <li v-for="(dx, index) in agent.honors" class="com-disx">
                <span><em>{{dx.honor_date}}</em></span>
                <div>
                  <h3 class="com-wrap">{{dx.name}}</h3>
                  <div class="com-wrap" v-html="plug.prohibitFilter(dx.situation)"></div>
                </div>
              </li>
            </ul>
          </dd>
        </dl>
        <dl ref="album" class="aux theme album" v-if="agent.photos.length > 0">
          <dt><h3><label v-if="simply">个人相簿</label><label v-else>個人相簿</label></h3></dt>
          <dd>
            <div v-for="(dx, index) in agent.photos">
              <p class="com-wrap desc" v-html="plug.prohibitFilter(dx.desc)"></p>
              <div class="iber-album-frame"> 
                <ul class="aux" style="width:3rem;">
                  <li v-if="dx.photo_list.length > 0" v-for="(idx, c_index) in dx.photo_list" class="iber-album-container">
                    <div>
  
                      <div class="iber-album-show my-radius" :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                        <div v-if="!idx.state" class="com-lazy-load com-flex"><mt-spinner type="fading-circle"></mt-spinner></div>
  
                        <div v-if="idx.state" class="iber-album-bg" :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}" @click="openAlbum(dx.photo_list, c_index)"></div> 
                      </div>
  
                    </div>
                  </li>
                </ul>
              </div>
              <span class="time">{{dx.time}}</span>
            </div>

            <com-more-load v-if='more.state'></com-more-load>
          </dd>
        </dl>
        <div class="declare">{{plug.agentDeclare(simply)}}</div>
      </div>

    </div>


    <div v-if="column.state" class="list suspension">
      <ul class="com-flex aux">
        <li v-for="dx in list" v-if="dx.show" @click="changeList" :data-id="dx.id" class="com-flex" :class="{active: dx.active}"><span>{{dx.text}}</span></li>
      </ul>
    </div>
    <div v-if="!inApp" class="out-approval" @click="approval">
      <i v-if="!praise.state" class="iconfonti">&#xe718;</i>
      <i v-if="praise.state" class="iconfonti">&#xe719;</i>
    </div>
    <div v-if="!inApp" class="ysun-btn-handle out-consult" @click="consultAgent"><i class="iconfonti">&#xe717;</i><label v-if="simply">咨询</label><label v-else>諮詢</label></div>
    
    <com-templet-mdrt :params="comTMDRTdata"></com-templet-mdrt>
    <com-templet-name :params="comTNdata"></com-templet-name>
    <com-templet-album :params="comTAData"></com-templet-album>
  </div>
</template>


<script src="./js/a_a_n.js"></script>
<style scoped src="./css/agent.css"></style>
<style scoped src="./css/a_a_n.css"></style>