const moment = require('moment');

module.exports.search_history_create_serializer = (user_id, search) => {
	return {
		'user':user_id,
		'searches':[
			{
				'text':search,
				'date':moment().format()
			}
		]
	};
};
module.exports.search_history_update_serializer = (user_id, search) => {
	return {
		'text':search,
		'date':moment().format()
	};
};
