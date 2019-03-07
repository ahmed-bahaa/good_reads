const express = require("express")
const index_router = express.Router()
const category = require('../models/category')
const author = require('../models/author')
const book = require('../models/book')

index_router.get('/index',(req,res)=>{
    const categories = category.find({},(err,rated_cat)=>{
        res.render('../views/pages/index.ejs',{categories : rated_cat})
     // res.send(users)
    });
    
})














module.exports = index_router