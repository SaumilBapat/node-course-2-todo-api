const mongoose = require('mongoose');
let User = mongoose.model("User", {
    email: {
        type: String,
        required: true,
        trim: true, //removed trailing whitespaces
        minlength: 1
    }
});
module.exports = {User};