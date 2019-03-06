const express = require("express")
const mongoose = require("mongoose")
const user_router = require('./routes/userRouter')
const admin_router = require('./routes/adminRouter')

mongoose.connect('mongodb://localhost:27017/goodreads' , ()=>{
     console.log("goodreads db connected!")
 })

const goodreads = express()

goodreads.listen(2000, ()=>{
    console.log("goodreads app started on port 2000")
})

goodreads.use(express.urlencoded())
goodreads.use('/user', user_router)
goodreads.use('/admin', admin_router)
