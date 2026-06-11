const router = require('express').Router()
const evaluasiFaktorController = require('../controllers/evaluasifaktor.controller')
const { authentication } = require('../middlewares/auth.middleware')
 
router.post('/hitung', authentication, evaluasiFaktorController.hitungEvaluasiFaktor)
router.get('/get-evaluasi', authentication, evaluasiFaktorController.getAllEvaluasiFaktor)
router.get('/get-evaluasi/kriteria/:kriteria_id', authentication, evaluasiFaktorController.getEvaluasiFaktorByKriteria)
router.post('/delete-evaluasi', authentication, evaluasiFaktorController.deleteAllEvaluasiFaktor)

module.exports = router