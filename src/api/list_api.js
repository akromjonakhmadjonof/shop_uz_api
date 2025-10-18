const PATH = require('./../routes');
const _ = require('lodash');
const list_wrapper = require('../functions/list_wrapper');
const _filter = require('../helpers/_filter');
const always_valid = require('./../validations/always_valid');
const { get_data_from_token } = require('../helpers/token_generator');

const _language = require('./../helpers/_language');

const list_api = (router, options, validation = always_valid) => {
	const path = _.get(options, ['route'], PATH.GET_LIST);
	router.get(path, validation, async (req, res) => {

		// Token data
		const access_token = _.get(req, ['headers', 'token']);
		const token_data = get_data_from_token(access_token);

		// Filter
		const pick_params = _.get(options, ['pick_params'], []);
		const filter = _.isEmpty(pick_params) ? {...token_data} : { ..._filter(req, pick_params, token_data)};
		const sort = _.get(options, ['sort'], {});
		const with_search = _.get(options, ['with_search'], false);
		const additional = _.get(options, ['additional'], async () => {});


		additional && await additional({...filter, ...token_data})
		// Options
		const model_key = _.get(options, ['model_key']);
		const data = {
			'model_key':model_key,
			'with_search': with_search,
			'filter':filter,
			'sort':sort,
			'req':req,
			'token_data': token_data,
			'options':options,
			'res':res
		};
		await list_wrapper(data);

	});

};
module.exports = list_api;
