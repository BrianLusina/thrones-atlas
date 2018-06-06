require('dotenv').config()
const Koa = require('koa')
const cors = require('kcors')
const log = require('./logger')
const api = require('./api')

// SETUP KOA
const app = new Koa()
const port = process.env.PORT || 5000

// apply cors
const origin = process.env.CORS_ORIGIN || '*'
app.use(cors({
  origin
}))

// log all requests
app.use(async (ctx, next) => {
  const start = Date.now()
  // this will pause the control flow until the endpoint handler is resolved
  await next()
  const responseTime = Date.now() - start
  log.info(`${ctx.method} ${ctx.status} ${ctx.url} - ${responseTime} ms`)
})

// error handler
// all uncaught exceptions will percolate upto here
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.status = error.status || 500
    log.error(`Request Error ${ctx.url} - ${error.message}`)
    log.error(`Error ${error}`)
  }
})

// apply default header responses
app.use(async (ctx, next) => {
  await next()
  ctx.set('Content-Type', 'text/plain; charset=utf')
  ctx.set('Cache-Control', 'public, max-age=3600')
})

// mount routes
app.use(api.routes(), api.allowedMethods())

// start the application
app.listen(port, () => {
  log.info(`Server listening at port ${port}`)
})
