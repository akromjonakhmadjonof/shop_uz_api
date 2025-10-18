const mongoose = require('mongoose');
const MONGO_CLIENT_URL = 'mongodb://localhost:27017/shop_uz';

// Database connection
function connect_to_db () {
	mongoose.connect(MONGO_CLIENT_URL, {
		useNewUrlParser:true
	});

	mongoose.connection.once('open', function () {
		console.log('                                                       \n');
		console.log('========================================================\n');
		console.log('============== Mongo Successful connected ==============\n');
		console.log('========================================================\n');
	}).on('error', function () {
		console.log('                                                       \n');
		console.log('=======================================================\n');
		console.log('============== Mongo connection rejected ==============\n');
		console.log('=======================================================\n');
	});
}

module.exports = connect_to_db;
