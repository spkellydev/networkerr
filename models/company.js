const mongoose = require('mongoose');

//Create Schema for the application to interact with MongoDB
const ProfileSchema = mongoose.Schema ({
    logo: String,
    employees: Number,
    overview: String
});

const companySchema = mongoose.Schema({
	domain:{
		type: String
    },
    name: {
        type: String
    },
	email:{
        type: [String]
	},
	confidence: {
		type: [Number]
    },
    profile: [ProfileSchema],
	create_date:{
		type: Date,
		default: Date.now
	}
}, {collection: 'companies'});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;