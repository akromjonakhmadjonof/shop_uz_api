const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const notification_schema = new Schema({
	'type': {
		'type': String,
		'default': 'default',
		'enum': ['default', 'messages', 'comments', 'requests'],
	},
	'content': {
		'required': true,
		'type': Number
	},
	'for_whom': {
		'type': Number,
		'required': true
	}
}, {
	collection:'notifications'
});

notification_schema.plugin(AutoIncrement, { inc_field:'notification_id' });

module.exports = notification_schema;
