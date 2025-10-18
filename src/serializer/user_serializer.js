const _ = require('lodash');
const passwordHash = require('password-hash');

const user_serializer = (data) => {
	const description = _.get(data, ['description']);
	const full_name = _.get(data, ['full_name']);
	const emails = _.get(data, ['emails']);
	const brand = _.get(data, ['data', 'brand']);
	const direction = _.get(data, ['data', 'direction']);
	const face = _.get(data, ['face']);
	const phones = _.get(data, ['phones']);
	const user_name = _.get(data, ['login', 'user_name']);
	const password = _.get(data, ['login', 'password']);
	const hash_password = passwordHash.generate(password);
	const facebook = _.get(data, ['facebook']);
	const twitter = _.get(data, ['twitter']);
	const telegram = _.get(data, ['telegram']);
	const instagram = _.get(data, ['instagram']);
	const image = _.get(data, ['image']);
	if (face === 'legal') {
		return {
			full_name,
			image,
			emails,
			face,
			phones,
			data:{
				brand,
				direction
			},
			info:description,
			login:{
				user_name,
				password:hash_password
			},
			social_accounts:{
				facebook,
				instagram,
				twitter,
				telegram
			}
		};
	}
	return {
		full_name,
		image,
		info:description,
		emails,
		face,
		phones,
		login:{
			user_name,
			password:hash_password
		},
		social_accounts:{
			facebook,
			instagram,
			twitter,
			telegram
		}
	};
};

const user_update_serializer = (data, token_data) => {
	const password_hash = _.get(data, ['password']) || _.get(token_data, ['password']);
	const password = _.get(data, ['password']) ? passwordHash.generate(_.get(data, ['password'])) : password_hash;
	const description = _.get(data, ['description']);
	const full_name = _.get(data, ['full_name']);
	const emails = _.get(data, ['emails']);
	const brand = _.get(data, ['data', 'brand']);
	const direction = _.get(data, ['data', 'direction']);
	const face = _.get(data, ['face']);
	const phones = _.get(data, ['phones']);
	const user_name = _.get(data, ['user_name']);
	const facebook = _.get(data, ['facebook']);
	const twitter = _.get(data, ['twitter']);
	const telegram = _.get(data, ['telegram']);
	const instagram = _.get(data, ['instagram']);
	const image = _.get(data, ['image']);
	if (face === 'legal') {
		return {
			full_name,
			image,
			emails,
			face,
			completed:true,
			phones,
			data:{
				brand,
				direction
			},
			info:description,
			login:{
				user_name,
				password
			},
			social_accounts:{
				facebook,
				instagram,
				twitter,
				telegram
			}
		};
	}
	return {
		full_name,
		image,
		info:description,
		completed:true,
		emails,
		face,
		phones,
		login:{
			user_name,
			password
		},
		social_accounts:{
			facebook,
			instagram,
			twitter,
			telegram
		}
	};
};

module.exports = {
	user_serializer,
	user_update_serializer
};
