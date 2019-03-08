const express = require("express")
const category_model = require('../models/category.js')
const admin_model = require('../models/admin.js');
const admin_router = express.Router()

//import category routes and use it 
const categ_router = require("./adminCategory")
admin_router.use('/category/', categ_router)

//======================== GET ==========================

admin_router.get('/signin', async (req, res) => {
    res.render('pages/signin-form', {userType: 'admin'});
});

//======================== POST =========================

admin_router.post('/signin', async (req, res) => {
    const admin = await admin_model.findOne({ username: req.body.username }, (err, doc) => {
        if (err) throw err
    });
    if (!admin) res.send("username not found");
    admin.comparePassword(req.body.password, (err, isMatch) => {
        if(err) throw err
        if (!isMatch) res.send("password is not correct");
        res.send("password is correct");
    })
});

//======================== DELETE =======================

//======================== PUT ==========================





//======================== Nada betgarrab el database schema ==========================
admin_router.post('/signup',async(req, res)=> {
    try
    {
        const admin = new admin_model({username:req.body.username, password:req.body.password, name:req.body.name})
        // const admin = new admin_model({username:"admin", password:"admin", name:"good reads admin"}) //dummy admin created on the fly
        await admin.save((err, doc) => {
            if (err) console.log(err) //duplicate username
            const admins = admin_model.find((err,doc)=>{
                res.send(doc);
            }) 
        })
    }
    catch( err ){
        console.log( err )
    }})

module.exports = admin_router