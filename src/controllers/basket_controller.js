const { basket_create_serializer } = require('../serializer/basket_serializer');
const basket_model = require('./../models/basket');
const _ = require('lodash');

module.exports.basket_add = async (user_id, id, then) => {
	const is_present = await basket_model.findOne({ 'user':user_id });
	if (_.isEmpty(is_present)) {
		const data = basket_create_serializer(user_id, id);
		const basket = new basket_model({ ...data });
		basket.save(then);
	} else {
		await basket_model.findOneAndUpdate({ 'user':user_id }, { '$addToSet':{ 'basket':id } }).then(then);
	}
};

module.exports.basket_remove = async (user_id, id, then) => {
	await basket_model.findOneAndUpdate({ 'user':user_id }, { '$pullAll':{ 'basket': [id] } }).then(then);
};

module.exports.get_user_basket = async (user_id) => {
	const is_present = await basket_model.findOne({ 'user':user_id });
	return _.get(is_present, ['basket']);
};

module.exports.get_user_basket_card = async (user_id) => {
	const is_present = await basket_model.aggregate([
		{
			'$match': {'user': user_id}
		},
		{
			'$lookup':{
				'from':'products',
				'as':'basket',
				'localField':'basket',
				'foreignField':'id',
			}
		},
	]);
	return _.get(is_present[0], ['basket']);
};
