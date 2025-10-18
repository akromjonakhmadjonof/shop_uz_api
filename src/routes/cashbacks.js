// Imports
const express = require('express');
const _ = require('loadsh');
const cors = require('cors');
const router = express.Router();

// Models
const ProductModel = require('../models/product');

// Configurations
router.use(cors({
	origin:'*', methods:['GET'], optionsSuccessStatus:200
}));

// Apis
router.get('/get-cashbacks/', async (req, res) => {
	// Filter
	const filter = {};
	const sort = { created_date:-1 };
	// Data
	const list = await ProductModel.find(filter).sort(sort);
	const products = _.filter(list, (item) => {
		const pricing = _.get(item, ['pricing']);
		const discount_price = _.get(pricing, ['discount_price']);
		const discount_percent = _.get(pricing, ['discount_percent']);
		return (Number(discount_price) && Number(discount_price) > 0) && (Number(discount_percent) && Number(discount_percent) > 0);
	});
	const size = _.size(products);
	// Send
	res
		.status(200)
		.send({
			'prev':null,
			'next':null,
			'count':size,
			'documents':products
		});
});

module.exports = router;
