const express = require("express")
const user_model = require('../models/user');
const user_books_model = require('../models/user_books');
const user_router = express.Router()
var multer = require('multer')
var upload = multer({ dest: 'public/uploads/user-avatar' })
var authenticate = require('../authenticate');
var passport = require('passport');
const book_model = require('../models/book');
//======================== GET ==========================

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

// add book to user with a specific shelve, if the book exists just change the shelve, if exists in the same shelve it doesn't do anything --new
user_router.post('/:user_id/:shelve/:book_id', async (req, res) => {
    try {
        user_books_model.findOne({'book_id':req.params.book_id, 'user_id': req.params.user_id}, (err, doc)=>{
            if(doc){
                console.log(doc['shelve'])
                if(doc['shelve'] == req.params.shelve){
                    res.json({
                        status: "success",
                        data: "already exists and in the "+ req.params.shelve
                    });
                } else {
                    user_books_model.findOneAndUpdate({'book_id':req.params.book_id, 'user_id': req.params.user_id}, {'shelve': req.params.shelve}, (err, doc) => {
                        res.json({
                            status: "success",
                            data: "updated successfully to shelve  "+ req.params.shelve
                        });
                    })
                }
            } else {
                user_books_model.create({"book_id":req.params.book_id, "user_id": req.params.user_id, "shelve": req.params.shelve});
                res.json({
                    status: "success",
                    data: "created "+ req.params.shelve
                });
            }
        }).select('shelve');
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
});

// delete book from user --new
user_router.delete('/:user_id/:book_id', (req, res) => {
    user_books_model.remove({'book_id': req.params.book_id, 'user_id': req.params.user_id}, (err)=>{
        if(err){
            console.log(err)
            res.json({
                status: "failure",
                data: err
            });
        } else {
            res.json({
                status: "success"
            });
        }
    })
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
//3ayza ashil el reviews list w a5liha key value pairs 3ady 3shan el rate kda hrg3 a3melo processing fl angular btri2a mot5lfa
user_router.get('/books',authenticate.verifyUser,async(req,res)=>{
    // db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])
    try{
        const data = await user_books_model.find({user_id:req.user._id}).select('rate shelve').populate('book_id')
        .select('name cover').populate('book_id.author_id').select('fname lname')
        const avg_rate = await user_books_model.aggregate([{$group:{book_id:book_id,avg_rate:{$avg:'rate'}}}])
        // const all1 = await book_model.find().select(['cover','name','reviews'])
        // .populate('author_id').select(['fname','lname']);
        res.json({
            status: "success",
            data:data,
            avg_rate:avg_rate})
    }
    catch(err)
    {
        res.json({
            status : "failed",
            error: err
        });
    }
})

//================================user read book====================================
user_router.get('/books/read',authenticate.verifyUser,async(req,res)=>{
    // db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])
    try{
        const data = await user_books_model.find( { $and: [ { user_id:req.user._id }, {shelve:"read"} ] } ).select('rate shelve').populate('book_id')
        .select('name cover').populate('book_id.author_id').select('fname lname')
        res.json({
            data:data,
            avg_rate:avg_rate})
    }
    catch(err)
    {
        res.json({
            error: err
        });
    }
})



// {
//     "name":"docker",
//     "author_id":"5c8956fca790f35c9722e103",
//     "category_id":"5c8153446e31282c78843cbc"
// }
module.exports = user_router