const _ = require('lodash');
const locales = require('./index');
const sprintf = require('sprintf');

function translate (key, locale) {
	return _.get(locales, [key, locale]) || _.get(locales, [key, 'ru']);
}

module.exports._translate = (locale) => {
	function t (key, params) {
		return sprintf(translate(key, locale), params);
	}
	return {
		t
	};
}
