// Imports
const express = require('express');
const router = express.Router();
const cors = require('cors');
const VisitorsModel = require('../models/visitors');
const _ = require('loadsh');
const { get_product_data } = require('../controllers/product_controller');
const is_exist = require('./../helpers/is_exist');

// Configurations
router.use(cors({
	origin:'*',
	methods:['GET']
}));

// Apis
router.get('/detail-views/:id', async (req, res) => {
	// Filter
	const filter = {};
	// Fetch
	VisitorsModel.find(filter).then(async (response) => {
		// Params
		const id = _.get(req, ['params', 'id']);
		const product = await get_product_data(id);
		// Data
		const ids = _.isEmpty(response) ? [] : _.map(response, (item) => item.id);
		// Permission
		const isIncluded = ids.includes(id);
		// Check
		if (is_exist(product)) {
			if (!isIncluded) {
				// Create document
				const visit = new VisitorsModel({
					id:id,
					count:1
				});
				// Save document
				visit.save();
				// Send
				return res
					.status(201)
					.send({
						message:'Successful added to visitors',
						results:1
					});
			} else {
				// Filter
				const filter = { id:id };
				const current = _.filter(response, (item) => {
					// Filter
					return item.id === id;
				});
				// Data
				const data = { count:Number(current[0].count) + 1 };
				// Update count visitors
				VisitorsModel.updateOne(filter, data).then(() => {
					// Send
					return res
						.status(200)
						.send({
							message:'successful',
							results:Number(current[0].count) + 1
						});
				});
			}
		} else {
			res
				.status(400)
				.send({
					'message':'Detail not exist'
				});
		}
	});
});

module.exports = router;
