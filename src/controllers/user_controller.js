const User = require('../models/user');
const _ = require('lodash');
const product_model = require('./../models/product');
const followers_model = require('../models/followers');

module.exports.get_user_auth_data = async (login, id) => {
	// Filter
	const filter = login ? { 'login.user_name':login } : { 'user_id':id };

	// User Data
	const user_data = await User.findOne(filter);
	const face = _.get(user_data, ['face']);
	const full_name = _.get(user_data, ['full_name']);
	const address = _.get(user_data, ['address']);
	const completed = _.get(user_data, ['completed']);
	const data = _.get(user_data, ['data']);
	const info = _.get(user_data, ['info']);
	const image = _.get(user_data, ['image']);
	const user_id = _.get(user_data, ['user_id']);
	const phones = _.get(user_data, ['phones']);
	const emails = _.get(user_data, ['emails']);
	const social_accounts = _.get(user_data, ['social_accounts']);
	const user_name = _.get(user_data, ['login', 'user_name']);
	return {
		face,
		full_name,
		address,
		completed,
		data,
		info,
		image,
		phones,
		emails,
		social_accounts,
		user_name,
		user_id
	};
};

module.exports.get_user_data = async (document, request) => {
	// Current user
	const current_user_id = _.get(request, ['user_id']);
	// Filter
	const id = _.get(document, ['user_id']);
	const filter = { 'user_id':id };
	const filter_followers = {'$and': [{'user': current_user_id}, {'target': id}]}
	// Fetch
	const user_data = await User.findOne(filter);
	const follower = await followers_model.findOne(filter_followers)
	const is_followed = !!follower
	// User Data
	const face = _.get(user_data, ['face']);
	const full_name = _.get(user_data, ['full_name']);
	const address = _.get(user_data, ['address']);
	const completed = _.get(user_data, ['completed']);
	const data = _.get(user_data, ['data']);
	const info = _.get(user_data, ['info']);
	const image = _.get(user_data, ['image']);
	const user_id = _.get(user_data, ['user_id']);
	const phones = _.get(user_data, ['phones']);
	const emails = _.get(user_data, ['emails']);
	const social_accounts = _.get(user_data, ['social_accounts']);
	const user_name = _.get(user_data, ['login', 'user_name']);
	return {
		'face': face,
		'full_name': full_name,
		'address': address,
		'completed': completed,
		'data': data,
		'info': info,
		'image': image,
		'phones': phones,
		'emails': emails,
		'social_accounts': social_accounts,
		'is_followed': is_followed,
		'user_name': user_name,
		'user_id': user_id
	};
};

module.exports.get_author_data = async (login) => {
	// Filter
	const filter = { 'login.user_name':login };

	// User Data
	const user_data = await User.findOne(filter);
	const face = _.get(user_data, ['face']);
	const full_name = _.get(user_data, ['full_name']);
	const address = _.get(user_data, ['address']);
	const completed = _.get(user_data, ['completed']);
	const data = _.get(user_data, ['data']);
	const info = _.get(user_data, ['info']);
	const id = _.get(user_data, ['user_id']);
	const image = _.get(user_data, ['image']);
	const phones = _.get(user_data, ['phones']);
	const emails = _.get(user_data, ['emails']);
	const social_accounts = _.get(user_data, ['social_accounts']);
	const user_name = _.get(user_data, ['login', 'user_name']);
	return {
		'face':face,
		'full_name':full_name,
		'address':address,
		'completed':completed,
		'data':data,
		'info':info,
		'image':image,
		'phones':phones,
		'emails':emails,
		'social_accounts':social_accounts,
		'user_name':user_name,
		'id':id,
	};
};

module.exports.get_follow_author = async (id) => {
	// Filter
	const filter = { 'user_id':id };

	// User Data
	const user_data = await User.findOne(filter);
	const face = _.get(user_data, ['face']);
	const full_name = _.get(user_data, ['full_name']);
	const completed = _.get(user_data, ['completed']);
	const user_name = _.get(user_data, ['login', 'user_name']);
	return {
		'face':face,
		'full_name':full_name,
		'completed':completed,
		'user_name':user_name,
		'user_id':id,
	};
};

module.exports.get_user_products = async (id) => {
	// Filter
	const filter = { 'author.id':id };
	const list =  await product_model.aggregate([
		{'$match': filter},
		{
			'$project': {
				'id': 1
			}
		}

	])
	return _.map(list, (item) => item.id)
}

