const evaluasiFaktorService = require('../services/evaluasifaktor.service')
 
exports.hitungEvaluasiFaktor = async (req, res, next) => {
    try {
        const data = await evaluasiFaktorService.hitungEvaluasiFaktor(req.userId)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

exports.getAllEvaluasiFaktor = async (req, res, next) => {
    try {
        const data = await evaluasiFaktorService.getAllEvaluasiFaktor(req.userId)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}
 
exports.getEvaluasiFaktorByKriteria = async (req, res, next) => {
    try {
        const data = await evaluasiFaktorService.getEvaluasiFaktorByKriteria(req.userId, req.params.kriteria_id)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

exports.deleteAllEvaluasiFaktor = async (req, res, next) => {
    try {
        const data = await evaluasiFaktorService.deleteAllEvaluasiFaktor(req.userId)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}
 