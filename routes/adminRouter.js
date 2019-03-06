const express = require("express")
const admin_router = express.Router()
const category_model = require('../models/category');

//======================== GET ==========================
// lists categories
admin_router.get('/category/', async (req,res)=>{
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
admin_router.get('/category/:id/edit', async (req,res)=>{

    try{
       
        res.render('../views/pages/category_update_form.ejs')

    }
    catch(e){
        console.log(e)
    }

})

//======================== POST =========================


//redirects from update button
admin_router.post('/category/:id/edit', async (req,res)=>{

    try{
        const updated_category = await category_model.findByIdAndUpdate(req.params.id, req.body, {new: true})
        const categories = await category_model.find({})
        res.render('../views/pages/category.ejs', {categories:categories,})
    }
    catch(e){
        console.log(e)
    }

})


//======================== DELETE =======================


//======================== PUT ==========================

module.exports = admin_router