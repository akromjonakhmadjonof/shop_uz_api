const jwt = require('jsonwebtoken');
const _ = require('lodash');

function token_generator (data) {
	const payload = { data };
	return jwt.sign(
		payload,
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn:'24h'
		}
	);
}

function validation_token (req, res, next) {
	const access_token = _.get(req, ['headers', 'token']);
	if (!access_token) {
		return res
			.status(400)
			.send({
				message:'Token validation failed'
			});
	}
	try {
		const validToken = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
		if (validToken) {
			res.authenticated = true;
			return next();
		}
	} catch (e) {
		return res
			.status(400)
			.send({
				message:'Token validation failed'
			});
	}
}

function socket_validation_token (socket, next) {
	const access_token = _.get(socket, ['handshake', 'auth', 'token'])
	if (!access_token) {
		next()
	}
}

function get_data_from_token (access_token) {
	const decoded = jwt.decode(access_token);
	return _.get(decoded, ['data']);
}

module.exports = { socket_validation_token, token_generator, validation_token, get_data_from_token };
