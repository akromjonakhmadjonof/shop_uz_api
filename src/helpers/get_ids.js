const _ = require('lodash');

module.exports = (array, path = '_id') => {
	return _.map(array, (item) => {
		return _.get(item, path)
	})
}
