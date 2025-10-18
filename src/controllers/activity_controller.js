const activity = require('./../models/activity');
const serializers = require('../serializer/activity_serializer');
const _ = require('lodash');
const get_target_id = require('./../helpers/get_target_id');

module.exports.user_last_activity_set = async (data, then) => {
	const user_id = _.toInteger(_.get(data, ['user_id']));

	const serializer_data = serializers.activity_set_serializer(user_id);

	const is_present = await activity.findOne({ 'user':user_id });

	if (!is_present) {
		const activity_data = new activity({ ...serializer_data });
		return activity_data.save((doc) => {
			then(doc);
		});
	}
	await activity.findOneAndUpdate({'user': user_id}, {...serializer_data}).then((doc) => {
		then(doc)
	})
};

module.exports.get_last_seen = async (chat, user_id) => {
	const target_id = get_target_id(user_id, chat)
	return await activity.findOne({ 'user':_.toInteger(target_id) });
};
