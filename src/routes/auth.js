// Imports
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bodyParser = require('body-parser');
const { validationResult } = require('express-validator');
const passwordHash = require('password-hash');
const cookieParser = require('cookie-parser');
// Models
const Users = require('../models/user');

// Serializers
const { user_serializer, user_update_serializer } = require('../serializer/user_serializer');
const settings_serializer = require('../serializer/settings_serializer');

// Validators
const userValidator = require('../validations/user_validation');

// Helpers
const { token_generator, validation_token, get_data_from_token } = require('../helpers/token_generator');
const user_controller = require('./../controllers/user_controller');
const _language = require('./../helpers/_language');
const { _translate } = require('../locales/_translate');

// Configurations
router.use(cors({
	origin:'*',
	methods:['GET', 'PUT', 'DELETE'],
	optionsSuccessStatus:200
}));

router.use(bodyParser.json());

router.use(express.json());

router.use(bodyParser.urlencoded({
	extended:false
}));

router.use(cookieParser());
// Apis
router.post('/sign-in/',
	async (req, res) => {
		const lang = _language(req);
		const { t } = _translate(lang);
		// Params
		const { user_name, password } = req.body;
		// Filter
		const filter = {
			'login.user_name':user_name
		};
		// Fetch
		const candidate = await Users.findOne(filter);
		// Check
		if (candidate) {
			const current_password = _.get(candidate, ['login', 'password']);
			const current_user_name = _.get(candidate, ['login', 'user_name']);
			const user_id = _.get(candidate, ['user_id']);
			const compare_password = passwordHash.verify(password, current_password);
			const data = {
				'user_name':current_user_name,
				'user_id':user_id,
				'password':current_password
			};
			if (compare_password) {
				const token = token_generator(data);
				return res
					.cookie('Token', token, {
						maxAge:60 * 60 * 24 * 30 * 1000,
						httpOnly:true
					})
					.status(200)
					.send({
						...await user_controller.get_user_auth_data(current_user_name),
						token
					});
			} else {
				return res.status(401).send({
					message:'Введенная вами комбинация имени пользователя и пароля неверна. Пожалуйста, попробуйте еще раз'
				});
			}
		} else {
			return res
				.status(400)
				.send({
					message: t('auth_user_not_found', user_name)
				});
		}
	});

router.get('/', validation_token, async (req, res) => {
	// Token data
	const access_token = _.get(req, ['headers', 'token']);
	const token_data = get_data_from_token(access_token);
	const user_name = _.get(token_data, ['user_name']);
	// User data
	const current_user = await user_controller.get_user_auth_data(user_name);
	// Send
	return res
		.status(200)
		.send(current_user);

});

router.post('/sign-up/',
	[...userValidator],
	async (req, res) => {
		// Validator
		const errors = validationResult(req);
		// Check
		if (errors.isEmpty()) {
			// Data
			const user = _.get(req, ['body']);
			const user_name = _.get(user, ['login', 'user_name']);
			const email = _.get(user, ['email']);
			// Checks
			const unique_check = Users.where('login.user_name').gte(user_name).then((res) => res);
			const unique_email = Users.where('email').gte(email).then((res) => res);
			// Check for unique email and user_name
			if (unique_check && unique_email) {
				// Create document
				const user_create = new Users({
					...user_serializer(user)
				});
				// Save document
				user_create.save().then((doc) => {
					const current_password = _.get(doc, ['login', 'password']);
					const current_user_name = _.get(doc, ['login', 'user_name']);
					const user_id = _.get(doc, ['user_id']);
					const data = {
						'user_name':current_user_name,
						'password':current_password,
						'user_id': user_id
					};
					const token = token_generator(data);
					return res
						.status(201)
						.send({ ...user_controller.get_user_auth_data(current_user_name), token });
				});
			}
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

router.put('/user-settings/', validation_token, async (req, res) => {
	// Data
	const body = _.get(req, ['body']);
	// Token data
	const access_token = _.get(req, ['headers', 'token']);
	const token_data = get_data_from_token(access_token);
	const user_name = _.get(token_data, ['user_name']);
	// Filter
	const filter = {
		'login.user_name':user_name
	};
	// User data
	const type = _.get(body, ['type']);
	const update = settings_serializer(body, type);
	return await Users.updateOne(filter, update, { upsert:true }).then(() => {
		return res
			.status(200)
			.send({
				message:'Successful'
			});
	}).catch(() => {
		return res
			.status(500)
			.send({
				message:'Error'
			});
	});
});

router.put('/complete/sign-up/', validation_token, async (req, res) => {
	// Data
	const body = _.get(req, ['body']);
	// Token data
	const access_token = _.get(req, ['headers', 'token']);
	const token_data = get_data_from_token(access_token);
	const user_name = _.get(token_data, ['user_name']);
	// Filter
	const filter = {
		'login.user_name':user_name
	};
	const update = user_update_serializer(body, token_data);
	return await Users.updateOne(filter, update, { upsert:true }).then(() => {
		return res
			.status(200)
			.send({
				...update,
				status:'ok'
			});
	}).catch((e) => {
		return res
			.status(500)
			.send({
				message:e
			});
	});
});

router.delete('/delete-user/', validation_token, async (req, res) => {
	// Token data
	const access_token = _.get(req, ['headers', 'token']);
	const token_data = get_data_from_token(access_token);
	const user_name = _.get(token_data, ['user_name']);
	// Filter
	const filter = {
		'login.user_name':user_name
	};
	await Users.findOneAndRemove(filter).then(() => {
		return res.status(204).send({
			message:'User successful deleted'
		});
	}).catch(() => {
		return res.status(400).send({
			message:'User cannot be found'
		});
	});
});

module.exports = router;
