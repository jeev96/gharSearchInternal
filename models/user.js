var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
        validate(value) {
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (format.test(value)) {
                throw new Error('error in name')
            }
        }
    },
    password: {
        type: String,
        minlength: 6
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    userType: {
        type: String,
        required: true,
        validate(value) {
            if (!(value === 'CLIENT' || value === 'AGENT' || value === 'ADMIN')) {
                throw new Error('Invalid user type')
            }
        }
    },
    phone: {
        type: Number,
    },
    organization: {
        type: String
    }
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);