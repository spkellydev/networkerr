const express = require('express');
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