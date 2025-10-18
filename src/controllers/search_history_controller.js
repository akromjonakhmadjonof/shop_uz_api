const search_history = require('./../models/search_history');
const _ = require('lodash');
const serializers = require('../serializer/search_history_serializer');

module.exports.create_new_search_history = async (user_id, search, then) => {
	const check_unique = await search_history.findOne({ 'user':_.toInteger(user_id) });
	const searches = _.get(check_unique, ['searches']);
	const search_unique = _.filter(searches, (item) => {
		const last = _.get(item, ['text']);
		return last === search;
	});
	if (!check_unique) {
		const new_history = new search_history(serializers.search_history_create_serializer(user_id, search));
		new_history.save().then(then && then);
	} else if (_.isEmpty(search_unique)) {
		const search_data = serializers.search_history_update_serializer(user_id, search);
		await search_history.findOneAndUpdate({ 'user':user_id }, {
			'$addToSet':{ 'searches': {...search_data} }
		}).then(() => console.log('success')).catch(console.log);
	}
};
