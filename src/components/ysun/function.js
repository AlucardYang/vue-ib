module.exorts = {
  //path转换为对象
  exchangePathKey() {
    let search = window.location.search.replace(/^\?/g, '');
    let arr = search.split('&');
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
      let _arr = arr[i].split('=');
      obj[_arr[0]] = _arr[1];
    }
    return obj;
  },
}