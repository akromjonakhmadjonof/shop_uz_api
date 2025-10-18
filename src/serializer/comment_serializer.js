const _ = require('lodash');

module.exports = (message, product, user_id, is_reply) => {
	return {
		'product':_.toInteger(product),
		'author':_.toInteger(user_id),
		'is_reply': is_reply,
		'message':message,
		'likes': [],
		'dislikes': [],
		'replies': []
	};
};
