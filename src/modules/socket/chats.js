const _ = require('loadsh');
const socket_wrapper = require('./../../helpers/socket_wrapper');
const chats_controller = require('../../controllers/chat_controller');

module.exports = async (socket, token) => {
	const params = {
		'chats': {
			'socket': socket,
			'path': 'chats',
			'token': token
		},
		'chat':{
			'socket':socket,
			'path':'chat',
			'token':token
		}
	}

	await socket_wrapper.fetch_data(params.chats);

	await socket_wrapper.fetch_data(params.chat);

	await socket.on('delete_chat', async ({ chat_id }) => {
		await chats_controller.delete_chat(chat_id, () => {
			socket.emit('chats_updated')
			socket.emit('successful_deleted')
		});
	});
};
