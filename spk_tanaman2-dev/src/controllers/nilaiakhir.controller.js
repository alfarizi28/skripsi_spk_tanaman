const nilaiAkhirService = require('../services/nilaiAkhir.service')
 
exports.hitungNilaiAkhir = async (req, res, next) => {
    try {
        const data = await nilaiAkhirService.hitungNilaiAkhir(req.userId)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

exports.getAllNilaiAkhir = async (req, res, next) => {
    try {
        const data = await nilaiAkhirService.getAllNilaiAkhir(req.userId)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}
 
exports.getAllNilaiAkhirPublic = async (req, res, next) => {
    try {
        const data = await nilaiAkhirService.getAllNilaiAkhirPublic()
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

exports.getNilaiAkhirByAlternatif = async (req, res, next) => {
    try {
        const data = await nilaiAkhirService.getNilaiAkhirByAlternatif(req.userId, req.params.alternatif_id)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

exports.deleteAllNilaiAkhir = async (req, res, next) => {
    try {
        const data = await nilaiAkhirService.deleteAllNilaiAkhir(req.userId)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}
 