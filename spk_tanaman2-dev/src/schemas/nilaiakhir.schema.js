const mongoose = require("mongoose");

const nilaiAkhirSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'userId is required'],
        ref:'User'
    },
    alternatif_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'alternatif_id is required'],
        ref:'Alternatif'
    },
    bobot_evaluasi:[
        {
            kriteria_id:{
                type:mongoose.Schema.Types.ObjectId,
                required:[true,'kriteria_id is required'],
                ref:'Kriteria'
            },
            nilai_evaluasi_faktor:{
                type:Number,
                required:[true,'nilai_evaluasi_faktor is required'],
            },
            nilai_bobot_evaluasi:{
                type:Number,
                required:[true,'nilai_bobot_evaluasi is required'],
            }
        }
    ],
    nilai_akhir:{
        type:Number,
        required:[true,'nilai_akhir is required'],
    },
    ranking:{
        type:Number,
        required:[true,'ranking is required'],
    }
},{
    timestamps:true
})

const NilaiAkhir = mongoose.model('NilaiAkhir', nilaiAkhirSchema)

module.exports = NilaiAkhir