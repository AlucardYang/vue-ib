<template>
    <div v-show="showPicker" class="popup-date-picker-content">
        <div class="popup-date-picker-bg" @click="close"></div>
        <div id="popupDatePicker" class="popup-date-picker" :style="slideStyle">
            <mt-picker ref="picker" :slots="slots" :valueKey="valueKey" @change="slotsChange" :showToolbar="true" :itemHeight="52">
                <div class="select-tool-bar">
                    <span class="cancel-btn" @click="close">取消</span>
                    <span class="select-text">{{title}}</span>
                    <span class="confirm-btn" @click="confirmDateChange">{{confirmText}}</span>
                </div>
            </mt-picker>
        </div>
    </div>
</template>

<script>
// import Vue from 'vue';
import { Picker } from 'mint-ui';
// Vue.component(Picker.name, Picker);


export default {
    name: "SelectPicker",
    props: {
        data: {
            type: Array,
            default: function() {
                return [];
            }
        },
        default: {
            type: null,
            default: function() {
                return '';
            }
        },
        valueKey: {
            type: String,
            default: function() {
                return '';
            }
        },
        title: {
            type: String,
            default: function() {
                return '請選擇';
            }
        },
    },
    components: {
        'mt-picker': Picker,
    },
    data() {
        return {
            showPicker: false,
            slideStyle: {},
            selectValue: '',
            confirmText: this.simply ? '确定' : '確定',
            slots: [{
                flex: 1,
                values: [],
                className: 'slot1',
                textAlign: 'center',
            }]
        };
    },
    watch: {
        data: {
            handler: function(value, oldvalue) {
                this.slots[0].values = value;
            }
        }
    },
    mounted() {
        this.slots[0].values = this.data;
    },
    methods: {
        open() {
            this.showPicker = true;
            setTimeout(() => {
                // 从下往上的动效
                this.slideStyle = {
                    transform: 'translateY(0)'
                };
            }, 50);
            document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'hidden');
            this.$refs.picker.setSlotValue(0, this.default);
        },
        close() {
            this.slideStyle = {
                transform: 'translateY(100%)'
            };
            setTimeout(() => {
                this.showPicker = false;
            }, 300);
            document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'auto');
        },
        slotsChange(picker, values) {
            if (values && values[0]) {
                this.selectValue = values[0];
            }
        },
        confirmDateChange() {
            this.close();
            this.$emit('updateData', this.selectValue);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.popup-date-picker-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3000;
}

.popup-date-picker-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.popup-date-picker {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    width: 100%;
    min-height: 3rem;
    transition: all 100ms;
    transform: translateY(100%);
}
</style>
