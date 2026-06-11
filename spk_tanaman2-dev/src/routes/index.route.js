const router = require('express').Router()

router.get('/',(req, res)=>{
    res.send('kirim')
})

router.use('/',require('./auth.route'))
router.use('/user',require('./user.route'))
router.use('/kriteria',require('./kriteria.route'))
router.use('/alternatif',require('./alternatif.route'))
router.use('/sub-kriteria',require('./subkriteria.route'))
router.use('/raw-input',require('./rawinput.route'))
router.use('/evaluasi-faktor',require('./evaluasifaktor.route'))
router.use('/nilai-akhir',require('./nilaiakhir.route'))



module.exports=router