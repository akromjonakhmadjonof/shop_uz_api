const comment_model = require('../models/comment');
const _ = require('lodash');
const user_controller  = require('./user_controller');

module.exports.get_product_comments = (product_id, then) => {
	return comment_model.aggregate([
		{
			'$match':{ 'product':product_id, 'is_reply':false }
		},
		{'$sort': {'entry_time': -1}},
		{
			'$lookup':{
				'from':'users',
				'as':'author',
				'localField':'author',
				'foreignField':'user_id',
			}
		},
		{
			'$lookup':{
				'from':'comments',
				'as':'replies',
				'localField':'replies',
				'foreignField':'comment_id'
			}
		},
		{
			'$project':{
				'author':{ '$first':'$author' },
				'likes':1,
				'replies':1,
				'dislikes':1,
				'product':1,
				'comment_id':1,
				'message':1,
				'entry_time':1,
				'updated_time':1
			}
		},
		{
			'$project':{
				'author':{
					'image':1,
					'full_name':1,
					'user_id':1
				},
				'comment_id': 1,
				'likes':1,
				'replies':1,
				'dislikes':1,
				'message':1,
				'entry_time':1,
				'product': 1,
				'updated_time':1
			}
		}
	]).exec((error, data) => {
		if (data) {
			return then(data)
		}
	});
}

module.exports.get_user_product_comments = async (user_id) => {
	const product_ids = await user_controller.get_user_products(user_id)
	const product_comments = await comment_model.aggregate([
		{'$match': {'product': {'$in': product_ids}, 'is_reply': false}},
		{
			'$lookup': {
				'from': 'products',
				'as': 'product',
				'localField': 'product',
				'foreignField': 'id'
			}
		},
		{
			'$lookup': {
				'from': 'users',
				'as': 'author',
				'localField': 'author',
				'foreignField': 'user_id'
			}
		},
		{
			'$project': {
				'product': {'$first': '$product' },
				'message': 1,
				'entry_time': 1,
				'author': {'$first': '$author' },
				'updated_time': 1,
				'comment_id': 1,
			}
		},
		{
			'$project': {
				'product': {
					'id': 1,
					'images': 1,
					'product': {
						'name': 1
					},
					'created_date': 1
				},
				'parent': {
					'label': 1
				},
				'author': {
					'full_name': 1,
					'image': 1,
					'user_id': 1
				},
				'message': 1,
				'entry_time': 1,
				'updated_time': 1,
				'comment_id': 1,
			}
		}
	])
	return product_comments
}


module.exports.delete_comment = async (comment_id, then) => {
	await comment_model.deleteOne({'comment_id': _.toInteger(comment_id)}).then(then)
}
