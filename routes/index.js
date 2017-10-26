//pull in express
const express = require('express');

//declare router as variable for index view
const index   = express.Router();


const hunterKey = '&api_key=8bd4aaded349a5d9784d021c2767e5d23e66140f';
const hunterUrl = `https://api.hunter.io/v2/domain-search?domain=`;

const fullContactKey = `&apiKey=f71cc6c7ccaa28f1`
const fullContactUrl = 'https://api.fullcontact.com/v2/company/lookup?domain=';


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

module.exports = index;