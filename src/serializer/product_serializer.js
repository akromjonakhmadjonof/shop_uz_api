const _ = require('loadsh');
const generate_product_code = require('../helpers/generate_product_code');
const user_controller = require('./../controllers/user_controller');

const product_serializer = async (data, token_data) => {
	// Product Options
	const sell_price = _.get(data, ['pricing', 'price']);
	const currency = _.get(data, ['currency']);
	const tags = _.get(data, ['tags']);
	const measurement = _.get(data, ['measurement']);
	const discount_price = _.get(data, ['pricing', 'discount_price']);
	const discount_percent = _.get(data, ['pricing', 'discount_percent']);
	const parent = _.get(data, ['parent']);
	const product_code = generate_product_code();
	const created_date = _.get(data, ['created_date']);
	const name = _.get(data, ['product', 'name']);
	const description = _.get(data, ['product', 'description']);
	const rating = _.get(data, ['rating']) || 0;
	const category = _.get(data, ['product', 'category']);
	const status = _.get(data, ['product', 'status']);
	const balance = _.get(data, ['product', 'balance']);
	const images = _.get(data, ['images']) || [];

	// Author options
	const user_name = _.get(token_data, ['user_name']);
	const user_data = await user_controller.get_author_data(user_name);
	const additional_phone = _.get(data, ['additional', 'phone_number']);
	const additional_name = _.get(data, ['additional', 'name']);
	const author = {
		...user_data,
		'additional':{
			'additional_phone':additional_phone,
			'additional_name':additional_name
		}
	};
	const product = {
		'name':name,
		'description':description,
		'category':category,
		'status':status,
		'balance':balance
	};

	const pricing = {
		'discount_price':discount_price,
		'discount_percent':discount_percent,
		'sell_price':sell_price
	};
	return {
		'rating':{
			'percent':rating
		},
		'product':product,
		'pricing':pricing,
		'author':author,
		'created_date':created_date,
		'parent':parent,
		'product_code':product_code,
		'measurement':measurement,
		'currency':currency,
		'images':images,
		'tags':tags
	};
};

module.exports = {
	product_serializer
};
