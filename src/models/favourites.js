const mongoose = require('mongoose');
const { model } = mongoose;
const favourites_schema = require('../schema/favourites_schema');

const favourites = model('favourites', favourites_schema);

module.exports = favourites;
