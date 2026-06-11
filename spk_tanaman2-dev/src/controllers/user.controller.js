const userService = require('../services/user.service')

exports.getProfile = async(req,res,next)=>{
    try{
        const data = await userService.getProfile(req.userId)
        res.status(200).send(data)
    }catch (error){
        next(error)
    }
}