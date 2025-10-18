const mongoose = require('mongoose');
const { model } = mongoose;
const notification_schema = require('../schema/notification_schema');

const notification = model('notification', notification_schema);

module.exports = notification;
