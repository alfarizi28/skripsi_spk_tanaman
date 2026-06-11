const mongoose = require("mongoose");

const evaluasiFaktorSchema = new mongoose.Schema({
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
    kriteria_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'kriteria_id is required'],
        ref:'Kriteria'
    },
    nilai_evaluasi:{
        type:Number,
        required:[true,'nilai_evaluasi is required'],
        trim:true
    },
},{
    timestamps:true
})

const EvaluasiFaktor = mongoose.model('EvaluasiFaktor', evaluasiFaktorSchema)

module.exports = EvaluasiFaktor