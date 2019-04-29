const Cart = require('../models/cart');
const Product = require('../models/product');
exports.get_cart = function(req, res, next) {
    Cart.findOne({owner: req.user._id})
        .populate('items.item')
        .exec((err, foundCart) => {
            if (err) return next(err);

            res.render('cart/cart', {
                foundCart: foundCart,
                message: req.flash('remove')
            });
        });
}
exports.add = function(req, res, next) {
    Cart.findOne({owner: req.user._id}, function(err, cart) {
        Product.findOne({_id: req.body.product_id}, function(err, product){


        console.log(product)
        if (cart == null){
          cart = Cart({owner: req.user._id})
        }
        item_options = []
        for (var key in req.body.item_options) {
           item_options.push({id: key, value: req.body.item_options[key]})
        }
        priceValue = product.price * parseInt(req.body.quantity)
        cart.items.push({
            item: req.body.product_id,
            price: priceValue,
            quantity: parseInt(req.body.quantity),
            item_options: item_options
        });
        cart.total = (cart.total + priceValue).toFixed(2);
        cart.save(function(err) {
            if (err) {
              console.log(err)
              return next(err);
            }
            return res.redirect('/cart');
        })
    });
   });
}

exports.remove = function(req, res, next) {
    Cart.findOne({owner: req.user._id}, (err, foundCart) => {
        foundCart.items.pull(String(req.body.item));

        foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);

        foundCart.save((err, found) => {
            if (err) return next(err);

            req.flash('remove', 'Successfully removed the product');
            res.redirect('/cart');
        });
    });
}