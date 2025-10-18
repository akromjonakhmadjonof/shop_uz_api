const mongoose = require('mongoose');
const followers_schema = require('../schema/followers_schema');

const followers = mongoose.model('followers', followers_schema);

module.exports = followers;
