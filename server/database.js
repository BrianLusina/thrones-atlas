/**
 * Postgres DB Module
 */
const postgres = require("pg");
const log = require("./logger");
const connectionString = process.env.DATABASE_URL;

// initialize a new postgress client
const client = postgres.Client({ connectionString });

client.connect().then(() => {
   log.info(`Connected to ${client.database} at ${client.host}:${client.port}`)
}).catch(err => {
    log.error(`Failed to connect to database with error ${err}`)
});