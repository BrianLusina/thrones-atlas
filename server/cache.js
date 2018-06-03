/**
 * Redis Cache Module
 */
const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST)

module.exports = {
  // Koa middleware to check cache before continuing to any endpoint handlers
  async checkResponseCache (ctx, next) {
    const cachedResponse = redis.get(ctx.path)
    // if the cached response exists
    if (cachedResponse) {
      ctx.body = JSON.parse(cachedResponse)
    } else {
      // only continue if result not in cache
      await next()
    }
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
