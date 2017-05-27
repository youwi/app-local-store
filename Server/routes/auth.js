const router = require('koa-router')()
const config = require("../../config")


router.get(config.index.userinfo, function (ctx, next) {

  ctx.body = 'this is a users response!'+i
})



module.exports = router
