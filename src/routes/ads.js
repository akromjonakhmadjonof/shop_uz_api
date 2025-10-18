// Imports
const express = require('express');
const cors = require('cors');
const router = express.Router();

const { validation_token } = require('../helpers/token_generator');
const list_api = require('../api/list_api');

// Configurations
router.use(cors({
	origin:'*',
	methods:['GET'],
	optionsSuccessStatus:200
}));

// Apis


// List
const list_options = {
	model_key:'product_model',
	pick_params:[
		{
			key:'author.user_name',
			path:'user_name'
		}
	],
	sort:{ 'created_date':-1 }
};

list_api(router, list_options, validation_token);

module.exports = router;
