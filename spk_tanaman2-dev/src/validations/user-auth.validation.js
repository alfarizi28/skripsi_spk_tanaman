const Joi = require('joi')

exports.REGISTER = Joi.object({
    name:Joi.string().required().min(3).max(50),
    username:Joi.string().required().min(3).max(12),
    password:Joi.string().required().min(6).max(1024)
})

exports.LOGIN = Joi.object({
    username:Joi.string().required().min(3).max(12),
    password:Joi.string().required().min(6).max(1024)
})

exports.CHANGE_PASSWORD = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().min(6).max(1024).required(),
    confirm_password: Joi.string().min(6).max(1024).required()
})