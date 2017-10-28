//pull in express
const express = require('express');
const axious = require('axios');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose')

//Connect to mongoDB
mongoose.connect('mongodb://test:test@ds239965.mlab.com:39965/companies');
const db = mongoose.connection;

//Create Schema for the application to interact with MongoDB
const companySchema = mongoose.Schema({
	domain:{
		type: String
	},
	email:{
		type: String
	},
	confidence: {
		type: Number
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

const Company = mongoose.model('Company', companySchema);

//bodyparser middleware for reading form submission
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//declare router as variable for index view
const index   = express.Router();


const hunterKey = '&api_key=8bd4aaded349a5d9784d021c2767e5d23e66140f';
const hunterUrl = `https://api.hunter.io/v2/domain-search?domain=`;

const fullContactKey = `&apiKey=f71cc6c7ccaa28f1`
const fullContactUrl = 'https://api.fullcontact.com/v2/company/lookup?domain=';


function outputHunter(response, res) {
    let comp = response;
    
    console.log(comp.value);
    //must loop through emails.length and store each entry into db
    console.log(comp.emails);
    
    var data = new Company();
    data.domain = comp.domain;
    data.email = comp.emails.value;
    data.confidence = comp.emails.confidence;
    data.position = comp.emails.position;
    data.linkedIn = comp.emails.linkedIn;
    data.twitter = comp.emails.twitter;

    console.log(data);



    var newCompany = Company(comp).save((err, data) => {
        if (err) throw err;
        //jsonify the Company data
        // res.json(data);
    });
}

function searchHunter(searchVal, res) {
    axios.get(hunterUrl + searchVal + hunterKey)
    .then(function (response) {
        outputHunter(response.data.data, res);
    })
    .catch(function (error) {
        console.log(error);
    });
}

//use declare router for http methods
//get request for index with request, response, next params
index.get('/', function (req, res) {
    //render response  from server using index view from declared path in app.js
    res.render('home', {
        title: "Networkerr home",
        body:
            {
                description: 'The Place to Network',
            },
        hunter:
            {
                key: hunterKey,
                url: hunterUrl
            },
        fullContact: 
            {
                key: fullContactKey,
                url: fullContactUrl
            }
    });
});

index.post('/', urlencodedParser, (req, res) => {
    console.log(req.body);
    searchHunter(req.body.domain, res)
});

module.exports = index;