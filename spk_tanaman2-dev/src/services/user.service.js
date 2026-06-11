const User = require('../schemas/user.schema')
const mongoose = require ('mongoose')
const validate = require('../utils/validate.util')
const {successResponse,errorResponse}=require('../utils/response.util')
const userValidation = require('../validations/user.validation')
const moment = require('moment')

exports.getProfile = async (id) =>{
    const user = await User.findOne({
        _id : id,
    })
    console.log(id)
    if(!user) throw new errorResponse(404,'Pengguna tidak ditemukan')
    
    const result = {
        id : user._id,
        name : user.name,
        username : user.username,
        joined : moment(user.createdAt).format('DD MMM YYYY')
    }
    return successResponse('Berhasil menampilkan data', result)
}