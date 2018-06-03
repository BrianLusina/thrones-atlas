/**
 * Postgres DB Module
 */
const postgres = require('pg')
const log = require('./logger')
const connectionString = process.env.DATABASE_URL

// initialize Postgres Client
const pgClient = postgres.Client({
  connectionString
})

// connect to DB
pgClient.connect().then(() => {
  log.info(`Connected to ${pgClient.database} at ${pgClient.host}:${pgClient.port}`)
}).catch(log.error)

module.exports = {
  /**
   * Query the current time
   * @return {Promise<void>}
   */
  queryTime: async () => {
    const result = await pgClient.query('SELECT NOW() as now')
    return result.rows[0]
  },

  /**
   * Query locations as geo json
   * @return {Promise<void>}
   */
  getLocations: async type => {
    const locationQuery = `SELECT ST_AsGeoJSON(geog), name, type, gid FROM locations WHERE UPPER(type) = UPPER($1);`
    const result = await pgClient.query(locationQuery, [type])
    return result.rows
  },

  /**
   * Query the kingdom boundaries
   * @return {Promise<void>}
   */
  getKingdomBoundaries: async () => {
    const boundaryQuery = `SELECT ST_AsGeoJSON(geog), name, gid FROM kingdoms;`
    const result = await pgClient.query(boundaryQuery)
    return result.rows
  },

  /**
   * Calculate the area of a given region by id
   * @param id Id of the region
   * @return {Promise<void>}
   */
  getRegionSize: async id => {
    const sizeQuery = `SELECT ST_AREA(geog) as size FROM kingdoms WHERE gid = $1LIMIT(1);`
    const result = await pgClient.query(sizeQuery, [id])
    return result.rows[0]
  },

  /**
   * Count the number of castles in a region
   * @param {String} regionId Id of the region
   * @return {Promise<void>}
   */
  countCastles: async regionId => {
    const countQuery = `
        SELECT count(*) FROM kingdoms, locations 
        WHERE ST_intersects(kingdoms.geog, locations.geog) 
        AND kingdoms.gid = $1 
        AND locations.type = 'Castle';`

    const result = await pgClient.query(countQuery, [regionId])
    return result.rows[0]
  },

  /**
   * Get the summary of a location or region
   * @param table Table to query
   * @param id of region
   * @return {Promise<void>}
   */
  getSummary: async (table, id) => {
    if (table !== 'kingdoms' && table !== 'locations') {
      throw new Error(`Invalid Table - ${table}`)
    }

    const summaryQuery = `SELECT summary, url FROM ${table} WHERE gid = $1 LIMIT(1);`
    const result = await pgClient.query(summaryQuery, [id])
    return result.rows[0]
  }
}
