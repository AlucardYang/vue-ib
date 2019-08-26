<template>
  <div class="com-frame" style="padding-bottom:0rem;" :class="{'com-wxix-frame': wxixm}">
    <div class="com-scroll-y aux-bar" @scroll="scrollHandle" style="padding-bottom:.3rem;background:#fff;">
      <!--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%业务区%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-->
      <!--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%业务区%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-->
      <mt-button type="primary" style="display:block;width:100%;" @click="debugHAct">事件机制</mt-button>
      <input type="tel" @focus="focusFormat" @blur="blurFormat" v-model="inputNumber" value="" class="com-btn com-marlt" style="width:100%;height:.5rem;border:1px solid #eee;">
      {{unloadPage}}
      <h3 class="gererate-line"></h3>
      
      

      <div class="com-marlr">
        <mt-button type="primary" size="small" @click="doPaste" id="getClipboardID" data-clipboard-text="123456">clipboard粘贴板</mt-button>
        <mt-button type="primary" size="small" @click="openToastHAct">Toast</mt-button>
        <mt-button type="primary" size="small" @click="openConfirmHAct">确认框</mt-button>
        <mt-button type="primary" size="small" @click="doLoading">数据加载框</mt-button>
        <mt-button type="primary" size="small" @click="doProgress">业务操作框</mt-button>
        <mt-button type="primary" size="small" @click="doPageLoading">页面加载框</mt-button> 
        <mt-button type="primary" size="small" @click="pickerHAct">Picker框</mt-button>

        <mt-button type="primary" size="small" @click="sendMsgHData">查看评测授权</mt-button>
        <mt-button type="primary" size="small" @click="pushMsgHData">咨询顾问授权</mt-button>
        <mt-button type="primary" size="small">授权手机号</mt-button> 
        <mt-button type="primary" size="small" @click="getOpenidHData">獲取微信openid</mt-button>
        
        <mt-button type="primary" size="small" @click="openAgentWechatHAct">关注顾问微信</mt-button>
        <mt-button type="primary" size="small" @click="openAgentWIHAct">健康顾问</mt-button>
        <mt-button type="primary" size="small" @click="openAgentWCHAct">立即预约</mt-button>
        <mt-button type="primary" size="small" @click="praiseAgent"><i class="iconfont">&#xe6a1;</i>点赞</mt-button>
        <mt-button type="primary" size="small" @click="closecurWindow">关闭当前窗口</mt-button>
        <mt-button type="primary" size="small" @click="doiBerCareLogin">iBerCare授权登录</mt-button>
        <mt-button type="primary" size="small">defualt</mt-button>

        <input class="com-btn" @keypress="getKeyCode" type="text" style="display:block;width:100%;height:.5rem;border:1px solid #eee;">
      </div>

      <h3 class="gererate-line"></h3>

      <div style="width:100%;height:2rem;">
        <com-swipe auto="false" @change="getSlideCount">
          <com-swipe-item style="background-color:#D32F2F;font-size: .6rem;">
            <div class="com-flexv" style="width:100%;height:100%;">1</div>
          </com-swipe-item>
          <com-swipe-item style="background-color:#FFCDD2;font-size: .6rem;">
            <div class="com-flexv" style="width:100%;height:100%;">2</div>
          </com-swipe-item>
          <com-swipe-item style="background-color:#448AFF;font-size: .6rem;">
            <div class="com-flexv" style="width:100%;height:100%;">3</div>
          </com-swipe-item>
          <com-swipe-item style="background-color:#FFCDD2;font-size: .6rem;">
            <div class="com-flexv" style="width:100%;height:100%;">4</div>
          </com-swipe-item>
          <com-swipe-item style="background-color:#448AFF;font-size: .6rem;">
            <div class="com-flexv" style="width:100%;height:100%;">5</div>
          </com-swipe-item>
        </com-swipe>
      </div>

      <h3 class="gererate-line"></h3>

      <div style="width:100%;height:1rem;border:1px solid #aaa;" v-loading src="http://www.fujinhuuo.com"></div>
      
      <h3 class="gererate-line"></h3>

      <dl class="aux ysun-layout">
        <dt>文字顏色區</dt>
        <dd>
          <div style="color:#2a2a2a;">#2a2a2a;</div>
          <div style="color:#999;">#999;</div>
          <div style="color:#2d7dff;">#2d7dff;</div>
          <div style="color:#ccc;">#ccc;</div>

          <div style="color:#666;">#666;</div>
          <div style="color:#3364e4;">#3364e4;</div>
          <div style="color:#ffaa33;">#ffaa33;</div>
          <div style="color:#ff5f5f;">#ff5f5f;</div>

          <div style="color:#2adb9b;">#2adb9b;</div>
          <div style="color:#ff0d0d;">#ff0d0d;</div>
          <div style="color:#ffa100;">#ffa100;</div>
          <div style="color:;"></div>
        </dd>
      </dl>  
      <dl class="aux ysun-layout">
        <dt>激活状态區</dt>
        <dd>
          <div style="background:#3364e4;">#3364e4;</div>
          <div style="background:#2d7bff;">#2d7bff;</div>
          <div style="background:;"></div>
          <div style="background:;"></div>

          <div style="background:#2850c0;">#2850c0;</div>
          <div style="background:#0050B3;">#0050B3;</div>
          <div style="background:;"></div>
          <div style="background:;"></div>

        </dd>
      </dl>
      <dl class="aux ysun-layout">
        <dt>背景色區</dt>
        <dd>
          <div style="background:#2d7bff;">#2d7bff;</div>
          <div style="background:#4b93ff;">#4b93ff;</div>
          <div style="background:#f7f7f9;">#f7f7f9;</div>
          <div style="background:#f2f2f2;">#f2f2f2;</div>

          <div style="background:#ddd;">#ddd;</div>
          <div style="background:#89e7c4;">#89e7c4;</div>
          <div style="background:#9488ff;">#9488ff;</div>
          <div style="background:#ffd349;">#ffd349;</div>

          <div style="background:#47c853;">#47c853;</div>
          <div style="background:#0195ff;">#0195ff;</div>
          <div style="background:#ff5981;">#ff5981;</div>
          <div style="background:#ff5a04;">#ff5a04;</div>
          
          <div style="background:#dedfd0;">#dedfd0;</div>
          <div style="background:#faA617;">#faA617;</div>
          <div style="background:#09BB07;">#09BB07;</div> 
          <div style="background:;"></div>
        </dd>
      </dl>

      <h3 class="gererate-line"></h3>

      <ul class="same-layout">
        <li>测试环境</li>
        <li><a href="https://mp.goodiber.com/v2/ysun">https://mp.goodiber.com/v2/ysun</a></li>
      </ul>
      <ul class="same-layout">
        <li>dev2环境</li>
        <li><a href="https://dev2mp.goodiber.com/v2/ysun">https://dev2mp.goodiber.com/v2/ysun</a></li>
      </ul>
      <ul class="same-layout">
        <li>预发布环境</li>
        <li><a href="https://expmp.goodiber.com/v2/ysun">https://expmp.goodiber.com/v2/ysun</a></li>
      </ul>
      <ul class="same-layout">
        <li>线上环境</li>
        <li><a href="https://mp.iberhk.com/v2/ysun">https://mp.iberhk.com/v2/ysun</a></li>
      </ul>
  
      <h3 class="gererate-line"></h3>

      <ul class="same-layout" style="margin-top:.2rem;color:#fff;">
        <li style="background:#13C2C2;">路由名称</li>
        <li style="background:#3436C7;">路由路径</li>
      </ul>

      <ul class="same-layout">
        <li>YSUN</li>
        <li><router-link to="/ysun">/ysun</router-link></li>
      </ul>

      <h3 class="gererate-line"></h3>

      <ul class="same-layout">
        <li>订单列表</li>
        <li><router-link to="/iber-care/order-list?user_uuid=71511b6457f311e889a748d53963e221&mobile_pre=86&mobile=12600001111">/iber-care/order-list?user_uuid=71511b6457f311e889a748d53963e221&mobile_pre=86&mobile=12600001111</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>订单详情</li>
        <li><router-link to="/iber-care/order-detail?user_uuid=71511b6457f311e889a748d53963e221&order_uuid=789sdfs77df76f7d6f7df6d7f67d6f&mobile_pre=86&mobile=12600001111">/iber-care/order-detail?user_uuid=71511b6457f311e889a748d53963e221&order_uuid=789sdfs77df76f7d6f7df6d7f67d6f&mobile_pre=86&mobile=12600001111</router-link></li>
      </ul>  

      <h3 class="gererate-line"></h3>

      <ul class="same-layout">
        <li>积分规则</li>
        <li><router-link to="/activity/point_rule">/activity/point_rule</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>积分礼品</li> 
        <li><router-link to="/activity/goods_detail?user_uuid=84657223259d11e889a748d53963e221&prize_uuid=7178bd1b2e40af77e0975a16be33b0fb">/activity/goods_detail?user_uuid=84657223259d11e889a748d53963e221&prize_uuid=7178bd1b2e40af77e0975a16be33b0fb</router-link></li>
      </ul> 

      <h3 class="gererate-line"></h3>

      <ul class="same-layout">
        <li>资讯</li>
        <li><router-link to="/GvdjLRAO">/GvdjLRAO</router-link></li>
      </ul>

      <h3 class="gererate-line"></h3>

      <ul class="same-layout">
        <li>个人主页（默认）</li>
        <li><router-link to="/user/index?user_uuid=71511b6457f311e889a748d53963e221&user_homepage_template_uuid=df0f1d2c2aca1f7da1ad0608aa66526d">/user/index?user_uuid=71511b6457f311e889a748d53963e221&user_homepage_template_uuid=df0f1d2c2aca1f7da1ad0608aa66526d</router-link></li>
      </ul>

      <h3 class="gererate-line"></h3>

      <ul class="same-layout">
        <li>AI雷达-添加用户</li>
        <li><router-link to="/radar/index?type=add-user&c_user_uuid=552177f9dbbcb6f7ab470208cbd29a7e&user_uuid=71511b6457f311e889a748d53963e221&in_app=1&language=zh-CN&headers=6uuJJBAXfaLMpPLFOlwpANswtU%2BCCE2%2BF1WJsxYsaRNaN%2B%2F%2BDzo64maYm%2BokCbFnZZkhBmPb5%2FE4yLi%2FJPHfstN83Uzbf4QkKVnrvqednszAvnt1cotkUynovZZ8X%2B7VdZDLMbEBkhsM1gwORh8qZmArkd%2BEEkatV56N6bIGe1MULb%2FJ2JMsR3eLIKzfvCn5">/radar/index?type=add-user&c_user_uuid=552177f9dbbcb6f7ab470208cbd29a7e&user_uuid=71511b6457f311e889a748d53963e221&in_app=1&language=zh-CN&headers=6uuJJBAXfaLMpPLFOlwpANswtU%2BCCE2%2BF1WJsxYsaRNaN%2B%2F%2BDzo64maYm%2BokCbFnZZkhBmPb5%2FE4yLi%2FJPHfstN83Uzbf4QkKVnrvqednszAvnt1cotkUynovZZ8X%2B7VdZDLMbEBkhsM1gwORh8qZmArkd%2BEEkatV56N6bIGe1MULb%2FJ2JMsR3eLIKzfvCn5</router-link></li>
      </ul>

      <h3 class="gererate-line"></h3>

      <ul class="same-layout">
        <li>培训签到</li>
        <li><router-link to="/training/sign-in?uuid=ab68f59ae1a256fdcab43e73dbbd537f">/training/sign-in?uuid=ab68f59ae1a256fdcab43e73dbbd537f</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>签到成功</li>
        <li><router-link to="/training/success">/training/success</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>学习须知</li>
        <li><router-link to="/training/rule">/training/rule</router-link></li>
      </ul>

      <h3 class="gererate-line"></h3>
      
      <ul class="same-layout">
        <li>iBer Payment</li>
        <li><router-link to="/pay">/pay</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>iBer Payment登錄</li>
        <li><router-link to="/pay/login">/pay/login</router-link></li>
      </ul>
      <ul class="same-layout"> 
        <li>支付配置</li> 
        <li><router-link to="/pay/perfect">/pay/perfect</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>支付二维码</li> 
        <li><router-link to="/pay/qrcode">/pay/qrcode</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>iBer Payment Center</li>
        <li><router-link to="/pay/info">/pay/info</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>iBer Payment類型</li>
        <li><router-link to="/pay/type">/pay/type</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>iBer Payment外部框架</li>
        <li><router-link to="/pay/transact">/pay/transact</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>iBer Payment正在支付中</li>
        <li><router-link to="/pay/status">/pay/status</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>iBer Payment成功</li>
        <li><router-link to="/pay/success">/pay/success</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>iBer Payment失敗</li> 
        <li><router-link to="/pay/failure">/pay/failure</router-link></li>
      </ul>

      <h3 class="gererate-line"></h3>

      <ul class="same-layout">
        <li>評測</li>
        <li><router-link to="/evaluate">/evaluate</router-link></li>
      </ul>

      <ul class="same-layout">
        <li>AI風險評測</li>
        <li><router-link to="/BTnQL3ft">/BTnQL3ft</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>AI風險評測</li>
        <li><router-link to="/evaluate/risk-dialog?user_uuid=71511b6457f311e889a748d53963e221">/evaluate/risk-dialog?user_uuid=71511b6457f311e889a748d53963e221</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>AI風險評測結果</li>
        <li><router-link to="/rxTKHFGC?auth=force&card=full&language=auto">/rxTKHFGC?auth=force&card=full&language=auto</router-link></li>
      </ul> 
      <ul class="same-layout">
        <li>AI風險評測結果</li>
        <li><router-link to="/evaluate/risk-report?user_uuid=71511b6457f311e889a748d53963e221&answer_uuid=5703157e0f0c740d0daebd1e17e9f6e6">/evaluate/risk-report?user_uuid=71511b6457f311e889a748d53963e221&answer_uuid=5703157e0f0c740d0daebd1e17e9f6e6</router-link></li>
      </ul> 
      <ul class="same-layout">
        <li>AI風險評測紀錄</li>
        <li><router-link to="/evaluate/risk-record?user_uuid=71511b6457f311e889a748d53963e221&answer_uuid=5703157e0f0c740d0daebd1e17e9f6e6">/evaluate/risk_record?user_uuid=71511b6457f311e889a748d53963e221&answer_uuid=5703157e0f0c740d0daebd1e17e9f6e6</router-link></li>
      </ul> 
      <ul class="same-layout">
        <li>AI風險評測APP結果</li>
        <li><router-link to="/evaluate/risk-app?agent_uuid=b26fedae73ead3ef2ac79f4ac7a239cc&answer_uuid=5703157e0f0c740d0daebd1e17e9f6e6">/evaluate/risk_app?agent_uuid=b26fedae73ead3ef2ac79f4ac7a239cc&answer_uuid=5703157e0f0c740d0daebd1e17e9f6e6</router-link></li>
      </ul> 

      <h3 class="gererate-line"></h3>

      <ul class="same-layout">
        <li>AI危疾評測</li>
        <li><router-link to="/Sc4XNHxH">/Sc4XNHxH</router-link></li>
      </ul> 
      <ul class="same-layout">
        <li>AI危疾評測</li>
        <li><router-link to="/evaluate/disease-dialog?user_uuid=71511b6457f311e889a748d53963e221">/evaluate/disease-dialog?user_uuid=71511b6457f311e889a748d53963e221</router-link></li>
      </ul> 
      <ul class="same-layout">
        <li>AI危疾評測結果</li>
        <li><router-link to="/bXerZi9W?auth=force&card=full&language=auto">/bXerZi9W?auth=force&card=full&language=auto</router-link></li>
      </ul> 
      <ul class="same-layout">
        <li>AI危疾評測結果</li>
        <li><router-link to="/evaluate/disease-report?user_uuid=71511b6457f311e889a748d53963e221&answer_uuid=737f970eefe9a1d3a617aaa81318b4e6">/evaluate/disease-report?user_uuid=71511b6457f311e889a748d53963e221&answer_uuid=737f970eefe9a1d3a617aaa81318b4e6</router-link></li>
      </ul>
      <ul class="same-layout"> 
        <li>AI危疾評測紀錄</li>  
        <li><router-link to="/evaluate/disease-record?user_uuid=71511b6457f311e889a748d53963e221&answer_uuid=ee51cff6df4dfef2241de67329764103">/evaluate/disease_record?user_uuid=71511b6457f311e889a748d53963e221&answer_uuid=ee51cff6df4dfef2241de67329764103</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>AI危疾評測APP結果</li>
        <li><router-link to="/evaluate/disease-app?agent_uuid=71511b6457f311e889a748d53963e221&answer_uuid=737f970eefe9a1d3a617aaa81318b4e6">/evaluate/disease_app?agent_uuid=71511b6457f311e889a748d53963e221&answer_uuid=737f970eefe9a1d3a617aaa81318b4e6</router-link></li>
      </ul>

      <h3 class="gererate-line"></h3>

      <ul class="same-layout"> 
        <li>評測反馈</li>
        <li @click="pushPath('/evaluate/result')">/evaluate/result</li>
      </ul>

      <h3 class="gererate-line"></h3>

      <ul class="same-layout">
        <li>咨询</li>
        <li><router-link to="/agent">/agent</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>地址信息申報</li>
        <li><router-link to="/agent/address?user_uuid=027d25db9ffa0bea6ca15acd8df0ca6e&answer_uuid=eb4a09e618df9cfe8a3a2caae2977f30">/agent/address?user_uuid=027d25db9ffa0bea6ca15acd8df0ca6e&answer_uuid=eb4a09e618df9cfe8a3a2caae2977f30</router-link></li>
      </ul>
      <ul class="same-layout">
        <li>諮詢顧問</li> 
        <li><router-link to="/agent/consult?user_uuid=027d25db9ffa0bea6ca15acd8df0ca6e&answer_uuid=eb4a09e618df9cfe8a3a2caae2977f30&from_type=15">/agent/consult?user_uuid=027d25db9ffa0bea6ca15acd8df0ca6e&answer_uuid=eb4a09e618df9cfe8a3a2caae2977f30&from_type=15</router-link></li>
      </ul>
      <ul class="same-layout">
        <li></li>
        <li><router-link to=""></router-link></li>
      </ul>

      <h3 class="gererate-line"></h3>

      <dl class="aux ysun-layout">
        <dt>单选（单项）</dt> 
        <dd>
          <p class="ysun-aux-p" @click="radioHItem"><em class="mint-checkbox-core aux-checkbox" :class="{'com-checkbox-active': radioVItem}"></em> 单选单项</p>
        </dd>
      </dl>
      <dl class="aux ysun-layout">
        <dt>单选（多项）</dt>
        <dd>
          <p class="ysun-aux-p" v-for="(dx, index) in radioVList" @click="radioHList(index)"><em class="mint-checkbox-core" :class="{'com-checkbox-active': dx.active}"></em> 单选多项</p>
        </dd>
      </dl>
      <dl class="aux ysun-layout">
        <dt>多选（多项）</dt>
        <dd>
          <p class="ysun-aux-p" v-for="(dx, index) in checkBoxVList" @click="checkBoxHList(index)"><em class="mint-checkbox-core aux-checkbox" :class="{'com-checkbox-active': dx.active}"></em> 多选多项</p>
        </dd>
      </dl>

      <h3 class="gererate-line"></h3>

      <dl class="aux ysun-layout">
        <dt>变量命名规范V</dt>
        <dd>  
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">V</label><span>变量variable首字母，存在下划线_时，可不用V字符</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">H</label><span>事件handle首字母</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">nameV...</label><span>变量通识命名</span></p>

          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">idx</label><span>事件关于在v-for="dx, index" in nameList循环变量中传值index</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">index</label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">c_index</label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">id</label><span>用于事件中传输id值</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">index</label><span>用于nameVList.forEach((value, index, array)=> {});</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">i，j，k</label><span>用于for(let i = 0; i < nameVList; i++) {}中</span></p>

          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">fun_name</label><span>函数内部声明变量</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">priv_name</label><span>事件内部声明变量</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">page_name</label><span>页面内部声明变量</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">com_name</label><span>项目公共变量</span></p>

          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">nameVData</label><span>类似{}的数据结构</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">nameVList</label><span>类似[]的数据结构</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">nameVState</label><span>布尔值变量</span></p>

          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">radioVItem</label><span>单选单项变量</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">radioVList</label><span>单选多项变量</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">checkBoxVList</label><span>多选多项变量</span></p>

          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
        </dd>
      </dl>

      <h3 class="gererate-line"></h3>

      <dl class="aux ysun-layout">
        <dt>事件命名规范H</dt> 
        <dd>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">getHData</label><span>获取数据通识命名</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">submitHData</label><span>提交数据通识命名</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">nameHList</label><span>数组事件通识命名</span></p>

          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">comHName</label><span>项目公共事件</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">nameHAct</label><span>不涉及数据事件通识命名</span></p>

          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">radioHItem</label><span>单选单项事件</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">radioHList</label><span>单选多项事件</span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex">checkBoxHList</label><span>多选多项事件</span></p>

          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
          <p class="com-disx com-wrap ysun-variable-p"><label class="com-flex"></label><span></span></p>
        </dd>
      </dl>



      <!--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%业务区%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-->
      <!--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%业务区%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-->
    </div>



    <button v-if="false" class="com-btn com-button-action aux-abs-full" :class="{'com-wxix-button': wxixm}" type="button" @click="consultAgentHData">咨询顾问</button>

    <!--***********************组件区***********************-->
    <!--***********************组件区***********************-->

    <img v-if="scroll.state" @click="backTop" class="com-back-top" :src="$root.back_top" style="bottom:.1rem;" alt="">

    <div v-if="controlPraise" class="com-screen aux-fix com-flex com-praise-agent">
      <i class="iconfont aux-effect">&#xe798;</i>
    </div>

    <mt-popup v-model="pickerVState" position="bottom">
      <mt-picker :slots="pickerSlots" :itemHeight="50" :showToolbar="true" class="select-frame" @change="onValuesChange" valueKey="value">
        <div style="width:.54rem;"><span @click="cancel">取消</span></div>
        <div style="flex:1;font-size:.17rem;color:#2a2a2a;">{{toolBarTitle}}</div>
        <div style="width:.54rem;"><span @click="confirm">確定</span></div>  
      </mt-picker>
    </mt-popup>


    <com-oauth-phone :params="sendMsgVData"></com-oauth-phone>

    <com-agent-wechat :params="comAgentWechatData"></com-agent-wechat>
    <com-agent-wechat-ibercare :params="comAWIData"></com-agent-wechat-ibercare>
    <com-agent-wechat-contact :params="comAWCData"></com-agent-wechat-contact>

    <com-ibercare-login v-model="showiBerCareLogin" :params='iBerCareLogin'></com-ibercare-login>

    <!--***********************组件区***********************-->
    <!--***********************组件区***********************-->
  </div>
</template>


<script src="./index.js"></script>
<style scoped src="./index.css"></style>
