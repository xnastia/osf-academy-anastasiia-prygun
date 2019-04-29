const sgMail = require('@sendgrid/mail');
const passport = require('passport');
const async = require('async');
const crypto = require('crypto');
const Cart = require('../models/cart');
const User = require('../models/user');

exports.get_login = function(req, res){
    if (req.user) return res.redirect('/');
    res.render('accounts/login', {message: req.flash('loginMessage')});
}

exports.get_profile = function(req, res, next) {
    User.findOne({_id: req.user._id})
        .populate('history.item')
        .populate('wishes')
        .exec((err, foundUser) => {
            if (err) return next(err);
            res.render('accounts/profile', {user: foundUser});
        });
}

exports.get_signup = function(req, res, next){
    res.render('accounts/signup', {
        errors: req.flash('errors')
    });
}

exports.post_signup = function(req, res, next){
    // executes array of functions in series, passing result of previous function to the next
    async.waterfall([
        // function 1
        function(callback) {
            // create new user model
            let user = new User();
            // populate the user properties based on what the user submitted
            user.profile.name = req.body.name;
            user.name = req.body.name;
            user.password = req.body.password;
            user.email = req.body.email;

            // check submitted email against the database
            User.findOne({email: req.body.email}, function(err, existingUser) {
                // does the user already exist?
                if (existingUser) {
                    // return an error message to indicate user already exists
                    req.flash('errors', 'Account with that email address already exists');
                    // redirect the user back to signup page with the error
                    return res.redirect('/signup')
                } else {
                    // save the user to the database if there is no error
                    user.save(function(err, user) {
                        // oops error might occur
                        if (err) return next(err);
                        // success set user to the callback
                        callback(null, user);
                    });
                }
            });
        },
        // function 2 - receives result of function 1, see line 83 above
        function(user) {
            // create a new cart model
            const cart = new Cart();
            // set cart owner as the current user
            cart.owner = user._id;
            // save cart to mongo
            cart.save(function(err) {
                // oops error might occur
                if (err) return next(err);
                // log user in
                req.logIn(user, (err) => {
                    // error occurred
                    if (err) return next(err);
                    // sucess, redirect user to their profile page
                    res.redirect('/profile');
                });
            });
        }
    ]);
}

exports.logout = function(req, res, next){
    req.logout();
    return res.redirect('/');
}

exports.get_edit_profile = function(req, res, next) {
    // load the edit profile view
    res.render('accounts/edit-profile', {message: req.flash('success')});
}
exports.post_edit_profile = function(req, res, next) {
    // check submitted user id against the database
    User.findOne({_id: req.user._id}, (err, user) => {
        // error occurred
        if (err) return next(err);
        // success - update user's name
        if (req.body.name) user.profile.name = req.body.name;
        // update user address
        if (req.body.address) user.address = req.body.address;
        if (req.body.currency) user.currency = req.body.currency;
        // save the newly updated user details
        user.save((err) => {
            // oops error might occur
            if (err) return next(err);
            // success - render success notification
            req.flash('success', 'You have successfully edited your profile information');
            // redirect user to the edit profile view
            return res.redirect('/edit-profile');
        });
    });
}

exports.get_forgot = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('accounts/forgot', {message: req.flash('error')});
}

exports.post_forgot = function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      const mailOptions = {
        to: user.email,
        from: 'noreply@koalastore.com',
        subject: 'Change Password',
        text: 'This email allows you to change your password.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      sgMail.setApiKey('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')
      sgMail.send(mailOptions, function(error, result) {
        if (error) {
          console.log(error)
        }
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with a link to change the password.');
          res.redirect('/');
      })
    }
  ]);
}

exports.get_reset = function (req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('accounts/reset', {
      user: req.user,
      token: req.params.token,
      message: req.flash('error')
    });
  });
}

exports.post_reset = function (req, res) {
  async.waterfall([
    function (done) {

      User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function (err) {
          req.logIn(user, function (err) {
            done(err, user);
          });
        });
      });
    }
  ], function (err) {
    res.redirect('/login');
  });
}


