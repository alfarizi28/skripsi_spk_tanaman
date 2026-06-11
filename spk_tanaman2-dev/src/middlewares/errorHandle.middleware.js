const errorHandle = (err,req,res,next) =>{
    const statusCode = err.status||500
    const message = err.message||'Internal Server error'
    res.status(statusCode).json({
        succes: false,
        message
    })
} 

module.exports = errorHandle