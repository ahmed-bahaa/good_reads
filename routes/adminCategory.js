const express = require("express")
const category_model = require('../models/category.js')
const admin_category_router = express.Router()




//======================== GET ==========================


admin_category_router.get( '/new',(req,res)=>{
    //res.send("add new user");
    res.render('../views/pages/category_form.ejs')
})


// lists categories
admin_category_router.get('/', async (req,res)=>{
    try
    {
        const categories = await category_model.find({})
       // res.send(categories)
        res.render('../views/pages/category.ejs', {categories:categories,})
    }
    catch(e){
        console.log(e)
    }
})

//redirects from update button
admin_category_router.get('/:id/edit', async (req,res)=>{

    try{
        console.log(req.params.id.replace(":",""))
        const selected_category=  await category_model.findById(req.params.id.replace(":",""))
        res.render('../views/pages/category_form.ejs',{data:selected_category})

    }
    catch(e){
        console.log(e)
    }

})

//======================== POST =========================

admin_category_router.post( '/:id/add', async(req,res)=>{
    try
    {
        //console.log(req.body.fname)
        const new_category = await category_model.create({ name:req.body.name})
        const categories = await category_model.find({}) 
        res.render('../views/pages/category.ejs', {categories:categories,})
    }
    catch( err ){
        console.log( err )
    }})


//redirects from update button
admin_category_router.post('/:id/edit', async (req,res)=>{

    try{
        console.log("yeaaah")
        const updated_category = await category_model.findByIdAndUpdate(req.params.id.replace(":",""), req.body, {new: true})
        const categories = await category_model.find({})
        res.render('../views/pages/category.ejs', {categories:categories,})
    }
    catch(e){
        console.log(e)
    }

})


//======================== DELETE =======================

admin_category_router.get( '/:id/delete', async(req,res)=>{
    try
    {      
        console.log(req.params.id)
        const deleted_category = await category_model.findByIdAndRemove(req.params.id.replace(":",""))
        const categories = await category_model.find({}) 
        res.render('../views/pages/category.ejs', {categories:categories,})
    }
    catch( err ){
        console.log( err )
    }})

//======================== PUT ==========================


module.exports = admin_category_router