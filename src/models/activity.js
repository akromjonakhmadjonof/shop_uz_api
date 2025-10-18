const mongoose = require('mongoose');
const { model } = mongoose;
const activity_schema = require('../schema/activity_schema');

const activity = model('activity', activity_schema);

module.exports = activity;
