const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  id: String,
  name: String,
  page_description: String,
  image: String,
  categories: [this]
});

CategorySchema.statics.flattenCategories = function(categories, res, parent_category){
    for(var i=0; i<categories.length; i++){
      category = categories[i]
      category.parent_category = parent_category;
      res.push(category);
      if (categories[i].categories && categories[i].categories.length > 0){
        this.flattenCategories(categories[i].categories, res, {id: category.id, name: category.name})
      }
    }
    return res
}

CategorySchema.statics.findCategoryById = function(root_categories, id){
    flattened_categories =  Category.flattenCategories(root_categories, [], null)
    cat = flattened_categories.filter(function(category){ return category.id == id })[0]
    return cat
}

CategorySchema.statics.searchFlattened = function(id, callback){
    Category.find({}, function(err, root_categories){
      flattened_categories =  Category.flattenCategories(root_categories, [], null)
      cat = flattened_categories.filter(function(category){ return category.id == id })[0]
      callback(cat)
    });
}

Category = mongoose.model('Category', CategorySchema, 'Categories');

module.exports = Category