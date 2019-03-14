const mongoose = require('mongoose')
const author_schema = mongoose.Schema({
    fname: "string",
    lname: "string",
    author_photo: "string",
    birth_date: "string"
});

const author_model = mongoose.model("author",author_schema)

// author_model.create({ fname:"bname 1" , lname:"name2" ,author_photo:"bla bal" ,birth_date:"2011-12-19" ,books:[] })
// console.log(author_model.find({}))
// book_model.create({name: "dffsgfad", cover:"//path", description: "hhhhh"})
// author_model.create({fname: "ahmed" , lname: "lamei" , author_photo: "//path", birth_date: '01.03.2012', books:[book_model._id]})
module.exports = author_model;
