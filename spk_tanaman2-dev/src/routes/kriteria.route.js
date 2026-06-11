const router = require ('express').Router()
const kriteriaController = require('../controllers/kriteria.controller')
const { authentication } = require('../middlewares/auth.middleware')


router.post('/create-kriteria',authentication,kriteriaController.createKriteria)
router.get('/get-kriteria',authentication,kriteriaController.getAllKriteria)
router.get('/get-kriteria/:id',authentication,kriteriaController.getKriteria)
router.post('/update-kriteria/:id',authentication,kriteriaController.updateKriteria)
router.post('/delete-kriteria/:id',authentication,kriteriaController.deleteKriteria)
router.post('/normalize', authentication, kriteriaController.normalize)

module.exports = router