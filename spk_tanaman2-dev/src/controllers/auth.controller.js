const authService = require('../services/auth.service')

exports.register = async(req,res,next)=>{
    try{
        const data = await authService.register(req.body)
        res.status(201).send(data)
    }catch (error){
        next(error)
    }
}

exports.login = async(req,res,next)=>{
    try{
        const data = await authService.login(req.body)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}

exports.logout = async(req,res,next)=>{
    try{
        const data = await authService.logout(req.body)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const data = await authService.changePassword(req.user.id, req.body)

        res.status(200).send(data)
    } catch (error) {
        next (error)
    }
}