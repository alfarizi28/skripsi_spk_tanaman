const rawInputService = require('../services/rawinput.service')
 
exports.createRawInput = async (req, res, next) => {
    try {
        const data = await rawInputService.createRawInput(req.body, req.userId)
        res.status(201).send(data)
    } catch (error) {
        next(error)
    }
}


exports.getAllRawInput = async (req, res, next) => {
    try {
        const data = await rawInputService.getAllRawInput(req.userId)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}


exports.getRawInput = async (req, res, next) => {
    try {
        const data = await rawInputService.getRawInput(req.userId, req.params.id)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}

exports.getRawInputByKriteria = async (req, res, next) => {
    try {
        const data = await rawInputService.getRawInputByKriteria(req.userId, req.params.kriteria_id)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}
 
exports.updateRawInput = async (req, res, next) => {
    try {
        const data = await rawInputService.updateRawInput(req.body, req.userId, req.params.id)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}
 
exports.deleteRawInput = async (req, res, next) => {
    try {
        const data = await rawInputService.deleteRawInput(req.userId, req.params.id)
        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
}
 

