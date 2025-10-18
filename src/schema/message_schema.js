const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const message_schema = new Schema({
	'chat':{
		'type':Number,
		'required':true
	},
	'message':{
		'type':String,
		'required':true
	},
	'entry_time':{
		'type':Date,
		'required':true
	},
	'updated_time':{
		'type':Date
	},
	'is_reply':{
		'type':Boolean,
		'default': false
	},
	'reply': {
		'type': Number
	},
	'author':{
		'type':Number,
		'required':true
	}
}, {
	collection:'messages',
	timestamps:true
});

message_schema.plugin(AutoIncrement, { inc_field:'message_id' });

module.exports = message_schema;
