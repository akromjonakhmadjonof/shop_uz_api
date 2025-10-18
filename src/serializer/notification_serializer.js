const _ = require('lodash');
module.exports.notification_create_serializer = (data) => {
	return {
		'type': _.get(data, ['type']),
		'content': _.get(data, ['content']),
		'for_whom': _.get(data, ['for_whom'])
	}
}
