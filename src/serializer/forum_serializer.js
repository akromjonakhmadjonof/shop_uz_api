const _ = require('lodash');

module.exports = (message, user_id, is_reply) => {
	return {
		'author':_.toInteger(user_id),
		'is_reply': is_reply,
		'message':message,
		'likes': [],
		'dislikes': [],
		'replies': []
	};
};
