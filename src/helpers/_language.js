const _ = require('lodash');

module.exports = (request) => {
	return _.get(request, ['headers', 'accept-language']);
}
