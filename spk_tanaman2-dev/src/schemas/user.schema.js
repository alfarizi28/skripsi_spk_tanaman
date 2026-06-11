const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        trim:true     
    },
    username:{
        type:String,
        required:[true,'username is required'],
        trim:true     
    },
    password:{
        type:String,
        required:[true,'password is required'],
        trim:true     
    },
},{
    timestamps:true
})

const User = mongoose.model('User',userSchema)

module.exports = User
