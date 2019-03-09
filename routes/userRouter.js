const express = require("express")
const user_model = require('../models/user');
const user_router = express.Router()
var multer = require('multer')
var upload = multer({ dest: 'public/uploads/user-avatar' })
var authenticate = require('../authenticate');
var passport = require('passport');
//======================== GET ==========================
user_router.get('/signup', async (req, res) => {
    res.render('pages/user/signup-form');
});

user_router.get('/signin', async (req, res) => {
    res.render('pages/signin-form', { userType: 'user' });
});
//======================== POST =========================
user_router.post('/signup', upload.single('avatar'), (req, res, next) => {

    user_model.register(new user_model({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        image: req.file.filename
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
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true,token: token ,status: 'You are successfully logged in!'});
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



//======================== PUT ==========================


//======================== Nada betgarrab el database schema ==========================
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

module.exports = user_router