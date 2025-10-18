const mongoose = require('mongoose');
const mongoose_paginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const favourites_schema = new Schema({
	'user': {
		'type': Number,
		'required': true,
		'unique': true
	},

	'favourites':{
		'type': Array
	}
}, {
	'collection':'favourites'
});

favourites_schema.plugin(AutoIncrement, { 'inc_field':'favourites_id' });
favourites_schema.plugin(mongoose_paginate);

module.exports = favourites_schema;
