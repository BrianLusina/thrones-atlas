/**
 * Redis Cache Module
 */

const redis = require('redis')
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

// create redis middleware
module.exports = {

  cacheMiddleware (ctx, next) {
    let key = ctx.path
    console.log(`Cache middleware path key ${key}`)
    client.get(key, function (err, reply) {
      if (reply) {
        ctx.body = JSON.parse(reply)
        console.log(`Cache middleware body ${ctx.body}`)
      } else {
        next()
        console.log(`Cache middleware next ${ctx.body}, ${ctx.status}`)
        // if the request was successfull
        if (ctx.body && ctx.status === 200) {
          // cache the response
          client.set(key, JSON.stringify(ctx.body))
        }
      }
      console.log(`Error in Cache middleware ${err}`)
    })
  }
}
