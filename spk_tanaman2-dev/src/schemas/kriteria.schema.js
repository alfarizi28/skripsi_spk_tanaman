const mongoose = require("mongoose");

const kriteriaSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'userId is required'],
        ref:'User' 
    },
    kode:{
        type:String,
        required:[true,'kode is required'],
        trim:true     
    },
    parameter:{
        type:String,
        required:[true,'parameter is required'],
        trim:true     
    },
    bobot:{
        type:Number,
        required:[true,'bobot is required'],
        trim:true     
    },
    bobot_normalisasi:{
        type: Number,
        // required:[true,'bobot_normalisasi is required'],
        trim:true     
    },
},{
    timestamps:true
})

const Kriteria = mongoose.model('Kriteria',kriteriaSchema)

module.exports = Kriteria
