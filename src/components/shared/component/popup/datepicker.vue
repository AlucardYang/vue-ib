<template>
    <div v-show="showPicker" class="popup-date-picker-content">
        <div class="popup-date-picker-bg" @click="close"></div>
        <div id="popupDatePicker" class="popup-date-picker">
            <mt-picker ref="picker" :slots="dateSlots" @change="dateChange" :showToolbar="true" :itemHeight="52">
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

import CommonJS from "@/components/shared/service/common.js";

export default {
    name: "DatePicker",
    props: {
        range: {
            type: Number,
            default: function() {
                return 10;
            }
        },
        newDate: {
            type: Date,
            default: function() {
                return new Date();
            }
        },
        title: {
            type: String,
            default: function() {
                return '請選擇日期';
            }
        },
    },
    components: {
        'mt-picker': Picker,
    },
    data() {
        return {
            showPicker: false,
            date: new Date(),
            confirmText: this.simply ? '确定' : '確定',
            dateSlots: [{
                    flex: 1,
                    values: [],
                    className: "slot1",
                    textAlign: "center"
                },
                {
                    flex: 1,
                    values: [],
                    className: "slot2",
                    textAlign: "center"
                },
                {
                    flex: 1,
                    values: [],
                    className: "slot3",
                    textAlign: "center"
                }
            ]
        };
    },
    watch: {
        show: {
            handler: function(value, oldvalue) {

            }
        }
    },
    mounted() {
        this.dateSlots[0].values = CommonJS.getDateData(1970, 2021).years;
        this.dateSlots[1].values = CommonJS.getDateData(1970, 2021).months;
    },
    methods: {
        open() {
            this.showPicker = true;
            document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'hidden');
            this.init();
        },
        close() {
            this.showPicker = false;
            document.querySelector('.com-scroll-y') && (document.querySelector('.com-scroll-y').style.overflowY = 'auto');
        },
        setDays(year, month) {
            let dayNum = CommonJS.getDaysInMonth(year, month);
            let days = [];
            for (let i = 1; i <= dayNum; i++) {
                days.push((String(i).length === 1 && "0") + i + "日");
            }
            this.$refs.picker.setSlotValues(2, days);
        },
        init() {
            let year = this.newDate.getFullYear();
            let month = this.newDate.getMonth() + 1;
            let day = this.newDate.getDate();
            this.setDays(year, month);
            this.$refs.picker.setValues([year + "年", (String(month).length === 1 && "0") + month + "月", (String(day).length === 1 && "0") + day + "日"]);
        },
        dateChange(picker, values) {
            if (values && values[0] && values[1] && values[2]) {
                let year = values[0].slice(0, 4),
                    month = values[1].slice(0, 2),
                    day = values[2].slice(0, 2);
                this.date = new Date(year + "-" + month + "-" + day);
                this.setDays(parseInt(year), parseInt(month));
            }
        },
        confirmDateChange() {
            this.close();
            this.$emit('updateDate', this.date);
        },
        resetPopup() {
            const _this = this;
            setTimeout(() => {
                // 关闭弹窗
                let datePicker = document.getElementById("popupDatePicker");
                let selectDateBtn = document.getElementById("selectDateBtn");
                document.body.addEventListener('click', function(event) {
                    _this.close();
                });
                datePicker.onclick = function(event) {
                    //兼容IE低版本
                    event.stopPropagation();
                    event.cancelBubble = true;
                };
                selectDateBtn.onclick = function(event) {
                    //兼容IE低版本
                    event.stopPropagation();
                    event.cancelBubble = true;
                };
            }, 10);
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
}
</style>
