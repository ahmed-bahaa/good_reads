const mongoose = require('mongoose')

const category_schema = new mongoose.Schema({

    name:"string",

});

const category_model = mongoose.model("category", category_schema)
//category_model.create({name:""})
module.exports = category_model;