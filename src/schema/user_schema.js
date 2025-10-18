const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrementFactory = require('mongoose-sequence');

const User_schema = new Schema({
	full_name:{
		type:String,
		required:true
	},
	face:{
		type:String,
		required:true
	},
	phone_number:{
		type:String
	},
	address:{ type:String, default:null },
	completed:{ type:Boolean, default:false },
	data:{
		brand:{ type:String, default:null },
		direction:{ type:Number, default:null }
	},
	info:{
		type:String,
		default:null
	},
	image:{
		type:Object,
		default:{
			src:'https://joeschmoe.io/api/v1/random',
			file_name:'joeschmoe.png',
			name:'joeschmoe'
		}
	},
	social_accounts:{
		type:Object,
		default:{},
		instagram:{
			type:String
		},
		telegram:{
			type:String
		},
		facebook:{
			type:String
		},
		twitter:{
			type:String
		}
	},
	login:{
		user_name:{
			type:String,
			required:true,
			unique:true
		},
		password:{
			type:String,
			required:true
		}
	},
	phones:{
		type:Array,
		default:[]
	},
	emails:{
		type:Array,
		default:[]
	},
	social_links:{ type:Object },
	settings:{ type:Object }
}, { collection:'users' });

User_schema.plugin(AutoIncrementFactory(mongoose.connection), { inc_field:'user_id' });
module.exports = User_schema;
