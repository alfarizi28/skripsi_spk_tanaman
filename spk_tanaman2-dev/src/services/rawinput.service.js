const RawInput = require('../schemas/rawinput.schema')
const Alternatif = require('../schemas/alternatif.schema')
const Kriteria = require('../schemas/kriteria.schema')
const SubKriteria = require('../schemas/subkriteria.schema')
const mongoose = require('mongoose')
const { successResponse, errorResponse } = require('../utils/response.util')
const rawInputValidation = require('../validations/rawinput.validation')
const User = require('../schemas/user.schema')
const validate = require('../utils/validate.util')
 
exports.createRawInput = async (request, user_id) => {
 
    validate(rawInputValidation.CREATE_RAW_INPUT, request)
    const session = await mongoose.startSession()
    session.startTransaction()
 
    try {
        const user = await User.findOne({
            _id: user_id
        }).session(session)
 
        if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
        const alternatif = await Alternatif.findOne({
            _id: request.alternatif_id,
            user_id: user_id
        }).session(session)
 
        if (!alternatif) throw new errorResponse(404, 'Alternatif tidak ditemukan')
 
        const kriteria = await Kriteria.findOne({
            _id: request.kriteria_id,
            user_id: user_id
        }).session(session)
 
        if (!kriteria) throw new errorResponse(404, 'Kriteria tidak ditemukan')
 
        const subKriteria = await SubKriteria.findOne({
            _id: request.subkriteria_id,
            user_id: user_id,
            kriteria_id: request.kriteria_id
        }).session(session)
 
        if (!subKriteria) throw new errorResponse(404, 'SubKriteria tidak ditemukan')
 
        const existingRawInput = await RawInput.findOne({
            user_id: user_id,
            alternatif_id: request.alternatif_id,
            kriteria_id: request.kriteria_id
        }).session(session)
 
        if (existingRawInput) throw new errorResponse(400, 'Raw Input untuk alternatif dan kriteria ini sudah ada')
 
        const insertRawInput = await RawInput.create([{
            user_id: user_id,
            alternatif_id: request.alternatif_id,
            kriteria_id: request.kriteria_id,
            subkriteria_id: request.subkriteria_id,
            nilai_input: request.nilai_input
        }], { session })
 
        if (!insertRawInput) throw new errorResponse(500, 'Internal server error')
 
        await session.commitTransaction()
        session.endSession()
 
        return successResponse('Data Raw Input Berhasil di Buat', insertRawInput)
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.getAllRawInput = async (user_id) => {
    const user = await User.findOne({
        _id: user_id
    })
 
    if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
    const rawInputs = await RawInput.find({
        user_id: user_id
    })
        .populate('alternatif_id', 'alternatif')
        .populate('kriteria_id', 'parameter bobot_normalisasi')
        .populate('subkriteria_id', 'sub_kriteria ')
        .sort({ alternatif_id: 1, kriteria_id: 1 })
 
    if (!rawInputs) throw new errorResponse(500, 'Internal server error')
 
    const response = []
 
    for (let i = 0; i < rawInputs.length; i++) {
        const result = {
            _id: rawInputs[i]._id,
            alternatif: rawInputs[i].alternatif_id,
            kriteria: rawInputs[i].kriteria_id,
            subkriteria: rawInputs[i].subkriteria_id,
            nilai_input: rawInputs[i].nilai_input
        }
        response.push(result)
    }
 
    return successResponse('Berhasil menampilkan data', response)
}

exports.getRawInput = async (user_id, rawinput_id) => {
    const user = await User.findOne({
        _id: user_id
    })
 
    if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
    const rawInput = await RawInput.findOne({
        _id: rawinput_id,
        user_id: user_id
    })
        .populate('alternatif_id', 'alternatif')
        .populate('kriteria_id', 'parameter  bobot_normalisasi')
        .populate('subkriteria_id', 'sub_kriteria')
 
    if (!rawInput) throw new errorResponse(404, 'Raw Input tidak ditemukan')
 
    const result = {
        _id: rawInput._id,
        alternatif: rawInput.alternatif_id,
        kriteria: rawInput.kriteria_id,
        subkriteria: rawInput.subkriteria_id,
        nilai_input: rawInput.nilai_input
    }
 
    return successResponse('Berhasil menampilkan data', result)
}

exports.getRawInputByKriteria = async (user_id, kriteria_id) => {
    const user = await User.findOne({ _id: user_id })
    if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
    const kriteria = await Kriteria.findOne({ _id: kriteria_id, user_id: user_id })
    if (!kriteria) throw new errorResponse(404, 'Kriteria tidak ditemukan')
 
    const rawInputs = await RawInput.find({ user_id: user_id, kriteria_id: kriteria_id })
        .populate('alternatif_id', 'alternatif')
        .populate('kriteria_id', 'parameter  bobot_normalisasi')
        .populate('subkriteria_id', 'sub_kriteria')
        .sort({ alternatif_id: 1 })
 
    if (!rawInputs) throw new errorResponse(500, 'Internal server error')
 
    const response = []
    for (let i = 0; i < rawInputs.length; i++) {
        response.push({
            _id: rawInputs[i]._id,
            alternatif: rawInputs[i].alternatif_id,
            kriteria: rawInputs[i].kriteria_id,
            subkriteria: rawInputs[i].subkriteria_id,
            nilai_input: rawInputs[i].nilai_input
        })
    }
 
    return successResponse('Berhasil menampilkan data', response)
}

exports.updateRawInput = async (request, user_id, rawinput_id) => {
 
    validate(rawInputValidation.UPDATE_RAW_INPUT, request)
    const session = await mongoose.startSession()
    session.startTransaction()
 
    try {
        const user = await User.findOne({
            _id: user_id
        }).session(session)
 
        if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
        const rawInput = await RawInput.findOne({
            _id: rawinput_id,
            user_id: user_id
        }).session(session)
 
        if (!rawInput) throw new errorResponse(404, 'Raw Input tidak ditemukan')
 
        const alternatif = await Alternatif.findOne({
            _id: request.alternatif_id,
            user_id: user_id
        }).session(session)
 
        if (!alternatif) throw new errorResponse(404, 'Alternatif tidak ditemukan')
 
        const kriteria = await Kriteria.findOne({
            _id: request.kriteria_id,
            user_id: user_id
        }).session(session)
 
        if (!kriteria) throw new errorResponse(404, 'Kriteria tidak ditemukan')
 
        const subKriteria = await SubKriteria.findOne({
            _id: request.subkriteria_id,
            user_id: user_id,
            kriteria_id: request.kriteria_id
        }).session(session)
 
        if (!subKriteria) throw new errorResponse(404, 'SubKriteria tidak ditemukan')
 
        const existingRawInput = await RawInput.findOne({
            user_id: user_id,
            alternatif_id: request.alternatif_id,
            kriteria_id: request.kriteria_id,
            _id: { $ne: rawinput_id }
        }).session(session)
 
        if (existingRawInput) throw new errorResponse(400, 'Raw Input untuk alternatif dan kriteria ini sudah ada')
 
        const updateRawInput = await RawInput.updateOne(
            { _id: rawinput_id, user_id: user_id },
            request,
            { session }
        )
 
        if (!updateRawInput) throw new errorResponse(500, 'Internal server error')
 
        await session.commitTransaction()
        session.endSession()
 
        return successResponse('Data Raw Input Berhasil di perbaharui', { _id: rawinput_id })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.deleteRawInput = async (user_id, rawinput_id) => {
    // console.log('=== DELETE RAW INPUT DIPANGGIL ===')
    // console.log('user_id:', user_id, 'rawinput_id:', rawinput_id)
    const session = await mongoose.startSession()
    session.startTransaction()
 
    try {
        const user = await User.findOne({
            _id: user_id
        }).session(session)
 
        if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
        const rawInput = await RawInput.findOne({
            _id: rawinput_id,
            user_id: user_id
        }).session(session)
 
        if (!rawInput) throw new errorResponse(404, 'Raw Input tidak ditemukan')
 
        const deleteRawInput = await RawInput.deleteOne(
            { _id: rawinput_id, user_id: user_id },
            { session }
        )
 
        if (!deleteRawInput) throw new errorResponse(500, 'Internal server error')
 
        await session.commitTransaction()
        session.endSession()
 
        return successResponse('Data Raw Input Berhasil di hapus', { _id: rawinput_id })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}