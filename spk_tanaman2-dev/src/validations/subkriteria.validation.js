const Joi = require('joi')
 
exports.CREATE_SUBKRITERIA = Joi.object({
    kriteria_id: Joi.string().required(),
    sub_kriteria: Joi.string().min(1).max(1024).required(),
    deskripsi: Joi.string().max(1024).optional().allow(''),
    bobot: Joi.number().required()
})

exports.UPDATE_SUBKRITERIA = Joi.object({
    kriteria_id: Joi.string().required(),
    sub_kriteria: Joi.string().min(1).max(1024).required(),
    deskripsi: Joi.string().max(1024).optional().allow(''),
    bobot: Joi.number().required()
})
 