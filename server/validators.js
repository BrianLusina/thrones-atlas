const validate = require('koa-joi-validate')
const joi = require('joi')

// check that the type is valid
module.exports = {
  typeValidator: validate({
    params: {
      type: joi.string().valid(['castle', 'city', 'town', 'ruin', 'landmark', 'region']).required()
    }
  }),

  // check that id param is a valid number  
  idValidator: validate({
    params: {
      id: joi.number().min(0).max(1000).required()
    }
  })
}
