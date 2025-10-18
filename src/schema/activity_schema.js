const mongoose = require('mongoose');
const mongoose_paginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const activity_schema = new Schema({
	'user': {
		'type': Number,
		'required': true,
		'unique': true
	},

	'last_activity':{
		'type': Date,
		'required': true
	}
}, {
	'collection':'activity'
});

activity_schema.plugin(AutoIncrement, { 'inc_field':'activity_id' });
activity_schema.plugin(mongoose_paginate);

module.exports = activity_schema;
