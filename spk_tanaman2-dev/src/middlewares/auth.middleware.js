require('dotenv').config()
const jwt = require('jsonwebtoken')
const { errorResponse } = require('../utils/response.util')

exports.authentication = async (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, process.env.SESSION_KEY, (err, decode) => {
            if (err) {
                res.status(403).json({
                    status_code: 403,
                    message: 'Token Tidak Valid, Silahkan Login Ulang'
                })
                return
            } else {
                req.user = decode
                req.userId = decode.id
                next()
            }
        })
    } else {
        res.status(401).json({
            status_code: 401,
            message: 'Token tidak ditemukan dalam header Authorization.'
        })
        return
    }
}