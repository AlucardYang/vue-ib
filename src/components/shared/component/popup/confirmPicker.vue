<template>
    <div v-show="showPicker" class="popup-picker-content">
        <div class="popup-picker-bg" @click="confirmChange(false)"></div>
        <div id="popupPicker" class="popup-picker" :style="slideStyle">
            <div class="top-box">
                <div class="popup-title">{{title}}</div>
                <div class="popup-content">{{content}}</div>
            </div>
            <ul class="btn-box">
                <li class="btn-block" @click="confirmChange(false)">{{cancelText}}</li>
                <li class="btn-block" @click="confirmChange(true)">{{signOutText}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import CommonJS from "@/components/shared/service/common.js";

export default {
    name: "ConfirmPicker",
    props: {
        title: {
            type: String,
            default: function() {
                return '';
            }
        },
        content: {
            type: String,
            default: function() {
                return '';
            }
        },
    },
    data() {
        return {
            showPicker: false,
            slideStyle: {},
            cancelText: '取消',
            signOutText: simply ? '坚持退出' : '堅持退出',
        };
    },
    watch: {
        show: {
            handler: function(value, oldvalue) {

            }
        }
    },
    mounted() {

    },
    methods: {
        open() {
            this.showPicker = true;
            setTimeout(() => {
                this.slideStyle = {
                    transform: 'scale(1)'
                };
            }, 30);
            document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'hidden');
        },
        close() {
            this.slideStyle = {
                transform: 'scale(0)'
            };
            setTimeout(() => {
                this.showPicker = false;
            }, 300);
            document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'auto');
        },
        confirmChange(boolean) {
            this.close();
            setTimeout(() => {
                this.$emit('updateConfirm', boolean);
            }, 300);
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.popup-picker-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-picker-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.popup-picker {
    background-color: #fff;
    width: calc(100% - .48rem);
    min-height: 1.85rem;
    border-radius: .08rem;
    transition: all 300ms;
    transform: scale(1);
}

.top-box {
    padding: .32rem .24rem;
}

.btn-box {
    background: #F6F6F6;
    border-radius: 0 0 .08rem .08rem;
    position: absolute;
    left: 0;
    bottom: 0;
    height: .48rem;
    width: 100%;
    cursor: pointer;
}

.popup-title {
    font-family: PingFangSC-Medium;
    font-size: .17rem;
    color: #2A2A2A;
    text-align: center;
    line-height: .23rem;
}

.popup-content {
    font-size: .16rem;
    color: #2A2A2A;
    text-align: center;
    line-height: .23rem;
    margin-top: .04rem;
}

.btn-block {
    float: left;
    width: 50%;
    font-size: .17rem;
    color: #000000;
    text-align: center;
    line-height: .48rem;
}
</style>
