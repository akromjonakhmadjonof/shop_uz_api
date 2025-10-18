const _ = require('lodash');
module.exports = (current_user, chat) => {
	const target_id = _.get(chat, ['target', 'user_id']);
	const fix_data = target_id === current_user ? {
		...chat,
		'target': _.get(chat, ['user']),
		'user': _.get(chat, ['target'])
	} : chat
	return _.get(fix_data, ['target', 'user_id'])
};
