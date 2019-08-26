// import Vue from 'vue';
import { Spinner } from 'mint-ui';
// Vue.component(Spinner.name, Spinner);


import CommonJS from '@/components/shared/service/common.js'; 
import agn from "./agent.js";

//幻灯片
import '@/assets/library/slide.js';


import comTempletMdrt from "@/components/component/com_templet_mdrt.vue";
import comTempletName from "@/components/component/com_templet_name.vue";
import comTempletAlbum from "@/components/component/com_templet_album.vue";
import comTempletHswipe from "@/components/component/com_templet_hswipe.vue";


export default {
  name: "",
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
      gestureLeft: true,
      slideCount: 1,

      comTMDRTdata: {  //MDRT
        layer: 0,
        name: "comTMDRTdata",
        type: "a-a-m",
        level: null
      },
      comTNdata: {  //实名认证
        layer: 0,
        name: "comTNdata",
        type: "a-a-m"
      },
      comTAData: {  //相册
        layer: 0, 
        name: "comTAData",
        imgArray: [],
        index: 0
      },

      praise: {state: false, handle: false},
      comTHdata: {
        object: this,
        name: "comTHdata",
        type: "a-a-m",
        agent: {}
      },
      scroll: {
        profile: false,
        experience: false,
        honor: false,
        album: false
      },

      more: {state: false, stop: false, page: 2, request: false}
    }
  },
  beforeCreate () {
    agn.beforeDeclare(this);
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

    getSlideCount(index) {
      if (plug.valueValid(index)) {
        this.gestureLeft = false;
      }
    },
    scrollHandle: function(e) {
      let name = e.srcElement['dataset']['class'];
      if (e.srcElement.scrollTop > 0) {
        this.scroll[name] = true;
        return ;
      }
      this.scroll[name] = false;
    },
    showMdrt: function() {
      this.comTMDRTdata.layer = 1;
    },
    showName: function() {
      this.comTNdata.layer = 1;
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
    //动态设置图片属性
    loadImgHandle: function(refId, imgUrl, index, c_index) {
      let obj = refId;
      obj = new Image();
      obj.src = imgUrl;
      obj.onload = ()=> {
        if (obj.width > obj.height) {
          this.agent.photos[index].photo_list[c_index].setbg = "auto 100%";
        } else {
          this.agent.photos[index].photo_list[c_index].setbg = "100% auto";
        }
        this.agent.photos[index].photo_list[c_index].state = true;
      }  
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
          this.comTHdata.agent = res.data;
          this.agent.baseInfo.avatarLimit = res.data.baseInfo.avatar + "!thumb-750";
  
          plug.sendAgentShare(this.share, "personal_home_page");
          window.setTimeout(()=> {
            this.$root.pageLoading.layer = 0;
            this.$root.blueLoadingParams.show = false;
          }, 200);

          /*
          *@判断模板
          **/
          if (plug.valueValid(this.agent.baseInfo.signature)) {  //个性签名
            this.slideCount ++;
          }
          if (plug.valueValid(this.agent.baseInfo.abstract)) {  //个人简介
            this.slideCount ++;
          }
          if (this.agent.workExperience.length > 0) {  //从业经历
            this.slideCount ++;
          }
          if (this.agent.honors.length > 0) {  //个人荣誉
            this.slideCount ++;
          }
          if (this.agent.photos.length > 0) {  //个人相簿
            this.slideCount ++;
          }
         console.log(this.slideCount);

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