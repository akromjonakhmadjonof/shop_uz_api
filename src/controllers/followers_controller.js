const _ = require('lodash');
const { get_follow_author } = require('./user_controller');

const format_follower_item = async (data, user_id) => {
	const target = _.get(data, ['target']);
	const user = _.get(data, ['user']);
	const followed_date = _.get(data, ['followed_date']);
	const subscribe_id = _.get(data, ['subscribe_id']);
	if (Number(user_id) === user) {
		const data = await get_follow_author(target);
		return {
			'followed_date':followed_date,
			'id':subscribe_id,
			...data
		};
	} else if (target === Number(user_id)) {
		const data = await get_follow_author(user);
		return {
			'followed_date':followed_date,
			'id':subscribe_id,
			...data
		};
	}
};

const get_followers = async (data, request) => {
	const user_id = _.get(request, ['user']);
	return await Promise.all(_.map(data, async (item) => {
		return await format_follower_item(item, user_id);
	}))
};

module.exports = {
	format_follower_item,
	get_followers,
};
