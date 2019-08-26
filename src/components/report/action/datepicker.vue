<template>
  <mt-popup v-model="date.showDatePick" popup-transition="popup-fade">
    <div class="date-picker">
      <mt-picker class="date-picker-content" :slots="slots" @change="onValuesChange" :itemHeight="66" :visibleItemCount="3"></mt-picker>
      <div class="bottom-btn">
        <div class="cancel" @click="date.showDatePick = false">取消</div>
        <div class="ok">確定</div>
      </div>
    </div>
  </mt-popup>
</template>

<script>
import { Popup, Picker } from "mint-ui";

export default {
  name: "DatePicker",
  props: {
    date: {
      type: Object,
      default: function() {
        return {
          showDatePick: false,
          value: "2018-07-08 星期二"
        };
      }
    }
  },
  data() {
    return {
      slots: [
        {
          flex: 1,
          values: ["2014年", "2015年", "2016年", "2017年", "2018年", "2019年"],
          className: "slot1",
          textAlign: "center"
        },
        {
          flex: 1,
          values: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ],
          className: "slot1",
          textAlign: "center"
        },
        {
          flex: 1,
          values: [
            "1日",
            "2日",
            "3日",
            "4日",
            "5日",
            "6日",
            "7日",
            "8日",
            "9日"
          ],
          className: "slot1",
          textAlign: "center"
        }
      ]
    };
  },
  watch: {
    date: {
      handler: function(value, oldvalue) {}
    }
  },
  mounted: function() {},
  methods: {
    onValuesChange(picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0]);
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.date-picker {
  width: 3.27rem;
  left: calc(50% - 1.635rem);
  height: 2.63rem;
  background: #ffffff;
  border-radius: 0.08rem;
  position: relative;
}

.date-picker-content {
  height: 2.14rem;
  padding: 0.1rem 0;
}

.bottom-btn {
  width: 100%;
  height: 0.48rem;
  line-height: 0.48rem;
  background: #f6f6f6;
  position: absolute;
  bottom: 0;
  border-radius: 0 0 0.08rem 0.08rem;
}

.bottom-btn div {
  width: 50%;
  font-size: 0.17rem;
  color: #9e9e9e;
  letter-spacing: 0;
  line-height: 0.22rem;
  float: left;
  box-sizing: border-box;
  text-align: center;
  margin-top: 0.13rem;
  cursor: pointer;
}

.bottom-btn .ok {
  color: #3364e4;
  border-left: 0.005rem solid #d6d6d6;
}
</style>
<style>
.date-picker-content .picker-item {
  font-size: 0.16rem;
  color: #cccccc;
  letter-spacing: 0;
  line-height: 0.24rem;
}

.date-picker-content .picker-selected {
  font-size: 0.2rem;
  color: #3364e4;
  letter-spacing: 0;
  line-height: 0.24rem;
}
</style>

