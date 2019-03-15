const express = require("express")
const category_model = require('../models/category.js')
const admin_model = require('../models/admin.js');
const book_model = require('../models/book.js')
const author_model = require('../models/author.js');
const admin_router = express.Router()
var authenticate = require('../authenticate');
var passport = require('passport');
var multer = require('multer');
var upload_author = multer({ dest: 'public/uploads/author-avatar' });
var upload_book = multer({ dest: 'public/uploads/book-cover' });
const cors= require('./cors');


//==========================admin authentication =============================
admin_router.post('/signin',cors.corsWithOptions ,passport.authenticate('local'), (req, res) => {

    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });

});
admin_router.post('/signup',cors.corsWithOptions, (req, res) => {

    admin_model.register(new admin_model({
        username: req.body.username,
        name: req.body.name
    }), req.body.password, (err, user) => {
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


//=================== CATEGORY ===================

//create new category
admin_router.post('/categories', async (req, res) => {
    try {
        //console.log(req.body.fname)
        await category_model.create({ name: req.body.name })
        const categories = await category_model.find({})
        res.json({
            status: "success",
            data: categories
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

<<<<<<< HEAD
//rupdate category
admin_router.put('/categories/:id',cors.corsWithOptions ,async (req, res) => {

=======

//update category
admin_router.put('/categories/:id', async (req, res) => {
>>>>>>> 47077e2534252290505227968a5ee0e75b5266e9
    try {
        await category_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
        const categories = await category_model.find({})
        res.json({
            status: "success",
            data: categories
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }

})

//delete category
admin_router.delete('/categories/:id',cors.corsWithOptions ,async (req, res) => {
    try {
        await category_model.findByIdAndRemove(req.params.id.replace(":", ""))
        const categories = await category_model.find({})
        res.json({
            status: "success",
            data: categories
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})


//===================== AUTHORS =========================

//delete author
admin_router.delete('/authors/:id',cors.corsWithOptions, async (req, res) => {
    try {
        await author_model.findByIdAndRemove(req.params.id.replace(":", ""));
        const authors = await author_model.find({});
        res.json({
            status: "success",
            data: authors
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//create new author
admin_router.post('/authors', cors.corsWithOptions,upload_author.single('avatar'), async (req, res) => {
    try {
        let image = req.file ? req.file.filename : null;
        const new_author = await author_model.create({ fname: req.body.fname, lname: req.body.lname, author_photo: image, birth_date: req.body.birth_date })
        const authors = await author_model.find({})
        res.json({
            status: "success",
            data: authors
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//update author
admin_router.put('/authors/:id',cors.corsWithOptions, async (req, res) => {

    try {
        const updated_author = await author_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
        const authors = await author_model.find({})
        res.json({
            status: "success",
            data: authors
        });
    }
    catch (e) {
        res.json({
            status: "failure",
            data: err
        });
    }

})


//===================== Books =========================

//delete book
admin_router.delete('/books/:id', cors.corsWithOptions,async (req, res) => {
    try {
        await book_model.findByIdAndRemove(req.params.id.replace(":", ""));
        const books = await book_model.find({});
        res.json({
            status: "success",
            data: books
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//create new book
admin_router.post('/books',cors.corsWithOptions ,upload_book.single('cover'), async (req, res) => {
    try {
        let image = req.file ? req.file.filename : null;
        await book_model.create({
            name: req.body.name, description: req.body.description, cover: image, author_id: req.body.author_id,
            category_id: req.body.category_id
        })
        const books = await book_model.find({})
        res.json({
            status: "success",
            data: books
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//update book
admin_router.put('/books/:id', cors.corsWithOptions,async (req, res) => {

    try {
        const updated_book = await book_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
        const books = await book_model.find({})
        res.json({
            status: "success",
            data: books
        });
    }
    catch (e) {
        res.json({
            status: "failure",
            data: err
        });
    }

})

//add book to category -----new
admin_router.put('/books/add_to_category/:book_id/:category_id', async (req, res) => {
    try {
        await book_model.findByIdAndUpdate(req.params.book_id, {'category_id': req.params.category_id})
        const books = await book_model.find({})
        res.json({
            status: "success",
            data: books
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})


//add book to author -----new
admin_router.put('/books/add_to_author/:book_id/:author_id', async (req, res) => {
    try {
        await book_model.findByIdAndUpdate(req.params.book_id, {'author_id': req.params.author_id});
        const books = await book_model.find({})
        res.json({
            status: "success",
            data: books
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})









//===================== BOOKS =====================
//=======================================================



//import category routes and use it 


<<<<<<< HEAD
// lists categories
admin_router.get('/book', cors.cors,async (req,res)=>{
    try
    {
=======
// lists books
admin_router.get('/book', async (req, res) => {
    try {
>>>>>>> 47077e2534252290505227968a5ee0e75b5266e9
        const books = await book_model.find({}).populate("author_id").populate("category_id")
        // res.send(categories)
        console.log(books)
        res.render('../views/pages/admin/book.ejs', { books: books, })
    }
    catch (e) {
        console.log(e)
    }
})

//redirects from update button
<<<<<<< HEAD
admin_router.get('/book/:id/edit',cors.cors, async (req,res)=>{
    try{
       
        const book = await book_model.findById(req.params.id.replace(":","")).populate("author_id").populate("category_id")     
=======
admin_router.get('/book/:id/edit', async (req, res) => {
    try {

        const book = await book_model.findById(req.params.id.replace(":", "")).populate("author_id").populate("category_id")
>>>>>>> 47077e2534252290505227968a5ee0e75b5266e9
        const available_categories = await category_model.find({})
        const available_authors = await author_model.find({})
        res.render('../views/pages/admin/book_form.ejs', { book: book, authores: available_authors, categories: available_categories })
    }
    catch (e) {
        console.log(e)
    }

})


//redirects from update form
<<<<<<< HEAD
admin_router.post('/book/:id/edit', cors.cors,async (req,res)=>{
=======
admin_router.post('/book/:id/edit', async (req, res) => {
>>>>>>> 47077e2534252290505227968a5ee0e75b5266e9

    try {
        const updated_book = await book_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
        const books = await book_model.find({}).populate("author_id").populate("category_id")
        res.render('../views/pages/admin/book.ejs', { books: books, })
    }
    catch (e) {
        console.log(e)
    }

})


// redirect to new book form

<<<<<<< HEAD
admin_router.get( '/book/new', cors.cors,async (req,res)=>{
    
    try{
=======
admin_router.get('/book/new', async (req, res) => {

    try {
>>>>>>> 47077e2534252290505227968a5ee0e75b5266e9
        const available_categories = await category_model.find({})
        const available_authors = await author_model.find({})
        res.render('../views/pages/admin/book_form.ejs', { authores: available_authors, categories: available_categories })
    }
    catch (e) {
        console.log(e)
    }
})

// add new book 
<<<<<<< HEAD
admin_router.post( '/book/:id/add', cors.corsWithOptions,async(req,res)=>{
=======

admin_router.post( '/book/add', async(req,res)=>{
>>>>>>> 47077e2534252290505227968a5ee0e75b5266e9
    try
    {
        const new_book = await book_model.create({ 
                        name:req.body.name,
                        cover:req.body.cover,
                        description:req.body.description,
                        author_id:req.body.author_id,
                        category_id:req.body.category_id})
        const books = await book_model.find({}).populate("author_id").populate("category_id")
        res.render('../views/pages/admin/book.ejs', { books: books, })
    }
    catch (err) {
        console.log(err)
    }
})


//delete book

<<<<<<< HEAD
admin_router.get( '/book/:id/delete',cors.cors, async(req,res)=>{
    try
    {      
        const deleted_book = await book_model.findByIdAndRemove(req.params.id.replace(":",""))
=======
admin_router.get('/book/:id/delete', async (req, res) => {
    try {
        const deleted_book = await book_model.findByIdAndRemove(req.params.id.replace(":", ""))
>>>>>>> 47077e2534252290505227968a5ee0e75b5266e9
        const books = await book_model.find({}).populate("author_id").populate("category_id")

        res.render('../views/pages/admin/book.ejs', { books: books, })
    }
    catch (err) {
        console.log(err)
    }
})









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