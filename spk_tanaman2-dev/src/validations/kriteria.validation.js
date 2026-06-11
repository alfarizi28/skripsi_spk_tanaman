const Joi = require('joi')

exports.CREATE_KRITERIA = Joi.object({
    kode: Joi.string().required(),
    parameter: Joi.string().min(2).max(1024).required(),
    bobot: Joi.number().required()    
})

exports.UPDATE_KRITERIA = Joi.object({
    kode: Joi.string().required(),
    parameter: Joi.string().min(2).max(1024).required(),
    bobot: Joi.number().required()    
})