const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = mongoose.Schema({
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
    name: {
        type: "string", required: true, validate: {
            validator: function (v) {
                var re = /[a-zA-Z0-9]+/;
                return re.test(v)
            },
            message: 'Provided name is invalid.'
        }
    }
})

adminSchema.pre('save', function (next) {
    const admin = this;

    if (!admin.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(admin.password, salt, function (err, hash) {
            if (err) return next(err);

            admin.password = hash;
            next();
        });
    });
});

adminSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return err;

        cb(null, isMatch);
    })
}

const adminModel = mongoose.model('admin', adminSchema);

module.exports = adminModel;