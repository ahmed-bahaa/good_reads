const express = require("express")
const user_model = require('../models/user');
const user_books_model = require('../models/user_books');
const user_router = express.Router()
var multer = require('multer')
var upload = multer({ dest: 'public/uploads/user-avatar' })
var authenticate = require('../authenticate');
var passport = require('passport');
const book_model = require('../models/book');
const cors= require('./cors');

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



//========================user books and shelves/rate ==========================

// add book to user with a specific shelve, if the book exists just change the shelve, if exists in the same shelve it doesn't do anything --new --Nada
user_router.post('/:shelve', cors.corsWithOptions, authenticate.verifyUser, async (req, res) => {
    try {
        // console.log(req.user)
        user_books_model.findOne({'book_id':req.body.book_id, 'user_id': req.user.id}, ['shelve', 'rate'] , (err, doc)=>{
            if(doc){
                console.log(doc)
                // console.log(req.body.book_id)
                let rate = req.body.rate? req.body.rate : null;
                if(doc['shelve'] == req.params.shelve && doc['rate'] == rate){
                    res.json({
                        "response": "nothing needs update"
                    });
                }
                else if (doc['rate'] != rate){
                    user_books_model.findOneAndUpdate({'book_id':req.body.book_id, 'user_id': req.user.id}, {'rate': rate}, (err, doc) => {
                        res.json({
                            "response": "rate successfully updated to  "+ rate
                        });
                    })
                }
                 else {
                    user_books_model.findOneAndUpdate({'book_id':req.body.book_id, 'user_id': req.user.id}, {'shelve': req.params.shelve}, (err, doc) => {
                        res.json({
                            "response": "updated successfully to shelve  "+ req.params.shelve
                        });
                    })
                }
            } else {
                user_books_model.create({"book_id":req.body.book_id, "user_id": req.user.id, "shelve": req.params.shelve});
                res.json({
                    "response": "created and added to shelve "+ req.params.shelve
                });
            }
        });
    }
    catch (err) {
        next(err);
    }
});

// delete book from user --new  --Nada
user_router.delete('/books/:book_id', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    user_books_model.remove({'book_id': req.params.book_id, 'user_id': req.user.id}, (err)=>{
        if(err){
            console.log(err)
            next(err);
        } else {
            res.json({});
        }
    })
});


//=================================user home page "hager"===================================
//3ayza ashil el reviews list w a5liha key value pairs 3ady 3shan el rate kda hrg3 a3melo processing fl angular btri2a mot5lfa
user_router.get('/all',authenticate.verifyUser,async(req,res)=>{
    // db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])
    try{
        const all = await user_books_model.find({user_id:req.user._id}).select('rate shelve').populate('book_id')
        .select('name cover').populate('book_id.author_id').select('fname lname')
        const avg_rate = await user_books_model.aggregate([{$group:{book_id,avg_rate:{$avg:'rate'}}}])
        // const all1 = await book_model.find().select(['cover','name','reviews'])
        // .populate('author_id').select(['fname','lname']);
        res.json({
            status: "success",
            all:all,
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

// {
//     "name":"docker",
//     "author_id":"5c8956fca790f35c9722e103",
//     "category_id":"5c8153446e31282c78843cbc"
// }
module.exports = user_router