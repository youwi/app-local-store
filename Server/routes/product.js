const router = require('koa-router')()
const config = require("../../config")
const _ = require("lodash")
require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const Base64 = require('js-base64').Base64;
const fs=require('fs')
const path=require('path')
const data = {
  state: 0,
  msg: "nothing",

}
function paramExist(ctx, name) {
  if (ctx.query) {
    if (ctx.query[name] != null) {
      return ctx.query[name] || true
    }
  }
  if (ctx.request && ctx.request.body) {
    if (ctx.request.body[name] != null) {
      return ctx.request.body[name] || true
    }
  }
  if (ctx.request &&  ctx.request.body && ctx.request.body.files){
    if (ctx.request.body.files[name] != null) {
      return ctx.request.body.files[name] || true
    }
  }
  if (ctx.request &&  ctx.request.body && ctx.request.body.fields){
    if (ctx.request.body.fields[name] != null) {
      return ctx.request.body.fields[name] || true
    }
  }
  return false
}
router.get(config.index.versionList, async function (ctx, next) {
  let rba = _.clone(data)
  if (paramExist(ctx, "product")) {
    let product=paramExist(ctx, "version")
    let versions=fs.readdirSync(path.join(config.uploadPath,product))
    rba.state=1
    rba.versions=versions
    ctx.body =rba
  } else {
    rba.msg = "error,product not present"
    rba.state = 0
    ctx.body = rba
  }
})

