const jwt = require('jsonwebtoken')

const db = require('../models');

exports.register = async (req, res, next) => {
    try {
        const user = await db.User.create(req.body);
        const { id, username } = user;
        const token = jwt.sign({id, username }, process.env.SECRET);
        res.status(201).json({ id, username, token });
    } catch (err) {
        if (err.code === 11000) {
            err.message = 'Sorry, that username is taken.'
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const user = await db.User.findOne({ username: req.body.username })
        const valid = await user.comparePassword(req.body.password);

        if (valid) {
            const { id, username } = user;
            const token = jwt.sign({id, username }, process.env.SECRET);
            res.json({ id, username, token });
        } else {
            throw new Error('The username or password you entered is incorrect.');
        }

    } catch (err) {
        // For security, generic messages are best
        err.message = 'The username or password you entered is incorrect.'
        next(err);
    }
}