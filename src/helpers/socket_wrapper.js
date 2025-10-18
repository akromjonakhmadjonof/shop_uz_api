const controllers = require('../controllers');
const { get_data_from_token } = require('./token_generator');
const _ = require('loadsh');

module.exports.fetch_data = async (data) => {
	const {
		socket,
		path,
		token
	} = data;

	// Token Data
	const token_data = get_data_from_token(token);

	// Get Controller
	const controller_path = `${path}.get_${path}`;
	const controller = controllers[controller_path];

	// Socket Params
	const give_path = `give_${path}`;
	const get_path = `get_${path}`;

	// Socket Handshake
	await socket.on(give_path, async (data) => {
		const db_data = await controller({...data, ...token_data});
		socket.emit(get_path, db_data);
	});

};

module.exports.set_item = async (data) => {
	const {
		socket,
		path,
		token
	} = data

	// Token Data
	const token_data = get_data_from_token(token);

	// Paths
	const set_path = `${path}_item_set`
	const path_updated = `${path}_item_updated`
	// Get Controller
	const controller_path = `${path}.set_${path}`;
	const controller = controllers[controller_path];

	await socket.on(set_path, (data) => {
		return controller({ ...data, ...token_data }, () => {
			socket.emit(path_updated);
		});
	});
}

module.exports.create_item = async (data, then, auto_create) => {
	const {
		socket,
		path,
		token,
		auto_params
	} = data;
	// Token Data
	const token_data = get_data_from_token(token);

	// Paths
	const create_path = `${path}_item_create`;
	const path_updated = `${path}s_updated`;

	// Get Controller
	const controller_path = `${path}.create_${path}_item`;
	const controller = controllers[controller_path];

	if (auto_create) {
		return await controller({ ...auto_params, ...token_data }, async ({ ...params }) => {
			socket.emit(path_updated);
			await then && then(params);
		});
	}
	await socket.on(create_path, async ({ ...data }) => {
		return await controller({ ...data, ...token_data }, async ({ ...params }) => {
			socket.emit(path_updated);
			await then && then(params);
		});
	});
};
