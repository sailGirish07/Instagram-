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
    profilePic: {
        type: String,
        default: "https://via.placeholder.com/150"
    },
    bio: {
        type: String,
        maxlength: 200,
        default: ""
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"   
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.index({ userName: 'text', fullName: 'text' });


module.exports = mongoose.model("User", userSchema);
