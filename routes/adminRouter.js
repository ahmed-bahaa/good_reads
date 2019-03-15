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

//create new category  --Nada
admin_router.post('/categories', cors.corsWithOptions, async (req, res, next) => {
    try {
        //console.log(req.body.fname)
        await category_model.create({ name: req.body.name });
        const categories = await category_model.find({})
        res.json({
            categories
        });
    }
    catch (err) {
        next(err);
    }
})

//update category  --Nada
admin_router.put('/categories/:id',cors.corsWithOptions ,async (req, res, next) => {

    try {
        await category_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
        const categories = await category_model.find({})
        res.json({
            categories
        });
    }
    catch (err) {
        next(err)
    }

})

//delete category  --Nada
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

//delete author  --Nada
admin_router.delete('/authors/:id',cors.corsWithOptions, async (req, res, next) => {
    try {
        await author_model.findByIdAndRemove(req.params.id.replace(":", ""));
        const authors = await author_model.find({});
        res.json({
            authors
        });
    }
    catch (err) {
        next(err);
    }
})

//create new author  --Nada
admin_router.post('/authors', cors.corsWithOptions,upload_author.single('avatar'), async (req, res, next) => {
    try {
        let image = req.file ? req.file.filename : null;
        const new_author = await author_model.create({ fname: req.body.fname, lname: req.body.lname, author_photo: image, birth_date: req.body.birth_date })
        const authors = await author_model.find({})
        res.json({
            authors
        });
    }
    catch (err) {
        next(err);
    }
})

//update author  --Nada
admin_router.put('/authors/:id',cors.corsWithOptions, async (req, res, next) => {

    try {
        const updated_author = await author_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
        const authors = await author_model.find({})
        res.json({
            authors
        });
    }
    catch (err) {
        next(err)
    }
})


//===================== Books =========================

//delete book --Nada
admin_router.delete('/books/:id', cors.corsWithOptions,async (req, res, next) => {
    try {
        await book_model.findByIdAndRemove(req.params.id.replace(":", ""));
        const books = await book_model.find({});
        res.json({
            books
        });
    }
    catch (err) {
        next(err);
    }
})

//create new book --Nada
admin_router.post('/books',cors.corsWithOptions ,upload_book.single('cover'), async (req, res, next) => {
    try {
        let image = req.file ? req.file.filename : null;
        await book_model.create({
            name: req.body.name, description: req.body.description, cover: image, author_id: req.body.author_id,
            category_id: req.body.category_id
        })
        const books = await book_model.find({})
        res.json({
            books
        });
    }
    catch (err) {
        next(err);
    }
})

//update book --Nada
admin_router.put('/books/:id', cors.corsWithOptions,async (req, res, next) => {

    try {
        const updated_book = await book_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
        const books = await book_model.find({})
        res.json({
            books
        });
    }
    catch (err) {
        next(err)
    }

})

//add book to category -----new  --Nada
admin_router.put('/books/add_to_category/:book_id/:category_id',cors.corsWithOptions, async (req, res, next) => {
    try {
        await book_model.findByIdAndUpdate(req.params.book_id, {'category_id': req.params.category_id})
        const books = await book_model.find({})
        res.json({
            books
        });
    }
    catch (err) {
        next(err);
    }
})


//add book to author -----new  --Nada
admin_router.put('/books/add_to_author/:book_id/:author_id', cors.corsWithOptions, async (req, res, next) => {
    try {
        await book_model.findByIdAndUpdate(req.params.book_id, {'author_id': req.params.author_id});
        const books = await book_model.find({})
        res.json({
            books
        });
    }
    catch (err) {
        next(err);
    }
})









//===================== BOOKS =====================
//=======================================================



// //import category routes and use it 


// // lists categories
// admin_router.get('/book', cors.cors,async (req,res)=>{
//     try
//     {
//         const books = await book_model.find({}).populate("author_id").populate("category_id")
//         // res.send(categories)
//         console.log(books)
//         res.render('../views/pages/admin/book.ejs', { books: books, })
//     }
//     catch (e) {
//         console.log(e)
//     }
// })

// //redirects from update button
// admin_router.get('/book/:id/edit',cors.cors, async (req,res)=>{
//     try{
       
//         const book = await book_model.findById(req.params.id.replace(":","")).populate("author_id").populate("category_id")     
//         const available_categories = await category_model.find({})
//         const available_authors = await author_model.find({})
//         res.render('../views/pages/admin/book_form.ejs', { book: book, authores: available_authors, categories: available_categories })
//     }
//     catch (e) {
//         console.log(e)
//     }

// })


// //redirects from update form
// admin_router.post('/book/:id/edit', cors.cors,async (req,res)=>{

//     try {
//         const updated_book = await book_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
//         const books = await book_model.find({}).populate("author_id").populate("category_id")
//         res.render('../views/pages/admin/book.ejs', { books: books, })
//     }
//     catch (e) {
//         console.log(e)
//     }

// })


// // redirect to new book form

// admin_router.get( '/book/new', cors.cors,async (req,res)=>{
    
//     try{
//         const available_categories = await category_model.find({})
//         const available_authors = await author_model.find({})
//         res.render('../views/pages/admin/book_form.ejs', { authores: available_authors, categories: available_categories })
//     }
//     catch (e) {
//         console.log(e)
//     }
// })

// // add new book 
// admin_router.post( '/book/:id/add', cors.corsWithOptions,async(req,res)=>{
//     try
//     {
//         const new_book = await book_model.create({ 
//                         name:req.body.name,
//                         cover:req.body.cover,
//                         description:req.body.description,
//                         author_id:req.body.author_id,
//                         category_id:req.body.category_id})
//         const books = await book_model.find({}).populate("author_id").populate("category_id")
//         res.render('../views/pages/admin/book.ejs', { books: books, })
//     }
//     catch (err) {
//         console.log(err)
//     }
// })


// //delete book

// admin_router.get( '/book/:id/delete',cors.corsWithOptions, async(req,res)=>{
//     try
//     {      
//         const deleted_book = await book_model.findByIdAndRemove(req.params.id.replace(":",""))
//         const books = await book_model.find({}).populate("author_id").populate("category_id")

//         res.render('../views/pages/admin/book.ejs', { books: books, })
//     }
//     catch (err) {
//         console.log(err)
//     }
// })


module.exports = admin_router