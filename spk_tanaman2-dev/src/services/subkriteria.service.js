const SubKriteria = require('../schemas/subkriteria.schema')
const Kriteria = require('../schemas/kriteria.schema')
const mongoose = require('mongoose')
const { successResponse, errorResponse } = require('../utils/response.util')
const subKriteriaValidation = require('../validations/subkriteria.validation')
const validate = require('../utils/validate.util')
const User = require('../schemas/user.schema')

exports.createSubKriteria = async(request,user_id) =>{
    validate(subKriteriaValidation.CREATE_SUBKRITERIA, request)
    const session = await mongoose.startSession()
    session.startTransaction()
 
    try {
        const user = await User.findOne({
            _id: user_id
        }).session(session)
 
        if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
        const kriteria = await Kriteria.findOne({
            _id: request.kriteria_id,
            user_id: user_id
        }).session(session)
 
        if (!kriteria) throw new errorResponse(404, 'Kriteria tidak ditemukan')
 
        const existingSubKriteria = await SubKriteria.findOne({
            user_id: user_id,
            kriteria_id: request.kriteria_id,
            sub_kriteria: request.sub_kriteria
        }).session(session)
 
        if (existingSubKriteria) throw new errorResponse(400, 'Sub Kriteria sudah terpakai')
 
        const insertSubKriteria = await SubKriteria.create([{
            user_id: user_id,
            kriteria_id: request.kriteria_id,
            sub_kriteria: request.sub_kriteria,
            deskripsi: request.deskripsi || '',
            bobot: request.bobot
        }], { session })
 
        if (!insertSubKriteria) throw new errorResponse(500, 'Internal server error')
 
        await session.commitTransaction()
        session.endSession()
 
        return successResponse('Data SubKriteria Berhasil di Buat', insertSubKriteria)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.getAllSubKriteria = async(user_id) =>{
    const user = await User.findOne({
        _id: user_id
    })
 
    if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
    const subKriterias = await SubKriteria.find({
        user_id: user_id
    })
        .populate('kriteria_id', 'kode parameter bobot bobot_normalisasi')
        .sort({ kriteria_id: 1, bobot: -1 })
 
    if (!subKriterias) throw new errorResponse(500, 'Internal server error')
 
    const response = []
 
    for (let i = 0; i < subKriterias.length; i++) {
        const result = {
            _id: subKriterias[i]._id,
            kriteria: subKriterias[i].kriteria_id,
            sub_kriteria: subKriterias[i].sub_kriteria,
            deskripsi: subKriterias[i].deskripsi || '',
            bobot: subKriterias[i].bobot
        }
        response.push(result)
    }
 
    return successResponse('Berhasil menampilkan data', response)
}

exports.getSubKriteria = async(user_id,subkriteria_id) =>{
    const user = await User.findOne({
        _id: user_id
    })
 
    if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
    const subKriteria = await SubKriteria.findOne({
        _id: subkriteria_id,
        user_id: user_id
    }).populate('kriteria_id', 'kode parameter bobot bobot_normalisasi')
 
    if (!subKriteria) throw new errorResponse(404, 'SubKriteria tidak ditemukan')
 
    const result = {
        _id: subKriteria._id,
        kriteria: subKriteria.kriteria_id,
        sub_kriteria: subKriteria.sub_kriteria,
        deskripsi: subKriteria.deskripsi || '',
        bobot: subKriteria.bobot
    }
 
    return successResponse('Berhasil menampilkan data', result)
}

exports.getSubKriteriaByKriteria = async (user_id,kriteria_id) =>{
    const user = await User.findOne({
        _id: user_id
    })
 
    if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
    const kriteria = await Kriteria.findOne({
        _id: kriteria_id,
        user_id: user_id
    })
 
    if (!kriteria) throw new errorResponse(404, 'Kriteria tidak ditemukan')
 
    const subKriterias = await SubKriteria.find({
        user_id: user_id,
        kriteria_id: kriteria_id
    })
        .populate('kriteria_id', 'kode parameter bobot bobot_normalisasi')
        .sort({ bobot: -1 })
 
    if (!subKriterias) throw new errorResponse(500, 'Internal server error')
 
    const response = []
 
    for (let i = 0; i < subKriterias.length; i++) {
        const result = {
            _id: subKriterias[i]._id,
            kriteria: subKriterias[i].kriteria_id,
            sub_kriteria: subKriterias[i].sub_kriteria,
            deskripsi: subKriterias[i].deskripsi || '',
            bobot: subKriterias[i].bobot
        }
        response.push(result)
    }
 
    return successResponse('Berhasil menampilkan data', response)
}

exports.updateSubKriteria = async(request, user_id, subkriteria_id) =>{
    validate(subKriteriaValidation.UPDATE_SUBKRITERIA, request)
    const session = await mongoose.startSession()
    session.startTransaction()
 
    try {
        const user = await User.findOne({
            _id: user_id
        }).session(session)
 
        if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
        const subKriteria = await SubKriteria.findOne({
            _id: subkriteria_id,
            user_id: user_id
        }).session(session)
 
        if (!subKriteria) throw new errorResponse(404, 'SubKriteria tidak ditemukan')
 
        const kriteria = await Kriteria.findOne({
            _id: request.kriteria_id,
            user_id: user_id
        }).session(session)
 
        if (!kriteria) throw new errorResponse(404, 'Kriteria tidak ditemukan')
 
        const existingSubKriteria = await SubKriteria.findOne({
            user_id: user_id,
            kriteria_id: request.kriteria_id,
            sub_kriteria: request.sub_kriteria,
            _id: { $ne: subkriteria_id }
        }).session(session)
 
        if (existingSubKriteria) throw new errorResponse(400, 'Sub Kriteria sudah terpakai')
 
        const updateSubKriteria = await SubKriteria.updateOne(
            { _id: subkriteria_id, user_id: user_id },
            request,
            { session }
        )
 
        if (!updateSubKriteria) throw new errorResponse(500, 'Internal server error')
 
        await session.commitTransaction()
        session.endSession()
 
        return successResponse('Data SubKriteria Berhasil di perbaharui', { _id: subkriteria_id })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.deleteSubKriteria = async (user_id, subkriteria_id) => {
    const session = await mongoose.startSession()
    session.startTransaction()
 
    try {
        const user = await User.findOne({
            _id: user_id
        }).session(session)
 
        if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
        const subKriteria = await SubKriteria.findOne({
            _id: subkriteria_id,
            user_id: user_id
        }).session(session)
 
        if (!subKriteria) throw new errorResponse(404, 'SubKriteria tidak ditemukan')
 
        const deleteSubKriteria = await SubKriteria.deleteOne(
            { _id: subkriteria_id, user_id: user_id },
            { session }
        )
 
        if (!deleteSubKriteria) throw new errorResponse(500, 'Internal server error')
 
        await session.commitTransaction()
        session.endSession()
 
        return successResponse('Data SubKriteria Berhasil di hapus', { _id: subkriteria_id })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}