router.get(config.index.allProduct, async function (ctx, next) {
  let rba = _.clone(data)
    let products=fs.readdirSync(path.join(config.uploadPath))
    rba.state=1
    rba.products=products
    //ctx.body =rba
    ctx.body={"state":"1","list":[{"isDeletable":false,"desc":"Agent Common SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":1.0,"projectType":-1.0,"teamId":null,"name":"Agent Common SOA","status":"17天前更新","updateUserName":"陈 俊杰 [SVR III]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"WeChat SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":2.0,"projectType":-1.0,"teamId":null,"name":"WeChat SOA","status":"3月前更新","updateUserName":"孙 朵朵 [SVR II]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Agent SOA\n","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":3.0,"projectType":-1.0,"teamId":null,"name":"Agent SOA","status":"4月前更新","updateUserName":"张 诚 [SVR III]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"User Manage SOA\n","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":4.0,"projectType":-1.0,"teamId":null,"name":"User Manage SOA","status":"8天前更新","updateUserName":"李 坦 [SVR II]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Bid SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":5.0,"projectType":-1.0,"teamId":null,"name":"Bid SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"SMS SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":6.0,"projectType":-1.0,"teamId":null,"name":"SMS SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Call SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":7.0,"projectType":-1.0,"teamId":null,"name":"Call SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Site Service SOA\n","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":8.0,"projectType":-1.0,"teamId":null,"name":"Site Service SOA","status":"16天前更新","updateUserName":"李 坦 [SVR II]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Analysis SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":9.0,"projectType":-1.0,"teamId":null,"name":"Analysis SOA","status":"4月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Search Engine\n","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":10.0,"projectType":-1.0,"teamId":null,"name":"Search Engine","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Count SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":11.0,"projectType":-1.0,"teamId":null,"name":"Count SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Sales House SOA\n","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":12.0,"projectType":-1.0,"teamId":null,"name":"Sales House SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Customer Agent SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":13.0,"projectType":-1.0,"teamId":null,"name":"Customer Agent SOA","status":"4月前更新","updateUserName":"阮 正华 [SVR Arch]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Sales Agent SOA\n","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":14.0,"projectType":-1.0,"teamId":null,"name":"Sales Agent SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Financial Management SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":15.0,"projectType":-1.0,"teamId":null,"name":"Financial Management SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Central Dispatch SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":16.0,"projectType":-1.0,"teamId":null,"name":"Central Dispatch SOA","status":"4月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"House SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":17.0,"projectType":-1.0,"teamId":null,"name":"House SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Point SOA\n","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":18.0,"projectType":-1.0,"teamId":null,"name":"Point SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"House Sync SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":19.0,"projectType":-1.0,"teamId":null,"name":"House Sync SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Pay SOA\n","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":20.0,"projectType":-1.0,"teamId":null,"name":"Pay SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Image SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":21.0,"projectType":-1.0,"teamId":null,"name":"Image SOA","status":"4月前更新","updateUserName":"尤 晓霜 [SVR I]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"New Building SOA\n","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":22.0,"projectType":-1.0,"teamId":null,"name":"New Building SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"IM SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":23.0,"projectType":-1.0,"teamId":null,"name":"IM SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"MiPush SOA\n","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":24.0,"projectType":-1.0,"teamId":null,"name":"MiPush SOA","status":"9月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"悟空找房移动端","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":25.0,"projectType":2.0,"teamId":null,"name":"悟空找房 App","status":"5天前更新","updateUserName":"段 龙山 [SVR I]","productId":0.0,"isManagable":true,"projectShortName":"wkzf"},{"isDeletable":false,"desc":"有房有客移动端","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":26.0,"projectType":2.0,"teamId":null,"name":"有房有客 App","status":"3月前更新","updateUserName":"张 诚 [SVR III]","productId":0.0,"isManagable":true,"projectShortName":"yfyk"},{"isDeletable":false,"desc":"法务助手移动端，用于法务审批流程","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":27.0,"projectType":2.0,"teamId":null,"name":"法务助手 App","status":"3月前更新","updateUserName":"谢 士威 [SVR III]","productId":0.0,"isManagable":true,"projectShortName":"laapp"},{"isDeletable":false,"desc":"新房助手移动端，新房驻守项目经理使用","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":28.0,"projectType":2.0,"teamId":null,"name":"新房助手 App","status":"10天前更新","updateUserName":"陈 俊杰 [SVR III]","productId":0.0,"isManagable":true,"projectShortName":"nbaapp"},{"isDeletable":false,"desc":"新筋斗云 - 大师兄后台","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":29.0,"projectType":-1.0,"teamId":null,"name":"新筋斗云 - 大师兄后台","status":"4月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"小区大师兄 WeChat","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":30.0,"projectType":-1.0,"teamId":null,"name":"小区大师兄 WeChat","status":"4月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"小区合伙人 H5","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":31.0,"projectType":-1.0,"teamId":null,"name":"小区合伙人 H5","status":"4月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"小区合伙人移动端","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":32.0,"projectType":2.0,"teamId":null,"name":"孙行者 App","status":"2月前更新","updateUserName":"胡 长兴 [SVR I]","productId":0.0,"isManagable":true,"projectShortName":"mkapp"},{"isDeletable":false,"desc":"今日笋盘客服系统","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":33.0,"projectType":-1.0,"teamId":null,"name":"今日笋盘客服系统","status":"4月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"今日笋盘移动端","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":34.0,"projectType":2.0,"teamId":null,"name":"今日笋盘 App","status":"4月前更新","updateUserName":"高 仁丁 [SVR I]","productId":0.0,"isManagable":true,"projectShortName":"bambooapp"},{"isDeletable":false,"desc":"筋斗云 - 人事模块","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":35.0,"projectType":-1.0,"teamId":null,"name":"筋斗云 - 人事模块","status":"15天前更新","updateUserName":"汪 剑凤 [SVR III]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"悟空找房 Web","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":36.0,"projectType":-1.0,"teamId":null,"name":"悟空找房 Web","status":"17天前更新","updateUserName":"刘 安君 [SVR II]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"EQIP","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":37.0,"projectType":-1.0,"teamId":null,"name":"EQIP","status":"1月前更新","updateUserName":"余 珍成 [QA III]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"筋斗云 - 基础数据管理模块","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":38.0,"projectType":-1.0,"teamId":null,"name":"筋斗云 - 基础数据管理模块","status":"17天前更新","updateUserName":"张 斌 [SVR I]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Community Partner SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":39.0,"projectType":-1.0,"teamId":null,"name":"Community Partner SOA","status":"4月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"新筋斗云 - 孙行者后台","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":40.0,"projectType":-1.0,"teamId":null,"name":"新筋斗云 - 孙行者后台","status":"4月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"筋斗云 - 新房运营模块","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":41.0,"projectType":-1.0,"teamId":null,"name":"筋斗云 - 新房运营模块","status":"12天前更新","updateUserName":"董 纹陶 [SVR III]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"筋斗云 - 法务管理模块","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":42.0,"projectType":-1.0,"teamId":null,"name":"筋斗云 - 法务管理模块","status":"1月前更新","updateUserName":"汪 剑凤 [SVR III]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"筋斗云 - 财务模块","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":43.0,"projectType":-1.0,"teamId":null,"name":"筋斗云 - 财务模块","status":"8天前更新","updateUserName":"董 纹陶 [SVR III]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Temp SSO SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":44.0,"projectType":-1.0,"teamId":null,"name":"Temp SSO SOA","status":"4月前更新","updateUserName":"杨 明敏 [SVR Arch]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"SSO SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":45.0,"projectType":-1.0,"teamId":null,"name":"SSO SOA","status":"4月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"悟空找房 H5","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":46.0,"projectType":-1.0,"teamId":null,"name":"悟空找房 H5","status":"6天前更新","updateUserName":"李 壮 [SVR II]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"悟空通行证 App","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":47.0,"projectType":2.0,"teamId":null,"name":"悟空通行证 App","status":"3月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":"wkppapp"},{"isDeletable":false,"desc":"新筋斗云 - 报表模块","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":48.0,"projectType":-1.0,"teamId":null,"name":"新筋斗云 - 报表模块","status":"3月前更新","updateUserName":"周 栋超 [SVR Arch]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"新筋斗云 - 评价模块","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":49.0,"projectType":-1.0,"teamId":null,"name":"新筋斗云 - 评价模块","status":"3月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"新筋斗云 - 房源模块","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":50.0,"projectType":-1.0,"teamId":null,"name":"新筋斗云 - 房源模块","status":"14天前更新","updateUserName":"朱 奎 [SVR I]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"新有房有客 App","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":51.0,"projectType":-1.0,"teamId":null,"name":"新有房有客 App","status":"5天前更新","updateUserName":"胡 长兴 [SVR I]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Rate SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":52.0,"projectType":-1.0,"teamId":null,"name":"Rate SOA","status":"2月前更新","updateUserName":"周 超 [SVR I]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"新筋斗云 - 运营管理模块","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":53.0,"projectType":-1.0,"teamId":null,"name":"新筋斗云 - 运营管理模块","status":"9天前更新","updateUserName":"管 安帮 [SVR III]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Coupon SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":54.0,"projectType":-1.0,"teamId":null,"name":"Coupon SOA","status":"14天前更新","updateUserName":"尤 晓霜 [SVR I]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"有房有客 H5","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":55.0,"projectType":-1.0,"teamId":null,"name":"有房有客 H5","status":"1月前更新","updateUserName":"文 宇祥 [SVR II]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"悟空找房 WeChat","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":56.0,"projectType":-1.0,"teamId":null,"name":"悟空找房 WeChat","status":"1月前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"悟空找房 微信小程序","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":57.0,"projectType":-1.0,"teamId":null,"name":"悟空找房 微信小程序","status":"17小时前更新","updateUserName":"李 壮 [SVR II]","productId":0.0,"isManagable":true,"projectShortName":""},{"isDeletable":false,"desc":"Regulation SOA","creator":{"name":"","id":0.0,"email":"admin@lifang.com"},"related":false,"id":58.0,"projectType":-1.0,"teamId":null,"name":"Regulation SOA","status":"9天前更新","updateUserName":"admin","productId":0.0,"isManagable":true,"projectShortName":""}]}
})


module.exports = router