const Joi = require('joi')
 
exports.CREATE_RAW_INPUT = Joi.object({
    alternatif_id: Joi.string().required(),
    kriteria_id: Joi.string().required(),
    subkriteria_id: Joi.string().required(),
    nilai_input: Joi.number().required()
})

exports.UPDATE_RAW_INPUT = Joi.object({
    alternatif_id: Joi.string().required(),
    kriteria_id: Joi.string().required(),
    subkriteria_id: Joi.string().required(),
    nilai_input: Joi.number().required()
})