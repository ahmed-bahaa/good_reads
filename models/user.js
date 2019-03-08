const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    first_name: {
        type: "string", required: true, validate: {
            validator: function (v) {
                var re = /^[A-Za-z][A-Za-z0-9]*$/;
                return re.test(v)
            },
            message: 'Provided username is invalid.'
        }
    },
    last_name: {
        type: "string", required: true, validate: {
            validator: function (v) {
                var re = /^[A-Za-z][A-Za-z0-9]*$/;
                return re.test(v)
            },
            message: 'Provided username is invalid.'
        }
    },
    username: {
        type: "string", required: true, index: { unique: true }, validate: {
            validator: function (v) {
                var re = /^[A-Za-z][A-Za-z0-9]*$/;
                return re.test(v)
            },
            message: 'Provided username is invalid.'
        }
    },
    password: { type: "string", required: true },
    image: { type: "string" },
    books: [
        {
            book: { type: mongoose.Schema.Types.ObjectId, ref: 'book' },
            shelve: ['Read', 'Currently Reading', 'Want to Read'],
            rate: "number"
        }
    ]
})

userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return err;

        cb(null, isMatch);
    })
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;