const stripe = require('stripe')('sk_test_eqguJcLRm2qKKR4kxl8LfOd200BpERYu80');
const async = require('async');
const User = require('../models/user');
const Cart = require('../models/cart');

exports.currency = function(req, res, next) {
    req.session.currency = req.body.currency;
    backURL=req.header('Referer') || '/';
    res.redirect(backURL);
}

exports.payment = function(req, res, next) {
    let stripeToken = req.body.stripeToken;
    let currentCharges = Math.round(req.body.stripeMoney * 100);
    stripe.setTimeout(20000);
    stripe.customers.create({
        source: stripeToken
    }).then(function(customer) {
        return stripe.charges.create({
            amount: currentCharges,
            currency: 'usd',
            customer: customer.id
        });
    }).then(function(charge){
        async.waterfall([
            function(callback){
                Cart.findOne({owner: req.user._id}, function(err, cart) {
                    callback(err, cart);
                });
            },
            function(cart, callback) {
                User.findOne({_id: req.user._id}, function(err, user) {
                    if (user) {
                        for (let i = 0; i < cart.items.length; i++) {
                            user.history.push({
                                item: cart.items[i].item,
                                paid: cart.items[i].price
                            });
                        }
                        user.save(function(err, user) {
                            if (err) return next(err);
                            callback(err, user);
                        });
                    }
                });

            },
            function(user) {
                Cart.update({owner: user._id}, {$set: {items: [], total: 0}}, function(err, updated) {
                    if (updated) {
                        res.redirect('/profile');
                    }
                });
            }]);
    });
}