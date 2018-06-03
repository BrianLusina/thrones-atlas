const validate = require('koa-joi-validate')
const joi = require('joi')

// check that id param is a valid number
export const idValidator = validate({
  params: {
    id: joi.number().min(0).max(1000).required()
  }
})

// check that the type is valid
export const typeValidator = validate({
  params: {
    type: joi.string().valid(['castle', 'city', 'town', 'ruin', 'landmark', 'region']).required()
  }
})
