const router = require('koa-router')()
const config = require("../../config")
const _ = require("lodash")
require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const Base64 = require('js-base64').Base64;
const fs = require('fs')
const path = require('path')
const request = require("superagent")
const data = {
  state: 0,
  msg: "nothing",

}

/**
 * 判断参数是否存在,并返回参数
 * */
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
  if (ctx.request && ctx.request.body && ctx.request.body.files) {
    if (ctx.request.body.files[name] != null) {
      return ctx.request.body.files[name] || true
    }
  }
  if (ctx.request && ctx.request.body && ctx.request.body.fields) {
    if (ctx.request.body.fields[name] != null) {
      return ctx.request.body.fields[name] || true
    }
  }
  return false
}

/**
 * 获取所有版本列表,2级目录,
 * 包括tags目录.
 */
router.get(config.index.versionList, async function (ctx, next) {
  let rba = _.clone(data)
  if (paramExist(ctx, "product")) {
    let product = paramExist(ctx, "product")
    let versions = []
    let versionT = {}
    rba.state = 1
    try {
      versions = fs.readdirSync(path.join(config.uploadPath, product))
      let versions_clone = []
      for (let version of versions) {
        let pathName = path.join(config.uploadPath, product, version)
        if (fs.existsSync(pathName) && fs.statSync(pathName).isDirectory()) {
          let tags = fs.readdirSync(pathName)
          versionT[version] = tags.filter((file) =>
            fs.statSync(path.join(config.uploadPath, product, version, file)).isDirectory() && file !== "__MACOSX"
          )
          versions_clone.push(version)
        } else {
        }
      }
      versions = versions_clone
    } catch (e) {
      rba.state = -3
      rba.msg = e.message
      console.error(e)
    }

    rba.versions = versions
    rba.versionT = versionT
    ctx.body = rba
  } else {
    rba.msg = "error,product not present"
    rba.state = 0
    ctx.body = rba
  }
})

/**
 * 在项目目录下查找最新的Apk文件.
 * 并返回二维码,
 * 安装时间,上传时间
 *
 */
function findAPK() {
  let last = {
    link: "/",
    logo: "/",
    uploadAt: "",
    version: "",
    build: ""
  }
  //  npm install  apkreader
  // adbkit-apkreader
}

/**
 *   versionName: '2.5.4',
 * application:
 { label: [ '猎萝卜-Test' ],
   icon:
    [ 'res/mipmap-hdpi-v4/ic_launcher_test.png',
      'res/mipmap-xhdpi-v4/ic_launcher_test.png',
      'res/mipmap-xxhdpi-v4/ic_launcher_test.png',
      'res/mipmap-xxxhdpi-v4/ic_launcher_test.png' ],
   name: 'com.higgs.app.haolieb.App',
   allowBackup: true,
   supportsRtl: true,
*/

function getApkIcon(fileName, callback) {
  let oat = {}
  var ApkReader = require('adbkit-apkreader')
  var fs = require('fs')

  var PkgReader = require('isomorphic-apk-reader');
  var reader = new PkgReader(fileName, null, {searchResource: true});


  reader.parse(function (err, pkgInfo) {
    console.log(pkgInfo)
    oat.versionName = pkgInfo.versionName;
    oat.label = pkgInfo.application.label[0];
    oat.logo = 'logo.png'
    // 最后一个图标
    let iconPath = pkgInfo.application.icon[pkgInfo.application.icon.length - 1]
    ApkReader.open(fileName)
      .then(reader => {
        reader.readContent(iconPath).then(function (image) {
          fs.writeFile("logo.png", image, function (err) {
          });
        })
      })
    callback && callback(oat);
  });
}


/**
 * 所有的产品列表,默认从PIM上取数据
 */
router.get(config.index.allProduct, async function (ctx, next) {
  let rba = _.clone(data)
  // let rbbcc= {...data}
  // console.log(rbbcc)
  let products = fs.readdirSync(path.join(config.uploadPath))
  rba.state = 1
  rba.products = products
  //ctx.body =rba
  try {
    products = products.filter(t => t.indexOf(".") != 0)

    ctx.body = {
      "state": 1,
      "list":
        products.map((a) => {
          return {
            "itemId": 5,
            "disabled": null,
            "typeId": 2,
            "itemMainParentId": 2,
            "itemBlockIds": null,
            "itemMultiParentIds": null,
            "itemName": a,
            "itemShortName": a,
            "itemDesc": a,
            "itemProps": null
          }
        })
      ,
      "msg":
        "ok"
    }
    // let pimProducts = await request.get(config.pim.products).timeout({ response: 5000,   deadline: 60000, })
    // ctx.body =JSON.parse(pimProducts.text)
  } catch (e) {
    ctx.body = {
      "state": 1,
      "list": [
        {
          "itemId": 5,
          "disabled": null,
          "typeId": 2,
          "itemMainParentId": 2,
          "itemBlockIds": null,
          "itemMultiParentIds": null,
          "itemName": "WKZF App",
          "itemShortName": "WKAPP",
          "itemDesc": "悟空找房移动端",
          "itemProps": null
        },
      ],
      "msg": "ok"
    }
    console.log(e.message)
  }

})

router.get(config.index.allVersionImage, async function (ctx, next) {
  let rba = _.clone(data)

  if (paramExist(ctx, "product") && paramExist(ctx, "version") && paramExist(ctx, "tag")) {
    let version = paramExist(ctx, "version")
    let product = paramExist(ctx, "product")
    let tag = paramExist(ctx, "tag")

    let links = []
    travel(path.join(config.uploadPath, product, version, tag), (pathName) => {
      if (!pathName.endsWith(".html") && !pathName.endsWith(".DS_Store"))
        links.push(pathName.replace(config.uploadPath, ""))
    })
    if(fs.existsSync(path.join(config.uploadPath, product, version, tag,"index.html"))){
      rba.indexExist=true
    }

    rba.state = 1
    rba.links = links
  } else {
    rba.state = -3
    rba.msg = "product or version or tag not present"
  }

  ctx.body = rba
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
