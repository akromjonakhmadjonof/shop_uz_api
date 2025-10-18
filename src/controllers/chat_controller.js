const messages = require('../models/message');
const chat = require('../models/chat');
const _ = require('lodash');
const message_controller = require('./messages_controller');
const notification_controller = require('../controllers/notification_controller');
const { get_last_seen } = require('./activity_controller');

module.exports.get_user_chats = async ({ user_id }) => {
	const chats = [
		...await chat.aggregate([
			{
				'$match':{ 'first_member':user_id }
			},
			{
				'$lookup':{
					'from':'users',
					'as':'target',
					'localField':'second_member',
					'foreignField':'user_id'
				}
			},
			{
				'$project':{
					'chat':1,
					'chat_id':1,
					'target':{ '$first':'$target' }
				}
			},
			{
				'$project':{
					'chat':1,
					'chat_id':1,
					'target':{
						'full_name':1,
						'face':1,
						'image':1,
						'user_id':1,
						'login.user_name':1
					}
				}
			}
		]),
		...await chat.aggregate([
			{
				'$match':{ 'second_member':user_id }
			},
			{
				'$lookup':{
					'from':'users',
					'as':'target',
					'localField':'first_member',
					'foreignField':'user_id'
				}
			},
			{
				'$project':{
					'chat':1,
					'chat_id':1,
					'target':{ '$first':'$target' }
				}
			},
			{
				'$project':{
					'chat':1,
					'chat_id':1,
					'target':{
						'full_name':1,
						'face':1,
						'image':1,
						'user_id':1,
						'login.user_name':1
					}
				}
			}
		])
	];
	const fix_array = Promise.all(_.map(chats, async (item) => {
		const chat_id = _.get(item, ['chat_id']);

		const last_item = await message_controller.get_last_message(chat_id);

		const last_activity = _.get(last_item, ['entry_time']);
		const last_message = _.get(last_item, ['message']);
		const un_reads_count = await notification_controller.get_chat_unreads_count(user_id, chat_id)
		return {
			un_reads_count,
			last_activity,
			last_message,
			...item
		};
	}));
	return await fix_array;
};

module.exports.get_current_chat = async (data) => {
	const {user_id, chat_id} = data
	const item = await chat.aggregate([
		{
			'$match':{ 'chat_id': _.toInteger(chat_id) }
		},
		{
			'$lookup':{
				'from':'users',
				'as':'target',
				'localField':'second_member',
				'foreignField':'user_id'
			}
		},
		{
			'$lookup':{
				'from':'users',
				'as':'user',
				'localField':'first_member',
				'foreignField':'user_id'
			}
		},
		{
			'$project':{
				'chat':1,
				'chat_id':1,
				'target':{ '$first':'$target' },
				'user':{ '$first':'$user' }
			}
		},
		{
			'$project':{
				'chat':1,
				'chat_id':1,
				'target':{
					'full_name':1,
					'face':1,
					'image':1,
					'user_id':1,
					'login.user_name':1
				},
				'user':{
					'full_name':1,
					'face':1,
					'image':1,
					'user_id':1,
					'login.user_name':1
				}
			}
		}
	])
	const last_activity = await get_last_seen(item[0], user_id);
	const last_seen = _.get(last_activity, ['last_activity']);
	return { ...await item[0], last_seen};
};

module.exports.delete_chat = async (chat_id, then) => {
	await chat.deleteOne({'chat_id': _.toInteger(chat_id)}).then(async () => {
		messages.deleteMany({'chat': _.toInteger(chat_id)}).then(then)
	})
}
