const mongoose = require('mongoose');
const { model } = mongoose;
const product_schema = require('../schema/product_schema');

const product_model = model('product', product_schema);

module.exports = product_model;
