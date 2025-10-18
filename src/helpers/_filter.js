const _ = require('lodash');

const _filter = (req, pick_params, token) => {
	const body = _.get(req, ['body']);
	const params = _.get(req, ['params']);
	const query = _.get(req, ['query']);
	const obj = { ...query, ...params, ...body, ...token };
	const data = _.map(pick_params, (item) => {
		const key = _.get(item, ['key']);
		const path = _.get(item, ['path']);
		const current_path = Array.isArray(path) ? path.join('.') : path;
		const is_int = _.get(item, ['is_int']);
		return {
			[key]: is_int ? _.toInteger(_.get(obj, current_path)) : _.get(obj, current_path)
		};
	});
	return Object.assign({}, ...data);
};


module.exports = _filter;
