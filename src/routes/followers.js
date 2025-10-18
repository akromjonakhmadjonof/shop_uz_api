// Imports
const express = require('express');
const cors = require('cors');
const router = express.Router();
const bodyParser = require('body-parser');
const list_api = require('../api/list_api');
const PATH = require('./../routes');
const _ = require('loadsh');
const { get_data_from_token, validation_token } = require('../helpers/token_generator');
const followers_model = require('./../models/followers');
const { format_follower_item, get_followers } = require('../controllers/followers_controller');

// Configurations
router.use(cors({
	origin:'*',
	methods:['GET', 'POST', 'PUT', 'DELETE'],
	optionsSuccessStatus:200
}));

router.use(bodyParser.json());

router.use(express.json());

router.use(bodyParser.urlencoded({
	extended:false
}));

// List
const list_options = {
	model_key:'followers_model',
	formatter: get_followers,
	pick_params: [
		{
			key: 'target',
			path: 'user'
		}
	],
	sort:{ 'created_date':-1 }
};

list_api(router, list_options);

// List
const following_list_options = {
	model_key:'followers_model',
	route: '/followings-list/',
	formatter: get_followers,
	pick_params: [
		{
			key: 'user',
			path: 'user'
		}
	],
	sort:{ 'created_date':-1 }
};

list_api(router, following_list_options);

router.post(PATH.CREATE_ITEM, validation_token, async (req, res) => {
	// Token data
	const access_token = _.get(req, ['headers', 'token']);
	const token_data = get_data_from_token(access_token);
	const user_id = _.get(token_data, ['user_id']);

	// Request data
	const target_id = _.get(req, ['body', 'target']);
	const follow_unique = target_id + '&_&' + user_id;
	const is_exist = await followers_model.findOne({ 'follow_unique':follow_unique });
	const follower = new followers_model({
		'target':target_id,
		'user':user_id,
		'followed_date':new Date(),
		'follow_unique':follow_unique
	});

	if (!is_exist) {
		return follower.save().then(async (doc) => {
			const data = await format_follower_item(doc, user_id);
			res
				.status(201)
				.send({
					...data,
					'is_followed': true
				});
		}).catch((error) => {
			res
				.status(500)
				.send(error);
		});
	} else {
		return res
			.status(400)
			.send({
				message:'Following already present'
			});
	}

})

router.delete(PATH.DELETE_ITEM, validation_token, async (req, res) => {
	// Token data
	const access_token = _.get(req, ['headers', 'token']);
	const token_data = get_data_from_token(access_token);
	const user_id = _.get(token_data, ['user_id']);

	// Request data
	const target_id = _.get(req, ['params', 'id']);
	const follow_unique = target_id + '&_&' + user_id;
	await followers_model.deleteOne({ 'follow_unique':follow_unique }).then(() => {
		return res
			.send({
				'is_followed': false,
				'message':'Following successful deleted'
			})
	}).catch(() => {
		return res
			.status(500)
			.send({
				'message':'Internal Server Error'
			})
	});
});
module.exports = router;
