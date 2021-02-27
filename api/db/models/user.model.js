const mongoose = require('mongoose');
const _ = require('lodash');

const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    sessions: [{
        token: {
            type: String,
            required: true,
        },
        expireAt: {
            type: Number,
            required: true,
        }
    }]
})

//*** Instance Methods ***

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    // return the document except password and session (these shouldn't be made available)
    return _.omit(userObject, ['password', 'sessions']);
}

UserSchema.methods.generateAccessAuthToken = function() {
    const user = this;
    return new Promise((resolve, reject) => {
        //Create JSON Web Token and return that
        jwt.sign({_id: user._id.toHexString() }, )
    })
}

