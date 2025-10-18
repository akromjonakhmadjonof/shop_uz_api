const mongoose = require('mongoose');
const { model } = mongoose;
const forum_schema = require('../schema/forum_schema');

const forum = model('forum', forum_schema);

module.exports = forum;
