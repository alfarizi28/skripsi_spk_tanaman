const router = require('express').Router()
const rawInputController = require('../controllers/rawinput.controller')
const { authentication } = require('../middlewares/auth.middleware')
 
router.post('/create-rawinput', authentication, rawInputController.createRawInput)
router.get('/get-rawinput', authentication, rawInputController.getAllRawInput)
router.get('/get-rawinput/:id', authentication, rawInputController.getRawInput)
router.get('/get-rawinput/kriteria/:kriteria_id', authentication, rawInputController.getRawInputByKriteria)
router.post('/update-rawinput/:id', authentication, rawInputController.updateRawInput)
router.post('/delete-rawinput/:id', authentication, rawInputController.deleteRawInput)

module.exports = router