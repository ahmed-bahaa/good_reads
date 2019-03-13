const mongoose = require('mongoose');

const userBooksSchema = mongoose.Schema({
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'book', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    rate: Number,
    shelve: {type: "string", required: true},
    review: "string"
});

const user_books_model = mongoose.model("user_book",userBooksSchema);

module.exports = user_books_model;