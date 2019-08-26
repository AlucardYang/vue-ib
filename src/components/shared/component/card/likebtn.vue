<template>
    <div v-if="!inApp" class="like-btn e-bubble" @click="getLikeStatus" :class="temp" :style="aahThumbs">
        <div v-if="false" class="com-screen aux-fix com-flex com-praise-agent">
            <i class="iconfont aux-effect" :class="temp">&#xe798;</i>
        </div>
        <i v-show="!isLikeStatus" class="iconfont like-icon e-bubble" :style="aahThumbsIcon">&#xe798;</i>
        <i v-show="isLikeStatus" class="iconfont like-icon e-bubble" :style="aahThumbsIcon">&#xe797;</i>
        <span class="e-bubble" v-show="!isLikeStatus && temp != 'a-a-i' && temp != 'a-a-h'">{{simply ? '点赞' : '點讚'}}</span>
        <span class="e-bubble" v-show="isLikeStatus && temp != 'a-a-i' && temp != 'a-a-h'">{{simply ? '已赞' : '已讚'}}</span>
    </div>
</template>

<script>
export default {
    name: "LikeBtn",
    props: {
        share: {
            type: Object,
            default: function() {
                return {};
            }
        },
        // 是否点赞
        isLike: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        //模板名称
        temp: {
            type: String,
            default: function() {
                return "";
            }
        }
    },
    data() {
        return {
            isLikeStatus: false,
            isLoaded: true,
            controlPraise: false,
            aahThumbs: {},
            aahThumbsIcon: {}
        };
    },
    components: {},
    created() {
      this.controlThumbs(this.temp, this.isLikeStatus); 
    },
    watch: {
        isLike: {
            handler: function(value, oldvalue) {
                this.isLikeStatus = ((value == 1) ? true : false);
            }
        },
        isLikeStatus: function(val, oldVal) {
          this.controlThumbs(this.temp, val);
        }
    },
    mounted() {},
    methods: {
      controlThumbs: function(temp_id, state) {
        if (temp_id == 'a-a-h' && state) {
          this.aahThumbs = {
            'background-color': '#ECE5F3'
          };
          this.aahThumbsIcon =  {color: '#863DC6'}
        } 
        if (temp_id == 'a-a-h' && !state) {
          this.aahThumbs = { 
            'background-color': '#ECE5F3' 
          };
          this.aahThumbsIcon = {color: '#863DC6'}
        } 
      },
        getLikeStatus() {
            if (this.isLoaded) {
                this.isLoaded = false;
                this.share.c_user_uuid = window.rootUserInfo['c_user_uuid'];
                this.share.mark = window.markUuid;
                this.share.platform = window.platform;

                this.$http.post('/behavior/like', this.share).then(res => {
                    if (res && res.code === 0) {
                        this.isLikeStatus = !res.data.isCanceled;

                        //点赞特效
                        if (this.isLikeStatus) {
                            this.controlPraise = true;
                            window.setTimeout(() => {
                                this.controlPraise = false;
                                this.isLoaded = true;
                            }, 1000);
                            return;
                        }
                        let _toast = this.simply ? "已取消点赞" : "已取消點讚";
                        this.$toast(_toast);
   
                        window.setTimeout(() => {
                            this.isLoaded = true;
                        }, 3000);
                        return;
                    }

                    //取消点赞 
                    this.$toast(res.msg);
                    window.setTimeout(() => {
                        this.isLoaded = true;
                    }, 3000);
                    this.isLoaded = true;
                }, err => {
                    this.isLoaded = true;
                });
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.like-btn {
    z-index: 99;
    position: absolute;
    bottom: .2rem;
    right: .16rem;
    height: .32rem;
    line-height: .3rem;
    background-color: rgba(0, 0, 0, .6);
    border-radius: .16rem;
    font-size: .15rem;
    color: #FFFFFF;
    text-align: center;
    padding: 0 .12rem;
    cursor: pointer;
}


i.a-a-h {
  color: #863DC6;
}


.a-a-a {
  left: .175rem;
  bottom: .15rem;
  width: 1rem;
  height: .4rem;
  line-height: .4rem;
  opacity: 1;
  border-radius: 0;
  border-top-left-radius: .25rem;
  border-bottom-left-radius: .25rem;
  background: #2a2a2a;
  overflow: hidden;
  color: #fff;
  font-size: .15rem;
  text-align: center;
  background: #D81717;
}

.a-a-b {
    top: .4rem;
    right: 0;
    border-radius: 0;
    border-top-left-radius: .25rem;
    border-bottom-left-radius: .25rem;
}

.a-a-f {
    top: .245rem;
    right: .245rem;
}
.a-a-h {
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  
  top: 0;
  left: .25rem;
  right: auto;
  bottom: auto;
  width :.4rem;
  height: .4rem; 
  border-radius: 100%;
}
.a-a-h i {
  margin: auto; 
  font-size: .2rem;
}
.a-a-i {
  bottom: 0;
  right: .56rem;
  width: .44rem;
  height: .44rem;
  line-height: .44rem;
  border-radius: .055rem;
  text-align: center; 
  font-size: .14rem;
  color: #fff;
  outline: 0;
  border: 0;
  background: #18C8CF;
}
.a-a-i i {
  font-size: .24rem;
}
</style>
