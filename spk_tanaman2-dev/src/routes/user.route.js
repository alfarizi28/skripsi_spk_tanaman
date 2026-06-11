const router = require ('express').Router()
const userController = require('../controllers/user.controller')
const { authentication } = require('../middlewares/auth.middleware')


router.get('/get-profile',authentication,userController.getProfile)



module.exports = router