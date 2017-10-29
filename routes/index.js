//pull in express
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose')

//Connect to mongoDB
mongoose.connect('mongodb://testy:testy@ds239965.mlab.com:39965/companies');
const db = mongoose.connection;

//Create Schema for the application to interact with MongoDB
const companySchema = mongoose.Schema({
	domain:{
		type: String
	},
	email:{
        type: [String]
	},
	confidence: {
		type: [Number]
	},
	create_date:{
		type: Date,
		default: Date.now
	}
}, {collection: 'companies'});

const Company = mongoose.model('Company', companySchema);

//bodyparser middleware for reading form submission
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//declare router as variable for index view
const index   = express.Router();


const hunterKey = '&api_key=223cc5a374942eae989483dc45366dca0f794fef';
const hunterUrl = `https://api.hunter.io/v2/domain-search?domain=`;

const fullContactKey = `&apiKey=9a2268a7f55aff6f`
const fullContactUrl = 'https://api.fullcontact.com/v2/company/lookup?domain=';


function outputHunter(response, res) {
    let comp = response;
    let em = [];
    let c = [];
  
    for (var i = 0; i < comp.emails.length; i++) {
      //email arrays
      // console.log(comp.emails[i].value);
      em[i] = comp.emails[i].value;
      c[i] = comp.emails[i].confidence;
    }
  
    var company = new Company({
      domain: comp.domain,
      email: em,
      confidence: c
    });
  
    // return the Promise so we can know when the company has been saved
    return company.save((err, data) => {
      if (err) throw err;
      return data;
    });
  
    // shorter, if you dont want to modify data or handle err here
    // return company.save();
  }

  function searchHunter(searchVal, res) {
    var CompanyData;
    // return the Promise, so we can know when it has finished
    return axios.get(hunterUrl + searchVal + hunterKey)
    .then(function (response) {
      response = outputHunter(response.data.data, res);
      CompanyData = response;
    })
    .catch(function (error) {
      console.error(error); throw error;
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
            }
    });
});

index.get('/:id', (req, res) => {
    CompanyData.findById(req.params.id) // <== Specify your id here
    .then((doc) => {
      res.render('company', {company: doc})
    });
  });

  index.post('/submit', urlencodedParser, (req, res, next) => {
    // console.log(req.body);
    searchHunter(req.body.domain)
    .then(data => {
      // here the Promise is resolved and the doc has been fetched and saved
      console.log('doc fetched and saved');
      console.log(data)
      res.redirect('/' + data.id, {company: data});
    });
    console.log('fired but not fetched and saved');
  });



module.exports = index;