const mongoose = require('mongoose');

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


const adminModel = mongoose.model('admin', adminSchema);
module.exports = adminModel;