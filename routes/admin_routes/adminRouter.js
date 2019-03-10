const express = require("express")
const category_model = require('../../models/category.js')
const admin_model = require('../../models/admin.js');
const author_model = require('../../models/author.js');
const book_model = require('../../models/book.js');
const admin_router = express.Router()
var authenticate = require('../../authenticate');
var passport = require('passport');
var multer = require('multer');
var upload_author = multer({ dest: 'public/uploads/author-avatar' });
var upload_book = multer({ dest: 'public/uploads/book-cover' });



//==========================admin authentication =============================
admin_router.post('/signin', passport.authenticate('local'), (req, res) => {

    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });

});
admin_router.post('/signup', (req, res) => {

    admin_model.register(new admin_model({
        username: req.body.username,
        name: req.body.name
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
    });

});
// router.post('/login', passport.authenticate('local'), (req, res) => {
//   var token = authenticate.getToken({_id: req.user._id});
//   res.statusCode = 200;
//  res.setHeader('Content-Type', 'application/json');
//    res.json({success: true,token: token ,status: 'You are successfully logged in!'});
//   });


//=================== CATEGORY ===================

//create new category
admin_router.post('/categories', async (req, res) => {
    try {
        //console.log(req.body.fname)
        await category_model.create({ name: req.body.name })
        const categories = await category_model.find({})
        res.json({
            status: "success",
            data: categories
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//rupdate category
admin_router.put('/categories/:id', async (req, res) => {

    try {
        await category_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
        const categories = await category_model.find({})
        res.json({
            status: "success",
            data: categories
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }

})

//delete category
admin_router.delete('/categories/:id', async (req, res) => {
    try {
        await category_model.findByIdAndRemove(req.params.id.replace(":", ""))
        const categories = await category_model.find({})
        res.json({
            status: "success",
            data: categories
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})


//===================== AUTHORS =========================

//delete author
admin_router.delete('/authors/:id', async (req, res) => {
    try {
        await author_model.findByIdAndRemove(req.params.id.replace(":", ""));
        const authors = await author_model.find({});
        res.json({
            status: "success",
            data: authors
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//create new author
admin_router.post('/authors', upload_author.single('avatar'), async (req, res) => {
    try {
        let image = req.file ? req.file.filename : null;
        const new_author = await author_model.create({ fname: req.body.fname, lname: req.body.lname, author_photo: image, birth_date: req.body.birth_date })
        const authors = await author_model.find({})
        res.json({
            status: "success",
            data: authors
        });
    }
    catch (err) {
        res.json({
            status: "failure",
            data: err
        });
    }
})

//update author
admin_router.put('/authors/:id', async (req, res) => {

    try {
        const updated_author = await author_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
        const authors = await author_model.find({})
        res.json({
            status: "success",
            data: authors
        });
    }
    catch (e) {
        res.json({
            status: "failure",
            data: err
        });
    }

})


//===================== Books =========================

//delete author
admin_router.delete('/books/:id', async (req, res) => {
    try {
        await book_model.findByIdAndRemove(req.params.id.replace(":", ""));
        const books = await book_model.find({});
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
})

//create new book
admin_router.post('/books', upload_book.single('cover'), async (req, res) => {
    try {
        let image = req.file ? req.file.filename : null;
        await book_model.create({
            name: req.body.name, description: req.body.description, cover: image, author_id: req.body.author_id,
            category_id: req.body.category_id
        })
        const books = await book_model.find({})
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
})

//update book
admin_router.put('/books/:id', async (req, res) => {

    try {
        const updated_book = await book_model.findByIdAndUpdate(req.params.id.replace(":", ""), req.body, { new: true })
        const books = await book_model.find({})
        res.json({
            status: "success",
            data: books
        });
    }
    catch (e) {
        res.json({
            status: "failure",
            data: err
        });
    }

})



//======================== Nada betgarrab el database schema ==========================
// admin_router.post('/signup',async(req, res)=> {
//     try
//     {
//         const admin = new admin_model({username:req.body.username, password:req.body.password, name:req.body.name})
//         // const admin = new admin_model({username:"admin", password:"admin", name:"good reads admin"}) //dummy admin created on the fly
//         await admin.save((err, doc) => {
//             if (err) console.log(err) //duplicate username
//             const admins = admin_model.find((err,doc)=>{
//                 res.send(doc);
//             }) 
//         })
//     }
//     catch( err ){
//         console.log( err )
//     }});

module.exports = admin_router