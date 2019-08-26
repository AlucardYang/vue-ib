<template>
    <div class="com-frame com-bgrs iber-radar" :style="{'padding-top': plug.iphonex ? '.5rem' : '.25rem', height: plug.android ? key.height + 'px' : '100%'}">
    <div class="com-frame com-bgrs com-flexv radar-frame">
      <img @click="backWindow" class="close" src="https://static.iberhk.com/v2/web/images/agent/radar/close.png" alt="">

      <header class="com-flexv">
        <div class="com-flex robit">
          <img class="left big" src="https://static.iberhk.com/v2/web/images/agent/radar/left_big.png" alt="">
          <img class="left lit" src="https://static.iberhk.com/v2/web/images/agent/radar/left_lit.png" alt="">
          <img class="robit" src="https://static.iberhk.com/v2/web/images/agent/radar/robit.png" alt="">
          <img class="right lit" src="https://static.iberhk.com/v2/web/images/agent/radar/right_lit.png" alt="">
          <img class="right big" src="https://static.iberhk.com/v2/web/images/agent/radar/right_big.png" alt="">
        </div>
        <h3>{{question.title}}</h3>
        <div class="separate">
          <img class="underlines" src="https://static.iberhk.com/v2/web/images/agent/radar/underline.png" alt="">
          <div v-if="notice.data.length > 0" class="com-flex slide">
            <em><i class="iconfont">&#xe688;</i></em>
            <div>
              <ul class="aux" :style="notice.slide">
                <li v-for="(dx, index) in notice.data" :key="index" class="com-nowrap alt">{{dx.title}}</li>
              </ul> 
            </div>
          </div>
        </div>
      </header>
      <section class="com-scroll"> 
        <!--添加用户-->
        <div v-if="type == 0">
          <div class="com-disx radar-input-frame add-user">
            <input v-if="!simply" class="com-btn aux-plhd com-marlt com-nowrap" @keydown="controlUserName" maxlength="30" v-model="txtContent" type="text" value="" placeholder="請輸入名字" />
            <input v-if="simply" class="com-btn aux-plhd com-marlt com-nowrap" @keydown="controlUserName" maxlength="30" v-model="txtContent" type="text" value="" placeholder="请输入名字" />
            <em @click="saveUserName" :style="submitColor">保存</em>
          </div> 
        </div> 

        <!--单选: this.question.type == '1'-->
        <div v-if="type == 1 && question.type == '1'"> 
          <ul class="aux" :class="(question.label != 'source_type' && question.data.length > 4) ? 'double-row' : 'single-row'">
            <li v-for="(dx, index) in question.data" :key="index">
              <div @click="submitItemData('1', dx.uuid, dx.label)" class="com-disx radar-input-frame aux-active">
                <em>{{question.letter[index]}}</em>
                <!--<input class="com-btn com-nowrap" type="text" :value="dx.title" readonly placeholder="" />-->
                <div class="com-nowrap filter">{{dx.title}}</div>
              </div> 
            </li>
          </ul>
        </div>


        <!--多选: this.question.type == '2'-->
        <div v-if="type == 1 && question.type == '2'" class="com-flexv replenish">
          <div class="com-scroll">
            <ul class="aux" :class="question.data.length > 4 ? 'double-row' : 'single-row'">
              <li v-for="(dx, index) in question.data" :key="index">
                <div @click="checkBoxHList(index)" class="com-disx select-more">
                  <div><em class="mint-checkbox-core" :class="{'com-checkbox-active': dx.active}"></em></div>
                  <span class="com-nowrap">{{dx.title}}</span>
                </div>
              </li>  
            </ul>
            <p v-if="type == 1 && question.type == '2'" class="go-filter"><em @click="getSubject(null, 1)"><label v-if="simply">跳过</label><label v-if="!simply">跳過</label></em></p>
          </div>
          <button @click="submitItemData('2')" class="com-btn" type="button"><label v-if="simply">确定</label><label v-if="!simply">確定</label></button>
        </div>

        <!--文本: this.question.type == '3'-->
        <div v-if="type == 1 && question.type == '3' && this.question.label != 'company'">
          <div class="com-disx radar-input-frame iber-text single-input">
            <input v-if="!simply" class="com-btn aux-plhd com-nowrap" v-model="txtContent" type="text" value="" :placeholder="question.placeholder" />
            <input v-if="simply" class="com-btn aux-plhd com-nowrap" v-model="txtContent" type="text" value="" :placeholder="question.placeholder" />
            <em @click="submitItemData('3')" :style="submitColor">保存</em> 
          </div> 
        </div> 

        <!--公司-文本: this.question.type == '3' && this.question.label == 'company'-->
        <div v-if="type == 1 && question.type == '3' && this.question.label == 'company'">
          <div class="com-disx radar-input-frame iber-text single-input">
            <input v-if="!simply" class="com-btn aux-plhd com-nowrap" @keydown="companyName" maxlength="60" v-model="txtContent" type="text" value="" :placeholder="question.placeholder" />
            <input v-if="simply" class="com-btn aux-plhd com-nowrap" @keydown="companyName" maxlength="60" v-model="txtContent" type="text" value="" :placeholder="question.placeholder" />
            <em @click="submitItemData('3')" :style="submitColor">保存</em> 
          </div> 
        </div> 

        <!--生日: this.question.type == '4'-->
        <div v-if="type == 1 && question.type == '4'">
          <div class="com-disx radar-input-frame birthday single-input">
            <input v-if="!simply" @click="selectDatePicter" class="com-btn aux-plhd com-nowrap" style="font-size:.15rem;" type="text" v-model="date.birth" value="" readonly placeholder="請選擇生日" />
            <input v-if="simply" @click="selectDatePicter" class="com-btn aux-plhd com-nowrap" style="font-size:.15rem;" type="text" v-model="date.birth" value="" readonly placeholder=" 请选择生日" />
            <em @click="submitItemData('4')" :style="submitColor">保存</em>
          </div> 
        </div>

        <!--地区: this.question.type == '5' v-if="type == 1 && question.type == '5'"-->
        <div v-if="type == 1 && question.type == '5'">
          <div class="com-disx radar-input-frame address single-input">
            <input v-if="!simply" @click="selectAddrPicter" class="com-btn aux-plhd com-nowrap" style="font-size:.15rem;" v-model="addr.value" type="text" value="" readonly placeholder="請選擇地區" />
            <input v-if="simply" @click="selectAddrPicter" class="com-btn aux-plhd com-nowrap" style="font-size:.15rem;" v-model="addr.value" type="text" value="" readonly placeholder="请选择地区" />
            <em @click="submitItemData('5')" :style="submitColor">保存</em>
          </div>           
        </div>

        <!--月薪: this.question.type == '6' v-if="type == 1 && question.type == '6'"  -->
        <div v-if="type == 1 && question.type == '6'">
          <div class="com-disx radar-input-frame income single-input">
            <div>HK$</div>
            <input v-if="simply" oninput="if(value.length>9)value=value.slice(0,9)" @focus="focusFormat" @blur="blurFormat" @keyup="controlSI" @keydown="keyDownSalary" class="com-btn aux-plhd com-nowrap" type="tel" v-model="salary.value" value="" placeholder="请输入月收入金额" />
            <input v-if="!simply" oninput="if(value.length>9)value=value.slice(0,9)" @focus="focusFormat" @blur="blurFormat" @keyup="controlSI" @keydown="keyDownSalary" class="com-btn aux-plhd com-nowrap" type="tel" v-model="salary.value" value="" placeholder="請輸入月收入金額" /> 
            <em @click="submitItemData('6')" :style="submitColor">保存</em>
          </div>  
        </div> 

        <!--区号: this.question.type == '7'--> 
        <div v-if="type == 1 && question.type == '7'">
          <div class="com-disx radar-input-frame area-code single-input">
            <div @click="selectCode" class="com-flex">
              <span class="com-nowrap">{{mobile.code}}</span>
              <i class="iconfont">&#xe78c;</i>
            </div>
            <input v-if="!simply" @keyup="keyPhone" v-model="mobile.number" type="tel" value="" class="com-btn aux-plhd com-nowrap" style="font-size:.15rem;" placeholder="請填寫手機號" />
            <input v-if="simply" @keyup="keyPhone" v-model="mobile.number" type="tel" value="" class="com-btn aux-plhd com-nowrap" style="font-size:.15rem;" placeholder="请填写手机号" />
            <em @click="submitItemData('7')" :style="submitColor">保存</em>
          </div>           
        </div>  

        <p v-if="type == 1 && question.type != '2'" class="go-filter"><em @click="getSubject(null, 1)"><label v-if="simply">跳过</label><label v-if="!simply">跳過</label></em></p>
        
        <!--我想完善他的其他资料-->
        <ul v-if="type == 2" class="aux double-row">
          <li v-for="(dx, index) in user.data" :key="index">
            <div @click="getSubject(dx.cate)" class="com-disx radar-input-frame temp-relative">
              <em>{{question.letter[index]}}</em>
              <span class="com-nowrap">{{dx.title}}</span>
            </div>
          </li>  
        </ul>

      </section>
      <footer v-if="type != 0"> 
        <button @click="analyse(0)" class="com-bgrs com-btn" type="button"><label v-if="simply">立即分析</label><label v-if="!simply">立即分析</label></button>
        <p><span v-if="user.perfect" @click="replenish"><label v-if="simply">我想完善他的其他资料</label><label v-if="!simply">我想完善他的其他資料</label><i class="iconfont">&#xe76b;</i></span></p>
      </footer>
    </div>

    
    <!--选择区号-->
    <mt-popup v-model="mobile.state" position="bottom">
      <mt-picker :slots="mobile.slots" :itemHeight="50" :showToolbar="true" class="select-frame" @change="onCodeChange" valueKey="value">
        <div style="width:.54rem;"><span @click="cancel">取消</span></div> 
        <div style="flex:1;font-size:.17rem;color:#2a2a2a;">{{mobile.title}}</div>

        <div v-if="!simply" style="width:.54rem;"><span @click="confirm">確定</span></div>  
        <div v-if="simply" style="width:.54rem;"><span @click="confirm">确定</span></div> 
      </mt-picker>
    </mt-popup>
    <!--选择生日--> 
    <mt-popup v-model="date.state" position="bottom">
      <mt-picker :slots="date.slots" :itemHeight="50" :showToolbar="true" class="select-frame" @change="onDateChange" valueKey="value">
        <div style="width:.54rem;"><span @click="cancelDate">取消</span></div> 
        <div style="flex:1;font-size:.17rem;color:#2a2a2a;">{{date.title}}</div>
        <div v-if="!simply" style="width:.54rem;"><span @click="confirmDate">確定</span></div>  
        <div v-if="simply" style="width:.54rem;"><span @click="confirmDate">确定</span></div> 
      </mt-picker>
    </mt-popup>
    <!--选择地址-->
    <mt-popup v-model="addr.state" position="bottom">
      <div class="iber-addr">
        <h3><label v-if="simply">请选择地区</label><label v-if="!simply">請選擇地區</label></h3>
        <div class="toolbar" ref="addrToolBar" @touchstart="startHandle" @touchmove="moveHandle" @touchend="endHandle">
          <p>
            <span ref="addrToolMove" :style="addr.pos.move">
              <em v-for="(dx, index) in addr.txt" @click.stop="selectAddrNav(index)" v-if="plug.valueValid(dx.label)" :class="{active: dx.active}">{{dx.label}}</em>
            </span> 
          </p>
        </div>
        <ul class="aux com-scroll aux-bar">
          <li v-if="addr.type == 0" v-for="(dx, index) in addr.p_data" @click="selectAddrItem(dx.name, dx.id)" :key="index" class="com-nowrap com-marlr">{{dx.name}}</li>
          <li v-if="addr.type == 1" v-for="(dx, index) in addr.c_data" @click="selectAddrItem(dx.name, dx.id)" :key="index" class="com-nowrap com-marlr">{{dx.name}}</li>
          <li v-if="addr.type == 2" v-for="(dx, index) in addr.a_data" @click="selectAddrItem(dx.name, dx.id)" :key="index" class="com-nowrap com-marlr">{{dx.name}}</li>
        </ul>
      </div>
    </mt-popup>
  </div>
</template>


<script src="./index.js"></script>
<style scoped src="./index.css"></style>