// Imports
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const _ = require('loadsh');
const router = express.Router();

// Models
const ProductModel = require('../models/product');

// Configurations
router.use(cors({
	origin:'*',
	methods:['GET', 'POST'],
	optionsSuccessStatus:200
}));

router.use(bodyParser.json());

router.use(express.json());

router.use(bodyParser.urlencoded({
	extended:false
}));

// Apis
router.get('/get-list/', async (req, res) => {
	// Filter
	const filter = {};
	// Data
	const list = await ProductModel.find(filter);
	// Filter items
	const items = _.filter(list, (item) => {
		return !_.isEmpty(item.tags);
	});
	const tags = _.map(items, (item) => {
		return item.tags;
	});
	// Size
	const size = _.size(tags);
	// Send
	return res
		.status(200)
		.send({
			count:size,
			prev:null,
			next:null,
			results:tags
		});
});

module.exports = router;
