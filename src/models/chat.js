const mongoose = require('mongoose');
const { model } = mongoose;
const chat_schema = require('../schema/chat_schema');

const chat = model('chat', chat_schema);

module.exports = chat;
