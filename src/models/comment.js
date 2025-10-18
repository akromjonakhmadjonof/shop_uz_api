const mongoose = require('mongoose');
const { model } = mongoose;
const comment_schema = require('../schema/comment_schema');

const comment = model('comment', comment_schema);

module.exports = comment;
