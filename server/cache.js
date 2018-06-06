/**
 * Redis Cache Module
 */
const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST)

// TODO: fix redis issues
module.exports = {
  // Koa middleware to check cache before continuing to any endpoint handlers
  checkResponseCache (ctx, next) {
    redis.get(ctx.path).then(response => {
      ctx.body = JSON.parse(response)
    }).catch(error => {
      console.log(error)
      next()
    })
  },

  /**
   * Koa middleware to insert responses to cache
   */
  async addResponseToCache (ctx, next) {
    // wait until other handlers have finished
    await next()
    // if the request was successfull
    if (ctx.body && ctx.status === 200) {
      // cache the response
      await redis.set(ctx.path, JSON.stringify(ctx.body))
    }
  }
}
