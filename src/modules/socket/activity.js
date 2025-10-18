const _ = require('loadsh');
const socket_wrapper = require('./../../helpers/socket_wrapper')

module.exports = async (socket, token) => {
	const params = {
		'activity': {
			'socket': socket,
			'path': 'activity',
			'token': token
		}
	}
	await socket_wrapper.set_item(params.activity)
};
