// import Vue from 'vue';
import { Spinner } from 'mint-ui';
// Vue.component(Spinner.name, Spinner);


import CommonJS from '@/components/shared/service/common.js'; 
import agn from "./agent.js";


import comTempletMdrt from "@/components/component/com_templet_mdrt.vue";
import comTempletName from "@/components/component/com_templet_name.vue";
import comTempletAlbum from "@/components/component/com_templet_album.vue";
import comTempletHswipe from "@/components/component/com_templet_hswipe.vue";


export default {
  name: "a-a-n",
  data: function() {
    return {
      wxixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,
      user_uuid: null,
      user_homepage_template_uuid: null,
      mdrt: {
        state: null,
        level: null
      },
      share: {
        type: 'news',
        title: "",
        thumbImage: "",
        desc: this.simply ? "极致服务，卓越专属的保险咨询顾问" : "極致服務，卓越專屬的保險諮詢顧問",
        isReport: true, // 分享上报，不上报可不传
        target_type: 15,
        url: null,
        link: null,
        user_homepage_template_uuid: null,
        user_uuid: this.user_uuid,
        router: window.location.pathname
      },
      agent: {
        baseInfo: {},
        workExperience: {},
        photos: {},
        honors: {}
      },
      comTMDRTdata: {  //MDRT
        layer: 0,
        name: "comTMDRTdata",
        type: "a-a-n",
        level: null
      },
      comTNdata: {  //实名认证
        layer: 0,
        name: "comTNdata",
        type: "a-a-n"
      },
      comTAData: {  //相册
        layer: 0, 
        name: "comTAData",
        imgArray: [],
        index: 0
      },
      
      praise: {state: false, handle: false},
      scroll: {
        state: false,
        object: null
      },
      comTHdata: {
        object: this,
        name: "comTHdata",
        type: "a-a-n",
        agent: {}
      },
      list: [ 
        {id: 0, show: false, text: this.simply ? "简介" : "簡介", active: true, ref: "profile"},
        {id: 1, show: false, text: this.simply ? "履历" : "經驗", active: false, ref: "experience"},
        {id: 2, show: false, text: this.simply ? "荣誉" : "榮譽", active: false, ref: "honor"},
        {id: 3, show: false, text: this.simply ? "相簿" : "相簿", active: false, ref: "album"}
      ],
      column: {
        state: false
      },

      nick: {
        state: false,
        list: []
      },
      more: {state: false, stop: false, page: 2, request: false}
    } 
  }, 
  beforeCreate () {
    agn.beforeDeclare(this);
  },
  mounted() {
    this.$nextTick(()=> {
      let interval = window.setInterval(()=> {
        if (this.nick.state) {
          let str = this.nick.list[0] || "";
          let english = str.search(/\w/);
          //let china = str.search(/[\u4e00-\u9fa5]/);
          let china = str.search(/\W/);
          console.log('english: ' + english + '--/--' + china);
          
          let array = [];
          //仅仅含有中文、非中文
          if (english == -1 || china == -1) {
            window.clearInterval(interval);
            return ;
          }
          //以非中文为起始
          if (english == 0 && china != -1) {
            array.push(str.substr(0, china));
            array.push(str.substr(china));

            this.nick.list = array;
            return ;
          } 
          //以中文为起始
          if (english != -1) {
            array.push(str.substr(0, english));
            array.push(str.substr(english));
          }
          this.nick.list = array;
          window.clearInterval(interval); 
          return ;
        }
      }, 200);
      
    });
  }, 
  created () {
    this.initData();
    this.getData();

    this.$root.pageLoading.callback = (self)=> {
      this.$root.pageLoading.layer = 0;
      this.initData();
      this.getData();
    }
  },
  methods: { 
    calcBottom(value) {
      return value * this.font_size;
    },
    loadMore() { 
      agn.getMoreData(this);
    },
    
    scrollHandle: function(e) {
      let column = this.$refs.column.getBoundingClientRect();
      let height = column.height;
      let off = plug.getElDocument(this.$refs.column);
      let top = e.target.scrollTop;

      let data = [
        {ref: "profile", y: plug.getElDocument(this.$refs['profile'])},
        {ref: "experience", y: plug.getElDocument(this.$refs['experience'])},
        {ref: "honor", y: plug.getElDocument(this.$refs['honor'])},
        {ref: "album", y: plug.getElDocument(this.$refs['album'])}
      ]; 

      if (column.y <= 10) {
        this.column.state = true; 
      }
      if (top < off) {
        this.column.state = false;
      }
      //滚动
      this.list.forEach((value, index, array)=> {
        this.list[index].active = false;
      });

      if (top >= data[3]['y'] - height) {
        this.list[3].active = true;
        return ;
      }
      if (top >= data[2]['y'] - height) {
        this.list[2].active = true;
        return ;
      }
      if (top >= data[1]['y'] - height) {
        this.list[1].active = true;
        return ;
      }
      this.list[0].active = true;
    },
    changeList: function(e) {
      let scrollTop = this.$refs.scroll.scrollTop;

      let id = e['currentTarget']['dataset']['id'];
      this.list.forEach((value, index, array)=> {
        this.list[index].active = false;
      });
      this.list[id].active = true;


      let object = this.$refs[this.list[id]['ref']];
      let column = object.offsetTop;
      //console.log(column);
      
      let height = this.$refs.column.getBoundingClientRect().height;
      //移动位置 
      let top = plug.getElDocument(object) - height;

      let differ = top - scrollTop;

      let interval = window.setInterval(()=> {
        //上滑行为
        if (differ > 0) {
          scrollTop += Math.ceil(differ/5);
          if (scrollTop > top) {  
            scrollTop = top;
            window.clearInterval(interval);
          }
        } 
        //下滑行为
        else {
          scrollTop -= Math.ceil(-differ/5);
          if (scrollTop < top) {  
            scrollTop = top;
            window.clearInterval(interval);
          }
        }
        this.$refs.scroll.scrollTop = scrollTop + 10;
      }, 20);

    },
    //动态设置图片属性
    loadImgHandle: function(refId, imgUrl, index, c_index) {
      agn.setImgAttr(this, refId, imgUrl, index, c_index); 
    },
    showMdrt: function() {
      this.comTMDRTdata.layer = 1;
    },
    showName: function() {
      this.comTNdata.layer = 1;
    },
    approval: function() {
      plug.approval({
        object: this,
        approval: {user_homepage_template_uuid: this.user_homepage_template_uuid, user_uuid: this.user_uuid}
      });
    },
    consultAgent: function() {
      if (this.inApp) {
        return ; 
      }
      agn.consultAgent({ 
        object: this,
        user_uuid: this.user_uuid,
        answer_uuid: this.user_homepage_template_uuid,
        from_type: "15",
        wechat_num: this.agent.baseInfo.wechat_num, 
        qrcode: this.agent.baseInfo.wx_qrcode_content
      }); 
    },
    openAlbum: function(url, index) {
      if (this.inApp) {
        plug.getAgentAlbum(url, index);
        return ;
      } 
      if (plug.wx.platform) {
        plug.wxAlbum(url, index);
        return ;
      }
      this.comTAData.imgArray = url;
      this.comTAData.index = index;
      this.comTAData.layer = 1;
    },
    initData: function() {
      if (plug.valueValid(this.$route.query.in_app) && this.$route.query.in_app == 1) {
        this.inApp = true; 
      }
      if (!plug.valueValid(this.$route.query.in_app) && plug.valueValid(this.urlParams) && this.urlParams.in_app == 1) {
        this.inApp = true;
      }
      if (this.inApp) {
        this.$root.blueLoadingParams.show = true;
        this.$root.blueLoadingParams.bg = "#fff";
      } else {
        this.$root.pageLoading.layer = 1;
      }

      //获取Agent ID
      if (!plug.valueValid(this.urlParams)) {
        let query = this.$route.query;
        if (!plug.valueValid(query) || !plug.valueValid(query.user_uuid)) {
          this.$root.pageLoading.layer = 2;
          return ;  
        }
        this.user_uuid = this.$route.query.user_uuid; 
        this.user_homepage_template_uuid = this.$route.query.user_homepage_template_uuid;
      } else {
        this.user_uuid = this.urlParams.user_uuid; 
        this.user_homepage_template_uuid = this.urlParams.user_homepage_template_uuid;
      }

      // 分享参数
      this.share.user_uuid = this.user_uuid;
      this.share.user_homepage_template_uuid = this.user_homepage_template_uuid;

      //分享URL 
      let exUrl = plug.getAgentPath() + "?user_uuid=" + this.user_uuid + "&user_homepage_template_uuid=" + this.user_homepage_template_uuid;
      this.share.link = plug.exchangeUrl(exUrl); 
  
      this.share.url =  window.location.origin + window.location.pathname + "?user_uuid=" + this.user_uuid + "&user_homepage_template_uuid=" + this.user_homepage_template_uuid + "&target_type=" + this.share.target_type + "&one_way=" + this.user_uuid;

    },
    getData: function() {
      agn.getTemplData({ 
        object: this,
        callback: (res)=> {
          this.mdrt.state = res.data.baseInfo.mdrt;
          this.mdrt.level = res.data.baseInfo.mdrt_level;
          this.comTMDRTdata.level = res.data.baseInfo.mdrt_level;

          //设置标题
          let title = agn.setTitle(this.simply,res.data.baseInfo.nickname, res.data.baseInfo.mobile1);

          //点赞状态
          this.praise.state = res.data.approval == 1 ? true : false;

          this.share.title = title;
          this.share.thumbImage = res.data.baseInfo.share_avatar;
          this.share.desc = plug.shareAgentHome(this.simply, res.data.baseInfo.abstract);

          // 浏览上报
          !this.inApp && CommonJS.readReport(this.share);
          CommonJS.initWX(this.share);

          res.data.photos.forEach((value, index, array)=> {
            for (let i = 0; i < value.photo_list.length; i++) {
              res.data.photos[index].photo_list[i].setbg = ""; 
              res.data.photos[index].photo_list[i].state = false;
              res.data.photos[index].photo_list[i].ref = "img" + index + "id" + i;
              res.data.photos[index].photo_list[i].src = res.data.photos[index].photo_list[i].url + "?x-oss-process=image/resize,w_300";
              if (plug.iphone5) {
                res.data.photos[index].photo_list[i].url += "?x-oss-process=image/resize,w_500";
              }
            }
          });

          this.agent = res.data; 
          this.nick.list.push(res.data.baseInfo.nickname);
          this.nick.state = true;

          this.comTHdata.agent = res.data; 
          this.agent.baseInfo.avatarLimit = res.data.baseInfo.avatar + "!thumb-750";

          this.list[0].show = plug.valueValid(this.agent.baseInfo.abstract);
          this.list[1].show = this.agent.workExperience.length > 0;
          this.list[2].show = this.agent.honors.length > 0;
          this.list[3].show = this.agent.photos.length > 0;

          plug.sendAgentShare(this.share, "personal_home_page");
          window.setTimeout(()=> {
            this.$root.pageLoading.layer = 0;
            this.$root.blueLoadingParams.show = false;
          }, 200);

        }
      }); 
    }
  },
  components: {
    comTempletMdrt,
    comTempletName,
    comTempletAlbum,
    comTempletHswipe,
    'mt-spinner': Spinner,
  }
}