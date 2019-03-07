const express = require("express")
const category_model = require('../models/category.js')
const admin_router = express.Router()
//const author_model = require('../models/author');

//======================== GET ==========================


//======================== POST =========================

admin_router.post( '/category/', async(req,res)=>{
    try
    {
        //console.log(req.body.fname)
        const new_category = await category_model.create({ name:req.body.name})
        const categories = await category_model.find({}) 
        res.json(categories);
    }
    catch( err ){
        console.log( err )
    }})


//======================== DELETE =======================

admin_router.get( '/category/:id/delete', async(req,res)=>{
    try
    {      
        console.log(req.params.id)
        const deleted_book = await category_model.findByIdAndRemove(req.params.id.replace(":",""))
        const books = await category_model.find({}) 
        res.json(books);
    }
    catch( err ){
        console.log( err )
    }})

//======================== PUT ==========================

module.exports = admin_router