const Ajax = require("robe-ajax")

const Env= require("../env.json")

 /**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options,isInBody) {

  if(isFixed(url)){
    url = url.replace(/(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]):\d+/,Env.ip)
  }else{
    url=Env.httpip+url
  }
  if(options.data && !isInBody){
    if(options.data.constructor==String)
      options.data={name:options.data,token:window.localStorage.token}
    options.data.token=window.localStorage.token
  }
  if(isInBody && options.method=="post"){
    if( url.indexOf("?")>0){
      url=url+"&token="+window.localStorage.token
    }else{
      url=url+"?token="+window.localStorage.token
    }
  }

  if (options.cross) {
    //  Ajson.forjson(url)
  } else {
     let proms=Ajax.ajax({
      url: url,
      timeout:5000,
      method: options.method || 'get',
      data: options.data || {token:window.localStorage.token},
       processData: !isInBody, // POST表单需要处理,如是body体不要需要处理
       headers:  isInBody?{'Content-Type': 'application/json'}:null,  // ;charset=utf-8
      dataType: 'JSON',
    }).done((data) => {
      if(data.cpu && data.user){
        console.log("mocked: "+url)
        return null;
      }
      if(data.state==0 && window._dispatch){
        window._dispatch({type:'app/logout'})
      }
      if(data.state<0){
       //  throw data
      }
      return data
    }).fail((err)=>{
      err.url=url
      console.error(err);
      return err;
    })
    return proms
  }
}
/**
 * 错误处理方法
 * @param err
 * @return {*}
 */
function handleError(err,url) {
  err.url=url
  console.error(err);
  return err;
}

/**
 * 是否是服务器跨站请求,是否带http开头
 */
function isFixed(url) {
  if(url && (url.indexOf("http://")==-1)){
    //  (url.indexOf("_mock_")>-1)
    return false;
  }
  if(url && (url.indexOf("http://")==0)){
    return true;
  }
}

