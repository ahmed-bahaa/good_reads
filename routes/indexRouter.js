const express = require("express")
const index_router = express.Router()
const category = require('../models/category');
const author = require('../models/author');
const book = require('../models/book');
const category_model = require('../models/category.js');
const cors= require('./cors');


index_router.options("/index",cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
index_router.get('/index',cors.cors,async(req,res,)=>{
    try
    {
        const authors = await author.find({}).select('fname -_id').sort({fname:1}).limit(3) //replace name with sth else
        const books = await book.find().select('name -_id').sort({name:1}).limit(3) //replace name with sth else
        const categories = await category.find().select('name -_id').sort({name:1}).limit(3) //replace name with sth else
        res.json({categories:categories, books:books, authors:authors})
        //res.render('../views/pages/index.ejs',{categories:categories, books:books, authors:authors})
    }
    catch(e)
    {
        console.log(e)
    }

    
})

//===================== AUTHORS =========================

// lists all authors  --Nada
index_router.options("/authors",cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

index_router.get('/authors', cors.cors,async (req, res, next) => {
    try {
        const authors = await author.find({});
        res.json(
            authors
        );
    }
    catch (err) {
        next(err);
    }
})

//get specific author --Nada
index_router.options('/authors/:id',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

index_router.get('/authors/:id',cors.cors, async (req, res, next) => {
    try {
        const selected_author = await author.findById(req.params.id.replace(":", ""));
        res.json(
            selected_author
        );
    }
    catch (err) {
        next(err);
    }
})

//===================== Books =========================

// lists all books  -Nada
index_router.options('/books',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

index_router.get('/books', cors.cors,async (req, res, next) => {
    try {
        const books = await book.find({});
        res.json(
            books
        );
    }
    catch (err) {
        next(err);
    }
})

//get specific book -Nada
index_router.options('/books/:id',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

index_router.get('/books/:id',cors.cors ,async (req, res, next) => {
    try {
        const selected_book = await book.findById(req.params.id.replace(":", ""));
        res.json(
            selected_book
        );
    }
    catch (err) {
        next(err);
    }
})


//get all books inside specific category -----new --Nada
index_router.options('/:category_id/category_books',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

index_router.get('/:category_id/category_books',cors.cors, async (req, res, next) => {
    try {
        await book.find({category_id: req.params.category_id}, (err, docs)=>{
            if(err){
                next(err);
            } else {
                res.json(
                    docs
                );
            }
        });
    }
    catch (err) {
        next(err);
    }
})

//get all books that belong to a specific author -----new --Nada
index_router.options('/:author_id/author_books',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
index_router.get('/:author_id/author_books',cors.cors ,async (req, res, next) => {
    try {
        await book.find({author_id: req.params.author_id}, (err, docs)=>{
            if(err){
                next(err);
            } else {
                res.json(
                    docs
                );
            }
        });
    }
    catch (err) {
        next(err);
    }
})

//===================== Categories =========================

// lists all categories --Nada
index_router.options('/categories',cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

index_router.get('/categories',cors.cors,async (req, res, next) => {
    try {
        const categories = await category_model.find({});
        res.json(
            categories
        );
    }
    catch (err) {
        next(err);
    }
})






module.exports = index_router