const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const forum_schema = new Schema({
	'replies': {
		'type': Array
	},
	'is_reply': {
		'type': Boolean,
		'default': false
	},
	'likes': {
		'type': Array
	},
	'dislikes': {
		'type': Array
	},
	'message':{
		'type':String,
		'required':true
	},
	'author':{
		'type':Number,
		'required':true
	}
}, {
	collection:'forum',
	_id: false,
	timestamps: { createdAt: 'entry_time', updatedAt: 'updated_time' }
});

forum_schema.plugin(AutoIncrement, { inc_field:'_id' });

module.exports = forum_schema;
