require('dotenv').config()
const express = require ('express')
const route = require('./src/routes/index.route')
const mongoose = require ('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const dns = require('dns');
const errorHandle = require('./src/middlewares/errorHandle.middleware')
dns.setServers(['8.8.8.8','1.1.1.1']);

const app = express()

app.use(cors('*'));

const mongostr = process.env.MONGO_URI

mongoose.connect(mongostr,{
    serverSelectionTimeoutMS:30000,
    connectTimeoutMS : 30000
})
const db = mongoose.connection
db.on('error',(e)=>{
    console.error(e)
})
db.once('connected',()=>{
    console.log('Database Connected')
})
// console.log(db)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(route)

app.use(errorHandle)
app.listen('3000',() => {
    console.log('server run on port 3000')
})