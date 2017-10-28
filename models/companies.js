const mongoose = require('mongoose');

//Create Schema for the application to interact with MongoDB

const companies = mongoose.Schema({
	domain:{
		type: String
	},
	email:{
		type: String
	},
	confidence: {
		type: Number
	},
	sources: {
		type: [String]
	},
	position: {
		type: String
	},
	linkedIn: {
		type: String
	},
	twitter: {
		type: String
	},
	create_date:{
		type: Date,
		default: Date.now
	}
});

var Company = module.exports = mongoose.model('Company', companies);