const message = require('../models/message');
const _ = require('lodash');
const message_model = require('../models/message');
const message_controller = require('../serializer/message_serializer');

module.exports.get_chat_messages = async ({ chat_id }) => {
	const results = await message.aggregate([
		{
			'$match':{ 'chat':chat_id }
		},
		{
			'$lookup':{
				'from':'messages',
				'as':'reply',
				'localField':'reply',
				'foreignField':'message_id'
			}
		},
		{
			'$project': {
				'reply': {'$first': '$reply'},
				'message_id': 1,
				'chat': 1,
				'message': 1,
				'entry_time': 1,
				'updated_time': 1,
				'is_reply': 1,
				'author':1
			}
		}
	]);
	return { ...await results };
};

module.exports.delete_message = async (id) => {
	await message.deleteOne({ 'message_id':id }).then(() => {
		return true
	}).catch(() => {
		return false
	})
}

module.exports.get_last_message = async (chat_id) => {
	const messages = await message.findOne({'chat': chat_id}).sort({'entry_time': -1})
	return messages
}

module.exports.send_message = async (params, then) => {
	const {chat_id} = params

	const reply_id = _.get(params, ['reply_id']);
	if (!reply_id) {
		const result = message_controller.send_message_serializer(params);
		const message_save = new message_model(result);
		return message_save.save().then(async (doc) => {
			await then(doc, chat_id)
		});
	}

	const result = message_controller.send_message_serializer({ ...params, 'is_reply': true });

	const message_save = new message_model(result);

	return message_save.save().then(async (doc) => {
		await then(doc, chat_id)
	});
}
