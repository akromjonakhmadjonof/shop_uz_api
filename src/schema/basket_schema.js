const mongoose = require('mongoose');
const mongoose_paginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const basket_schema = new Schema({
	'user': {
		'type': Number,
		'required': true,
		'unique': true
	},

	'basket':{
		'type': Array
	}
}, {
	'collection':'basket'
});

basket_schema.plugin(AutoIncrement, { 'inc_field':'basket_id' });
basket_schema.plugin(mongoose_paginate);

module.exports = basket_schema;
