const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const search_history_schema = new Schema({
	'user':{
		'type':Number
	},
	'searches':[{
		'text':{
			'type':String,
			'required':true,
			'unique':true
		},
		'date': {
			'type': Date,
			'required': true
		}
	}]
}, { 'collection':'search_history' });

module.exports = search_history_schema;

search_history_schema.plugin(AutoIncrement, { 'inc_field':'searches.search_id' });
