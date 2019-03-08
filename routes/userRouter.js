const express = require("express")
const user_model = require('../models/user');
const user_router = express.Router()
var multer = require('multer')
var upload = multer({ dest: 'public/uploads/user-avatar' })

//======================== GET ==========================
user_router.get('/signup', async (req, res) => {
    res.render('pages/user/signup-form');
});

//======================== POST =========================
user_router.post('/signup', upload.single('avatar'), async (req, res) => {
    try {
        const user = new user_model({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password,
            image: req.file.filename
        });
        await user.save((err, doc) => {
            if (err) console.log(err) //duplicate username
            const users = user_model.find((err, doc) => { //da hyb2a redirect lel user homepage
                res.send(doc);
            })
        })
    }
    catch (err) {
        console.log(err)
    }
})

//======================== DELETE =======================


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