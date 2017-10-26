const express = require('express');
const app = express();
const path = require('path');
var hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

//Connect to mongoDB
mongoose.connect('mongodb://localhost/networkerr');
const db = mongoose.connection;

//Handlebars engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs({helpers: {
    toJSON : function(object) {
    return JSON.stringify(object);
    }
   }}));
app.engine('handlebars', hbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

//Get static assets
app.use(express.static(__dirname + '/assets'));

const index = require('./routes/index');
app.use('/', index);

//error function from express website, not working ironically
app.use(function(err, req, res, next) {
	res.status(err.status || 500 );
	res.render('error', {
		message: err.message,
		error: err
	})
});

app.listen(3000, console.log('running on port 3000'));
