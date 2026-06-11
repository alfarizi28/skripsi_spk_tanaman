const Alternatif = require('../schemas/alternatif.schema')
const altertifService = require('../services/alternatif.service')

exports.createAlternatif = async(req,res,next)=>{
    try{
        const data = await altertifService.createAlternatif(req.body, req.userId)
        res.status(201).send(data)        
    }catch (error){
        next(error)
    }
}

exports.getAllAlternatif = async(req,res,next)=>{
    try{
        const data = await altertifService.getAllAlternatif(req.userId)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}

exports.getAlternatif = async(req,res,next)=>{
    try{
        const data = await altertifService.getAlternatif(req.userId,req.params.id)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}

exports.updateAlternatif = async(req,res,next)=>{
    try{
        const data = await altertifService.updateAlternatif(req.body,req.userId,req.params.id)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}

exports.deleteAlternatif = async(req,res,next)=>{
    try{
        const data = await altertifService.deleteAlternatif(req.userId,req.params.id)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}