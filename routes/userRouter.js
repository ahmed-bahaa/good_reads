const express = require("express")
const user_model = require('../models/user');
const user_router = express.Router()
var multer = require('multer')
var upload = multer({ dest: 'public/uploads/user-avatar' })
var authenticate = require('../authenticate');
var passport = require('passport');

//======================== User Authentication =========================
user_router.post('/signup', upload.single('avatar'), (req, res, next) => {
    let image= req.file ? req.file.filename : null
    user_model.register(new user_model({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        image: image
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
    })
});
user_router.post('/signin', passport.authenticate('local'), (req, res) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});
user_router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        //redirect to home
    }
    else {
        var err = new Error('You are not logged in!');
        res.statusCode = 403;
        next(err);
    }
});



//======================== books and shelves ==========================

user_router.post('/:user_id/read/:book_id', async (req, res) => {
    try {
        // await user_model.findByIdAndUpdate(req.params.user_id, {$addToSet: {books: {book:req.params.book_id, shelve: 'Read'} } } );
        const books = await user_model.find({_id: req.params.user_id} ).select("books.book")
        var isInArray = books.some(function (book) {
            res.send(book._id);
        });
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
});

//======================== Nada betgarrab el database schema ==========================

user_router.get('/users', async (req, res) => {
    try {
        const users = await user_model.find({});
        res.json({
            status: "success",
            data: users
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
});

user_router.post('/create', async (req, res) => {
    try {
        const user = new user_model({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password,
            image: req.body.image,
            books: req.body.books
        });
        await user.save((err, doc) => {
            if (err) console.log(err) //duplicate username
            const users = user_model.find((err, doc) => {
                res.send(doc);
            })
        })
    }
    catch (err) {
        console.log(err)
    }
})

//=================================user home page "hager"===================================
user_router.get('/category',async(req,res)=>{

})

module.exports = user_router