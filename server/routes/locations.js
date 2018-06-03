const Router = require('koa-router')
const typeValidator = require('../validators').typeValidator
const idValidator = require('../validators').idValidator
const database = require('../database')

const router = new Router()

/**
 * Gets the type of the given location
 */
router.get('/:type',
  typeValidator, async ctx => {
    const type = ctx.params.type
    const results = await database.getLocations(type)
    if (results.length === 0) {
      ctx.throw(404)
    }

    // add row metadata as geojson properties

    const locations = results.map(({
      st_asgeojson,
      name,
      type,
      gid
    }) => {
      let geojson = JSON.parse(st_asgeojson)
      geojson.properties = {
        name,
        type,
        id: gid
      }
      return geojson
    })

    ctx.body = locations
  })

/**
 * Gets the summary of a given location
 */
router.use('/:id/summary', idValidator, async ctx => {
  const id = ctx.params.id
  const result = await database.getSummary('locations', id)
  ctx.body = result || ctx.throw(404)
})

module.exports = router
