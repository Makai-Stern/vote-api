const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = global.Promise;
uri = process.env.DATABASE_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

module.exports.User = require('./User');
module.exports.Poll = require('./Poll');
