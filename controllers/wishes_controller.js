const Product = require('../models/product');
const User = require('../models/user');

exports.wishlist = function(req, res, next) {
  product_id = req.body.product_id;
  User.findOne({_id: req.user._id}, function(err, user) {
      Product.findOne({id: product_id}, function(err, product) {
        if (err) return next(err);

        if (user.wishes && user.wishes.some(wish => wish._id.equals(product._id))){
            user.wishes.remove(product._id);
        }
        else{
          user.wishes.push(product);
        }

        user.save(function(err, user) {
          backURL=req.header('Referer') || '/';
          res.redirect(backURL);
          });
        });
  });
}

exports.get_wishes = function(req, res, next) {
    User.findOne({_id: req.user._id})
    .populate('wishes')
    .exec((err, user) => {
        if (err) return next(err);
        res.render('wishes/index', {wishes: user.wishes});
    });
}
