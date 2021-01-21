const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    polls: [{type: mongoose.Schema.Types.ObjectId, ref: 'Poll'}]
});


/**
    Only hashed password on change, eg.
    when a user updates their username, there is no need to hash the password
**/
userSchema.pre('save', async function(next) {
    try {
        if(!this.isModified('password')) {
            return next(); // Go to next function
        }
        const hashed = await bcrypt.hash(this.password, 10);
        this.password = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(attempt, next) {
    try {
        return await bcrypt.compare(attempt, this.password);
    } catch (err) {
        next(err); // Go to Error Handler
    }
}

module.exports = mongoose.model('User', userSchema)