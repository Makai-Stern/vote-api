const { decode } = require('jsonwebtoken');
const db = require('../models');

exports.showPolls = async (req, res, next) => {
    try {
        const polls = await db.Poll.find()
        .populate('user', [
            'username',
            'id'
        ]);
        res.status(200).json(polls);
    } catch (err) {
        err.status = 400;
        next(err); // Send to Error Handler
    }
}

exports.getPoll = async (req, res, next) => {
    try {
      const { id } = req.params;
      const poll = await  db.Poll.findById(id)
      .populate('user', [
            'username',
            'id'
        ]);

     //   console.log('User ID:) ', poll.user._id)
      if (!poll) throw new Error('No poll found');

      return res.status(200).json(poll);
    } catch (err) {
      return next({
        status: 400,
        message: err.message,
      });
    }
  };


  exports.createPoll = async (req, res, next) => {
    const { id } = req.decoded;
    const { question, options } = req.body;
    try {
      const user = await db.User.findById(id);
      const poll = await db.Poll.create({
        question,
        user,
        options: options.map(option => ({ option, votes: 0 })),
      });
      user.polls.push(poll._id);
      await user.save();

      return res.status(201).json({ ...poll._doc, user: user._id });
    } catch (err) {
      return next({
        status: 400,
        message: err.message,
      });
    }
  };


exports.userPolls = async(req, res, next) => {
    try {
        // Destructure Alias
        const {id} = req.decoded;
        // Get all Polls Created by user
        const user = await db.User.findById(id).populate('polls');
        res.status(200).json(user.polls);
    } catch (err) {
        err.status = 400;
        next(err);
    }
}

exports.deletePoll = async (req, res, next) => {
    try {
        // Destructure Alias
        const { id: poll_Id } = req.params;
        const { id: user_Id } = req.decoded;
        const poll = await db.Poll.findById(poll_Id);

        if (!poll) throw new Error('No poll found.');
        /**
        * Poll.user is an object type of ID,
        * before it is populated
        **/
        if (poll.user.toString() !== user_Id) {
            throw new Error('Unathorized access.');
        }

        await poll.remove();
        res.status(202).json(poll);
    } catch (err) {
        next(err);
    }
}


exports.vote = async (req, res, next) => {
    try {
        const { id: poll_Id } = req.params;
        const { id: user_id } = req.decoded;
        const { answer } = req.body;

        if (answer) {
            const poll = await db.Poll.findById(poll_Id);
            if (!poll) throw new Error('No poll found');
            const vote = poll.options.map(
            option => {
                if (option.option === answer) {
                    return {
                        option: option.option,
                        _id: option._id,
                        votes: option.votes + 1
                    }
                } else {
                    return option;
                }
            }
            );

            if (poll.voted.filter(user => user.toString() === user_id).length <= 0) {
                poll.voted.push(user_id);
                poll.options = vote;
                await poll.save();
                res.status(202).json(poll);
            } else {
                throw new Error('Already Voted.')
            }

        } else {
            throw new Error('No answer provided.');
        }
    } catch (err) {
        next(err);
    }
  };