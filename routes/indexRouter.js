const express = require("express")
const index_router = express.Router()
const category = require('../models/category')
const author = require('../models/author')
const book = require('../models/book')

index_router.get('/index',async(req,res,)=>{
    try
    {
        const authors = await author.find({}).find({}).sort({name:1}).limit(3) //replace name with sth else
        const books = await book.find({}).find({}).sort({name:1}).limit(3) //replace name with sth else
        const categories = await category.find({}).sort({name:1}).limit(3) //replace name with sth else
        res.render('../views/pages/index.ejs',{categories:categories, books:books, authors:authors})
    }
    catch(e)
    {
        console.log(e)
    }

    
})














module.exports = index_router