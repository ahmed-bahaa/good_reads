const mongoose = require('mongoose')
const book_model = require("../models/book")
const author_schema = mongoose.Schema({
    fname: "string",
    lname: "string",
    author_photo: "string",
    birth_date: Date,
    books: [{type: mongoose.Schema.Types.ObjectId, ref:'book'}],
});

const author_model = mongoose.model("author",author_schema)
// book_model.create({name: "dffsgfad", cover:"//path", description: "hhhhh"})
// author_model.create({fname: "ahmed" , lname: "lamei" , author_photo: "//path", birth_date: '01.03.2012', books:[book_model._id]})
module.exports = author_model;
