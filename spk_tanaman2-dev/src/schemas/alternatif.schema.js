const mongoose = require("mongoose");

const alternatifSchema = new mongoose.Schema({
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
    alternatif:{
        type:String,
        required:[true,'alternatif is required'],
        trim:true     
    },
},{
    timestamps:true
})

const Alternatif = mongoose.model('Alternatif',alternatifSchema)

module.exports = Alternatif
