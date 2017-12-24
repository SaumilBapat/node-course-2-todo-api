const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true, //removed trailing whitespaces
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail, //pass in function from validator package
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
    }]
});

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens = [...user.tokens, {access, token}];
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

let User = mongoose.model('User', UserSchema);
module.exports = {User};
// let User = mongoose.model("User", {
//     email: {
//         type: String,
//         required: true,
//         trim: true, //removed trailing whitespaces
//         minlength: 1,
//         unique: true,
//         validate: {
//             validator: validator.isEmail, //pass in function from validator package
//             message: `{VALUE} is not a valid email`
//         }
//     },
//     password: {
//         type: String,
//         require: true,
//         minlength: 6
//     },
//     tokens: [{
//         access: {
//             type: String,
//             required: true
//         },
//         token: {
//             type: String,
//             required: true
//         },
//     }]
// });
