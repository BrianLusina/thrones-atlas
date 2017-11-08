require('dotenv').config();
const Koa = require('koa');
const cors = require('kcors');
const log = require('./logger');
const api = require('./api');


const app = Koa();
const port = process.env.PORT || 8000;
const origin = process.env.CORS_ORIGIN | "*";
app.use(cors({ origin }));

// log requests
app.use(async (ctx, next) => {
    const start = Date.now();
    // This will pause this function until the endpoint handler has resolved
    await next();
    const responseTime = Date.now() - start;
    log.info(`${ctx.method} ${ctx.status} ${ctx.url} - ${responseTime} ms`);
});

/**
 * Error handler, all errors will percolate up to here
 * */
app.use(async (ctx, next) => {
   try{
       await next();
   }catch (err){
       ctx.status = err.status || 500;
       ctx.body = err.message;
       log.error(`Request ${ctx.url} - ${err.message}`)
   }
});

app.use(api.routes(), api.allowedMethods());

/**
 * Run application
 * */
app.listen(port, () => { log.info(`App listening on port ${port}`) });