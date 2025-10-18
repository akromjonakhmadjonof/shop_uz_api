const _ = require('lodash');
const moment = require('moment');

module.exports.activity_set_serializer = (user_id) => {
	return {
		'user': _.toInteger(user_id),
		'last_activity': moment().format()
	}
}
