const moment = require('moment');

const generate_product_code = () => {
	const today = moment();

	function getRndInteger (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const randomNumber = getRndInteger(1, 9);
	const randomTwoNumber = Math.floor(Math.random() * 10);
	const randomThreeNumber = Math.floor(Math.random() * 10);
	const hour = today.format('HH');
	const minutes = today.format('mm');
	const seconds = today.format('ss');
	const day = today.format('DD');
	const month = today.format('MM');
	return `${randomNumber}${randomTwoNumber}${hour}${minutes}${seconds}${day}${month}${randomThreeNumber}`;
};

module.exports = generate_product_code;
