// Imports
const express = require('express');
const cors = require('cors');
const _ = require('loadsh');
const router = express.Router();
const bodyParser = require('body-parser');
const { validationResult } = require('express-validator');

// Serializers
const { product_serializer } = require('../serializer/product_serializer');
const list_api = require('./../api/list_api');
const detail_api = require('./../api/detail_api');

// Models
const ProductModel = require('../models/product');
const product_validation = require('./../validations/product_validation');

// Validators
const validators = require('../validations/product_validation');
const { get_data_from_token } = require('../helpers/token_generator');
// const { post_album_instagram } = require('../helpers/instagram');
const PATH = require('./index');
const { create_new_search_history } = require('../controllers/search_history_controller');

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
	'model_key':'product_model',
	'with_search': true,
	'sort':{ 'created_date':-1 },
	'pick_params': [
		{
			'path': 'search',
			'key': 'search'
		}
	],
	'additional': async (data) => {
		console.log(data)
		const user_id = _.get(data, ['user_id'])
		const search = _.get(data, ['search'])
		search && await create_new_search_history(user_id, search)
	}
};

list_api(router, list_options);

// Detail
const detail_options = {
	model_key:'product_model',
	pick_params:[{ path:'from_date' }, 'to_date', 'category']
};

detail_api(router, detail_options);

// List
const recommendation_list_options = {
	model_key:'product_model',
	pick_params:[{
		key:'parent.label',
		path:'category'
	}],
	route:PATH.RECOMMENDATION,
	sort:{ 'created_date':-1 }
};

list_api(router, recommendation_list_options);

// List
const recommendation_author_options = {
	model_key:'product_model',
	pick_params:[{
		key:'author.id',
		path:'author',
		is_int:true
	}],
	route:PATH.RECOMMENDATION_AUTHOR,
	sort:{ 'created_date':-1 }
};

list_api(router, recommendation_author_options);


router.post('/product-create/',
	[...validators],
	async (req, res) => {
		// Data
		const body = _.get(req, ['body']);

		// Token data
		const access_token = _.get(req, ['headers', 'token']);
		const token_data = get_data_from_token(access_token);

		// Validator
		const errors = validationResult(req);

		// Ready to create
		const data = await product_serializer(body, token_data);

		// Check
		if (errors.isEmpty()) {
			// Create document
			const product = new ProductModel({ ...data });
			// Save document
			product.save();
			// await post_album_instagram(data)
			// Send
			return res
				.status(200)
				.send({
					message:'product_successful_created'
				});
		} else {
			// Errors
			const sendError = _.map(errors, (error) => {
				return _.map(error, (item) => item);
			});
			// Send
			return res
				.status(400)
				.send({
					errors:sendError[1]
				});
		}
	});

router.put('/product-update/:id',
	product_validation.product_update_auth_validate,
	[...validators],
	async (req, res) => {
		// Data
		const body = _.get(req, ['body']);
		const id = _.get(req, ['params', 'id']);
		// Token data
		const access_token = _.get(req, ['headers', 'token']);
		const token_data = get_data_from_token(access_token);

		// Validator
		const errors = validationResult(req);
		// Ready to update
		const data = await product_serializer(body, token_data);
		// Check
		if (errors.isEmpty()) {
			ProductModel.findOneAndUpdate({ _id:id }, { ...data }, () => {
				return res
					.status(200)
					.send({
						message:'success'
					});
			});
		} else {
			const sendError = _.map(errors, (error) => {
				return _.map(error, (item) => item);
			});
			res.send({
				messages:sendError[1]

			}).status(400);
		}
	});

router.delete('/product-delete/:id', async (req, res) => {
	// Data
	const id = _.get(req, ['params', 'id']);
	// Filter
	const filter = { id:id };
	// Delete
	ProductModel.findOneAndRemove(filter).then(() => {
		return res.status(204).send({
			message:'Product successful deleted'
		});
	}).catch(() => {
		return res.status(400).send({
			message:'Product cannot be found'
		});
	});
});

// Module exports
module.exports = router;
