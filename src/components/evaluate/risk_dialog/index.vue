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
                <span v-if="!dx.loading" v-html="plug.transBr(dx.info.content)"></span>  
                <mt-spinner v-if="dx.loading" type="triple-bounce" style="height:.25rem;line-height:.25rem;"></mt-spinner>
              </div> 
            </dd>   
          </dl>
          
          <!--@customer--> 
          <dl v-if="dx.type == 1" class="dialog customer">
            <dd>
              <div>   
                <span>{{dx.info.content}}</span> 
                <em v-if="dx.reelect" class="reelect" @click="reelect(index, dx.info.content)"><label v-if="simply">重选</label><label v-if="!simply">重選</label></em>
              </div>  
            </dd>
            <dt>
              <img v-if="userAvatar != null" :src="userAvatar">
              <i v-if="userAvatar == null" class="iconfont">&#xe685;</i>
            </dt>
          </dl>



          

          <!--模板：temp == 0 -->
          <div class="items select-items" v-if="dx.type == 0 && dx.info && dx.info.temp != undefined && dx.info.temp == 0 && dx.info.data !=undefined && dx.info.data.length > 0">
            <em v-for="(_dx,_index) in dx.info.data" :key="_index" @click="emitItemValue(_dx.label, _index, dx.info.temp)">{{_dx.label}}</em> 
          </div>

          <!--模板：temp == 1 --> 
          <div class="items select-items" v-if="dx.type == 0 && dx.info && dx.info.temp != undefined && dx.wake && dx.info.data !=undefined && dx.info.data.length > 0">
            <em @click="startLayout"><label v-if="simply">请选择</label><label v-if="!simply">請選擇</label></em> 
          </div>

          <mt-popup v-if="dx.type == 0 && dx.info && dx.info.temp != undefined && dx.info.temp == 1 && dx.info.data !=undefined && dx.info.data.length > 0" v-model="comLayout" position="bottom">
            <dl class="select-picker" :class="{'com-app-share': inApp}">   
              <dt><label v-if="simply">请选择</label><label v-if="!simply">請選擇</label></dt> 
              <dd> 
                <div class="com-scroll-y aux-bar">
                  <p v-for="(_dx, _index) in dx.info.data" :key="_index" :class="{active: _dx.active}" @click="emitListValue(_dx.label, _index, dx.info.temp)">{{_dx.label}}</p> 
                </div> 
              </dd>    
            </dl> 
          </mt-popup>

          <!--模板：temp == 2 --> 
          <div class="items select-checkbox" v-if="dx.type == 0 && dx.info && dx.info.temp != undefined && dx.info.temp == 2 && dx.info.data !=undefined && dx.info.data.length > 0">
            <div>
              <span v-for="(_dx,_index) in dx.info.data" :key="_index" :class="{'com-disabled': _dx.disabled}" @click="selectMember(_index)"><em class="mint-checkbox-core aux-checkbox" :class="{'com-checkbox-active': _dx.active}"></em>{{_dx.label}}</span>
            </div>  
            <button type="button" @click="emitMemberValue"><label v-if="simply">确定</label><label v-if="!simply">確定</label></button>
          </div>

          <!--模板：temp == 3 -->
          <mt-popup v-if="dx.type == 0 && dx.info && dx.info.temp != undefined && dx.info.temp == 3 && dx.info.data !=undefined && dx.info.data.length > 0" v-model="incomePane" position="bottom"> 
            <dl class="select-picker" :class="{'com-app-share': inApp}">
              <dt><em v-if="incomeAddr != null" @click="backIncomeAddr">{{incomeAddr}}</em><label v-if="simply">请选择</label><label v-if="!simply">請選擇</label></dt>
              <dd>
                <div class="com-scroll-y aux-bar">
                  <p v-for="(_dx, _index) in incomeList" :key="_index" @click="emitIncomeValue(_dx.label, _index)" :class="{active: _dx.active}">{{_dx.label}}</p>
                </div>
              </dd> 
            </dl>  
            </dl>   
          </mt-popup>  

          <!--模板：temp == 4 --> 
          <mt-popup v-if="dx.type == 0 && dx.info && dx.info.temp != undefined && dx.info.temp == 4 && dx.info.data !=undefined && dx.info.data.length > 0" v-model="defrayPane" position="bottom"> 
            <dl class="select-picker" :class="{'com-app-share': inApp}">
              <dt><em>{{defrayAddr}}</em><label v-if="simply">请选择</label><label v-if="!simply">請選擇</label></dt>
              <dd>  
                <div class="com-scroll-y aux-bar"> 
                  <p v-for="(_dx, _index) in defrayList" :key="_index" @click="emitDefrayValue(_dx.label, _index)" :class="{active: _dx.active}">{{_dx.label}}</p>
                </div>
              </dd>
            </dl>    
          </mt-popup>

          <!--模板：temp == 5 -->  
          <div class="items select-checkbox" v-if="dx.type == 0 && dx.info && dx.info.temp != undefined && dx.info.temp == 5 && dx.info.data !=undefined && dx.info.data.length > 0">
            <div>
              <span v-for="(_dx,_index) in dx.info.data" :key="_index" :class="{'com-disabled': _dx.disabled}" @click="selectTraval(_index)"><em class="mint-checkbox-core aux-checkbox" :class="{'com-checkbox-active': _dx.active}"></em>{{_dx.label}}</span>
            </div> 
            <button type="button" @click="emitTravalValue"><label v-if="simply">确定</label><label v-if="!simply">確定</label></button>
          </div>

        </li>
      </ul>
      
      <!--評測结束-提交成功-->
      <dl class="dialog agent" v-if="pushEvaluateState">
        <dt><img src="https://static.iberhk.com/v2/web/images/evaluate/robit.png"></dt>
        <dd class="result">
          <div>  
            <div class="result-bg">
              <h3><label v-if="simply">智能风险评测结果</label><label v-if="!simply">智能風險評測結果</label></h3>
              <p><label v-if="simply">TiMi已经思考完毕了~为你写了一份个人风险评测报告噢！</label><label v-if="!simply">TiMi已經思考完畢了~為你寫了一份個人風險評測報告噢！</label></p>
            </div>
            <p @click="enterPage"><label v-if="simply">查看详情</label><label v-if="!simply">查看詳情</label></p>
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
              <p>
                <label v-if="simply">亲，您的网络环境不给力哦，TiMi建议您可以"继续提交" 或 "重新答题"啦</label>
                <label v-if="!simply">親，您的網絡環境不給力哦，TiMi建議您可以"繼續提交" 或 "重新答題"啦</label>
              </p>
            </div>
            <p class="network"> 
              <button class="com-btn" @click="startQuestion" type="button" style="color:#ffaa33;border-right:1px solid #eee;">重新答题</button>
              <button class="com-btn" @click="sendResult(1)" type="button" style="color: #4b93ff;">继续提交</button>
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
              <p>
                <label v-if="simply">亲，您的网络环境真的很不给力，TiMi建议您可以"重新答题"或稍后再试</label>
                <label v-if="!simply">親，您的網絡環境真的很不給力，TiMi建議您可以"重新答題"或稍後再試</label>
              </p>
            </div>
            <p class="network"> 
              <button class="com-btn" @click="startQuestion" type="button" style="color:#ffaa33;width:100%;">重新答题</button>
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
      