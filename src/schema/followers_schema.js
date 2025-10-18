const { Schema } = require('mongoose');
const mongoose_paginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const followers_schema = new Schema({
	'user':{
		'type':Number,
		'required':true,
		'index': true
	},
	'follow_unique':{
		'type':String,
		'required':true,
		'index': true,
		'unique': true
	},
	'target':{
		'type':Number,
		'required':true,
		'index': true
	},
	'followed_date':{
		'type':Date,
		'required':true
	}
}, { 'collection':'followers',  'unique': true  });

followers_schema.plugin(AutoIncrement, { 'inc_field':'subscribe_id' });
followers_schema.plugin(mongoose_paginate);

module.exports = followers_schema
