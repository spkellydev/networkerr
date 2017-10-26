const mongoose = require('mongoose');

//Create Schema for the application to interact with MongoDB

const jobs = mongoose.Schema({
	title:{
		type: String
	},
	industry:{
		type: String
	},
	description:{
		type: String
	},
	company:{
		type: String
	},
	create_date:{
		type: Date,
		default: Date.now
	}
});

var Job = module.exports = mongoose.model('Job', jobs);