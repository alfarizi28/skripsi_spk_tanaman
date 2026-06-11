const router = require('express').Router()
const nilaiAkhirController = require('../controllers/nilaiAkhir.controller')
const { authentication } = require('../middlewares/auth.middleware')
 
router.get('/public/get-nilai-akhir', nilaiAkhirController.getAllNilaiAkhirPublic)
router.post('/hitung', authentication, nilaiAkhirController.hitungNilaiAkhir)
router.get('/get-nilai-akhir', authentication, nilaiAkhirController.getAllNilaiAkhir)
router.get('/get-nilai-akhir/alternatif/:alternatif_id', authentication, nilaiAkhirController.getNilaiAkhirByAlternatif) 
router.post('/delete-nilai-akhir', authentication, nilaiAkhirController.deleteAllNilaiAkhir)
 

module.exports = router
 