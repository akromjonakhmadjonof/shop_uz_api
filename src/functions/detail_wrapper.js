const models = require('../models');
const _ = require('lodash');
const is_exist = require('./../helpers/is_exist');
const list_formatter = require('../helpers/formatter');

async function detail_wrapper (data) {
	const {
		model_key,
		filter,
		res,
		token_data,
		options,
		unique_path,
		req
	} = data;

	const body = _.get(req, ['body']);
	const params = _.get(req, ['params']);
	const query = _.get(req, ['query']);


	// Model
	const Model = models[model_key];
	const formatter = _.get(options, ['formatter'], list_formatter);

	// Fetch data
	const detail = await Model.findOne(filter);
	const target = _.get(filter, [unique_path]);
	const formatted_docs = await formatter(detail, { ...token_data, ...body, ...params, ...query });
	const format_data = {
		'target':target,
		'document':formatted_docs,
		'status':'ok'

	};

	if (is_exist(detail)) {
		return res
			.send({
				...format_data
			})
			.status(200);

	}
	return res
		.status(400)
		.send({
			'message':'Detail not exist'
		});

}


module.exports = detail_wrapper;
