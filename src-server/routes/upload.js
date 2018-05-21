const router = require('koa-router')()
const config = require("../../config")
const _ = require("lodash")
require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const Base64 = require('js-base64').Base64;
const fs = require('fs')
const path = require('path')
const unzip = require("unzip");
const adm_zip = require('adm-zip');

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
  if (ctx.request && ctx.request.body && ctx.request.body.fields) {
    if (ctx.request.body.fields[name] != null) {
      return ctx.request.body.fields[name] || true
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

router.post(config.index.uploadzip, async function (ctx, next) {
  let rba = _.clone(data)
  if (paramExist(ctx, "version") && paramExist(ctx, "product") && paramExist(ctx, "tag")) {
    let version = paramExist(ctx, "version")
    let product = paramExist(ctx, "product")
    let tag = paramExist(ctx, "tag")

    let tagDir = path.join(config.uploadPath, product, version, tag)
    let versionDir = path.join(config.uploadPath, product, version)
    if (!fs.existsSync(tagDir)) {
      mkdirsSync(tagDir)
    }

    let nameList = []
    if (ctx.request.body.files) {
      for (let name in ctx.request.body.files) {
        let file = ctx.request.body.files[name]
        let newpath = path.join(tagDir, file.name);

        if (endWith(file.name, ".zip")) {
          // let stream = fs.createWriteStream(path.join(versionDir,file.name));//创建一个可写流
          // fs.createReadStream(file.path).pipe(stream);//可读流通过管道写入可写流

          let zipFile = new adm_zip(file.path);
          zipFile.extractAllTo(versionDir, /*overwrite*/true);
        } else {
          let stream = fs.createWriteStream(newpath);//创建一个可写流
          fs.createReadStream(file.path).pipe(stream);//可读流通过管道写入可写流
        }

        nameList.push(path.join(product, version, tag, file.name))
      }
    }

    rba.state = 1
    rba.links = nameList
    ctx.body = rba
  } else {
    rba.msg = "error,arg not present"
    rba.state = 0
    ctx.body = rba
  }

})

function endWith(str, pix) {
  let reg = new RegExp(pix + "$");
  return reg.test(str);
}

var mkdirs = function (dirpath, mode, callback) {
  fs.exists(dirpath, function (exists) {
    if (exists) {
      callback(dirpath);
    } else {
      //尝试创建父目录，然后再创建当前目录
      mkdirs(path.dirname(dirpath), mode, function () {
        fs.mkdir(dirpath, mode, callback);
      });
    }
  });
};

function mkdirsSync(dirpath, mode) {
  if (!fs.existsSync(dirpath)) {
    var pathtmp;
    dirpath.split(path.sep).forEach(function (dirname) {
      if (dirname === "") return
      if (pathtmp) {
        pathtmp = path.join(pathtmp, dirname);
      }
      else {
        pathtmp = dirname;
      }
      if (!fs.existsSync(pathtmp)) {
        if (!fs.mkdirSync(pathtmp, mode)) {
          return false;
        }
      }
    });
  }
  return true;
}

module.exports = router
