const mongoose = require('mongoose');
const visitors_schema = require('../schema/visitors_schema');

module.exports = mongoose.model('visitors', visitors_schema);
