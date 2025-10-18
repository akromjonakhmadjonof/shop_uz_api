const product = require('./../models/product');
const _ = require('lodash');

module.exports.get_product_data = async (id) => {
	// Filter
	const filter = { 'id':id };
	// Fetch
	return await product.findOne(filter);
};

module.exports.get_product_author = async (id) => {
	// Filter
	const filter = { 'id':id };
	// Fetch
	const product_data = await product.findOne(filter);
	const author = _.get(product_data, ['author']);
	return {
		...author
	};
};
