const mongoose = require('mongoose');
const { model } = mongoose;
const message_schema = require('../schema/message_schema');

const message = model('message', message_schema);

module.exports = message;
