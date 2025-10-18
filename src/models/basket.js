const mongoose = require('mongoose');
const { model } = mongoose;
const basket_schema = require('../schema/basket_schema');

const basket = model('basket', basket_schema);

module.exports = basket;
