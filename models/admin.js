const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = mongoose.Schema({   
    name: {
        type: "string", required: true, validate: {
            validator: function (v) {
                var re = /[a-zA-Z0-9]+/;
                return re.test(v)
            },
            message: 'Provided name is invalid.'
        }
    }
});
adminSchema.plugin(passportLocalMongoose);
const adminModel = mongoose.model('admin', adminSchema);
module.exports = adminModel;