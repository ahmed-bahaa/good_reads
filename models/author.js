const mongoose = require('mongoose')

const author_schema = mongoose.Schema({

    fname: "string",
    lname: "string",
    author_photo: "string",
    birth_date: Date,
    books: [{type: mongoose.Schema.Types.ObjectId, ref:'book'}],

});

const author_model = mongoose.model("author",author_schema)

// author_model.create({ fname:"bname 1" , lname:"name2" ,author_photo:"bla bal" ,birth_date:"2011-12-19" ,books:[] })
// console.log(author_model.find({}))
module.exports = author_model;