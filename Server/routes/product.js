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
    let product=paramExist(ctx, "product")
    let versions=[]
    let versionT={}
    rba.state=1
    try{
      versions=fs.readdirSync(path.join(config.uploadPath,product))
      let versions_clone=[]
      for(let version of versions){
        let pathName=path.join(config.uploadPath,product,version)
        if(fs.existsSync(pathName)  && fs.statSync(pathName).isDirectory()){
          versionT[version]=fs.readdirSync(pathName)
          versions_clone.push(version)
        }else{
        }
      }
      versions=versions_clone
    }catch(e){
      rba.state=-3
      rba.msg=e.message
      console.error(e)
    }

    rba.versions=versions
    rba.versionT=versionT
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

router.get(config.index.allVersionImage, async function (ctx, next) {
  let rba = _.clone(data)

  if (paramExist(ctx, "product") &&    paramExist(ctx, "version") &&  paramExist(ctx, "tag") ) {
    let version=paramExist(ctx, "version")
    let product=paramExist(ctx, "product")
    let tag=paramExist(ctx, "tag")

    let links =[]
    travel(path.join(config.uploadPath,product,version,tag),(pathName)=>{
      links.push(pathName.replace(config.uploadPath,""))
    })

    rba.state = 1
    rba.links = links
  }else{
    rba.state=-3
    rba.msg="product or version or tag not present"
  }

  ctx.body =rba
})

/**
 * 递归目录,回调为文件,
 * @param dir
 * @param callback
 */
function travel(dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
    var pathname = path.join(dir, file);

    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}

module.exports = router
