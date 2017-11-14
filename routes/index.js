//pull in express
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
// const Company = require('../models/company');

//Connect to mongoDB
mongoose.connect('mongodb://testy:testy@ds239965.mlab.com:39965/companies');
const db = mongoose.connection;

//Create Schema for the application to interact with MongoDB
const ProfileSchema = mongoose.Schema ({
    logo: String,
    employees: Number,
    overview: String
});

/*  MOVED TO COMPANY.JS under ../models */



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

//bodyparser middleware for reading form submission
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//declare router as variable for index view
const index   = express.Router();


const hunterKey = '&api_key=223cc5a374942eae989483dc45366dca0f794fef';
const hunterUrl = `https://api.hunter.io/v2/domain-search?domain=`;


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
      name: comp.organization,
      email: em,
      confidence: c
    });
  
    // return the Promise so we can know when the company has been saved
    return company.save((err, data) => {
      if (err) throw err;
      return data;
    });
  
    // shorter, if dont want to modify data or handle err here
    // return company.save();
  }

  function searchHunter(searchVal) {
    var CompanyData;
    // return the Promise, so we can know when it has finished
    return axios.get(hunterUrl + searchVal + hunterKey)
    .then(function (response) {
      return outputHunter(response.data.data);
    })
    .catch(function (error) {
      console.error(error); throw error;
    });
  }

//use declare router for http methods
//get request for index with request, response, next params
//index.get('/', ensureAuthenticated, function (req, res) {
index.get('/', function (req, res) {
    //render response  from server using index view from declared path in app.js
    res.render('home', {
        title: "Networkerr",
        body:
            {
                description: 'The Place to Network',
            }
    });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


var profile = {};
function getFullContact(fullContactUrl, fullContactKey, domain){
    return axios.get(fullContactUrl + domain + fullContactKey)
    .then(function (response) {
        if (response.data.status === 200) {
            let res = response.data;
            profile = {
                logo : res.logo,
                employees: res.organization.approxEmployees,
                overview: res.organization.overview,
                phone: res.organization.contactInfo.phoneNumbers[0].number,
                address: {
                    street: res.organization.contactInfo.addresses[0].addressLine1,
                    city: res.organization.contactInfo.addresses[0].locality,
                    region: res.organization.contactInfo.addresses[0].region.code
                },
                keywords: res.organization.keywords,
                social: [res.socialProfiles]
            }
            return profile;
        } else {
            profile = null;
            return profile;
        }
        
    })
    .catch(function (error) {
      console.error(error); throw error;
      profile = null;
      return profile;
    });
}
index.get('/company/:id', (req, res) => {
    Company.findById(req.params.id) // <== Specify id here
    .then((doc) => {
        const fullContactKey = `&apiKey=3a37eb6865a25421`
        const fullContactUrl = 'https://api.fullcontact.com/v2/company/lookup?domain=';
        getFullContact(fullContactUrl, fullContactKey, doc.domain).then(function(response) {
            // profile = {
            //     logo: 'https://d2ojpxxtu63wzl.cloudfront.net/static/bcf15f0c68537ba4a6c4dccda0377da0_a88fa4a36641d871be09cbd1a5368bf261ac2f1525f9e2d0c2472724e6c525ab',
            //     employees: '500',
            //     overview: 'Stripe.com was founded by two brilliant brothers, Patrick and John Collison (Born 1988 & 1990). Their business policies are a copy book study in why we should let kids grow up before giving them the keys to our livelihoods. Stripe.com has demonstrated institutional callous disregard to the welfare of others, as well as a myriad of other traits described in the DSM-V diagnosis criteria for narcissistic or anti-social personality disorders. An investigation into stripe.com, by licensed private investigator, has revealed that Stripe.com arbitrarily terminates processing accounts for legitimate and ethical businesses, even those that have had no charge-backs in their merchant history. Furthermore, and most disturbing, is the fact that Stripe.com staff arbitrarily decide to hold the funds are being collected on behalf of their clients for at least 90 days, and offer no explanation for this decision. Consequently, numerous businesses have been brought to their knees. Some of the small and medium businesses have begged stripe.com staff to pick up the telephone and talk to them one-on-one in hope of obtaining an explanation for the termination of the merchant account. One customer who had to have staff listen to more than 4000 recorded phone calls with clients in order to recover the credit card details, and subsequently reenter those details into the new processor off the stripe "nuked them".'
            // }
            profile = response;

            res.render('company', {company: doc, profile: profile})
        })
      
        
      
    });
  });

  index.post('/submit', urlencodedParser, (req, res, next) => {
    // console.log(req.body);
    searchHunter(req.body.domain)
    .then(data => {
      // here the Promise is resolved and the doc has been fetched and saved
      console.log('doc fetched and saved');
      console.log(data._id)
      res.redirect('/company/' + data._id);
    });
    console.log('fired but not fetched and saved');
  });


module.exports = index;