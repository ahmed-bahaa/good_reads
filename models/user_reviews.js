const mongoose = require('mongoose');

const userReviewsSchema = mongoose.Schema({
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'book', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    review: {type: "string", required: true}
});


const user_reviews_model = mongoose.model("user_review",userReviewsSchema);

module.exports = user_reviews_model;