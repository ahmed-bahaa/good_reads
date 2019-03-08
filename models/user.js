const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
 
const User = new Schema({
    first_name:{
        type:String
    },
    last_name:{
        type:String
    },
    img:{
        type:String
    },
    admin:   {
        type: Boolean,
        default: false
    }
});
 
User.plugin(passportLocalMongoose);
 
module.exports = mongoose.model('User', User);