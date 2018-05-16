/**
 * 合并数组数据
 * 如  源数组 mergeArrayByIndex([{a:1,b:1}], {a:1,b:2},"a",null) =>[{a:1,b:2}]
 * 最后一个参数是直接传入值
 * @param arr
 * @param item
 */
export function mergeArrayByIndex(arr, item,index,oriValue) {
  if(arr==null || item==null) return arr
  for(let a of arr){
    if((a[index]==item[index] && a[index]!=null) || (a[index]==oriValue && oriValue!=null ) ){
      Object.keys(item).forEach((key)=>{
        a[key]=item[key]
      })
    }
  }
  return arr
}

export function isEmptyObject(obj){
  for (var key in obj) {
    return false;
  }
  return true;
}


export function isEmptyArray(arr){
  if(arr===null)return true
  if(arr.constructor===Array && arr.length===0){
    return true
  }else{
    return false
  }
}

export function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 *
 * return URL参数字符串
 */
export function objectUrlEncode (param, key, encode) {
  if(param==null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += objectUrlEncode(param[i], k, encode);
    }
  }
  return paramStr;
}

export  const isStringLike=(str,strb)=>{
  if(str!=null && strb!=null){
    if(str.constructor==Object){
      str=JSON.stringify(str)
    }
    if(strb.constructor==Object){
      strb=JSON.stringify(strb)
    }
    if(str.constructor==Number){
      str=str+""
    }
    if(str.constructor==strb.constructor){
      if(strb.constructor==String){
        if(str.toLowerCase().indexOf(strb.toLowerCase())>-1){
          return true
        }
      }
    }
  }
  if(str==null && strb==null){
    return true
  }
  return false
}
