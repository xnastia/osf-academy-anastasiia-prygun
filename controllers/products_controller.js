const Cart = require('../models/cart');
const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');

exports.get_product = function(req, res, next) {
    Product.findOne({id: req.params.id}, function(err, product) {
        if (err) return next(err);
        category  = Category.findCategoryById(res.locals.categories, product.primary_category_id)
        res.render('products/show', {
            product: product,
            selected_category: category,
            parent_category: category.parent_category
        });
    });
}

exports.products_by_category = function(req, res, next) {
    var id = req.params.id
    category = Category.findCategoryById(res.locals.categories, id)
      Product.find({primary_category_id: req.params.id}, function(err, products) {
        res.render('products/index', {
            products: products,
            parent_category: category.parent_category,
            selected_category: category,
        });
    });
}

exports.search = function(req, res, next) {
    if (req.query.q) {
        var q = req.query.q
        Product.find({ $text: { $search: q } }, function(err, products){
            if(err) {
                console.log(err);
            return;
        }
        res.render('products/index', {
            products: products,
            query: req.query.q,
            parent_category: null,
            selected_category: null,
        });
        });
    }
}