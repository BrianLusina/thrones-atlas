/**
 * API Routes Module
 */
const Router = require('koa-router')
const database = require('./database')
const cache = require('./cache')

const router = new Router()

// check cache before continuing to any endpoint handlers
router.use(cache.checkResponseCache)

// insert response into cache once handlers have finished
router.use(cache.addResponseToCache)

// test endpoint
router.get('/test', async ctx => {
  ctx.body = 'Hello Thrones!! \n OK'
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
