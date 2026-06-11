const mongoose = require("mongoose");

const subkriteriaSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'userId is required'],
        ref:'User' 
        },
    kriteria_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'kriteria_id is required'],
        ref:'Kriteria' 
    },
    sub_kriteria:{
        type:String,
        required:[true,'sub_kriteria is required'],
        trim:true     
    },
    deskripsi:{
        type:String,
        trim:true     
    },
    bobot:{
        type:Number,
        required:[true,'bobot is required'],
        trim:true     
    },
},{
    timestamps:true
})

const subKriteria = mongoose.model('SubKriteria',subkriteriaSchema)

module.exports = subKriteria
