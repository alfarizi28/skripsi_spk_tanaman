const Kriteria = require('../schemas/kriteria.schema')
const kriteriaService = require('../services/kriteria.service')


exports.createKriteria = async(req,res,next)=>{
    try{
        const data = await kriteriaService.createKriteria(req.body,req.userId)
        res.status(201).send(data)
    }catch (error){
        next(error)
    }
}

exports.getAllKriteria = async(req,res,next)=>{
    try{
        const data = await kriteriaService.getAllKriteria(req.userId)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}

exports.getKriteria = async(req,res,next)=>{
    try{
        const data = await kriteriaService.getKriteria(req.userId,req.params.id)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}

exports.updateKriteria = async(req,res,next)=>{
    try{
        const data = await kriteriaService.updateKriteria(req.body,req.userId,req.params.id)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}

exports.deleteKriteria = async(req,res,next)=>{
    try{
        const data = await kriteriaService.deleteKriteria(req.userId,req.params.id)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}

exports.normalize = async (req, res, next) => {
    try {
        const data = await kriteriaService.normalize(req.userId)

        res.status(200).send(data)
    } catch (error) {
        next (error)
    }
}
