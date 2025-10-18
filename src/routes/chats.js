// Imports
const express = require('express');
const cors = require('cors');
const _ = require('loadsh');
const router = express.Router();
const bodyParser = require('body-parser');
const { validation_token, get_data_from_token } = require('../helpers/token_generator');
const PATH = require('./../routes');

// Models
const Chats = require('../models/chat');

// Controllers
const list_api = require('../api/list_api');
const { create_chat_serializer } = require('../serializer/chat_serializer');

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
	model_key:'chat_model'
};

list_api(router, list_options);

// Detail

// Apis
router.post(PATH.CREATE_ITEM, validation_token, async (req, res) => {
	// Token data
	const access_token = _.get(req, ['headers', 'token']);
	const token_data = get_data_from_token(access_token);
	// Data
	const user_id = _.get(token_data, ['user_id']);
	const target_id = _.get(req, ['body', 'target_id']);

	const final_data = user_id + '&_&' + target_id;
	const data = {
		'chat':final_data,
		'first_member':user_id,
		'second_member':target_id
	};
	const chat = create_chat_serializer(data, token_data);
	const new_chat = new Chats({
		...chat
	});
	const check_is_present = await Chats.findOne({ 'chat':final_data });
	if (check_is_present) {
		return res.status(400)
			.send({
			message:'Chat already present'
		});
	} else {
		new_chat.save().then((doc) => {
			return res.send({
				'status':'ok',
				'chat_id': _.get(doc, ['chat_id']),
				'message':'Successful created'
			});
		});
	}
});

module.exports = router;
