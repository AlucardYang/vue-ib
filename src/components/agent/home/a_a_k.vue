<template>
  <div class="com-frame">
    <div class="com-scroll-y aux-bar" v-load-scroll="loadMore" :scroll-distance="calcBottom(1.5)" @scroll="scrollHandle" style="padding: .16rem;padding-bottom:0; background-color: #444651;"  :style="{'padding-top': inApp ? '.35rem' : '.16rem'}">
      <dl class="aux theme info">
        <dt>
          <img v-loading :src="agent.baseInfo.avatar" alt="">
          <div class="mdrt" v-if="mdrt.state == '1'">
            <div class="com-flex icon">
              <img @click="showMdrt" src="https://static.iberhk.com/v2/web/images/agent/a_a_k_mdrt.png" alt="">
              <em></em>
            </div>
          </div>
        </dt>
        <dd>
          <h3 class="com-nowrap">{{agent.baseInfo.nickname}}</h3>
          <p class="com-nowrap position">{{agent.baseInfo.position}}</p>
          <p class="com-nowrap company" v-if="plug.valueValid(agent.baseInfo.company) || plug.valueValid(agent.baseInfo.company_en)">{{agent.baseInfo.company || agent.baseInfo.company_en}}</p>
          <h5 v-if="agent.baseInfo.realname_verified == '1'"><span @click="showName"><i class="iconfonti">&#xe6f5;</i><label v-if="simply">实名认证</label><label v-else>實名認證</label></span></h5>
          <div v-if="!inApp" class="out-approval" @click="approval">
            <i v-if="!praise.state" class="iconfonti">&#xe718;</i>
            <i v-if="praise.state" class="iconfonti">&#xe719;</i>
          </div>
          <div v-if="!inApp" ref="relConslut" class="ysun-btn-handle relative-consult" @click="consultAgent"><i class="iconfonti">&#xe717;</i></div>  
        </dd> 
      </dl>
      <dl class="theme contact">
          <dt class="title"><label v-if="simply">联系方式</label><label v-else>聯繫方式</label></dt>
          <dd>
            <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.mobile1) || plug.valueValid(agent.baseInfo.mobile2)"><span class="com-flexh"><i class="iconfonti">&#xe723;</i></span><span class="com-wrap"><label v-if="plug.valueValid(agent.baseInfo.mobile1)">+{{agent.baseInfo.mobile1_pre}} {{agent.baseInfo.mobile1}}</label><br><label v-if="plug.valueValid(agent.baseInfo.mobile2)">+{{agent.baseInfo.mobile2_pre}} {{agent.baseInfo.mobile2}}</label></span></p>
            <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.wechat_num)"><span><i class="iconfonti">&#xe725;</i></span><span class="com-wrap">{{agent.baseInfo.wechat_num}}</span></p>
            <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.facebook_num)"><span><i class="iconfonti">&#xe72a;</i></span><span class="com-wrap">{{agent.baseInfo.facebook_num}}</span></p>
            <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.email)"><span><i class="iconfonti">&#xe72b;</i></span><span class="com-wrap">{{agent.baseInfo.email}}</span></p>
            <p class="com-disx" v-if="plug.valueValid(agent.baseInfo.location)"><span><i class="iconfonti">&#xe721;</i></span><span class="com-wrap">{{agent.baseInfo.location}}</span></p>
            <div v-if="plug.valueValid(agent.baseInfo.wx_qrcode_content)" class="com-disx">
              <img :src="agent.baseInfo.wx_qrcode_content" alt="">
              <ul class="com-flexv" style="align-items: flex-start;">
                <li class="qr-code"><label v-if="simply">长按识别 QR Code</label><label v-else>長按識別 QR Code</label></li>
                <li class="com-wrap id" v-if="plug.valueValid(agent.baseInfo.wechat_num)"><i class="iconfonti">&#xe711;</i>Wechat ID: {{agent.baseInfo.wechat_num}}</li>
                <li v-if="plug.valueValid(agent.baseInfo.wechat_num)"><button type="button" class="com-btn" id="wechatID" @click="copyWechatID" :data-clipboard-text="agent.baseInfo.wechat_num"><label v-if="simply">复制WeChat ID</label><label v-else>複製WeChat ID</label></button></li>
              </ul>
            </div>
          </dd>
        </dl>
      <dl class="aux theme autograph" v-if="plug.valueValid(agent.baseInfo.signature)">
        <dt class="title"><label v-if="simply">个性签名</label><label v-else>個性簽名</label></dt>
        <dd>
          <i class="iconfont left">&#xe6f2;</i>
          <div class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
          <i class="iconfont right">&#xe6f3;</i>
        </dd>
      </dl>
      <dl class="aux theme profile" v-if="plug.valueValid(agent.baseInfo.abstract)">
        <dt class="title"><label v-if="simply">个人简介</label><label v-else>個人簡介</label></dt>
        <dd class="com-wrap" v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></dd>
      </dl>
      <dl class="theme experience" v-if="agent.workExperience.length > 0">
        <dt class="title"><label v-if="simply">从业经验</label><label v-else>從業經驗</label></dt>
        <dd>
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
        <dt class="title"><label v-if="simply">个人荣誉</label><label v-else>個人榮譽</label></dt>
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
      <dl class="aux theme album" v-if="agent.photos.length > 0">
        <dt class="title"><label v-if="simply">个人相簿</label><label v-else>個人相簿</label></dt>
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
      <div style="padding:.24rem .3rem;text-align:center;line-height:.17rem;font-size:.12rem;color:#898a93;">{{plug.agentDeclare(simply)}}</div>    
    </div>


    <!--浮层框-->
    <img v-if="scroll.state" @click="backTop" class="com-back-top" :src="$root.back_top" :style="{bottom: !inApp ? '.55rem' : '.1rem'}" alt="">
    <div v-if="scroll.consult && !inApp" class="ysun-btn-handle out-consult" @click="consultAgent"><i class="iconfonti">&#xe717;</i></div>
    <com-templet-mdrt :params="comTMDRTdata"></com-templet-mdrt>
    <com-templet-name :params="comTNdata"></com-templet-name>
    <com-templet-album :params="comTAData"></com-templet-album>
  </div>
</template>


<script src="./js/a_a_k.js"></script>
<style scoped src="./css/agent.css"></style>
<style scoped src="./css/a_a_k.css"></style>