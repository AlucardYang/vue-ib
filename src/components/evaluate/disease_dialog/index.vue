<template>
  <div class="com-frame" :class="{'com-app-share': inApp}">
    <div class="com-scroll-y aux-bar com-bg" ref="scrollBom">
      <ul>
        <li v-for="(dx, index) in dialogList" :key="index">
          <!--@agent-->
          <dl v-if="dx.type == 0" class="dialog agent">
            <dt><img src="https://static.iberhk.com/v2/web/images/evaluate/robit.png"></dt>
            <dd>
              <div>  
                <span v-if="!dx.loading">{{dx.info.content}}</span>
                <mt-spinner v-if="dx.loading" type="triple-bounce" style="height:.25rem;line-height:.25rem;"></mt-spinner>
              </div> 
            </dd> 
          </dl>

          <!--@customer-->
          <dl v-if="dx.type == 1" class="dialog customer">
            <dd>
              <div>
                <span v-if="!dx.wake">{{dx.info.content}}</span> 
                <em v-if="dx.reelect" class="reelect" @click="reelect(index)">{{plug.sm(simply, '重選')}}</em>
              </div>
            </dd>
            <dt>
              <img v-if="userAvatar != null" :src="userAvatar">
              <i v-if="userAvatar == null" class="iconfont">&#xe685;</i>
            </dt>
          </dl>

          <!--疾病類型-->
          <div class="items select-items" v-if="dx.type == 0 && dx.info && dx.info.temp != undefined && dx.info.temp == 0 && dx.wake && dx.info.data !=undefined && dx.info.data.length > 0">
            <em @click="startLayout">{{plug.sm(simply, '請選擇')}}{{plug.sm(simply, '')}}</em> 
          </div>

          <!--弹框选择-->
          <mt-popup v-if="dx.type == 0 && dx.info && dx.info.temp != undefined && dx.info.temp == 0 && dx.info.data !=undefined && dx.info.data.length > 0" v-model="diseasePane" position="bottom">
            <dl class="select-picker" :class="{'com-app-share': inApp}"> 
              <dt>{{plug.sm(simply, '請選擇')}}</dt> 
              <dd>  
                <div class="com-scroll-y aux-bar">
                  <p v-for="(_dx, _index) in dx.info.data" :key="_index" :class="{active: _dx.active}" @click="emitDiseaseValue(_dx.label, _index)">{{_dx.label}}</p>  
                </div> 
              </dd>
            </dl>
          </mt-popup> 

          <!--按钮单选--> 
          <div class="items select-items" v-if="dx.type == 0 && dx.info && dx.info.temp != undefined && dx.info.temp == 1 && dx.info.data !=undefined && dx.info.data.length > 0">
            <em v-for="(_dx,_index) in dx.info.data" :key="_index" @click="emitItemValue(_dx.label, _index, dx.info.temp)">{{_dx.label}}</em>
          </div>    
        </li>
      </ul>
      
      <!--評測结束 @模板-->
      <dl class="dialog agent" v-if="pushEvaluateState">
        <dt><img src="https://static.iberhk.com/v2/web/images/evaluate/robit.png"></dt>
        <dd class="result">
          <div>  
            <div class="result-bg">
              <h3>{{plug.sm(simply, 'AI疾病評測結果')}}</h3>
              <p>{{plug.sm(simply, 'TiMi已經思考完畢了~為你寫了一份個人疾病評測報告噢！')}}</p>
            </div>
            <p @click="enterPage">{{plug.sm(simply, '查看詳情')}}</p>
          </div>
        </dd>
      </dl>

      <!--評測结束-提交失败-->
      <dl class="dialog agent" v-if="pushNetwwork && submitCount < 3">
        <dt><img src="https://static.iberhk.com/v2/web/images/evaluate/robit.png"></dt>
        <dd class="result">
          <div>  
            <div style="background-color:#ffaa33;">
              <h3>友情提示</h3>
              <p>{{plug.sm(simply, '親，您的網絡環境不給力哦，TiMi建議您可以"繼續提交" 或 "重新答題"啦')}}</p>
            </div>
            <p class="network"> 
              <button class="com-btn" @click="startQuestion" type="button" style="color:#ffaa33;border-right:1px solid #eee;">{{plug.sm(simply, '重新答題')}}</button>
              <button class="com-btn" @click="sendResult(1)" type="button" style="color: #4b93ff;">{{plug.sm(simply, '繼續提交')}}</button>
            </p>
          </div>
        </dd>
      </dl> 

      <!--評測结束-提交3次了-->
      <dl class="dialog agent" v-if="pushRepeatSend && submitCount > 2">
        <dt><img src="https://static.iberhk.com/v2/web/images/evaluate/robit.png"></dt>
        <dd class="result">
          <div>  
            <div style="background-color:#ffaa33;">
              <h3>友情提示</h3>
              <p>{{plug.sm(simply, '親，您的網絡環境真的很不給力，TiMi建議您可以"重新答題"或稍後再試')}}</p>
            </div>
            <p class="network"> 
              <button class="com-btn" @click="startQuestion" type="button" style="color:#ffaa33;width:100%;">{{plug.sm(simply, '重新答題')}}</button>
            </p> 
          </div>
        </dd>
      </dl> 
 
    </div> 

    
    <com-oauth-phone :params="sendMsgVData"></com-oauth-phone>
    <share-btn :share="share" model="evaluate"></share-btn>
  </div>
</template>

<script src="./index.js"></script>   
<style scoped src="./index.css"></style>
    