const Alternatif = require('../schemas/alternatif.schema')
const mongoose = require('mongoose')
const {successResponse,errorResponse}=require('../utils/response.util')
const alternatifValidation = require('../validations/alternatif.validation')
const User = require('../schemas/user.schema')
const validate = require('../utils/validate.util')
const { request } = require('express')


exports.createAlternatif = async(request,user_id) =>{
    
    validate(alternatifValidation.CREATE_ALTERNATIF,request)
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const user = await User.findOne({
            _id : user_id,
        }).session(session)

        if(!user) throw new errorResponse(400, 'Pengguna tidak ditemukan')

        const exsitingAlternatif = await Alternatif.findOne({
            user_id:user_id,
            $or:[
                {kode : request.kode},
                {alternatif : request.alternatif}
            ]
        }).session(session)

        if(exsitingAlternatif) throw new errorResponse(400,'kode atau alternatif sudah terpakai')
        
        const insertAlternatif = await Alternatif.create([{
            user_id : user_id,
            kode : request.kode,
            alternatif : request.alternatif,
        }],{session})

        if(!insertAlternatif) throw new errorResponse(500, 'Internal server error')
        
        await session.commitTransaction()
        session.endSession()

        return successResponse('Data Alternatif Berhasil di Buat', insertAlternatif)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.getAllAlternatif = async(user_id) =>{
    const user = await User.findOne({
        _id : user_id,
    })

    if(!user) throw new errorResponse(404,'Pengguna tidak ditemukan')
    
    const alternaties = await Alternatif.find({
        user_id:user_id
    })

    if(!alternaties) throw new errorResponse(500,'Internal server error')

    const response = []

    for(let i=0; i < alternaties.length; i++){
        const result = {
            _id : alternaties[i]._id,
            kode : alternaties[i].kode,
            alternatif : alternaties[i].alternatif
        }
        response.push(result)
    }
    return successResponse('berhasil menampilkan data',response)

}

exports.getAlternatif = async(user_id,alternatif_id)=>{
    const user = await User.findOne({
        _id : user_id,
    })

    if(!user) throw new errorResponse(404,'Pengguna tidak ditemukan')
    
    const alternaties = await Alternatif.findOne({
        user_id:user_id,
        _id : alternatif_id
    })

    if(!alternaties) throw new errorResponse (404,'Alternatif tidak di temukan')
    
    const result = {
        _id : alternaties._id,
        kode : alternaties.kode,
        alternatif : alternaties.alternatif
    }

    return successResponse('Berhasil menampilkan data',result)
}

exports.updateAlternatif = async(request,user_id,alternatif_id) =>{
    validate(alternatifValidation.UPDATE_ALTERNATIF,request)
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const user = await User.findOne({
            _id : user_id,
        }).session(session)

        if(!user) throw new errorResponse(404,'Pengguna tidak ditemukan')

        const alternaties = await Alternatif.findOne({
            user_id:user_id,
            _id : alternatif_id
        }).session(session)

        if(!alternaties) throw new errorResponse(404,'Alternatif tidak di temukan')
        
        const exsitingAlternatif = await Alternatif.findOne({
            user_id:user_id,
            $or:[
                {kode:request.kode},
                {alternatif : request.alternatif}
            ],
            _id : {$ne:alternatif_id}
        }).session(session)
        
        if(exsitingAlternatif) throw new errorResponse(400,'Kode atau Alternatif sudah digunakan')
        
        const updateAlternaties = await Alternatif.updateOne(
            {_id : alternatif_id, user_id : user_id},
            request,{session}
        )

        if(!updateAlternaties) throw new errorResponse (500,'Internal server error')
        
        await session.commitTransaction()
        session.endSession()

        return successResponse('Data Alternatif Berhasil di Perbaharui',{_id: alternatif_id})
        
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.deleteAlternatif = async(user_id,alternatif_id) =>{
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const user = await User.findOne({
            _id : user_id,
        }).session(session)

        if(!user) throw new errorResponse(404,'Pengguna tidak ditemukan')

        const alternaties = await Alternatif.findOne({
            user_id:user_id,
            _id : alternatif_id
        }).session(session)
        
        if(!alternaties) throw new errorResponse(404,'Alternatif tidak di temukan')
        
           const deleteAlternaties = await Alternatif.deleteOne(
            {_id:alternatif_id, user_id : user_id},
            {session}
       )

        if(!deleteAlternaties) throw new errorResponse (500,'Internal server error')

        await session.commitTransaction()
        session.endSession()

        return successResponse('Data Alternatif Berhasil di hapus', {_id:alternatif_id})

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}