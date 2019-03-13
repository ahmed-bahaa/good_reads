const express = require("express")
const mongoose = require("mongoose")
const user_router = require('./routes/userRouter')
const admin_router = require('./routes/adminRouter')
const index_router = require('./routes/indexRouter')
const goodreads = express()
var passport = require('passport');

const bodyParser = require('body-parser');
goodreads.use(bodyParser.json());
goodreads.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/goodreads', { useNewUrlParser: true }, () => {
    console.log("goodreads db connected!")
})

goodreads.listen(3000, () => {
    console.log("goodreads app started on port 3000")
})

goodreads.set('view engine', 'ejs');
goodreads.use(passport.initialize());

goodreads.use(express.urlencoded())
goodreads.use('/goodreads', index_router)
goodreads.use('/user', user_router)
goodreads.use('/admin', admin_router)
