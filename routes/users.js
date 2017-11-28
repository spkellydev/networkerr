var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

router.get('/:username', function (req, res) {
	User.getUserByUsername(req.params.username, function(err, foundUser) {
		if(err) {
			req.flash('error', 'no user');
			res.redirect('/');
		}
		res.render('profilePublic', {
			title: 'User Profile',
			body: {
				description: 'From here you can control all of your settings'
			},
			User: foundUser
		})
	})
})

router.get('/profile/:id', function (req, res) {
	User.findById(req.params.id, function(err, foundUser) {
		if(err) {
			req.flash('error', 'no user');
			res.redirect('/');
		}
		res.render('profile', {
			title: 'User Profile',
			body: {
				description: 'From here you can control all of your settings'
			},
			User: foundUser
		})
	})
})

router.post('/profile/:id', function (req, res) {
	User.findById(req.params.id, function(err, foundUser) {
		var name = req.body.name;
		var email = req.body.email;
		var username = req.body.username;
		var avatar = req.body.avatar;
	
		// Validation
		req.checkBody('name', 'Name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('username', 'Username is required').notEmpty();

	
		var errors = req.validationErrors();
		if(err) {
			req.flash('error', 'no user');
			res.redirect('/');
		} else {
			foundUser.name = name;
			foundUser.username = username;
			foundUser.email = email;
			foundUser.avatar = avatar;

			foundUser.save(function(err, updatedUser){
				if (err) {
					req.flash('error', 'no user');
					console.log(err)
				} else {
					req.flash('success_msg', 'You updated your account');
					res.redirect(req.originalUrl);
					
				}
			})
		}
	})
})

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'This user could not be found! Try again!'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});




module.exports = router;