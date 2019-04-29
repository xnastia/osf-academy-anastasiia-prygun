const mongoose = require('mongoose')
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;
ObjectId = Schema.Types;

const ProductSchema = new Schema({
    id:   String,
    name: String,
    price: Number,
    image: String,
    short_description: String,
    long_description: String,
    primary_category_id: String,
    variation_attributes: [{
      id: String,
      name: String,
      values: [ {value: String, name: String}]
    }],
    image_groups: [
      {
        view_type: String,
        images: [
          {
            link: String
          }
        ]
      }
    ]
});

ProductSchema.methods.small_image_url = function() {
    small_images = this.image_groups.filter(function(image_group){ return image_group.view_type == 'small' });
    return small_images[0].images[0].link
};
ProductSchema.methods.large_image_urls = function() {
    large_images = this.image_groups.filter(function(image_group){ return image_group.view_type == 'large' });
    var res = []
    for (var i =0; i<large_images.length; i++){
      for (var j =0; j<large_images[i].images.length; j++){
        res.push(large_images[i].images[j].link)
      }
    }
    return res
};

module.exports = mongoose.model('Product', ProductSchema, "Products");