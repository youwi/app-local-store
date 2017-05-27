import config from '../config'

import request from './request'
import classnames from 'classnames'
import {color} from './theme'

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, function () {
    return arguments[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, "-$1").toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    'H+': this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  }
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? o[k]
        : ("00" + o[k]).substr(("" + o[k]).length))
  return format
}
const addBreadMenu=(rootname,obj)=>{
  for(let k of config.menu){
    if(k.key==rootname){
      k.child==null?k.child=[]:null;
      k.child.push(obj)
    }
  }
}

module.exports = {
  addBreadMenu,
  config,
  menu:config.menu,
  request,
  color,
  classnames
}
