const mongoose = require('mongoose');
const user_schema = require('../schema/user_schema');

const user = mongoose.model('user', user_schema);
module.exports = user;
