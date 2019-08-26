<template>
  <div class="com-frame" :class="templet">
    <div class="com-scroll-y aux-bar" @scroll="scrollHandle" v-load-scroll="loadMore" :scroll-distance="calcBottom(1.5)" style="padding-bottom: .25rem;background-color: #f6f6f6;">
      <div class="portrait">
        <img v-loading :src="agent.baseInfo.avatar" alt="">
        <em></em>
      </div>
      <div class="com-marlt container">
        <div class="contain">
          <dl class="theme info">
            <dt class="com-disx">
              <div class="mask" style="flex:1;">
                <h3 class="com-nowrap">{{agent.baseInfo.nickname}}</h3>
                <p class="com-nowrap">{{agent.baseInfo.position}}</p>
                <h5 v-if="agent.baseInfo.realname_verified == '1'"><span @click="showName"><i class="iconfonti">&#xe6f5;</i><label v-if="simply">实名认证</label><label v-else>實名認證</label></span></h5>
              </div>
              <div v-if="mdrt.state == '1'" class="com-flex icon" style="width:.85rem;">
                <i class="iconfonti" @click="showMdrt">&#xe710;</i>
                <em></em>
              </div>
            </dt> 
            <dd> 
              <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.company) || plug.valueValid(agent.baseInfo.company_en)"><span><i class="iconfonti">&#xe6f0;</i></span><span class="com-wrap">{{agent.baseInfo.company || agent.baseInfo.company_en}}</span></p>  
              <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.mobile1) || plug.valueValid(agent.baseInfo.mobile2)"><span class="com-disx" style="align-items: center;"><i class="iconfonti">&#xe6ed;</i></span><span class="com-wrap"><label v-if="plug.valueValid(agent.baseInfo.mobile1)">+{{agent.baseInfo.mobile1_pre}} {{agent.baseInfo.mobile1}}</label><br v-if="plug.valueValid(agent.baseInfo.mobile2)"><label v-if="plug.valueValid(agent.baseInfo.mobile2)">+{{agent.baseInfo.mobile2_pre}} {{agent.baseInfo.mobile2}}</label></span></p>
              <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.wechat_num)"><span><i class="iconfonti">&#xe6f3;</i></span><span class="com-wrap">{{agent.baseInfo.wechat_num}}</span></p>
              <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.facebook_num)"><span><i class="iconfonti">&#xe6f1;</i></span><span class="com-wrap">{{agent.baseInfo.facebook_num}}</span></p>
              <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.email)"><span><i class="iconfonti">&#xe6ef;</i></span><span class="com-wrap">{{agent.baseInfo.email}}</span></p>
              <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.location)"><span><i class="iconfonti">&#xe6ee;</i></span><span class="com-wrap">{{agent.baseInfo.location}}</span></p>
            </dd>
          </dl>
          <dl class="theme autograph" v-if="plug.valueValid(agent.baseInfo.signature)">
            <dt class="title"><i class="iconfonti">&#xe70c;</i><label v-if="simply">个性签名</label><label v-else>個性簽名</label></dt>
            <dd>
              <div>
                <i class="iconfont left">&#xe6f2;</i>
                <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
                <i class="iconfont right">&#xe6f3;</i>
              </div>
            </dd>
          </dl>
          <dl class="theme profile" v-if="plug.valueValid(agent.baseInfo.abstract)">
            <dt class="title"><i class="iconfonti">&#xe716;</i><label v-if="simply">个人简介</label><label v-else>個人簡介</label></dt>
            <dd><div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></div></dd>
          </dl>
          <dl class="theme experience" v-if="agent.workExperience.length > 0">
            <dt class="title"><i class="iconfonti">&#xe704;</i><label v-if="simply">从业经验</label><label v-else>從業經驗</label></dt>
            <dd style="padding-left:.24rem;">
              <ul>
                <li v-for="(dx, index) in agent.workExperience">
                  <p class="com-wrap">{{dx.start_at}} ~ {{dx.end_at}}</p>
                  <div>
                    <h3 class="com-wrap">{{dx.company_name}}</h3>
                    <p class="com-wrap">{{dx.position}}</p>
                    <div class="com-wrap" v-html="plug.prohibitFilter(dx.job_content)"></div>
                  </div>
                </li>
              </ul>
            </dd>
          </dl>
          <dl class="aux theme honor" v-if="agent.honors.length > 0">
            <dt class="title"><i class="iconfonti">&#xe70f;</i><label v-if="simply">个人荣誉</label><label v-else>個人榮譽</label></dt>
            <dd>
              <div class="com-disx" v-for="(dx, index) in agent.honors">
                <span class="com-flexv">{{dx.honor_date}}</span>
                <div>
                  <h3 class="com-wrap">{{dx.name}}</h3>
                  <p class="com-wrap" v-for="(idx, c_index) in plug.strSplit(dx.situation)" :key="c_index">{{idx}}</p>
                </div>
              </div>
            </dd>
          </dl>
          <dl class="theme album" v-if="agent.photos.length > 0">
            <dt class="title"><i class="iconfonti">&#xe705;</i><label v-if="simply">个人相簿</label><label v-else>個人相簿</label></dt>
            <dd>
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
            </dd>
          </dl>
        </div>
      </div>
      <div style="padding:.24rem .3rem 0 .3rem;line-height:.17rem;font-size:.12rem;color:#b1b1b1;">{{plug.agentDeclare(simply)}}</div>
    </div>

    <div v-if="!inApp" class="out-approval" @click="approval">
      <i v-if="!praise.state" class="iconfonti">&#xe718;</i>
      <i v-if="praise.state" class="iconfonti">&#xe719;</i>
    </div>
    <div v-if="!inApp" class="ysun-btn-handle out-consult" @click="consultAgent"><i class="iconfonti">&#xe717;</i><label v-if="simply">咨询</label><label v-else>諮詢</label></div>
    <img v-if="scroll.state" @click="backTop" class="com-back-top" :src="$root.back_top" :style="{bottom: !inApp ? '.8rem' : '.1rem'}" alt="">

    
    <com-templet-mdrt :params="comTMDRTdata"></com-templet-mdrt>
    <com-templet-name :params="comTNdata"></com-templet-name>
    <com-templet-album :params="comTAData"></com-templet-album>
  </div>
</template>


<script src="./js/a_a_j.js"></script>
<style scoped src="./css/agent.css"></style>
<style scoped src="./css/a_a_j.css"></style>