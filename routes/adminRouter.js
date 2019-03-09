const express = require("express")
const category_model = require('../models/category.js')
const book_model = require('../models/book.js')
const author_model = require('../models/author.js')
const admin_model = require('../models/admin.js');
const admin_router = express.Router()

//import category routes and use it 
const categ_router = require("./adminCategory")
admin_router.use('/category/', categ_router)


//======================== book ==========================

admin_router.get( '/book/new', async (req,res)=>{
    
    try{
        const available_categories = await category_model.find({})
        // console.log(available_categories)
        const available_authors = await author_model.find({})
        res.render('../views/pages/admin/book_form.ejs',{authores:available_authors,categories:available_categories})
    }
    catch(e){
    console.log(e)
}})
//======================== POST =========================

admin_router.post( '/book/:id/add', async(req,res)=>{
    try
    {
        const new_category = await category_model.create({ 
            name:req.body.name,
            cover:req.body.cover,
            description:req.body.description,
            author_id:req.body.author,
            category_id:req.body.category})
        const books = await book_model.find({}).populate("author_id").populate("category_id")
        // res.send(books[0])
        res.render('../views/pages/admin/book.ejs', {books:books,})
    }
    catch( err ){
        console.log( err )
    }})


// lists categories
admin_router.get('/book', async (req,res)=>{
    try
    {
        const books = await book_model.find({}).populate({path:'category_id' ,select:"name"}).populate({ path:'author_id',select:["fname","lname"]})
       // res.send(categories)
        res.send(books)
    }
    catch(e){
        console.log(e)
    }
})

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