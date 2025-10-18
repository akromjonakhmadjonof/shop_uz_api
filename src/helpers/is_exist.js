const _ = require('lodash');

module.exports = (data) => {
	return !_.isNull(data) && !_.isUndefined(data) && data !== 'null' && data !== 'undefined';
};
