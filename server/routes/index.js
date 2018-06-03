const Router = require('koa-router')

const router = new Router()

// use the given routes
router.use('/locations', require('./locations'))
router.use('/kingdoms', require('./kingdoms'))

module.exports = router
