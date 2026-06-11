const Joi = require('joi')

exports.CREATE_ALTERNATIF = Joi.object({
    kode: Joi.string().required(),
    alternatif: Joi.string().min(2).max(1024).required(),
})

exports.UPDATE_ALTERNATIF = Joi.object({
    kode: Joi.string().required(),
    alternatif: Joi.string().min(2).max(1024).required(),
})