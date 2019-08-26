export default {
  name: '评测组件',


  run() {
    console.log(this.name);
  },

  //友盟统计 @PV
  czcPv() {  //cmn.czcPv();
    let url = window.location.href;
    let path = url.replace(window.baseUrl, ''); 

    let interval = window.setInterval(()=> {
      if (typeof _czc != 'undefined') {
        window.clearInterval(interval);

        let _czc = _czc || [];  
        _czc.push(['_trackPageview', window.baseUrl, path]);
      }
    }, 500);
  },

  //友盟统计 @事件 cmn.czcEv('视频', '播放'); cmn.czcEv('视频', '播放', '哪个视频', '元素CLASS ID');
  czcEv(category, action, label, nodeid) { 
    category = category || "";
    action = action || "";
    label = label || "";
    nodeid = nodeid || "app";

    let interval = window.setInterval(()=> {
      if (typeof _czc != 'undefined') {
        window.clearInterval(interval);

        let czc = _czc || [];
        czc.push(['_trackEvent', category, action]);
      }
    }, 500);
  },

  //Echarts组件加载判断
  //cmn.echarts((res)=> {}, (err)=> {});
  echarts(callback, error) {
    let limit = 15;
    let time = 0;
    if (typeof echarts === 'undefined') {
      let interval = window.setInterval(()=> {
        if (time > limit) {  
          window.clearInterval(interval);
          if (typeof error === 'function') {
            error(); 
          }  
          return ;
        }
        time += 0.5;
        if (typeof echarts !== 'undefined') {
          window.clearInterval(interval);
          if (typeof callback === 'function') {
            success();
          }
        }
      }, 500);
      return ;
    }
    if (typeof callback === 'function') {
      callback();
    }
  }
}