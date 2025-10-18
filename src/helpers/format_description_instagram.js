const _ = require('lodash');
module.exports.format_description_instagram = (data) => {
	const description = _.get(data, ['product', 'description']);
	const product_type = _.get(data, ['parent', 'label']);
	const author_full_name = _.get(data, ['author', 'full_name']);
	const author_phone = _.get(data, ['author', 'phones', '0']);
	const pricing_sell_price = _.get(data, ['pricing', 'sell_price']);
	const currency_symbol = _.get(data, ['currency', 'symbol']);
	const product_name = _.get(data, ['product', 'name']);
	const tags  = _.map(_.get(data, ['tags']), (item) => `#${item}`)
	const user_instagram = _.get(data, ['author', 'social_accounts', 'instagram'])
	return `@ecommerce_shop_uz совместно @${user_instagram}\n\n` +
		`📦 Товар: ${product_name}\n\n` +
		`💵 Цена: ${pricing_sell_price} ${currency_symbol}\n\n` +
		`📲 Номер телефона: ${author_phone}\n\n` +
		`👥 Контактное лицо: ${author_full_name}\n\n` +
		`🔀 Тип продукта: ${product_type}\n\n` +
		`📰 Описание: ${description}\n\n` +
		`${tags}`
};
