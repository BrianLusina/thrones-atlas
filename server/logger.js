/**
 * Winston Logger Module
 */

const winston = require('winston')
const path = require('path')

module.exports = new winston.createLogger({
  format: winston.format.json(),
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name: 'info-file',
      filename: path.resolve(__dirname, '../info.log'),
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: path.resolve(__dirname, '../error.log'),
      level: 'error'
    })

  ]
})
