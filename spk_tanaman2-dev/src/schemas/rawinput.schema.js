const mongoose = require("mongoose");

const rawInputSchema = new mongoose.Schema({
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
    subkriteria_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'subkriteria_id is required'],
        ref:'SubKriteria'
    },
    nilai_input:{
        type:Number,
        required:[true,'nilai_input is required'],
        trim:true
    },
},{
    timestamps:true
})

const RawInput = mongoose.model('RawInput', rawInputSchema)

module.exports = RawInput