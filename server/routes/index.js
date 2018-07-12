const Router = require('koa-router')

const router = new Router()

// use the given routes
router.use('/locations', require('./locations').routes())
router.use('/kingdoms', require('./kingdoms').routes())

module.exports = router
