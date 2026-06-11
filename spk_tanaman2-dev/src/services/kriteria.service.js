const Kriteria = require('../schemas/kriteria.schema')
const mongoose = require ('mongoose')
const {successResponse,errorResponse}=require('../utils/response.util')
const kriteriaValidation = require('../validations/kriteria.validation')
const User = require('../schemas/user.schema')
const validate = require('../utils/validate.util')
const { request } = require('express')


exports.createKriteria = async(request,user_id) =>{
 
    validate(kriteriaValidation.CREATE_KRITERIA,request)
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const user = await User.findOne({
            _id : user_id,
        }).session(session)

        if(!user) throw new errorResponse(400, 'Pengguna tidak ditemukan')
        
        const existingKriteria = await Kriteria.findOne({
            user_id:user_id, 
            $or:[
                {kode : request.kode},
                {parameter: request.parameter}
            ]
        }).session(session)

        if(existingKriteria) throw new errorResponse(400,'Kode atau Parameter sudah terpakai')
        
        const inserKriteria = await Kriteria.create([{
            user_id : user_id,
            kode : request.kode,
            parameter : request.parameter,
            bobot : request.bobot,
            
        }],{session})

        if(!inserKriteria) throw new errorResponse(500,'Internal server error')

        await session.commitTransaction()
        session.endSession()

        return successResponse('Data Kriteria Berhasil di Buat', inserKriteria)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.getAllKriteria = async (user_id) =>{
    const user = await User.findOne({
        _id : user_id,
    })

    if(!user) throw new errorResponse(404,'Pengguna tidak ditemukan')
    
    const kriterias = await Kriteria.find({
        user_id:user_id
    })
    
    if(!kriterias) throw new errorResponse(500,'Internal server error')

    const response = []

    for(let i=0; i < kriterias.length; i++){
        const result = {
            _id : kriterias[i]._id,
            kode : kriterias[i].kode,
            parameter: kriterias[i].parameter,
            bobot : kriterias[i].bobot,
            bobot_normalisasi : kriterias[i].bobot_normalisasi ||0
        }
        response.push(result)
    }
    return successResponse('Berhasil menampilkan data', response)
}

exports.getKriteria = async(user_id,kriteria_id) =>{
    const user = await User.findOne({
        _id : user_id,
    })

    if(!user) throw new errorResponse(404,'Pengguna tidak ditemukan')

    const kriterias = await Kriteria.findOne({
        user_id:user_id,
        _id : kriteria_id
    })
    
    if(!kriterias) throw new errorResponse(404,'Kriteria tidak di temukan')
        
    const result = {
        _id : kriterias._id,
        kode : kriterias.kode,
        parameter : kriterias.parameter,
        bobot : kriterias.bobot,
        bobot_normalisasi : kriterias.bobot_normalisasi||0
    }
    return successResponse('Berhasil menampilkan data', result)
}

exports.updateKriteria = async(request,user_id,kriteria_id) =>{
    
    validate(kriteriaValidation.UPDATE_KRITERIA,request)
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const user = await User.findOne({
            _id : user_id,
        }).session(session)

        if(!user) throw new errorResponse(404,'Pengguna tidak ditemukan')

        const kriterias = await Kriteria.findOne({
            user_id:user_id,
            _id : kriteria_id
        }).session(session)
        
        if(!kriterias) throw new errorResponse(404,'Kriteria tidak di temukan')

        const existingKriteria = await Kriteria.findOne({
            user_id:user_id, 
            $or:[
                {kode : request.kode},
                {parameter: request.parameter}
            ],
            _id : {$ne:kriteria_id}
        }).session(session)

        if(existingKriteria) throw new errorResponse(400,'Kode atau Parameter sudah terpakai')

        const updateKriterias = await Kriteria.updateOne(
            {_id : kriteria_id, user_id : user_id},
            request,{session}
        )

        if(!updateKriterias) throw new errorResponse (500,'Internal server error')
        
        await session.commitTransaction()
        session.endSession()

        return successResponse('Data Kriteria Berhasil di perbaharui', {_id:kriteria_id})

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
    
}

exports.deleteKriteria = async(user_id,kriteria_id) =>{
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const user = await User.findOne({
            _id : user_id,
        }).session(session)

        if(!user) throw new errorResponse(404,'Pengguna tidak ditemukan')

        const kriterias = await Kriteria.findOne({
            user_id:user_id,
            _id : kriteria_id
        }).session(session)
        
        if(!kriterias) throw new errorResponse(404,'Kriteria tidak di temukan')

       const deletekriterias = await Kriteria.deleteOne(
            {_id:kriteria_id, user_id : user_id},
            {session}
       )

        if(!deletekriterias) throw new errorResponse (500,'Internal server error')

        await session.commitTransaction()
        session.endSession()

        return successResponse('Data Kriteria Berhasil di hapus', {_id:kriteria_id})

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.normalize = async (user_id) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const user = await User.findOne({
            _id: user_id
        }).session(session)

        if (!user) throw new errorResponse(400, 'Pengguna tidak ditemukan')

        const kriterias = await Kriteria.find({
            user_id: user_id
        }).session(session)

        if (kriterias.length == 0) throw new errorResponse(400, 'Data kriteria tidak ada')

        const totalBobot = kriterias.reduce((total, item) => total + (item.bobot || 0), 0)

        for (const item of kriterias) {
            const normalizeBobot = item.bobot / totalBobot
            const fixedNormalizeBobot = Math.floor(normalizeBobot * 10000) / 10000

            const updateKriteria = await Kriteria.updateOne(
                {
                    _id: item._id,
                    user_id: user_id
                },
                { bobot_normalisasi: fixedNormalizeBobot },
                { session }
            )

            if (!updateKriteria) throw new errorResponse(500, 'Internal server error')
        }

        await session.commitTransaction()
        session.endSession()

        return successResponse('Berhasil normalisasi data Kriteria')
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}