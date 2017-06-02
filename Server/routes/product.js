const router = require('koa-router')()
const config = require("../../config")
const _ = require("lodash")
require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const Base64 = require('js-base64').Base64;
const fs=require('fs')
const path=require('path')
const request=require("superagent")
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
  // let rbbcc= {...data}
  // console.log(rbbcc)
  let products = fs.readdirSync(path.join(config.uploadPath))
  rba.state = 1
  rba.products = products
  //ctx.body =rba
  let pimProducts = await request.get(config.pim.products)

  ctx.body =JSON.parse(pimProducts.text)
})


module.exports = router
