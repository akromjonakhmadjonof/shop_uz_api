const forum_model = require('../models/forum');
const _ = require('lodash');

module.exports.get_forum_data = (then) => {
	return forum_model.aggregate([
		{
			'$sort':{ 'entry_time':-1 }
		},

		{
			'$lookup':{
				'from':'users',
				'as':'author',
				'localField':'author',
				'foreignField':'user_id'
			}
		},
		{
			'$project':{
				'author':{ '$first':'$author' },
				'message':1,
				'entry_time':1,
				'updated_time':1,
				'replies': 1,
				'likes': 1,
				'dislikes': 1,
				'comment_id':1,
			}
		},
		{
			'$project':{
				'author':{
					'full_name':1,
					'image':1,
					'user_id':1
				},

				'replies': 1,
				'likes': 1,
				'dislikes': 1,
				'message':1,
				'entry_time':1,
				'updated_time':1,
				'comment_id':1,
			}
		}
	]).exec((error, data) => {
		if (data) {
			then(data)
		}
	});
};


module.exports.delete_forum_comment = async (comment_id, then) => {
	await forum_model.deleteOne({'_id': _.toInteger(comment_id)}).then(then)
}
