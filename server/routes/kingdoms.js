const Router = require('koa-router')
const database = require('../database')
const idValidator = require('../validators').idValidator

const router = new Router()

router.get('/', async ctx => {
  const results = await database.getKingdomBoundaries()
  if (results.length === 0) {
    ctx.throw(404)
  }

  // add row metadata as geojson properties
  const boundaries = results.map(({
    st_asgeojson,
    name,
    gid
  }) => {
    let geojson = JSON.parse(st_asgeojson)
    geojson.properties = {
      name,
      id: gid
    }
    return geojson
  })

  ctx.body = boundaries
})

/**
 * get the size of a given kingdom
 */
router.get('/:id/size', idValidator, async ctx => {
  const id = ctx.params.id
  const result = await database.getRegionSize(id)
  if (!result) {
    ctx.throw(404)
  }

  // convert size in square meters to square km
  const sqKm = result.size * (10 ** -6)
  ctx.body = sqKm
})

/**
 * Get the summary for a given kingdom
 */
router.get('/:id/summary', idValidator, async ctx => {
  const id = ctx.params.id
  const result = await database.getSummary('kingdoms', id)
  ctx.body = result || ctx.throw(404)
})

/**
 * Get the number of castles for a given kingdome
 */
router.get('/:id/castles', idValidator, async ctx => {
  const id = ctx.params.id
  const result = await database.countCastles(id)
  ctx.body = result ? result.count : ctx.throw(404)
})

module.exports = router
