const mongoose = require('mongoose')

const author_schema = mongoose.Schema({

    fname: "string",
    lname: "string",
    author_photo: "string",
    birth_date: Date,
    books: [{type: mongoose.Schema.Types.ObjectId, ref:'book'}],

});

const author_model = mongoose.model("author",author_schema)

module.exports = author_model;