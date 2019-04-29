const Category = require('../models/category');

exports.get_categories = function(req, res){
  res.render("categories/index",{
      title : "Categories",
      items : res.locals.categories
  })
}

exports.get_sub_categories = function(req, res){
    var id = req.params.id;
    category = Category.findCategoryById(res.locals.categories, id)
    res.render("categories/index",{
        title : "Subcategories",
        items : [category]
    })
}