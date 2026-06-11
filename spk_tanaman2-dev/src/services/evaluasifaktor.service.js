const EvaluasiFaktor = require('../schemas/evaluasifaktor.schema')
const RawInput = require('../schemas/rawinput.schema')
const Alternatif = require('../schemas/alternatif.schema')
const Kriteria = require('../schemas/kriteria.schema')
const mongoose = require('mongoose')
const { successResponse, errorResponse } = require('../utils/response.util')
const User = require('../schemas/user.schema')
 
exports.hitungEvaluasiFaktor = async (user_id) => {
    const session = await mongoose.startSession()
    session.startTransaction()
 
    try {
        const user = await User.findOne({ _id: user_id }).session(session)
        if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
        
        const rawInputs = await RawInput.find({ user_id: user_id }).session(session)
        if (rawInputs.length === 0) throw new errorResponse(400, 'Data raw input belum ada')
 
       
        const kriterias = await Kriteria.find({ user_id: user_id }).session(session)
        if (kriterias.length === 0) throw new errorResponse(400, 'Data kriteria belum ada')
 
        
        await EvaluasiFaktor.deleteMany({ user_id: user_id }, { session })
 
        const insertData = []
 
        for (const kriteria of kriterias) {
            
            const rawInputsPerKriteria = rawInputs.filter(
                (r) => r.kriteria_id.toString() === kriteria._id.toString()
            )
 
            if (rawInputsPerKriteria.length === 0) continue
 
           
            const nilaiMax = Math.max(...rawInputsPerKriteria.map((r) => r.nilai_input))
 
            if (nilaiMax === 0) throw new errorResponse(400, `Nilai max kriteria ${kriteria.kode} tidak boleh 0`)
 
            for (const rawInput of rawInputsPerKriteria) {
                
                const nilaiEvaluasi = rawInput.nilai_input / nilaiMax
                const fixedNilaiEvaluasi = Math.round(nilaiEvaluasi * 100) / 100
 
                insertData.push({
                    user_id: user_id,
                    alternatif_id: rawInput.alternatif_id,
                    kriteria_id: kriteria._id,
                    nilai_evaluasi: fixedNilaiEvaluasi
                })
            }
        }
 
        if (insertData.length === 0) throw new errorResponse(400, 'Tidak ada data yang bisa dihitung')
 
        await EvaluasiFaktor.insertMany(insertData, { session })
 
        await session.commitTransaction()
        session.endSession()
 
        return successResponse('Berhasil menghitung Evaluasi Faktor', { total: insertData.length })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.getAllEvaluasiFaktor = async (user_id) => {
    const user = await User.findOne({ _id: user_id })
    if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
    const evaluasis = await EvaluasiFaktor.find({ user_id: user_id })
        .populate('alternatif_id', 'alternatif')
        .populate('kriteria_id', 'parameter bobot_normalisasi')
        .sort({ alternatif_id: 1, kriteria_id: 1 })
 
    if (!evaluasis) throw new errorResponse(500, 'Internal server error')
 
    const response = []
 
    for (let i = 0; i < evaluasis.length; i++) {
        const result = {
            _id: evaluasis[i]._id,
            alternatif: evaluasis[i].alternatif_id,
            kriteria: evaluasis[i].kriteria_id,
            nilai_evaluasi: evaluasis[i].nilai_evaluasi
        }
        response.push(result)
    }
 
    return successResponse('Berhasil menampilkan data', response)
}

exports.getEvaluasiFaktorByKriteria = async (user_id, kriteria_id) => {
    const user = await User.findOne({ _id: user_id })
    if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
    const kriteria = await Kriteria.findOne({ _id: kriteria_id, user_id: user_id })
    if (!kriteria) throw new errorResponse(404, 'Kriteria tidak ditemukan')
 
    const evaluasis = await EvaluasiFaktor.find({ user_id: user_id, kriteria_id: kriteria_id })
        .populate('alternatif_id', 'alternatif')
        .populate('kriteria_id', ' parameter  bobot_normalisasi')
        .sort({ alternatif_id: 1 })
 
    if (!evaluasis) throw new errorResponse(500, 'Internal server error')
 
    const response = []
    for (let i = 0; i < evaluasis.length; i++) {
        response.push({
            _id: evaluasis[i]._id,
            alternatif: evaluasis[i].alternatif_id,
            kriteria: evaluasis[i].kriteria_id,
            nilai_evaluasi: evaluasis[i].nilai_evaluasi
        })
    }
 
    return successResponse('Berhasil menampilkan data', response)
}
 
exports.deleteAllEvaluasiFaktor = async (user_id) => {
    // console.log('=== DELETE EVALUASI FAKTOR DIPANGGIL ===')
    // console.log('user_id:', user_id)
    const session = await mongoose.startSession()
    session.startTransaction()
 
    try {
        const user = await User.findOne({ _id: user_id }).session(session)
        if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
        const result = await EvaluasiFaktor.deleteMany({ user_id: user_id }).session(session)
        if (!result) throw new errorResponse(500, 'Internal server error')
 
        await session.commitTransaction()
        session.endSession()
 
        return successResponse('Berhasil menghapus semua data Evaluasi Faktor')
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}