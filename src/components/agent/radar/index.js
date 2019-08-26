// import Vue from 'vue';
import { Popup, Picker } from 'mint-ui';
// Vue.component(Popup.name, Popup);
// Vue.component(Picker.name, Picker);


import comAgentRatar from "@/components/component/com_agent_radar.vue";

import cn_province from "@/assets/data/address/zh-CN/province.json";
import tw_province from "@/assets/data/address/zh-TW/province.json";

import cn_city from "@/assets/data/address/zh-CN/city.json";
import tw_city from "@/assets/data/address/zh-TW/city.json";

import cn_area from "@/assets/data/address/zh-CN/area.json";
import tw_area from "@/assets/data/address/zh-TW/area.json";

 

export default {
  name: '',
  data () {
    return {
      language: null,
      header: {},
      user_uuid: null,
      c_user_uuid: null,
      type: null,  //1：添加用户  2:AI雷达入口   3：继续完善资料

      //用户状态
      user: {
        state: false, 
        perfect: true,  //功能：控制完善资料时不需要显示“我想完善他的其他资料”
        data: []
      },

      key: { 
        height: window.screen.height
      }, 

      filterData: "",

      notice: {
        time: 3000,
        data: [],
        slide: {},
        start: 0
      },

      submitColor: {},

      txtContent: "",

      radarAnalysis: {
        c_user_uuid: "",
        type: null, //0:查看他的资料   1:分析推荐（一） 2:分析推荐（二）
        from: this.$route.query.type,
        search: window.location.search,
        data: [],
        info: {}
      },

      //问题
      question: {
        letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U"],  //输入框大写字母
        label: "",
        type: "",  //题目类型
        title: "",  //主题标题
        placeholder: "",
        id: "",  //题目ID
        data: []  //题目数据
      },

      //手机号区号
      mobile: {
        code: this.simply ? "+86" : "+852",
        state: false,
        title: this.simply ? "请选择区号" : "請選擇區號",
        value: null,
        slots: [
          {
            flex: 1,
            values: [
              {value: "香港 +852", id: 0},
              {value: this.simply ? "澳门 +853" : "澳門 +853", id: 1},
              {value: this.simply ? "中国大陆 +86" : "中國大陸 +86", id: 2},
              {value: this.simply ? "美国 +1" : "美國 +1", id: 3}
            ]
          }
        ],
        number: ""
      },

      //生日
      date: {
        birth: "",
        content: {
          year: "",
          month: "",
          day: ""
        },
        now: new Date(),
        state: false,
        limit: (plug.getYear() - 100) + "-01-01",
        show: 1980,
        count: 100,
        title: this.simply ? "请选择生日" : "請選擇生日",
        slots: [
          {flex: 1, values: [], defaultIndex: 0},
          {flex: 1, values: []}, 
          {flex: 1, values: []}
        ]
      },
      
      //月薪
      salary: {
        value: ""
      },

      //地址
      addr: {
        state: false,
        type: 0,  //0:省  1:市  2:县
        value: "",
        content: "",
        pos: {
          move: {
            transform: "translateX(" + 0 + "rem)",
            "-webkit-transform": "translateX(" + 0 + "rem)"
          },
          distance: 0,
          width: 0,
          w: 0,
          value: 0,
          startX: 0,
          moveX: 0,
          moveEndX: 0,
          differX: 0
        },
        p_json: this.simply ? cn_province : tw_province,
        c_json: this.simply ? cn_city : tw_city, 
        a_json: this.simply ? cn_area : tw_area,
        p_data: this.simply ? cn_province : tw_province,
        c_data: [],
        a_data: [],
        alt: this.simply ? "请选择" : "請選擇",
        txt: [
          {label: "", active: true},
          {label: "", active: false},
          {label: "", active: false}
        ],
        result: [
          {label: "", id: ""},
          {label: "", id: ""},
          {label: "", id: ""}
        ]
      }
    }
  },
  components: {
    comAgentRatar,
    'mt-popup': Popup,
    'mt-picker': Picker,
  },
  created () {
    document.title = "AI雷达";

    if (this.inApp) {
      this.$root.blueLoadingParams.show = true;
      this.$root.blueLoadingParams.bg = "#fff";
    } 

    let query = this.$route.query;

    if (!plug.valueValid(query) || !plug.valueValid(query.user_uuid)) {
      let _toast = this.simply ? "当前页面参数异常" : "當前頁面參數異常";
      this.$toast(_toast);
      return ;    
    } 

    //非添加用户需要验证c_user_uuid
    if (this.type == 1) {
      if (!plug.valueValid(query.c_user_uuid)) {
        let _toast = this.simply ? "当前页面参数异常" : "當前頁面參數異常";
        this.$toast(_toast);
        return ;    
      }      
    } 
    this.user_uuid = query.user_uuid; 
    this.c_user_uuid = query.c_user_uuid;


    this.setInitState();
    this.language = query.language;
    if (plug.system.env) {
      this.header = {
        uuid: this.user_uuid,
        token: "token"
      }
    } else {
      this.header = {
        uuid: this.user_uuid
      }
    }
    

    //判断类型
    if (query.type == "add-user") {
      this.type = 0;
    }
    let continueState = window.localStorage.getItem("continueState");
    if (query.type == "radar") {
      if (plug.valueValid(continueState) && continueState == "true") {
        window.localStorage.removeItem("continueState");
        this.user.state = true;
      } else {
        this.type = 1;
      }
    } 

    document.addEventListener('focusout', (e) => { //软键盘关闭事件
      if (this.plug.ios && !this.plug.iphone5) {
        window.setTimeout(()=> {
          document.body.scrollTop = document.body.scrollHeight + 1;
        }, 100); 
      }
    });


    //添加用户
    if (this.type == 0) {
      this.question.title = this.simply ? "他叫什么名字？" : "他叫什麽名字？";
      window.setTimeout(()=> {this.$root.blueLoadingParams.show = false;}, 1500);
      return ;
    }

    //上下栏轮播显示屏
    this.noticeAnimate();  

    //开始答题
    if (this.type == 1 && this.user.state == false) {
      this.getSubject();  //开始答题
    }

  },
  watch: {
    "salary.value": function(val, oldVal) {
      if (val.length > 0) {
        this.submitColor = {color: '#fff',background: '#007CFF','transition-duration': '500ms','-webkit-transition-duration': '500ms' };
      } else {
        this.submitColor = {};
      }
    },

    //监听获取未完成的题目分类
    "user.state": function(val, oldVal) {
      if (val) {
        this.$http.ajax({
          path: "radar/get-un-complete-subject-cate",
          type: "get",
          header: this.header,
          data: {
            c_user_uuid: this.c_user_uuid,
            language: this.language
          },
          intercept: ()=> {
            this.$root.blueLoadingParams.show = false;
          }
        }).then((res)=> {
          //业务模型  
          this.$root.blueLoadingParams.show = false;
          this.question.title = res.data.title;
          this.user.data = res.data.subject_cate;
          this.user.perfect = false;
        }); 
        this.user.state = false;
        this.type = 2;
      }
    },

    "txtContent": function(val, oldVal) {
      let content = val.replace(/\s/g, "");
      if (content.length > 0) {
        this.submitColor = {color: '#fff',background: '#007CFF','transition-duration': '500ms','-webkit-transition-duration': '500ms' };
      } else { 
        this.submitColor = {};
      }
    },
    "addr.state": function(val, oldVal) {
      if (!val) {
        this.addr.pos.move = {
          transform: "translateX(" + 0 + "rem)",
          "-webkit-transform": "translateX(" + 0 + "rem)"
        }
      }
    }
  },
  methods: { 
    //notice栏轮播特效
    noticeAnimate: function() {
      this.$http.ajax({
        path: "radar/carousel",
        type: "get",
        header: this.header, 
        data: { 
          c_user_uuid: this.c_user_uuid,
          language: this.language
        }
      }).then((res)=> {
        //业务模型 
        res.data.carousel.forEach((value, index, array)=> {
          if (value.label == "message") {
            res.data.carousel[index].title = res.data.carousel[index].title;
          }
        });
        this.notice.data = res.data.carousel;
        if (res.data.carousel.length < 2) {
          return ;
        }

        let slide = ()=> {
          let interval = window.setInterval(()=> {
            if (this.notice.start == this.notice.data.length - 1) {
              this.notice.start = 0;
            }

            //轮播过渡
            this.notice.slide = {transform: "translateY(-0.26rem)", 'transition-duration': '500ms','-webkit-transition-duration': '500ms'};

            //过渡逻辑
            window.setTimeout(()=> {
              this.notice.slide = {transform: "translateY(0)"};

              let first = this.notice.data.shift();
              this.notice.data.push(first);
            }, 500); 


            this.notice.start += 1;
          }, this.notice.time);
        };
        slide();
      });
    },


    //置空
    setInitState: function() {
      this.submitColor = {};
      this.txtContent = "";
      this.user.perfect = true;
    },
    //多选
    checkBoxHList: function(idx) {
      this.question.data[idx].active = !this.question.data[idx].active;
      if (this.question.label == "social") {
        if (idx != 2) {
          this.question.data[2].active = false;
        } else {
          this.question.data[0].active = false;
          this.question.data[1].active = false;
        }
      } 
      this.$forceUpdate();
    },

    //处理金额
    controlSI: function(e) {
      if (this.salary.value.length > 9 || this.salary.value == 0 || this.salary.value > 100000000) {
        this.salary.value = this.salary.value.slice(0,9);
        let _toast = this.simply ? "请输入1-100000000内金额" : "請輸入1-100000000內金額";
        this.$toast(_toast);
      }
    },
    keyDownSalary: function() {
      if (this.salary.value.length == 9) {
        let _toast = this.simply ? "请输入1-100000000内金额" : "請輸入1-100000000內金額";
        this.$toast(_toast);
      }
    },
    focusFormat: function() {
      this.salary.value = this.salary.value.toString().replace(/,/g, "");
    },
    blurFormat: function() {
      this.salary.value = this.salary.value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },

    //限制用户名字30字内
    controlUserName: function(e) {
      if (this.txtContent.length >= 30 && e.keyCode != 8) {
        let _toast = this.simply ? "名称不能超过30个字" : "名稱不能超過30個字";
        this.$toast(_toast);
      }
    },
    //限制公司名称
    companyName: function(e) {
      if (this.txtContent.length >= 60 && e.keyCode != 8) {
        let _toast = this.simply ? "名称不能超过60个字" : "名稱不能超過60個字";
        this.$toast(_toast);
      }
    },
    //保存用户
    saveUserName: function() {
      if (this.txtContent.length == 0) {
        return ;
      }
      this.$root.progress.info = "正在保存中";
      this.$root.progress.layer = 1;

      this.$http.ajax({
        path: "radar/add-c-user",
        type: "post",
        header: this.header,
        data: {
          nickname: this.txtContent
        },
        intercept: ()=> {
          this.$root.progress.layer = 0;
        }
      }).then((res)=> {   
        //业务模型
        this.c_user_uuid = res.data.c_user_uuid;

        this.type = 1; 
        this.getSubject();
      });
    },


    /*-------------------------------
     *-------------------------------
     *@:获取题库
     *-------------------------------
     *-------------------------------*/
    getSubject: function(cate, type) {
      let submitData = {
        c_user_uuid: this.c_user_uuid,
        language: this.language
      };

      //完善资料 | 社交（cate:1）、生活（cate:2）、家庭（cate:3）、健康（cate:4）、工作（cate:5）
      if (this.type == 2) {
        submitData.cate = cate;  //对应每个分类
      } 
      if (this.type == 1 && type != undefined && type == 1) {
        if (this.filterData != "") {
          this.filterData += "," + this.question.id;
        } else {
          this.filterData = this.question.id;
        }
        submitData.ignore = this.filterData;
      }
      if (!plug.valueValid(this.filterData)) {
        submitData.ignore = "";
      }

      this.$http.ajax({
        timeout: 5000,
        path: "radar/get-subject",
        type: "post",
        header: this.header, 
        data: submitData,
        intercept: ()=> {
          window.setTimeout(()=> {this.$root.blueLoadingParams.show = false;}, 1500);
        }
      }).then((res)=> { 
        this.setInitState();
        window.setTimeout(()=> {this.$root.blueLoadingParams.show = false;}, 1500);
        this.$root.progress.layer = 0;
        
        if (this.type == 2) {
          this.type = 1;
        }

        //全部答完了
        if (res.data.is_complete == 1) {
          this.analyse(1);
          return ;
        }

        //选择“跳过”，返回无题库
        if (!plug.objectValue(res.data.subject)) {
          this.analyse(0);
          return ;
        }

        //未答完
        if (res.data.subject.label == "company") {
          this.question.placeholder = this.simply ? "请输入公司名称" : "請輸入公司名稱";
        }
        this.question.label = res.data.subject.label;
        this.question.type = res.data.subject.type;
        this.question.title = res.data.subject.title;
        this.question.id = res.data.subject.uuid;
        
        if (plug.valueValid(res.data.subject.options) && res.data.subject.options.length > 0) {
          this.question.data = res.data.subject.options;
          res.data.subject.options.forEach((value, index, array)=> {
            this.question.data[index].active = false;
          });        
        }

      });
    },






    /*-------------------------------
    *-------------------------------
    *@:提交选项
    *-------------------------------
    *-------------------------------*/
    submitItemData: function(type, id, otherArgs) {
      let submitData = {
        c_user_uuid: this.c_user_uuid,
        subject_uuid: this.question.id,
        language: this.language,
        ignore: this.filterData
      };


      //单选
      if (type == "1") {
        submitData.option_uuid = id;
      }

      //多选
      if (type == "2") {
        let item = "";
        this.question.data.forEach((value, index, array)=> {
          if (value.active == true) {
            item += "," + value.uuid;
          } 
        });
        submitData.option_uuid = item.replace(/^\,/i, "");
      }

      //文本
      if (type == "3") {
        submitData.content = this.txtContent;
      }

      //生日
      if (type == "4") {
        submitData.birthday = this.date.birth;
        if (plug.getUrlKey(submitData.birthday)) {
          let _toast = this.simply ? "请选择生日" : "請選擇生日";
          this.$toast(_toast);
          return ;
        }
      }

      //地址
      if (type == "5") {
        submitData.province = this.addr.result[0].id;
        submitData.city = this.addr.result[1].id; 
        submitData.district = this.addr.result[2].id;

        if (plug.getUrlKey(submitData.province) || plug.getUrlKey(submitData.city) || plug.getUrlKey(submitData.district)) {
          let _toast = this.simply ? "请选择地址" : "請選擇地址";
          this.$toast(_toast);
          return ;
        }
      }

      //月薪
      if (type == "6") {
        submitData.salary = this.salary.value.replace(/,/g, "");
        submitData.salary = submitData.salary.replace(/\s/g, "");
        if (submitData.salary == 0 || submitData.salary > 100000000 || submitData.salary.length > 9) {
          let _toast = this.simply ? "请输入1-100000000内金额" : "請輸入1-100000000內金額";
          this.$toast(_toast);
          return ;
        }
      }

      //区号
      if (type == "7") {
        submitData.mobile_pre = this.mobile.code.replace("+", "");
        submitData.mobile = this.mobile.number;
        let length = submitData.mobile_pre.length;
        if (length == 3 && submitData.mobile.length != 8) {
          let _toast = this.simply ? "手机号码格式错误" : "手機號碼格式錯誤";
          this.$toast(_toast);
          return ;
        }
        if (length == 2 && submitData.mobile.length != 11) {
          let _toast = this.simply ? "手机号码格式错误" : "手機號碼格式錯誤";
          this.$toast(_toast);
          return ;
        }
        if (length == 1 && submitData.mobile.length != 11) {
          let _toast = this.simply ? "手机号码格式错误" : "手機號碼格式錯誤";
          this.$toast(_toast);
          return ;
        }
      }


      //提交数据
      this.$http.ajax({
        path: "radar/submit",
        type: "post",
        header: this.header,
        data: submitData
      }).then((res)=> {
        this.setInitState();

        //您和他是什麼關係呢?  且符合D选项
        if (this.question.label == "relation" && otherArgs == "relation_D") {

          //判断该用户是否有转发来源，!plug.objectValue(res.data.root_c_user)为true，则无转发来源，跳转至-----AI分析推荐（一）
          if (!plug.objectValue(res.data.root_c_user)) {
            this.analyse(0);
            return ;
          }

          //转至-分享路径页面-查看资料
          this.radarAnalysis.type = 0;
          this.radarAnalysis.c_user_uuid = this.c_user_uuid;
          this.radarAnalysis.info = res.data.root_c_user;
          this.radarAnalysis.data = [];
          //处理数据格式
          this.radarAnalysis.data = JSON.stringify(this.radarAnalysis.data);
          this.radarAnalysis.info = JSON.stringify(this.radarAnalysis.info);

          
          this.$router.push({
            path: "analysis",
            query: {
              params: JSON.stringify(this.radarAnalysis)
            }
          });

          return ;
        }


        //全部答完了
        if (res.data.is_complete == 1) {
          this.analyse(1);
          return ;
        }

        //选择“跳过”，返回数据为没有剩余题库
        if (!plug.objectValue(res.data.subject)) {
          this.analyse(0);
          return ;
        }

        //未答完 

        if (res.data.subject.label == "company") {
          this.question.placeholder = this.simply ? "请输入公司名称" : "請輸入公司名稱";
        }
        this.question.label = res.data.subject.label;
        this.question.type = res.data.subject.type;
        this.question.title = res.data.subject.title;
        this.question.id = res.data.subject.uuid;

        if (plug.valueValid(res.data.subject.options) && res.data.subject.options.length > 0) {
          this.question.data = res.data.subject.options;
          res.data.subject.options.forEach((value, index, array)=> {
            this.question.data[index].active = false;
          });         
        }

      });
    },


    //立即分析
    analyse: function(origin) {
      this.$root.progress.info = this.simply ? "分析数据中" : "分析數據中";
      this.$root.progress.layer = 1;

      this.$http.ajax({
        path: "radar/analyse",
        type: "get",
        header: this.header,
        data: {
          c_user_uuid: this.c_user_uuid,
          language: this.language
        },
        intercept: ()=> {
          this.$root.progress.layer = 0;
          this.$root.blueLoadingParams.show = false;
        }
      }).then((res)=> {
        //业务模型 
        this.$root.progress.layer = 0;
        this.$root.blueLoadingParams.show = false;

         
        if (origin == 0) {  //单击“立即分析”按钮 - 进入   分析推荐（一）
          this.radarAnalysis.type = 1;
          
        } else {  //如果答完题 - 进入   分析推荐（二）
          this.radarAnalysis.type = 2;
        }
        
        //H5分析推荐
        this.radarAnalysis.c_user_uuid = this.c_user_uuid;
        this.radarAnalysis.info = {};
        this.radarAnalysis.data = res.data.analysis;
        //处理数据格式
        this.radarAnalysis.info = JSON.stringify(this.radarAnalysis.info);
        this.radarAnalysis.data = JSON.stringify(this.radarAnalysis.data);


        this.$router.push({
          path: "analysis",
          query: {
            params: JSON.stringify(this.radarAnalysis)
          }
        });

      });
    }, 



    //地址
    selectAddrPicter: function() {
      this.addr.txt.forEach((value, index, array)=> {
        this.addr.txt[index].label = "";
        this.addr.txt[index].active = false;
      });

      this.addr.type = 0; 

      this.addr.txt[0].label = this.addr.alt;
      this.addr.txt[0].active = true;

      this.addr.state = true;  
    },
    selectAddrNav: function(index) {
      this.addr.txt.forEach((value, index, array)=> {
        this.addr.txt[index].active = false;
      });
      this.addr.txt[index].active = true;
      this.addr.type = index;

      if (index == 0) {

        return ;
      }
      if (index == 1) {

        return ;
      }
    },
    selectAddrItem: function(name, id) {
      this.addr.result[this.addr.type].label = name; 
      this.addr.result[this.addr.type].id = id; 

      //省-
      if (this.addr.type == 0) {
        this.addr.txt[0].label = name; 
        this.addr.txt[0].active = false;

        this.addr.c_data = this.addr.c_json[id];

        this.addr.content = name;

        this.addr.txt[1].label = this.addr.alt; 
        this.addr.txt[1].active = true;
        this.addr.type = 1;  

        this.addr.txt[2].label = ""; 
        this.addr.txt[2].active = false; 

        return ;
      }
      
      //市-
      if (this.addr.type == 1) {
        this.addr.txt[1].label = name; 
        this.addr.txt[1].active = false; 

        this.addr.content += "-" + name;

        //只有二级
        if (!plug.valueValid(this.addr.a_json[id])) {
          this.addr.value = this.addr.content;

          this.addr.state = false;
          this.submitColor = {color: '#fff',background: '#007CFF','transition-duration': '500ms','-webkit-transition-duration': '500ms' };  
          return ;
        }
        
        this.addr.a_data = this.addr.a_json[id];

        this.addr.txt[2].label = this.addr.alt; 
        this.addr.txt[2].active = true;

        this.addr.type = 2; 

        return ;
      } 

      //县-
      if (this.addr.type == 2) {
        this.addr.txt[2].label = name; 
        this.addr.txt[2].active = false; 

        this.addr.content += "-" + name;
        this.addr.value = this.addr.content;

        this.addr.state = false;
        this.submitColor = {color: '#fff',background: '#007CFF','transition-duration': '500ms','-webkit-transition-duration': '500ms' };  
      }
    },
    //滑动
    startHandle: function(e) {
      this.addr.pos.width = this.$refs.addrToolBar.getBoundingClientRect().width;
      this.addr.pos.w = this.$refs.addrToolMove.getBoundingClientRect().width;
      this.addr.pos.distance = (this.addr.pos.w - this.addr.pos.width) / this.fontSize.replace("px", "");;

      this.addr.pos.startX = e.touches[0].pageX;
      this.addr.pos.moveX = 0;
    },
    moveHandle: function(e) {
      if (this.addr.pos.distance <= 0) {
        return ;
      }

      this.addr.pos.moveEndX = e.touches[0].pageX;

      //Y轴偏移位置
      this.addr.pos.moveX = this.addr.pos.moveEndX - this.addr.pos.startX;

      //将px转换为rem
      let moveValue = this.addr.pos.moveX / this.fontSize.replace("px", "");

      //及时更新位置
      this.addr.pos.differX = this.addr.pos.value + moveValue;

      //右移
      if (this.addr.pos.moveX > 0) {
        if (this.addr.pos.value <= 0) {
          //this.addr.pos.differX = 0;
        }
      } 
      //左移
      else {
        
      }

      this.addr.pos.move = {
        transform: "translateX(" + this.addr.pos.differX + "rem)",
        "-webkit-transform": "translateX(" + this.addr.pos.differX + "rem)"
      }
    },
    endHandle: function(e) {
      if (this.addr.pos.distance <= 0) {
        return ;
      }
      if (this.addr.pos.differX > 0) {
        this.addr.pos.move = {
          transform: "translateX(" + 0 + "rem)",
          "-webkit-transform": "translateX(" + 0 + "rem)",
          "transition-duration": "300ms", 
          "-webkit-transition-duration": "300ms"
        }
        //重置 
        this.addr.pos.value = 0;
        this.addr.pos.moveEndX = 0;
        this.addr.pos.differX = 0;
        return ;
      }
      if (this.addr.pos.differX < -this.addr.pos.distance) {
        this.addr.pos.move = {
          transform: "translateX(" + -this.addr.pos.distance + "rem)",
          "-webkit-transform": "translateX(" + -this.addr.pos.distance + "rem)",
          "transition-duration": "300ms", 
          "-webkit-transition-duration": "300ms"
        }
        //重置 
        this.addr.pos.value = -this.addr.pos.distance;
        this.addr.pos.moveEndX = 0;
        this.addr.pos.differX = 0;
        return ;       
      }

      //重置
      this.addr.pos.value = this.addr.pos.differX;  
      
      this.addr.pos.moveEndX = 0;
      this.addr.pos.differX = 0;
    },



    //生成年份
    dealDate: function() {
      let limit = this.date.limit.split("-");
      let year = plug.getYear();
      let month = plug.getMonth();
      let day = plug.getDate();

      //重置序次
      this.date.slots[0].defaultIndex = year - this.date.show;

      this.date.slots[0].values = [];
      for (let i = year; i > limit[0] - 1; i--) {
        this.date.slots[0].values.push(i + "年");
      }
 
      this.date.content = {
        year: this.date.slots[0].values[this.date.slots[0].defaultIndex].replace("年", ""),
        month: "01",
        day: "01"
      };
    }, 
    selectDatePicter: function() {
      this.date.state = true; 
    },
    onDateChange: function(value) { 
      this.dealDate(); 

      if (plug.valueValid(value.getSlotValue(0))) {
        this.date.content.year = value.getSlotValue(0).replace("年", "");
      } 
      if (plug.valueValid(value.getSlotValue(1))) {
        let month = value.getSlotValue(1).replace("月", "");
        this.date.content.month = month > 9 ? month : "0" + month;
      }
      if (plug.valueValid(value.getSlotValue(2))) { 
        let day = value.getSlotValue(2).replace("日", "")
        this.date.content.day = day > 9 ? day : "0" + day;
      }

      //this.date.now
      if (!plug.valueValid(value.getSlotValue(0)) && !plug.valueValid(value.values[0])) {
        return ;
      }
      let year = !plug.valueValid(value.getSlotValue(0)) ?  value.values[0].replace("年", "") : value.getSlotValue(0).replace("年", "");

      //根据当年生成月份
      this.date.slots[1].values = []; 
      if (year != plug.getYear(this.date.now)) {
        for (let i = 1; i <= 12; i++) {
          this.date.slots[1].values.push(i + "月");
        }
      } else {
        let month = plug.getMonth(this.date.now);
        for (let i = 1; i <= month + 1; i++) { 
          this.date.slots[1].values.push(i + "月");
        } 
      }

      //生成日
      let month = !plug.valueValid(value.getSlotValue(1)) ? value.values[1].replace("月", "") : value.getSlotValue(1).replace("月", "");
      let date = new Date();
      date.setYear(year); 
      date.setMonth(month); 
      date.setDate(0); 
      this.date.slots[2].values = [];
      if (year != plug.getYear(this.date.now)) {
        for (let i = 0; i < plug.getDate(date); i++) {
          let _day = i + 1;
          this.date.slots[2].values.push(_day + "日");
        }
      } else {
        if (month != plug.getMonth(this.date.now) + 1) {
          for (let i = 0; i < plug.getDate(date); i++) {
            let _day = i + 1;
            this.date.slots[2].values.push(_day + "日");
          }
        } else {
          for (let i = 0; i < plug.getDate(this.date.now); i++) {
            let _day = i + 1;
            this.date.slots[2].values.push(_day + "日");
          }
        }
      }

    },
    confirmDate: function() {
      let date = "";
      for (let i in this.date.content) {
        date += this.date.content[i] + "-";
      }
      this.date.birth = date.replace(/-$/g, ""); 
      this.submitColor = {color: '#fff',background: '#007CFF','transition-duration': '500ms','-webkit-transition-duration': '500ms'};
      this.date.state = false; 
    },
    cancelDate: function() {
      this.date.state = false; 
    },


    keyPhone: function() {
      this.mobile.number = this.mobile.number.replace(/\s/g, "");
      if (this.mobile.number.length > 0) {
        this.submitColor = {color: '#fff',background: '#007CFF','transition-duration': '500ms','-webkit-transition-duration': '500ms'};
      } else {
        this.submitColor = {};
      }
    },

    //我想完善他的其他資料
    replenish: function() { 
      this.user.state = true;
    },
 

    //选择区号
    selectCode: function() {
      this.mobile.state = true;
      this.submitColor = {color: '#fff',background: '#007CFF','transition-duration': '500ms','-webkit-transition-duration': '500ms' };
    },
    cancel: function() { 
      this.mobile.state = false;
    },  
    confirm: function() { 
      this.mobile.code = "+" + this.mobile.value.value.split("+")[1];
      this.mobile.state = false;   
    },
    onCodeChange: function(picker, values) {
      if (values[0] != undefined) {
        this.mobile.value = values[0];
      }
    },

    //返回上一页  
    backWindow: function() {
      if (plug.iphonex) {
        //alert(this.$route.query.type);
      }
      postMessage(JSON.stringify({
        type: "close", 
        data: {
          from: this.$route.query.type
        }
      }));
    }
  }
}