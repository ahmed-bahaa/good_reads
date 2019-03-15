const express = require("express")
const user_model = require('../models/user');
const user_books_model = require('../models/user_books');
const user_router = express.Router()
var multer = require('multer')
var upload = multer({ dest: 'public/uploads/user-avatar' })
var authenticate = require('../authenticate');
var passport = require('passport');
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
user_router.post('/:shelve', cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
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
user_router.delete('/books/:book_id', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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
user_router.get('/books',authenticate.verifyUser,async(req,res)=>{
    // db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])
    try{
        const data = await user_books_model.find({user_id:req.user._id}).select('rate shelve').populate('book_id')
        .select('name cover').populate('book_id.author_id').select('fname lname')
        const avg_rate = await user_books_model.aggregate([{$group:{book_id:book_id,avg_rate:{$avg:"$rate"}}}])
       // const all1 = await book_model.find().select(['cover','name','reviews'])
        // .populate('author_id').select(['fname','lname']);
        //avg_rate: populate book_id.select rate
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

//================================user read book====================================
user_router.get('/books/read',authenticate.verifyUser,async(req,res)=>{
    // db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])
    try{
        const data = await user_books_model.find( { $and: [ { user_id:req.user._id }, {shelve:"read"} ] } ).select('rate shelve').populate('book_id')
        .select('name cover').populate('book_id.author_id').select('fname lname')
        res.json({
            data:data
            })
    }
    catch(err)
    {
        res.json({
            error: err
        });
    }
})


user_router.get('/books/current',authenticate.verifyUser,async(req,res)=>{
    // db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])
    try{
        const data = await user_books_model.find( { $and: [ { user_id:req.user._id }, {shelve:"current"} ] } ).select('rate shelve').populate('book_id')
        .select('name cover').populate('book_id.author_id').select('fname lname')
        res.json({
            data:data
            })
    }
    catch(err)
    {
        res.json({
            error: err
        });
    }
})


user_router.get('/books/wishlist',authenticate.verifyUser,async(req,res)=>{
    // db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}])
    try{
        const data = await user_books_model.find( { $and: [ { user_id:req.user._id }, {shelve:"want"} ] } ).select('rate shelve').populate('book_id')
        .select('name cover').populate('book_id.author_id').select('fname lname')
        res.json({
            data:data
            })
    }
    catch(err)
    {
        res.json({
            error: err
        });
    }
})

user_router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
	passport.authenticate('jwt', {session: false}, (err, user, info) => {
		if (err)
			return next(err);
		
		if (!user) {
			res.statusCode = 401;
			res.setHeader('Content-Type', 'application/json');
			return res.json({status: 'JWT invalid!', success: false, err: info});
		}
		else {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			return res.json({status: 'JWT valid!', success: true, user: user});
	
		}
	}) (req, res);
});
  
module.exports = user_router