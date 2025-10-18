const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongoose_paginate = require('mongoose-paginate-v2');

const Product_schema = new Schema({
	'tags':{ 'type':Array },
	'parent':{ 'type':Object }, // String is shorthand for {type: String}
	'product_code':{ 'type':String },
	'created_date':{ 'type':Date },
	'product':{
		'name':{ 'type':String },
		'category':{
			'id':{ 'type':String },
			'name':{ 'type':String }
		},
		'status':{ 'type':Object },
		'balance':{ 'type':String },
		'description':{ 'type':String }
	},
	'author':{
		'type':Object,
		'ref':'user',
		'additional':{
			'type':Object,
			'additional_phone':{
				'type':String
			},
			'additional_name':{
				'type':String
			}
		}
	},
	'pricing':{ 'type':Object },
	'measurement':{ 'type':Object },
	'currency':{ 'type':Object },
	'images':{ 'type':Array },
	'rating':{ 'type':Object }
}, { 'collection':'products' });

Product_schema.plugin(AutoIncrement, { inc_field:'id' });
Product_schema.plugin(mongoose_paginate);

module.exports = Product_schema;
