const express = require("express")
const index_router = express.Router()
const category = require('../models/category');
const author = require('../models/author');
const book = require('../models/book');
const category_model = require('../models/category.js');



index_router.get('/index',async(req,res,)=>{
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
index_router.get('/authors/', async (req, res) => {
    try {
        const authors = await author.find({});
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

//get specific author --Nada
index_router.get('/authors/:id', async (req, res) => {
    try {
        const selected_author = await author.findById(req.params.id.replace(":", ""));
        res.json({
            status: "success",
            data: selected_author
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//===================== Books =========================

// lists all books  -Nada
index_router.get('/books', async (req, res) => {
    try {
        const books = await book.find({});
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

//get specific book -Nada
index_router.get('/books/:id', async (req, res) => {
    try {
        const selected_book = await book.findById(req.params.id.replace(":", ""));
        res.json({
            status: "success",
            data: selected_book
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})


//get all books inside specific category -----new --Nada
index_router.get('/:category_id/category_books', async (req, res) => {
    try {
        await book.find({category_id: req.params.category_id}, (err, docs)=>{
            if(err){
                res.json({
                    status: "failure",
                    data: err
                });
            } else {
                res.json({
                    status: "success",
                    data: docs
                });
            }
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//get all books that belong to a specific author -----new --Nada
index_router.get('/:author_id/author_books', async (req, res) => {
    try {
        await book.find({author_id: req.params.author_id}, (err, docs)=>{
            if(err){
                res.json({
                    status: "failure",
                    data: err
                });
            } else {
                res.json({
                    status: "success",
                    data: docs
                });
            }
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//===================== Categories =========================

// lists all categories --Nada
index_router.get('/categories', async (req, res) => {
    try {
        const categories = await category_model.find({});
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






module.exports = index_router