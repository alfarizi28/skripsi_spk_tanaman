const router = require ('express').Router()
const authController = require ('../controllers/auth.controller')
const { authentication } = require('../middlewares/auth.middleware')

router.post('/register',authController.register)
router.post('/login',authController.login)
router.post('/logout', authentication, authController.logout)
router.post('/change-password', authentication, authController.changePassword)


module.exports = router