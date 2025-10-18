const product = require('./product');
const chat = require('./chat');
const message = require('./message');
const user = require('./user');
const visitors = require('./visitors');
const followers_model = require('./followers');

module.exports = {
	'product_model':product,
	'chat_model':chat,
	'followers_model': followers_model,
	'message_model':message,
	'user_model':user,
	'visitors_model':visitors
};
