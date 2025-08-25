const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    password : {
        type: String,
        required: true
    },
    fullName : {
        type : String,
        required : true,
        trim : true
    },

    userName : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("User", userSchema);
