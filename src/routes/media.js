// Imports
const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const cors = require('cors');
const _ = require('lodash');

// Configurations
router.use(cors({
	origin:'*',
	methods:['GET', 'DELETE']
}));

// Apis
router.get('/uploads/images/:image/', (req, res) => {
	// Params
	const image = _.get(req, ['params', 'image']);
	// Send
	return res
		.status(200)
		.sendFile(path.resolve(`./public/uploads/images/${image}`));
});

router.delete('/delete/images/:image/', (req, res) => {
	// Params
	const image = _.get(req, ['params', 'image']);
	// Data
	const DIR = path.resolve(`./public/uploads/images/${image}`);
	// Check
	if (!image) {
		// Send
		return res
			.status(400)
			.send({
				error:'No file received'
			});
	} else {
		try {
			// Handlers
			fs.unlinkSync(DIR);
			// Send
			return res.status(204).send({
				message:'Successfully! image has been deleted'
			});
		} catch (err) {
			// Error
			return res
				.status(400)
				.send(err);
		}
	}
});

module.exports = router;
