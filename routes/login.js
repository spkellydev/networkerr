var express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')

//Connect to mongoDB
mongoose.connect('mongodb://testy:testy@ds239965.mlab.com:39965/companies');
const db = mongoose.connection;

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const login   = express.Router();

login.get('/', function (req, res) {
    //render response  from server using home view from declared path in app.js
    res.render('login', {
        title: "Sign In",
        body:
            {
                description: 'Sign in Here and Network',
            }
    });
});


module.exports = login;