const { check } = require('express-validator');
const _ = require('loadsh');
const { get_data_from_token } = require('../helpers/token_generator');
const product_controller = require('./../controllers/product_controller');

module.exports = [
	check('product.name', 'Название товара должно быть не менее 5 символов.').exists().isLength({ min:5 }),
	check('images', 'Вы должны ввести хотя бы 1 изображение.').exists().isLength({ min:1 }),
	check('parent', 'Вы должны выбрать тип продукта.').exists(),
	check('currency', 'Вы должны ввести валюту.').exists(),
	check('product.status', 'Вы должны ввести статус.').exists(),
	check('product.description', 'Длина описания должна быть не менее 20 символов.').exists().isLength({ min:20 })
];

module.exports.product_update_auth_validate = async (req, res, next) => {
	// Token data
	const access_token = _.get(req, ['headers', 'token']);
	const token_data = get_data_from_token(access_token);

	// Params
	const id = _.get(req, ['params', 'id']);

	// Product
	const product_author = await product_controller.get_product_author(id);

	const user_name = _.get(token_data, ['user_name']);

	const author = _.get(product_author, ['user_name']);
	if (author === user_name) {
		return next();
	} else {
		return res
			.status(400)
			.send({
				message:'You have not access to update this product'
			});
	}
};
