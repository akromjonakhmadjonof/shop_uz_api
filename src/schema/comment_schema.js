const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const comment_schema = new Schema({
	'product':{
		'type':Number,
		'required':true
	},
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
	collection:'comments',
	timestamps: { createdAt: 'entry_time', updatedAt: 'updated_time' }
});

comment_schema.plugin(AutoIncrement, { inc_field:'comment_id' });

module.exports = comment_schema;
