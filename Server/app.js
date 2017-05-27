const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaBody = require('koa-body');

const index = require('./routes/index')
const users = require('./routes/users')
const auth  = require("./routes/auth")
const cors = require('koa2-cors');
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
//app.use(koaBody());
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(cors());


app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(auth.routes(), auth.allowedMethods())

module.exports = app
