const _ = require('lodash');

module.exports.create_chat_serializer = (data) => {
	// Global chat options
	const chat = _.get(data, ['chat']);

	// Target options
	const first_member = _.get(data, ['first_member']);

	// User options
	const second_member = _.get(data, ['second_member']);

	// Return
	return {
		'first_member': first_member,
		'second_member': second_member,
		'chat':chat
	};
};
