const Cryptr = require('cryptr');

const cryptr = new Cryptr(process.env.CHAT_SECRET);

module.exports = (data) => ({
	encrypt:() => {
		return cryptr.encrypt(data);
	},
	decrypt:() => {
		return cryptr.decrypt(data);
	}
});
