const PropTypes = require('prop-types');
const _ = require('lodash');
const models = require('./../models');
const list_formatter = require('../helpers/formatter');

async function list_wrapper (data) {
	const {
		model_key,
		filter,
		options,
		sort,
		token_data,
		res,
		req,
		with_search
	} = data;
	const body = _.get(req, ['body']);
	const params = _.get(req, ['params']);
	const query = _.get(req, ['query']);
	// Options
	const _offset = _.get(req, ['body', 'offset'], 0);
	const _page = _.get(req, ['body', 'page'], 0);
	const _limit = _.get(req, ['body', 'limit'], 25);
	const formatter = _.get(options, ['formatter'], list_formatter);
	const search = _.get(req, ['query', 'search']);
	const regex = new RegExp(search, 'i');

	// Get Model
	const Model = models[model_key];
	// Fetch data
	const list = !with_search ? await Model.paginate(filter, {
		page:_page,
		limit:_limit,
		offset:_offset,
		sort
	}) : await Model.paginate(filter, { page:_page, limit:_limit, offset:_offset, sort });
	const documents = _.get(list, ['docs']);
	const has_next_page = _.get(list, ['hasNextPage']);
	const has_prev_page = _.get(list, ['hasPrevPage']);
	const limit = _.get(list, ['limit']);
	const offset = _.get(list, ['offset']);
	const page = _.get(list, ['page']);
	const count = _.size(documents);
	const formatted_docs = await formatter(documents, { ...token_data, ...body, ...params, ...query });
	const format_data = {
		'documents':formatted_docs,
		'has_next_page':has_next_page,
		'has_prev_page':has_prev_page,
		'limit':limit,
		'offset':offset,
		'page':page,
		'count':count

	};

	return res
		.send({
			...format_data
		})
		.status(200);
}

list_wrapper.propTypes = {
	model_key:PropTypes.string.isRequired,
	filter:PropTypes.object,
	sort:PropTypes.object
};

module.exports = list_wrapper;
