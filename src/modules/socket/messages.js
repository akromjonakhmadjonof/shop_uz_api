const socket_wrapper = require('../../helpers/socket_wrapper');
const _ = require('loadsh');
const { get_current_chat } = require('../../controllers/chat_controller');

module.exports = async (socket, token, online_users, current_user, io) => {
	const params = {
		'messages':{
			'socket':socket,
			'path':'messages',
			'token':token
		},
		'message':{
			'socket':socket,
			'path':'message',
			'token':token
		},
		'notification':{
			'socket':socket,
			'path':'notification',
			'token':token,
			'auto_params':{}
		}
	};
	const current_user_id = _.get(current_user, ['id'])
	const current_user_name = _.get(current_user, ['name'])
	await socket_wrapper.fetch_data(params.messages);

	await socket_wrapper.create_item(params.message, async ({ ...data }) => {
		const chat = await get_current_chat({'chat_id': _.get(data, ['_doc', 'chat'])});
		const user_id = _.toInteger(_.get(chat, ['user', 'user_id']))
		const target_id = _.toInteger(_.get(chat, ['target', 'user_id']))
		const target_name = _.get(chat, ['target', 'login', 'user_name'])
		const user_name = _.get(chat, ['user', 'login', 'user_name'])
		if (target_name !== user_name) {
			// For Update Messages
			io.to(online_users[target_name]).emit('chats_updated')
			io.to(online_users[user_name]).emit('chats_updated')

			// For Update Messages
			io.to(online_users[target_name === current_user_name ? user_name : target_name]).emit('new_message_notification');
			io.to(online_users[target_name]).emit('messages_updated');
			io.to(online_users[user_name]).emit('messages_updated');

		}
		params.notification.auto_params = {
			'type':'messages',
			'content':_.get(data, ['_doc', 'message_id']),
			'for_whom': user_id === current_user_id ? target_id : target_id === current_user_id ? user_id : 0
		};
		await socket_wrapper.create_item(params.notification, async ({...params1}) => {

		}, true);
	});

};
