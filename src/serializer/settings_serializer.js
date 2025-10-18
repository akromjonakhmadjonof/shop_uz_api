const _ = require('lodash');
const passwordHash = require('password-hash');

const settings_serializer = (data) => {
	// Data
	const type = _.get(data, ['type']);
	const user_name = _.get(data, ['user_name']);
	const full_name = _.get(data, ['full_name']);
	const email = _.get(data, ['email']);
	const password = _.get(data, ['password']);
	const address = _.get(data, ['address']);
	const phone_number = _.get(data, ['phone_number']);
	// Return
	if (type === 'account_information') {
		return {
			'login.user_name':user_name,
			full_name:full_name,
			email:email
		};
	} else if (type === 'change_password') {
		const hash_password = passwordHash.generate(password);
		return {
			'login.password':hash_password
		};
	} else if (type === 'contact_settings') {
		return {
			'data.address':address,
			phone_number:phone_number
		};
	}
	return {};
};

module.exports = settings_serializer;
