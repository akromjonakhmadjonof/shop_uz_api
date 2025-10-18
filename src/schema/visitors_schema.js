const { Schema } = require('mongoose');

module.exports = new Schema({
	'count':{ 'type':Number },
	'id':{ 'type':String }
}, { 'collection':'visitors' });
