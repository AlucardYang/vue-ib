import Vue from 'vue';
import FunctionJS from '@/components/shared/service/function.js';

Vue.filter('formatDate', function (time, fromat) {
  let date = new Date(time);
  let fm = fromat ? fromat : 'yyyy-MM-dd hh:mm';
  return FunctionJS.formatDate(date, fm);
});

Vue.filter('formatMoney', function (num, places, symbol, thousand, decimal) {
  return FunctionJS.formatMoney(num, places, symbol, thousand, decimal);
});