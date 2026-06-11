const router = require('express').Router()
const subKriteriaController = require('../controllers/subKriteria.controller')
const { authentication } = require('../middlewares/auth.middleware')
 
router.post('/create-subkriteria', authentication, subKriteriaController.createSubKriteria)
router.get('/get-subkriteria', authentication, subKriteriaController.getAllSubKriteria)
router.get('/get-subkriteria/:id', authentication, subKriteriaController.getSubKriteria)
router.get('/get-subkriteria/kriteria/:kriteria_id', authentication, subKriteriaController.getSubKriteriaByKriteria)
router.post('/update-subkriteria/:id', authentication, subKriteriaController.updateSubKriteria)
router.post('/delete-subkriteria/:id', authentication, subKriteriaController.deleteSubKriteria)

module.exports = router