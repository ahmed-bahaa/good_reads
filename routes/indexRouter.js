const express = require("express")
const index_router = express.Router()
const category = require('../models/category');
const author = require('../models/author');
const book = require('../models/book');
const category_model = require('../models/category.js');



index_router.get('/index',async(req,res,)=>{
    try
    {
        const authors = await author.find({}).find({}).sort({name:1}).limit(3) //replace name with sth else
        const books = await book.find({}).find({}).sort({name:1}).limit(3) //replace name with sth else
        const categories = await category.find({}).sort({name:1}).limit(3) //replace name with sth else
        res.render('../views/pages/index.ejs',{categories:categories, books:books, authors:authors})
    }
    catch(e)
    {
        console.log(e)
    }

    
})

//===================== AUTHORS =========================

// lists authors
index_router.get('/authors/', async (req, res) => {
    try {
        const authors = await author.find({});
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

//get specific author
index_router.get('/authors/:id', async (req, res) => {
    try {
        const selected_author = await author.findById(req.params.id.replace(":", ""));
        res.json({
            status: "failure",
            data: selected_author
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

// lists books
index_router.get('/books', async (req, res) => {
    try {
        const books = await book.find({});
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

//get specific author
index_router.get('/books/:id', async (req, res) => {
    try {
        await book.findById(req.params.id.replace(":", ""));
        const books = await book.find({});
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



//===================== Categories =========================

// lists categories
index_router.get('/categories', async (req, res) => {
    try {
        const books = await category_model.find({});
        res.json({
            status: "success",
            data: categories
        });
    }
    catch (e) {
        res.json({
            status: "failure",
            data: err
        });
    }
})









module.exports = index_router