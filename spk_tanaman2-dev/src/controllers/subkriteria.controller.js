const subKriteriaService = require('../services/subkriteria.service')
 
exports.createSubKriteria = async (req, res, next) => {
    try {
        const data = await subKriteriaService.createSubKriteria(req.body,req.userId)
        res.status(201).send(data)
    } catch (error) {
        next(error)
    }
}
 
exports.getAllSubKriteria = async (req, res, next) => {
    try {
        const data = await subKriteriaService.getAllSubKriteria(req.userId)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

exports.getSubKriteria = async (req, res, next) => {
    try {
        const data = await subKriteriaService.getSubKriteria(req.userId, req.params.id)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

exports.getSubKriteriaByKriteria = async (req, res, next) => {
    try {
        const data = await subKriteriaService.getSubKriteriaByKriteria(req.userId, req.params.kriteria_id)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

exports.updateSubKriteria = async (req, res, next) => {
    try {
        const data = await subKriteriaService.updateSubKriteria(req.body, req.userId, req.params.id)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

exports.deleteSubKriteria = async (req, res, next) => {
    try {
        const data = await subKriteriaService.deleteSubKriteria(req.userId, req.params.id)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}