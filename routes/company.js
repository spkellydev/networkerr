//pull in express
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose')

//Connect to mongoDB
mongoose.connect('mongodb://heroks:seankelly@ds125618.mlab.com:25618/heroku_nzn8tvtz');
const db = mongoose.connection;



//bodyparser middleware for reading form submission
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//declare router as variable for index view
const company   = express.Router();


const fullContactKey = `&apiKey=9a2268a7f55aff6f`
const fullContactUrl = 'https://api.fullcontact.com/v2/company/lookup?domain=';

function getFullContact(fullContactUrl, fullContactKey) {
    
}

company.get('/', function (req, res) {
    //render response  from server using home view from declared path in app.js
    res.render('home', {
        title: "Company Profile",
        body:
            {
                description: 'Company Profiler',
            }
    });
});







module.exports = company;