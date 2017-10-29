const express = require('express');
const app = express();
const path = require('path');
var hbs = require('express-handlebars');
const bodyParser = require('body-parser');


//Get static assets
app.use('/static', express.static(__dirname + '/assets'));
app.set('views', path.join(__dirname, 'views'));

//bodyparser middleware for reading form submission
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Handlebars engine
app.engine('handlebars', hbs({helpers: {
    toJSON : function(object) {
    	return JSON.stringify(object);
    }
   }}));

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


const index = require('./routes/index');
app.use('/', index);
const company = require('./routes/company');
app.use('/company', company);

app.use(function(err, req, res, next) {
	res.status(err.status || 500 );
	res.render('error', {
		message: err.message,
		error: err
	})
});

app.listen(8000, console.log('running on port 3000'));
