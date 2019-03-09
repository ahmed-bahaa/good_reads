const express = require("express")
const category_model = require('../models/category.js')
const admin_model = require('../models/admin.js');
const admin_router = express.Router()
var authenticate = require('../authenticate');
var passport = require('passport');
//======================== GET ==========================


admin_router.get( '/category/new',(req,res)=>{
    //res.send("add new user");
    res.render('../views/pages/category_update_form.ejs')
})


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
        console.log(req.params.id.replace(":",""))
        const selected_category=  await category_model.findById(req.params.id.replace(":",""))
        res.render('../views/pages/category_update_form.ejs',{data:selected_category})

    }
    catch(e){
        console.log(e)
    }

})

admin_router.get('/signin', async (req, res) => {
    res.render('pages/admin/signin-form', {userType: 'admin'});
});

//======================== POST =========================

admin_router.post( '/category/:id/add', async(req,res)=>{
    try
    {
        //console.log(req.body.fname)
        const new_category = await category_model.create({ username: req.body.username,  password: req.body.password, name:req.body.name})
        const categories = await category_model.find({}) 
        res.render('../views/pages/category.ejs', {categories:categories,})
    }
    catch( err ){
        console.log( err )
    }})


//redirects from update button
admin_router.post('/category/:id/edit', async (req,res)=>{

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
/// edit 
admin_router.post('/signin', passport.authenticate('local') , (req, res) => {
    
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true,token: token ,status: 'You are successfully logged in!'});

});
admin_router.post('/signup',(req, res)=> {

    admin_model.register(new admin_model({
        username: req.body.username,
        name:req.body.name
    }), req.body.password, (err, user) =>{
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
        }
        else {
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, status: 'Registration Successful!' });
            });
        }  
    });  
    
   });
// router.post('/login', passport.authenticate('local'), (req, res) => {
 //   var token = authenticate.getToken({_id: req.user._id});
 //   res.statusCode = 200;
 //  res.setHeader('Content-Type', 'application/json');
//    res.json({success: true,token: token ,status: 'You are successfully logged in!'});
//   });
  
//======================== DELETE =======================

admin_router.get( '/category/:id/delete', async(req,res)=>{
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




//======================== Nada betgarrab el database schema ==========================
// admin_router.post('/signup',async(req, res)=> {
//     try
//     {
//         const admin = new admin_model({username:req.body.username, password:req.body.password, name:req.body.name})
//         // const admin = new admin_model({username:"admin", password:"admin", name:"good reads admin"}) //dummy admin created on the fly
//         await admin.save((err, doc) => {
//             if (err) console.log(err) //duplicate username
//             const admins = admin_model.find((err,doc)=>{
//                 res.send(doc);
//             }) 
//         })
//     }
//     catch( err ){
//         console.log( err )
//     }});

module.exports = admin_router