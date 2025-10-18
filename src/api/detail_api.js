const PATH = require('./../routes');
const _ = require('lodash');
const _filter = require('../helpers/_filter');
const detail_wrapper = require('../functions/detail_wrapper');
const { get_data_from_token } = require('../helpers/token_generator');


const detail_api = (router, options) => {
	// Path
	const path = _.get(options, ['route'], PATH.VIEW_DETAILS);

	// Pick params
	const pick_params = _.get(options, ['pick_params']);

	// Model
	const model_key = _.get(options, ['model_key']);

	const unique_path = _.get(options, ['unique_path'], 'id');


	return router.get(path, async (req, res) => {
		// Token data
		const access_token = _.get(req, ['headers', 'token']);
		const token_data = get_data_from_token(access_token);

		// Param Detail id
		const id = _.get(req, ['params', 'id']);

		const filter = { [unique_path]:id, ... _.isEmpty(pick_params) ? {} : _filter(req, pick_params, token_data)};

		const data = {
			'model_key':model_key,
			'filter':filter,
			'req': req,
			'unique_path':unique_path,
			'res':res,
			'token_data': token_data,
			'options':options,
		};

		await detail_wrapper(data);
	});
};


module.exports = detail_api;
