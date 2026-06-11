const User = require('../schemas/user.schema')
const mongoose = require ('mongoose')
const validate = require('../utils/validate.util')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv')

const {successResponse,errorResponse}=require('../utils/response.util')
const userAuthValidation = require('../validations/user-auth.validation')

exports.register = async(request) =>{
 
    validate(userAuthValidation.REGISTER,request)
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const existingUser = await User.findOne({
            username:request.username
        }).session(session)
        if(existingUser) throw new errorResponse(400,'Username telah di gunakan')
        
        const hashedPassword = await bcrypt.hash(request.password,10)
        
        const insertUser = await User.create([{
            name:request.name,
            username: request.username,
            password:hashedPassword
        }],{session})

        if(!insertUser) throw new errorResponse(500, 'Internal server error')

        await session.commitTransaction()
        session.endSession()
        return successResponse('Pendaftaran Berhasil', insertUser)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.login = async(request) =>{
    validate(userAuthValidation.LOGIN,request)
    try {
        const user = await User.findOne({
            username:request.username
        })
        if(!user) throw new errorResponse(400,'Username tidak terdaftar')
        
        const itsmatch = await bcrypt.compare(request.password, user.password)
        if(!itsmatch) throw new errorResponse(401,'Password salah')
        
        const token = jwt.sign(
            {
                id : user._id,
                username : user.username
            },
            process.env.SESSION_KEY,
            {
                expiresIn:'24h'
            }
        )
        const response ={
            token : token,
            id : user._id,
            username : user.username
        }
        return successResponse('Login berhasil', response)
    } catch (error) {
        throw error
    }
}

exports.logout = async() =>{
    return successResponse('Logout telah berhasil')
}

exports.changePassword = async (userId, request) => {
    validate(userAuthValidation.CHANGE_PASSWORD, request)

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const user = await User.findOne({ _id: userId }).session(session)

        if (!user) throw new errorResponse(500, 'internal server error')

        const isMatch = await bcrypt.compare(request.old_password, user.password)
        if (!isMatch) throw new errorResponse(400, 'Password lama salah')

        const isMatchNewPassword = await bcrypt.compare(request.new_password, user.password)
        if (isMatchNewPassword) throw new errorResponse(400, 'Password baru tidak boleh sama dengan password lama')

        if (request.new_password !== request.confirm_password) throw new errorResponse(400, 'Konfirmasi password tidak sama')
        
        const hashedNewPassword = await bcrypt.hash(request.new_password, 10)

        await User.updateOne(
            { _id: userId },
            { $set: { password: hashedNewPassword }}, 
            { session }
        )

        await session.commitTransaction();
        session.endSession();

        return successResponse('Berhasil ganti password')
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}