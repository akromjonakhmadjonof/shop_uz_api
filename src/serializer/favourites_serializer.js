const _ = require('lodash');

module.exports.favourites_create_serializer = (user_id, product) => {
	return {
		'user': _.toInteger(user_id),
		'favourites': [_.toInteger(product)],
	}
}
