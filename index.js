const express = require('express');
const app = express();
const path = require('path');
let hbs = require('express-handlebars');
const bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressValidator = require('express-validator');
let flash = require('connect-flash');
let session = require('express-session');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let mongo = require('mongodb');
let mongoose = require('mongoose');
let PORT = process.env.PORT || 3000;
let users = require('./routes/users');
//Get static assets
app.use('/static', express.static(__dirname + '/assets'));
app.set('views', path.join(__dirname, 'views'));

//bodyparser middleware for reading form submission
let urlencodedParser = bodyParser.urlencoded({ extended: false })
// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


//Handlebars engine
app.engine('handlebars', hbs({
	defaultLayout: 'main', 
	helpers: {
	  JSON : function(object) {
		return JSON.stringify(object);
	  }
	}
  }));

app.set('view engine', 'handlebars');

// Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
			var namespace = param.split('.')
			, root    = namespace.shift()
			, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});


const index = require('./routes/index');
app.use('/', index);
const company = require('./routes/company');
app.use('/company', company);
app.use('/users', users);

app.use(function(err, req, res, next) {
	res.status(err.status || 500 );
	res.render('error', {
		message: err.message,
		error: err
	})
});

app.listen(PORT, console.log('running on port 3000'));
