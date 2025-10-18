const mongoose = require('mongoose');
const search_history_schema = require('../schema/search_history_schema');

module.exports = mongoose.model('search_history', search_history_schema);
