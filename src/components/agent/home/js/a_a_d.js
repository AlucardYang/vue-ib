// import Vue from 'vue';
import { Spinner } from 'mint-ui';
// Vue.component(Spinner.name, Spinner);


import CommonJS from '@/components/shared/service/common.js';
import agn from "./agent.js";

import comAgentAvatar from "@/components/component/com_agent_avatar.vue";
import comAgentAlbum from "@/components/component/com_agent_album.vue";
import comAgentAuth from "@/components/component/com_agent_oauth.vue";

import LikeBtn from "@/components/shared/component/card/likebtn.vue";


export default {
  name: '',
  data: function() {
    return {
      wxixm: (navigator.userAgent.toLowerCase().match(/iphone/) != null && navigator.userAgent.toLowerCase().match(/micromessenger/) != null && window.screen.height == 812 && window.screen.width == 375) && (window.screen.height - document.documentElement.clientHeight) < 120,

      user_uuid: null,
      user_homepage_template_uuid: null,
      sappUuid: this['urlParams'] ? this['urlParams']['sapp_uuid'] : (this.$route.query['sapp_uuid'] ? this.$route.query['sapp_uuid']: 'b05ff214ad59251c404e9516b8a5461d'),
      code: null,
      mphone: null,

      mdrt: {
        state: null,
        level: null
      },
      comAARData: {
        layer: 0, 
        name: "comAARData",
        id: "",
        qr_url: ""
      },
      comAAMData: {
        layer: 0, 
        name: "comAAMData",
        imgArray: [],
        index: 0
      },
      comAAHData: {
        layer: 0, 
        name: "comAAHData",
        state: 0
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

      analyze: {
        wechat_share_time: '',
        facebook_share_time: '',
        approval: 0, // 点赞状态
        share_list: [], // 分享列表
        card: {},
        focus: [], // 主题特点
        focus_article: [] // 推荐文章
      }, 

      agent: {
        baseInfo: {},
        workExperience: {},
        photos: {},
        honors: {}
      },
      directionTop: true,

      animateTop: {
        transform: "translateY(3.75rem)",
        "-webkit-transform": "translateY(3.75rem)"
      },
      pos: {
        defalutVal: 3.75,
        value: 3.75,
        startY: 0,
        moveY: 0,
        moveEndY: 0,
        differY: 0
      },
      animateScroll: "",
      titleAnimate: {
        opacity: 0,
        transform: "translateY(-.44rem)",
        "-webkit-transform": "translateY(-.44rem)"
      },
      bannerOpacity: {
        opacity: 1
      },

      more: {state: false, stop: false, page: 2, request: false}
    }
  },
  components: { 
    comAgentAvatar,
    comAgentAlbum,
    comAgentAuth,
    LikeBtn,
    'mt-spinner': Spinner,
  },
  watch: {
    "pos.defalutVal": function(val, oldVal) {
      //触顶  
      if (val == 1.1) {
        this.titleAnimate = {
          opacity: 1,
          transform: "translateY(0)", 
          "-webkit-transform": "translateY(0)",
          "transition-duration": "300ms", 
          "-webkit-transition-duration": "300ms"
        }; 
        this.animateScroll = "com-scroll-y";
        this.directionTop = false;
      } else {
        this.titleAnimate = {
          opacity: 0,
          transform: "translateY(-.44rem)",  
          "-webkit-transform": "translateY(-.44rem)",
          "transition-duration": "300ms", 
          "-webkit-transition-duration": "300ms"
        };
        this.animateScroll = "";
        this.directionTop = true;
      }
      this.bannerOpacity.opacity = (val - 1.1) / (3.75 - 1.1);
    }
  },
  methods: { 
    calcBottom(value) {
      return value * this.font_size;
    },
    loadMore() { 
      agn.getMoreData(this);
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

    
    startHandle: function(e) {
      this.pos.startY = e.touches[0].pageY;
      this.pos.moveY = 0;
    },
    moveHandle: function(e) { 
      //阻止冒泡事件
      if (plug.bubble(e)) {
        return ; 
      }

      if (this.$refs.scrollFrame.scrollTop > 0) {
        return ;
      }
      this.pos.moveEndY = e.touches[0].pageY;

      //Y轴偏移位置
      this.pos.moveY = this.pos.moveEndY - this.pos.startY;

      //将px转换为rem
      let moveValue = this.pos.moveY / this.fontSize.replace("px", "");

      //及时更新位置
      this.pos.differY = this.pos.value + moveValue;
      if (this.pos.differY < 1.1) {
        this.pos.differY = 1.1;
      }
      if (this.pos.differY > 3.75) {
        this.pos.differY = 3.75; 
      } 
      this.pos.defalutVal = this.pos.differY;
      this.animateTop = {
        transform: "translateY(" + this.pos.differY + "rem)",
        "-webkit-transform": "translateY(" + this.pos.differY + "rem)"
      }
    }, 
    endHandle: function(e) {
      //阻止冒泡事件
      if (plug.bubble(e)) {
        return ; 
      }

      if (this.$refs.scrollFrame.scrollTop > 0) {
        return ;
      } 
      let val = this.pos.moveEndY - this.pos.startY;
      //下移
      if (val > 0) {
        this.animateTop = {
          transform: "translateY(" + 3.75 + "rem)",
          "-webkit-transform": "translateY(" + 3.75 + "rem)",
          "transition-duration": "300ms", 
          "-webkit-transition-duration": "300ms"
        }
        this.pos.differY = 3.75;
      } 
      //上移
      else {
        this.animateTop = {
          transform: "translateY(" + 1.1 + "rem)", 
          "-webkit-transform": "translateY(" + 1.1 + "rem)",
          "transition-duration": "300ms", 
          "-webkit-transition-duration": "300ms"
        }
        this.pos.differY = 1.1;
      }

      //重置  
      this.pos.defalutVal = this.pos.differY;
      this.pos.value = this.pos.differY;
      this.pos.moveEndY = 0;
      this.pos.differY = 0;
    },

    openAuth: function(state) {
      this.comAAHData.state = state;
      this.comAAHData.layer = 1;
    },
    openAvatar: function(state) {
      if (this.inApp) {
        plug.getAgentAlbum(this.agent.baseInfo.avatar, 0);
        return ;
      }
      if (plug.wx.platform) {
        plug.wxAlbum(this.agent.baseInfo.avatar, 0);
        return ;
      }
      this.comAARData.url = this.agent.baseInfo.avatar;
      this.comAARData.layer = 1;
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
      this.comAAMData.imgArray = url;
      this.comAAMData.index = index;
      this.comAAMData.layer = 1;
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
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.comAAHData.layer > 0 || this.comAARData.layer > 0 || this.comAAMData.layer > 0) {
      this.comAAHData.layer = 0;
      this.comAARData.layer = 0; 
      this.comAAMData.layer = 0;  
      next(false); 
      return ;
    }  
    next(true);
  },
  beforeCreate () {
    agn.beforeDeclare(this);
  },
  created () {  
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
    if (this.urlParams == undefined) {
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
    
    agn.getTemplData({
      object: this,
      callback: (res)=> { 
        this.mdrt.state = res.data.baseInfo.mdrt;
        this.mdrt.level = res.data.baseInfo.mdrt_level;
        
        //设置标题
        let title = agn.setTitle(this.simply,res.data.baseInfo.nickname, res.data.baseInfo.mobile1);
        
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
        this.agent.baseInfo.avatarLimit = res.data.baseInfo.avatar + "!thumb-750";

        this.analyze.approval = res.data.approval;

        plug.sendAgentShare(this.share, "personal_home_page");
        window.setTimeout(()=> { 
          this.$root.pageLoading.layer = 0;
          this.$root.blueLoadingParams.show = false;
        }, 200); 
      }
    });

  }
}