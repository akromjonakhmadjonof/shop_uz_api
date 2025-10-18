const notification_model = require('./../models/notification');
const _ = require('lodash');
const get_ids = require('./../helpers/get_ids');
const notifications_serializer = require('../serializer/notification_serializer');

module.exports.notification_create = async (data = {}, then) => {
	const create_data = notifications_serializer.notification_create_serializer(data)
	const notification = new notification_model(create_data);
	notification.save().then(async () => {
		await then({})
	});
};

module.exports.get_messages_notification = async (user_id) => {
	const list = await notification_model.aggregate([
		{
			'$match':{ 'type':'messages' }
		},
		{
			'$match':{ 'for_whom':user_id }
		},
		{
			'$lookup':{
				'from':'messages',
				'as':'content',
				'localField':'content',
				'foreignField':'message_id'
			}
		},
		{
			'$project':{
				'type':1,
				'notification_id': 1,
				'content': {'$first': '$content'},
				'for_whom':1,
			}
		},
		{
			'$lookup':{
				'from':'users',
				'as':'content.author',
				'localField':'content.author',
				'foreignField':'user_id'
			}
		},
		{
			'$project':{
				'type':1,
				'notification_id': 1,
				'content': {
					'message': 1,
					'message_id': 1,
					'entry_time': 1,
					'author': {'$first': '$content.author'}
				},
				'for_whom':1,
			}
		},
		{
			'$project':{
				'type':1,
				'notification_id': 1,
				'content': {
					'message': 1,
					'message_id': 1,
					'entry_time': 1,
					'author': {
						'user_id': 1,
						'login.user_name': 1,
						'full_name':1
					}
				},
				'for_whom':1,
			}
		}
	]);
	return await list;
};

module.exports.get_chat_unreads_count = async (user_id, chat_id) => {
	const notifications = await notification_model.aggregate([
		{
			'$match':{
				'type':'messages',
				'for_whom':_.toInteger(user_id)
			}
		},
		{
			'$lookup':{
				'from':'messages',
				'as':'content',
				'localField':'content',
				'foreignField':'message_id'
			}
		},
		{
			'$project':{
				'type':1,
				'notification_id':1,
				'content':{ '$first':'$content' },
				'for_whom':1,
			}
		},
		{
			'$match':{
				'content.chat': _.toInteger(chat_id)
			}
		},
	]);
	return _.size(notifications)
};

module.exports.remove_unreads_count = async (user_id, chat_id, then) => {
	const notifications = await notification_model.aggregate([
		{
			'$match':{ 'type':'messages' }
		},
		{
			'$match':{ 'for_whom':_.toInteger(user_id) }
		},
		{
			'$lookup':{
				'from':'messages',
				'as':'content',
				'localField':'content',
				'foreignField':'message_id'
			}
		},
		{
			'$project':{
				'type':1,
				'notification_id':1,
				'content':{ '$first':'$content' },
				'for_whom':1,
			}
		},
		{
			'$match':{ 'content.chat':_.toInteger(chat_id) }
		},
		{
			'$project':{
				'notification_id':1,
				'_id':0
			}
		},
	]);
	const ids = get_ids(notifications, 'notification_id');
	await notification_model.deleteMany({ '$in':ids }).then(then);
};
