const router = require('koa-router')()
const config = require("../../config")
const _ = require("lodash")
require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const Base64 = require('js-base64').Base64;


const data = {
  state: 0,
  msg: "nothing",

}
const AuthList = {}

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
  return false
}
router.get(config.index.userinfo, async function (ctx, next) {
  let rba = _.clone(data)
  if (paramExist(ctx, "token")) {
    rba.msg = "OK"
    let token=paramExist(ctx, "token")
    let asoToken=await crowdValidateToken(token)
    if(asoToken.token==null){
      rba.msg=asoToken.message
      rba.state=0
      ctx.body = _.assign(rba, asoToken)
      return
    }
    rba.state=1
    let asoUser= await crowdFindUser(asoToken.user.name)
    ctx.body = _.assign(rba, asoToken,asoUser)
  } else {
    rba.msg = "error,token not present,you may need to login again"
    rba.state = 0
    ctx.body = rba
  }

})

router.post(config.index.login, async function (ctx, next) {
  let rba = _.clone(data)
  if (paramExist(ctx, "username") && paramExist(ctx, "password")) {
    let username = paramExist(ctx, "username")
    let password = paramExist(ctx, "password")

    let asoUser=await crowdFindUser(username)
    if(asoUser.name==null){
      rba.state=0
      rba.msg=asoUser.message
      ctx.body=_.assign(rba,asoUser)
      return
    }
    let asoToken=await  crowdCreateToken(username,password)
    if(asoToken.token==null){
      rba.state=0
      rba.msg=asoToken.message
      ctx.body=_.assign(rba,asoToken)
      return
    }

    rba.state=1
    let asoOut= _.assign(rba, asoToken,asoUser)
    ctx.body =asoOut
    AuthList[username] =asoOut
  } else {
    rba.msg = "error,username or password not present"
    rba.state = 0
    ctx.body = rba
  }

})




/**
 * 用户登陆认证
 * 注:不生成token
 * */
async function crowdUserAuth(username, password) {
  let response = await fetch(config.crowd.auth+"?username="+username,{
    method: "POST",
    headers: {
      "Authorization": "Basic " + Base64.encode(config.crowd.applicationName + ":" + config.crowd.applicationAuth),
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      value:password
    })
  })
  return await response.json()
}



/**
 * 查找用户详细信息*/
async function crowdFindUser(username) {
  let response = await fetch(config.crowd.findUser+"?username="+username,{
    method: "GET",
    headers: {
      "Authorization": "Basic " + Base64.encode(config.crowd.applicationName + ":" + config.crowd.applicationAuth),
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  })
  return await response.json()
}



/**
 * 使用用户和密码登陆Crowd,得到用户的详细信息 并得到Token
 * 暂不区分来源地址
 * */
async function crowdCreateToken(username,password) {
  let response = await fetch(config.crowd.sessionOnline, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Base64.encode(config.crowd.applicationName + ":" + config.crowd.applicationAuth),
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "username": username,
      "password": password,
      "validation-factors": {
        "validationFactors": [
          {
            "name": "remote_address",
            "value": "127.0.0.1"
          }
        ]
      }
    })
  })
  return await response.json()
}



/**
 *  验证用户的Token,保持在线状态
 *  */
async function crowdValidateToken(token) {
  let response = await fetch(config.crowd.sessionOnline +"/"+token, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Base64.encode(config.crowd.applicationName + ":" + config.crowd.applicationAuth),
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "validationFactors": [
        {
          "name": "remote_address",
          "value": "127.0.0.1"
        }
      ]
    })
  })
  return await response.json()
}
module.exports = router
