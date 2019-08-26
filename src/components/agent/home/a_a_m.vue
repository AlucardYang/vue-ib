<template>
  <div class="com-frame a-a-m">
    <div class="com-frame">
      <com-swipe auto="false" indicator="false" @change="getSlideCount">
        <com-swipe-item>
          <div class="com-screen aux-scroll aux-bar">
            <div class="com-disy" style="min-height:100%;">
              <dl style="flex:1;" class="aux theme info">
                <dt :style="{'background-image': 'url(https://static.iberhk.com/v2/web/images/agent/a_a_m_bg.png)'}">
                  <div class="triangle"></div>
                  <div class="img">
                    <img v-loading :src="agent.baseInfo.avatar" alt="">
                  </div>
                  <div v-if="mdrt.state == '1'" class="com-flex icon">
                    <i class="iconfonti" @click="showMdrt">&#xe710;</i>
                    <em></em>
                  </div>
                </dt>
                <dd>
                  <h3 class="com-wrap">{{agent.baseInfo.nickname}}<em v-if="agent.baseInfo.realname_verified == '1'"
                      @click="showName"><label v-if="simply">已实名</label><label v-else>已實名</label></em></h3>
                  <p class="com-nowrap position">{{agent.baseInfo.position}}</p>
                  <p v-if="plug.valueValid(agent.baseInfo.company) || plug.valueValid(agent.baseInfo.company_en)"
                    class="com-nowrap company">{{agent.baseInfo.company || agent.baseInfo.company_en}}</p>

                  <div class="label">
                    <com-templet-hswipe v-if="plug.objectValue(comTHdata.agent)" :params="comTHdata">
                    </com-templet-hswipe>
                  </div>
                  <div v-if="plug.valueValid(agent.baseInfo.signature)" class="com-wrap autograph"
                    v-html="plug.prohibitFilter(agent.baseInfo.signature)"></div>
                </dd>
              </dl>
              <div class="agent-declare">{{plug.agentDeclare(simply)}}</div>
            </div>
          </div>
        </com-swipe-item>
        <com-swipe-item v-if="plug.valueValid(agent.baseInfo.abstract)">
          <div class="com-screen">
            <dl class="aux com-disy theme profile">
              <dt class="com-bgrs" :class="{scroll: scroll.profile}">
                <h1><label v-if="simply">个人简介</label><label v-else>個人簡介</label></h1>
                <p>PERSONAL PROFILE</p>
                <button type="button" @click="consultAgent" class="com-btn"><i class="iconfonti">&#xe717;</i><label
                    v-if="simply">立即咨询</label><label v-else>立即諮詢</label></button>
              </dt>
              <dd class="aux-scroll aux-bar" data-class="profile" @scroll="scrollHandle">
                <div class="com-disy" style="min-height:100%;">
                  <div style="flex: 1;" class="com-wrap com-bgrs contain"
                    v-html="plug.prohibitFilter(agent.baseInfo.abstract)"></div>
                  <div class="agent-declare">{{plug.agentDeclare(simply)}}</div>
                </div>
              </dd>
            </dl>
          </div>
        </com-swipe-item>
        <com-swipe-item v-if="agent.workExperience.length > 0">
          <div class="com-screen">
            <dl class="aux com-disy theme experience">
              <dt class="com-bgrs" :class="{scroll: scroll.experience}">
                <h1><label v-if="simply">个人履历</label><label v-else>個人履歷</label></h1>
                <p>PERSONAL DATA</p>
                <button type="button" @click="consultAgent" class="com-btn"><i class="iconfonti">&#xe717;</i><label
                    v-if="simply">立即咨询</label><label v-else>立即諮詢</label></button>
              </dt>
              <dd class="aux-scroll aux-bar" data-class="experience" @scroll="scrollHandle">
                <div class="com-disy" style="min-height:100%;">
                  <div class="contain" style="flex:1;">
                    <ul>
                      <li v-for="(dx, index) in agent.workExperience">
                        <h3 class="com-wrap">{{dx.company_name}}</h3>
                        <p class="com-wrap">{{dx.start_at}} ~ {{dx.end_at}}<em class="line">|</em>{{dx.position}}</p>
                        <div class="com-wrap content" v-html="plug.prohibitFilter(dx.job_content)"></div>
                      </li>
                    </ul>
                  </div>
                  <div class="agent-declare">{{plug.agentDeclare(simply)}}</div>
                </div>
              </dd>
            </dl>
          </div>
        </com-swipe-item>
        <com-swipe-item v-if="agent.honors.length > 0">
          <div class="com-screen">
            <dl class="aux com-disy theme honor">
              <dt class="com-bgrs" :class="{scroll: scroll.honor}">
                <h1><label v-if="simply">个人荣誉</label><label v-else>個人榮譽</label></h1>
                <p>PERSONAL HONOR</p>
                <button type="button" @click="consultAgent" class="com-btn"><i class="iconfonti">&#xe717;</i><label
                    v-if="simply">立即咨询</label><label v-else>立即諮詢</label></button>
              </dt>
              <dd class="aux-scroll aux-bar" data-class="honor" @scroll="scrollHandle">
                <div class="com-disy" style="min-height:100%;">
                  <div class="contain" style="flex:1;">
                    <ul class="aux">
                      <li v-for="(dx, index) in agent.honors" class="com-disx">
                        <span><em>{{dx.honor_date}}</em></span>
                        <div>
                          <h3 class="com-wrap com-p-title">{{dx.name}}</h3>
                          <div class="com-wrap" v-html="plug.prohibitFilter(dx.situation)"></div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="agent-declare">{{plug.agentDeclare(simply)}}</div>
                </div>
              </dd>
            </dl>
          </div>
        </com-swipe-item>
        <com-swipe-item v-if="agent.photos.length > 0">
          <div class="com-screen">
            <dl class="aux com-disy theme album">
              <dt class="com-bgrs" :class="{scroll: scroll.album}">
                <h1><label v-if="simply">个人相簿</label><label v-else>個人相簿</label></h1>
                <p>PERSONAL PHOTO ALBUM</p>
                <button type="button" @click="consultAgent" class="com-btn"><i class="iconfonti">&#xe717;</i><label
                    v-if="simply">立即咨询</label><label v-else>立即諮詢</label></button>
              </dt>
              <dd class="aux-scroll aux-bar" v-load-scroll="loadMore" :scroll-distance="calcBottom(1.5)" data-class="album" @scroll="scrollHandle">
                <div class="com-disy" style="min-height:100%;">
                  <div class="contain" style="flex:1;">
                    <div v-for="(dx, index) in agent.photos" class="album-show">
                      <p v-html="plug.prohibitFilter(dx.desc)"></p>
                      <div class="iber-album-frame">
                        <ul class="aux">
                          <!--3张 大于5张-->
                          <li v-if="dx.photo_list.length > 0 && (dx.photo_list.length == 3 || dx.photo_list.length > 4)"
                            v-for="(idx, c_index) in dx.photo_list" class="iber-album-container">
                            <div>
                              <div class="iber-album-show radius-3-5-6"
                                :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                                <div v-if="!idx.state" class="com-lazy-load com-flex">
                                  <mt-spinner type="fading-circle"></mt-spinner>
                                </div>
                                <div v-if="idx.state" class="iber-album-bg my-radius"
                                  :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}"
                                  @click="openAlbum(dx.photo_list, c_index)"></div>
                              </div>
                            </div>
                          </li>
                          <!--1张-->
                          <li v-if="dx.photo_list.length > 0 && dx.photo_list.length == 1"
                            v-for="(idx, c_index) in dx.photo_list" class="num-1">
                            <div>
                              <div class="iber-album-show radius"
                                :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                                <div v-if="!idx.state" class="com-lazy-load com-flex">
                                  <mt-spinner type="fading-circle"></mt-spinner>
                                </div>
                                <div v-if="idx.state" class="iber-album-bg my-radius"
                                  :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}"
                                  @click="openAlbum(dx.photo_list, c_index)"></div>
                              </div>
                            </div>
                          </li>
                          <!--2张 4张-->
                          <li
                            v-if="dx.photo_list.length > 0 && (dx.photo_list.length == 2 || dx.photo_list.length == 4)"
                            v-for="(idx, c_index) in dx.photo_list" class="num-2-4">
                            <div>
                              <div class="iber-album-show radius"
                                :style="loadImgHandle(idx.ref, idx.src, index, c_index)">
                                <div v-if="!idx.state" class="com-lazy-load com-flex">
                                  <mt-spinner type="fading-circle"></mt-spinner>
                                </div>
                                <div v-if="idx.state" class="iber-album-bg my-radius"
                                  :style="{backgroundImage: 'url(' + idx.src + ')', backgroundSize: idx.setbg}"
                                  @click="openAlbum(dx.photo_list, c_index)"></div>
                              </div>
                            </div>

                          </li>
                        </ul>
                      </div>
                      <span>{{dx.time}}</span>
                    </div>

                    <com-more-load v-if='more.state'></com-more-load>
                  </div>
                  <div class="agent-declare">{{plug.agentDeclare(simply)}}</div>
                </div>
              </dd>
            </dl>
          </div>
        </com-swipe-item>
      </com-swipe>
    </div>


    <img v-if="gestureLeft && slideCount > 1" class="agent-gesture-left" style="bottom:1.2rem;" src="https://static.iberhk.com/v2/web/images/agent/a_a_h_gesture_left.png" alt="">
    <com-templet-mdrt :params="comTMDRTdata"></com-templet-mdrt>
    <com-templet-name :params="comTNdata"></com-templet-name>
    <com-templet-album :params="comTAData"></com-templet-album>
  </div>
</template>


<script src="./js/a_a_m.js"></script>
<style scoped src="./css/agent.css"></style>
<style scoped src="./css/a_a_m.css"></style>