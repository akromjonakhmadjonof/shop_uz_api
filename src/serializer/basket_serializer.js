const _ = require('lodash');

module.exports.basket_create_serializer = (user_id, product) => {
	return {
		'user': _.toInteger(user_id),
		'basket': [_.toInteger(product)],
	}
}
