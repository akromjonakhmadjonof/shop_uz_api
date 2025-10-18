const moment = require('moment');
const _ = require('lodash');

module.exports.send_message_serializer = (data) => {
	const {message, chat_id, user_id, reply_id, is_reply} = data

	if (is_reply) {
		return {
			'message':message,
			'chat': _.toInteger(chat_id),
			'entry_time':moment().format(),
			'author': _.toInteger(user_id),
			'reply': _.toInteger(reply_id),
			'is_reply': true
		}
	}
	return  {
		'message':message,
		'chat': _.toInteger(chat_id),
		'entry_time':moment().format(),
		'author': _.toInteger(user_id),
	}
}
