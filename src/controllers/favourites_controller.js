const { favourites_create_serializer } = require('../serializer/favourites_serializer');
const favourites_model = require('./../models/favourites');
const _ = require('lodash');

module.exports.favourites_add = async (user_id, id, then) => {
	const is_present = await favourites_model.findOne({ 'user':user_id });
	if (_.isEmpty(is_present)) {
		const data = favourites_create_serializer(user_id, id);
		const favourites = new favourites_model({ ...data });
		favourites.save(then);
	} else {
		await favourites_model.findOneAndUpdate({ 'user':user_id }, { '$addToSet':{ 'favourites':id } }).then(then);
	}
};

module.exports.favourites_remove = async (user_id, id, then) => {
	await favourites_model.findOneAndUpdate({ 'user':user_id }, { '$pullAll':{ 'favourites': [id] } }).then(then);
};

module.exports.get_user_favourites = async (user_id) => {
	const is_present = await favourites_model.findOne({ 'user':user_id });
	return _.get(is_present, ['favourites']);
};

module.exports.get_user_favourites_card = async (user_id) => {
	const is_present = await favourites_model.aggregate([
		{
			'$match': {'user': user_id}
		},
		{
			'$lookup':{
				'from':'products',
				'as':'favourites',
				'localField':'favourites',
				'foreignField':'id',
			}
		},
	]);
	return _.get(is_present[0], ['favourites']);
};
