const mongoose = require('mongoose');
const mongoose_paginate = require('mongoose-paginate-v2');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const chat_schema = new Schema({
	'first_member':{
		'required':true,
		'type':Number,
	},

	'second_member':{
		'required':true,
		'type':Number,
	},
	'chat':{
		'type':String,
		'required':true,
		'unique':true
	}
}, {
	'collection':'chats'
});

chat_schema.plugin(AutoIncrement, { 'inc_field':'chat_id' });
chat_schema.plugin(mongoose_paginate);

module.exports = chat_schema;
