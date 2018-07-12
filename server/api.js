/**
 * API Routes Module
 */
const Router = require('koa-router')
const database = require('./database')
// const cache = require('./cache')

const router = new Router()

// TODO: cache middleware
// check cache before continuing to any endpoint handlers
// router.use(cache.cacheMiddleware)

// test endpoint
router.get('/health', async ctx => {
  ctx.set('Content-Type', 'text/plain; charset=utf')
  ctx.body = {
    status: 'OK'
  }
})

// add the routes
router.use('/api', require('./routes').routes())

/**
 * Get the time from the database
 */
router.get('/time', async ctx => {
  const result = await database.queryTime()
  ctx.body = result
})

module.exports = router
