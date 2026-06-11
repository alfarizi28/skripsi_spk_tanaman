const router = require ('express').Router()
const alternatifController = require('../controllers/alternatif.controller')
const { authentication } = require('../middlewares/auth.middleware')

router.post('/create-alternatif',authentication,alternatifController.createAlternatif)
router.get('/get-alternatif',authentication,alternatifController.getAllAlternatif)
router.get('/get-alternatif/:id',authentication,alternatifController.getAlternatif)
router.post('/update-alternatif/:id',authentication,alternatifController.updateAlternatif)
router.post('/delete-alternatif/:id',authentication,alternatifController.deleteAlternatif)




module.exports = router