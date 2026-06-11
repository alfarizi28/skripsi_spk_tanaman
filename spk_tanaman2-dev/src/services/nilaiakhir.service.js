const NilaiAkhir = require('../schemas/nilaiakhir.schema')
const EvaluasiFaktor = require('../schemas/evaluasifaktor.schema')
const Kriteria = require('../schemas/kriteria.schema')
const mongoose = require('mongoose')
const { successResponse, errorResponse } = require('../utils/response.util')
const User = require('../schemas/user.schema')
 
exports.hitungNilaiAkhir = async (user_id) => {
    const session = await mongoose.startSession()
    session.startTransaction()
 
    try {
        const user = await User.findOne({ _id: user_id }).session(session)
        if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
        const evaluasis = await EvaluasiFaktor.find({ user_id: user_id }).session(session)
        if (evaluasis.length === 0) throw new errorResponse(400, 'Data evaluasi faktor belum ada, hitung evaluasi faktor terlebih dahulu')
 
        const kriterias = await Kriteria.find({ user_id: user_id }).session(session)
        if (kriterias.length === 0) throw new errorResponse(400, 'Data kriteria belum ada')
 
        const kriteriaMap = {}
        for (const k of kriterias) {
            kriteriaMap[k._id.toString()] = k.bobot_normalisasi || 0
        }
 
        const alternatifMap = {}
        for (const ev of evaluasis) {
            const altId = ev.alternatif_id.toString()
            if (!alternatifMap[altId]) alternatifMap[altId] = []
            alternatifMap[altId].push(ev)
        }
 
        const hasilPerAlternatif = []
 
        for (const altId of Object.keys(alternatifMap)) {
            const evList = alternatifMap[altId]
            const bobotEvaluasiList = []
            let nilaiAkhir = 0
 
            for (const ev of evList) {
                const kriteriaId = ev.kriteria_id.toString()
                const bf = kriteriaMap[kriteriaId] || 0
                const be = bf * ev.nilai_evaluasi
                const fixedBe = Math.round(be * 1000000) / 1000000
 
                nilaiAkhir += fixedBe
 
                bobotEvaluasiList.push({
                    kriteria_id: ev.kriteria_id,
                    nilai_evaluasi_faktor: ev.nilai_evaluasi,
                    nilai_bobot_evaluasi: fixedBe
                })
            }
 
            hasilPerAlternatif.push({
                alternatif_id: altId,
                bobot_evaluasi: bobotEvaluasiList,
                nilai_akhir: Math.round(nilaiAkhir * 1000000) / 1000000
            })
        }
 
        hasilPerAlternatif.sort((a, b) => b.nilai_akhir - a.nilai_akhir)
 
        await NilaiAkhir.deleteMany({ user_id: user_id }).session(session)
 
        const insertData = hasilPerAlternatif.map((item, index) => ({
            user_id: user_id,
            alternatif_id: item.alternatif_id,
            bobot_evaluasi: item.bobot_evaluasi,
            nilai_akhir: item.nilai_akhir,
            ranking: index + 1
        }))
 
        await NilaiAkhir.insertMany(insertData, { session })
 
        await session.commitTransaction()
        session.endSession()
 
        return successResponse('Berhasil menghitung Nilai Akhir', { total: insertData.length })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

exports.getAllNilaiAkhir = async (user_id) => {
    const user = await User.findOne({ _id: user_id })
    if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
    const nilaiAkhirs = await NilaiAkhir.find({ user_id: user_id })
        .populate('alternatif_id', 'alternatif')
        .populate('bobot_evaluasi.kriteria_id', 'parameter bobot_normalisasi')
        .sort({ ranking: 1 })
 
    if (!nilaiAkhirs) throw new errorResponse(500, 'Internal server error')
 
    const response = []
    for (let i = 0; i < nilaiAkhirs.length; i++) {
        response.push({
            _id: nilaiAkhirs[i]._id,
            ranking: nilaiAkhirs[i].ranking,
            alternatif: nilaiAkhirs[i].alternatif_id,
            bobot_evaluasi: nilaiAkhirs[i].bobot_evaluasi.map((be) => ({
                kriteria: be.kriteria_id,
                nilai_evaluasi_faktor: be.nilai_evaluasi_faktor,
                nilai_bobot_evaluasi: be.nilai_bobot_evaluasi
            })),
            nilai_akhir: nilaiAkhirs[i].nilai_akhir
        })
    }
 
    return successResponse('Berhasil menampilkan data', response)
}

exports.getAllNilaiAkhirPublic = async () => {
    const nilaiAkhirs = await NilaiAkhir.find({})
        .populate('user_id', 'name username')
        .populate('alternatif_id', 'alternatif')
        .populate('bobot_evaluasi.kriteria_id', 'parameter bobot_normalisasi')
        .sort({ ranking: 1 })

    if (!nilaiAkhirs) throw new errorResponse(500, 'Internal server error')

    // ✅ FIX: Group hanya berdasarkan user_id.
    // hitungNilaiAkhir sudah deleteMany sebelum insert, jadi per user
    // hanya ada 1 sesi aktif — tidak perlu membedakan berdasarkan waktu.
    const groupMap = {}
    for (let i = 0; i < nilaiAkhirs.length; i++) {
        const item = nilaiAkhirs[i]
        const userId = item.user_id ? item.user_id._id.toString() : 'unknown'
        const key = userId

        if (!groupMap[key]) {
            groupMap[key] = {
                user: item.user_id,
                created: item.createdAt,
                nilai_akhir: []
            }
        }

        // Gunakan createdAt terbaru sebagai label tanggal group
        if (item.createdAt && item.createdAt > groupMap[key].created) {
            groupMap[key].created = item.createdAt
        }

        groupMap[key].nilai_akhir.push({
            _id: item._id,
            ranking: item.ranking,
            alternatif: item.alternatif_id,
            bobot_evaluasi: item.bobot_evaluasi.map((be) => ({
                kriteria: be.kriteria_id,
                nilai_evaluasi_faktor: be.nilai_evaluasi_faktor,
                nilai_bobot_evaluasi: be.nilai_bobot_evaluasi
            })),
            nilai_akhir: item.nilai_akhir
        })
    }

    const response = Object.values(groupMap)

    return successResponse('Berhasil menampilkan data', response)
}

exports.getNilaiAkhirByAlternatif = async (user_id, alternatif_id) => {
    const user = await User.findOne({ _id: user_id })
    if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
    const nilaiAkhir = await NilaiAkhir.findOne({ user_id: user_id, alternatif_id: alternatif_id })
        .populate('alternatif_id', 'alternatif')
        .populate('bobot_evaluasi.kriteria_id', 'parameter bobot_normalisasi')
 
    if (!nilaiAkhir) throw new errorResponse(404, 'Nilai Akhir untuk alternatif ini tidak ditemukan')
 
    return successResponse('Berhasil menampilkan data', {
        _id: nilaiAkhir._id,
        ranking: nilaiAkhir.ranking,
        alternatif: nilaiAkhir.alternatif_id,
        bobot_evaluasi: nilaiAkhir.bobot_evaluasi.map((be) => ({
            kriteria: be.kriteria_id,
            nilai_evaluasi_faktor: be.nilai_evaluasi_faktor,
            nilai_bobot_evaluasi: be.nilai_bobot_evaluasi
        })),
        nilai_akhir: nilaiAkhir.nilai_akhir
    })
}

exports.deleteAllNilaiAkhir = async (user_id) => {
    const session = await mongoose.startSession()
    session.startTransaction()
 
    try {
        const user = await User.findOne({ _id: user_id }).session(session)
        if (!user) throw new errorResponse(404, 'Pengguna tidak ditemukan')
 
        const result = await NilaiAkhir.deleteMany({ user_id: user_id }).session(session)
        if (!result) throw new errorResponse(500, 'Internal server error')
 
        await session.commitTransaction()
        session.endSession()
 
        return successResponse('Berhasil menghapus semua data Nilai Akhir')
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}