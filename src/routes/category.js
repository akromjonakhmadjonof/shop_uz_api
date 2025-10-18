// Imports
const express = require('express');
const _ = require('loadsh');
const cors = require('cors');
const router = express.Router();
const list_api = require('../api/list_api');

// Configurations
router.use(cors({
	origin:'*',
	methods:['GET'],
	optionsSuccessStatus:200
}));


// List
const list_options = {
	route:'/:category/get-list/',
	model_key:'product_model',
	pick_params:[
		{
			key:'parent.label',
			path:'category'
		}
	],
	sort:{ 'created_date':-1 }
};

list_api(router, list_options);

// Apis
// router.get('/get-list/', network (req, res) => {
// 	// Params
// 	const category = _.get(req, ['params', 'category']);
// 	// Filters
// 	const filter = { 'parent.label': category };
// 	const sort = { created_date: -1 };
// 	// Data
// 	const list = await ProductModel.find(filter).sort(sort);
// 	const size = _.size(list);
// 	// Send
// 	res
// 		.status(200)
// 		.send({
// 			count: size,
// 			next: null,
// 			prev: null,
// 			results: list
// 		});
// });

module.exports = router;
