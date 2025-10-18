// Imports
const express = require('express');
const cors = require('cors');
const router = express.Router();
const bodyParser = require('body-parser');
const detail_api = require('../api/detail_api');
const { get_user_data } = require('../controllers/user_controller');
const PATH = require('./index');
const list_api = require('../api/list_api');

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


// Detail
const detail_options = {
	'model_key':'user_model',
	'unique_path':'user_id',
	'formatter': get_user_data
};

detail_api(router, detail_options);


// List
const author_products = {
	model_key:'product_model',
	pick_params:[{
		key: 'author.id',
		path:'author',
		is_int: true
	}],
	route:PATH.AUTHOR_PRODUCTS,
	sort:{ 'created_date':-1 }
};

list_api(router, author_products);

module.exports = router;
